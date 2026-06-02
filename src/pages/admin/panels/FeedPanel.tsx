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
    <div className="max-w-[720px]">
      <h2 className="mb-1.5 font-serif">Live Feed</h2>
      <p className="text-[#666] text-sm mb-7">
        Post real-time updates that appear as a live ticker on the homepage.
        Great for day-of announcements, room changes, or reminders.
      </p>

      <div className="card mb-6">
        <h4 className="mb-3.5">New Update</h4>
        <div className="form-group">
          <label>Message</label>
          <input
            value={form.text}
            onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
            placeholder="e.g. Keynote is now starting in the Main Hall — all attendees please proceed"
            onKeyDown={(e) => e.key === "Enter" && add()}
          />
        </div>
        <div className="flex gap-3 items-center mb-4">
          <label className="text-sm font-medium">Type:</label>
          {["update", "alert", "info"].map((t) => (
            <button
              key={t}
              onClick={() => setForm((f) => ({ ...f, type: t }))}
              style={{
                background: form.type === t ? typeBg[t] : "#f0f0f0",
                color: form.type === t ? typeColor[t] : "#666",
                border: `1.5px solid ${form.type === t ? typeColor[t] : "#ddd"}`,
              }}
              className="rounded-full px-3.5 py-1 text-xs font-semibold cursor-pointer capitalize"
            >
              {t}
            </button>
          ))}
        </div>
        <button className="btn-primary" onClick={add}>
          <span className="inline-flex items-center gap-1.5">
            Post Update <ArrowRight size={14} />
          </span>
        </button>
      </div>

      {feed.length === 0 ? (
        <div className="text-center text-[#888] py-10 bg-white rounded-xl border border-dashed border-[#ddd]">
          No feed updates yet. Post one above to display it on the homepage.
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {feed.map((f) => (
            <div
              key={f.id}
              className="bg-white border border-[#e0e0e0] rounded-[10px] px-[18px] py-3.5 flex items-center gap-3.5"
              style={{ opacity: f.active ? 1 : 0.5 }}
            >
              <span
                style={{
                  background: typeBg[f.type],
                  color: typeColor[f.type],
                }}
                className="text-[11px] font-bold px-2.5 py-[3px] rounded-xl uppercase flex-shrink-0"
              >
                {f.type}
              </span>
              <div className="flex-1">
                <div className="text-sm">{f.text}</div>
                <div className="text-[11px] text-[#aaa] mt-0.5">{f.time}</div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => toggle(f.id)}
                  className="border border-[#ddd] rounded-md px-3 py-1 text-xs cursor-pointer"
                  style={{
                    background: f.active ? "#e3f5eb" : "#f5f5f5",
                    color: f.active ? "#1B6B3A" : "#888",
                  }}
                >
                  {f.active ? "Live ●" : "Hidden"}
                </button>
                <button
                  onClick={() => remove(f.id)}
                  className="bg-[#fdecea] text-[#c0392b] border border-[#f5b7b1] rounded-md px-2.5 py-1 text-xs cursor-pointer"
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
