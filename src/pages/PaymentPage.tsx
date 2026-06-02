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
      <section className="bg-gradient-to-br from-ug-navy to-ug-blue text-white py-[72px] pb-14">
        <div className="container">
          <h1 className="text-white font-serif mb-3" style={{ fontSize: "clamp(2rem,4.5vw,3rem)" }}>Payment</h1>
          <p className="text-white/70 text-base">2nd Annual DCS Postgraduate Workshop · {event.dates || "27–29 August 2026"}</p>
        </div>
      </section>
      <div className="container section">
        <div className="max-w-[560px] mx-auto text-center">
          <div className="flex justify-center mb-5">
            <Sparkles size={64} color="#C9A84C" />
          </div>
          <h2 className="mb-3">Payment Confirmed!</h2>
          <p className="text-[#555] mb-6 leading-[1.7]">
            Your payment of <strong>GHS {fee}.00</strong> for the{" "}
            <strong>{event.title || "2nd UG Postgraduate Workshop"}</strong> has been received successfully.
            A receipt has been sent to <strong>{foundRegistrant?.email}</strong>.
          </p>
          <div className="alert alert-success text-left mb-6">
            <strong>Reference:</strong> {payRef}
          </div>
          <div className="flex gap-3 justify-center">
            <button className="btn-primary" onClick={() => navigate("home")}>
              <span className="inline-flex items-center gap-1.5">Back to Home <ArrowRight size={14} /></span>
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
      <section className="bg-gradient-to-r from-ug-navy to-ug-blue text-white py-[72px] pb-14 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80')" }}
        />
        <div className="container relative z-10 grid gap-[48px] items-center" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <span className="badge inline-block mb-3" style={{ background: "rgba(201,168,76,0.25)", color: "#C9A84C" }}>
              {event.edition || "2nd Annual Edition"} · GHS {fee}
            </span>
            <h1 className="text-white mb-3" style={{ fontSize: "clamp(1.8rem,4vw,2.6rem)" }}>
              Workshop Registration Fee
            </h1>
            <p className="text-white/75 text-[15px] leading-[1.7]">
              Complete your payment securely via Mobile Money or card through Paystack.
            </p>
          </div>
          <div>
            {/* Fee card */}
            <div className="bg-white/[0.07] border border-white/15 rounded-2xl p-7">
              <p className="text-white/60 text-[13px] mb-1">Registration Fee</p>
              <p className="text-ug-gold text-[42px] font-extrabold m-0 mb-4">GHS {fee}</p>
              {[
                "Access to all 3-day workshop sessions",
                "Workshop materials &amp; proceedings",
                "Snacks, water &amp; lunch included",
                "Certificate of participation",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 mb-2 text-[13px] text-white/80">
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
        <div className="max-w-[640px] mx-auto">

          {/* ─── LOOKUP STEP ─── */}
          {step === "lookup" && (
            <div className="card">
              <h3 className="mb-2">Verify Your Registration</h3>
              <p className="text-[#666] text-[14px] mb-6">
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
                  <div className="flex items-center gap-2 text-[#c0392b] text-[13px] mb-4">
                    <AlertCircle size={14} /> {lookupError}
                  </div>
                )}
                <div className="alert alert-info mb-5">
                  <strong>Not registered yet?</strong>{" "}
                  <button type="button" className="bg-transparent border-none text-ug-blue font-semibold cursor-pointer p-0 text-[length:inherit]"
                    onClick={() => navigate("register")}>Register first</button>
                  {" "}to receive a Student ID and proceed to payment.
                </div>
                <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: 15, padding: "13px" }}>
                  <span className="inline-flex items-center gap-1.5">Continue to Payment <ArrowRight size={14} /></span>
                </button>
              </form>
            </div>
          )}

          {/* ─── PAY STEP ─── */}
          {step === "pay" && foundRegistrant && (
            <>
              {/* Summary */}
              <div className="card mb-6">
                <h3 className="mb-4">Payment Summary</h3>
                <div className="bg-ug-surface rounded-[10px] p-5 mb-0">
                  {[
                    ["Email", foundRegistrant.email],
                    ["Student ID", foundRegistrant.studentId],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-2 border-b border-[#eee] text-[14px]">
                      <span className="text-[#666]">{k}</span>
                      <span className="font-medium">{v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-3 text-[16px] font-bold text-ug-blue">
                    <span>Registration Fee</span>
                    <span>GHS {fee}.00</span>
                  </div>
                  <p className="text-[12px] text-[#888] mt-1.5">Includes snacks, water, and workshop materials</p>
                </div>
              </div>

              {/* Payment method */}
              <div className="card">
                <h3 className="mb-4">Choose Payment Method</h3>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {PAYMENT_METHODS.map(m => (
                    <button key={m.id} onClick={() => setMethod(m.id)}
                      className="rounded-xl px-[14px] py-4 cursor-pointer text-left transition-all duration-150"
                      style={{
                        border: `2px solid ${method === m.id ? "#1B3A6B" : "#e0e0e0"}`,
                        background: method === m.id ? "#E5EAF3" : "#fff",
                      }}>
                      <div className="text-ug-blue mb-2">{m.icon}</div>
                      <div className="font-semibold text-[14px] mb-1 text-ug-blue">{m.label}</div>
                      <div className="text-[12px] text-[#666]">{m.desc}</div>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 text-[#555] text-[12px] mb-5">
                  <Shield size={13} /> Secured and processed by Paystack
                </div>
                {paymentError && (
                  <div className="flex items-center gap-2 text-[#c0392b] text-[13px] mb-4">
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
                    : <span className="inline-flex items-center gap-1.5">Pay GHS {fee} via {method === "momo" ? "Mobile Money" : "Card"} <ArrowRight size={14} /></span>}
                </button>

                <button
                  onClick={() => setStep("lookup")}
                  className="mt-3 bg-transparent border-none text-[#888] text-[13px] cursor-pointer block w-full text-center"
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
