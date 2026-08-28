import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { ToggleRow } from "./shared";
import { useAdminContext } from "../../../context/AdminContext";

function getYouTubeVideoId(value?: string): string {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.replace(/^\//, "").slice(0, 11);
    }
    const liveMatch = url.pathname.match(/\/live\/([a-zA-Z0-9_-]{11})/);
    if (liveMatch) return liveMatch[1];
    const embedMatch = url.pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch) return embedMatch[1];
    return url.searchParams.get("v") || "";
  } catch {
    const shortMatch = trimmed.match(
      /(?:v=|youtu\.be\/|embed\/|live\/)([a-zA-Z0-9_-]{11})/,
    );
    return shortMatch?.[1] || "";
  }
}

export default function StreamPanel() {
  const { siteContent, updateContent } = useAdminContext();
  const stream = (siteContent.stream as Record<string, any>) || {};
  const onChange = (v: unknown) => updateContent("stream", v);
  const [form, setForm] = useState({
    live: stream.live || false,
    note: stream.note || "",
    youtubeUrl: stream.youtubeUrl || "",
    zoomUrl: stream.zoomUrl || "",
    day1Id: stream.day1Id || "",
    day2Id: stream.day2Id || "",
    day3Id: stream.day3Id || "",
  });
  const [saved, setSaved] = useState(false);
  const save = () => {
    const normalized = {
      ...form,
      day1Id: getYouTubeVideoId(form.day1Id) || form.day1Id,
      day2Id: getYouTubeVideoId(form.day2Id) || form.day2Id,
      day3Id: getYouTubeVideoId(form.day3Id) || form.day3Id,
    };
    onChange(normalized);
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
        <div className="form-group mt-4">
          <label>YouTube Live Link</label>
          <input
            value={form.youtubeUrl}
            onChange={(e) => setForm((f) => ({ ...f, youtubeUrl: e.target.value }))}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>
        <div className="form-group mt-4">
          <label>Zoom Meeting Link</label>
          <input
            value={form.zoomUrl}
            onChange={(e) => setForm((f) => ({ ...f, zoomUrl: e.target.value }))}
            placeholder="https://zoom.us/j/..."
          />
        </div>
      </div>

      <div className="card">
        <h4 className="mb-4 font-serif">YouTube Video — Per Day</h4>
        <p className="text-[13px] text-[#666] mb-4">
          Paste a YouTube URL or video ID (e.g. <code>https://www.youtube.com/watch?v=1KWiyZnJFmw</code>).
          Leave blank if not yet available.
        </p>
        {[
          {
            key: "day1Id",
            label: "Day 1 — Thursday 27 Aug",
            placeholder: "https://www.youtube.com/watch?v=...",
          },
          {
            key: "day2Id",
            label: "Day 2 — Friday 28 Aug",
            placeholder: "https://www.youtube.com/watch?v=...",
          },
          {
            key: "day3Id",
            label: "Day 3 — Saturday 29 Aug",
            placeholder: "https://www.youtube.com/watch?v=...",
          },
        ].map((d) => {
          const raw = (form[d.key as keyof typeof form] as string) || "";
          const extractedId = getYouTubeVideoId(raw);
          const displayId = extractedId || raw;
          return (
            <div key={d.key} className="form-group">
              <label>{d.label}</label>
              <div className="flex gap-2.5 items-center">
                <input
                  value={raw}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [d.key]: e.target.value }))
                  }
                  placeholder={d.placeholder}
                  className="flex-1"
                />
                {displayId && (
                  <a
                    href={`https://youtube.com/watch?v=${displayId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-ug-blue whitespace-nowrap"
                  >
                    ▶ Preview
                  </a>
                )}
              </div>
              {raw && extractedId && raw !== extractedId && (
                <p className="text-[11px] text-[#888] mt-1">
                  Extracted ID: <code>{extractedId}</code>
                </p>
              )}
            </div>
          );
        })}
        <button className="btn-primary" onClick={save}>
          <span className="inline-flex items-center gap-1.5">
            Save Livestream Settings <ArrowRight size={14} />
          </span>
        </button>
      </div>
    </div>
  );
}
