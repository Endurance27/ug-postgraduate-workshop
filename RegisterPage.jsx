import { useState } from "react";
import { Lock, Sparkles, Check, ArrowRight, ArrowLeft } from "lucide-react";

const PROGRAMMES = [
  "MSc Computer Science",
  "MPhil Computer Science",
  "MSc Data Science",
  "MPhil Data Science",
  "MSc IT for Business",
  "PhD Computer Science",
  "Other Postgraduate (UG)",
];

const PRESENTATION_TYPES = ["Poster Presentation", "Regular Paper", "Short Paper", "Technical Paper"];

const steps = ["Personal Details", "Academic Info", "Participation", "Payment"];

export default function RegisterPage({ navigate, setRegistrant, event = {}, onRegister }) {
  const fee = event.fee || 100;

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", studentId: "",
    department: "", programme: "", level: "Master's",
    attendanceMode: "Physical", participationType: "Presenter",
    presentationType: "Regular Paper",
  });
  const [errors, setErrors] = useState({});
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [confirmationRef, setConfirmationRef] = useState("");
  const [registrationError, setRegistrationError] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!form.fullName.trim()) e.fullName = "Full name is required.";
      if (!form.email.includes("@")) e.email = "Valid email required.";
      if (!form.phone.trim()) e.phone = "Phone number is required.";
      if (!form.studentId.trim()) e.studentId = "Student ID is required.";
    }
    if (step === 1) {
      if (!form.department.trim()) e.department = "Department is required.";
      if (!form.programme) e.programme = "Programme is required.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep(s => Math.min(s + 1, 3)); };
  const back = () => setStep(s => Math.max(s - 1, 0));

  const saveRegistrationRecord = (paymentStatus, reference = "", method = "paystack") => {
    const saved = onRegister?.(form, {
      paymentStatus,
      paymentReference: reference,
      method,
      amount: fee,
    }) || { ...form, payment: paymentStatus, payRef: reference };
    setRegistrant?.({ ...form, ...saved, payment: paymentStatus, payRef: reference });
    return saved;
  };

  const finishRegistration = (paymentStatus, reference = "", method = "paystack") => {
    saveRegistrationRecord(paymentStatus, reference, method);
    setPaymentConfirmed(paymentStatus === "Confirmed");
    setConfirmationRef(reference);
    setDone(true);
  };

  const initPaystack = () => {
    setRegistrationError("");
    const paystackKey = (event.paystackKey || "").trim();

    if (typeof window.PaystackPop === "undefined") {
      finishRegistration("Pending");
      return;
    }

    if (!paystackKey || paystackKey.includes("YOUR_PAYSTACK")) {
      finishRegistration("Pending");
      return;
    }

    saveRegistrationRecord("Pending");
    setPaying(true);
    try {
      const handler = window.PaystackPop.setup({
        key: paystackKey,
        email: form.email,
        amount: fee * 100,
        currency: "GHS",
        ref: `UGPGW2026-${Date.now()}`,
        metadata: { name: form.fullName, studentId: form.studentId, programme: form.programme },
        callback: (response) => {
          setPaying(false);
          finishRegistration("Confirmed", response.reference, "paystack");
        },
        onClose: () => {
          setPaying(false);
          setRegistrationError("Your registration has been saved. Payment was not completed yet.");
        },
      });
      handler.openIframe();
    } catch (error) {
      console.error("Paystack setup failed:", error);
      setPaying(false);
      finishRegistration("Pending");
    }
  };

  const field = (label, key, type = "text", required = true) => (
    <div className="form-group">
      <label>{label}{required && <span className="req">*</span>}</label>
      <input
        type={type} value={form[key]}
        onChange={e => set(key, e.target.value)}
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
      {errors[key] && <p style={{ color: "#c0392b", fontSize: 12, marginTop: 4 }}>{errors[key]}</p>}
    </div>
  );

  if (event.registrationOpen === false) return (
    <main>
      <section style={{ background: "linear-gradient(135deg, #0F2347, #1B3A6B)", color: "#fff", padding: "72px 0 56px" }}>
        <div className="container">
          <h1 style={{ color: "#fff", fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem,4.5vw,3rem)", marginBottom: 12 }}>Registration</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16 }}>2nd Annual DCS Postgraduate Workshop · {event.dates || "27–29 August 2026"}</p>
        </div>
      </section>
      <div className="container section">
        <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
          <div style={{ marginBottom: 20, display: "flex", justifyContent: "center" }}><Lock size={64} color="#1B3A6B" /></div>
          <h2 style={{ marginBottom: 12 }}>Registration is Currently Closed</h2>
          <p style={{ color: "#555", lineHeight: 1.75, marginBottom: 28 }}>
            Registration for the {event.title || "DCS Postgraduate Research Workshop 2026"} is not yet open.
            Check back soon or follow announcements for updates.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button className="btn-primary" onClick={() => navigate("home")}>Back to Home</button>
            <button className="btn-outline" onClick={() => navigate("support")}>Contact Us</button>
          </div>
        </div>
      </div>
    </main>
  );

  if (done) return (
    <main>
      <div className="page-hero"><div className="container"><h1>Registration Complete!</h1></div></div>
      <div className="container section">
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <div style={{ marginBottom: 20, display: "flex", justifyContent: "center" }}><Sparkles size={64} color="#C9A84C" /></div>
          <h2 style={{ marginBottom: 12 }}>You're registered, {form.fullName.split(" ")[0]}!</h2>
          <p style={{ color: "#555", marginBottom: 24, lineHeight: 1.7 }}>
            {paymentConfirmed ? (
              <>Your payment has been confirmed and your registration for the <strong>{event.title || "2nd UG Postgraduate Workshop"} ({event.dates || "27–29 Aug 2026"})</strong> is complete.</>
            ) : (
              <>Your registration for the <strong>{event.title || "2nd UG Postgraduate Workshop"} ({event.dates || "27–29 Aug 2026"})</strong> has been saved. Your payment is still pending.</>
            )}
          </p>
          <div className="alert alert-success" style={{ textAlign: "left" }}>
            {paymentConfirmed && confirmationRef
              ? <><strong>Payment reference:</strong> {confirmationRef}</>
              : <><strong>Next step:</strong> Complete your workshop payment to confirm your place.</>}
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
            {!paymentConfirmed && <button className="btn-primary" onClick={() => navigate("payment")}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>Pay Registration Fee <ArrowRight size={14} /></span></button>}
            <button className="btn-outline" onClick={() => navigate("home")}>Back to Home</button>
          </div>
        </div>
      </div>
    </main>
  );

  return (
    <main>
      {/* SPLIT-LAYOUT HERO */}
      <section style={{
        background: "linear-gradient(120deg, #0F2347 55%, #1B3A6B 100%)",
        color: "#fff",
        padding: "72px 0 56px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background image overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1620829813573-7c9e1877706f?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.12,
        }} />
        <div className="container reg-grid" style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
          alignItems: "center",
        }}>
          {/* Left: text */}
          <div>
            <span className="badge" style={{ background: "rgba(201,168,76,0.25)", color: "#C9A84C", marginBottom: 12, display: "inline-block" }}>
              {event.edition || "2nd Annual Edition"} · GHS {fee}
            </span>
            <h1 style={{ color: "#fff", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", marginBottom: 12 }}>
              Register for the Workshop
            </h1>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, lineHeight: 1.7, marginBottom: 0 }}>
              2nd Annual Postgraduate Students Workshop · 27–29 August 2026 · University of Ghana
            </p>
          </div>

          {/* Right: photo with floating badge */}
          <div style={{ position: "relative" }}>
            <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
              <img
                src="https://images.unsplash.com/photo-1686213011624-8578b598ef0f?auto=format&fit=crop&w=600&q=85"
                alt="Workshop registration"
                style={{ width: "100%", height: 260, objectFit: "cover", display: "block" }}
              />
            </div>
            {/* Floating badge */}
            <div style={{
              position: "absolute",
              bottom: -16,
              left: -16,
              background: "#C9A84C",
              borderRadius: 12,
              padding: "12px 18px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 4 }}><Check size={14} /> Snacks included</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>+ Water &amp; materials</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container section">
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          {/* STEPPER */}
          <div style={{ display: "flex", gap: 0, marginBottom: 40, background: "#f8f9fa", borderRadius: 12, padding: "4px", border: "1px solid #eee" }}>
            {steps.map((s, i) => (
              <div key={i} style={{
                flex: 1, textAlign: "center", padding: "10px 8px",
                borderRadius: 9, fontSize: 13,
                background: i === step ? "#1B3A6B" : "transparent",
                color: i === step ? "#fff" : i < step ? "#1B3A6B" : "#999",
                fontWeight: i === step ? 600 : 400,
                transition: "all 0.2s"
              }}>
                <span style={{ marginRight: 6, display: "inline-flex", alignItems: "center" }}>{i < step ? <Check size={14} /> : `${i + 1}.`}</span>{s}
              </div>
            ))}
          </div>

          <div className="card">
            {/* STEP 0: Personal */}
            {step === 0 && (
              <div>
                <h3 style={{ marginBottom: 24 }}>Personal Details</h3>
                {field("Full Name", "fullName")}
                <div className="form-row">
                  {field("Email Address", "email", "email")}
                  {field("Phone Number", "phone", "tel")}
                </div>
                {field("Student ID", "studentId")}
              </div>
            )}

            {/* STEP 1: Academic */}
            {step === 1 && (
              <div>
                <h3 style={{ marginBottom: 24 }}>Academic Information</h3>
                {field("Department", "department")}
                <div className="form-group">
                  <label>Programme<span className="req">*</span></label>
                  <select value={form.programme} onChange={e => set("programme", e.target.value)}>
                    <option value="">-- Select your programme --</option>
                    {PROGRAMMES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {errors.programme && <p style={{ color: "#c0392b", fontSize: 12, marginTop: 4 }}>{errors.programme}</p>}
                </div>
                <div className="form-group">
                  <label>Academic Level<span className="req">*</span></label>
                  <select value={form.level} onChange={e => set("level", e.target.value)}>
                    <option value="Master's">Master's (MSc / MPhil)</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>
              </div>
            )}

            {/* STEP 2: Participation */}
            {step === 2 && (
              <div>
                <h3 style={{ marginBottom: 24 }}>Participation Details</h3>
                <div className="form-group">
                  <label>Attendance Mode<span className="req">*</span></label>
                  <select value={form.attendanceMode} onChange={e => set("attendanceMode", e.target.value)}>
                    <option value="Physical">Physical (On-campus)</option>
                    <option value="Virtual">Virtual (Online)</option>
                    <option value="Hybrid">Both (Hybrid)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Participation Type<span className="req">*</span></label>
                  <select value={form.participationType} onChange={e => set("participationType", e.target.value)}>
                    <option value="Presenter">Presenter</option>
                    <option value="Observer">Observer</option>
                    <option value="Both">Both (Present &amp; Observe)</option>
                  </select>
                </div>
                {form.participationType !== "Observer" && (
                  <div className="form-group">
                    <label>Presentation Type<span className="req">*</span></label>
                    <select value={form.presentationType} onChange={e => set("presentationType", e.target.value)}>
                      {PRESENTATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                )}
                <div className="alert alert-info">
                  <strong>Note:</strong> MSc and MPhil CS/DS students are expected to present their thesis or project work. MSc IT for Business students may choose to observe or present.
                </div>
              </div>
            )}

            {/* STEP 3: Payment */}
            {step === 3 && (
              <div>
                <h3 style={{ marginBottom: 20 }}>Registration Summary &amp; Payment</h3>
                <div style={{ background: "#f8f9fa", borderRadius: 10, padding: 20, marginBottom: 24 }}>
                  {[
                    ["Name", form.fullName],
                    ["Email", form.email],
                    ["Phone", form.phone],
                    ["Student ID", form.studentId],
                    ["Programme", form.programme],
                    ["Level", form.level],
                    ["Attendance Mode", form.attendanceMode],
                    ["Participation", form.participationType],
                    form.participationType !== "Observer" && ["Presentation Type", form.presentationType],
                  ].filter(Boolean).map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee", fontSize: 14 }}>
                      <span style={{ color: "#666" }}>{k}</span>
                      <span style={{ fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0", fontSize: 16, fontWeight: 700, color: "#1B3A6B" }}>
                    <span>Registration Fee</span>
                    <span>GHS {fee}.00</span>
                  </div>
                  <p style={{ fontSize: 12, color: "#888", marginTop: 6 }}>Includes snacks, water, and workshop materials</p>
                </div>
                <div className="alert alert-info" style={{ marginBottom: 20 }}>
                  <strong>Payment via Paystack:</strong> You will be redirected to a secure Paystack checkout to complete payment by Mobile Money or debit/credit card.
                </div>
                {registrationError && (
                  <div className="alert alert-info" style={{ marginBottom: 20 }}>
                    {registrationError}
                  </div>
                )}
                <button
                  className="btn-gold"
                  onClick={initPaystack}
                  disabled={paying}
                  style={{ width: "100%", justifyContent: "center", fontSize: 16, padding: "14px" }}
                >
                  {paying ? "Processing..." : <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>Pay GHS {fee} via Paystack <ArrowRight size={14} /></span>}
                </button>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
              {step > 0
                ? <button className="btn-outline" onClick={back}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><ArrowLeft size={14} /> Back</span></button>
                : <div />}
              {step < 3
                ? <button className="btn-primary" onClick={next}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>Continue <ArrowRight size={14} /></span></button>
                : <div />}
            </div>
          </div>

          <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#888" }}>
            Registration is open to all postgraduate students at the University of Ghana.
          </p>
        </div>
      </div>
    </main>
  );
}
