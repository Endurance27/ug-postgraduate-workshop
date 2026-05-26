export default function SponsorsPage({ navigate, images = {}, contact = {}, footer = {} }) {
  const contactEmail = contact.email || "dcsworkshop@ug.edu.gh";
  const publication  = footer.publication || "CBAS Journal";
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
          backgroundSize: "cover", backgroundPosition: "center", opacity: 0.12,
        }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span className="badge" style={{ background: "rgba(201,168,76,0.25)", color: "#C9A84C", marginBottom: 14, display: "inline-block" }}>
            Supporters &amp; Partners
          </span>
          <h1 style={{ color: "#fff", fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 4.5vw, 3rem)", marginBottom: 12 }}>
            Sponsors &amp; Funders
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16, maxWidth: 620 }}>
            The DCS Postgraduate Research Workshop is made possible through the generous support of our institutional partners and sponsors.
          </p>
        </div>
      </section>

      <div className="container section">

        {/* Institutional Sponsors */}
        <div style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", marginBottom: 8, color: "#1B3A6B" }}>
            Institutional Sponsors
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 36 }}>Primary supporters of the 2nd Annual DCS Postgraduate Workshop</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {[
              {
                name: "University of Ghana",
                role: "Host Institution",
                desc: "The University of Ghana, founded in 1948, is the premier research university in Ghana and one of the leading universities in Africa. The institution provides core funding and facilities for the workshop.",
                tier: "gold",
                logo: "🏛️",
              },
              {
                name: "School of Physical & Mathematical Sciences",
                role: "Faculty Sponsor",
                desc: "SPMS provides direct academic and logistical support for the workshop through its faculty committee, enabling the Department of Computer Science to host this landmark postgraduate event.",
                tier: "gold",
                logo: "🔬",
              },
              {
                name: "Department of Computer Science",
                role: "Organising Department",
                desc: "The Department of Computer Science at UG is the primary organiser of the workshop, coordinating all academic, logistical, and publication activities for the three-day event.",
                tier: "primary",
                logo: "💻",
              },
            ].map((s, i) => (
              <div key={i} className="card" style={{
                borderTop: `4px solid ${s.tier === "gold" ? "#C9A84C" : "#1B3A6B"}`,
                position: "relative", overflow: "hidden",
              }}>
                <div style={{ fontSize: 40, marginBottom: 14 }}>{s.logo}</div>
                <div className={s.tier === "gold" ? "badge-gold" : "badge-navy"} style={{
                  display: "inline-block", fontSize: 10, fontWeight: 700,
                  background: s.tier === "gold" ? "#C9A84C" : "#1B3A6B",
                  color: s.tier === "gold" ? "#0F2347" : "#fff",
                  padding: "3px 10px", borderRadius: 12, letterSpacing: "0.06em",
                  textTransform: "uppercase", marginBottom: 10,
                }}>{s.role}</div>
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.05rem", marginBottom: 10, color: "#1B3A6B" }}>{s.name}</h3>
                <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.75, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Publication Partner */}
        <div style={{
          background: "linear-gradient(135deg, #0F2347, #1B3A6B)",
          borderRadius: 18, padding: "40px 44px", marginBottom: 64,
          display: "flex", alignItems: "center", gap: 36, flexWrap: "wrap",
        }}>
          <div style={{ fontSize: 52, flexShrink: 0 }}>📖</div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{
              display: "inline-block", fontSize: 10, fontWeight: 700,
              background: "rgba(201,168,76,0.25)", color: "#C9A84C",
              padding: "3px 10px", borderRadius: 12, letterSpacing: "0.06em",
              textTransform: "uppercase", marginBottom: 10,
            }}>Publication Partner</div>
            <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.4rem", color: "#fff", marginBottom: 8 }}>
              {publication}
            </h3>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.75, margin: 0 }}>
              Accepted papers from the workshop are considered for publication in the <strong style={{ color: "#C9A84C" }}>College of Basic and Applied Sciences (CBAS) Journal</strong>.
              The editorial committee reviews eligible submissions and contacts authors after the workshop.
            </p>
          </div>
        </div>

        {/* Industry Partners */}
        <div style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", marginBottom: 8, color: "#1B3A6B" }}>
            Industry Partners
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 36 }}>Corporate and industry partners supporting postgraduate research in Ghana</p>

          <div style={{
            background: "#f9f9fb", border: "2px dashed #d0d8e8",
            borderRadius: 16, padding: "48px 36px", textAlign: "center",
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🤝</div>
            <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem", color: "#1B3A6B", marginBottom: 8 }}>
              Partnerships Open for 2026
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.8, maxWidth: 520, margin: "0 auto 28px" }}>
              We are actively seeking industry partners to support the 2nd Annual DCS Postgraduate Research Workshop.
              Sponsorship provides visibility among Ghana's leading postgraduate research community.
            </p>
            <a href={`mailto:${contactEmail}?subject=Sponsorship%20Enquiry%20%E2%80%94%20DCS%20Workshop%202026`}
              className="btn-gold"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#C9A84C", color: "#0F2347",
                borderRadius: 10, padding: "12px 28px",
                fontSize: 14, fontWeight: 700, textDecoration: "none",
              }}>
              ✉️ Express Interest in Sponsorship
            </a>
          </div>
        </div>

        {/* Sponsorship Tiers */}
        <div style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", marginBottom: 8, color: "#1B3A6B" }}>
            Sponsorship Packages
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 36 }}>Support the next generation of Ghanaian computer scientists</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {[
              { tier: "Platinum", color: "#5b5b7a", icon: "💎", perks: ["Logo on all printed materials", "Banner at venue", "Speaking slot (5 min)", "4 complimentary registrations", "Social media mention"] },
              { tier: "Gold",     color: "#C9A84C", icon: "🥇", perks: ["Logo on website & programme", "Exhibitor table at venue", "2 complimentary registrations", "Social media mention"] },
              { tier: "Silver",   color: "#7a7a7a", icon: "🥈", perks: ["Logo on event programme", "1 complimentary registration", "Website acknowledgement"] },
              { tier: "Bronze",   color: "#b56f3e", icon: "🥉", perks: ["Name on website", "Certificate of partnership"] },
            ].map((p, i) => (
              <div key={i} style={{
                borderRadius: 14, overflow: "hidden",
                boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
                border: "1px solid #eee",
              }}>
                <div style={{ background: p.color, padding: "18px 20px", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 24 }}>{p.icon}</span>
                  <span style={{ fontFamily: "Playfair Display, serif", fontWeight: 700, fontSize: 16, color: "#fff" }}>{p.tier}</span>
                </div>
                <div style={{ padding: "18px 20px", background: "#fff" }}>
                  {p.perks.map((perk, pi) => (
                    <div key={pi} style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "flex-start" }}>
                      <span style={{ color: p.color, flexShrink: 0, fontSize: 13, marginTop: 1 }}>✓</span>
                      <span style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", background: "#E5EAF3", borderRadius: 16, padding: "40px 32px" }}>
          <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.3rem", color: "#1B3A6B", marginBottom: 10 }}>
            Interested in Supporting the Workshop?
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.75, maxWidth: 500, margin: "0 auto 24px" }}>
            Contact the Workshop Planning Committee to discuss sponsorship opportunities and customised partnership packages.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={`mailto:${contactEmail}?subject=Sponsorship%20Enquiry`}
              className="btn-primary"
              style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              ✉️ {contactEmail}
            </a>
            {navigate && (
              <button onClick={() => navigate("contact")} className="btn-outline">
                Contact Form →
              </button>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
