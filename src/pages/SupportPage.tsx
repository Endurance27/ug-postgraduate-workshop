// @ts-nocheck
import { useState } from "react";
import { Mail, Globe, MapPin, Clock, CreditCard, Trophy, ArrowRight } from "lucide-react";

const FAQS = [
  {
    category: "Registration & Payment",
    icon: <CreditCard size={20} color="#1B3A6B" />,
    items: [
      { q: "Who can register for the workshop?", a: "All postgraduate students at the University of Ghana are welcome. MSc, MPhil, and PhD students in Computer Science and Data Science are expected to present. MSc IT for Business students and other PG students may register as observers or optional presenters." },
      { q: "How much is the registration fee?", a: "The registration fee is GHS 100. This covers snacks, water, and all workshop materials across all three days." },
      { q: "How do I pay the registration fee?", a: "Payment details are provided after completing the registration form. Accepted methods include mobile money (MTN/Vodafone/AirtelTigo) and bank transfer. You will receive a confirmation once payment is verified." },
      { q: "Can I get a refund if I can't attend?", a: "Refunds are considered on a case-by-case basis if requested at least 7 days before the workshop. Contact the committee directly via the form below." },
      { q: "Can I register as an observer only?", a: "Yes. Students who are not ready to present may register as observers to attend sessions, panel discussions, and the awards ceremony." },
    ],
  },
  {
    category: "Attendance & Logistics",
    icon: <MapPin size={20} color="#1B3A6B" />,
    items: [
      { q: "Is the workshop in-person, virtual, or hybrid?", a: "The workshop is hybrid. You can attend physically at the University of Ghana, Legon campus, or join virtually. Virtual participants will receive a link via email before the event." },
      { q: "Where exactly is the physical venue?", a: "The workshop is held at the Department of Computer Science, School of Physical & Mathematical Sciences (SPMS), University of Ghana, Legon. Specific room details will be shared with registered participants closer to the date." },
      { q: "What time does the workshop start each day?", a: "Day 1 begins at 8:00 AM, Days 2 and 3 begin at 8:30 AM. Check the full Schedule page for session-by-session timing." },
      { q: "What should I bring on the day?", a: "Bring your student ID, registration confirmation email, and any presentation materials (laptop, USB drive, printed poster if applicable). Slides should be in PowerPoint or PDF format." },
    ],
  },
  {
    category: "Awards & Judging",
    icon: <Trophy size={20} color="#1B3A6B" />,
    items: [
      { q: "How are presentations judged?", a: "A panel of academic judges evaluates presentations across five criteria: Research Quality (30%), Presentation Skills (25%), Content & Structure (20%), Q&A Performance (15%), and Practical Impact (10%)." },
      { q: "When are award winners announced?", a: "Winners are announced during the Awards Ceremony on Day 3 (Saturday, 29 August 2026) and published on the Awards page immediately after." },
      { q: "Will my paper be published?", a: "Accepted papers are considered for publication in the CBAS Journal. The editorial committee will contact eligible authors after the workshop." },
    ],
  },
];

const SUBJECTS = ["Registration Query", "Payment Issue", "Paper Submission", "Sponsorship / Partnership", "General Enquiry"];

function AccordionItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #f0f0f0" }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", display: "flex", justifyContent: "space-between",
        alignItems: "center", padding: "15px 20px", background: "none",
        border: "none", cursor: "pointer", textAlign: "left", gap: 16,
      }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: "#1a1a1a", lineHeight: 1.4 }}>{q}</span>
        <span style={{
          fontSize: 18, color: "#1B3A6B", flexShrink: 0,
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
          transition: "transform 0.2s", display: "inline-block",
        }}>+</span>
      </button>
      {open && (
        <div style={{ padding: "0 20px 16px", fontSize: 13, color: "#555", lineHeight: 1.8 }}>{a}</div>
      )}
    </div>
  );
}

export default function SupportPage({ contact = {} }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [form, setForm]     = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [tab, setTab]       = useState("faq");

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

  const categories = ["All", ...FAQS.map(f => f.category)];
  const visibleFAQs = activeCategory === "All" ? FAQS : FAQS.filter(f => f.category === activeCategory);

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
          backgroundImage: "url('/images/collaboration-networking.jpeg')",
          backgroundSize: "cover", backgroundPosition: "center", opacity: 0.15,
        }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span className="badge" style={{ background: "rgba(201,168,76,0.25)", color: "#C9A84C", marginBottom: 14, display: "inline-block" }}>
            Help Centre
          </span>
          <h1 style={{ color: "#fff", fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 4.5vw, 3rem)", marginBottom: 12 }}>
            FAQ &amp; Contact
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16 }}>
            Find answers or reach the Workshop Planning Committee
          </p>
        </div>
      </section>

      {/* TABS */}
      <div style={{ borderBottom: "1px solid #e0e0e0", background: "#fff", position: "sticky", top: 64, zIndex: 10 }}>
        <div className="container" style={{ display: "flex", gap: 0 }}>
          {[{ key: "faq", label: "Frequently Asked Questions" }, { key: "contact", label: "Contact Us" }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "16px 24px", fontSize: 14, fontWeight: tab === t.key ? 600 : 400,
              color: tab === t.key ? "#1B3A6B" : "#666",
              borderBottom: tab === t.key ? "2px solid #1B3A6B" : "2px solid transparent",
              transition: "all 0.15s",
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* ── FAQ TAB ── */}
      {tab === "faq" && (
        <div className="container section">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 36, justifyContent: "center" }}>
            {categories.map(c => (
              <button key={c} onClick={() => setActiveCategory(c)} style={{
                background: activeCategory === c ? "#1B3A6B" : "#fff",
                color: activeCategory === c ? "#fff" : "#555",
                border: "1.5px solid #ddd", borderRadius: 24,
                padding: "7px 18px", fontSize: 13, fontWeight: 500,
                cursor: "pointer", transition: "all 0.15s",
              }}>{c}</button>
            ))}
          </div>

          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            {visibleFAQs.map((section, si) => (
              <div key={si} style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span>{section.icon}</span>
                  <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.1rem", color: "#1B3A6B" }}>{section.category}</h3>
                </div>
                <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                  {section.items.map((item, ii) => <AccordionItem key={ii} q={item.q} a={item.a} />)}
                </div>
              </div>
            ))}

            <div style={{ textAlign: "center", marginTop: 40, background: "#E5EAF3", borderRadius: 14, padding: "28px 24px" }}>
              <p style={{ fontSize: 15, color: "#333", marginBottom: 14 }}>Still have questions?</p>
              <button onClick={() => setTab("contact")} className="btn-primary"><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>Contact the Committee <ArrowRight size={14} /></span></button>
            </div>
          </div>
        </div>
      )}

      {/* ── CONTACT TAB ── */}
      {tab === "contact" && (
        <div className="container section">
          {submitted ? (
            <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
              <div style={{ marginBottom: 20, display: "flex", justifyContent: "center" }}><Mail size={64} color="#1B3A6B" /></div>
              <h2 style={{ marginBottom: 12 }}>Thank you, {form.name.split(" ")[0]}!</h2>
              <p style={{ color: "#555", lineHeight: 1.75, marginBottom: 24 }}>
                Your message has been received. The Workshop Planning Committee will respond to <strong>{form.email}</strong> within 2–3 working days.
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
                  <img src="/images/collaboration-networking.jpeg" alt="DCS Department"
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
                    { icon: <Mail size={18} />,   label: "Email",    value: contact.email    || "dcsworkshop@ug.edu.gh" },
                    { icon: <Globe size={18} />,  label: "Website",  value: contact.website  || "www.cs.ug.edu.gh" },
                    { icon: <MapPin size={18} />, label: "Location", value: contact.location || "Dept. of Computer Science\nSPMS, University of Ghana\nLegon, Accra, Ghana" },
                    { icon: <Clock size={18} />,  label: "Hours",    value: contact.hours    || "Mon–Fri · 8:00 AM – 5:00 PM GMT" },
                  ].map((c, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, paddingBottom: 12, marginBottom: 12, borderBottom: i < 3 ? "1px solid #f5f5f5" : "none" }}>
                      <span style={{ flexShrink: 0, marginTop: 2, color: "#1B3A6B" }}>{c.icon}</span>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>{c.label}</div>
                        <div style={{ fontSize: 13, color: "#333", lineHeight: 1.6, whiteSpace: "pre-line" }}>{c.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </main>
  );
}
