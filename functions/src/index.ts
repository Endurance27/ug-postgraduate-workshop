import * as admin from 'firebase-admin';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import * as nodemailer from 'nodemailer';

// ─── Initialise ───────────────────────────────────────────────────────────────
admin.initializeApp();

// Matches storageBucket in src/firebase.ts — named explicitly since the
// legacy *.appspot.com bucket the Admin SDK infers by default doesn't exist
// for this project.
const STORAGE_BUCKET = 'ug-postgrad-workshop-d6919.firebasestorage.app';

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
  firstName?: string;
  lastName?: string;
  otherNames?: string;
  gender?: string;
  email?: string;
  phone?: string;
  institution?: string;
  otherInstitution?: string;
  participantCategory?: string;
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
  abstractBackground?: string;
  abstractMethods?: string;
  abstractResults?: string;
  abstractSignificance?: string;
  abstractFileUrl?: string;
  abstractFileName?: string;
  abstractFilePath?: string;
  payment?: string;
  registeredAt?: string;
  registrationCode?: string;
  studentId?: string;
  payRef?: string;
  paymentMethod?: string;
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

// Callable from the registration form to block duplicate registrations —
// public clients can't read the registrations collection (see firestore.rules),
// so this runs the lookup server-side with the Admin SDK.
export const checkEmailRegistered = onCall<{ email?: string }>(
  { region: 'us-central1' },
  async (request) => {
    const email = (request.data?.email || '').trim().toLowerCase();
    if (!email || !email.includes('@')) return { exists: false };

    const snap = await admin
      .firestore()
      .collection('registrations')
      .where('email', '==', email)
      .limit(1)
      .get();

    return { exists: !snap.empty };
  },
);

// ─── Sessions ───────────────────────────────────────────────────────────────
// Dedicated `sessions` collection — the single source of truth for seat
// availability. Replaces the old approach of diffing registration documents
// against a shared sessionCounts map on workshop/siteContent, which could
// drift out of sync (e.g. a delete or a stale admin write racing the diff).
// Each session document: { id, title, date, startTime, endTime, capacity,
// registeredCount, availableSeats }, where availableSeats is always kept
// equal to capacity - registeredCount by reserveSessionSeat's transaction.
interface SessionDef {
  id: string;
  dayKey: string;
  timeSlot: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
}

const SESSION_DEFS: SessionDef[] = [
  {
    id: '27Aug_Morning',
    dayKey: '27Aug',
    timeSlot: 'Morning',
    title: 'Wednesday, 27 August — Morning',
    date: '2026-08-27',
    startTime: '9:00 AM',
    endTime: '1:00 PM',
    capacity: 60,
  },
  {
    id: '27Aug_Afternoon',
    dayKey: '27Aug',
    timeSlot: 'Afternoon',
    title: 'Wednesday, 27 August — Afternoon',
    date: '2026-08-27',
    startTime: '2:00 PM',
    endTime: '5:00 PM',
    capacity: 60,
  },
  {
    id: '28Aug_Morning',
    dayKey: '28Aug',
    timeSlot: 'Morning',
    title: 'Thursday, 28 August — Morning',
    date: '2026-08-28',
    startTime: '9:00 AM',
    endTime: '1:00 PM',
    capacity: 60,
  },
  {
    id: '28Aug_Afternoon',
    dayKey: '28Aug',
    timeSlot: 'Afternoon',
    title: 'Thursday, 28 August — Afternoon',
    date: '2026-08-28',
    startTime: '2:00 PM',
    endTime: '5:00 PM',
    capacity: 60,
  },
  {
    id: '29Aug_Morning',
    dayKey: '29Aug',
    timeSlot: 'Morning',
    title: 'Friday, 29 August — Morning',
    date: '2026-08-29',
    startTime: '9:00 AM',
    endTime: '1:00 PM',
    capacity: 60,
  },
  {
    id: '29Aug_Afternoon',
    dayKey: '29Aug',
    timeSlot: 'Afternoon',
    title: 'Friday, 29 August — Afternoon',
    date: '2026-08-29',
    startTime: '2:00 PM',
    endTime: '5:00 PM',
    capacity: 60,
  },
];

// Idempotent: only creates docs that don't exist yet, so it never clobbers a
// live registeredCount if called again after seats have already been taken.
async function ensureSessionsSeeded(): Promise<void> {
  const sessionsRef = admin.firestore().collection('sessions');
  const batch = admin.firestore().batch();
  let didWrite = false;
  for (const def of SESSION_DEFS) {
    const ref = sessionsRef.doc(def.id);
    const snap = await ref.get();
    if (!snap.exists) {
      batch.set(ref, {
        ...def,
        registeredCount: 0,
        availableSeats: def.capacity,
      });
      didWrite = true;
    }
  }
  if (didWrite) await batch.commit();
}

// Callable so the registration form can seed-if-needed and fetch the full
// session list in one round trip; the client also opens a live onSnapshot
// listener on the collection afterwards for real-time seat updates.
export const getSessions = onCall({ region: 'us-central1' }, async () => {
  await ensureSessionsSeeded();
  const snap = await admin.firestore().collection('sessions').get();
  // Sort by timeSlot rather than the raw startTime string — "9:00 AM" vs
  // "2:00 PM" compares '9' > '2' lexicographically, which put Afternoon
  // before Morning on the same day.
  const timeSlotRank = (t: string) => (t === 'Morning' ? 0 : 1);
  const sessions = snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as SessionDef)
    .sort((a, b) =>
      a.date === b.date ?
        timeSlotRank(a.timeSlot) - timeSlotRank(b.timeSlot)
      : a.date.localeCompare(b.date),
    );
  return { sessions };
});

// Callable from the registration form immediately after a successful Paystack
// payment. This is the only path that can ever increment registeredCount —
// public clients cannot write to `sessions` directly (see firestore.rules) —
// and the increment + capacity check happen inside a single Firestore
// transaction, so two participants racing for the last seat can never both
// succeed regardless of what either client's UI showed them a moment earlier.
export const reserveSessionSeat = onCall<{ sessionId?: string }>(
  { region: 'us-central1' },
  async (request) => {
    const sessionId = (request.data?.sessionId || '').trim();
    if (!sessionId) {
      throw new HttpsError('invalid-argument', 'sessionId is required.');
    }

    await ensureSessionsSeeded();
    const ref = admin.firestore().collection('sessions').doc(sessionId);

    return admin.firestore().runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) {
        throw new HttpsError('not-found', 'That session does not exist.');
      }
      const data = snap.data() as { capacity: number; registeredCount: number };
      const capacity = Number(data.capacity) || 0;
      const registeredCount = Number(data.registeredCount) || 0;
      if (registeredCount >= capacity) {
        throw new HttpsError(
          'resource-exhausted',
          'This session is full. Please choose another day or session.',
        );
      }
      const nextCount = registeredCount + 1;
      tx.update(ref, {
        registeredCount: nextCount,
        availableSeats: capacity - nextCount,
      });
      return { success: true, availableSeats: capacity - nextCount };
    });
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

    // Fetched once and reused for both the payment record and the confirmation
    // email, which both need to show the registration fee.
    let fee = 100;
    try {
      const siteSnap = await admin
        .firestore()
        .doc('workshop/siteContent')
        .get();
      const siteFee = (
        siteSnap.data() as { event?: { fee?: number } } | undefined
      )?.event?.fee;
      if (siteFee) fee = Number(siteFee);
    } catch {
      // keep default fee
    }

    // ── Sync a payment record for the admin Payments panel ─────────────────
    // The `payments` collection requires admin auth to write (see firestore.rules),
    // so public registrants can never create one themselves — the frontend used to
    // compute a payment record locally but had no way to persist it. The Admin SDK
    // bypasses that rule, so this is the only place a real payment record actually
    // gets written. Runs on every write (not just the first) so status changes made
    // by an admin (Confirm/Revoke in ParticipantsPanel) stay in sync here too.
    {
      const transactionId = data.payRef || registrationId;
      const paymentDocId =
        transactionId.replace(/[^\w.-]/g, '_') || registrationId;
      await admin
        .firestore()
        .doc(`payments/${paymentDocId}`)
        .set(
          {
            id: paymentDocId,
            transactionId,
            studentId: data.studentId || '',
            name: (data.fullName || data.name || 'Participant').trim(),
            email: data.email || '',
            programme: data.programme || '',
            amount: fee,
            method: data.paymentMethod || 'paystack',
            date: data.registeredAt || new Date().toISOString(),
            status: data.payment === 'Confirmed' ? 'Confirmed' : 'Pending',
          },
          { merge: true },
        );
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
    // Mirrors every field shown on the frontend's Registration Summary page
    // (RegisterPage.tsx Step 3) so the email is a complete record of it.
    const name = (data.fullName || data.name || 'Participant').trim();
    const institution =
      (data.institution === 'Other (Specify)' ?
        data.otherInstitution
      : data.institution) || '—';
    const isCsStudent = data.isCsStudent === 'Yes';
    const programme = isCsStudent ? data.programme || '—' : '—';
    const cohort = isCsStudent ? data.cohort || '—' : '—';
    const studentId = isCsStudent ? data.studentId || '—' : '—';
    const nationality = data.nationality || '—';
    const participation = data.participationType || data.type || '—';
    const attendance = data.attendanceMode || data.mode || '—';
    const sessionPref = data.sessionPreference || '';
    const matchedSession = SESSION_DEFS.find((s) => s.id === sessionPref);
    const sessionLabel =
      matchedSession ?
        `${matchedSession.title} Session (${matchedSession.startTime} – ${matchedSession.endTime})`
      : '—';
    const isPresenting = data.isSubmittingAbstract === 'Yes';
    const paperType = isPresenting ? data.paperType || '—' : '—';
    const authorNames = isPresenting ? data.authorNames || '—' : '—';
    const presentationType = isPresenting ? data.presentationType || '—' : '—';
    const presentationTitle =
      isPresenting ? data.presentationTitle || '—' : '—';
    const thematicAreas =
      isPresenting && data.thematicAreas?.length ?
        data.thematicAreas.join(', ')
      : '—';
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

    // ── Abstract: presenters submit both a file and the structured sections,
    // so the email always includes the labelled sections in the body AND
    // (when the file could be fetched) attaches the uploaded file. ─────────
    const abstractSections =
      isPresenting ?
        [
          ['Background', data.abstractBackground],
          ['Methods', data.abstractMethods],
          ['Results', data.abstractResults],
          ['Significance', data.abstractSignificance],
        ]
          .filter(([, text]) => text)
          .map(([label, text]) => ({
            label: label as string,
            text: text as string,
          }))
      : [];

    let abstractAttachment: {
      filename: string;
      content: Buffer;
      contentType: string;
    } | null = null;
    if (isPresenting && data.abstractFilePath) {
      try {
        const file = admin
          .storage()
          .bucket(STORAGE_BUCKET)
          .file(data.abstractFilePath);
        const [buffer] = await file.download();
        const [metadata] = await file.getMetadata();
        abstractAttachment = {
          filename: data.abstractFileName || 'abstract',
          content: buffer,
          contentType: metadata.contentType || 'application/octet-stream',
        };
      } catch (err) {
        console.warn(
          `[${registrationId}] Could not fetch abstract file for attachment:`,
          err instanceof Error ? err.message : String(err),
        );
      }
    }

    const html = buildEmailHtml({
      name,
      email: recipientEmail,
      registrationCode,
      title: data.title || '—',
      firstName: data.firstName || '—',
      lastName: data.lastName || '—',
      otherNames: data.otherNames || '—',
      gender: data.gender || '—',
      phone: data.phone || '—',
      institution,
      participantCategory: data.participantCategory || '—',
      isCsStudent: data.isCsStudent || '—',
      studentId,
      programme,
      cohort,
      nationality,
      participation,
      attendance,
      sessionLabel,
      isSubmittingAbstract: data.isSubmittingAbstract || '—',
      paperType,
      thematicAreas,
      authorNames,
      presentationType,
      presentationTitle,
      abstractSections,
      hasAbstractAttachment: abstractAttachment !== null,
      fee,
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
        attachments:
          abstractAttachment ?
            [
              {
                filename: abstractAttachment.filename,
                content: abstractAttachment.content,
                contentType: abstractAttachment.contentType,
              },
            ]
          : undefined,
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
  title: string;
  firstName: string;
  lastName: string;
  otherNames: string;
  gender: string;
  phone: string;
  institution: string;
  participantCategory: string;
  isCsStudent: string;
  studentId: string;
  programme: string;
  cohort: string;
  nationality: string;
  participation: string;
  attendance: string;
  sessionLabel: string;
  isSubmittingAbstract: string;
  paperType: string;
  thematicAreas: string;
  authorNames: string;
  presentationType: string;
  presentationTitle: string;
  abstractSections: { label: string; text: string }[];
  hasAbstractAttachment: boolean;
  fee: number;
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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>');
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

  // ── Abstract: presenters submit both a file and the structured sections,
  // so this block shows the labelled sections and (when the file was
  // successfully attached) a note pointing to the attachment.
  let abstractSectionHtml = '';
  if (d.abstractSections.length > 0 || d.hasAbstractAttachment) {
    const sectionsHtml = d.abstractSections
      .map(
        (s) => `
      <div style="margin-bottom:14px;">
        <p style="color:#1B3A6B;font-size:12px;font-weight:700;margin:0 0 4px;">
          ${escapeHtml(s.label)}
        </p>
        <p style="color:#444;font-size:13px;line-height:1.7;margin:0;
                  background:#ffffff;border:1px solid #e0e6f0;border-radius:8px;
                  padding:10px 14px;white-space:pre-wrap;">
          ${escapeHtml(s.text)}
        </p>
      </div>`,
      )
      .join('');
    const attachmentNoteHtml =
      d.hasAbstractAttachment ?
        `
      <p style="color:#444;font-size:13px;line-height:1.6;margin:${d.abstractSections.length > 0 ? '14px 0 0' : '0'};">
        📎 Your submitted abstract file is also attached to this email.
      </p>`
      : '';
    abstractSectionHtml = `
      <div style="background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;
                  padding:20px 24px;margin-bottom:22px;">
        <p style="color:#1B3A6B;font-size:10px;font-weight:700;
                   letter-spacing:0.12em;text-transform:uppercase;
                   margin:0 0 14px;">
          Submitted Abstract
        </p>
        ${sectionsHtml}
        ${attachmentNoteHtml}
      </div>`;
  }

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
                <strong>2nd Edition of the Annual DCS Postgraduate Research Conference & Workshop (PRC 2026).</strong>
                Your registration has been received and your seat reserved.
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
                  ${row('Title', d.title)}
                  ${row('First Name', d.firstName)}
                  ${row('Last Name', d.lastName)}
                  ${d.otherNames !== '—' ? row('Other Names', d.otherNames) : ''}
                  ${row('Gender', d.gender)}
                  ${row('Email', d.email)}
                  ${row('Phone', d.phone)}
                  ${row('Institution', d.institution)}
                  ${row('Category of Participant', d.participantCategory)}
                  ${row('Nationality', d.nationality)}
                  ${d.isCsStudent === 'Yes' ? row('Student ID', d.studentId) : ''}
                  ${d.isCsStudent === 'Yes' ? row('Programme', d.programme) : ''}
                  ${d.isCsStudent === 'Yes' ? row('Cohort', d.cohort) : ''}
                  ${row('Submitting Abstract', d.isSubmittingAbstract)}
                  ${d.sessionLabel !== '—' ? row('Session', d.sessionLabel) : ''}
                  ${row('Participation', d.participation)}
                  ${d.paperType !== '—' ? row('Type of Paper', d.paperType) : ''}
                  ${d.thematicAreas !== '—' ? row('Thematic Areas', d.thematicAreas) : ''}
                  ${d.authorNames !== '—' ? row('Author(s)', d.authorNames) : ''}
                  ${d.presentationType !== '—' ? row('Presentation Type', d.presentationType) : ''}
                  ${d.presentationTitle !== '—' ? row('Presentation Title', d.presentationTitle) : ''}
                  ${row('Submitted On', d.registeredAt)}
                  ${row('Registration Fee', `GHS ${d.fee}.00`)}
                  ${row('Payment Status', statusBadge)}
                </table>
              </div>

              ${abstractSectionHtml}

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
