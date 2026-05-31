import { Calendar, Laptop, BarChart2, Settings, Briefcase, Layers, Printer } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Session {
  id?: number;
  time: string;
  title: string;
  type: string;
  track?: string;
  presenter?: string;
}

interface ScheduleDay {
  day: string;
  date: string;
  sessions: Session[];
}

interface SchedulePageProps {
  schedule: ScheduleDay[];
  images?: Record<string, string>;
}

const tracks = [
  { name: "CS Track", color: "#1B3A6B", bg: "#E5EAF3", desc: "MSc & MPhil Computer Science presentations" },
  { name: "Data Science Track", color: "#0F2347", bg: "#e8edf6", desc: "MSc & MPhil Data Science presentations" },
  { name: "Technical Track", color: "#b5700a", bg: "#fdf3e0", desc: "Applied & technical paper presentations" },
  { name: "IT for Business Track", color: "#7b1fa2", bg: "#f5e8fa", desc: "IT for Business observation & optional presentations" },
  { name: "Poster Track", color: "#c62828", bg: "#fdecea", desc: "Poster display and Q&A sessions" },
];
import { useState } from "react";

const typeStyle = {
  plenary:  { bg: "#E5EAF3", color: "#1B3A6B", label: "Plenary" },
  parallel: { bg: "#e8edf6", color: "#0F2347", label: "Parallel Tracks" },
  track:    { bg: "#fdf3e0", color: "#b5700a", label: "Track Session" },
  break:    { bg: "#f5f5f5", color: "#777", label: "Break" },
};

export default function SchedulePage({ schedule: days, images = {} }: SchedulePageProps) {
  const heroPhotos = [
    { src: images.research   || "/images/research-presentations.jpg",    label: "Research Sessions"  },
    { src: images.workshop   || "/images/workshop-sessions.jpg",         label: "Panel Discussions"  },
    { src: images.networking || "/images/collaboration-networking.jpeg",  label: "Networking"         },
  ];
  const [filter, setFilter] = useState("All");

  const filterOptions = ["All", "Plenary", "Track Sessions", "Breaks"];

  const matchesFilter = (s: Session): boolean => {
    if (filter === "All")           return true;
    if (filter === "Plenary")       return s.type === "plenary" || s.type === "parallel";
    if (filter === "Track Sessions") return s.type === "track";
    if (filter === "Breaks")        return s.type === "break";
    return true;
  };

  return (
    <main>
      {/* IMAGE-BACKED HERO */}
      <section style={{
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #0F2347, #1B3A6B)",
        color: "#fff",
        padding: "72px 0 56px",
      }}>
        {/* Background image overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1644174547761-de211415598e?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.2,
        }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span className="badge" style={{ background: "rgba(201,168,76,0.25)", color: "#C9A84C", marginBottom: 14, display: "inline-block" }}>
            27–29 August 2026
          </span>
          <h1 style={{
            color: "#fff",
            fontFamily: "Playfair Display, serif",
            fontSize: "clamp(2rem, 4.5vw, 3rem)",
            marginBottom: 12,
          }}>
            Workshop Schedule
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16, marginBottom: 0 }}>
            3-Day Programme · 27–29 August 2026 · Parallel Track Sessions
          </p>
        </div>
      </section>

      {/* PHOTO ROW */}
      <div className="photo-strip" style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        height: 220,
        overflow: "hidden",
      }}>
        {heroPhotos.map((photo, idx) => (
          <div key={idx} style={{ position: "relative", overflow: "hidden" }}>
            <img
              src={photo.src}
              alt={photo.label}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(transparent 45%, rgba(15,35,71,0.82))",
              display: "flex",
              alignItems: "flex-end",
              padding: "16px 18px",
            }}>
              <span style={{ color: "#fff", fontSize: 13, fontWeight: 700, letterSpacing: 0.5 }}>
                {photo.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="container section">
        {/* TRACK LEGEND */}
        <div style={{ marginBottom: 52 }}>
          <div style={{ marginBottom: 20 }}>
            <span className="badge badge-blue" style={{ marginBottom: 8, display: "inline-block" }}>Parallel Tracks</span>
            <h3 style={{ margin: 0, fontSize: "1.2rem", color: "#1B3A6B" }}>Presentation Tracks</h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {[
              { name: "CS Track",              color: "#1B3A6B", bg: "#E5EAF3", icon: <Laptop size={22} />, desc: "MSc & MPhil Computer Science presentations" },
              { name: "Data Science Track",    color: "#0F2347", bg: "#e8edf6", icon: <BarChart2 size={22} />, desc: "MSc & MPhil Data Science presentations" },
              { name: "Technical Track",       color: "#b5700a", bg: "#fdf3e0", icon: <Settings size={22} />, desc: "Applied & technical paper presentations" },
              { name: "IT for Business Track", color: "#7b1fa2", bg: "#f5e8fa", icon: <Briefcase size={22} />, desc: "IT for Business observation & optional presentations" },
              { name: "Poster Track",          color: "#c62828", bg: "#fdecea", icon: <Layers size={22} />, desc: "Poster display and Q&A sessions" },
            ].map((t, i) => (
              <div key={i} style={{
                background: t.bg,
                borderLeft: `4px solid ${t.color}`,
                borderRadius: 12, padding: "18px 20px",
                display: "flex", alignItems: "flex-start", gap: 14,
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                transition: "box-shadow 0.2s, transform 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 6px 20px ${t.color}22`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "none"; }}
              >
                <span style={{ color: t.color, flexShrink: 0, marginTop: 2, display: "flex", alignItems: "center" }}>{t.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: t.color, marginBottom: 5 }}>{t.name}</div>
                  <div style={{ fontSize: 13, color: "#555", lineHeight: 1.55 }}>{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FILTER + ACTIONS */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 32 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#888", marginRight: 4 }}>Show:</span>
            {filterOptions.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                background: filter === f ? "#1B3A6B" : "#fff",
                color: filter === f ? "#fff" : "#555",
                border: "1.5px solid #ddd", borderRadius: 24,
                padding: "6px 16px", fontSize: 13, fontWeight: 500,
                cursor: "pointer", transition: "all 0.15s",
              }}>{f}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <a
              href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("DCS Postgraduate Research Workshop 2026")}&dates=20260827%2F20260830&details=${encodeURIComponent("2nd Annual DCS Postgraduate Research Workshop — Department of Computer Science, University of Ghana")}&location=${encodeURIComponent("University of Ghana, Legon")}`}
              target="_blank" rel="noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "#E5EAF3", color: "#1B3A6B",
                border: "1.5px solid #c5d0e8", borderRadius: 8,
                padding: "7px 14px", fontSize: 13, fontWeight: 600,
                textDecoration: "none", transition: "background 0.15s",
              }}
            ><Calendar size={14} /> Add to Calendar</a>
            <button onClick={() => window.print()} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#fff", color: "#555",
              border: "1.5px solid #ddd", borderRadius: 8,
              padding: "7px 14px", fontSize: 13, fontWeight: 600,
              cursor: "pointer", transition: "background 0.15s",
            }}><Printer size={14} /> Print Programme</button>
          </div>
        </div>

        {/* DAYS */}
        {days.map((d, di) => (
          <div key={di} style={{ marginBottom: 48 }}>
            <div style={{
              background: "#0F2347", color: "#fff",
              padding: "16px 24px", borderRadius: "12px 12px 0 0",
              display: "flex", alignItems: "center", gap: 16
            }}>
              <span style={{
                background: "#C9A84C", color: "#fff",
                borderRadius: 8, padding: "4px 14px",
                fontWeight: 700, fontSize: 14
              }}>{d.day}</span>
              <span style={{ fontSize: 15, color: "rgba(255,255,255,0.85)" }}>{d.date}</span>
            </div>
            <div style={{ border: "1px solid #e0e0e0", borderTop: "none", borderRadius: "0 0 12px 12px", overflow: "hidden" }}>
              {d.sessions.filter(matchesFilter).map((s, si) => {
                const ts = typeStyle[s.type];
                return (
                  <div key={si} className="session-row" style={{
                    display: "grid", gridTemplateColumns: "100px 1fr auto",
                    alignItems: "center", padding: "14px 20px", gap: 16,
                    background: si % 2 === 0 ? "#fff" : "#fafafa",
                    borderBottom: si < d.sessions.length - 1 ? "1px solid #f0f0f0" : "none"
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#555", flexShrink: 0 }}>{s.time}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{s.title}</div>
                      {s.presenter && <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{s.presenter}</div>}
                      {s.track && (
                        <span style={{
                          display: "inline-block", marginTop: 4,
                          background: tracks.find(t => t.name === s.track)?.bg || "#eee",
                          color: tracks.find(t => t.name === s.track)?.color || "#333",
                          fontSize: 11, fontWeight: 500,
                          padding: "2px 10px", borderRadius: 20
                        }}>{s.track}</span>
                      )}
                    </div>
                    <span style={{
                      background: ts.bg, color: ts.color,
                      fontSize: 11, fontWeight: 600, padding: "3px 10px",
                      borderRadius: 20, whiteSpace: "nowrap"
                    }}>{ts.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="alert alert-info">
          <strong>Note:</strong> The schedule above is indicative and subject to change. Registered participants will receive confirmed session assignments and virtual links via email before the event.
        </div>
      </div>
    </main>
  );
}
