import { useState, useEffect } from "react";
import { Check, ArrowRight } from "lucide-react";
import { useAdminContext } from "../../../context/AdminContext";

export default function ContactPanel() {
  const { siteContent, updateContent } = useAdminContext();
  const contact = (siteContent.contact as Record<string, any>) || {};
  const onChange = (v: unknown) => updateContent("contact", v);
  const [form, setForm] = useState({
    email: "",
    website: "",
    location: "",
    hours: "",
    whatsapp: "",
    phone: "",
    ...contact,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm((f) => ({ ...f, ...contact }));
  }, [contact]);

  const save = () => {
    onChange(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-[640px]">
      <h2 className="mb-1.5 font-serif">Contact Info</h2>
      <p className="text-[#666] text-sm mb-2">
        These details appear on the Contact page, Support page contact tab, and
        the WhatsApp float button.
      </p>
      <div className="alert alert-info mb-5 text-[13px]">
        Changes here update the <strong>Contact</strong> page,{" "}
        <strong>Support</strong> page, and <strong>WhatsApp</strong> button
        across the whole site.
      </div>
      {saved && (
        <div className="alert alert-success mb-5">
          <Check
            size={14}
            className="inline align-middle mr-1"
          />{" "}
          Saved — contact details updated site-wide.
        </div>
      )}

      <div className="card">
        <div className="form-row">
          <div className="form-group">
            <label>Email Address</label>
            <input
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              placeholder="dcsworkshop@ug.edu.gh"
            />
          </div>
          <div className="form-group">
            <label>Website</label>
            <input
              value={form.website}
              onChange={(e) =>
                setForm((f) => ({ ...f, website: e.target.value }))
              }
              placeholder="www.cs.ug.edu.gh"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Phone Number</label>
            <input
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
              placeholder="+233 (0) 536 909 471"
            />
          </div>
          <div className="form-group">
            <label>WhatsApp Number</label>
            <input
              value={form.whatsapp}
              onChange={(e) =>
                setForm((f) => ({ ...f, whatsapp: e.target.value }))
              }
              placeholder="233XXXXXXXXX (no + or spaces)"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Office Hours</label>
          <input
            value={form.hours}
            onChange={(e) => setForm((f) => ({ ...f, hours: e.target.value }))}
            placeholder="Mon–Fri · 8:00 AM – 5:00 PM GMT"
          />
        </div>
        <div className="form-group">
          <label>Location / Address</label>
          <textarea
            value={form.location}
            onChange={(e) =>
              setForm((f) => ({ ...f, location: e.target.value }))
            }
            className="min-h-[80px]"
          />
        </div>
        <button className="btn-primary" onClick={save}>
          <span className="inline-flex items-center gap-1.5">
            Save Contact Info <ArrowRight size={14} />
          </span>
        </button>
      </div>
    </div>
  );
}
