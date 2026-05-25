import { useState } from "react";

const BASE_DAYS = [
  {
    day: "Day 1", date: "Thursday, 27 August 2026", color: "#1B3A6B",
    idKey: "day1Id",
    schedule: [
      { time: "8:00 AM",  title: "Registration & Check-in"                   },
      { time: "9:00 AM",  title: "Opening Ceremony & Welcome Address"         },
      { time: "9:45 AM",  title: "Keynote Address"                            },
      { time: "11:00 AM", title: "Coffee Break & Networking"                  },
      { time: "11:30 AM", title: "Parallel Track Sessions — Morning Block"    },
      { time: "1:00 PM",  title: "Lunch Break"                                },
      { time: "2:00 PM",  title: "Parallel Track Sessions — Afternoon Block"  },
      { time: "4:00 PM",  title: "Day 1 Wrap-up & Announcements"              },
    ],
  },
  {
    day: "Day 2", date: "Friday, 28 August 2026", color: "#C9A84C",
    idKey: "day2Id",
    schedule: [
      { time: "8:30 AM",  title: "Morning Briefing"                           },
      { time: "9:00 AM",  title: "Poster Presentation Session"                },
      { time: "10:30 AM", title: "Technical Paper Session"                    },
      { time: "11:00 AM", title: "Coffee Break"                               },
      { time: "11:30 AM", title: "Panel Discussion: Research & Industry"      },
      { time: "1:00 PM",  title: "Lunch Break"                                },
      { time: "2:00 PM",  title: "Short Paper Session — CS & Data Science"    },
      { time: "4:00 PM",  title: "IT for Business Observation Sessions"        },
    ],
  },
  {
    day: "Day 3", date: "Saturday, 29 August 2026", color: "#7b1fa2",
    idKey: "day3Id",
    schedule: [
      { time: "8:30 AM",  title: "Morning Briefing & Final Day Orientation"   },
      { time: "9:00 AM",  title: "Regular Paper Session — Final Presentations"},
      { time: "10:30 AM", title: "Coffee Break"                               },
      { time: "11:00 AM", title: "Judges' Deliberation (Closed)"              },
      { time: "12:00 PM", title: "Lunch Break"                                },
      { time: "1:30 PM",  title: "Awards Ceremony & Announcement"             },
      { time: "3:00 PM",  title: "Closing Ceremony & Group Photo"             },
    ],
  },
];

export default function LiveStreamPage({ event, navigate, stream = {} }) {
  const isLive = stream.live || false;
  const [activeDay, setActiveDay] = useState(0);
  const STREAM_DAYS = BASE_DAYS.map(d => ({ ...d, youtubeId: stream[d.idKey] || "" }));
  const current = STREAM_DAYS[activeDay];

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
          backgroundImage: "url('/images/workshop-sessions.jpg')",
          backgroundSize: "cover", backgroundPosition: "center", opacity: 0.15,
        }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span className="badge" style={{
            background: isLive ? "rgba(220,50,50,0.35)" : "rgba(201,168,76,0.25)",
            color: isLive ? "#ff6b6b" : "#C9A84C",
            marginBottom: 14, display: "inline-flex", alignItems: "center", gap: 7,
          }}>
            {isLive
              ? <><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff4444", display: "inline-block", animation: "pulse 1.2s infinite" }} />LIVE NOW</>
              : "📡 Live Stream · Aug 2026"}
          </span>
          <h1 style={{ color: "#fff", fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 4.5vw, 3rem)", marginBottom: 12 }}>
            Live Stream
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16 }}>
            Watch the {event?.edition || "2nd DCS Postgraduate Workshop"} live online · {event?.dates || "27–29 August 2026"}
          </p>
        </div>
      </section>

      <div className="container section">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ fontFamily: "Playfair Display, serif", marginBottom: 4 }}>2026 Workshop Live Stream</h2>
            <p style={{ color: "#666", fontSize: 14 }}>Stream links will be activated when each day goes live</p>
          </div>
          {isLive && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#fdecea", color: "#c0392b",
              border: "1.5px solid #f5b7b1", borderRadius: 8,
              padding: "7px 16px", fontSize: 13, fontWeight: 700,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#c0392b", display: "inline-block" }} />
              LIVE NOW
            </span>
          )}
        </div>

        {/* Day tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {STREAM_DAYS.map((d, i) => (
            <button key={i} onClick={() => setActiveDay(i)} style={{
              background: activeDay === i ? d.color : "#fff",
              color: activeDay === i ? "#fff" : "#555",
              border: `2px solid ${activeDay === i ? d.color : "#ddd"}`,
              borderRadius: 8, padding: "8px 22px", fontSize: 13,
              fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
            }}>{d.day}</button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24, alignItems: "start" }} className="stream-grid">
          {/* Player */}
          <div>
            <div style={{
              background: "#0d1117", borderRadius: 14, overflow: "hidden",
              position: "relative", boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            }}>
              {current.youtubeId && isLive ? (
                <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${current.youtubeId}?autoplay=1`}
                    title={`Live Stream ${current.day}`}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div style={{
                  aspectRatio: "16/9", display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", padding: 40,
                }}>
                  <div style={{ fontSize: 52, marginBottom: 16 }}>📡</div>
                  <h3 style={{ color: "#fff", fontFamily: "Playfair Display, serif", marginBottom: 8, textAlign: "center" }}>
                    {current.day} Stream
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, textAlign: "center", maxWidth: 360, lineHeight: 1.75, marginBottom: 20 }}>
                    Goes live on <strong style={{ color: "#C9A84C" }}>{current.date}</strong>.<br />
                    Register to receive the stream link by email.
                  </p>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)",
                    borderRadius: 8, padding: "9px 18px",
                  }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#555" }} />
                    <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>Offline · Goes live {current.date}</span>
                  </div>
                </div>
              )}
              <div style={{
                position: "absolute", top: 12, left: 12,
                background: current.color, borderRadius: 6,
                padding: "4px 12px", fontSize: 12, fontWeight: 700, color: "#fff",
                pointerEvents: "none",
              }}>{current.day}</div>
            </div>
            <div style={{ marginTop: 12, padding: "12px 16px", background: "#f8f9fa", borderRadius: 10, fontSize: 13, color: "#666" }}>
              <strong style={{ color: "#1B3A6B" }}>{current.date}</strong> · Stream link sent to registered virtual participants before the event.
            </div>
            {stream.note && (
              <div style={{
                marginTop: 10, padding: "12px 18px", borderRadius: 10,
                background: "#fffbf0", border: "1.5px solid #e8c96e",
                fontSize: 13, color: "#7a5800", lineHeight: 1.6,
              }}>
                📢 <strong>Notice:</strong> {stream.note}
              </div>
            )}
          </div>

          {/* Schedule sidebar */}
          <div className="card" style={{ padding: "18px 20px" }}>
            <h4 style={{ fontFamily: "Playfair Display, serif", marginBottom: 14, fontSize: "1rem", color: current.color }}>
              {current.day} Schedule
            </h4>
            {current.schedule.map((s, i) => (
              <div key={i} style={{
                display: "flex", gap: 10, padding: "9px 0",
                borderBottom: i < current.schedule.length - 1 ? "1px solid #f5f5f5" : "none",
              }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#888", whiteSpace: "nowrap", marginTop: 2, minWidth: 58 }}>{s.time}</span>
                <span style={{ fontSize: 13, color: "#333", lineHeight: 1.4 }}>{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginTop: 32 }}>
          {[
            { icon: "🔗", title: "Stream Link",  body: "Emailed to all registered virtual and hybrid participants before each day." },
            { icon: "🎥", title: "YouTube Live", body: "No login required. Watch directly in your browser or on the YouTube app."   },
            { icon: "💬", title: "Live Q&A",     body: "Submit questions via YouTube chat during panel sessions and Q&A blocks."    },
            { icon: "🔁", title: "Recordings",   body: "Session recordings made available to registered participants after each day."},
          ].map((c, i) => (
            <div key={i} className="card" style={{ display: "flex", gap: 14 }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{c.icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{c.title}</div>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, margin: 0 }}>{c.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="alert alert-info" style={{ marginTop: 24, fontSize: 14 }}>
          <strong>Registration required:</strong> You must register as a virtual or hybrid participant to receive the stream link.{" "}
          {navigate && (
            <button onClick={() => navigate("register")} style={{ background: "none", border: "none", color: "#1B3A6B", fontWeight: 600, cursor: "pointer", padding: 0, fontSize: 14 }}>
              Register now →
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(1.3); } }
        @media (max-width: 768px) { .stream-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </main>
  );
}
