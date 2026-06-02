import { useState, useRef } from "react";
import { Image, Upload, Check, ArrowRight } from "lucide-react";
import { uploadToStorage, storageErrorMsg } from "./shared";

export default function ImagesPanel({ images = {} as Record<string, any>, onChange }) {
  const [form, setForm] = useState({
    workshop: images.workshop || "/images/workshop-sessions.jpg",
    research: images.research || "/images/research-presentations.jpg",
    networking: images.networking || "/images/collaboration-networking.jpeg",
    students: images.students || "/images/dcs-research.jpg",
  });
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(null);
  const fileRef = useRef(null);
  const uploadingKeyRef = useRef(null);

  const save = () => {
    onChange(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const triggerUpload = (key) => {
    uploadingKeyRef.current = key;
    fileRef.current.click();
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file || !uploadingKeyRef.current) return;
    const key = uploadingKeyRef.current;
    e.target.value = "";
    setUploading(key);
    try {
      const url = await uploadToStorage(file);
      setForm((f) => {
        const next = { ...f, [key]: url };
        onChange(next);
        return next;
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Upload failed:", err);
      alert(storageErrorMsg(err));
    } finally {
      setUploading(null);
    }
  };

  const IMAGE_DEFS = [
    {
      key: "workshop",
      label: "Workshop Sessions",
      usedOn: "Home hero background · Home photo strip · Home testimonials",
    },
    {
      key: "research",
      label: "Research Presentations",
      usedOn: "Home 'About' section · Home photo strip · About page hero",
    },
    {
      key: "networking",
      label: "Networking & Events",
      usedOn:
        "Home CTA background · Contact page · Speakers page · Sponsors page",
    },
    {
      key: "students",
      label: "Students / DCS Research",
      usedOn:
        "Home hero card photo · Home awards background · Home testimonials",
    },
  ];

  return (
    <div style={{ maxWidth: 760 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>
        Site Images
      </h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 8 }}>
        These 4 images appear across all pages of the site. Upload a new image
        or paste a URL — every page updates instantly.
      </p>
      <div
        className="alert alert-info"
        style={{ marginBottom: 24, fontSize: 13 }}
      >
        <strong>Upload:</strong> click "Upload" to pick a file from your device.{" "}
        <strong>URL:</strong> paste <code>/images/yourfile.jpg</code> for files
        in <code>public/images/</code>, or any direct image link.
      </div>
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
          Images saved and live on the site.
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFile}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {IMAGE_DEFS.map((def) => {
          const val = form[def.key];
          const isUploading = uploading === def.key;
          return (
            <div
              key={def.key}
              style={{
                background: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: 14,
                padding: "20px 22px",
                display: "flex",
                gap: 20,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 140,
                  height: 96,
                  borderRadius: 10,
                  overflow: "hidden",
                  border: "1px solid #e0e0e0",
                  flexShrink: 0,
                  background: "#f5f5f5",
                }}
              >
                {val ? (
                  <img
                    src={val}
                    alt={def.label}
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
                    <Image size={28} color="#bbb" />
                  </div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    marginBottom: 2,
                    color: "#1B3A6B",
                  }}
                >
                  {def.label}
                </div>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 10 }}>
                  Used on: {def.usedOn}
                </div>
                <input
                  value={val || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [def.key]: e.target.value }))
                  }
                  placeholder="https://... or /images/filename.jpg"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1.5px solid #ddd",
                    borderRadius: 8,
                    fontSize: 13,
                    marginBottom: 8,
                  }}
                />
                <button
                  type="button"
                  onClick={() => triggerUpload(def.key)}
                  disabled={!!uploading}
                  style={{
                    background: "#E5EAF3",
                    color: "#1B3A6B",
                    border: "1px solid #b0bdd8",
                    borderRadius: 7,
                    padding: "6px 16px",
                    fontSize: 13,
                    cursor: uploading ? "not-allowed" : "pointer",
                    fontWeight: 500,
                    opacity: uploading ? 0.65 : 1,
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <Upload size={13} />{" "}
                    {isUploading ? "Uploading…" : "Upload Image"}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button className="btn-primary" onClick={save} style={{ marginTop: 24 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          Save All Images <ArrowRight size={14} />
        </span>
      </button>
    </div>
  );
}
