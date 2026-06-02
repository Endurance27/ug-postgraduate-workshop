import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { uid } from "./shared";
import { useAdminContext } from "../../../context/AdminContext";

export default function FeedPanel() {
  const { siteContent, updateContent } = useAdminContext();
  const feed = (siteContent.feed as any[]) || [];
  const onChange = (v: unknown) => updateContent("feed", v);
  const [form, setForm] = useState({ text: "", type: "update" });

  const typeColor = { update: "#1B3A6B", alert: "#c0392b", info: "#1B6B3A" };
  const typeBg = { update: "#E5EAF3", alert: "#fdecea", info: "#e3f5eb" };

  const add = () => {
    if (!form.text.trim()) return;
    const now = new Date();
    const time =
      now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) +
      " · " +
      now.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    onChange([
      { id: uid(), text: form.text, type: form.type, time, active: true },
      ...feed,
    ]);
    setForm({ text: "", type: "update" });
  };

  const toggle = (id) =>
    onChange(feed.map((f) => (f.id === id ? { ...f, active: !f.active } : f)));
  const remove = (id) => onChange(feed.filter((f) => f.id !== id));

  return (
    <div style={{ maxWidth: 720 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>
        Live Feed
      </h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 28 }}>
        Post real-time updates that appear as a live ticker on the homepage.
        Great for day-of announcements, room changes, or reminders.
      </p>

      <div className="card" style={{ marginBottom: 24 }}>
        <h4 style={{ marginBottom: 14 }}>New Update</h4>
        <div className="form-group">
          <label>Message</label>
          <input
            value={form.text}
            onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
            placeholder="e.g. Keynote is now starting in the Main Hall — all attendees please proceed"
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
          {["update", "alert", "info"].map((t) => (
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
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            Post Update <ArrowRight size={14} />
          </span>
        </button>
      </div>

      {feed.length === 0 ? (
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
          No feed updates yet. Post one above to display it on the homepage.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {feed.map((f) => (
            <div
              key={f.id}
              style={{
                background: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: 10,
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                opacity: f.active ? 1 : 0.5,
              }}
            >
              <span
                style={{
                  background: typeBg[f.type],
                  color: typeColor[f.type],
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: 12,
                  textTransform: "uppercase",
                  flexShrink: 0,
                }}
              >
                {f.type}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14 }}>{f.text}</div>
                <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>
                  {f.time}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button
                  onClick={() => toggle(f.id)}
                  style={{
                    background: f.active ? "#e3f5eb" : "#f5f5f5",
                    color: f.active ? "#1B6B3A" : "#888",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    padding: "4px 12px",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  {f.active ? "Live ●" : "Hidden"}
                </button>
                <button
                  onClick={() => remove(f.id)}
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
