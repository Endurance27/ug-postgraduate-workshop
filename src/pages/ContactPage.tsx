// @ts-nocheck
import { useState } from "react";
import { Mail, Phone, Globe, MapPin, Clock, MessageCircle, ArrowRight } from "lucide-react";

const SUBJECTS = ["Registration Query", "Payment Issue", "Paper Submission", "Sponsorship / Partnership", "General Enquiry"];

export default function ContactPage({ contact = {}, images = {} }) {
  const email    = contact.email    || "dcsworkshop@ug.edu.gh";
  const website  = contact.website  || "www.cs.ug.edu.gh";
  const location = contact.location || "Department of Computer Science, University of Ghana, Legon, P.O. Box LG 25, Accra, Ghana";
  const phone    = contact.phone    || "+233 (0) 536 909 471";
  const hours    = contact.hours    || "Mon–Fri · 8:00 AM – 5:00 PM GMT";
  const whatsapp = contact.whatsapp || "233536909471";
  const [form, setForm]     = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Your name is required.";
    if (!form.email.trim())   e.email   = "Your email is required.";
    if (!form.subject)        e.subject = "Please select a subject.";
    if (form.message.trim().length < 20) e.message = "Message must be at least 20 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) setSubmitted(true);
  };

  return (
    <main>
      {/* HERO */}
      <section style={{
        position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg, #0F2347, #1B3A6B)",
        color: "#fff", padding: "72px 0 56px",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url('${images.networking || "/images/collaboration-networking.jpeg"}')`,
          backgroundSize: "cover", backgroundPosition: "center", opacity: 0.15,
        }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span className="badge" style={{ background: "rgba(201,168,76,0.25)", color: "#C9A84C", marginBottom: 14, display: "inline-block" }}>
            Get in Touch
          </span>
          <h1 style={{ color: "#fff", fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 4.5vw, 3rem)", marginBottom: 12 }}>
            Contact Us
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16 }}>
            Reach the Workshop Planning Committee — we respond within 2–3 working days
          </p>
        </div>
      </section>

      <div className="container section">
        {submitted ? (
          <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: 20, display: "flex", justifyContent: "center" }}><Mail size={64} color="#1B3A6B" /></div>
            <h2 style={{ marginBottom: 12 }}>Thank you, {form.name.split(" ")[0]}!</h2>
            <p style={{ color: "#555", lineHeight: 1.75, marginBottom: 24 }}>
              Your message has been received. The Workshop Planning Committee will respond to{" "}
              <strong>{form.email}</strong> within 2–3 working days.
            </p>
            <button className="btn-primary" onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}>
              Send Another Message
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 48, alignItems: "start" }} className="contact-grid">
            <form onSubmit={handleSubmit}>
              <div className="card">
                <h3 style={{ marginBottom: 6 }}>Send a Message</h3>
                <p style={{ fontSize: 14, color: "#666", marginBottom: 24 }}>We'll get back to you within 2–3 working days.</p>

                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name<span className="req">*</span></label>
                    <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Your full name" />
                    {errors.name && <p style={{ color: "#c0392b", fontSize: 12, marginTop: 4 }}>{errors.name}</p>}
                  </div>
                  <div className="form-group">
                    <label>Email Address<span className="req">*</span></label>
                    <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="your@email.com" />
                    {errors.email && <p style={{ color: "#c0392b", fontSize: 12, marginTop: 4 }}>{errors.email}</p>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Subject<span className="req">*</span></label>
                  <select value={form.subject} onChange={e => set("subject", e.target.value)}>
                    <option value="">-- Select a subject --</option>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.subject && <p style={{ color: "#c0392b", fontSize: 12, marginTop: 4 }}>{errors.subject}</p>}
                </div>

                <div className="form-group">
                  <label>Message<span className="req">*</span></label>
                  <textarea value={form.message} onChange={e => set("message", e.target.value)}
                    placeholder="Describe your query in detail…" style={{ minHeight: 130 }} />
                  <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{form.message.length} characters</div>
                  {errors.message && <p style={{ color: "#c0392b", fontSize: 12, marginTop: 4 }}>{errors.message}</p>}
                </div>

                <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: 15, padding: "13px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>Send Message <ArrowRight size={14} /></span>
                </button>
              </div>
            </form>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ borderRadius: 16, overflow: "hidden", position: "relative" }}>
                <img src={images.networking || "/images/collaboration-networking.jpeg"} alt="DCS Department"
                  style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(transparent 40%, rgba(15,35,71,0.85))",
                  display: "flex", alignItems: "flex-end", padding: "14px 16px",
                }}>
                  <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, margin: 0 }}>Department of Computer Science, UG</p>
                </div>
              </div>

              <div className="card">
                <h4 style={{ marginBottom: 14, fontFamily: "Playfair Display, serif" }}>Contact Details</h4>
                {[
                  { icon: <Mail size={18} />,    label: "Email",    value: email    },
                  { icon: <Phone size={18} />,   label: "Phone",    value: phone    },
                  { icon: <Globe size={18} />,   label: "Website",  value: website  },
                  { icon: <MapPin size={18} />,  label: "Location", value: location },
                  { icon: <Clock size={18} />,   label: "Hours",    value: hours    },
                ].map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, paddingBottom: 12, marginBottom: 12, borderBottom: i < 4 ? "1px solid #f5f5f5" : "none" }}>
                    <span style={{ flexShrink: 0, marginTop: 2, color: "#1B3A6B" }}>{c.icon}</span>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>{c.label}</div>
                      <div style={{ fontSize: 13, color: "#333", lineHeight: 1.6, whiteSpace: "pre-line" }}>{c.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card" style={{ background: "#E5EAF3", border: "none" }}>
                <h4 style={{ marginBottom: 10, fontFamily: "Playfair Display, serif", fontSize: "0.95rem" }}>Quick Connect</h4>
                <a href={`https://wa.me/${whatsapp}?text=Hello%2C%20I%20have%20a%20question%20about%20the%20DCS%20Postgraduate%20Workshop%202026`}
                  target="_blank" rel="noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    background: "#25D366", color: "#fff", borderRadius: 8,
                    padding: "10px 16px", textDecoration: "none", fontSize: 13, fontWeight: 600,
                  }}>
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
