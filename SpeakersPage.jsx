import { User } from "lucide-react";

export default function SpeakersPage({ speakers = {}, images = {} }) {
  const keynote    = speakers.keynote   || {};
  const panelists  = speakers.panelists || [];
  const committee  = speakers.committee || [];
  const tags       = typeof keynote.tags === "string"
    ? keynote.tags.split(",").map(t => t.trim()).filter(Boolean)
    : (keynote.tags || []);
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
          backgroundImage: `url('${images.networking || "/images/collaboration-networking.jpeg"}')`,
          backgroundSize: "cover", backgroundPosition: "center", opacity: 0.18,
        }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span className="badge" style={{ background: "rgba(201,168,76,0.25)", color: "#C9A84C", marginBottom: 14, display: "inline-block" }}>
            2026 Workshop
          </span>
          <h1 style={{ color: "#fff", fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 4.5vw, 3rem)", marginBottom: 12 }}>
            Speakers &amp; Committee
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16 }}>
            Meet the keynote speaker, panel members, and the organising committee
          </p>
        </div>
      </section>

      <div className="container section">

        {/* ── KEYNOTE ──────────────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <span className="badge badge-gold" style={{ marginBottom: 12 }}>Keynote Speaker</span>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>Opening Keynote</h2>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "280px 1fr", gap: 40,
          alignItems: "start", background: "#fff", borderRadius: 20,
          overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          marginBottom: 72, border: "1px solid #e8e8e8",
        }} className="keynote-card">
          <div style={{ position: "relative" }}>
            <img src={keynote.photo} alt={keynote.name}
              style={{ width: "100%", height: 320, objectFit: "cover", display: "block" }} />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(transparent 50%, rgba(15,35,71,0.85))",
              display: "flex", alignItems: "flex-end", padding: "16px",
            }}>
              <span style={{
                background: "#C9A84C", color: "#0F2347", fontSize: 11,
                fontWeight: 700, padding: "4px 12px", borderRadius: 20,
                textTransform: "uppercase", letterSpacing: "0.05em",
              }}>Keynote Speaker</span>
            </div>
          </div>
          <div style={{ padding: "32px 32px 32px 0" }}>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.7rem", marginBottom: 6, color: "#0F2347" }}>
              {keynote.name}
            </h2>
            <div style={{ fontSize: 15, color: "#C9A84C", fontWeight: 600, marginBottom: 4 }}>{keynote.title}</div>
            <div style={{ fontSize: 14, color: "#888", marginBottom: 20 }}>{keynote.institution}</div>
            <div style={{
              background: "#E5EAF3", borderLeft: "3px solid #1B3A6B",
              padding: "12px 16px", borderRadius: "0 8px 8px 0",
              fontSize: 14, color: "#1B3A6B", fontStyle: "italic",
              fontWeight: 500, lineHeight: 1.6, marginBottom: 20,
            }}>
              "{keynote.topic}"
            </div>
            <p style={{ fontSize: 14, color: "#555", lineHeight: 1.8, marginBottom: 20 }}>{keynote.bio}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {tags.map(t => (
                <span key={t} className="badge badge-blue" style={{ fontSize: 12 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── PANEL ────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <span className="badge badge-navy" style={{ marginBottom: 12 }}>Day 2</span>
          <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)" }}>Panel Discussion: Research &amp; Industry</h2>
          <p style={{ color: "#555", maxWidth: 560, margin: "10px auto 0", fontSize: 15 }}>
            A moderated discussion on the intersection of academic research and real-world impact in the African tech ecosystem.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 72 }}>
          {panelists.map((p, i) => (
            <div key={i} style={{
              background: "#fff", border: "1px solid #e8e8e8",
              borderRadius: 16, overflow: "hidden",
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(27,58,107,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; }}
            >
              <div style={{ position: "relative", height: 180 }}>
                <img src={p.photo} alt={p.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(transparent 40%, rgba(15,35,71,0.8))",
                }} />
                <span style={{
                  position: "absolute", bottom: 12, left: 14,
                  background: i === 0 ? "#C9A84C" : "rgba(255,255,255,0.2)",
                  color: i === 0 ? "#0F2347" : "#fff",
                  fontSize: 11, fontWeight: 700, padding: "3px 10px",
                  borderRadius: 12, backdropFilter: "blur(4px)",
                }}>{p.role}</span>
              </div>
              <div style={{ padding: "16px 18px 20px" }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: "#C9A84C", fontWeight: 600, marginBottom: 2 }}>{p.title}</div>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 10 }}>{p.institution}</div>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.65, margin: 0 }}>{p.bio}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── COMMITTEE ────────────────────────────────────────── */}
        <div style={{ background: "#f8f9fa", borderRadius: 20, padding: "40px" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <span className="badge badge-blue" style={{ marginBottom: 12 }}>Leadership</span>
            <h2 className="about-heading" style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)" }}>Organising Committee</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
            {committee.map((m, i) => (
              <div key={i} style={{
                background: "#fff", border: "1px solid #e0e0e0",
                borderRadius: 12, padding: "16px 20px",
                display: "flex", alignItems: "center", gap: 14,
                borderLeft: "3px solid #1B3A6B",
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "#E5EAF3", display: "flex", alignItems: "center",
                  justifyContent: "center", flexShrink: 0, color: "#1B3A6B",
                }}><User size={20} /></div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: "#C9A84C", fontWeight: 500, marginTop: 2 }}>{m.role}</div>
                  <div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>{m.institution}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 640px) {
          .keynote-card { grid-template-columns: 1fr !important; }
          .keynote-card img { height: 220px !important; }
        }
      `}</style>
    </main>
  );
}
