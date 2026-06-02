import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { useAdminContext } from "../../../context/AdminContext";

export default function FooterPanel() {
  const { siteContent, updateContent } = useAdminContext();
  const footer = (siteContent.footer as Record<string, any>) || {};
  const onChange = (v: unknown) => updateContent("footer", v);
  const [form, setForm] = useState({
    tagline: footer.tagline || "",
    dates: footer.dates || "",
    organizers: (footer.organizers || []).join("\n"),
    sponsors: (footer.sponsors || []).join("\n"),
    publication: footer.publication || "",
  });
  const [saved, setSaved] = useState(false);

  const save = () => {
    onChange({
      tagline: form.tagline,
      dates: form.dates,
      organizers: form.organizers
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      sponsors: form.sponsors
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      publication: form.publication,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-[600px]">
      <h2 className="mb-1.5 font-serif">Footer</h2>
      <p className="text-[#666] text-sm mb-6">
        Edit the footer tagline, organizers, sponsors, and publication details.
      </p>
      {saved && (
        <div className="alert alert-success mb-5">
          <Check size={14} className="inline align-middle mr-1" /> Saved.
        </div>
      )}

      <div className="card">
        <div className="form-row">
          <div className="form-group">
            <label>Tagline</label>
            <input
              value={form.tagline}
              onChange={(e) =>
                setForm((f) => ({ ...f, tagline: e.target.value }))
              }
              placeholder="2nd Annual Postgraduate Students Workshop"
            />
          </div>
          <div className="form-group">
            <label>Dates</label>
            <input
              value={form.dates}
              onChange={(e) =>
                setForm((f) => ({ ...f, dates: e.target.value }))
              }
              placeholder="27–29 August 2026 · Hybrid Format"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Organizers (one per line)</label>
            <textarea
              value={form.organizers}
              onChange={(e) =>
                setForm((f) => ({ ...f, organizers: e.target.value }))
              }
              className="min-h-[80px]"
            />
          </div>
          <div className="form-group">
            <label>Sponsors &amp; Funders (one per line)</label>
            <textarea
              value={form.sponsors}
              onChange={(e) =>
                setForm((f) => ({ ...f, sponsors: e.target.value }))
              }
              className="min-h-[80px]"
            />
          </div>
        </div>
        <div className="form-group max-w-[280px]">
          <label>Publication Partner</label>
          <input
            value={form.publication}
            onChange={(e) =>
              setForm((f) => ({ ...f, publication: e.target.value }))
            }
            placeholder="CBAS Journal"
          />
        </div>
        <button className="btn-primary" onClick={save}>
          <span className="inline-flex items-center gap-1.5">
            Save Footer <ArrowRight size={14} />
          </span>
        </button>
      </div>
    </div>
  );
}
