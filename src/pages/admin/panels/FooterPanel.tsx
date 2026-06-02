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
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>
        Footer
      </h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>
        Edit the footer tagline, organizers, sponsors, and publication details.
      </p>
      {saved && (
        <div className="alert alert-success" style={{ marginBottom: 20 }}>
          <Check
            size={14}
            style={{
              display: "inline",
              verticalAlign: "middle",
              marginRight: 4,
            }}
          />{" "}
          Saved.
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
              style={{ minHeight: 80 }}
            />
          </div>
          <div className="form-group">
            <label>Sponsors &amp; Funders (one per line)</label>
            <textarea
              value={form.sponsors}
              onChange={(e) =>
                setForm((f) => ({ ...f, sponsors: e.target.value }))
              }
              style={{ minHeight: 80 }}
            />
          </div>
        </div>
        <div className="form-group" style={{ maxWidth: 280 }}>
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
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            Save Footer <ArrowRight size={14} />
          </span>
        </button>
      </div>
    </div>
  );
}
