import { useState, useEffect } from "react";
import { Check, ArrowRight, X } from "lucide-react";
import { uid, ToggleRow } from "./shared";

function makeHomeForm(home: Record<string, any> = {}) {
  return {
    heroSubtitle:
      home.heroSubtitle ||
      "Department of Computer Science · SPMS · University of Ghana",
    heroDesc: home.heroDesc || "",
    importantDates: Array.isArray(home.importantDates)
      ? home.importantDates
      : [],
    featuredSessions: Array.isArray(home.featuredSessions)
      ? home.featuredSessions
      : [],
    testimonials: Array.isArray(home.testimonials) ? home.testimonials : [],
    // Stats bar overrides
    workshopDays:       home.workshopDays       ?? 3,
    presentationTracks: home.presentationTracks ?? 4,
    awardPositions:     home.awardPositions      ?? 3,
    // Research tracks (empty = page uses built-in defaults)
    tracks:     Array.isArray(home.tracks)     ? home.tracks     : [],
    // Eligible programmes (empty = page uses built-in defaults)
    programmes: Array.isArray(home.programmes) ? home.programmes : [],
  };
}

export default function HomePanel({ event, onChange, home = {}, onChangeHome, onSaveAll }) {
  const [evForm, setEvForm] = useState({ ...event });
  const [homeForm, setHomeForm] = useState(() => makeHomeForm(home));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setEvForm({ ...event });
  }, [event]);

  useEffect(() => {
    setHomeForm(makeHomeForm(home));
  }, [home]);

  const saveAll = () => {
    const nextEvent = { ...event, ...evForm };
    const nextHome = { ...home, ...homeForm };
    if (onSaveAll) {
      onSaveAll({ event: nextEvent, home: nextHome });
    } else {
      onChange(nextEvent);
      onChangeHome(nextHome);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const updateDate = (i, field, val) =>
    setHomeForm((f) => ({
      ...f,
      importantDates: f.importantDates.map((d, di) =>
        di === i ? { ...d, [field]: val } : d,
      ),
    }));
  const updateSession = (i, field, val) =>
    setHomeForm((f) => ({
      ...f,
      featuredSessions: f.featuredSessions.map((s, si) =>
        si === i ? { ...s, [field]: val } : s,
      ),
    }));
  const updateTestimonial = (i, field, val) =>
    setHomeForm((f) => ({
      ...f,
      testimonials: f.testimonials.map((t, ti) =>
        ti === i ? { ...t, [field]: val } : t,
      ),
    }));

  const addDate = () =>
    setHomeForm((f) => ({
      ...f,
      importantDates: [
        ...f.importantDates,
        { id: uid(), label: "New Date", date: "TBD", icon: "📅", done: false },
      ],
    }));
  const removeDate = (i) =>
    setHomeForm((f) => ({
      ...f,
      importantDates: f.importantDates.filter((_, di) => di !== i),
    }));

  const addSession = () =>
    setHomeForm((f) => ({
      ...f,
      featuredSessions: [
        ...f.featuredSessions,
        {
          id: uid(),
          icon: "🎤",
          tag: "Session",
          session: "New Session",
          role: "",
          status: "",
          topic: "",
          accent: "#1B3A6B",
        },
      ],
    }));
  const removeSession = (i) =>
    setHomeForm((f) => ({
      ...f,
      featuredSessions: f.featuredSessions.filter((_, si) => si !== i),
    }));

  const addTestimonial = () =>
    setHomeForm((f) => ({
      ...f,
      testimonials: [
        ...f.testimonials,
        { id: uid(), quote: "", name: "", prog: "" },
      ],
    }));
  const removeTestimonial = (i) =>
    setHomeForm((f) => ({
      ...f,
      testimonials: f.testimonials.filter((_, ti) => ti !== i),
    }));

  // ── Tracks helpers ──
  const addTrack = () =>
    setHomeForm((f) => ({
      ...f,
      tracks: [...f.tracks, { title: "New Track", desc: "", color: "#1B3A6B" }],
    }));
  const removeTrack = (i) =>
    setHomeForm((f) => ({ ...f, tracks: f.tracks.filter((_, ti) => ti !== i) }));
  const updateTrack = (i, field, val) =>
    setHomeForm((f) => ({
      ...f,
      tracks: f.tracks.map((t, ti) => ti === i ? { ...t, [field]: val } : t),
    }));

  // ── Programmes helpers ──
  const addProgramme = () =>
    setHomeForm((f) => ({
      ...f,
      programmes: [...f.programmes, { name: "New Programme", role: "Observer", required: false }],
    }));
  const removeProgramme = (i) =>
    setHomeForm((f) => ({ ...f, programmes: f.programmes.filter((_, pi) => pi !== i) }));
  const updateProgramme = (i, field, val) =>
    setHomeForm((f) => ({
      ...f,
      programmes: f.programmes.map((p, pi) => pi === i ? { ...p, [field]: val } : p),
    }));

  return (
    <div style={{ maxWidth: 760 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>
        Home Page
      </h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 28 }}>
        Edit all sections shown on the Home page — hero, dates, sessions, and
        testimonials.
      </p>
      {saved && (
        <div className="alert alert-success" style={{ marginBottom: 20 }}>
          <Check
            size={14}
            style={{
              display: "inline",
              verticalAlign: "middle",
              marginRight: 4,
            }}
          />{" "}
          Saved — all Home page changes are live.
        </div>
      )}

      {/* ── Hero ── */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h4 style={{ marginBottom: 16, fontFamily: "Playfair Display, serif" }}>
          Hero Section
        </h4>
        <div className="form-row">
          <div className="form-group">
            <label>Event Title</label>
            <input
              value={evForm.title}
              onChange={(e) =>
                setEvForm((f) => ({ ...f, title: e.target.value }))
              }
            />
          </div>
          <div className="form-group">
            <label>Edition Badge</label>
            <input
              value={evForm.edition}
              onChange={(e) =>
                setEvForm((f) => ({ ...f, edition: e.target.value }))
              }
              placeholder="2nd Annual Edition"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Dates</label>
            <input
              value={evForm.dates}
              onChange={(e) =>
                setEvForm((f) => ({ ...f, dates: e.target.value }))
              }
              placeholder="27–29 August 2026"
            />
          </div>
          <div className="form-group">
            <label>Venue</label>
            <input
              value={evForm.venue}
              onChange={(e) =>
                setEvForm((f) => ({ ...f, venue: e.target.value }))
              }
            />
          </div>
        </div>
        <div className="form-group">
          <label>Subtitle Line (shown below title)</label>
          <input
            value={homeForm.heroSubtitle}
            onChange={(e) =>
              setHomeForm((f) => ({ ...f, heroSubtitle: e.target.value }))
            }
            placeholder="Department of Computer Science · SPMS · University of Ghana"
          />
        </div>
        <div className="form-group">
          <label>Hero Description</label>
          <textarea
            value={homeForm.heroDesc}
            onChange={(e) =>
              setHomeForm((f) => ({ ...f, heroDesc: e.target.value }))
            }
            style={{ minHeight: 80 }}
            placeholder="Brief description shown below the title in the hero…"
          />
        </div>
        <div className="form-group" style={{ maxWidth: 200 }}>
          <label>Registration Fee (GHS)</label>
          <input
            type="number"
            min="0"
            value={evForm.fee}
            onChange={(e) =>
              setEvForm((f) => ({ ...f, fee: Number(e.target.value) }))
            }
          />
        </div>
        <ToggleRow
          label="Registration Open"
          desc="Show 'Register Now' button on hero"
          value={evForm.registrationOpen}
          onChange={(v) => setEvForm((f) => ({ ...f, registrationOpen: v }))}
        />
        <ToggleRow
          label="Submissions Open"
          desc="Allow paper/abstract submissions"
          value={evForm.submissionsOpen}
          onChange={(v) => setEvForm((f) => ({ ...f, submissionsOpen: v }))}
        />
      </div>

      {/* ── Important Dates ── */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h4 style={{ fontFamily: "Playfair Display, serif" }}>
            Important Dates
          </h4>
          <button
            onClick={addDate}
            style={{
              background: "#1B3A6B",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "6px 14px",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            + Add Date
          </button>
        </div>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 14 }}>
          These date cards appear in the dark navy strip on the Home page.
        </p>
        {homeForm.importantDates.map((d, i) => (
          <div
            key={d.id || i}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: 10,
              padding: "14px 16px",
              marginBottom: 10,
              background: d.done ? "#f0fff5" : "#fafafa",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr 1fr 60px auto",
                gap: 10,
                alignItems: "end",
              }}
            >
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 12 }}>Icon</label>
                <input
                  value={d.icon}
                  onChange={(e) => updateDate(i, "icon", e.target.value)}
                  style={{
                    padding: "6px 8px",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    fontSize: 18,
                    textAlign: "center",
                  }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 12 }}>Label</label>
                <input
                  value={d.label}
                  onChange={(e) => updateDate(i, "label", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    fontSize: 13,
                  }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 12 }}>Date / Status</label>
                <input
                  value={d.date}
                  onChange={(e) => updateDate(i, "date", e.target.value)}
                  placeholder="e.g. 31 Jul 2026"
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    fontSize: 13,
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <label style={{ fontSize: 11, color: "#888" }}>Done</label>
                <button
                  onClick={() => updateDate(i, "done", !d.done)}
                  style={{
                    width: 36,
                    height: 22,
                    borderRadius: 11,
                    border: "none",
                    cursor: "pointer",
                    background: d.done ? "#1B6B3A" : "#ccc",
                    position: "relative",
                    transition: "background 0.2s",
                  }}
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "#fff",
                      position: "absolute",
                      top: 3,
                      left: d.done ? 17 : 3,
                      transition: "left 0.2s",
                    }}
                  />
                </button>
              </div>
              <button
                onClick={() => removeDate(i)}
                style={{
                  background: "#fdecea",
                  color: "#c0392b",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px 10px",
                  fontSize: 12,
                  cursor: "pointer",
                  marginBottom: 20,
                }}
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Featured Sessions ── */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h4 style={{ fontFamily: "Playfair Display, serif" }}>
            Featured Sessions
          </h4>
          <button
            onClick={addSession}
            style={{
              background: "#1B3A6B",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "6px 14px",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            + Add Session
          </button>
        </div>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 14 }}>
          Speaker / session cards in the "Programme Highlights" section on the
          Home page.
        </p>
        {homeForm.featuredSessions.map((s, i) => (
          <div
            key={s.id || i}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: 10,
              padding: "16px",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <span style={{ fontWeight: 600, fontSize: 14 }}>
                {s.session || `Session ${i + 1}`}
              </span>
              <button
                onClick={() => removeSession(i)}
                style={{
                  background: "#fdecea",
                  color: "#c0392b",
                  border: "none",
                  borderRadius: 6,
                  padding: "3px 10px",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr 1fr",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 12 }}>Icon</label>
                <input
                  value={s.icon}
                  onChange={(e) => updateSession(i, "icon", e.target.value)}
                  style={{
                    padding: "6px 8px",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    fontSize: 18,
                    textAlign: "center",
                    width: "100%",
                  }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 12 }}>Tag (shown as badge)</label>
                <input
                  value={s.tag}
                  onChange={(e) => updateSession(i, "tag", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    fontSize: 13,
                  }}
                  placeholder="e.g. Keynote"
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 12 }}>Accent Colour</label>
                <input
                  value={s.accent}
                  onChange={(e) => updateSession(i, "accent", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    fontSize: 13,
                  }}
                  placeholder="#1B3A6B"
                />
              </div>
            </div>
            <div className="form-row" style={{ marginBottom: 10 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 12 }}>Session Title</label>
                <input
                  value={s.session}
                  onChange={(e) => updateSession(i, "session", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    fontSize: 13,
                  }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 12 }}>Speaker / Role</label>
                <input
                  value={s.role}
                  onChange={(e) => updateSession(i, "role", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    fontSize: 13,
                  }}
                  placeholder="TBA — Keynote Speaker"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 12 }}>Status / Affiliation</label>
                <input
                  value={s.status}
                  onChange={(e) => updateSession(i, "status", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    fontSize: 13,
                  }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 12 }}>Topic / Theme</label>
                <input
                  value={s.topic}
                  onChange={(e) => updateSession(i, "topic", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    fontSize: 13,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Testimonials ── */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h4 style={{ fontFamily: "Playfair Display, serif" }}>
            Testimonials
          </h4>
          <button
            onClick={addTestimonial}
            style={{
              background: "#1B3A6B",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "6px 14px",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            + Add
          </button>
        </div>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 14 }}>
          Participant quotes in the "What Participants Say" section. Photos use
          the global site images.
        </p>
        {homeForm.testimonials.map((t, i) => (
          <div
            key={t.id || i}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: 10,
              padding: "14px 16px",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: 8,
              }}
            >
              <button
                onClick={() => removeTestimonial(i)}
                style={{
                  background: "#fdecea",
                  color: "#c0392b",
                  border: "none",
                  borderRadius: 6,
                  padding: "3px 10px",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
            <div className="form-group" style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 12 }}>Quote</label>
              <textarea
                value={t.quote}
                onChange={(e) => updateTestimonial(i, "quote", e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  fontSize: 13,
                  minHeight: 70,
                  resize: "vertical",
                }}
              />
            </div>
            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 12 }}>Name</label>
                <input
                  value={t.name}
                  onChange={(e) => updateTestimonial(i, "name", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    fontSize: 13,
                  }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 12 }}>Programme</label>
                <input
                  value={t.prog}
                  onChange={(e) => updateTestimonial(i, "prog", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    fontSize: 13,
                  }}
                  placeholder="MSc Computer Science"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Stats Bar ── */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h4 style={{ marginBottom: 8, fontFamily: "Playfair Display, serif" }}>Stats Bar</h4>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
          Numbers shown in the strip below the hero. Registration Fee is set by the fee field above.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Workshop Days</label>
            <input
              type="number" min="1"
              value={homeForm.workshopDays}
              onChange={(e) => setHomeForm((f) => ({ ...f, workshopDays: Number(e.target.value) }))}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Presentation Tracks</label>
            <input
              type="number" min="1"
              value={homeForm.presentationTracks}
              onChange={(e) => setHomeForm((f) => ({ ...f, presentationTracks: Number(e.target.value) }))}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Award Positions</label>
            <input
              type="number" min="1"
              value={homeForm.awardPositions}
              onChange={(e) => setHomeForm((f) => ({ ...f, awardPositions: Number(e.target.value) }))}
            />
          </div>
        </div>
      </div>

      {/* ── Research Tracks ── */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h4 style={{ fontFamily: "Playfair Display, serif" }}>Research Tracks</h4>
          <button onClick={addTrack} style={{ background: "#1B3A6B", color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer" }}>
            + Add Track
          </button>
        </div>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 14 }}>
          Presentation tracks in the "How to Participate" section. Leave empty to use the built-in defaults.
        </p>
        {homeForm.tracks.length === 0 && (
          <p style={{ fontSize: 13, color: "#aaa", fontStyle: "italic", marginBottom: 8 }}>Using built-in defaults. Add a track to override all of them.</p>
        )}
        {homeForm.tracks.map((t, i) => (
          <div key={i} style={{ border: "1px solid #e0e0e0", borderRadius: 10, padding: "14px 16px", marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{t.title || `Track ${i + 1}`}</span>
              <button onClick={() => removeTrack(i)} style={{ background: "#fdecea", color: "#c0392b", border: "none", borderRadius: 6, padding: "3px 10px", fontSize: 12, cursor: "pointer" }}>Remove</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 90px", gap: 10, marginBottom: 10 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 12 }}>Track Title</label>
                <input value={t.title} onChange={(e) => updateTrack(i, "title", e.target.value)} style={{ width: "100%", padding: "6px 8px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13 }} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 12 }}>Colour</label>
                <input value={t.color} onChange={(e) => updateTrack(i, "color", e.target.value)} placeholder="#1B3A6B" style={{ width: "100%", padding: "6px 8px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13 }} />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: 12 }}>Description</label>
              <input value={t.desc} onChange={(e) => updateTrack(i, "desc", e.target.value)} placeholder="Brief description of this track…" style={{ width: "100%", padding: "6px 8px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13 }} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Eligible Programmes ── */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h4 style={{ fontFamily: "Playfair Display, serif" }}>Eligible Programmes</h4>
          <button onClick={addProgramme} style={{ background: "#1B3A6B", color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer" }}>
            + Add Programme
          </button>
        </div>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 14 }}>
          Eligibility table in the "Who Can Participate" section. Leave empty to use built-in defaults.
        </p>
        {homeForm.programmes.length === 0 && (
          <p style={{ fontSize: 13, color: "#aaa", fontStyle: "italic", marginBottom: 8 }}>Using built-in defaults. Add a programme to override all of them.</p>
        )}
        {homeForm.programmes.map((p, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 140px auto auto", gap: 10, alignItems: "end", marginBottom: 10 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: 12 }}>Programme Name</label>
              <input value={p.name} onChange={(e) => updateProgramme(i, "name", e.target.value)} style={{ width: "100%", padding: "6px 8px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13 }} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: 12 }}>Role</label>
              <input value={p.role} onChange={(e) => updateProgramme(i, "role", e.target.value)} placeholder="Presenter" style={{ width: "100%", padding: "6px 8px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13 }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, paddingBottom: 2 }}>
              <label style={{ fontSize: 11, color: "#888" }}>Required</label>
              <button
                onClick={() => updateProgramme(i, "required", !p.required)}
                style={{ width: 36, height: 22, borderRadius: 11, border: "none", cursor: "pointer", background: p.required ? "#1B6B3A" : "#ccc", position: "relative", transition: "background 0.2s" }}
              >
                <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: p.required ? 17 : 3, transition: "left 0.2s" }} />
              </button>
            </div>
            <button onClick={() => removeProgramme(i)} style={{ background: "#fdecea", color: "#c0392b", border: "none", borderRadius: 6, padding: "6px 10px", fontSize: 12, cursor: "pointer", marginBottom: 0 }}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "#f8f9fa",
          borderRadius: 12,
          padding: "14px 18px",
          marginBottom: 20,
          fontSize: 13,
          color: "#666",
        }}
      >
        <strong style={{ color: "#1B3A6B" }}>Announcements & Live Feed</strong>{" "}
        — manage via Admin Tools sidebar.
        <br />
        <strong style={{ color: "#1B3A6B" }}>Homepage photos</strong> — change
        via <strong>Site Images</strong> in Admin Tools.
      </div>

      <button className="btn-primary" onClick={saveAll}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          Save All Home Page Changes <ArrowRight size={14} />
        </span>
      </button>
    </div>
  );
}
