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
    <div className="max-w-[700px]">
      <h2 className="mb-1.5 font-serif">Support Page</h2>
      <p className="text-[#666] text-sm mb-6">
        Edit FAQ content and the contact details shown on the Support page.
      </p>

      {/* ── Contact Details ── */}
      <h3 className="text-[15px] font-serif mb-3">Contact Details</h3>
      {contactSaved && (
        <div className="alert alert-success mb-4">
          <Check size={14} className="inline align-middle mr-1" /> Saved — contact info updated.
        </div>
      )}
      <div className="card mb-8">
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
          <textarea value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} className="min-h-[70px]" />
        </div>
        <button className="btn-primary" onClick={saveContact}>
          <span className="inline-flex items-center gap-[6px]">Save Contact Details <ArrowRight size={14} /></span>
        </button>
      </div>

      {/* ── FAQ Editor ── */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[15px] font-serif">FAQ Editor</h3>
        <button onClick={addCategory} className="bg-ug-blue text-white border-none rounded-lg px-[14px] py-[6px] text-[13px] cursor-pointer">+ Add Category</button>
      </div>
      <p className="text-[#666] text-[13px] mb-4">
        Add FAQ categories and questions. Leave empty to keep the built-in default FAQs on the Support page.
      </p>
      {faqSaved && (
        <div className="alert alert-success mb-4">
          <Check size={14} className="inline align-middle mr-1" /> FAQs saved.
        </div>
      )}
      {faqItems.length === 0 && (
        <div className="alert alert-info mb-4 text-[13px]">
          Currently using built-in default FAQs. Add a category above to create custom FAQs.
        </div>
      )}

      {faqItems.map((cat, ci) => (
        <div key={ci} className="card mb-4">
          {/* Category header */}
          <div className="flex gap-[10px] items-end mb-[14px]">
            <div className="form-group w-[72px] mb-0">
              <label className="text-xs">Icon (emoji)</label>
              <input
                value={cat.icon}
                onChange={(e) => updateCategory(ci, "icon", e.target.value)}
                className="p-[6px_8px] border border-[#ddd] rounded-md text-[20px] text-center w-full"
              />
            </div>
            <div className="form-group flex-1 mb-0">
              <label className="text-xs">Category Name</label>
              <input
                value={cat.category}
                onChange={(e) => updateCategory(ci, "category", e.target.value)}
                className="w-full p-[6px_8px] border border-[#ddd] rounded-md text-[13px]"
              />
            </div>
            <button onClick={() => removeCategory(ci)} className="bg-[#fdecea] text-[#c0392b] border-none rounded-md py-[7px] px-[14px] text-xs cursor-pointer mb-0">
              Remove Category
            </button>
          </div>

          {/* Q&A items */}
          {cat.items.map((item, qi) => (
            <div key={qi} className="border border-[#e8e8e8] rounded-lg p-[12px_14px] mb-2 bg-[#fafafa]">
              <div className="flex justify-between mb-2">
                <span className="text-xs text-[#888] font-medium">Q&A {qi + 1}</span>
                <button onClick={() => removeItem(ci, qi)} className="bg-[#fdecea] text-[#c0392b] border-none rounded-[5px] px-2 py-[2px] text-[11px] cursor-pointer">Remove</button>
              </div>
              <div className="form-group mb-2">
                <label className="text-xs">Question</label>
                <input
                  value={item.q}
                  onChange={(e) => updateItem(ci, qi, "q", e.target.value)}
                  placeholder="e.g. Who can register for the workshop?"
                  className="w-full p-[6px_8px] border border-[#ddd] rounded-md text-[13px]"
                />
              </div>
              <div className="form-group mb-0">
                <label className="text-xs">Answer</label>
                <textarea
                  value={item.a}
                  onChange={(e) => updateItem(ci, qi, "a", e.target.value)}
                  placeholder="Full answer text…"
                  className="w-full p-[6px_8px] border border-[#ddd] rounded-md text-[13px] min-h-[70px] resize-y"
                />
              </div>
            </div>
          ))}

          <button onClick={() => addItem(ci)} className="bg-ug-blue-light text-ug-blue border-none rounded-[7px] py-[7px] px-[14px] text-[13px] cursor-pointer mt-1">
            + Add Question
          </button>
        </div>
      ))}

      {faqItems.length > 0 && (
        <button className="btn-primary mb-2" onClick={saveFaqs}>
          <span className="inline-flex items-center gap-[6px]">Save FAQs <ArrowRight size={14} /></span>
        </button>
      )}
    </div>
  );
}
