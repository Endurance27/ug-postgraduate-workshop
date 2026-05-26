import { useState } from "react";

const SUBJECTS = ["Registration Query", "Payment Issue", "Paper Submission", "Sponsorship / Partnership", "General Enquiry"];

const FAQS = [
  { q: "Who can register for the workshop?", a: "All postgraduate students at the University of Ghana are eligible. MSc and MPhil CS/Data Science students are required to present; PhD and other PG students may attend as observers or optional presenters." },
  { q: "What is the registration fee?", a: "GHC 100.00 per participant. This covers snacks, water, and all workshop materials for the 3-day event. Payment is made after registration via Mobile Money or Debit/Credit Card." },
  { q: "Can I attend virtually?", a: "Yes. The workshop is hybrid — you may attend physically on the UG Legon campus or join online. Select your attendance mode during registration." },
  { q: "What types of papers can I submit?", a: "You may submit a Poster, Regular Paper (3–5 pages), Short Paper (4–6 pages), or Technical Paper (6–8 pages). All submissions undergo faculty peer review." },
  { q: "Will my paper be published?", a: "Accepted papers may be considered for publication in the CBAS Journal. Notification of acceptance is sent after peer review, by 15 August 2026." },
  { q: "How do I become a sponsor?", a: "We offer Gold, Silver, and Bronze sponsorship packages. Contact us via the form or email dcsworkshop@ug.edu.gh for our sponsorship prospectus." },
];

export default function ContactPage({ contact = {}, images = {}, navigate }) {
  const email    = contact.email    || "dcsworkshop@ug.edu.gh";
  const phone    = contact.phone    || "+233 (0) 536 909 471";
  const address  = contact.location || "Department of Computer Science, University of Ghana, Legon, P.O. Box LG 25, Accra, Ghana";
  const whatsapp = contact.whatsapp || "233536909471";

  const [form, setForm]         = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors]     = useState({});
  const [openFaq, setOpenFaq]   = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Your name is required.";
    if (!form.email.trim())   e.email   = "Your email is required.";
    if (!form.subject)        e.subject = "Please select a subject.";
    if (form.message.trim().length < 10) e.message = "Message must be at least 10 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) setSubmitted(true);
  };

  const mapsUrl = "https://maps.google.com/?q=Department+of+Computer+Science+University+of+Ghana+Legon";

  return (
    <main>
      {/* HERO */}
      <section style={{
        position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg, #0F2347, #1B3A6B)",
        color: "#fff", padding: "64px 0 48px",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url('${images.networking || "/images/collaboration-networking.jpeg"}')`,
          backgroundSize: "cover", backgroundPosition: "center", opacity: 0.18,
        }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span className="badge" style={{ background: "rgba(201,168,76,0.25)", color: "#C9A84C", marginBottom: 12, display: "inline-block" }}>
            We're Here to Help
          </span>
          <h1 style={{ color: "#fff", fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 4.5vw, 3rem)", marginBottom: 0 }}>
            Contact Us
          </h1>
        </div>
      </section>

      <div className="container section">
        <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 40, alignItems: "start" }} className="contact-grid">

          {/* ── LEFT COLUMN ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Intro */}
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#C9A84C", textTransform: "uppercase", letterSpacing: "0.1em" }}>Get in Touch</span>
              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem", color: "#1B3A6B", margin: "8px 0 12px", lineHeight: 1.3 }}>
                Contact the Workshop Committee
              </h2>
              <p style={{ color: "#555", fontSize: 14, lineHeight: 1.75, margin: 0 }}>
                For enquiries about registration, paper submissions, sponsorship, or general workshop information, reach out to the Workshop Planning Committee.
              </p>
            </div>

            {/* Map card */}
            <div style={{ borderRadius: 14, overflow: "hidden", position: "relative", boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}>
              <img src={images.networking || "/images/collaboration-networking.jpeg"} alt="University of Ghana, Legon"
                style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(transparent 30%, rgba(10,20,50,0.78))",
                display: "flex", flexDirection: "column", justifyContent: "flex-end",
                padding: "16px 18px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 18 }}>📍</span>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>University of Ghana, Legon</div>
                    <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Accra, Ghana · P.O. Box LG 25</div>
                  </div>
                </div>
                <a href={mapsUrl} target="_blank" rel="noreferrer" style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "rgba(255,255,255,0.15)", backdropFilter: "blur(6px)",
                  border: "1px solid rgba(255,255,255,0.35)", borderRadius: 20,
                  color: "#fff", fontSize: 12, fontWeight: 600,
                  padding: "6px 14px", textDecoration: "none", width: "fit-content",
                  transition: "background 0.15s",
                }}>🗺 Open in Maps</a>
              </div>
            </div>

            {/* Contact details */}
            <div style={{ background: "#fff", border: "1px solid #e8eef6", borderRadius: 14, overflow: "hidden" }}>
              {[
                { icon: "✉️", label: "Email",   value: email,   href: `mailto:${email}` },
                { icon: "📞", label: "Phone",   value: phone,   href: `tel:${phone.replace(/\s|\(0\)/g, "")}` },
                { icon: "📍", label: "Address", value: address, href: mapsUrl },
              ].map((c, i) => (
                <a key={i} href={c.href} target={c.label === "Address" ? "_blank" : undefined} rel="noreferrer"
                  style={{
                    display: "flex", gap: 14, padding: "14px 18px", alignItems: "flex-start",
                    borderBottom: i < 2 ? "1px solid #f0f4fa" : "none",
                    textDecoration: "none", color: "inherit",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f7f9fc"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{c.icon}</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 2 }}>{c.label}</div>
                    <div style={{ fontSize: 13, color: "#1B3A6B", fontWeight: 500, lineHeight: 1.55 }}>{c.value}</div>
                  </div>
                </a>
              ))}
            </div>

            {/* Office Hours */}
            <div style={{ background: "#f7f9fc", border: "1px solid #e8eef6", borderRadius: 14, padding: "16px 18px" }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#1B3A6B", marginBottom: 10 }}>Office Hours</div>
              <div style={{ fontSize: 13, color: "#444", lineHeight: 1.8 }}>
                Monday – Friday: 8:00am – 5:00pm<br />
                Saturday: 9:00am – 1:00pm <span style={{ color: "#888", fontSize: 12 }}>(During registration period)</span>
              </div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 8, fontStyle: "italic" }}>
                We respond to email enquiries within 1–2 business days.
              </div>
            </div>

            {/* Social / WhatsApp */}
            <div style={{ background: "#fff", border: "1px solid #e8eef6", borderRadius: 14, padding: "16px 18px" }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#1B3A6B", marginBottom: 12 }}>Follow the Workshop</div>
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { label: "WhatsApp", icon: "💬", color: "#25D366", href: `https://wa.me/${whatsapp}?text=Hello%2C%20I%20have%20a%20question%20about%20the%20DCS%20Postgraduate%20Workshop%202026` },
                  { label: "Twitter / X", icon: "🐦", color: "#1DA1F2", href: "#" },
                  { label: "LinkedIn", icon: "💼", color: "#0A66C2", href: "#" },
                ].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noreferrer" style={{
                    flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                    background: "#f7f9fc", border: "1px solid #e8eef6", borderRadius: 10,
                    padding: "10px 8px", textDecoration: "none",
                    transition: "box-shadow 0.15s, transform 0.15s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
                  >
                    <span style={{ fontSize: 20 }}>{s.icon}</span>
                    <span style={{ fontSize: 11, color: "#555", fontWeight: 600, textAlign: "center" }}>{s.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Form card */}
            <div className="card">
              <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.3rem", marginBottom: 20, color: "#1B3A6B" }}>
                Send a Message
              </h3>

              {submitted ? (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
                  <h4 style={{ marginBottom: 8, color: "#1B3A6B" }}>Message Sent, {form.name.split(" ")[0]}!</h4>
                  <p style={{ color: "#555", fontSize: 14, lineHeight: 1.75, marginBottom: 20 }}>
                    The Workshop Planning Committee will respond to <strong>{form.email}</strong> within 1–2 business days.
                  </p>
                  <button className="btn-primary" onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 6 }}>
                        Your Name
                      </label>
                      <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Full name"
                        style={{ width: "100%", padding: "10px 14px", border: `1px solid ${errors.name ? "#e74c3c" : "#dde3ee"}`, borderRadius: 8, fontSize: 14, boxSizing: "border-box" }} />
                      {errors.name && <p style={{ color: "#e74c3c", fontSize: 12, marginTop: 4 }}>{errors.name}</p>}
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 6 }}>
                        Email Address
                      </label>
                      <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="your@email.com"
                        style={{ width: "100%", padding: "10px 14px", border: `1px solid ${errors.email ? "#e74c3c" : "#dde3ee"}`, borderRadius: 8, fontSize: 14, boxSizing: "border-box" }} />
                      {errors.email && <p style={{ color: "#e74c3c", fontSize: 12, marginTop: 4 }}>{errors.email}</p>}
                    </div>
                  </div>

                  <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 6 }}>
                        Phone (Optional)
                      </label>
                      <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+233 XX XXX XXXX"
                        style={{ width: "100%", padding: "10px 14px", border: "1px solid #dde3ee", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 6 }}>
                        Subject
                      </label>
                      <select value={form.subject} onChange={e => set("subject", e.target.value)}
                        style={{ width: "100%", padding: "10px 14px", border: `1px solid ${errors.subject ? "#e74c3c" : "#dde3ee"}`, borderRadius: 8, fontSize: 14, boxSizing: "border-box", background: "#fff" }}>
                        <option value="">Select a subject</option>
                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.subject && <p style={{ color: "#e74c3c", fontSize: 12, marginTop: 4 }}>{errors.subject}</p>}
                    </div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 6 }}>
                      Message
                    </label>
                    <textarea value={form.message} onChange={e => set("message", e.target.value)}
                      placeholder="Your message…"
                      style={{ width: "100%", minHeight: 120, padding: "10px 14px", border: `1px solid ${errors.message ? "#e74c3c" : "#dde3ee"}`, borderRadius: 8, fontSize: 14, boxSizing: "border-box", resize: "vertical" }} />
                    {errors.message && <p style={{ color: "#e74c3c", fontSize: 12, marginTop: 4 }}>{errors.message}</p>}
                  </div>

                  <button type="submit" style={{
                    width: "100%", background: "#1B3A6B", color: "#fff", border: "none",
                    borderRadius: 10, padding: "14px", fontSize: 15, fontWeight: 700,
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    transition: "background 0.15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "#0F2347"}
                    onMouseLeave={e => e.currentTarget.style.background = "#1B3A6B"}
                  >
                    ✈ Send Message
                  </button>
                  <p style={{ textAlign: "center", fontSize: 12, color: "#999", marginTop: 10 }}>
                    We typically respond within 1–2 business days.
                  </p>
                </form>
              )}
            </div>

            {/* FAQ */}
            <div style={{ border: "1px solid #e8eef6", borderRadius: 14, overflow: "hidden" }}>
              <div style={{ background: "#0F2347", padding: "16px 22px" }}>
                <h4 style={{ color: "#fff", fontFamily: "Playfair Display, serif", margin: 0, fontSize: "1.05rem" }}>
                  Frequently Asked Questions
                </h4>
              </div>
              {FAQS.map((f, i) => (
                <div key={i} style={{ borderBottom: i < FAQS.length - 1 ? "1px solid #f0f4fa" : "none" }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                    width: "100%", background: "none", border: "none", cursor: "pointer",
                    padding: "16px 22px", textAlign: "left",
                    display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
                  }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#1B3A6B", lineHeight: 1.4 }}>{f.q}</span>
                    <span style={{ color: "#C9A84C", fontSize: 18, flexShrink: 0, transition: "transform 0.2s", transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: "0 22px 16px", fontSize: 13, color: "#555", lineHeight: 1.75 }}>
                      {f.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) { .contact-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </main>
  );
}
