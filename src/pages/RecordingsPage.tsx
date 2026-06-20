import { Video, GraduationCap, Trophy, Play } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Recording {
  day: string;
  label: string;
  color: string;
  youtubeId: string;
  start: number;
  highlights: string[];
}

interface RecordingsPageProps {
  recordings?: Recording[];
}

const FALLBACK_VIDEOS = [
  { day: "Day 1", label: "Opening Ceremony & Keynote Address",        color: "#1B3A6B", youtubeId: "",             start: 0,    highlights: ["Welcome Address by HOD", "Keynote by Distinguished Speaker", "Morning Parallel Track Sessions"] },
  { day: "Day 2", label: "Research Presentations & Panel Discussion", color: "#C9A84C", youtubeId: "1KWiyZnJFmw", start: 9624, highlights: ["Poster & Technical Paper Sessions", "Faculty Panel Discussion", "Short Paper Presentations"] },
  { day: "Day 3", label: "Final Presentations & Awards Ceremony",     color: "#7b1fa2", youtubeId: "NUAZDcQ_lJs", start: 6,    highlights: ["Regular Paper Final Session", "Judges' Deliberation", "Awards Ceremony & Closing"] },
];

export default function RecordingsPage({ recordings }: RecordingsPageProps) {
  const VIDEOS = (recordings && recordings.length > 0) ? recordings : FALLBACK_VIDEOS;
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden text-white py-[72px] pb-14"
        style={{ background: "linear-gradient(135deg, #0F2347, #1B3A6B)" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: `url('${import.meta.env.BASE_URL}images/research-presentations.jpg')` }}
        />
        <div className="container relative z-10">
          <span className="badge inline-block mb-[14px]" style={{ background: "rgba(201,168,76,0.25)", color: "#C9A84C" }}>
            Maiden Workshop · 2025
          </span>
          <h1 className="text-white font-serif text-[clamp(2rem,4.5vw,3rem)] mb-3">
            Workshop Recordings
          </h1>
          <p className="text-white/75 text-base">
            Complete recordings from all three days of the inaugural DCS Postgraduate Workshop 2025
          </p>
        </div>
      </section>

      <div className="container section">

        {/* Summary banner */}
        <div className="flex items-center gap-5 flex-wrap bg-ug-blue-light rounded-2xl px-7 py-5 mb-11 border border-[#c5d0e8]">
          {[
            { icon: <Video size={24} />,          label: "3 Days",           sub: "Full coverage"         },
            { icon: <Video size={24} />,          label: "2 Videos Live",     sub: "Day 1 coming soon"     },
            { icon: <GraduationCap size={24} />,  label: "DCS Workshop 2025", sub: "Inaugural edition"     },
            { icon: <Trophy size={24} />,         label: "Awards Ceremony",   sub: "Included in Day 3"     },
          ].map((s, i) => (
            <div key={i} className="flex gap-3 items-center flex-1 min-w-[160px]">
              <span className="text-ug-blue">{s.icon}</span>
              <div>
                <div className="font-bold text-sm text-ug-blue">{s.label}</div>
                <div className="text-xs text-[#666]">{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Video cards */}
        <div className="flex flex-col gap-10">
          {VIDEOS.map((v, i) => (
            <div key={i} className="rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.10)] border border-[#eee]">

              {/* Header — dynamic bg color from data */}
              <div
                className="px-6 py-4 flex justify-between items-center flex-wrap gap-[10px]"
                style={{ background: v.color }}
              >
                <div>
                  <span className="text-base font-bold text-white font-serif">{v.day}</span>
                  <span className="text-sm text-white/80 ml-3">{v.label}</span>
                </div>
                <span className="bg-black/20 text-white/80 text-[11px] font-semibold px-3 py-1 rounded-full">
                  DCS Postgraduate Workshop 2025
                </span>
              </div>

              <div className="grid grid-cols-[1fr_260px] items-start rec-grid">
                {/* Player */}
                {v.youtubeId ? (
                  <div className="relative pb-[56.25%] h-0 overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${v.youtubeId}?start=${v.start}`}
                      title={`DCS Postgraduate Workshop 2025 – ${v.day}`}
                      className="absolute top-0 left-0 w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-[#0d1117] flex flex-col items-center justify-center gap-3">
                    <span className="text-white/40"><Video size={44} /></span>
                    <p className="text-white/40 text-sm m-0">Recording coming soon</p>
                  </div>
                )}

                {/* Sidebar — dynamic highlight colour from data */}
                <div className="p-6 px-[22px] bg-[#fafafa] border-l border-[#eee] h-full">
                  <h4 className="font-serif text-[0.95rem] mb-[14px]" style={{ color: v.color }}>
                    What's in {v.day}
                  </h4>
                  {v.highlights.map((h, hi) => (
                    <div key={hi} className="flex gap-[10px] mb-3">
                      <span className="flex-shrink-0 text-[13px] mt-[1px]" style={{ color: v.color }}>▸</span>
                      <span className="text-[13px] text-[#444] leading-relaxed">{h}</span>
                    </div>
                  ))}

                  {v.youtubeId && (
                    <div className="mt-5 pt-4 border-t border-[#eee]">
                      <a href={`https://www.youtube.com/watch?v=${v.youtubeId}&t=${v.start}s`}
                        target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-2 text-white rounded-lg px-4 py-[9px] text-[13px] font-semibold no-underline"
                        style={{ background: v.color }}
                      >
                        <span className="inline-flex items-center gap-1.5"><Play size={14} /> Watch on YouTube</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .rec-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </main>
  );
}
