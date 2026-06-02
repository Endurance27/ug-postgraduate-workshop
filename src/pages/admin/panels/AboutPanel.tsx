import { useState } from "react";
import { Check, ArrowRight, AlertCircle, Loader } from "lucide-react";
import { useAdminContext } from "../../../context/AdminContext";
import { db, doc, setDoc } from "../../../firebase";

// ─── Validation ───────────────────────────────────────────────────────────────
function validate(form: Record<string, string>): string[] {
  const errors: string[] = [];
  if (!form.badge.trim())  errors.push("Hero Badge Text is required.");
  if (!form.title.trim())  errors.push("Section Heading is required.");
  if (!form.desc1.trim())  errors.push("First Paragraph is required.");
  if (!form.desc2.trim())  errors.push("Second Paragraph is required.");
  return errors;
}

export default function AboutPanel() {
  const { siteContent, updateContent } = useAdminContext();
  const about = (siteContent.about as Record<string, string>) || {};

  const [form, setForm] = useState({
    badge:         about.badge         || "2nd Annual Edition",
    title:         about.title         || "A Platform for Academic Excellence in Postgraduate Research",
    desc1:         about.desc1         || "",
    desc2:         about.desc2         || "",
    imageCaption1: about.imageCaption1 || "Advancing Research at UG",
    imageCaption2: about.imageCaption2 || "Dept. of Computer Science · SPMS",
    cardText:      about.cardText      || "",
  });

  const [saving,           setSaving]           = useState(false);
  const [saved,            setSaved]            = useState(false);
  const [saveError,        setSaveError]        = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const save = async () => {
    // ── Validate ──
    const errors = validate(form);
    if (errors.length > 0) {
      setValidationErrors(errors);
      setSaveError("");
      return;
    }
    setValidationErrors([]);
    setSaveError("");
    setSaving(true);

    try {
      // ── Write to Firestore about/main (upsert) ──
      if (db && doc && setDoc) {
        await setDoc(doc(db, "about", "main"), form, { merge: true });
      }
      // ── Keep local siteContent in sync ──
      updateContent("about", form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setSaveError("Save failed: " + msg);
    } finally {
      setSaving(false);
    }
  };

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  return (
    <div style={{ maxWidth: 680 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>
        About Page
      </h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>
        Edit the overview text, captions, and key messages shown on the About page.
      </p>

      {/* ── Validation errors ── */}
      {validationErrors.length > 0 && (
        <div
          style={{
            background: "#fff3f3",
            border: "1px solid #f5b8b8",
            borderRadius: 10,
            padding: "12px 16px",
            marginBottom: 20,
          }}
        >
          {validationErrors.map((err) => (
            <div
              key={err}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#c0392b",
                fontSize: 13,
                marginBottom: 4,
              }}
            >
              <AlertCircle size={14} style={{ flexShrink: 0 }} />
              {err}
            </div>
          ))}
        </div>
      )}

      {/* ── Save error ── */}
      {saveError && (
        <div
          style={{
            background: "#fff3f3",
            border: "1px solid #f5b8b8",
            borderRadius: 10,
            padding: "10px 16px",
            marginBottom: 20,
            color: "#c0392b",
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <AlertCircle size={14} style={{ flexShrink: 0 }} />
          {saveError}
        </div>
      )}

      {/* ── Success message ── */}
      {saved && (
        <div
          className="alert alert-success"
          style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}
        >
          <Check size={14} style={{ flexShrink: 0 }} />
          About content saved to Firestore and is now live on the website.
        </div>
      )}

      {/* ── Hero & Overview ── */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h4 style={{ marginBottom: 16, fontFamily: "Playfair Display, serif" }}>
          Hero &amp; Overview
        </h4>
        <div className="form-row">
          <div className="form-group">
            <label>
              Hero Badge Text <span style={{ color: "#c0392b" }}>*</span>
            </label>
            <input {...field("badge")} placeholder="2nd Annual Edition" />
          </div>
        </div>
        <div className="form-group">
          <label>
            Section Heading <span style={{ color: "#c0392b" }}>*</span>
          </label>
          <input
            {...field("title")}
            placeholder="A Platform for Academic Excellence…"
          />
        </div>
        <div className="form-group">
          <label>
            First Paragraph <span style={{ color: "#c0392b" }}>*</span>
          </label>
          <textarea
            {...field("desc1")}
            style={{ minHeight: 80 }}
            placeholder="Introductory paragraph about the workshop…"
          />
        </div>
        <div className="form-group">
          <label>
            Second Paragraph <span style={{ color: "#c0392b" }}>*</span>
          </label>
          <textarea
            {...field("desc2")}
            style={{ minHeight: 80 }}
            placeholder="Continued description…"
          />
        </div>
      </div>

      {/* ── Image Captions ── */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h4 style={{ marginBottom: 16, fontFamily: "Playfair Display, serif" }}>
          Image Captions
        </h4>
        <div className="form-row">
          <div className="form-group">
            <label>Caption Line 1</label>
            <input {...field("imageCaption1")} placeholder="Advancing Research at UG" />
          </div>
          <div className="form-group">
            <label>Caption Line 2</label>
            <input
              {...field("imageCaption2")}
              placeholder="Dept. of Computer Science · SPMS"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Info Card Text</label>
          <textarea
            {...field("cardText")}
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
        <strong style={{ color: "#1B3A6B" }}>Hero background image</strong> — change via{" "}
        <strong>Site Images → Research Presentations</strong> in Admin Tools.
      </div>

      <button
        className="btn-primary"
        onClick={save}
        disabled={saving}
        style={{ opacity: saving ? 0.7 : 1, cursor: saving ? "not-allowed" : "pointer" }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          {saving ? (
            <>
              <Loader size={14} style={{ animation: "spin 1s linear infinite" }} />
              Saving…
            </>
          ) : (
            <>
              Save About Page <ArrowRight size={14} />
            </>
          )}
        </span>
      </button>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
