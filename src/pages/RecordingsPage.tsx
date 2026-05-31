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
      <section style={{
        position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg, #0F2347, #1B3A6B)",
        color: "#fff", padding: "72px 0 56px",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('/images/research-presentations.jpg')",
          backgroundSize: "cover", backgroundPosition: "center", opacity: 0.15,
        }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span className="badge" style={{ background: "rgba(201,168,76,0.25)", color: "#C9A84C", marginBottom: 14, display: "inline-block" }}>
            Maiden Workshop · 2025
          </span>
          <h1 style={{ color: "#fff", fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 4.5vw, 3rem)", marginBottom: 12 }}>
            Workshop Recordings
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16 }}>
            Complete recordings from all three days of the inaugural DCS Postgraduate Workshop 2025
          </p>
        </div>
      </section>

      <div className="container section">

        {/* Summary banner */}
        <div style={{
          display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap",
          background: "#E5EAF3", borderRadius: 14, padding: "20px 28px", marginBottom: 44,
          border: "1px solid #c5d0e8",
        }}>
          {[
            { icon: <Video size={24} />,          label: "3 Days",           sub: "Full coverage"         },
            { icon: <Video size={24} />,          label: "2 Videos Live",     sub: "Day 1 coming soon"     },
            { icon: <GraduationCap size={24} />,  label: "DCS Workshop 2025", sub: "Inaugural edition"     },
            { icon: <Trophy size={24} />,         label: "Awards Ceremony",   sub: "Included in Day 3"     },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", flex: 1, minWidth: 160 }}>
              <span style={{ color: "#1B3A6B" }}>{s.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#1B3A6B" }}>{s.label}</div>
                <div style={{ fontSize: 12, color: "#666" }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Video cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {VIDEOS.map((v, i) => (
            <div key={i} style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.10)", border: "1px solid #eee" }}>

              {/* Header */}
              <div style={{
                background: v.color, padding: "16px 24px",
                display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10,
              }}>
                <div>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#fff", fontFamily: "Playfair Display, serif" }}>{v.day}</span>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", marginLeft: 12 }}>{v.label}</span>
                </div>
                <span style={{
                  background: "rgba(0,0,0,0.2)", color: "rgba(255,255,255,0.8)",
                  fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 20,
                }}>DCS Postgraduate Workshop 2025</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", alignItems: "start" }} className="rec-grid">
                {/* Player */}
                {v.youtubeId ? (
                  <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden" }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${v.youtubeId}?start=${v.start}`}
                      title={`DCS Postgraduate Workshop 2025 – ${v.day}`}
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div style={{
                    aspectRatio: "16/9", background: "#0d1117",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
                  }}>
                    <span style={{ color: "rgba(255,255,255,0.4)" }}><Video size={44} /></span>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: 0 }}>Recording coming soon</p>
                  </div>
                )}

                {/* Sidebar */}
                <div style={{ padding: "24px 22px", background: "#fafafa", borderLeft: "1px solid #eee", height: "100%" }}>
                  <h4 style={{ fontFamily: "Playfair Display, serif", fontSize: "0.95rem", marginBottom: 14, color: v.color }}>
                    What's in {v.day}
                  </h4>
                  {v.highlights.map((h, hi) => (
                    <div key={hi} style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                      <span style={{ color: v.color, flexShrink: 0, fontSize: 13, marginTop: 1 }}>▸</span>
                      <span style={{ fontSize: 13, color: "#444", lineHeight: 1.5 }}>{h}</span>
                    </div>
                  ))}

                  {v.youtubeId && (
                    <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #eee" }}>
                      <a href={`https://www.youtube.com/watch?v=${v.youtubeId}&t=${v.start}s`}
                        target="_blank" rel="noreferrer"
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 8,
                          background: v.color, color: "#fff",
                          borderRadius: 8, padding: "9px 16px",
                          fontSize: 13, fontWeight: 600, textDecoration: "none",
                        }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Play size={14} /> Watch on YouTube</span>
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
