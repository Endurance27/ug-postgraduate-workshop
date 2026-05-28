import { Trophy, Medal } from "lucide-react";

const criteria = [
  { label: "Research Quality", weight: "30%", desc: "Originality, depth, and rigour of the research." },
  { label: "Presentation Skills", weight: "25%", desc: "Clarity, confidence, and delivery of the presentation." },
  { label: "Content & Structure", weight: "20%", desc: "Logical flow, clarity of argument, and organisation." },
  { label: "Q&A Performance", weight: "15%", desc: "Ability to answer questions from judges and audience." },
  { label: "Practical Impact", weight: "10%", desc: "Potential real-world or academic contribution of the work." },
];

const FALLBACK_PAST_WINNERS = [
  { id: 1, pos: <Trophy size={36} style={{ color: "#C9A84C" }} />, place: "1st Place Award", desc: "Best Presenter",          edition: "Maiden Workshop 2025", field: "Computer Science", name: "", avatar: "" },
  { id: 2, pos: <Medal  size={36} style={{ color: "#888" }} />,    place: "2nd Place Award", desc: "Outstanding Presentation", edition: "Maiden Workshop 2025", field: "Data Science",    name: "", avatar: "" },
  { id: 3, pos: <Medal  size={36} style={{ color: "#b5700a" }} />, place: "3rd Place Award", desc: "Commended Presenter",      edition: "Maiden Workshop 2025", field: "Computer Science", name: "", avatar: "" },
];

export default function AwardsPage({ awards, pastWinners, event = {} }) {
  const displayPastWinners = (pastWinners && pastWinners.length > 0) ? pastWinners : FALLBACK_PAST_WINNERS;
  return (
    <main>
      {/* IMAGE-BACKED HERO */}
      <section style={{
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #0F2347, #1A2E50)",
        color: "#fff",
        padding: "72px 0 56px",
      }}>
        {/* Background image overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.2,
        }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span className="badge" style={{ background: "rgba(201,168,76,0.25)", color: "#C9A84C", marginBottom: 14, display: "inline-block" }}>
            2026 Awards
          </span>
          <h1 style={{
            color: "#fff",
            fontFamily: "Playfair Display, serif",
            fontSize: "clamp(2rem, 4.5vw, 3rem)",
            marginBottom: 12,
          }}>
            Awards &amp; Recognition
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16, marginBottom: 0 }}>
            Honouring academic excellence at the UG Postgraduate Workshop
          </p>
        </div>
      </section>

      <div className="container section">
        {/* PRIZES */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span className="badge badge-gold" style={{ marginBottom: 14 }}>2026 Awards</span>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", marginBottom: 12 }}>Prizes &amp; Recognition</h2>
          <p style={{ color: "#555", maxWidth: 520, margin: "0 auto 40px" }}>
            A panel of academic judges will evaluate all presentations across the three days and award the top three presenters.
          </p>
          <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { pos: <Trophy size={52} style={{ color: "#C9A84C" }} />, label: "First Place", color: "#C9A84C", bg: "#FAF0D0", desc: "Best overall presentation judged across all categories" },
              { pos: <Medal  size={52} style={{ color: "#888" }} />,    label: "Second Place", color: "#888", bg: "#f5f5f5", desc: "Runner-up recognition for outstanding research presentation" },
              { pos: <Medal  size={52} style={{ color: "#b5700a" }} />, label: "Third Place", color: "#b5700a", bg: "#fef3e2", desc: "Third-place commendation for excellent academic work" },
            ].map((a, i) => (
              <div key={i} style={{
                background: a.bg, border: `2px solid ${a.color}30`,
                borderRadius: 16, padding: "36px 28px", minWidth: 220, maxWidth: 260, flex: "1 1 220px"
              }}>
                <div style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}>{a.pos}</div>
                <div style={{ fontFamily: "Playfair Display, serif", fontSize: 20, fontWeight: 700, color: a.color, marginBottom: 8 }}>{a.label}</div>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* INSPIRATION BANNER — full-width between prizes and judging criteria */}
      <div style={{
        position: "relative",
        height: 280,
        overflow: "hidden",
      }}>
        <img
          src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=1400&q=80"
          alt="Diverse students"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div style={{
          position: "absolute",
          inset: 0,
          background: "rgba(15,35,71,0.72)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          padding: "0 24px",
        }}>
          <p style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)",
            color: "#fff",
            fontStyle: "italic",
            fontWeight: 600,
            margin: 0,
            lineHeight: 1.4,
          }}>
            "Excellence Recognised. Research Celebrated."
          </p>
          <div style={{ width: 48, height: 3, background: "#C9A84C", borderRadius: 2, marginTop: 20 }} />
        </div>
      </div>

      <div className="container section" style={{ paddingTop: 56 }}>
        {/* JUDGING CRITERIA */}
        <div style={{ maxWidth: 700, margin: "0 auto 64px" }}>
          <h3 style={{ textAlign: "center", marginBottom: 28 }}>Judging Criteria</h3>
          <div style={{ border: "1px solid #eee", borderRadius: 14, overflow: "hidden" }}>
            {criteria.map((c, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "1fr auto",
                alignItems: "center", padding: "16px 20px", gap: 16,
                background: i % 2 === 0 ? "#fff" : "#f8f9fa",
                borderBottom: i < criteria.length - 1 ? "1px solid #f0f0f0" : "none"
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{c.label}</div>
                  <div style={{ fontSize: 13, color: "#666", marginTop: 3 }}>{c.desc}</div>
                </div>
                <div style={{
                  background: "#E5EAF3", color: "#1B3A6B",
                  fontWeight: 700, fontSize: 15, padding: "6px 14px",
                  borderRadius: 20, whiteSpace: "nowrap"
                }}>{c.weight}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PAST WINNERS */}
        <div style={{ background: "#f8f9fa", borderRadius: 16, padding: "40px", marginBottom: 40 }}>
          <h3 className="about-heading" style={{ textAlign: "center", marginBottom: 8 }}>Maiden Workshop 2025 — Award Recipients</h3>
          <p style={{ textAlign: "center", color: "#888", fontSize: 14, marginBottom: 28 }}>
            Names of inaugural award recipients — congratulations to all!
          </p>
          <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
            {displayPastWinners.map((w, i) => (
              <div key={w.id || i} style={{
                background: "#fff", border: "1px solid #e0e0e0",
                borderRadius: 14, padding: "20px 24px", minWidth: 200, textAlign: "center"
              }}>
                {w.avatar && (
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
                    <img src={w.avatar} alt={w.name || w.place}
                      style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: "3px solid #E5EAF3", display: "block" }} />
                  </div>
                )}
                <div style={{ marginBottom: 8, display: "flex", justifyContent: "center" }}>{w.pos}</div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{w.name || w.place}</div>
                {w.name && <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{w.place}</div>}
                <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{w.desc}</div>
                <div style={{ marginTop: 8 }}>
                  <span className="badge badge-navy" style={{ fontSize: 11 }}>{w.field}</span>
                </div>
                <div style={{ fontSize: 11, color: "#aaa", marginTop: 6 }}>{w.edition}</div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", fontSize: 13, color: "#aaa", marginTop: 20 }}>
            * Recipient names displayed where consent has been given.
          </p>
        </div>

        {awards && awards.some(a => a.announced && a.winner) ? (
          <div style={{ marginBottom: 40 }}>
            <h3 style={{ textAlign: "center", marginBottom: 8 }}>2026 Workshop — Award Winners</h3>
            <p style={{ textAlign: "center", color: "#888", fontSize: 14, marginBottom: 28 }}>Congratulations to the outstanding presenters of the 2nd DCS Postgraduate Workshop!</p>
            <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
              {awards.filter(a => a.announced && a.winner).map(a => (
                <div key={a.id} style={{
                  background: "#fff", border: "1px solid #e0e0e0", borderRadius: 14,
                  padding: "24px 28px", minWidth: 200, textAlign: "center",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
                }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>{a.emoji}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, fontFamily: "Playfair Display, serif", marginBottom: 6 }}>{a.winner}</div>
                  {a.paper && <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5, marginBottom: 8 }}>{a.paper}</div>}
                  <span className="badge badge-gold">{a.label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="alert alert-info" style={{ maxWidth: 600, margin: "0 auto" }}>
            <strong>2026 Awards:</strong> Results will be announced during the Awards Ceremony on Day 3 ({event.dates ? event.dates.split("–")[1] || "29 August 2026" : "29 August 2026"}) and published here.
          </div>
        )}
      </div>
    </main>
  );
}
