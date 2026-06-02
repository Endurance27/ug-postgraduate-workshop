import { useState, useEffect } from "react";
import { Check, ArrowRight } from "lucide-react";
import { useAdminContext } from "../../../context/AdminContext";

export default function SupportAdminPanel() {
  const { siteContent, updateContent } = useAdminContext();
  const contact = (siteContent.contact as Record<string, any>) || {};
  const onChange = (v: unknown) => updateContent("contact", v);
  const faqs = (siteContent.faqs as any[]) || [];
  const onChangeFaqs = (v: unknown) => updateContent("faqs", v);
  const [form, setForm] = useState({ email: "", website: "", location: "", hours: "", whatsapp: "", phone: "", ...contact });
  const [contactSaved, setContactSaved] = useState(false);

  const [faqItems, setFaqItems] = useState(() =>
    faqs.length > 0 ? faqs.map((f) => ({ ...f, items: [...(f.items || [])] })) : []
  );
  const [faqSaved, setFaqSaved] = useState(false);

  useEffect(() => { setForm((f) => ({ ...f, ...contact })); }, [contact]);
  useEffect(() => {
    if (faqs.length > 0) setFaqItems(faqs.map((f) => ({ ...f, items: [...(f.items || [])] })));
  }, [faqs]);

  const saveContact = () => { onChange(form); setContactSaved(true); setTimeout(() => setContactSaved(false), 2500); };
  const saveFaqs = () => { onChangeFaqs(faqItems); setFaqSaved(true); setTimeout(() => setFaqSaved(false), 2500); };

  // FAQ CRUD
  const addCategory = () => setFaqItems((arr) => [...arr, { category: "New Category", icon: "❓", items: [] }]);
  const removeCategory = (ci) => setFaqItems((arr) => arr.filter((_, i) => i !== ci));
  const updateCategory = (ci, field, val) =>
    setFaqItems((arr) => arr.map((c, i) => i === ci ? { ...c, [field]: val } : c));

  const addItem = (ci) =>
    setFaqItems((arr) => arr.map((c, i) => i === ci ? { ...c, items: [...c.items, { q: "", a: "" }] } : c));
  const removeItem = (ci, qi) =>
    setFaqItems((arr) => arr.map((c, i) => i === ci ? { ...c, items: c.items.filter((_, j) => j !== qi) } : c));
  const updateItem = (ci, qi, field, val) =>
    setFaqItems((arr) =>
      arr.map((c, i) => i === ci ? { ...c, items: c.items.map((item, j) => j === qi ? { ...item, [field]: val } : item) } : c)
    );

  return (
    <div style={{ maxWidth: 700 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>Support Page</h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>
        Edit FAQ content and the contact details shown on the Support page.
      </p>

      {/* ── Contact Details ── */}
      <h3 style={{ fontSize: 15, fontFamily: "Playfair Display, serif", marginBottom: 12 }}>Contact Details</h3>
      {contactSaved && (
        <div className="alert alert-success" style={{ marginBottom: 16 }}>
          <Check size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} /> Saved — contact info updated.
        </div>
      )}
      <div className="card" style={{ marginBottom: 32 }}>
        <div className="form-row">
          <div className="form-group">
            <label>Email Address</label>
            <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="dcsworkshop@ug.edu.gh" />
          </div>
          <div className="form-group">
            <label>Website</label>
            <input value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} placeholder="www.cs.ug.edu.gh" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Phone Number</label>
            <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+233 (0) 536 909 471" />
          </div>
          <div className="form-group">
            <label>WhatsApp Number</label>
            <input value={form.whatsapp} onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))} placeholder="233XXXXXXXXX" />
          </div>
        </div>
        <div className="form-group">
          <label>Office Hours</label>
          <input value={form.hours} onChange={(e) => setForm((f) => ({ ...f, hours: e.target.value }))} placeholder="Mon–Fri · 8:00 AM – 5:00 PM GMT" />
        </div>
        <div className="form-group">
          <label>Location / Address</label>
          <textarea value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} style={{ minHeight: 70 }} />
        </div>
        <button className="btn-primary" onClick={saveContact}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>Save Contact Details <ArrowRight size={14} /></span>
        </button>
      </div>

      {/* ── FAQ Editor ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h3 style={{ fontSize: 15, fontFamily: "Playfair Display, serif" }}>FAQ Editor</h3>
        <button onClick={addCategory} style={{ background: "#1B3A6B", color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer" }}>+ Add Category</button>
      </div>
      <p style={{ color: "#666", fontSize: 13, marginBottom: 16 }}>
        Add FAQ categories and questions. Leave empty to keep the built-in default FAQs on the Support page.
      </p>
      {faqSaved && (
        <div className="alert alert-success" style={{ marginBottom: 16 }}>
          <Check size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} /> FAQs saved.
        </div>
      )}
      {faqItems.length === 0 && (
        <div className="alert alert-info" style={{ marginBottom: 16, fontSize: 13 }}>
          Currently using built-in default FAQs. Add a category above to create custom FAQs.
        </div>
      )}

      {faqItems.map((cat, ci) => (
        <div key={ci} className="card" style={{ marginBottom: 16 }}>
          {/* Category header */}
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 14 }}>
            <div className="form-group" style={{ width: 72, marginBottom: 0 }}>
              <label style={{ fontSize: 12 }}>Icon (emoji)</label>
              <input
                value={cat.icon}
                onChange={(e) => updateCategory(ci, "icon", e.target.value)}
                style={{ padding: "6px 8px", border: "1px solid #ddd", borderRadius: 6, fontSize: 20, textAlign: "center", width: "100%" }}
              />
            </div>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label style={{ fontSize: 12 }}>Category Name</label>
              <input
                value={cat.category}
                onChange={(e) => updateCategory(ci, "category", e.target.value)}
                style={{ width: "100%", padding: "6px 8px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13 }}
              />
            </div>
            <button onClick={() => removeCategory(ci)} style={{ background: "#fdecea", color: "#c0392b", border: "none", borderRadius: 6, padding: "7px 14px", fontSize: 12, cursor: "pointer", marginBottom: 0 }}>
              Remove Category
            </button>
          </div>

          {/* Q&A items */}
          {cat.items.map((item, qi) => (
            <div key={qi} style={{ border: "1px solid #e8e8e8", borderRadius: 8, padding: "12px 14px", marginBottom: 8, background: "#fafafa" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "#888", fontWeight: 500 }}>Q&A {qi + 1}</span>
                <button onClick={() => removeItem(ci, qi)} style={{ background: "#fdecea", color: "#c0392b", border: "none", borderRadius: 5, padding: "2px 8px", fontSize: 11, cursor: "pointer" }}>Remove</button>
              </div>
              <div className="form-group" style={{ marginBottom: 8 }}>
                <label style={{ fontSize: 12 }}>Question</label>
                <input
                  value={item.q}
                  onChange={(e) => updateItem(ci, qi, "q", e.target.value)}
                  placeholder="e.g. Who can register for the workshop?"
                  style={{ width: "100%", padding: "6px 8px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13 }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 12 }}>Answer</label>
                <textarea
                  value={item.a}
                  onChange={(e) => updateItem(ci, qi, "a", e.target.value)}
                  placeholder="Full answer text…"
                  style={{ width: "100%", padding: "6px 8px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13, minHeight: 70, resize: "vertical" }}
                />
              </div>
            </div>
          ))}

          <button onClick={() => addItem(ci)} style={{ background: "#E5EAF3", color: "#1B3A6B", border: "none", borderRadius: 7, padding: "7px 14px", fontSize: 13, cursor: "pointer", marginTop: 4 }}>
            + Add Question
          </button>
        </div>
      ))}

      {faqItems.length > 0 && (
        <button className="btn-primary" onClick={saveFaqs} style={{ marginBottom: 8 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>Save FAQs <ArrowRight size={14} /></span>
        </button>
      )}
    </div>
  );
}
