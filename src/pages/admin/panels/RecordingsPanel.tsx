import { useState } from "react";
import { Check, ArrowRight, X } from "lucide-react";

export default function RecordingsPanel({ recordings = [], onChange }) {
  const [items, setItems] = useState(recordings.map((r) => ({ ...r })));
  const [saved, setSaved] = useState(false);

  const save = () => {
    onChange(items);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  const update = (i, field, val) =>
    setItems((arr) => arr.map((r, ri) => (ri === i ? { ...r, [field]: val } : r)));
  const updateHighlight = (i, hi, val) =>
    setItems((arr) =>
      arr.map((r, ri) =>
        ri === i ? { ...r, highlights: r.highlights.map((h, hii) => (hii === hi ? val : h)) } : r,
      ),
    );
  const addHighlight = (i) =>
    setItems((arr) => arr.map((r, ri) => ri === i ? { ...r, highlights: [...r.highlights, ""] } : r));
  const removeHighlight = (i, hi) =>
    setItems((arr) =>
      arr.map((r, ri) => ri === i ? { ...r, highlights: r.highlights.filter((_, hii) => hii !== hi) } : r),
    );
  const addRecording = () =>
    setItems((arr) => [
      ...arr,
      { day: `Day ${arr.length + 1}`, label: "New Recording", color: "#1B3A6B", youtubeId: "", start: 0, highlights: [""] },
    ]);
  const removeRecording = (i) => setItems((arr) => arr.filter((_, ri) => ri !== i));

  const COLOR_OPTIONS = ["#1B3A6B", "#C9A84C", "#7b1fa2", "#0F2347", "#1B6B3A", "#c0392b"];

  return (
    <div style={{ maxWidth: 700 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>Recordings</h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>
        Manage YouTube recordings for each workshop day — video ID, start timestamp, and highlights.
      </p>
      {saved && (
        <div className="alert alert-success" style={{ marginBottom: 20 }}>
          <Check size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} /> Recordings saved.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {items.map((r, i) => (
          <div key={i} className="card" style={{ borderLeft: `4px solid ${r.color}` }}>
            {/* Header row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontWeight: 700, fontSize: 15, fontFamily: "Playfair Display, serif", color: r.color }}>{r.day}</span>
                <span style={{ fontSize: 13, color: "#666" }}>{r.label}</span>
              </div>
              {items.length > 1 && (
                <button onClick={() => removeRecording(i)} style={{ background: "#fdecea", color: "#c0392b", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer" }}>Remove</button>
              )}
            </div>

            {/* Day label + colour */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 90px", gap: 10, marginBottom: 10 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 12 }}>Day Label</label>
                <input value={r.day} onChange={(e) => update(i, "day", e.target.value)} style={{ width: "100%", padding: "6px 8px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13 }} placeholder="Day 1" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 12 }}>Session Title</label>
                <input value={r.label} onChange={(e) => update(i, "label", e.target.value)} style={{ width: "100%", padding: "6px 8px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13 }} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 12 }}>Colour</label>
                <select
                  value={r.color}
                  onChange={(e) => update(i, "color", e.target.value)}
                  style={{ width: "100%", padding: "6px 8px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13 }}
                >
                  {COLOR_OPTIONS.map((c) => (
                    <option key={c} value={c} style={{ background: c, color: "#fff" }}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* YouTube ID + start */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 160px", gap: 10, marginBottom: 10 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>YouTube Video ID</label>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    value={r.youtubeId}
                    onChange={(e) => update(i, "youtubeId", e.target.value)}
                    placeholder="e.g. 1KWiyZnJFmw (blank = coming soon)"
                    style={{ flex: 1 }}
                  />
                  {r.youtubeId && (
                    <a href={`https://youtube.com/watch?v=${r.youtubeId}`} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#1B3A6B", whiteSpace: "nowrap" }}>▶ Preview</a>
                  )}
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Start Time (seconds)</label>
                <input
                  type="number" min="0"
                  value={r.start ?? 0}
                  onChange={(e) => update(i, "start", Number(e.target.value))}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Highlights */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 500 }}>Highlights (shown in sidebar)</label>
                <button onClick={() => addHighlight(i)} style={{ background: "#E5EAF3", color: "#1B3A6B", border: "none", borderRadius: 6, padding: "3px 10px", fontSize: 12, cursor: "pointer" }}>+ Add</button>
              </div>
              {r.highlights.map((h, hi) => (
                <div key={hi} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                  <input
                    value={h}
                    onChange={(e) => updateHighlight(i, hi, e.target.value)}
                    style={{ flex: 1, padding: "6px 10px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13 }}
                  />
                  {r.highlights.length > 1 && (
                    <button onClick={() => removeHighlight(i, hi)} style={{ background: "#fdecea", color: "#c0392b", border: "none", borderRadius: 6, padding: "4px 8px", fontSize: 11, cursor: "pointer" }}><X size={12} /></button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <button onClick={addRecording} style={{ background: "#fff", border: "2px dashed #C9A84C", color: "#b5700a", borderRadius: 10, padding: "10px 20px", fontSize: 13, cursor: "pointer" }}>
          + Add Recording Day
        </button>
        <button className="btn-primary" onClick={save}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>Save Recordings <ArrowRight size={14} /></span>
        </button>
      </div>
    </div>
  );
}
