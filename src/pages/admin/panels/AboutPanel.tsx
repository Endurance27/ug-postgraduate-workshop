import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { useAdminContext } from "../../../context/AdminContext";

export default function AboutPanel() {
  const { siteContent, updateContent } = useAdminContext();
  const about = (siteContent.about as Record<string, any>) || {};
  const onChange = (v: unknown) => updateContent("about", v);
  const [form, setForm] = useState({
    badge: about.badge || "2nd Annual Edition",
    title:
      about.title ||
      "A Platform for Academic Excellence in Postgraduate Research",
    desc1: about.desc1 || "",
    desc2: about.desc2 || "",
    imageCaption1: about.imageCaption1 || "Advancing Research at UG",
    imageCaption2: about.imageCaption2 || "Dept. of Computer Science · SPMS",
    cardText: about.cardText || "",
  });
  const [saved, setSaved] = useState(false);
  const save = () => {
    onChange(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ maxWidth: 680 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>
        About Page
      </h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>
        Edit the overview text, captions, and key messages shown on the About
        page.
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
          Saved — changes are live on the About page.
        </div>
      )}

      <div className="card" style={{ marginBottom: 20 }}>
        <h4 style={{ marginBottom: 16, fontFamily: "Playfair Display, serif" }}>
          Hero &amp; Overview
        </h4>
        <div className="form-row">
          <div className="form-group">
            <label>Hero Badge Text</label>
            <input
              value={form.badge}
              onChange={(e) =>
                setForm((f) => ({ ...f, badge: e.target.value }))
              }
              placeholder="2nd Annual Edition"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Section Heading</label>
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="A Platform for Academic Excellence…"
          />
        </div>
        <div className="form-group">
          <label>First Paragraph</label>
          <textarea
            value={form.desc1}
            onChange={(e) => setForm((f) => ({ ...f, desc1: e.target.value }))}
            style={{ minHeight: 80 }}
            placeholder="Introductory paragraph about the workshop…"
          />
        </div>
        <div className="form-group">
          <label>Second Paragraph</label>
          <textarea
            value={form.desc2}
            onChange={(e) => setForm((f) => ({ ...f, desc2: e.target.value }))}
            style={{ minHeight: 80 }}
            placeholder="Continued description…"
          />
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h4 style={{ marginBottom: 16, fontFamily: "Playfair Display, serif" }}>
          Image Captions
        </h4>
        <div className="form-row">
          <div className="form-group">
            <label>Caption Line 1</label>
            <input
              value={form.imageCaption1}
              onChange={(e) =>
                setForm((f) => ({ ...f, imageCaption1: e.target.value }))
              }
              placeholder="Advancing Research at UG"
            />
          </div>
          <div className="form-group">
            <label>Caption Line 2</label>
            <input
              value={form.imageCaption2}
              onChange={(e) =>
                setForm((f) => ({ ...f, imageCaption2: e.target.value }))
              }
              placeholder="Dept. of Computer Science · SPMS"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Info Card Text</label>
          <textarea
            value={form.cardText}
            onChange={(e) =>
              setForm((f) => ({ ...f, cardText: e.target.value }))
            }
            style={{ minHeight: 70 }}
            placeholder="Brief note about this edition compared to the previous…"
          />
        </div>
      </div>

      <div
        style={{
          background: "#f8f9fa",
          borderRadius: 12,
          padding: "14px 18px",
          marginBottom: 20,
          fontSize: 13,
          color: "#666",
        }}
      >
        <strong style={{ color: "#1B3A6B" }}>Hero background image</strong> —
        change via <strong>Site Images → Research Presentations</strong> in
        Admin Tools.
      </div>

      <button className="btn-primary" onClick={save}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          Save About Page <ArrowRight size={14} />
        </span>
      </button>
    </div>
  );
}
