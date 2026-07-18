import * as admin from 'firebase-admin';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { onCall } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import * as nodemailer from 'nodemailer';

// ─── Initialise ───────────────────────────────────────────────────────────────
admin.initializeApp();

// Secrets — set via: firebase functions:secrets:set EMAIL_USER / EMAIL_PASSWORD
// For Gmail, EMAIL_PASSWORD must be an App Password (not your Google account password).
// Enable it at: myaccount.google.com/apppasswords
const emailUser = defineSecret('EMAIL_USER');
const emailPass = defineSecret('EMAIL_PASSWORD');

// ─── Types ────────────────────────────────────────────────────────────────────
interface RegistrationData {
  name?: string;
  fullName?: string;
  title?: string;
  email?: string;
  institution?: string;
  otherInstitution?: string;
  programme?: string;
  cohort?: string;
  isCsStudent?: string;
  department?: string;
  nationality?: string;
  participationType?: string;
  type?: string;
  attendanceMode?: string;
  mode?: string;
  sessionPreference?: string;
  isSubmittingAbstract?: string;
  paperType?: string;
  thematicAreas?: string[];
  authorNames?: string;
  presentationType?: string;
  presentationTitle?: string;
  payment?: string;
  registeredAt?: string;
  registrationCode?: string;
  emailSent?: boolean;
  emailDeliveryStatus?: string;
  [key: string]: unknown;
}

// ─── Sequential registration codes (DCS-PRC-2026-001, -002, …) ────────────────
// Assigned once per registration via an atomic counter and persisted onto the
// document so it never changes on subsequent writes.
const REGISTRATION_CODE_PREFIX = 'DCS-PRC-2026';

async function getOrAssignRegistrationCode(
  existingCode: string | undefined,
): Promise<string> {
  if (existingCode) return existingCode;
  const counterRef = admin.firestore().doc('counters/registrations');
  return admin.firestore().runTransaction(async (tx) => {
    const counterSnap = await tx.get(counterRef);
    const nextNumber = ((counterSnap.data()?.count as number) || 0) + 1;
    tx.set(counterRef, { count: nextNumber }, { merge: true });
    return `${REGISTRATION_CODE_PREFIX}-${String(nextNumber).padStart(3, '0')}`;
  });
}

// Callable from the registration form BEFORE payment, so the Paystack reference
// and the "Registration ID" shown in the confirmation email are the same value.
// The registration document later reuses this code as-is (see getOrAssignRegistrationCode
// above) instead of minting a new one.
export const reserveRegistrationCode = onCall(
  { region: 'us-central1' },
  async () => {
    const code = await getOrAssignRegistrationCode(undefined);
    return { code };
  },
);

// ─── Cloud Function ───────────────────────────────────────────────────────────
export const sendRegistrationConfirmation = onDocumentWritten(
  {
    document: 'registrations/{registrationId}',
    region: 'us-central1',
    secrets: [emailUser, emailPass],
  },
  async (event) => {
    // onDocumentWritten fires on create, update, and delete.
    // `after` is null on delete — skip those.
    const snap = event.data?.after;
    if (!snap?.exists) return;

    const data = snap.data() as RegistrationData;
    const docRef = snap.ref;
    const registrationId = event.params.registrationId;

    // ── Update session counts in workshop/siteContent ──────────────────────
    // Runs on every create/update so counts stay accurate as registrations change.
    {
      const beforeData =
        event.data?.before?.exists ?
          (event.data.before.data() as RegistrationData)
        : null;
      // Session key format: "27Aug_Morning", "28Aug_Afternoon", etc.
      const beforeKey =
        beforeData && beforeData.attendanceMode !== 'Virtual' ?
          (beforeData.sessionPreference ?? null)
        : null;
      const afterKey =
        data.attendanceMode !== 'Virtual' ?
          (data.sessionPreference ?? null)
        : null;

      if (beforeKey !== afterKey) {
        const updates: Record<string, admin.firestore.FieldValue> = {};
        if (beforeKey)
          updates[`event.sessionCounts.${beforeKey}`] =
            admin.firestore.FieldValue.increment(-1);
        if (afterKey)
          updates[`event.sessionCounts.${afterKey}`] =
            admin.firestore.FieldValue.increment(1);
        const siteRef = admin.firestore().doc('workshop/siteContent');
        await siteRef.update(updates).catch(async () => {
          await siteRef.set({ event: { sessionCounts: {} } }, { merge: true });
          await siteRef.update(updates);
        });
        console.log(
          `[${registrationId}] Session counts updated — ${beforeKey ?? 'none'} → ${afterKey ?? 'none'}`,
        );
      }
    }

    // ── Only send confirmation when payment is confirmed ───────────────────
    if (data.payment !== 'Confirmed') {
      console.log(
        `[${registrationId}] Payment not confirmed (status: ${data.payment ?? 'none'}) — skipping email.`,
      );
      return;
    }

    // ── Deduplication guard ────────────────────────────────────────────────
    // Prevent duplicate sends on retries or repeated updates.
    if (data.emailSent === true || data.emailDeliveryStatus === 'processing') {
      console.log(
        `[${registrationId}] Email already sent or processing — skipping.`,
      );
      return;
    }

    // Validate email address
    const recipientEmail = (data.email || '').trim();
    if (!recipientEmail || !recipientEmail.includes('@')) {
      console.warn(
        `[${registrationId}] No valid email address — aborting email send.`,
      );
      await docRef.update({
        emailSent: false,
        emailSentAt: null,
        emailDeliveryStatus: 'failed',
        emailError: 'No valid email address in registration record',
      });
      return;
    }

    // Assign a sequential registration code the first time this record is processed
    const registrationCode = await getOrAssignRegistrationCode(
      data.registrationCode,
    );

    // Mark as processing immediately so retries skip this record
    await docRef.update({
      emailDeliveryStatus: 'processing',
      registrationCode,
    });

    // ── Build content ──────────────────────────────────────────────────────
    const name = (data.fullName || data.name || 'Participant').trim();
    const institution =
      (data.institution === 'Other (Specify)' ?
        data.otherInstitution
      : data.institution) || '—';
    const programme = data.programme || '—';
    const cohort = data.cohort || '—';
    const nationality = data.nationality || '—';
    const participation = data.participationType || data.type || '—';
    const attendance = data.attendanceMode || data.mode || '—';
    const sessionPref = data.sessionPreference || '';
    const SESSION_LABELS: Record<string, string> = {
      '27Aug_Morning':
        'Wednesday, 27 August — Morning Session (9:00 AM – 1:00 PM)',
      '27Aug_Afternoon':
        'Wednesday, 27 August — Afternoon Session (2:00 PM – 5:00 PM)',
      '28Aug_Morning':
        'Thursday, 28 August — Morning Session (9:00 AM – 1:00 PM)',
      '28Aug_Afternoon':
        'Thursday, 28 August — Afternoon Session (2:00 PM – 5:00 PM)',
      '29Aug_Morning':
        'Friday, 29 August — Morning Session (9:00 AM – 1:00 PM)',
      '29Aug_Afternoon':
        'Friday, 29 August — Afternoon Session (2:00 PM – 5:00 PM)',
    };
    const sessionLabel = SESSION_LABELS[sessionPref] ?? '—';
    const isPresenting = data.isSubmittingAbstract === 'Yes';
    const paperType = isPresenting ? data.paperType || '—' : '—';
    const authorNames = isPresenting ? data.authorNames || '—' : '—';
    const presentationType = isPresenting ? data.presentationType || '—' : '—';
    const paymentStatus = data.payment || 'Pending';
    const registeredAt =
      data.registeredAt ?
        new Date(data.registeredAt).toLocaleString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Africa/Accra',
        }) + ' (GMT+0)'
      : new Date().toLocaleString('en-GB');

    const html = buildEmailHtml({
      name,
      email: recipientEmail,
      registrationCode,
      institution,
      programme,
      cohort,
      nationality,
      participation,
      attendance,
      sessionLabel,
      paperType,
      authorNames,
      presentationType,
      paymentStatus,
      registeredAt,
    });

    // ── Send ───────────────────────────────────────────────────────────────
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser.value(),
        pass: emailPass.value(),
      },
    });

    try {
      await transporter.sendMail({
        from: `"DCS Postgraduate Workshop 2026" <${emailUser.value()}>`,
        to: recipientEmail,
        cc: 'dcsworkshop@ug.edu.gh',
        replyTo: 'dcsworkshop@ug.edu.gh',
        subject:
          'Registration Received – 2nd Annual DCS Postgraduate Workshop 2026',
        html,
      });

      // ── Success metadata ─────────────────────────────────────────────────
      await docRef.update({
        emailSent: true,
        emailSentAt: admin.firestore.FieldValue.serverTimestamp(),
        emailDeliveryStatus: 'delivered',
        emailError: null,
      });

      console.log(
        `[${registrationId}] Confirmation email delivered to ${recipientEmail}`,
      );
    } catch (err) {
      // ── Failure metadata — registration itself is NOT affected ───────────
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error(`[${registrationId}] Email delivery failed:`, errMsg);

      await docRef.update({
        emailSent: false,
        emailSentAt: null,
        emailDeliveryStatus: 'failed',
        emailError: errMsg,
      });

      // Do NOT rethrow — the registration was saved successfully.
      // An email failure must never roll back or block a registration.
    }
  },
);

// ─── Email template ────────────────────────────────────────────────────────────
interface EmailData {
  name: string;
  email: string;
  registrationCode: string;
  institution: string;
  programme: string;
  cohort: string;
  nationality: string;
  participation: string;
  attendance: string;
  sessionLabel: string;
  paperType: string;
  authorNames: string;
  presentationType: string;
  paymentStatus: string;
  registeredAt: string;
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:9px 0;border-bottom:1px solid #eef2f7;
                 color:#888;font-size:13px;width:42%;vertical-align:top;">${label}</td>
      <td style="padding:9px 0;border-bottom:1px solid #eef2f7;
                 color:#1a1a1a;font-size:13px;font-weight:500;
                 vertical-align:top;">${value}</td>
    </tr>`;
}

function buildEmailHtml(d: EmailData): string {
  const isConfirmed = d.paymentStatus === 'Confirmed';
  const statusBadge = `
    <span style="display:inline-block;
                 background:${isConfirmed ? '#d4edda' : '#fdecea'};
                 color:${isConfirmed ? '#155724' : '#c0392b'};
                 padding:2px 10px;border-radius:20px;font-size:12px;
                 font-weight:700;
                 border:1px solid ${isConfirmed ? '#c3e6cb' : '#f5b7b1'};">
      ${d.paymentStatus}
    </span>`;

  const steps = [
    'Your registration is fully confirmed. Keep your confirmation email for your reference to join sessions during the workshop dates (27–29 August 2026).',
    'The full workshop programme, venue details, and daily schedule will be shared closer to the event day.',
  ];

  const stepsHtml = steps
    .map(
      (s, i) => `
    <tr>
      <td style="padding:0 10px 12px 0;color:#C9A84C;font-size:16px;
                 font-weight:700;vertical-align:top;">${i + 1}.</td>
      <td style="padding:0 0 12px;color:#555;font-size:13px;
                 line-height:1.7;vertical-align:top;">${s}</td>
    </tr>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Registration Confirmed</title>
</head>
<body style="margin:0;padding:0;background:#eef2f7;
             font-family:'Helvetica Neue',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0"
         style="background:#eef2f7;padding:36px 16px;">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0"
               style="max-width:600px;width:100%;background:#ffffff;
                      border-radius:14px;overflow:hidden;
                      box-shadow:0 4px 32px rgba(0,0,0,0.10);">

          <!-- ═══ HEADER ═══ -->
          <tr>
            <td style="background:linear-gradient(140deg,#0A1A35 0%,#1B3A6B 100%);
                       padding:34px 40px 28px;">
              <p style="margin:0 0 14px;color:#C9A84C;font-size:10px;
                        letter-spacing:0.18em;text-transform:uppercase;
                        font-weight:700;">
                University of Ghana &nbsp;·&nbsp; Department of Computer Science
              </p>
              <div style="height:2px;background:linear-gradient(90deg,#C9A84C 60%,transparent);
                          margin-bottom:22px;border-radius:1px;"></div>
              <h1 style="color:#ffffff;font-size:24px;font-weight:700;
                         margin:0 0 8px;line-height:1.2;">
                Registration Confirmed ✓
              </h1>
              <p style="color:rgba(255,255,255,0.65);font-size:13px;margin:0;">
                2nd Annual DCS Postgraduate Students Workshop &nbsp;·&nbsp; 27–29 August 2026
              </p>
            </td>
          </tr>

          <!-- ═══ BODY ═══ -->
          <tr>
            <td style="padding:36px 40px 28px;">

              <!-- Greeting -->
              <p style="color:#1a1a1a;font-size:16px;font-weight:600;margin:0 0 6px;">
                Hello, ${d.name}!
              </p>
              <p style="color:#555;font-size:14px;line-height:1.75;margin:0 0 28px;">
                Thank you for registering for the
                <strong>2nd Annual DCS Postgraduate Students Workshop</strong>.
                Your registration has been received and your place is reserved.
              </p>

              <!-- Details table -->
              <div style="background:#f8fafc;border-radius:10px;
                          border:1px solid #e2e8f0;padding:20px 24px;
                          margin-bottom:22px;">
                <p style="color:#1B3A6B;font-size:10px;font-weight:700;
                           letter-spacing:0.12em;text-transform:uppercase;
                           margin:0 0 14px;">
                  Your Registration Details
                </p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${row('Registration ID', d.registrationCode)}
                  ${row('Name', d.name)}
                  ${row('Email', d.email)}
                  ${row('Institution', d.institution)}
                  ${row('Programme', d.programme)}
                  ${row('Cohort', d.cohort)}
                  ${row('Nationality', d.nationality)}
                  ${row('Participation', d.participation)}
                  ${row('Attendance Mode', d.attendance)}
                  ${d.sessionLabel !== '—' ? row('Session', d.sessionLabel) : ''}
                  ${d.paperType !== '—' ? row('Type of Paper', d.paperType) : ''}
                  ${d.authorNames !== '—' ? row('Author(s)', d.authorNames) : ''}
                  ${d.presentationType !== '—' ? row('Presentation Type', d.presentationType) : ''}
                  ${row('Submitted On', d.registeredAt)}
                  ${row('Payment Status', statusBadge)}
                </table>
              </div>

              <!-- Next steps -->
              <p style="color:#1B3A6B;font-size:10px;font-weight:700;
                        letter-spacing:0.12em;text-transform:uppercase;
                        margin:0 0 12px;">
                What Happens Next
              </p>
              <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                ${stepsHtml}
              </table>

              <!-- Sign-off -->
              <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 20px;">
                If you have any questions, please reply to this email.
                We look forward to welcoming you in August!
              </p>
              <p style="color:#555;font-size:13px;line-height:1.7;margin:0 0 20px;">
                For further information contact:<br/>
                Esther +233 54 145 2262<br/>
                Email us on
                <a href="mailto:dcsworkshop@ug.edu.gh" style="color:#1B3A6B;">dcsworkshop@ug.edu.gh</a>
              </p>
              <p style="color:#333;font-size:14px;margin:0;">
                Regards,<br/>
                <strong style="color:#1B3A6B;">Workshop Planning &amp; Organisation Committee,</strong><br/>
                <span style="color:#999;font-size:12px;">
                  Department of Computer Science &nbsp;·&nbsp; University of Ghana, Legon
                </span>
              </p>
            </td>
          </tr>

          <!-- ═══ FOOTER ═══ -->
          <tr>
            <td style="background:#0A1A35;padding:20px 40px;">
              <p style="color:rgba(255,255,255,0.35);font-size:11px;
                        margin:0;text-align:center;line-height:1.8;">
                © 2026 University of Ghana &nbsp;·&nbsp; Department of Computer Science
                &nbsp;·&nbsp; All rights reserved.<br/>
                This email was sent to
                <strong style="color:rgba(255,255,255,0.55);">${d.email}</strong>
                because you registered for the workshop.<br/>
                <span style="color:rgba(255,255,255,0.25);">
                  Registration ID: ${d.registrationCode}
                </span>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
