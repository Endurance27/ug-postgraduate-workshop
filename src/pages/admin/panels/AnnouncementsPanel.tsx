import { useState } from "react";
import { uid } from "./shared";

export default function AnnouncementsPanel({ items, onChange }) {
  const [form, setForm] = useState({ text: "", type: "info" });

  const add = () => {
    if (!form.text.trim()) return;
    onChange([
      ...items,
      { id: uid(), text: form.text, type: form.type, active: true },
    ]);
    setForm({ text: "", type: "info" });
  };

  const toggle = (id) =>
    onChange(items.map((a) => (a.id === id ? { ...a, active: !a.active } : a)));
  const remove = (id) => onChange(items.filter((a) => a.id !== id));

  const typeColor = { info: "#1B3A6B", warning: "#b5700a", success: "#1B6B3A" };
  const typeBg = { info: "#E5EAF3", warning: "#fdf3e0", success: "#e3f5eb" };

  return (
    <div style={{ maxWidth: 720 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>
        Announcements
      </h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 28 }}>
        Active announcements appear as banners on the homepage for all visitors.
      </p>

      <div className="card" style={{ marginBottom: 24 }}>
        <h4 style={{ marginBottom: 14 }}>New Announcement</h4>
        <div className="form-group">
          <label>Message</label>
          <input
            value={form.text}
            onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
            placeholder="e.g. Registration deadline extended to 15 August 2026"
            onKeyDown={(e) => e.key === "Enter" && add()}
          />
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <label style={{ fontSize: 14, fontWeight: 500 }}>Type:</label>
          {["info", "warning", "success"].map((t) => (
            <button
              key={t}
              onClick={() => setForm((f) => ({ ...f, type: t }))}
              style={{
                background: form.type === t ? typeBg[t] : "#f0f0f0",
                color: form.type === t ? typeColor[t] : "#666",
                border: `1.5px solid ${form.type === t ? typeColor[t] : "#ddd"}`,
                borderRadius: 20,
                padding: "4px 14px",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <button className="btn-primary" onClick={add}>
          Add Announcement
        </button>
      </div>

      {items.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            color: "#888",
            padding: "40px 0",
            background: "#fff",
            borderRadius: 12,
            border: "1px dashed #ddd",
          }}
        >
          No announcements yet. Add one above to display it on the homepage.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((a) => (
            <div
              key={a.id}
              style={{
                background: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: 10,
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                opacity: a.active ? 1 : 0.5,
              }}
            >
              <span
                style={{
                  background: typeBg[a.type],
                  color: typeColor[a.type],
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: 12,
                  textTransform: "uppercase",
                  flexShrink: 0,
                }}
              >
                {a.type}
              </span>
              <div style={{ flex: 1, fontSize: 14 }}>{a.text}</div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button
                  onClick={() => toggle(a.id)}
                  style={{
                    background: a.active ? "#e3f5eb" : "#f5f5f5",
                    color: a.active ? "#1B6B3A" : "#888",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    padding: "4px 12px",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  {a.active ? "Live ●" : "Hidden"}
                </button>
                <button
                  onClick={() => remove(a.id)}
                  style={{
                    background: "#fdecea",
                    color: "#c0392b",
                    border: "1px solid #f5b7b1",
                    borderRadius: 6,
                    padding: "4px 10px",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
