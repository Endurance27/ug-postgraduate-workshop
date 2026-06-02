import { useState, useRef } from "react";
import { Image, Upload, ArrowRight, Check, X } from "lucide-react";
import { uploadToStorage, storageErrorMsg } from "./shared";

export default function GalleryPanel({ gallery = [], onChange }) {
  const [items, setItems] = useState(gallery.map((p) => ({ ...p })));
  const [saved, setSaved] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState(null);
  const fileRef = useRef(null);
  const uploadingIdxRef = useRef(null);

  const save = () => {
    onChange(items);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  const update = (i, field, val) =>
    setItems((arr) =>
      arr.map((p, pi) => (pi === i ? { ...p, [field]: val } : p)),
    );
  const remove = (i) => setItems((arr) => arr.filter((_, pi) => pi !== i));
  const add = () =>
    setItems((arr) => [
      ...arr,
      { src: "", caption: "New Photo", year: "2026" },
    ]);

  const triggerUpload = (i) => {
    uploadingIdxRef.current = i;
    fileRef.current.click();
  };
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file || uploadingIdxRef.current === null) return;
    const idx = uploadingIdxRef.current;
    e.target.value = "";
    setUploadingIdx(idx);
    try {
      const url = await uploadToStorage(file);
      setItems((arr) => {
        const next = arr.map((p, pi) => (pi === idx ? { ...p, src: url } : p));
        onChange(next);
        return next;
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Upload failed:", err);
      alert(storageErrorMsg(err));
    } finally {
      setUploadingIdx(null);
    }
  };

  return (
    <div style={{ maxWidth: 800 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>
        Gallery
      </h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>
        Manage photos shown on the Gallery page. Upload images or paste URLs.
        Each photo shows with a caption and year label.
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
          Gallery saved.
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFile}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          marginBottom: 20,
        }}
      >
        {items.map((p, i) => {
          const isUploading = uploadingIdx === i;
          return (
            <div
              key={i}
              style={{
                background: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: 12,
                padding: "16px 18px",
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 120,
                  height: 84,
                  borderRadius: 8,
                  overflow: "hidden",
                  border: "1px solid #eee",
                  flexShrink: 0,
                  background: "#f5f5f5",
                }}
              >
                {p.src ? (
                  <img
                    src={p.src}
                    alt={p.caption}
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
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 100px 70px",
                    gap: 10,
                    marginBottom: 8,
                    alignItems: "end",
                  }}
                >
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Caption</label>
                    <input
                      value={p.caption}
                      onChange={(e) => update(i, "caption", e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Year</label>
                    <input
                      value={p.year}
                      onChange={(e) => update(i, "year", e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() => remove(i)}
                    style={{
                      background: "#fdecea",
                      color: "#c0392b",
                      border: "none",
                      borderRadius: 6,
                      padding: "8px 10px",
                      fontSize: 13,
                      cursor: "pointer",
                      marginBottom: 20,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <X size={12} /> Remove
                    </span>
                  </button>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    value={p.src || ""}
                    onChange={(e) => update(i, "src", e.target.value)}
                    placeholder="/images/... or https://..."
                    style={{
                      flex: 1,
                      padding: "7px 10px",
                      border: "1.5px solid #ddd",
                      borderRadius: 7,
                      fontSize: 13,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => triggerUpload(i)}
                    disabled={uploadingIdx !== null}
                    style={{
                      background: "#E5EAF3",
                      color: "#1B3A6B",
                      border: "1px solid #b0bdd8",
                      borderRadius: 7,
                      padding: "7px 14px",
                      fontSize: 12,
                      cursor: uploadingIdx !== null ? "not-allowed" : "pointer",
                      fontWeight: 500,
                      flexShrink: 0,
                      opacity: uploadingIdx !== null ? 0.65 : 1,
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
                      {isUploading ? "Uploading…" : "Upload"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={add}
          style={{
            background: "#fff",
            border: "2px dashed #C9A84C",
            color: "#b5700a",
            borderRadius: 10,
            padding: "10px 20px",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          + Add Photo
        </button>
        <button className="btn-primary" onClick={save}>
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            Save Gallery <ArrowRight size={14} />
          </span>
        </button>
      </div>
    </div>
  );
}
