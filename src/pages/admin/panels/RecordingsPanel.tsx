import { useState } from "react";
import { Check, ArrowRight, X } from "lucide-react";
import { useAdminContext } from "../../../context/AdminContext";

export default function RecordingsPanel() {
  const { siteContent, updateContent } = useAdminContext();
  const recordings = (siteContent.recordings as any[]) || [];
  const onChange = (v: unknown) => updateContent("recordings", v);
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
    <div className="max-w-[700px]">
      <h2 className="mb-1.5 font-serif">Recordings</h2>
      <p className="text-[#666] text-sm mb-6">
        Manage YouTube recordings for each workshop day — video ID, start timestamp, and highlights.
      </p>
      {saved && (
        <div className="alert alert-success mb-5">
          <Check size={14} className="inline align-middle mr-1" /> Recordings saved.
        </div>
      )}

      <div className="flex flex-col gap-5">
        {items.map((r, i) => (
          <div key={i} className="card" style={{ borderLeft: `4px solid ${r.color}` }}>
            {/* Header row */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-[10px]">
                <span className="font-bold text-[15px] font-serif" style={{ color: r.color }}>{r.day}</span>
                <span className="text-[13px] text-[#666]">{r.label}</span>
              </div>
              {items.length > 1 && (
                <button onClick={() => removeRecording(i)} className="bg-[#fdecea] text-[#c0392b] border-none rounded-md px-[10px] py-1 text-xs cursor-pointer">Remove</button>
              )}
            </div>

            {/* Day label + colour */}
            <div className="grid grid-cols-[1fr_1fr_90px] gap-[10px] mb-[10px]">
              <div className="form-group mb-0">
                <label className="text-xs">Day Label</label>
                <input value={r.day} onChange={(e) => update(i, "day", e.target.value)} className="w-full px-2 py-1.5 border border-[#ddd] rounded-md text-[13px]" placeholder="Day 1" />
              </div>
              <div className="form-group mb-0">
                <label className="text-xs">Session Title</label>
                <input value={r.label} onChange={(e) => update(i, "label", e.target.value)} className="w-full px-2 py-1.5 border border-[#ddd] rounded-md text-[13px]" />
              </div>
              <div className="form-group mb-0">
                <label className="text-xs">Colour</label>
                <select
                  value={r.color}
                  onChange={(e) => update(i, "color", e.target.value)}
                  className="w-full px-2 py-1.5 border border-[#ddd] rounded-md text-[13px]"
                >
                  {COLOR_OPTIONS.map((c) => (
                    <option key={c} value={c} style={{ background: c, color: "#fff" }}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* YouTube ID + start */}
            <div className="grid grid-cols-[1fr_160px] gap-[10px] mb-[10px]">
              <div className="form-group mb-0">
                <label>YouTube Video ID</label>
                <div className="flex gap-2 items-center">
                  <input
                    value={r.youtubeId}
                    onChange={(e) => update(i, "youtubeId", e.target.value)}
                    placeholder="e.g. 1KWiyZnJFmw (blank = coming soon)"
                    className="flex-1"
                  />
                  {r.youtubeId && (
                    <a href={`https://youtube.com/watch?v=${r.youtubeId}`} target="_blank" rel="noreferrer" className="text-xs text-ug-blue whitespace-nowrap">▶ Preview</a>
                  )}
                </div>
              </div>
              <div className="form-group mb-0">
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
              <div className="flex justify-between items-center mb-2">
                <label className="text-[13px] font-medium">Highlights (shown in sidebar)</label>
                <button onClick={() => addHighlight(i)} className="bg-ug-blue-light text-ug-blue border-none rounded-md px-[10px] py-[3px] text-xs cursor-pointer">+ Add</button>
              </div>
              {r.highlights.map((h, hi) => (
                <div key={hi} className="flex gap-[6px] mb-[6px]">
                  <input
                    value={h}
                    onChange={(e) => updateHighlight(i, hi, e.target.value)}
                    className="flex-1 px-[10px] py-1.5 border border-[#ddd] rounded-md text-[13px]"
                  />
                  {r.highlights.length > 1 && (
                    <button onClick={() => removeHighlight(i, hi)} className="bg-[#fdecea] text-[#c0392b] border-none rounded-md px-2 py-1 text-[11px] cursor-pointer"><X size={12} /></button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-5">
        <button onClick={addRecording} className="bg-white border-2 border-dashed border-ug-gold text-[#b5700a] rounded-[10px] px-5 py-[10px] text-[13px] cursor-pointer">
          + Add Recording Day
        </button>
        <button className="btn-primary" onClick={save}>
          <span className="inline-flex items-center gap-[6px]">Save Recordings <ArrowRight size={14} /></span>
        </button>
      </div>
    </div>
  );
}
