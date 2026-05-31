import React, { useState } from "react";
import { CreditCard, Smartphone, Check, ArrowRight, AlertCircle, Sparkles, Shield } from "lucide-react";

declare global {
  interface Window {
    PaystackPop?: {
      setup: (opts: Record<string, unknown>) => { openIframe: () => void };
    };
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface PaymentMethod {
  id: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
}

interface Participant {
  email: string;
  studentId: string | number;
  name?: string;
  fullName?: string;
  programme?: string;
  payment?: string;
}

interface FoundRegistrant {
  email: string;
  studentId: string | number;
  name: string;
  programme: string;
  status: string;
  [key: string]: unknown;
}

interface PaymentOptions {
  paymentStatus: string;
  paymentReference: string;
  method: string;
  amount: number;
}

interface EventData {
  fee?: number;
  paystackKey?: string;
  edition?: string;
  dates?: string;
  title?: string;
}

interface PaymentPageProps {
  navigate: (page: string) => void;
  event?: EventData;
  participants?: Participant[];
  onRegister?: (registrant: FoundRegistrant, options: PaymentOptions) => void;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "momo",
    label: "Mobile Money",
    desc: "MTN MoMo, Vodafone Cash, AirtelTigo Money",
    icon: <Smartphone size={28} />,
  },
  {
    id: "card",
    label: "Debit / Credit Card",
    desc: "Visa, Mastercard, Verve",
    icon: <CreditCard size={28} />,
  },
];

export default function PaymentPage({ navigate, event = {}, participants = [], onRegister }: PaymentPageProps) {
  const fee = event.fee || 100;

  const [step, setStep] = useState("lookup"); // lookup | pay | done
  const [lookup, setLookup] = useState({ email: "", studentId: "" });
  const [lookupError, setLookupError] = useState("");
  const [foundRegistrant, setFoundRegistrant] = useState<FoundRegistrant | null>(null);
  const [method, setMethod] = useState("momo");
  const [paying, setPaying] = useState(false);
  const [payRef, setPayRef] = useState("");
  const [paymentError, setPaymentError] = useState("");

  const handleLookup = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setLookupError("");
    if (!lookup.email.includes("@")) {
      setLookupError("Please enter a valid email address.");
      return;
    }
    if (!lookup.studentId.trim()) {
      setLookupError("Please enter your Student ID.");
      return;
    }
    const email = lookup.email.trim().toLowerCase();
    const studentId = lookup.studentId.trim().toLowerCase();
    const match = participants.find(p =>
      (p.email || "").trim().toLowerCase() === email &&
      String(p.studentId || "").trim().toLowerCase() === studentId
    );

    if (!match) {
      setLookupError("No registration found for those details. Please register first.");
      return;
    }

    setFoundRegistrant({
      ...match,
      name: match.name || match.fullName || "Registered Participant",
      email: match.email,
      studentId: match.studentId,
      programme: match.programme || "Postgraduate Programme",
      status: match.payment || "Pending",
    });
    setStep("pay");
  };

  const initPaystack = () => {
    setPaymentError("");
    const paystackKey = (event.paystackKey || "").trim();
    if (!foundRegistrant) {
      setPaymentError("Please verify your registration details first.");
      return;
    }
    if (typeof window.PaystackPop === "undefined") {
      setPaymentError("Paystack could not load. Please try again or contact the workshop team.");
      return;
    }
    if (!paystackKey || paystackKey.includes("YOUR_PAYSTACK")) {
      setPaymentError("Payment is not configured yet. Please contact the workshop team.");
      return;
    }
    setPaying(true);
    try {
      const paymentMethod = method === "momo" ? "mobile_money" : "card";
      const handler = window.PaystackPop.setup({
        key: paystackKey,
        email: foundRegistrant.email,
        amount: fee * 100,
        currency: "GHS",
        ref: `UGPGW2026-PAY-${Date.now()}`,
        channels: method === "momo" ? ["mobile_money"] : ["card"],
        metadata: {
          name: foundRegistrant.name,
          studentId: foundRegistrant.studentId,
        },
        callback: (response) => {
          setPaying(false);
          setPayRef(response.reference);
          onRegister?.(foundRegistrant, {
            paymentStatus: "Confirmed",
            paymentReference: response.reference,
            method: paymentMethod,
            amount: fee,
          });
          setStep("done");
        },
        onClose: () => setPaying(false),
      });
      handler.openIframe();
    } catch (error) {
      console.error("Paystack setup failed:", error);
      setPaying(false);
      setPaymentError("Payment could not start. Please try again.");
    }
  };

  /* ─── DONE ─── */
  if (step === "done") return (
    <main>
      <section style={{ background: "linear-gradient(135deg, #0F2347, #1B3A6B)", color: "#fff", padding: "72px 0 56px" }}>
        <div className="container">
          <h1 style={{ color: "#fff", fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem,4.5vw,3rem)", marginBottom: 12 }}>Payment</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16 }}>2nd Annual DCS Postgraduate Workshop · {event.dates || "27–29 August 2026"}</p>
        </div>
      </section>
      <div className="container section">
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <Sparkles size={64} color="#C9A84C" />
          </div>
          <h2 style={{ marginBottom: 12 }}>Payment Confirmed!</h2>
          <p style={{ color: "#555", marginBottom: 24, lineHeight: 1.7 }}>
            Your payment of <strong>GHS {fee}.00</strong> for the{" "}
            <strong>{event.title || "2nd UG Postgraduate Workshop"}</strong> has been received successfully.
            A receipt has been sent to <strong>{foundRegistrant?.email}</strong>.
          </p>
          <div className="alert alert-success" style={{ textAlign: "left", marginBottom: 24 }}>
            <strong>Reference:</strong> {payRef}
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button className="btn-primary" onClick={() => navigate("home")}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>Back to Home <ArrowRight size={14} /></span>
            </button>
            <button className="btn-outline" onClick={() => navigate("contact")}>Contact Us</button>
          </div>
        </div>
      </div>
    </main>
  );

  return (
    <main>
      {/* HERO */}
      <section style={{
        background: "linear-gradient(120deg, #0F2347 55%, #1B3A6B 100%)",
        color: "#fff",
        padding: "72px 0 56px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover", backgroundPosition: "center", opacity: 0.1,
        }} />
        <div className="container" style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }} >
          <div>
            <span className="badge" style={{ background: "rgba(201,168,76,0.25)", color: "#C9A84C", marginBottom: 12, display: "inline-block" }}>
              {event.edition || "2nd Annual Edition"} · GHS {fee}
            </span>
            <h1 style={{ color: "#fff", fontSize: "clamp(1.8rem,4vw,2.6rem)", marginBottom: 12 }}>
              Workshop Registration Fee
            </h1>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, lineHeight: 1.7 }}>
              Complete your payment securely via Mobile Money or card through Paystack.
            </p>
          </div>
          <div>
            {/* Fee card */}
            <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 16, padding: 28 }}>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 4 }}>Registration Fee</p>
              <p style={{ color: "#C9A84C", fontSize: 42, fontWeight: 800, margin: "0 0 16px" }}>GHS {fee}</p>
              {[
                "Access to all 3-day workshop sessions",
                "Workshop materials &amp; proceedings",
                "Snacks, water &amp; lunch included",
                "Certificate of participation",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
                  <Check size={14} color="#C9A84C" />
                  <span dangerouslySetInnerHTML={{ __html: item }} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <style>{`@media(max-width:700px){.pay-hero-grid{grid-template-columns:1fr!important}}`}</style>
      </section>

      <div className="container section">
        <div style={{ maxWidth: 640, margin: "0 auto" }}>

          {/* ─── LOOKUP STEP ─── */}
          {step === "lookup" && (
            <div className="card">
              <h3 style={{ marginBottom: 8 }}>Verify Your Registration</h3>
              <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>
                Enter the email and Student ID you used during registration to proceed to payment.
              </p>
              <form onSubmit={handleLookup}>
                <div className="form-group">
                  <label>Email Address <span className="req">*</span></label>
                  <input
                    type="email"
                    placeholder="e.g. yourname@st.ug.edu.gh"
                    value={lookup.email}
                    onChange={e => setLookup(l => ({ ...l, email: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Student ID <span className="req">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. 10XXXXXX"
                    value={lookup.studentId}
                    onChange={e => setLookup(l => ({ ...l, studentId: e.target.value }))}
                  />
                </div>
                {lookupError && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#c0392b", fontSize: 13, marginBottom: 16 }}>
                    <AlertCircle size={14} /> {lookupError}
                  </div>
                )}
                <div className="alert alert-info" style={{ marginBottom: 20 }}>
                  <strong>Not registered yet?</strong>{" "}
                  <button type="button" style={{ background: "none", border: "none", color: "#1B3A6B", fontWeight: 600, cursor: "pointer", padding: 0, fontSize: "inherit" }}
                    onClick={() => navigate("register")}>Register first</button>
                  {" "}to receive a Student ID and proceed to payment.
                </div>
                <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: 15, padding: "13px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>Continue to Payment <ArrowRight size={14} /></span>
                </button>
              </form>
            </div>
          )}

          {/* ─── PAY STEP ─── */}
          {step === "pay" && foundRegistrant && (
            <>
              {/* Summary */}
              <div className="card" style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 16 }}>Payment Summary</h3>
                <div style={{ background: "#f8f9fa", borderRadius: 10, padding: 20, marginBottom: 0 }}>
                  {[
                    ["Email", foundRegistrant.email],
                    ["Student ID", foundRegistrant.studentId],
                  ].map(([k, v]) => (
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
              </div>

              {/* Payment method */}
              <div className="card">
                <h3 style={{ marginBottom: 16 }}>Choose Payment Method</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                  {PAYMENT_METHODS.map(m => (
                    <button key={m.id} onClick={() => setMethod(m.id)} style={{
                      border: `2px solid ${method === m.id ? "#1B3A6B" : "#e0e0e0"}`,
                      borderRadius: 12, padding: "16px 14px", background: method === m.id ? "#E5EAF3" : "#fff",
                      cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                    }}>
                      <div style={{ color: "#1B3A6B", marginBottom: 8 }}>{m.icon}</div>
                      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, color: "#1B3A6B" }}>{m.label}</div>
                      <div style={{ fontSize: 12, color: "#666" }}>{m.desc}</div>
                    </button>
                  ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#555", fontSize: 12, marginBottom: 20 }}>
                  <Shield size={13} /> Secured and processed by Paystack
                </div>
                {paymentError && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#c0392b", fontSize: 13, marginBottom: 16 }}>
                    <AlertCircle size={14} /> {paymentError}
                  </div>
                )}

                <button
                  className="btn-gold"
                  onClick={initPaystack}
                  disabled={paying}
                  style={{ width: "100%", justifyContent: "center", fontSize: 16, padding: "14px" }}
                >
                  {paying
                    ? "Processing…"
                    : <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>Pay GHS {fee} via {method === "momo" ? "Mobile Money" : "Card"} <ArrowRight size={14} /></span>}
                </button>

                <button
                  onClick={() => setStep("lookup")}
                  style={{ marginTop: 12, background: "none", border: "none", color: "#888", fontSize: 13, cursor: "pointer", display: "block", width: "100%", textAlign: "center" }}
                >
                  Wrong details? Go back
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </main>
  );
}
