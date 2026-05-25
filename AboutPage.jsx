export default function AboutPage({ navigate, images = {}, about = {}, event = {} }) {
  const a = {
    badge:        about.badge        || "2nd Annual Edition",
    title:        about.title        || "A Platform for Academic Excellence in Postgraduate Research",
    desc1:        about.desc1        || "The 2nd Annual DCS Postgraduate Students Workshop builds on the success of the maiden edition held in 2025, bringing together MSc and MPhil students from Computer Science, Data Science, and IT for Business programmes.",
    desc2:        about.desc2        || "The workshop provides a structured platform for students to present original research, receive expert feedback, and engage with peers and academic staff in a rigorous yet supportive environment.",
    imageCaption1: about.imageCaption1 || "Advancing Research at UG",
    imageCaption2: about.imageCaption2 || "Dept. of Computer Science · SPMS",
    cardText:     about.cardText     || "Following the success of the 2025 inaugural edition, the 2026 workshop expands to include broader participation across all DCS postgraduate programmes, richer parallel tracks, and a formal awards ceremony.",
  };
  const fee = event.fee || 100;
  return (
    <main>
      {/* HERO */}
      <section style={{
        position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg, #0F2347, #1B3A6B)",
        color: "#fff", padding: "64px 0 48px",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url('${images.research || "/images/research-presentations.jpg"}')`,
          backgroundSize: "cover", backgroundPosition: "center", opacity: 0.13,
        }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span className="badge" style={{ background: "rgba(201,168,76,0.25)", color: "#C9A84C", marginBottom: 12, display: "inline-block" }}>
            {a.badge}
          </span>
          <h1 style={{ color: "#fff", fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 4.5vw, 3rem)", marginBottom: 10 }}>
            About the Workshop
          </h1>
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className="section" style={{ background: "#fff" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 10 }}>
            <span className="badge badge-blue" style={{ marginBottom: 10 }}>Overview</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }} className="about-grid">

            {/* Left */}
            <div>
              <h2 className="about-heading" style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", lineHeight: 1.3, marginBottom: 20 }}>
                {a.title}
              </h2>
              <p style={{ color: "#555", lineHeight: 1.85, marginBottom: 16, fontSize: 15 }}>
                {a.desc1}
              </p>
              <p style={{ color: "#555", lineHeight: 1.85, fontSize: 15 }}>
                {a.desc2}
              </p>
            </div>

            {/* Right */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ borderRadius: 16, overflow: "hidden", position: "relative" }}>
                <img src="/images/research-presentations.jpg" alt="Workshop"
                  style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }} />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(transparent 40%, rgba(15,35,71,0.88))",
                  display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "18px 20px",
                }}>
                  <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, margin: 0 }}>{a.imageCaption1}</p>
                  <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, margin: "3px 0 0" }}>{a.imageCaption2}</p>
                </div>
              </div>

              <div className="card" style={{ background: "#f8f9fa" }}>
                <p style={{ fontSize: 14, color: "#555", lineHeight: 1.75, marginBottom: 16 }}>
                  {a.cardText}
                </p>
                <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ background: "#1B3A6B", borderRadius: 10, padding: "12px 18px", color: "#fff" }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 2 }}>Registration Fee</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "#C9A84C" }}>GHC {fee}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Snacks, water & workshop materials</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, color: "#888", margin: "0 0 10px", fontStyle: "italic" }}>
                      Workshop theme announcement coming soon
                    </p>
                    <button onClick={() => navigate("recordings")} style={{
                      background: "#C9A84C", color: "#0F2347", border: "none",
                      borderRadius: 8, padding: "8px 18px", fontSize: 13,
                      fontWeight: 700, cursor: "pointer",
                    }}>Watch Highlights →</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VIDEO HIGHLIGHTS ── */}
      <section className="section" style={{ background: "#f8f9fa" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <span className="badge badge-gold" style={{ marginBottom: 10 }}>Maiden Workshop 2025 — Video Highlights</span>
            <h2 className="about-heading" style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", marginBottom: 8 }}>Experience the Energy and Academic Rigor</h2>
            <p style={{ color: "#666", fontSize: 14 }}>Watch highlights from the 2025 edition.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="video-grid">
            {[
              { day: "DAY 1", label: "Opening Ceremony & First Day Sessions",    color: "#1B3A6B", id: null,           start: 0    },
              { day: "DAY 2", label: "Technical Presentations & Panel Discussions", color: "#C9A84C", id: "1KWiyZnJFmw", start: 9624 },
              { day: "DAY 3", label: "Closing Ceremony & Awards Announcement",   color: "#7b1fa2", id: "NUAZDcQ_lJs", start: 6    },
            ].map((v, i) => (
              <div key={i} style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.09)", border: "1px solid #eee", background: "#fff" }}>
                <div style={{ background: v.color, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 800, fontSize: 13, color: "#fff", letterSpacing: "0.05em" }}>{v.day}</span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.65)" }}>August 2025</span>
                </div>
                {v.id ? (
                  <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden" }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${v.id}?start=${v.start}`}
                      title={`Workshop 2025 ${v.day}`}
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div style={{ aspectRatio: "16/9", background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 32, opacity: 0.4 }}>📹</span>
                  </div>
                )}
                <div style={{ padding: "12px 14px" }}>
                  <p style={{ fontSize: 12, color: "#555", lineHeight: 1.5, margin: "0 0 10px" }}>{v.label}</p>
                  {v.id ? (
                    <a href={`https://www.youtube.com/watch?v=${v.id}&t=${v.start}s`} target="_blank" rel="noreferrer"
                      style={{ fontSize: 12, color: "#1B3A6B", fontWeight: 600, textDecoration: "none" }}>
                      ▶ Watch on YouTube →
                    </a>
                  ) : (
                    <span style={{ fontSize: 12, color: "#aaa" }}>Recording coming soon</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 24, background: "#e3f5eb", border: "1px solid #a8d5b8",
            borderRadius: 10, padding: "12px 20px", textAlign: "center",
            fontSize: 13, color: "#1B6B3A", fontWeight: 500,
          }}>
            🎉 Complete coverage from all 3 days of the maiden 2025 workshop is now available!
          </div>
        </div>
      </section>

      {/* ── HIGHLIGHTS BAR ── */}
      <section style={{ background: "#0F2347", padding: "40px 0", borderTop: "3px solid #C9A84C" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
            {[
              { icon: "📅", title: "3-Day Event",         body: "27–29 August 2026 — three full days of research presentations, panel discussions, and academic networking." },
              { icon: "🌐", title: "Hybrid Format",        body: "Attend physically on the UG campus or join virtually. Parallel tracks run across CS, Data Science, and IT for Business." },
              { icon: "📚", title: "CBAS Publication",     body: "Accepted papers may be considered for publication in the College of Basic and Applied Sciences (CBAS) Journal." },
              { icon: "🏆", title: "Awards & Recognition", body: "1st, 2nd, and 3rd place awards per presentation track, evaluated by an academic faculty review panel." },
            ].map((h, i, arr) => (
              <div key={i} style={{
                padding: "24px 28px", color: "#fff",
                borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
              }}>
                <div style={{ fontSize: 24, marginBottom: 10 }}>{h.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#C9A84C", marginBottom: 8 }}>{h.title}</div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.75, margin: 0 }}>{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EVENT DETAILS ── */}
      <section className="section" style={{ background: "#fff" }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <span className="badge badge-navy" style={{ marginBottom: 10 }}>Event Details</span>
          </div>
          <div style={{ border: "1px solid #e0e0e0", borderRadius: 14, overflow: "hidden" }}>
            {[
              [
                { label: "Event Name",       value: "2nd Annual DCS Postgraduate Students Workshop" },
                { label: "Organizing Body",  value: "Department of Computer Science, University of Ghana" },
              ],
              [
                { label: "Faculty",          value: "School of Physical & Mathematical Sciences (SPMS)" },
                { label: "Dates",            value: "27th – 29th August, 2026 (3 Days)" },
              ],
              [
                { label: "Format",           value: "Hybrid — Physical Attendance + Virtual Participation" },
                { label: "Registration Fee", value: "GHC 100.00 (Snacks, water & workshop materials)" },
              ],
              [
                { label: "Edition",          value: "2nd — Following the Maiden Workshop held in 2025" },
                { label: "Publication",      value: "Accepted papers may be considered for CBAS Journal" },
              ],
              [
                { label: "Session Format",   value: "Parallel Track Sessions across multiple categories" },
                { label: "",                 value: "" },
              ],
            ].map((row, ri) => (
              <div key={ri} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: ri < 4 ? "1px solid #f0f0f0" : "none" }}>
                {row.map((cell, ci) => (
                  <div key={ci} style={{
                    padding: "16px 24px",
                    borderRight: ci === 0 ? "1px solid #f0f0f0" : "none",
                    background: ri % 2 === 0 ? "#fff" : "#fafafa",
                  }}>
                    {cell.label && <div style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{cell.label}</div>}
                    {cell.value && <div style={{ fontSize: 14, color: "#1a1a1a", fontWeight: 500 }}>{cell.value}</div>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CALL FOR PAPERS ── */}
      <section className="section" style={{ background: "#0F2347", color: "#fff" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <span className="badge" style={{ background: "rgba(201,168,76,0.25)", color: "#C9A84C", marginBottom: 10 }}>Submissions</span>
            <h2 style={{ color: "#fff", fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", marginBottom: 10 }}>Call for Papers</h2>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, maxWidth: 580, margin: "0 auto 36px" }}>
              We invite postgraduate students to submit original research for presentation at the workshop. All submissions undergo peer review by the academic faculty panel.
            </p>
          </div>

          {/* Categories */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 40 }} className="cfp-grid">
            {[
              { type: "Poster Presentation", pages: "1–2 pages",  desc: "Visual display with Q&A interaction. Ideal for early-stage research.",               color: "#56d364" },
              { type: "Regular Paper",        pages: "3–5 pages",  desc: "Full-length research with methodology, results and discussion.",                      color: "#C9A84C" },
              { type: "Short Paper",          pages: "4–6 pages",  desc: "Focused presentation of work-in-progress or preliminary findings.",                  color: "#79c0ff" },
              { type: "Technical Paper",      pages: "6–8 pages",  desc: "System demonstration or technical implementation report.",                            color: "#f78166" },
            ].map((c, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.05)", borderRadius: 12,
                padding: "20px 18px", borderTop: `3px solid ${c.color}`,
              }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: c.color, marginBottom: 6 }}>{c.type}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 8, fontFamily: "monospace" }}>{c.pages}</div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0 }}>{c.desc}</p>
              </div>
            ))}
          </div>

          {/* Guidelines + Deadlines */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }} className="cfp-cols">
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "22px 24px" }}>
              <h4 style={{ color: "#C9A84C", marginBottom: 14, fontFamily: "Playfair Display, serif" }}>Submission Guidelines</h4>
              {[
                "Submissions must be original, unpublished work",
                "Written in English using the provided template",
                "Abstract of 150–250 words required",
                "All authors must be registered participants",
                "Submitted via the online registration portal",
                "Accepted papers receive certificates of presentation",
              ].map((g, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  <span style={{ color: "#C9A84C", flexShrink: 0, fontSize: 13 }}>·</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>{g}</span>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "22px 24px" }}>
              <h4 style={{ color: "#C9A84C", marginBottom: 14, fontFamily: "Playfair Display, serif" }}>Submission Deadlines</h4>
              {[
                { milestone: "Abstract Submission Opens", date: "June 2026"        },
                { milestone: "Abstract Deadline",          date: "01 August 2026"  },
                { milestone: "Full Paper Deadline",        date: "01 August 2026"  },
                { milestone: "Acceptance Notification",    date: "15 August 2026"  },
                { milestone: "Camera-Ready Submission",    date: "22 August 2026"  },
                { milestone: "Workshop Dates",             date: "27–29 Aug 2026"  },
              ].map((d, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "9px 0", borderBottom: i < 5 ? "1px solid rgba(255,255,255,0.07)" : "none",
                }}>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>{d.milestone}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#C9A84C", fontFamily: "monospace", flexShrink: 0, marginLeft: 12 }}>{d.date}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 36 }}>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, marginBottom: 14 }}>
              Register first, then upload your abstract or paper via the registration portal.
            </p>
            <button className="btn-gold" onClick={() => navigate("register")}
              style={{ fontSize: 14, padding: "12px 32px" }}>
              Register &amp; Submit →
            </button>
          </div>
        </div>
      </section>

      {/* ── PARTICIPANT ELIGIBILITY ── */}
      <section className="section" style={{ background: "#fff" }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <span className="badge badge-blue" style={{ marginBottom: 10 }}>Participant Eligibility</span>
          </div>
          <div style={{ border: "1px solid #e0e0e0", borderRadius: 14, overflow: "hidden" }}>
            {/* Header */}
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1.6fr", background: "#0F2347" }}>
              {["Programme", "Role", "Presentation Types"].map(h => (
                <div key={h} style={{ padding: "12px 20px", color: "#C9A84C", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</div>
              ))}
            </div>
            {[
              { prog: "MSc Computer Science",    role: "Presenter (Required)", types: "Poster, Regular, Short, Technical" },
              { prog: "MPhil Computer Science",  role: "Presenter (Required)", types: "Poster, Regular, Short, Technical" },
              { prog: "MSc Data Science",        role: "Presenter (Required)", types: "Poster, Regular, Short, Technical" },
              { prog: "MPhil Data Science",      role: "Presenter (Required)", types: "Poster, Regular, Short, Technical" },
              { prog: "MSc IT for Business",     role: "Observer or Presenter", types: "Any category if presenting"       },
              { prog: "PhD Computer Science",    role: "Presenter (Optional)", types: "Poster, Regular, Short, Technical" },
              { prog: "Other PG Students (UG)",  role: "Observer or Presenter", types: "Open registration"               },
            ].map((r, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "1.4fr 1fr 1.6fr",
                borderTop: "1px solid #f0f0f0",
                background: i % 2 === 0 ? "#fff" : "#fafafa",
              }}>
                <div style={{ padding: "13px 20px", fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{r.prog}</div>
                <div style={{ padding: "13px 20px", fontSize: 13, color: r.role.includes("Required") ? "#1B6B3A" : "#b5700a" }}>{r.role}</div>
                <div style={{ padding: "13px 20px", fontSize: 13, color: "#555" }}>{r.types}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .about-grid  { grid-template-columns: 1fr !important; }
          .video-grid  { grid-template-columns: 1fr !important; }
          .cfp-grid    { grid-template-columns: 1fr 1fr !important; }
          .cfp-cols    { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) {
          .cfp-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
