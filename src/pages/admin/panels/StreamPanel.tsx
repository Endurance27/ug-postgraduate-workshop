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
    <div className="max-w-[600px]">
      <h2 className="mb-1.5 font-serif">Livestream Page</h2>
      <p className="text-[#666] text-sm mb-6">
        Control the live stream status and YouTube video IDs for each day.
      </p>
      {saved && (
        <div className="alert alert-success mb-5">
          <Check
            size={14}
            className="inline align-middle mr-1"
          />{" "}
          Saved — changes are live on the Livestream page.
        </div>
      )}

      <div className="card mb-5">
        <ToggleRow
          label="Stream is Live"
          desc="Activates the video player for visitors — turn on when streaming begins"
          value={form.live}
          onChange={(v) => setForm((f) => ({ ...f, live: v }))}
        />
        <div className="form-group mt-4">
          <label>Stream Notice / Message</label>
          <textarea
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            placeholder="e.g. Stream begins at 9:00 AM GMT on 27 August 2026. Please refresh if buffering."
            className="min-h-[70px]"
          />
        </div>
      </div>

      <div className="card">
        <h4 className="mb-4 font-serif">YouTube Video IDs — Per Day</h4>
        <p className="text-[13px] text-[#666] mb-4">
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
            <div className="flex gap-2.5 items-center">
              <input
                value={form[d.key as keyof typeof form] as string}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [d.key]: e.target.value }))
                }
                placeholder={d.placeholder}
                className="flex-1"
              />
              {form[d.key as keyof typeof form] && (
                <a
                  href={`https://youtube.com/watch?v=${form[d.key as keyof typeof form]}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-ug-blue whitespace-nowrap"
                >
                  ▶ Preview
                </a>
              )}
            </div>
          </div>
        ))}
        <button className="btn-primary" onClick={save}>
          <span className="inline-flex items-center gap-1.5">
            Save Livestream Settings <ArrowRight size={14} />
          </span>
        </button>
      </div>
    </div>
  );
}
