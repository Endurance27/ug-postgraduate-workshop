import { useState } from "react";
import { uid } from "./shared";
import { useAdminContext } from "../../../context/AdminContext";

export default function AnnouncementsPanel() {
  const { siteContent, updateContent } = useAdminContext();
  const items = siteContent.announcements as any[];
  const onChange = (v: unknown) => updateContent("announcements", v);
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
    <div className="max-w-[720px]">
      <h2 className="mb-1.5 font-serif">Announcements</h2>
      <p className="text-[#666] text-sm mb-7">
        Active announcements appear as banners on the homepage for all visitors.
      </p>

      <div className="card mb-6">
        <h4 className="mb-3.5">New Announcement</h4>
        <div className="form-group">
          <label>Message</label>
          <input
            value={form.text}
            onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
            placeholder="e.g. Registration deadline extended to 15 August 2026"
            onKeyDown={(e) => e.key === "Enter" && add()}
          />
        </div>
        <div className="flex gap-3 items-center mb-4">
          <label className="text-sm font-medium">Type:</label>
          {["info", "warning", "success"].map((t) => (
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
          Add Announcement
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center text-[#888] py-10 bg-white rounded-xl border border-dashed border-[#ddd]">
          No announcements yet. Add one above to display it on the homepage.
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {items.map((a) => (
            <div
              key={a.id}
              className="bg-white border border-[#e0e0e0] rounded-[10px] px-[18px] py-3.5 flex items-center gap-3.5"
              style={{ opacity: a.active ? 1 : 0.5 }}
            >
              <span
                style={{
                  background: typeBg[a.type],
                  color: typeColor[a.type],
                }}
                className="text-[11px] font-bold px-2.5 py-[3px] rounded-xl uppercase flex-shrink-0"
              >
                {a.type}
              </span>
              <div className="flex-1 text-sm">{a.text}</div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => toggle(a.id)}
                  className="border border-[#ddd] rounded-md px-3 py-1 text-xs cursor-pointer"
                  style={{
                    background: a.active ? "#e3f5eb" : "#f5f5f5",
                    color: a.active ? "#1B6B3A" : "#888",
                  }}
                >
                  {a.active ? "Live ●" : "Hidden"}
                </button>
                <button
                  onClick={() => remove(a.id)}
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
