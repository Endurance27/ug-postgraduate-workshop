import { useState, useEffect, useRef } from "react";
import Countdown from "./Countdown";

function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

const makeStats = (event) => [
  { n: "3",                              label: "Workshop Days",       icon: "📅" },
  { n: `GHS ${event?.fee ?? 100}`,       label: "Registration Fee",    icon: "💳" },
  { n: "4",                              label: "Presentation Tracks", icon: "🎤" },
  { n: "3",                              label: "Award Positions",     icon: "🏆" },
];

const tracks = [
  { title: "Regular Paper",      desc: "Full research papers presenting completed or ongoing thesis work.", color: "#1B3A6B" },
  { title: "Short Paper",        desc: "Focused work-in-progress presentations with Q&A discussion.",      color: "#0F2347" },
  { title: "Poster Presentation",desc: "Visual poster displays of thesis topics and research findings.",   color: "#C9A84C" },
  { title: "Technical Paper",    desc: "Applied and technical implementations tied to your research.",     color: "#1B3A6B" },
];

const programmes = [
  { name: "MSc Computer Science",  role: "Presenter",           required: true  },
  { name: "MPhil Computer Science",role: "Presenter",           required: true  },
  { name: "MSc Data Science",      role: "Presenter",           required: true  },
  { name: "MPhil Data Science",    role: "Presenter",           required: true  },
  { name: "MSc IT for Business",   role: "Observer / Presenter",required: false },
  { name: "PhD Computer Science",  role: "Presenter",           required: false },
  { name: "Other PG Students (UG)",role: "Open",                required: false },
];

const organizers = [
  { title: "Department of Computer Science", sub: "University of Ghana",              role: "Lead Organizer"    },
  { title: "Postgraduate Committee",           sub: "Department of Computer Science",            role: "Academic Oversight" },
  { title: "Workshop Planning Committee",    sub: "Dept. of Computer Science, UG",    role: "Event Coordination"},
];

const sponsors = [
  { name: "University of Ghana",  tier: "Principal Funder",  icon: "🏛️" },
  { name: "DCS Alumni Support",   tier: "Alumni Support",   icon: "🎓" },
  { name: "Industry Partners",    tier: "Corporate Sponsors",icon: "🤝" },
];

export default function HomePage({ navigate, event, announcements, feed = [], images = {} }) {
  const img = {
    workshop:   images.workshop   || "/images/workshop-sessions.jpg",
    research:   images.research   || "/images/research-presentations.jpg",
    networking: images.networking || "/images/collaboration-networking.jpeg",
    students:   images.students   || "/images/dcs-research.jpg",
  };
  const PHOTOS = [
    { src: img.workshop,   label: "Workshop Sessions"         },
    { src: img.research,   label: "Research Presentations"    },
    { src: img.networking, label: "Collaboration & Networking" },
  ];
  const stats = makeStats(event);
  const [heroReady, setHeroReady] = useState(false);
  const [statsRef, statsVisible] = useReveal();
  const [aboutRef, aboutVisible] = useReveal();
  const [photoRef, photoVisible] = useReveal();
  const [awardsRef, awardsVisible] = useReveal();
  const [orgRef, orgVisible] = useReveal();

  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  const activeAnnouncements = (announcements || []).filter(a => a.active);
  const activeFeed = (feed || []).filter(f => f.active);
  const annBg    = { info: "#E5EAF3", warning: "#fdf3e0", success: "#e3f5eb" };
  const annColor = { info: "#1B3A6B", warning: "#b5700a", success: "#1B6B3A" };

  return (
    <main>

      {/* ── ANNOUNCEMENTS BANNER ─────────────────────────────────────── */}
      {activeAnnouncements.length > 0 && (
        <div>
          {activeAnnouncements.map(a => (
            <div key={a.id} style={{
              background: annBg[a.type] || annBg.info,
              color: annColor[a.type] || annColor.info,
              padding: "12px 0", borderBottom: `1px solid ${annColor[a.type] || annColor.info}30`,
            }}>
              <div className="container" style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
                <span style={{ fontWeight: 700, textTransform: "uppercase", fontSize: 11, letterSpacing: "0.06em" }}>{a.type}</span>
                <span style={{ flex: 1 }}>{a.text}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── LIVE FEED TICKER ─────────────────────────────────────────── */}
      {activeFeed.length > 0 && (
        <div style={{
          background: "#0F2347", color: "#fff",
          padding: "10px 0", borderBottom: "2px solid #C9A84C",
          overflow: "hidden",
        }}>
          <div className="container" style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{
              background: "#C9A84C", color: "#0F2347",
              fontSize: 10, fontWeight: 800, padding: "3px 10px",
              borderRadius: 4, letterSpacing: "0.1em", whiteSpace: "nowrap", flexShrink: 0,
            }}>📡 LIVE</span>
            <div style={{ overflow: "hidden", flex: 1 }}>
              <div style={{
                display: "flex", gap: 48,
                animation: activeFeed.length > 1 ? "tickerScroll 18s linear infinite" : "none",
                whiteSpace: "nowrap",
              }}>
                {activeFeed.map(f => (
                  <span key={f.id} style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", flexShrink: 0 }}>
                    {f.text}
                    {f.time && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginLeft: 10 }}>{f.time}</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section style={{
        position: "relative", overflow: "hidden",
        minHeight: "92vh", display: "flex", alignItems: "center",
        background: "#0F2347",
      }}>
        {/* background image */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url('${img.workshop}')`,
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.18,
        }} />
        {/* gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(120deg, #0F2347 55%, rgba(27,58,107,0.85) 100%)",
        }} />

        {/* floating gold orbs */}
        <div className="hero-orb orb-1" />
        <div className="hero-orb orb-2" />

        <div className="container" style={{
          position: "relative", zIndex: 2,
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 48, alignItems: "center", padding: "100px 24px 80px",
        }}>
          {/* LEFT: text */}
          <div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}
              className={heroReady ? "animate-fade-up delay-1" : "pre-anim"}>
              <span className="badge" style={{ background: "rgba(201,168,76,0.25)", color: "#C9A84C" }}>
                {event?.edition || "2nd Annual Edition"}
              </span>
              <span className="badge" style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)" }}>
                Hybrid Event
              </span>
              <span className="badge" style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)" }}>
                {event?.dates || "27–29 August 2026"}
              </span>
            </div>

            <h1 className={heroReady ? "animate-fade-up delay-2" : "pre-anim"} style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)",
              fontWeight: 700, color: "#fff", lineHeight: 1.12,
              maxWidth: 600, marginBottom: 20,
            }}>
              DCS Postgraduate<br />
              <span style={{ color: "#C9A84C" }}>Research Workshop 2026</span>
            </h1>

            <p className={heroReady ? "animate-fade-up delay-3" : "pre-anim"} style={{
              fontSize: 17, color: "rgba(255,255,255,0.8)",
              maxWidth: 520, lineHeight: 1.75, marginBottom: 10,
            }}>
              Department of Computer Science · University of Ghana · SPMS
            </p>
            <p className={heroReady ? "animate-fade-up delay-3" : "pre-anim"} style={{
              fontSize: 15, color: "rgba(255,255,255,0.6)",
              maxWidth: 520, lineHeight: 1.75, marginBottom: 36,
            }}>
              MSc, MPhil &amp; PhD students present cutting-edge thesis research.
              Outstanding papers are considered for the <strong style={{ color: "#C9A84C" }}>CBAS Journal</strong>.
            </p>

            <div className={heroReady ? "animate-fade-up delay-4" : "pre-anim"}
              style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 52 }}>
              {event?.registrationOpen !== false ? (
                <button className="btn-gold animate-pulse-gold" onClick={() => navigate("register")}
                  style={{ fontSize: 16, padding: "14px 32px" }}>
                  Register Now — GHS {event?.fee || 100} →
                </button>
              ) : (
                <div style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 10, padding: "12px 24px", color: "rgba(255,255,255,0.7)", fontSize: 15 }}>
                  Registration is currently closed
                </div>
              )}
              <button className="btn-outline" onClick={() => navigate("schedule")}
                style={{ color: "#fff", borderColor: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.06)" }}>
                View Schedule
              </button>
            </div>

            <div className={heroReady ? "animate-fade-up delay-5" : "pre-anim"}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 14,
                textTransform: "uppercase", letterSpacing: "0.12em" }}>
                Countdown to Workshop
              </p>
              <Countdown />
            </div>
          </div>

          {/* RIGHT: floating image card */}
          <div className={heroReady ? "animate-fade-right delay-3" : "pre-anim"}
            style={{ position: "relative", display: "flex", justifyContent: "center" }}>

            {/* main photo */}
            <div className="hero-img-card" style={{ position: "relative", zIndex: 2 }}>
              <img
                src={img.students}
                alt="Students presenting research"
                style={{ width: "100%", height: 340, objectFit: "cover", display: "block" }}
              />
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                background: "linear-gradient(transparent, rgba(15,35,71,0.9))",
                padding: "28px 20px 20px",
              }}>
                <p style={{ color: "#fff", fontSize: 14, fontWeight: 600, margin: 0 }}>
                  Present · Collaborate · Publish
                </p>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, marginTop: 3 }}>
                  University of Ghana, Legon
                </p>
              </div>
            </div>

            {/* floating stat badge */}
            <div className="animate-float" style={{
              position: "absolute", bottom: -20, left: -20, zIndex: 3,
              background: "#C9A84C", borderRadius: 14,
              padding: "14px 20px", boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", lineHeight: 1 }}>GHS {event?.fee || 100}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", marginTop: 2 }}>Registration Fee</div>
            </div>

            {/* floating date badge */}
            <div className="animate-float-slow" style={{
              position: "absolute", top: -16, right: -16, zIndex: 3,
              background: "#fff", borderRadius: 14,
              padding: "12px 18px", boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1B3A6B" }}>{event?.dates || "27–29 Aug 2026"}</div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>3-Day Hybrid Event</div>
            </div>
          </div>
        </div>

        {/* bottom wave */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
          background: "#fff",
          clipPath: "ellipse(55% 100% at 50% 100%)",
        }} />
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────── */}
      <section ref={statsRef} style={{ background: "#fff", borderBottom: "1px solid #eee" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
            {stats.map((s, i) => (
              <div key={i}
                className={statsVisible ? `animate-fade-up delay-${i + 1}` : "pre-anim"}
                style={{
                  padding: "32px 20px", textAlign: "center",
                  borderRight: i < 3 ? "1px solid #eee" : "none",
                }}>
                <div style={{ fontSize: 26 }}>{s.icon}</div>
                <div style={{ fontFamily: "Playfair Display, serif", fontSize: 26,
                  fontWeight: 700, color: "#1B3A6B", marginTop: 6 }}>{s.n}</div>
                <div style={{ fontSize: 13, color: "#666", marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHOTO STRIP ──────────────────────────────────────────────── */}
      <section ref={photoRef} style={{ overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", height: 260 }}>
          {PHOTOS.map((p, i) => (
            <div key={i}
              className={photoVisible ? `animate-fade-up delay-${i + 1}` : "pre-anim"}
              style={{ position: "relative", overflow: "hidden" }}>
              <img src={p.src} alt={p.label}
                style={{
                  width: "100%", height: "100%", objectFit: "cover",
                  transition: "transform 0.5s ease", display: "block",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(transparent 45%, rgba(15,35,71,0.75))",
              }} />
              <p style={{
                position: "absolute", bottom: 16, left: 20,
                color: "#fff", fontSize: 14, fontWeight: 600, margin: 0,
              }}>{p.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── IMPORTANT DATES ──────────────────────────────────────────── */}
      <section style={{ background: "#0F2347", padding: "36px 0", borderTop: "3px solid #C9A84C" }}>
        <div className="container">
          <div style={{ display: "flex", gap: 0, alignItems: "stretch", flexWrap: "wrap" }}>
            {[
              { label: "Registration Opens",       date: "Now Open",      icon: "✅", done: true  },
              { label: "Abstract Submission Deadline", date: "31 Jul 2026", icon: "📄", done: false },
              { label: "Acceptance Notification",  date: "8 Aug 2026",    icon: "📬", done: false },
              { label: "Workshop Begins",          date: "27 Aug 2026",   icon: "🎓", done: false },
            ].map((d, i, arr) => (
              <div key={i} style={{
                flex: 1, minWidth: 180,
                padding: "16px 24px",
                borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
                display: "flex", gap: 14, alignItems: "center",
              }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{d.icon}</span>
                <div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>
                    {d.label}
                  </div>
                  <div style={{
                    fontSize: 15, fontWeight: 700,
                    color: d.done ? "#4ade80" : "#C9A84C",
                    fontFamily: "DM Sans, sans-serif",
                  }}>{d.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────────────── */}
      <section ref={aboutRef} className="section" style={{ background: "#f8f9fa" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <div className={aboutVisible ? "animate-fade-left" : "pre-anim"}>
              <span className="badge badge-blue" style={{ marginBottom: 16 }}>About the Workshop</span>
              <h2 className="about-heading" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", marginBottom: 20, lineHeight: 1.25 }}>
                The Premier Research Platform for DCS Postgraduate Students
              </h2>
              <p style={{ color: "#555", lineHeight: 1.85, marginBottom: 16 }}>
                A flagship academic event by the Department of Computer Science, University of Ghana — now in its <strong>second edition</strong>. It brings postgraduate researchers together to share, debate, and celebrate academic work.
              </p>
              <p style={{ color: "#555", lineHeight: 1.85, marginBottom: 28 }}>
                Students present thesis work as posters, papers, or technical demos. A panel of judges awards prizes for the best presentations across all categories.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {tracks.map((t, i) => (
                  <div key={i} style={{
                    background: "#fff", borderRadius: 12, padding: "16px 18px",
                    border: "1px solid #eee", borderTop: `3px solid ${t.color}`,
                    transition: "box-shadow 0.2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 18px rgba(27,58,107,0.1)"}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, color: t.color, marginBottom: 6 }}>{t.title}</div>
                    <p style={{ fontSize: 12, color: "#666", lineHeight: 1.6, margin: 0 }}>{t.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* image panel */}
            <div className={aboutVisible ? "animate-fade-right" : "pre-anim"}
              style={{ position: "relative" }}>
              <div style={{
                borderRadius: 20, overflow: "hidden",
                boxShadow: "0 20px 60px rgba(15,35,71,0.18)",
              }}>
                <img
                  src={img.research}
                  alt="Academic lecture hall"
                  style={{ width: "100%", height: 420, objectFit: "cover", display: "block" }}
                />
              </div>
              {/* overlay info card */}
              <div style={{
                position: "absolute", bottom: -24, left: -24,
                background: "#1B3A6B", borderRadius: 14,
                padding: "20px 24px", boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
                minWidth: 220,
              }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>PUBLICATION OPPORTUNITY</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#C9A84C" }}>CBAS Journal</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>Top papers considered for publication</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHO CAN REGISTER ─────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="badge badge-navy" style={{ marginBottom: 12 }}>Eligibility</span>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>Who Can Register?</h2>
            <p style={{ color: "#555", maxWidth: 520, margin: "12px auto 0", fontSize: 15 }}>
              All postgraduate students at the University of Ghana may register and attend.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, maxWidth: 900, margin: "0 auto" }}>
            {programmes.map((p, i) => (
              <div key={i} style={{
                background: "#fff", border: "1px solid #e8e8e8", borderRadius: 12,
                padding: "16px 20px", display: "flex", alignItems: "center", gap: 14,
                transition: "box-shadow 0.2s, transform 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 18px rgba(27,58,107,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                  background: p.required ? "#E5EAF3" : "#f5f5f5",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                }}>{p.required ? "🎓" : "👁️"}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                    {p.role} · {p.required
                      ? <span style={{ color: "#1B3A6B", fontWeight: 500 }}>Presenter expected</span>
                      : <span style={{ color: "#888" }}>Optional</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 36 }}>
            <p style={{ fontSize: 14, color: "#666", marginBottom: 16 }}>
              Registration fee: <strong>GHS {event?.fee || 100}</strong> — includes snacks, water, and workshop materials
            </p>
            <button className="btn-primary" onClick={() => navigate("register")}>
              Register Now →
            </button>
          </div>
        </div>
      </section>

      {/* ── AWARDS ───────────────────────────────────────────────────── */}
      <section ref={awardsRef} style={{ position: "relative", overflow: "hidden", background: "#0F2347", color: "#fff" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url('${img.students}')`,
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.08,
        }} />
        <div className="section container" style={{ position: "relative", textAlign: "center" }}>
          <span className="badge" style={{ background: "rgba(201,168,76,0.2)", color: "#C9A84C", marginBottom: 16 }}>Recognition</span>
          <h2 style={{ color: "#fff", fontSize: "clamp(1.5rem, 3vw, 2rem)", marginBottom: 12 }}>Awards &amp; Recognition</h2>
          <p style={{ color: "rgba(255,255,255,0.65)", maxWidth: 500, margin: "0 auto 48px", fontSize: 15 }}>
            A panel of academic judges evaluates all presentations and rewards the top performers.
          </p>
          <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { pos: "🥇", label: "First Place",  desc: "Best overall presentation", delay: "delay-1" },
              { pos: "🥈", label: "Second Place", desc: "Runner-up recognition",     delay: "delay-2" },
              { pos: "🥉", label: "Third Place",  desc: "Honourable mention",        delay: "delay-3" },
            ].map((a, i) => (
              <div key={i}
                className={awardsVisible ? `animate-fade-up ${a.delay}` : "pre-anim"}
                style={{
                  background: "rgba(255,255,255,0.07)", backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: 16, padding: "32px 40px", minWidth: 200,
                  transition: "transform 0.25s, background 0.25s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
              >
                <div style={{ fontSize: 44, marginBottom: 12 }}>{a.pos}</div>
                <div style={{ fontWeight: 600, fontSize: 17, color: "#C9A84C" }}>{a.label}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 5 }}>{a.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ORGANIZERS ───────────────────────────────────────────────── */}
      <section ref={orgRef} className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <span className="badge badge-blue" style={{ marginBottom: 12 }}>Leadership</span>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>Organizers</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {organizers.map((o, i) => (
              <div key={i}
                className={orgVisible ? `animate-fade-up delay-${i + 1}` : "pre-anim"}
                style={{
                  background: "#fff", border: "1px solid #e0e0e0",
                  borderRadius: 16, padding: "28px 24px", textAlign: "center",
                  borderTop: "3px solid #1B3A6B",
                  transition: "box-shadow 0.2s, transform 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(27,58,107,0.12)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: "50%",
                  background: "#E5EAF3", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 22, margin: "0 auto 14px",
                }}>🏛️</div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{o.title}</div>
                <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>{o.sub}</div>
                <span className="badge badge-blue" style={{ marginTop: 12 }}>{o.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPONSORS ─────────────────────────────────────────────────── */}
      <section className="section-sm" style={{ background: "#f8f9fa", borderTop: "1px solid #eee" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <span className="badge badge-gold" style={{ marginBottom: 12 }}>Support</span>
            <h2 className="about-heading" style={{ fontSize: "1.6rem" }}>Sponsors &amp; Funders</h2>
          </div>
          <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
            {sponsors.map((s, i) => (
              <div key={i} style={{
                background: "#fff", border: "1px solid #e8e0cc",
                borderRadius: 14, padding: "24px 32px", textAlign: "center", minWidth: 200,
                transition: "box-shadow 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 20px rgba(201,168,76,0.18)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
              >
                <div style={{ fontSize: 32, marginBottom: 10 }}>{s.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{s.name}</div>
                <span className="badge badge-gold" style={{ marginTop: 8 }}>{s.tier}</span>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "#888" }}>
            Interested in sponsoring? Contact the Workshop Planning Committee at the Department of Computer Science, UG.
          </p>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="section" style={{ background: "#f8f9fa" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <span className="badge badge-gold" style={{ marginBottom: 12 }}>Voices from 2025</span>
            <h2 className="about-heading" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>What Participants Say</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {[
              { quote: "Presenting my thesis research here was a turning point. The feedback from the judges helped me refine my work before my final defence.", name: "Ama Boateng", prog: "MPhil Computer Science", photo: img.research },
              { quote: "The networking opportunities were incredible. I connected with PhD students and faculty whose work directly overlaps with my own research area.", name: "Kwame Asante", prog: "MSc Data Science", photo: img.students },
              { quote: "I wasn't sure if my work was ready to present, but the committee was very encouraging. The experience gave me real academic confidence.", name: "Efua Mensah", prog: "MSc Computer Science", photo: img.workshop },
            ].map((t, i) => (
              <div key={i} className="card" style={{ position: "relative" }}>
                <div style={{ fontSize: 40, color: "#C9A84C", fontFamily: "Georgia, serif", lineHeight: 1, marginBottom: 8 }}>"</div>
                <p style={{ fontSize: 14, color: "#444", lineHeight: 1.85, marginBottom: 20, fontStyle: "italic" }}>{t.quote}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <img src={t.photo} alt={t.name} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "2px solid #E5EAF3" }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{t.prog}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg, #1B3A6B 0%, #0F2347 100%)",
        padding: "80px 0", textAlign: "center" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url('${img.networking}')`,
          backgroundSize: "cover", backgroundPosition: "center", opacity: 0.07,
        }} />
        <div className="container" style={{ position: "relative" }}>
          <h2 style={{ color: "#fff", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", marginBottom: 14 }}>
            Ready to Present Your Research?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, maxWidth: 500, margin: "0 auto 36px", lineHeight: 1.75 }}>
            Secure your spot at the {event?.edition || "2nd DCS Postgraduate Workshop"}. GHS {event?.fee || 100} covers snacks, water &amp; all workshop materials.
          </p>
          <button className="btn-gold animate-pulse-gold" onClick={() => navigate("register")}
            style={{ fontSize: 17, padding: "16px 44px" }}>
            Register Now →
          </button>
        </div>
      </section>

    </main>
  );
}
