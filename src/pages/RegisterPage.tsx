import React, { useState, useRef, useEffect } from "react";
import {
  Lock,
  Sparkles,
  Check,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";

declare global {
  interface Window {
    PaystackPop?: {
      setup: (opts: Record<string, unknown>) => { openIframe: () => void };
    };
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface RegistrationForm {
  surname: string;
  otherNames: string;
  gender: string;
  email: string;
  phone: string;
  studentId: string;
  department: string;
  programme: string;
  otherProgramme: string;
  level: string;
  otherLevel: string;
  attendanceMode: string;
  participationType: string;
  presentationType: string;
  nationality: string;
  presentationTitle: string;
  abstract: string;
}

type FormErrors = Partial<Record<keyof RegistrationForm, string>>;

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
  registrationOpen?: boolean;
}

interface RegisterPageProps {
  navigate: (page: string) => void;
  setRegistrant?: (data: Record<string, unknown>) => void;
  event?: EventData;
  onRegister?: (
    form: RegistrationForm,
    options: PaymentOptions,
  ) => Record<string, unknown>;
}

const PROGRAMMES = [
  "MSc Computer Science",
  "MPhil Computer Science",
  "MSc Data Science",
  "MPhil Data Science",
  "MSc IT for Business",
  "PhD Computer Science",
  "Other (Specify)",
];

const PRESENTATION_TYPES = [
  "Poster Presentation",
  "Regular Paper",
  "Short Paper",
  "Technical Paper",
];

// ─── Feature flags ────────────────────────────────────────────────────────────
// Set to true to re-enable Paystack checkout when payment gateway is ready.
const PAYMENT_ENABLED = false;

const ABSTRACT_MAX_WORDS = 250;
const countWords = (text: string) =>
  text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

// ─── Nationalities (ISO 3166-1 / UN-recognised) ───────────────────────────────
const NATIONALITIES: string[] = [
  "Afghan",
  "Albanian",
  "Algerian",
  "American",
  "Andorran",
  "Angolan",
  "Antiguan and Barbudan",
  "Argentine",
  "Armenian",
  "Australian",
  "Austrian",
  "Azerbaijani",
  "Bahamian",
  "Bahraini",
  "Bangladeshi",
  "Barbadian",
  "Belarusian",
  "Belgian",
  "Belizean",
  "Beninese",
  "Bhutanese",
  "Bolivian",
  "Bosnian and Herzegovinian",
  "Botswanan",
  "Brazilian",
  "Bruneian",
  "Bulgarian",
  "Burkinabé",
  "Burundian",
  "Cabo Verdean",
  "Cambodian",
  "Cameroonian",
  "Canadian",
  "Central African",
  "Chadian",
  "Chilean",
  "Chinese",
  "Colombian",
  "Comorian",
  "Congolese (DRC)",
  "Congolese (Republic)",
  "Costa Rican",
  "Croatian",
  "Cuban",
  "Cypriot",
  "Czech",
  "Danish",
  "Djiboutian",
  "Dominican",
  "Dominican Republican",
  "Ecuadorian",
  "Egyptian",
  "Emirati",
  "Equatorial Guinean",
  "Eritrean",
  "Estonian",
  "Eswatini",
  "Ethiopian",
  "Fijian",
  "Filipino",
  "Finnish",
  "French",
  "Gabonese",
  "Gambian",
  "Georgian",
  "German",
  "Ghanaian",
  "Greek",
  "Grenadian",
  "Guatemalan",
  "Guinean",
  "Guinea-Bissauan",
  "Guyanese",
  "Haitian",
  "Honduran",
  "Hungarian",
  "Icelander",
  "Indian",
  "Indonesian",
  "Iranian",
  "Iraqi",
  "Irish",
  "Israeli",
  "Italian",
  "Ivorian",
  "Jamaican",
  "Japanese",
  "Jordanian",
  "Kazakhstani",
  "Kenyan",
  "Kiribatian",
  "Kuwaiti",
  "Kyrgyz",
  "Laotian",
  "Latvian",
  "Lebanese",
  "Lesothan",
  "Liberian",
  "Libyan",
  "Liechtensteiner",
  "Lithuanian",
  "Luxembourger",
  "Malagasy",
  "Malawian",
  "Malaysian",
  "Maldivian",
  "Malian",
  "Maltese",
  "Marshallese",
  "Mauritanian",
  "Mauritian",
  "Mexican",
  "Micronesian",
  "Moldovan",
  "Monacan",
  "Mongolian",
  "Montenegrin",
  "Moroccan",
  "Mozambican",
  "Namibian",
  "Nauruan",
  "Nepali",
  "New Zealander",
  "Nicaraguan",
  "Nigerian",
  "Nigerien",
  "North Korean",
  "North Macedonian",
  "Norwegian",
  "Omani",
  "Pakistani",
  "Palauan",
  "Palestinian",
  "Panamanian",
  "Papua New Guinean",
  "Paraguayan",
  "Peruvian",
  "Polish",
  "Portuguese",
  "Qatari",
  "Romanian",
  "Russian",
  "Rwandan",
  "Saint Kitts and Nevisian",
  "Saint Lucian",
  "Saint Vincentian and Grenadinian",
  "Samoan",
  "San Marinese",
  "São Toméan",
  "Saudi",
  "Senegalese",
  "Serbian",
  "Seychellois",
  "Sierra Leonean",
  "Singaporean",
  "Slovak",
  "Slovenian",
  "Solomon Islander",
  "Somali",
  "South African",
  "South Korean",
  "South Sudanese",
  "Spanish",
  "Sri Lankan",
  "Sudanese",
  "Surinamese",
  "Swedish",
  "Swiss",
  "Syrian",
  "Taiwanese",
  "Tajik",
  "Tanzanian",
  "Thai",
  "Timorese",
  "Togolese",
  "Tongan",
  "Trinidadian and Tobagonian",
  "Tunisian",
  "Turkish",
  "Turkmen",
  "Tuvaluan",
  "Ugandan",
  "Ukrainian",
  "Uruguayan",
  "Uzbek",
  "Vanuatuan",
  "Venezuelan",
  "Vietnamese",
  "Yemeni",
  "Zambian",
  "Zimbabwean",
].sort();

// ─── Searchable Nationality Dropdown ─────────────────────────────────────────
interface NationalitySelectProps {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}

function NationalitySelect({ value, onChange, error }: NationalitySelectProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = NATIONALITIES.filter((n) =>
    n.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="form-group" ref={wrapRef} style={{ position: "relative" }}>
      <label>
        Nationality<span className="req">*</span>
      </label>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          value={open ? query : value}
          placeholder="Search or select nationality…"
          autoComplete="off"
          onFocus={() => {
            setOpen(true);
            setQuery("");
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          style={{
            borderColor: error ? "#c0392b" : undefined,
            paddingRight: 36,
            cursor: open ? "text" : "pointer",
          }}
        />
        <ChevronDown
          size={16}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`,
            transition: "transform 0.2s ease",
            color: "#aaa",
            pointerEvents: "none",
          }}
        />
      </div>

      {open && (
        <ul
          style={{
            position: "absolute",
            zIndex: 300,
            top: "100%",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #dde1ea",
            borderTop: "none",
            borderRadius: "0 0 10px 10px",
            maxHeight: 220,
            overflowY: "auto",
            margin: 0,
            padding: "4px 0",
            listStyle: "none",
            boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
          }}
        >
          {filtered.length === 0 ?
            <li style={{ padding: "10px 14px", color: "#aaa", fontSize: 13 }}>
              No results found
            </li>
          : filtered.map((n) => (
              <li
                key={n}
                onMouseDown={(e) => e.preventDefault()} // prevent blur before click
                onClick={() => {
                  onChange(n);
                  setOpen(false);
                  setQuery("");
                }}
                style={{
                  padding: "9px 14px",
                  cursor: "pointer",
                  fontSize: 14,
                  background: n === value ? "#E5EAF3" : "transparent",
                  color: n === value ? "#1B3A6B" : "#333",
                  fontWeight: n === value ? 600 : 400,
                }}
                onMouseEnter={(e) => {
                  if (n !== value)
                    (e.currentTarget as HTMLLIElement).style.background =
                      "#f5f7fa";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLLIElement).style.background =
                    n === value ? "#E5EAF3" : "transparent";
                }}
              >
                {n}
              </li>
            ))
          }
        </ul>
      )}

      {error && <p className="text-[#c0392b] text-[12px] mt-1">{error}</p>}
    </div>
  );
}

const steps = ["Personal Details", "Academic Info", "Participation", "Payment"];

export default function RegisterPage({
  navigate,
  setRegistrant,
  event = {},
  onRegister,
}: RegisterPageProps) {
  const fee = event.fee || 100;

  const [step, setStep] = useState<number>(0);
  const [form, setForm] = useState<RegistrationForm>({
    surname: "",
    otherNames: "",
    gender: "",
    nationality: "",
    email: "",
    phone: "",
    studentId: "",
    department: "",
    programme: "",
    otherProgramme: "",
    level: "Master's",
    otherLevel: "",
    attendanceMode: "Physical",
    participationType: "Presenter",
    presentationType: "Regular Paper",
    presentationTitle: "",
    abstract: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [confirmationRef, setConfirmationRef] = useState("");
  const [registrationError, setRegistrationError] = useState("");

  const set = (k: keyof RegistrationForm, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (step === 0) {
      if (!form.surname.trim()) e.surname = "Surname is required.";
      if (!form.otherNames.trim()) e.otherNames = "Other names are required.";
      if (!form.gender) e.gender = "Please select a gender.";
      if (!form.nationality) e.nationality = "Nationality is required.";
      if (!form.email.includes("@")) e.email = "Valid email required.";
      if (!form.phone.trim()) e.phone = "Phone number is required.";
    }
    if (step === 1) {
      if (!form.department.trim()) e.department = "Department is required.";
      if (!form.programme) e.programme = "Programme is required.";
      if (form.programme === "Other (Specify)" && !form.otherProgramme.trim())
        e.otherProgramme = "Please specify your programme.";
      if (form.level === "Other (Specify)" && !form.otherLevel.trim())
        e.otherLevel = "Please specify your academic level.";
    }
    if (step === 2 && form.participationType !== "Observer") {
      if (!form.presentationTitle.trim())
        e.presentationTitle = "Presentation title is required.";
      if (!form.abstract.trim()) e.abstract = "Abstract is required.";
      else if (countWords(form.abstract) > ABSTRACT_MAX_WORDS)
        e.abstract = `Abstract must not exceed ${ABSTRACT_MAX_WORDS} words (currently ${countWords(form.abstract)}).`;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validate()) setStep((s) => Math.min(s + 1, 3));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const saveRegistrationRecord = (
    paymentStatus: string,
    reference = "",
    method = "paystack",
  ) => {
    // Combine surname + otherNames into fullName so saveRegistration can store
    // a real name instead of falling back to the email address.
    const fullName = `${form.surname} ${form.otherNames}`.trim();
    const enrichedForm = { ...form, fullName, name: fullName };

    const saved = onRegister?.(enrichedForm, {
      paymentStatus,
      paymentReference: reference,
      method,
      amount: fee,
    }) || { ...enrichedForm, payment: paymentStatus, payRef: reference };
    setRegistrant?.({
      ...enrichedForm,
      ...saved,
      payment: paymentStatus,
      payRef: reference,
    });
    return saved;
  };

  const finishRegistration = (
    paymentStatus: string,
    reference = "",
    method = "paystack",
  ) => {
    saveRegistrationRecord(paymentStatus, reference, method);
    setPaymentConfirmed(paymentStatus === "Confirmed");
    setConfirmationRef(reference);
    setDone(true);
  };

  // ── Registration-only path (PAYMENT_ENABLED = false) ──────────────────────
  // Saves the record straight to Firebase with paymentStatus "Pending".
  // No external redirect. Re-enable payment by setting PAYMENT_ENABLED = true.
  const completeRegistration = () => {
    setRegistrationError("");
    setPaying(true);
    const ref = `REG-${Date.now()}`;
    try {
      finishRegistration("Pending", ref, "offline");
    } catch (e) {
      setRegistrationError(
        "Registration could not be saved. Please try again.",
      );
    } finally {
      setPaying(false);
    }
  };

  // ── Paystack path (PAYMENT_ENABLED = true) ─────────────────────────────────
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
        metadata: {
          name: `${form.surname} ${form.otherNames}`,
          studentId: form.studentId,
          programme: form.programme,
        },
        callback: (response) => {
          setPaying(false);
          finishRegistration("Confirmed", response.reference, "paystack");
        },
        onClose: () => {
          setPaying(false);
          setRegistrationError(
            "Your registration has been saved. Payment was not completed yet.",
          );
        },
      });
      handler.openIframe();
    } catch (error) {
      console.error("Paystack setup failed:", error);
      setPaying(false);
      finishRegistration("Pending");
    }
  };

  const field = (
    label: string,
    key: keyof RegistrationForm,
    type = "text",
    required = true,
  ) => (
    <div className="form-group">
      <label>
        {label}
        {required && <span className="req">*</span>}
      </label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
      {errors[key] && (
        <p className="text-[#c0392b] text-[12px] mt-1">{errors[key]}</p>
      )}
    </div>
  );

  if (event.registrationOpen === false)
    return (
      <main>
        <section className="bg-gradient-to-br from-ug-navy to-ug-blue text-white py-[72px] pb-14">
          <div className="container">
            <h1
              className="text-white font-serif mb-3"
              style={{ fontSize: "clamp(2rem,4.5vw,3rem)" }}
            >
              Registration
            </h1>
            <p className="text-white/70 text-base">
              2nd Annual DCS Postgraduate Workshop ·{" "}
              {event.dates || "27–29 August 2026"}
            </p>
          </div>
        </section>
        <div className="container section">
          <div className="max-w-[520px] mx-auto text-center">
            <div className="mb-5 flex justify-center">
              <Lock size={64} color="#1B3A6B" />
            </div>
            <h2 className="mb-3">Registration is Currently Closed</h2>
            <p className="text-[#555] leading-[1.75] mb-7">
              Registration for the{" "}
              {event.title ||
                "2026 DCS Postgradute Research Conference & Workshop"}{" "}
              is not yet open. Check back soon or follow announcements for
              updates.
            </p>
            <div className="flex gap-3 justify-center">
              <button className="btn-primary" onClick={() => navigate("home")}>
                Back to Home
              </button>
              <button
                className="btn-outline"
                onClick={() => navigate("support")}
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </main>
    );

  if (done)
    return (
      <main>
        <div className="page-hero">
          <div className="container">
            <h1>Registration Complete!</h1>
          </div>
        </div>
        <div className="container section">
          <div className="max-w-[560px] mx-auto text-center">
            <div className="mb-5 flex justify-center">
              <Sparkles size={64} color="#C9A84C" />
            </div>
            <h2 className="mb-3">
              You're registered, {form.otherNames.split(" ")[0] || form.surname}
              !
            </h2>
            <p className="text-[#555] mb-6 leading-[1.7]">
              {paymentConfirmed ?
                <>
                  Your payment has been confirmed and your registration for the{" "}
                  <strong>
                    {event.title || "2nd UG Postgraduate Workshop"} (
                    {event.dates || "27–29 Aug 2026"})
                  </strong>{" "}
                  is complete.
                </>
              : PAYMENT_ENABLED ?
                <>
                  Your registration for the{" "}
                  <strong>
                    {event.title || "2nd UG Postgraduate Workshop"} (
                    {event.dates || "27–29 Aug 2026"})
                  </strong>{" "}
                  has been saved. Your payment is still pending.
                </>
              : <>
                  Your registration for the{" "}
                  <strong>
                    {event.title || "2nd UG Postgraduate Workshop"} (
                    {event.dates || "27–29 Aug 2026"})
                  </strong>{" "}
                  has been received successfully. Payment instructions will be
                  sent to <strong>{form.email}</strong> once payment opens.
                </>
              }
            </p>
            <div className="alert alert-success text-left">
              {paymentConfirmed && confirmationRef ?
                <>
                  <strong>Payment reference:</strong> {confirmationRef}
                </>
              : PAYMENT_ENABLED ?
                <>
                  <strong>Next step:</strong> Complete your workshop payment to
                  confirm your place.
                </>
              : <>
                  <strong>Registration reference:</strong> {confirmationRef}
                  <br />
                  <span className="text-[13px]">
                    Keep this reference for your records. Payment details will
                    be communicated soon.
                  </span>
                </>
              }
            </div>
            <div className="flex gap-3 justify-center mt-6">
              {PAYMENT_ENABLED && !paymentConfirmed && (
                <button
                  className="btn-primary"
                  onClick={() => navigate("payment")}
                >
                  <span className="inline-flex items-center gap-1.5">
                    Pay Registration Fee <ArrowRight size={14} />
                  </span>
                </button>
              )}
              <button className="btn-outline" onClick={() => navigate("home")}>
                Back to Home
              </button>
            </div>
          </div>
          <div className="container section">
            <div className="max-w-[560px] mx-auto text-center">
              <div className="mb-5 flex justify-center">
                <Sparkles size={64} color="#C9A84C" />
              </div>
              <h2 className="mb-3">
                You're registered,{" "}
                {form.otherNames.split(" ")[0] || form.surname}!
              </h2>
              <p className="text-[#555] mb-6 leading-[1.7]">
                {paymentConfirmed ?
                  <>
                    Your payment has been confirmed and your registration for
                    the{" "}
                    <strong>
                      {event.title || "2nd UG Postgraduate Workshop"} (
                      {event.dates || "27–29 Aug 2026"})
                    </strong>{" "}
                    is complete.
                  </>
                : <>
                    Your registration for the{" "}
                    <strong>
                      {event.title || "2nd UG Postgraduate Workshop"} (
                      {event.dates || "27–29 Aug 2026"})
                    </strong>{" "}
                    has been saved. Your payment is still pending.
                  </>
                }
              </p>
              <div className="alert alert-success text-left">
                {paymentConfirmed && confirmationRef ?
                  <>
                    <strong>Payment reference:</strong> {confirmationRef}
                  </>
                : <>
                    <strong>Next step:</strong> Complete your workshop payment
                    to confirm your place.
                  </>
                }
              </div>
              <div className="flex gap-3 justify-center mt-6">
                {!paymentConfirmed && (
                  <button
                    className="btn-primary"
                    onClick={() => navigate("payment")}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      Pay Registration Fee <ArrowRight size={14} />
                    </span>
                  </button>
                )}
                <button
                  className="btn-outline"
                  onClick={() => navigate("home")}
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );

  return (
    <main>
      {/* SPLIT-LAYOUT HERO */}
      <section className="bg-gradient-to-r from-ug-navy to-ug-blue text-white py-[72px] pb-14 relative overflow-hidden">
        {/* Background image overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.12]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1620829813573-7c9e1877706f?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        <div
          className="container reg-grid relative z-10 grid gap-[48px] items-center"
          style={{ gridTemplateColumns: "1fr 1fr" }}
        >
          {/* Left: text */}
          <div>
            <span
              className="badge inline-block mb-3"
              style={{ background: "rgba(201,168,76,0.25)", color: "#C9A84C" }}
            >
              {event.edition || "2nd Annual Edition"} · GHS {fee}
            </span>
            <h1
              className="text-white mb-3"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}
            >
              Register for the Workshop
            </h1>
            <p className="text-white/75 text-[15px] leading-[1.7] mb-0">
              2nd Annual Postgraduate Students Workshop · 27–29 August 2026 ·
              University of Ghana
            </p>
          </div>

          {/* Right: photo with floating badge */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
              <img
                src="https://images.unsplash.com/photo-1686213011624-8578b598ef0f?auto=format&fit=crop&w=600&q=85"
                alt="Workshop registration"
                className="w-full object-cover block"
                style={{ height: 260 }}
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-ug-gold rounded-xl px-[18px] py-3 shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
              <div className="text-[13px] font-bold text-white flex items-center gap-1">
                <Check size={14} /> Snacks included
              </div>
              <div className="text-[11px] text-white/80 mt-0.5">
                + Water &amp; materials
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container section" style={{ minHeight: "60vh" }}>
        <div className="max-w-[680px] mx-auto">
          {/* STEPPER */}
          <div className="flex gap-0 mb-10 bg-ug-surface rounded-xl p-1 border border-[#eee]">
            {steps.map((s, i) => (
              <div
                key={i}
                className="flex-1 text-center px-2 py-[10px] rounded-[9px] text-[13px] transition-all duration-200"
                style={{
                  background: i === step ? "#1B3A6B" : "transparent",
                  color:
                    i === step ? "#fff"
                    : i < step ? "#1B3A6B"
                    : "#999",
                  fontWeight: i === step ? 600 : 400,
                }}
              >
                <span className="mr-1.5 inline-flex items-center">
                  {i < step ?
                    <Check size={14} />
                  : `${i + 1}.`}
                </span>
                {s}
              </div>
            ))}
          </div>

          <div className="card">
            {/* STEP 0: Personal */}
            {step === 0 && (
              <div>
                <h3 className="mb-6">Personal Details</h3>
                <div className="form-row">
                  {field("Surname", "surname")}
                  {field("Othername(s)", "otherNames")}
                </div>
                <div className="form-group">
                  <label>
                    Gender<span className="req">*</span>
                  </label>
                  <select
                    value={form.gender}
                    onChange={(e) => set("gender", e.target.value)}
                  >
                    <option value="">-- Select gender --</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {errors.gender && (
                    <p className="text-[#c0392b] text-[12px] mt-1">
                      {errors.gender}
                    </p>
                  )}
                </div>
                <NationalitySelect
                  value={form.nationality}
                  onChange={(v) => set("nationality", v)}
                  error={errors.nationality}
                />
                <div className="form-row">
                  {field("Email Address", "email", "email")}
                  {field("Phone Number", "phone", "tel")}
                </div>
                {field("Student ID (optional)", "studentId", "text", false)}
              </div>
            )}

            {/* STEP 1: Academic */}
            {step === 1 && (
              <div>
                <h3 className="mb-6">Academic Information</h3>
                {field("Department", "department")}
                <div className="form-group">
                  <label>
                    Programme<span className="req">*</span>
                  </label>
                  <select
                    value={form.programme}
                    onChange={(e) => set("programme", e.target.value)}
                  >
                    <option value="">-- Select your programme --</option>
                    {PROGRAMMES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  {errors.programme && (
                    <p className="text-[#c0392b] text-[12px] mt-1">
                      {errors.programme}
                    </p>
                  )}
                </div>
                {form.programme === "Other (Specify)" && (
                  <div className="form-group">
                    <label>
                      Specify Programme<span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.otherProgramme}
                      onChange={(e) => set("otherProgramme", e.target.value)}
                      placeholder="Enter your specific programme"
                    />
                    {errors.otherProgramme && (
                      <p className="text-[#c0392b] text-[12px] mt-1">
                        {errors.otherProgramme}
                      </p>
                    )}
                  </div>
                )}
                <div className="form-group">
                  <label>
                    Academic Level<span className="req">*</span>
                  </label>
                  <select
                    value={form.level}
                    onChange={(e) => set("level", e.target.value)}
                  >
                    <option value="Master's">Master's (MSc / MPhil)</option>
                    <option value="PhD">PhD</option>
                    <option value="Other (Specify)">Other (Specify)</option>
                  </select>
                </div>
                {form.level === "Other (Specify)" && (
                  <div className="form-group">
                    <label>
                      Specify Level<span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.otherLevel}
                      onChange={(e) => set("otherLevel", e.target.value)}
                      placeholder="Enter your academic level"
                    />
                    {errors.otherLevel && (
                      <p className="text-[#c0392b] text-[12px] mt-1">
                        {errors.otherLevel}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Participation */}
            {step === 2 && (
              <div>
                <h3 className="mb-6">Participation Details</h3>
                <div className="form-group">
                  <label>
                    Attendance Mode<span className="req">*</span>
                  </label>
                  <select
                    value={form.attendanceMode}
                    onChange={(e) => set("attendanceMode", e.target.value)}
                  >
                    <option value="Physical">Physical (On-campus)</option>
                    <option value="Virtual">Virtual (Online)</option>
                    <option value="Hybrid">Both (Hybrid)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>
                    Participation Type<span className="req">*</span>
                  </label>
                  <select
                    value={form.participationType}
                    onChange={(e) => set("participationType", e.target.value)}
                  >
                    <option value="Presenter">Presenter</option>
                    <option value="Observer">Observer</option>
                    <option value="Both">Both (Present &amp; Observe)</option>
                  </select>
                </div>
                {form.participationType !== "Observer" && (
                  <>
                    <div className="form-group">
                      <label>
                        Presentation Type<span className="req">*</span>
                      </label>
                      <select
                        value={form.presentationType}
                        onChange={(e) =>
                          set("presentationType", e.target.value)
                        }
                      >
                        {PRESENTATION_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>
                        Title of Presentation<span className="req">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.presentationTitle}
                        onChange={(e) =>
                          set("presentationTitle", e.target.value)
                        }
                        placeholder="Enter the title of your presentation or paper"
                      />
                      {errors.presentationTitle && (
                        <p className="text-[#c0392b] text-[12px] mt-1">
                          {errors.presentationTitle}
                        </p>
                      )}
                    </div>
                    <div className="form-group">
                      <label>
                        Abstract<span className="req">*</span>
                      </label>
                      <textarea
                        value={form.abstract}
                        onChange={(e) => set("abstract", e.target.value)}
                        placeholder={
                          "Provide a standard structured abstract of your presentation:\n" +
                          "• Aim\n" +
                          "• Method\n" +
                          "• Results\n" +
                          "• Conclusion"
                        }
                        rows={7}
                        style={{
                          resize: "vertical",
                          minHeight: 140,
                          borderColor:
                            countWords(form.abstract) > ABSTRACT_MAX_WORDS ?
                              "#c0392b"
                            : undefined,
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: 4,
                        }}
                      >
                        <span>
                          {errors.abstract && (
                            <span className="text-[#c0392b] text-[12px]">
                              {errors.abstract}
                            </span>
                          )}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight:
                              countWords(form.abstract) > ABSTRACT_MAX_WORDS ?
                                600
                              : 400,
                            color:
                              countWords(form.abstract) > ABSTRACT_MAX_WORDS ?
                                "#c0392b"
                              : "#999",
                          }}
                        >
                          {countWords(form.abstract)} / {ABSTRACT_MAX_WORDS}{" "}
                          words
                          {countWords(form.abstract) > ABSTRACT_MAX_WORDS &&
                            " — limit exceeded"}
                        </span>
                      </div>
                    </div>
                  </>
                )}
                <div className="alert alert-info">
                  <strong>Note:</strong> MSc and MPhil CS/DS students are
                  expected to present their thesis or project work. MSc IT for
                  Business students may choose to observe or present.
                </div>
              </div>
            )}

            {/* STEP 3: Payment */}
            {step === 3 && (
              <div>
                <h3 className="mb-5">Registration Summary &amp; Payment</h3>
                <div className="bg-ug-surface rounded-[10px] p-5 mb-6">
                  {[
                    ["Surname", form.surname],
                    ["Other Names", form.otherNames],
                    ["Gender", form.gender],
                    ["Nationality", form.nationality],
                    ["Email", form.email],
                    ["Phone", form.phone],
                    form.studentId && ["Student ID", form.studentId],
                    ["Programme", form.programme],
                    ["Level", form.level],
                    ["Attendance Mode", form.attendanceMode],
                    ["Participation", form.participationType],
                    form.participationType !== "Observer" && [
                      "Presentation Type",
                      form.presentationType,
                    ],
                    form.participationType !== "Observer" &&
                      form.presentationTitle && [
                        "Presentation Title",
                        form.presentationTitle,
                      ],
                    form.participationType !== "Observer" &&
                      form.abstract && ["Abstract", form.abstract],
                  ]
                    .filter(Boolean)
                    .map(([k, v]) => (
                      <div
                        key={k}
                        className="flex justify-between py-2 border-b border-[#eee] text-[14px]"
                      >
                        <span className="text-[#666]">{k}</span>
                        <span className="font-medium">{v}</span>
                      </div>
                    ))}
                  <div className="flex justify-between pt-3 text-[16px] font-bold text-ug-blue">
                    <span>Registration Fee</span>
                    <span>GHS {fee}.00</span>
                  </div>
                  <p className="text-[12px] text-[#888] mt-1.5">
                    Includes snacks, water, and workshop materials
                  </p>
                </div>
                <div className="alert alert-info mb-5">
                  <strong>Payment via Paystack:</strong> You will be redirected
                  to a secure Paystack checkout to complete payment by Mobile
                  Money or debit/credit card.
                </div>
                {registrationError && (
                  <div className="alert alert-info mb-5">
                    {registrationError}
                  </div>
                )}
                {!PAYMENT_ENABLED && (
                  <div className="alert alert-info mb-5">
                    <strong>Payment note:</strong> Online payment is not yet
                    active. Your registration will be saved and you will be
                    contacted with payment instructions.
                  </div>
                )}
                <button
                  className="btn-gold"
                  onClick={
                    PAYMENT_ENABLED ? initPaystack : completeRegistration
                  }
                  disabled={paying}
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    fontSize: 16,
                    padding: "14px",
                  }}
                >
                  {paying ?
                    "Saving registration…"
                  : PAYMENT_ENABLED ?
                    <span className="inline-flex items-center gap-1.5">
                      Pay GHS {fee} via Paystack <ArrowRight size={14} />
                    </span>
                  : <span className="inline-flex items-center gap-1.5">
                      Complete Registration <ArrowRight size={14} />
                    </span>
                  }
                </button>
              </div>
            )}

            <div className="flex justify-between mt-7">
              {step > 0 ?
                <button className="btn-outline" onClick={back}>
                  <span className="inline-flex items-center gap-1.5">
                    <ArrowLeft size={14} /> Back
                  </span>
                </button>
              : <div />}
              {step < 3 ?
                <button className="btn-primary" onClick={next}>
                  <span className="inline-flex items-center gap-1.5">
                    Continue <ArrowRight size={14} />
                  </span>
                </button>
              : <div />}
            </div>
          </div>

          <p className="text-center mt-4 text-[13px] text-[#888]">
            Registration is open to all postgraduate students at the University
            of Ghana.
          </p>
        </div>
      </div>
    </main>
  );
}
