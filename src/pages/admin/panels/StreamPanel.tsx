import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { ToggleRow } from "./shared";
import { useAdminContext } from "../../../context/AdminContext";

export default function StreamPanel() {
  const { siteContent, updateContent } = useAdminContext();
  const stream = (siteContent.stream as Record<string, any>) || {};
  const onChange = (v: unknown) => updateContent("stream", v);
  const [form, setForm] = useState({
    live: stream.live || false,
    note: stream.note || "",
    day1Id: stream.day1Id || "",
    day2Id: stream.day2Id || "",
    day3Id: stream.day3Id || "",
  });
  const [saved, setSaved] = useState(false);
  const save = () => {
    onChange(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>
        Livestream Page
      </h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>
        Control the live stream status and YouTube video IDs for each day.
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
          Saved — changes are live on the Livestream page.
        </div>
      )}

      <div className="card" style={{ marginBottom: 20 }}>
        <ToggleRow
          label="Stream is Live"
          desc="Activates the video player for visitors — turn on when streaming begins"
          value={form.live}
          onChange={(v) => setForm((f) => ({ ...f, live: v }))}
        />
        <div className="form-group" style={{ marginTop: 16 }}>
          <label>Stream Notice / Message</label>
          <textarea
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            placeholder="e.g. Stream begins at 9:00 AM GMT on 27 August 2026. Please refresh if buffering."
            style={{ minHeight: 70 }}
          />
        </div>
      </div>

      <div className="card">
        <h4 style={{ marginBottom: 16, fontFamily: "Playfair Display, serif" }}>
          YouTube Video IDs — Per Day
        </h4>
        <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>
          Paste only the video ID (e.g. <code>1KWiyZnJFmw</code>), not the full
          URL. Leave blank if not yet available.
        </p>
        {[
          {
            key: "day1Id",
            label: "Day 1 — Thursday 27 Aug",
            placeholder: "e.g. dQw4w9WgXcQ",
          },
          {
            key: "day2Id",
            label: "Day 2 — Friday 28 Aug",
            placeholder: "e.g. 1KWiyZnJFmw",
          },
          {
            key: "day3Id",
            label: "Day 3 — Saturday 29 Aug",
            placeholder: "e.g. NUAZDcQ_lJs",
          },
        ].map((d) => (
          <div key={d.key} className="form-group">
            <label>{d.label}</label>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                value={form[d.key]}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [d.key]: e.target.value }))
                }
                placeholder={d.placeholder}
                style={{ flex: 1 }}
              />
              {form[d.key] && (
                <a
                  href={`https://youtube.com/watch?v=${form[d.key]}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: 12,
                    color: "#1B3A6B",
                    whiteSpace: "nowrap",
                  }}
                >
                  ▶ Preview
                </a>
              )}
            </div>
          </div>
        ))}
        <button className="btn-primary" onClick={save}>
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            Save Livestream Settings <ArrowRight size={14} />
          </span>
        </button>
      </div>
    </div>
  );
}
