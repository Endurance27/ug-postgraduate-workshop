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
    <div className="max-w-[680px]">
      <h2 className="mb-[6px] font-serif">
        About Page
      </h2>
      <p className="text-[#666] text-sm mb-6">
        Edit the overview text, captions, and key messages shown on the About page.
      </p>

      {/* ── Validation errors ── */}
      {validationErrors.length > 0 && (
        <div className="bg-[#fff3f3] border border-[#f5b8b8] rounded-[10px] py-3 px-4 mb-5">
          {validationErrors.map((err) => (
            <div
              key={err}
              className="flex items-center gap-2 text-[#c0392b] text-[13px] mb-1"
            >
              <AlertCircle size={14} className="shrink-0" />
              {err}
            </div>
          ))}
        </div>
      )}

      {/* ── Save error ── */}
      {saveError && (
        <div className="bg-[#fff3f3] border border-[#f5b8b8] rounded-[10px] py-[10px] px-4 mb-5 text-[#c0392b] text-[13px] flex items-center gap-2">
          <AlertCircle size={14} className="shrink-0" />
          {saveError}
        </div>
      )}

      {/* ── Success message ── */}
      {saved && (
        <div className="alert alert-success mb-5 flex items-center gap-2">
          <Check size={14} className="shrink-0" />
          About content saved to Firestore and is now live on the website.
        </div>
      )}

      {/* ── Hero & Overview ── */}
      <div className="card mb-5">
        <h4 className="mb-4 font-serif">
          Hero &amp; Overview
        </h4>
        <div className="form-row">
          <div className="form-group">
            <label>
              Hero Badge Text <span className="text-[#c0392b]">*</span>
            </label>
            <input {...field("badge")} placeholder="2nd Annual Edition" />
          </div>
        </div>
        <div className="form-group">
          <label>
            Section Heading <span className="text-[#c0392b]">*</span>
          </label>
          <input
            {...field("title")}
            placeholder="A Platform for Academic Excellence…"
          />
        </div>
        <div className="form-group">
          <label>
            First Paragraph <span className="text-[#c0392b]">*</span>
          </label>
          <textarea
            {...field("desc1")}
            className="min-h-[80px]"
            placeholder="Introductory paragraph about the workshop…"
          />
        </div>
        <div className="form-group">
          <label>
            Second Paragraph <span className="text-[#c0392b]">*</span>
          </label>
          <textarea
            {...field("desc2")}
            className="min-h-[80px]"
            placeholder="Continued description…"
          />
        </div>
      </div>

      {/* ── Image Captions ── */}
      <div className="card mb-5">
        <h4 className="mb-4 font-serif">
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
            className="min-h-[70px]"
            placeholder="Brief note about this edition compared to the previous…"
          />
        </div>
      </div>

      <div className="bg-ug-surface rounded-xl py-[14px] px-[18px] mb-5 text-[13px] text-[#666]">
        <strong className="text-ug-blue">Hero background image</strong> — change via{" "}
        <strong>Site Images → Research Presentations</strong> in Admin Tools.
      </div>

      <button
        className="btn-primary"
        onClick={save}
        disabled={saving}
        style={{ opacity: saving ? 0.7 : 1, cursor: saving ? "not-allowed" : "pointer" }}
      >
        <span className="inline-flex items-center gap-[6px]">
          {saving ? (
            <>
              <Loader size={14} className="animate-spin" />
              Saving…
            </>
          ) : (
            <>
              Save About Page <ArrowRight size={14} />
            </>
          )}
        </span>
      </button>
    </div>
  );
}
