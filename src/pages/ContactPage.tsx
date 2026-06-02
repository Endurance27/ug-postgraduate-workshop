import { useState } from "react";
import React from "react";
import { Mail, Phone, Globe, MapPin, Clock, MessageCircle, ArrowRight } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ContactData {
  email?: string;
  website?: string;
  location?: string;
  phone?: string;
  hours?: string;
  whatsapp?: string;
}

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface ContactPageProps {
  contact?: ContactData;
  images?: Record<string, string>;
}

const SUBJECTS = ["Registration Query", "Payment Issue", "Paper Submission", "Sponsorship / Partnership", "General Enquiry"];

export default function ContactPage({ contact = {}, images = {} }: ContactPageProps) {
  const email    = contact.email    || "dcsworkshop@ug.edu.gh";
  const website  = contact.website  || "www.cs.ug.edu.gh";
  const location = contact.location || "Department of Computer Science, University of Ghana, Legon, P.O. Box LG 25, Accra, Ghana";
  const phone    = contact.phone    || "+233 (0) 536 909 471";
  const hours    = contact.hours    || "Mon–Fri · 8:00 AM – 5:00 PM GMT";
  const whatsapp = contact.whatsapp || "233536909471";
  const [form, setForm]     = useState<FormState>({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const set = (k: keyof FormState, v: string) => setForm(f => ({ ...f, [k]: v }));

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim())    e.name    = "Your name is required.";
    if (!form.email.trim())   e.email   = "Your email is required.";
    if (!form.subject)        e.subject = "Please select a subject.";
    if (form.message.trim().length < 20) e.message = "Message must be at least 20 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) setSubmitted(true);
  };

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ug-navy to-ug-blue text-white py-[72px] pb-14">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: `url('${images.networking || "/images/collaboration-networking.jpeg"}')` }}
        />
        <div className="container relative z-10">
          <span
            className="badge inline-block mb-[14px]"
            style={{ background: "rgba(201,168,76,0.25)", color: "#C9A84C" }}
          >
            Get in Touch
          </span>
          <h1 className="text-white font-serif text-[clamp(2rem,4.5vw,3rem)] mb-3">
            Contact Us
          </h1>
          <p className="text-white/75 text-base">
            Reach the Workshop Planning Committee — we respond within 2–3 working days
          </p>
        </div>
      </section>

      <div className="container section">
        {submitted ? (
          <div className="max-w-[520px] mx-auto text-center">
            <div className="text-[64px] mb-5 flex justify-center"><Mail size={64} color="#1B3A6B" /></div>
            <h2 className="mb-3">Thank you, {form.name.split(" ")[0]}!</h2>
            <p className="text-[#555] leading-[1.75] mb-6">
              Your message has been received. The Workshop Planning Committee will respond to{" "}
              <strong>{form.email}</strong> within 2–3 working days.
            </p>
            <button className="btn-primary" onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}>
              Send Another Message
            </button>
          </div>
        ) : (
          <div className="grid gap-12 items-start contact-grid" style={{ gridTemplateColumns: "1fr 360px" }}>
            <form onSubmit={handleSubmit}>
              <div className="card">
                <h3 className="mb-1.5">Send a Message</h3>
                <p className="text-sm text-[#666] mb-6">We'll get back to you within 2–3 working days.</p>

                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name<span className="req">*</span></label>
                    <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Your full name" />
                    {errors.name && <p className="text-[#c0392b] text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div className="form-group">
                    <label>Email Address<span className="req">*</span></label>
                    <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="your@email.com" />
                    {errors.email && <p className="text-[#c0392b] text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Subject<span className="req">*</span></label>
                  <select value={form.subject} onChange={e => set("subject", e.target.value)}>
                    <option value="">-- Select a subject --</option>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.subject && <p className="text-[#c0392b] text-xs mt-1">{errors.subject}</p>}
                </div>

                <div className="form-group">
                  <label>Message<span className="req">*</span></label>
                  <textarea
                    value={form.message}
                    onChange={e => set("message", e.target.value)}
                    placeholder="Describe your query in detail…"
                    className="min-h-[130px]"
                  />
                  <div className="text-xs text-[#888] mt-1">{form.message.length} characters</div>
                  {errors.message && <p className="text-[#c0392b] text-xs mt-1">{errors.message}</p>}
                </div>

                <button type="submit" className="btn-primary w-full justify-center text-[15px] py-[13px]">
                  <span className="inline-flex items-center gap-1.5">Send Message <ArrowRight size={14} /></span>
                </button>
              </div>
            </form>

            <div className="flex flex-col gap-5">
              <div className="rounded-2xl overflow-hidden relative">
                <img
                  src={images.networking || "/images/collaboration-networking.jpeg"}
                  alt="DCS Department"
                  className="w-full h-[180px] object-cover block"
                />
                <div
                  className="absolute inset-0 flex items-end p-[14px_16px]"
                  style={{ background: "linear-gradient(transparent 40%, rgba(15,35,71,0.85))" }}
                >
                  <p className="text-white text-[13px] font-semibold m-0">Department of Computer Science, UG</p>
                </div>
              </div>

              <div className="card">
                <h4 className="mb-[14px] font-serif">Contact Details</h4>
                {[
                  { icon: <Mail size={18} />,    label: "Email",    value: email    },
                  { icon: <Phone size={18} />,   label: "Phone",    value: phone    },
                  { icon: <Globe size={18} />,   label: "Website",  value: website  },
                  { icon: <MapPin size={18} />,  label: "Location", value: location },
                  { icon: <Clock size={18} />,   label: "Hours",    value: hours    },
                ].map((c, i) => (
                  <div key={i} className={`flex gap-3 pb-3 mb-3 ${i < 4 ? "border-b border-[#f5f5f5]" : ""}`}>
                    <span className="flex-shrink-0 mt-0.5 text-ug-blue">{c.icon}</span>
                    <div>
                      <div className="text-[11px] font-semibold text-[#888] uppercase tracking-[0.06em] mb-0.5">{c.label}</div>
                      <div className="text-[13px] text-[#333] leading-[1.6] whitespace-pre-line">{c.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card bg-ug-blue-light border-none">
                <h4 className="mb-2.5 font-serif text-[0.95rem]">Quick Connect</h4>
                <a
                  href={`https://wa.me/${whatsapp}?text=Hello%2C%20I%20have%20a%20question%20about%20the%20DCS%20Postgraduate%20Workshop%202026`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 bg-[#25D366] text-white rounded-lg px-4 py-2.5 no-underline text-[13px] font-semibold"
                >
                  <MessageCircle size={18} /> Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </main>
  );
}
