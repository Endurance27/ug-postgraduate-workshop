import { useState, useRef } from "react";
import { Image, Upload, Check, ArrowRight } from "lucide-react";
import {
  auth,
  storage,
  storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "../../../firebase";

// ─── Shared constants ─────────────────────────────────────────────────────────

export const TRACK_OPTIONS = [
  "",
  "CS Track",
  "Data Science Track",
  "Technical Track",
  "IT for Business Track",
  "Poster Track",
];
export const TYPE_OPTIONS = ["plenary", "parallel", "track", "break"];

let _nextId = 9000;
export const uid = () => ++_nextId;

// ─── Storage helpers ──────────────────────────────────────────────────────────

export async function uploadToStorage(file) {
  if (!storage || !storageRef || !uploadBytesResumable || !getDownloadURL) {
    throw new Error(
      "Firebase Storage is not configured. Enable it in the Firebase console and set security rules.",
    );
  }
  if (!auth.currentUser) {
    throw new Error("Please sign in before uploading images.");
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Please choose an image smaller than 10 MB.");
  }
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `workshop-images/${auth.currentUser.uid}/${Date.now()}-${safeName}`;
  const ref = storageRef(storage, path);
  const task = uploadBytesResumable(ref, file);
  await new Promise<void>((resolve, reject) =>
    task.on("state_changed", null, reject, () => resolve()),
  );
  return getDownloadURL(task.snapshot.ref);
}

export function storageErrorMsg(error) {
  const map = {
    "storage/unauthorized":
      "Firebase Storage rejected the upload. Check Storage rules for signed-in admins.",
    "storage/canceled": "The upload was cancelled.",
    "storage/quota-exceeded": "Firebase Storage quota has been exceeded.",
    "storage/retry-limit-exceeded": "The upload timed out. Please try again.",
    "storage/invalid-format": "Please choose a valid image file.",
  };
  return (
    map[error?.code] ||
    error?.message ||
    "Image upload failed. Check Firebase Storage and try again."
  );
}

// ─── ToggleRow ────────────────────────────────────────────────────────────────

export function ToggleRow({ label, desc, value, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 0",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <div>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 12, color: "#888" }}>{desc}</div>
      </div>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 44,
          height: 24,
          borderRadius: 12,
          border: "none",
          cursor: "pointer",
          background: value ? "#1B6B3A" : "#ccc",
          position: "relative",
          transition: "background 0.2s",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#fff",
            position: "absolute",
            top: 3,
            left: value ? 23 : 3,
            transition: "left 0.2s",
            boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
          }}
        />
      </button>
    </div>
  );
}

// ─── ImageUploadField ─────────────────────────────────────────────────────────

export function ImageUploadField({ value, onChange, label, placeholder = "" }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const isBase64 = value && value.startsWith("data:");

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = "";
    setUploading(true);
    try {
      const url = await uploadToStorage(file);
      onChange(url);
    } catch (err) {
      console.error("Storage upload failed:", err);
      alert(storageErrorMsg(err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {label && (
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "#333",
            marginBottom: 6,
          }}
        >
          {label}
        </div>
      )}
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div
          style={{
            width: 96,
            height: 68,
            borderRadius: 8,
            overflow: "hidden",
            border: "1px solid #ddd",
            flexShrink: 0,
            background: "#f5f5f5",
          }}
        >
          {value && !isBase64 ? (
            <img
              src={value}
              alt="preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Image size={24} color="#ccc" />
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <input
            value={!isBase64 && value ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "/images/... or https://..."}
            style={{
              width: "100%",
              padding: "7px 10px",
              border: "1.5px solid #ddd",
              borderRadius: 7,
              fontSize: 13,
              marginBottom: 6,
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current.click()}
            disabled={uploading}
            style={{
              background: "#E5EAF3",
              color: "#1B3A6B",
              border: "1px solid #b0bdd8",
              borderRadius: 7,
              padding: "5px 14px",
              fontSize: 12,
              cursor: uploading ? "not-allowed" : "pointer",
              fontWeight: 500,
              opacity: uploading ? 0.65 : 1,
            }}
          >
            <span
              style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
            >
              <Upload size={13} /> {uploading ? "Uploading…" : "Upload Image"}
            </span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFile}
          />
        </div>
      </div>
    </div>
  );
}

// ─── EventSettings ────────────────────────────────────────────────────────────

export function EventSettings({ event, onChange }) {
  const [form, setForm] = useState({ ...event });
  const [saved, setSaved] = useState(false);

  const save = () => {
    onChange(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ maxWidth: 680 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>
        Event Settings
      </h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 28 }}>
        Changes here appear immediately on the live website.
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
          Settings saved and live on the site.
        </div>
      )}

      <div className="card">
        <div className="form-row">
          <div className="form-group">
            <label>Event Title</label>
            <input
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
            />
          </div>
          <div className="form-group">
            <label>Edition</label>
            <input
              value={form.edition}
              onChange={(e) =>
                setForm((f) => ({ ...f, edition: e.target.value }))
              }
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Dates</label>
            <input
              value={form.dates}
              onChange={(e) =>
                setForm((f) => ({ ...f, dates: e.target.value }))
              }
              placeholder="e.g. 27–29 August 2026"
            />
          </div>
          <div className="form-group">
            <label>Venue</label>
            <input
              value={form.venue}
              onChange={(e) =>
                setForm((f) => ({ ...f, venue: e.target.value }))
              }
            />
          </div>
        </div>
        <div className="form-group" style={{ maxWidth: 220 }}>
          <label>Registration Fee (GHS)</label>
          <input
            type="number"
            min="0"
            value={form.fee}
            onChange={(e) =>
              setForm((f) => ({ ...f, fee: Number(e.target.value) }))
            }
          />
        </div>
        <div className="form-group">
          <label>Event Description</label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            style={{ minHeight: 90 }}
          />
        </div>

        <div
          style={{
            background: "#f8f9fa",
            borderRadius: 10,
            padding: "16px 20px",
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
            Access Controls
          </div>
          <ToggleRow
            label="Registration Open"
            desc="Participants can register"
            value={form.registrationOpen}
            onChange={(v) => setForm((f) => ({ ...f, registrationOpen: v }))}
          />
          <ToggleRow
            label="Submissions Open"
            desc="Participants can submit papers"
            value={form.submissionsOpen}
            onChange={(v) => setForm((f) => ({ ...f, submissionsOpen: v }))}
          />
        </div>

        <button className="btn-primary" onClick={save}>
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            Save Changes <ArrowRight size={14} />
          </span>
        </button>
      </div>
    </div>
  );
}
