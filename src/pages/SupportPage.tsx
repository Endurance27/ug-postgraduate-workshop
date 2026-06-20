import { useState, ReactNode } from "react";
import React from "react";
import { Mail, Globe, MapPin, Clock, CreditCard, Trophy, ArrowRight } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AccordionItemProps {
  q: string;
  a: string;
}

interface FAQItem {
  q: string;
  a: string;
}

interface FAQSection {
  category: string;
  icon: ReactNode;
  items: FAQItem[];
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

interface ContactData {
  email?: string;
  website?: string;
  location?: string;
  hours?: string;
}

interface SupportPageProps {
  contact?: ContactData;
  faqs?: FAQSection[];
}

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

function AccordionItem({ q, a }: AccordionItemProps) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="border-b border-[#f0f0f0]">
      <button onClick={() => setOpen(o => !o)} className="w-full flex justify-between items-center px-5 py-[15px] bg-transparent border-none cursor-pointer text-left gap-4">
        <span className="text-[14px] font-medium text-[#1a1a1a] leading-[1.4]">{q}</span>
        <span className="text-[18px] text-ug-blue flex-shrink-0 inline-block transition-transform duration-200"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
      </button>
      {open && (
        <div className="px-5 pb-4 text-[13px] text-[#555] leading-[1.8]">{a}</div>
      )}
    </div>
  );
}

export default function SupportPage({ contact = {}, faqs: faqsProp }: SupportPageProps) {
  // Use admin-edited FAQs when available, otherwise fall back to built-in defaults
  const ACTIVE_FAQS = (faqsProp && faqsProp.length > 0) ? faqsProp : FAQS;

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [form, setForm] = useState<FormState>({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [tab, setTab] = useState<string>("faq");

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

  const categories = ["All", ...ACTIVE_FAQS.map(f => f.category)];
  const visibleFAQs = activeCategory === "All" ? ACTIVE_FAQS : ACTIVE_FAQS.filter(f => f.category === activeCategory);

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ug-navy to-ug-blue text-white py-[72px] pb-14">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.15]"
          style={{ backgroundImage: `url('${import.meta.env.BASE_URL}images/collaboration-networking.jpeg')` }}
        />
        <div className="container relative z-10">
          <span className="badge inline-block mb-[14px]" style={{ background: "rgba(201,168,76,0.25)", color: "#C9A84C" }}>
            Help Centre
          </span>
          <h1 className="text-white font-serif mb-3" style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)" }}>
            FAQ &amp; Contact
          </h1>
          <p className="text-white/75 text-base">
            Find answers or reach the Workshop Planning Committee
          </p>
        </div>
      </section>

      {/* TABS */}
      <div className="border-b border-[#e0e0e0] bg-white sticky top-16 z-10">
        <div className="container flex gap-0">
          {[{ key: "faq", label: "Frequently Asked Questions" }, { key: "contact", label: "Contact Us" }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="bg-transparent border-none cursor-pointer px-6 py-4 text-[14px] transition-all duration-150"
              style={{
                fontWeight: tab === t.key ? 600 : 400,
                color: tab === t.key ? "#1B3A6B" : "#666",
                borderBottom: tab === t.key ? "2px solid #1B3A6B" : "2px solid transparent",
              }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* ── FAQ TAB ── */}
      {tab === "faq" && (
        <div className="container section">
          <div className="flex gap-2 flex-wrap mb-9 justify-center">
            {categories.map(c => (
              <button key={c} onClick={() => setActiveCategory(c)}
                className="border-[1.5px] border-[#ddd] rounded-3xl px-[18px] py-[7px] text-[13px] font-medium cursor-pointer transition-all duration-150"
                style={{
                  background: activeCategory === c ? "#1B3A6B" : "#fff",
                  color: activeCategory === c ? "#fff" : "#555",
                }}>{c}</button>
            ))}
          </div>

          <div className="max-w-[760px] mx-auto">
            {visibleFAQs.map((section, si) => (
              <div key={si} className="mb-8">
                <div className="flex items-center gap-2.5 mb-3">
                  <span>{section.icon}</span>
                  <h3 className="font-serif text-[1.1rem] text-ug-blue">{section.category}</h3>
                </div>
                <div className="bg-white border border-[#e8e8e8] rounded-xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
                  {section.items.map((item, ii) => <AccordionItem key={ii} q={item.q} a={item.a} />)}
                </div>
              </div>
            ))}

            <div className="text-center mt-10 bg-ug-blue-light rounded-[14px] px-6 py-7">
              <p className="text-[15px] text-[#333] mb-[14px]">Still have questions?</p>
              <button onClick={() => setTab("contact")} className="btn-primary"><span className="inline-flex items-center gap-1.5">Contact the Committee <ArrowRight size={14} /></span></button>
            </div>
          </div>
        </div>
      )}

      {/* ── CONTACT TAB ── */}
      {tab === "contact" && (
        <div className="container section">
          {submitted ? (
            <div className="max-w-[520px] mx-auto text-center">
              <div className="mb-5 flex justify-center"><Mail size={64} color="#1B3A6B" /></div>
              <h2 className="mb-3">Thank you, {form.name.split(" ")[0]}!</h2>
              <p className="text-[#555] leading-[1.75] mb-6">
                Your message has been received. The Workshop Planning Committee will respond to <strong>{form.email}</strong> within 2–3 working days.
              </p>
              <button className="btn-primary" onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}>
                Send Another Message
              </button>
            </div>
          ) : (
            <div className="contact-grid grid gap-[48px] items-start" style={{ gridTemplateColumns: "1fr 360px" }}>
              <form onSubmit={handleSubmit}>
                <div className="card">
                  <h3 className="mb-1.5">Send a Message</h3>
                  <p className="text-[14px] text-[#666] mb-6">We'll get back to you within 2–3 working days.</p>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name<span className="req">*</span></label>
                      <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Your full name" />
                      {errors.name && <p className="text-[#c0392b] text-[12px] mt-1">{errors.name}</p>}
                    </div>
                    <div className="form-group">
                      <label>Email Address<span className="req">*</span></label>
                      <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="your@email.com" />
                      {errors.email && <p className="text-[#c0392b] text-[12px] mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Subject<span className="req">*</span></label>
                    <select value={form.subject} onChange={e => set("subject", e.target.value)}>
                      <option value="">-- Select a subject --</option>
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.subject && <p className="text-[#c0392b] text-[12px] mt-1">{errors.subject}</p>}
                  </div>

                  <div className="form-group">
                    <label>Message<span className="req">*</span></label>
                    <textarea value={form.message} onChange={e => set("message", e.target.value)}
                      placeholder="Describe your query in detail…" style={{ minHeight: 130 }} />
                    <div className="text-[12px] text-[#888] mt-1">{form.message.length} characters</div>
                    {errors.message && <p className="text-[#c0392b] text-[12px] mt-1">{errors.message}</p>}
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: 15, padding: "13px" }}>
                    <span className="inline-flex items-center gap-1.5">Send Message <ArrowRight size={14} /></span>
                  </button>
                </div>
              </form>

              <div className="flex flex-col gap-5">
                <div className="rounded-2xl overflow-hidden relative">
                  <img src={`${import.meta.env.BASE_URL}images/collaboration-networking.jpeg`} alt="DCS Department"
                    className="w-full object-cover block" style={{ height: 180 }} />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(15,35,71,0.85)] flex items-end px-4 py-[14px]">
                    <p className="text-white text-[13px] font-semibold m-0">Department of Computer Science, UG</p>
                  </div>
                </div>

                <div className="card">
                  <h4 className="mb-[14px] font-serif">Contact Details</h4>
                  {[
                    { icon: <Mail size={18} />,   label: "Email",    value: contact.email    || "dcsworkshop@ug.edu.gh" },
                    { icon: <Globe size={18} />,  label: "Website",  value: contact.website  || "www.cs.ug.edu.gh" },
                    { icon: <MapPin size={18} />, label: "Location", value: contact.location || "Dept. of Computer Science\nSPMS, University of Ghana\nLegon, Accra, Ghana" },
                    { icon: <Clock size={18} />,  label: "Hours",    value: contact.hours    || "Mon–Fri · 8:00 AM – 5:00 PM GMT" },
                  ].map((c, i) => (
                    <div key={i} className="flex gap-3 pb-3 mb-3" style={{ borderBottom: i < 3 ? "1px solid #f5f5f5" : "none" }}>
                      <span className="flex-shrink-0 mt-0.5 text-ug-blue">{c.icon}</span>
                      <div>
                        <div className="text-[11px] font-semibold text-[#888] uppercase tracking-[0.06em] mb-0.5">{c.label}</div>
                        <div className="text-[13px] text-[#333] leading-[1.6] whitespace-pre-line">{c.value}</div>
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
