import { useState, useEffect } from "react";

const SLIDE_IMAGES = [
  { src: "/images/dcs-research.jpg",             caption: "Research in Action"        },
  { src: "/images/collaboration-networking.jpeg", caption: "Collaboration & Networking" },
  { src: "/images/research-presentations.jpg",   caption: "Academic Presentations"    },
  { src: "/images/workshop-sessions.jpg",        caption: "Workshop Excellence"       },
];

const SIDEBAR_PAGES = [
  { key: "home",       icon: "🏠", label: "Home"        },
  { key: "about",      icon: "ℹ️",  label: "About"       },
  { key: "schedule",   icon: "🗓️", label: "Schedule"    },
  { key: "stream",     icon: "📺", label: "Livestream"  },
  { key: "speakers",   icon: "🎤", label: "Speakers"    },
  { key: "awards",     icon: "🏆", label: "Awards"      },
  { key: "sponsors",   icon: "🤝", label: "Sponsors"    },
  { key: "contact",    icon: "📞", label: "Contact"     },
  { key: "register",   icon: "📝", label: "Register"    },
  { key: "gallery",    icon: "🖼️", label: "Gallery"     },
  { key: "recordings", icon: "🎬", label: "Recordings"  },
  { key: "support",    icon: "🆘", label: "Support"     },
];

const SIDEBAR_TOOLS = [
  { key: "overview",      icon: "📊", label: "Dashboard"    },
  { key: "participants",  icon: "👥", label: "Participants"  },
  { key: "submissions",   icon: "📄", label: "Submissions"  },
  { key: "announcements", icon: "📢", label: "Announcements"},
  { key: "feed",          icon: "📡", label: "Live Feed"    },
  { key: "images",        icon: "🖼️", label: "Site Images"  },
  { key: "footer",        icon: "🔗", label: "Footer"       },
];

const TRACK_OPTIONS = ["", "CS Track", "Data Science Track", "Technical Track", "IT for Business Track", "Poster Track"];
const TYPE_OPTIONS  = ["plenary", "parallel", "track", "break"];

let _nextId = 9000;
const uid = () => ++_nextId;

export default function AdminPage({ siteContent, updateContent, navigate }) {
  const [authed, setAuthed] = useState(false);
  const [creds, setCreds]   = useState({ email: "", password: "" });
  const [tab, setTab]       = useState("home");

  const [slide, setSlide]     = useState(0);
  const [fading, setFading]   = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setSlide(s => (s + 1) % SLIDE_IMAGES.length);
        setFading(false);
      }, 600);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  if (!authed) return (
    <main style={{ minHeight: "100vh", display: "flex" }}>
      {/* ── Left: image slideshow ── */}
      <div style={{
        flex: 1, position: "relative", overflow: "hidden", minHeight: 500,
        display: "flex",
      }} className="admin-slide-panel">
        {SLIDE_IMAGES.map((img, i) => (
          <div key={i} style={{
            position: "absolute", inset: 0,
            backgroundImage: `url('${img.src}')`,
            backgroundSize: "cover", backgroundPosition: "center",
            opacity: i === slide ? (fading ? 0 : 1) : 0,
            transition: "opacity 0.6s ease",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(135deg, rgba(15,35,71,0.75) 0%, rgba(27,58,107,0.55) 100%)",
            }} />
          </div>
        ))}

        {/* Overlay content */}
        <div style={{
          position: "relative", zIndex: 1, display: "flex", flexDirection: "column",
          justifyContent: "space-between", padding: "48px 40px", width: "100%",
        }}>
          <div>
            <div style={{ display: "inline-block", background: "rgba(201,168,76,0.2)", border: "1px solid rgba(201,168,76,0.4)", borderRadius: 8, padding: "6px 14px", marginBottom: 24 }}>
              <span style={{ color: "#C9A84C", fontSize: 13, fontWeight: 600 }}>DCS Workshop 2026</span>
            </div>
            <h2 style={{ color: "#fff", fontFamily: "Playfair Display, serif", fontSize: "2rem", lineHeight: 1.3, maxWidth: 340 }}>
              Postgraduate Research Workshop Administration
            </h2>
            <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 14, fontSize: 15, maxWidth: 340 }}>
              Manage registrations, submissions, schedule, and live updates for the 2nd Annual Workshop.
            </p>
          </div>

          {/* Slide caption + dots */}
          <div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 12, fontStyle: "italic" }}>
              {SLIDE_IMAGES[slide].caption}
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {SLIDE_IMAGES.map((_, i) => (
                <button key={i} onClick={() => { setSlide(i); }} style={{
                  width: i === slide ? 24 : 8, height: 8, borderRadius: 4,
                  background: i === slide ? "#C9A84C" : "rgba(255,255,255,0.35)",
                  border: "none", cursor: "pointer", padding: 0,
                  transition: "all 0.3s ease",
                }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: sign-in form ── */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "48px 40px", background: "#fff",
      }} className="admin-form-panel">
        <div style={{ width: "100%", maxWidth: 380 }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontSize: 12, color: "#C9A84C", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Admin Console</div>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", color: "#0F2347", marginBottom: 8 }}>Welcome Back</h2>
            <p style={{ color: "#666", fontSize: 15 }}>Sign in to manage the workshop.</p>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid #e0e0e0", marginBottom: 28 }} />

          {/* Fields */}
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={creds.email} onChange={e => setCreds(c => ({ ...c, email: e.target.value }))} placeholder="admin@cs.ug.edu.gh" />
          </div>
          <div className="form-group" style={{ marginBottom: 28 }}>
            <label>Password</label>
            <input type="password" value={creds.password} onChange={e => setCreds(c => ({ ...c, password: e.target.value }))} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && creds.email && creds.password && setAuthed(true)} />
          </div>

          <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: 15, borderRadius: 10 }}
            onClick={() => { if (creds.email && creds.password) setAuthed(true); }}>
            Sign In →
          </button>

          <p style={{ fontSize: 13, color: "#aaa", textAlign: "center", marginTop: 20 }}>Demo: enter any email and password</p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-slide-panel { display: none !important; }
          .admin-form-panel  { width: 100% !important; }
        }
      `}</style>
    </main>
  );

  const { event, announcements, schedule, awards, participants, submissions, feed = [] } = siteContent;

  const confirmed  = participants.filter(p => p.payment === "Confirmed").length;
  const pending    = participants.filter(p => p.payment === "Pending").length;
  const accepted   = submissions.filter(s => s.status === "Accepted").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#f1f3f7" }}>

      {/* ── ADMIN TOP BAR ────────────────────────────────────────── */}
      <div style={{
        background: "#0A1A35", borderBottom: "1px solid rgba(201,168,76,0.25)",
        padding: "10px 24px", display: "flex", justifyContent: "space-between",
        alignItems: "center", flexShrink: 0, zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ color: "#C9A84C", fontWeight: 700, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            DCS Admin Console
          </span>
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>|</span>
          <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>{event.edition}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => navigate && navigate("home")} style={{
            background: "#C9A84C", color: "#0F2347", border: "none",
            borderRadius: 8, padding: "7px 18px", fontSize: 13, fontWeight: 700,
            cursor: "pointer",
          }}>← View Website</button>
        </div>
      </div>

      {/* ── SIDEBAR + CONTENT ────────────────────────────────────── */}
      <div style={{ display: "flex", flex: 1 }}>

      {/* ── SIDEBAR ──────────────────────────────────────────────── */}
      <aside style={{
        width: 220, background: "#0F2347", display: "flex", flexDirection: "column",
        flexShrink: 0,
      }}>
        <div style={{ padding: "24px 20px 16px" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Console</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#C9A84C" }}>DCS Workshop Admin</div>
        </div>

        <nav style={{ flex: 1, padding: "8px 12px", overflowY: "auto" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", padding: "6px 4px 4px", marginBottom: 2 }}>Pages</div>
          {SIDEBAR_PAGES.map(s => (
            <button key={s.key} onClick={() => setTab(s.key)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              background: tab === s.key ? "rgba(201,168,76,0.18)" : "transparent",
              border: tab === s.key ? "1px solid rgba(201,168,76,0.3)" : "1px solid transparent",
              borderRadius: 8, padding: "9px 12px", marginBottom: 3,
              color: tab === s.key ? "#C9A84C" : "rgba(255,255,255,0.65)",
              fontSize: 13, fontWeight: tab === s.key ? 600 : 400,
              cursor: "pointer", textAlign: "left", transition: "all 0.15s",
            }}>
              <span style={{ fontSize: 15 }}>{s.icon}</span>
              {s.label}
            </button>
          ))}
          <div style={{ height: 1, background: "rgba(255,255,255,0.1)", margin: "8px 4px" }} />
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 4px 4px", marginBottom: 2 }}>Admin Tools</div>
          {SIDEBAR_TOOLS.map(s => (
            <button key={s.key} onClick={() => setTab(s.key)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              background: tab === s.key ? "rgba(201,168,76,0.18)" : "transparent",
              border: tab === s.key ? "1px solid rgba(201,168,76,0.3)" : "1px solid transparent",
              borderRadius: 8, padding: "9px 12px", marginBottom: 3,
              color: tab === s.key ? "#C9A84C" : "rgba(255,255,255,0.65)",
              fontSize: 13, fontWeight: tab === s.key ? 600 : 400,
              cursor: "pointer", textAlign: "left", transition: "all 0.15s",
            }}>
              <span style={{ fontSize: 15 }}>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: "16px 12px" }}>
          <div style={{ background: event.registrationOpen ? "rgba(50,180,100,0.15)" : "rgba(220,50,50,0.15)", borderRadius: 8, padding: "10px 12px", marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Registration</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: event.registrationOpen ? "#5dbb7a" : "#f07070" }}>
              {event.registrationOpen ? "● Open" : "● Closed"}
            </div>
          </div>
          <button onClick={() => { setAuthed(false); navigate && navigate("home"); }} style={{
            width: "100%", background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)",
            border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8,
            padding: "8px", fontSize: 13, cursor: "pointer",
          }}>Sign Out</button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
      <div style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>

        {/* ── HOME PAGE ────────────────────────────────────────── */}
        {tab === "home" && (
          <HomePanel event={event} onChange={v => updateContent("event", v)} />
        )}

        {/* ── ABOUT PAGE ───────────────────────────────────────── */}
        {tab === "about" && (
          <AboutPanel about={siteContent.about} onChange={v => updateContent("about", v)} />
        )}

        {/* ── LIVESTREAM PAGE ──────────────────────────────────── */}
        {tab === "stream" && (
          <StreamPanel stream={siteContent.stream} onChange={v => updateContent("stream", v)} />
        )}

        {/* ── SPONSORS PAGE ────────────────────────────────────── */}
        {tab === "sponsors" && (
          <SponsorsAdminPanel footer={siteContent.footer} onChange={v => updateContent("footer", v)} />
        )}

        {/* ── REGISTER PAGE ────────────────────────────────────── */}
        {tab === "register" && (
          <RegisterPanel event={event} onChange={v => updateContent("event", v)} />
        )}

        {/* ── GALLERY PAGE ─────────────────────────────────────── */}
        {tab === "gallery" && (
          <GalleryPanel gallery={siteContent.gallery} onChange={v => updateContent("gallery", v)} />
        )}

        {/* ── RECORDINGS PAGE ──────────────────────────────────── */}
        {tab === "recordings" && (
          <RecordingsPanel recordings={siteContent.recordings} onChange={v => updateContent("recordings", v)} />
        )}

        {/* ── SUPPORT PAGE ─────────────────────────────────────── */}
        {tab === "support" && (
          <SupportAdminPanel contact={siteContent.contact} onChange={v => updateContent("contact", v)} />
        )}

        {/* ── DASHBOARD ────────────────────────────────────────── */}
        {tab === "overview" && (
          <div>
            <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>Dashboard</h2>
            <p style={{ color: "#666", fontSize: 14, marginBottom: 28 }}>{event.edition} · {event.dates}</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 32 }}>
              {[
                { label: "Total Registered",   value: participants.length,    color: "#0F2347", bg: "#e8edf6" },
                { label: "Payments Confirmed", value: confirmed,              color: "#1B6B3A", bg: "#e3f5eb" },
                { label: "Payments Pending",   value: pending,                color: "#c0392b", bg: "#fdecea" },
                { label: "Submissions",        value: submissions.length,     color: "#7b1fa2", bg: "#f5e8fa" },
                { label: "Accepted Papers",    value: accepted,               color: "#b5700a", bg: "#fdf3e0" },
                { label: "Revenue (GHS)",      value: confirmed * event.fee,  color: "#1B3A6B", bg: "#E5EAF3" },
              ].map((s, i) => (
                <div key={i} style={{ background: s.bg, borderRadius: 12, padding: "18px 20px", border: `1px solid ${s.color}20` }}>
                  <div style={{ fontSize: 12, color: s.color, fontWeight: 500, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontFamily: "Playfair Display, serif", fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div className="card">
                <h4 style={{ marginBottom: 14, fontFamily: "Playfair Display, serif" }}>Quick Toggles</h4>
                <ToggleRow label="Registration" desc="Allow new participants to register" value={event.registrationOpen}
                  onChange={v => updateContent("event", { ...event, registrationOpen: v })} />
                <ToggleRow label="Submissions" desc="Allow paper submissions" value={event.submissionsOpen}
                  onChange={v => updateContent("event", { ...event, submissionsOpen: v })} />
              </div>
              <div className="card">
                <h4 style={{ marginBottom: 14, fontFamily: "Playfair Display, serif" }}>Recent Registrations</h4>
                {participants.slice(0, 4).map(p => (
                  <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f5f5f5" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: "#888" }}>{p.programme}</div>
                    </div>
                    <span className={`badge ${p.payment === "Confirmed" ? "badge-green" : "badge-red"}`} style={{ fontSize: 11 }}>{p.payment}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ANNOUNCEMENTS ────────────────────────────────────── */}
        {tab === "announcements" && (
          <AnnouncementsPanel
            items={announcements}
            onChange={v => updateContent("announcements", v)}
          />
        )}

        {/* ── LIVE FEED ────────────────────────────────────────── */}
        {tab === "feed" && (
          <FeedPanel feed={feed} onChange={v => updateContent("feed", v)} />
        )}

        {/* ── SCHEDULE ─────────────────────────────────────────── */}
        {tab === "schedule" && (
          <ScheduleEditor
            schedule={schedule}
            onChange={v => updateContent("schedule", v)}
          />
        )}

        {/* ── PARTICIPANTS ─────────────────────────────────────── */}
        {tab === "participants" && (
          <ParticipantsPanel
            participants={participants}
            onChange={v => updateContent("participants", v)}
          />
        )}

        {/* ── SUBMISSIONS ──────────────────────────────────────── */}
        {tab === "submissions" && (
          <SubmissionsPanel
            submissions={submissions}
            onChange={v => updateContent("submissions", v)}
          />
        )}

        {/* ── AWARDS ───────────────────────────────────────────── */}
        {tab === "awards" && (
          <AwardsPanel
            awards={awards}
            onChange={v => updateContent("awards", v)}
            pastWinners={siteContent.pastWinners || []}
            onChangePastWinners={v => updateContent("pastWinners", v)}
          />
        )}

        {/* ── SPEAKERS ─────────────────────────────────────────── */}
        {tab === "speakers" && (
          <SpeakersPanel
            speakers={siteContent.speakers}
            onChange={v => updateContent("speakers", v)}
          />
        )}

        {/* ── CONTACT INFO ─────────────────────────────────────── */}
        {tab === "contact" && (
          <ContactPanel
            contact={siteContent.contact}
            onChange={v => updateContent("contact", v)}
          />
        )}

        {/* ── FOOTER ───────────────────────────────────────────── */}
        {tab === "footer" && (
          <FooterPanel
            footer={siteContent.footer}
            onChange={v => updateContent("footer", v)}
          />
        )}

        {/* ── SITE IMAGES ──────────────────────────────────────── */}
        {tab === "images" && (
          <ImagesPanel
            images={siteContent.images}
            onChange={v => updateContent("images", v)}
          />
        )}

      </div>
      </div>{/* end sidebar+content flex row */}
    </div>
  );
}

/* ── Reusable toggle row ──────────────────────────────────────── */
function ToggleRow({ label, desc, value, onChange }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 12, color: "#888" }}>{desc}</div>
      </div>
      <button onClick={() => onChange(!value)} style={{
        width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
        background: value ? "#1B6B3A" : "#ccc", position: "relative", transition: "background 0.2s",
        flexShrink: 0,
      }}>
        <div style={{
          width: 18, height: 18, borderRadius: "50%", background: "#fff",
          position: "absolute", top: 3, left: value ? 23 : 3, transition: "left 0.2s",
          boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
        }} />
      </button>
    </div>
  );
}

/* ── Event Settings ───────────────────────────────────────────── */
function EventSettings({ event, onChange }) {
  const [form, setForm] = useState({ ...event });
  const [saved, setSaved] = useState(false);

  const save = () => { onChange(form); setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div style={{ maxWidth: 680 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>Event Settings</h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 28 }}>Changes here appear immediately on the live website.</p>

      {saved && <div className="alert alert-success" style={{ marginBottom: 20 }}>✓ Settings saved and live on the site.</div>}

      <div className="card">
        <div className="form-row">
          <div className="form-group">
            <label>Event Title</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Edition</label>
            <input value={form.edition} onChange={e => setForm(f => ({ ...f, edition: e.target.value }))} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Dates</label>
            <input value={form.dates} onChange={e => setForm(f => ({ ...f, dates: e.target.value }))} placeholder="e.g. 27–29 August 2026" />
          </div>
          <div className="form-group">
            <label>Venue</label>
            <input value={form.venue} onChange={e => setForm(f => ({ ...f, venue: e.target.value }))} />
          </div>
        </div>
        <div className="form-group" style={{ maxWidth: 220 }}>
          <label>Registration Fee (GHS)</label>
          <input type="number" min="0" value={form.fee} onChange={e => setForm(f => ({ ...f, fee: Number(e.target.value) }))} />
        </div>
        <div className="form-group">
          <label>Event Description</label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ minHeight: 90 }} />
        </div>

        <div style={{ background: "#f8f9fa", borderRadius: 10, padding: "16px 20px", marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Access Controls</div>
          <ToggleRow label="Registration Open" desc="Participants can register" value={form.registrationOpen}
            onChange={v => setForm(f => ({ ...f, registrationOpen: v }))} />
          <ToggleRow label="Submissions Open" desc="Participants can submit papers" value={form.submissionsOpen}
            onChange={v => setForm(f => ({ ...f, submissionsOpen: v }))} />
        </div>

        <button className="btn-primary" onClick={save}>Save Changes →</button>
      </div>
    </div>
  );
}

/* ── Announcements Panel ─────────────────────────────────────── */
function AnnouncementsPanel({ items, onChange }) {
  const [form, setForm] = useState({ text: "", type: "info" });

  const add = () => {
    if (!form.text.trim()) return;
    onChange([...items, { id: uid(), text: form.text, type: form.type, active: true }]);
    setForm({ text: "", type: "info" });
  };

  const toggle = id => onChange(items.map(a => a.id === id ? { ...a, active: !a.active } : a));
  const remove = id => onChange(items.filter(a => a.id !== id));

  const typeColor = { info: "#1B3A6B", warning: "#b5700a", success: "#1B6B3A" };
  const typeBg    = { info: "#E5EAF3", warning: "#fdf3e0", success: "#e3f5eb" };

  return (
    <div style={{ maxWidth: 720 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>Announcements</h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 28 }}>Active announcements appear as banners on the homepage for all visitors.</p>

      <div className="card" style={{ marginBottom: 24 }}>
        <h4 style={{ marginBottom: 14 }}>New Announcement</h4>
        <div className="form-group">
          <label>Message</label>
          <input value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
            placeholder="e.g. Registration deadline extended to 15 August 2026" onKeyDown={e => e.key === "Enter" && add()} />
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
          <label style={{ fontSize: 14, fontWeight: 500 }}>Type:</label>
          {["info", "warning", "success"].map(t => (
            <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))} style={{
              background: form.type === t ? typeBg[t] : "#f0f0f0",
              color: form.type === t ? typeColor[t] : "#666",
              border: `1.5px solid ${form.type === t ? typeColor[t] : "#ddd"}`,
              borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer",
              textTransform: "capitalize",
            }}>{t}</button>
          ))}
        </div>
        <button className="btn-primary" onClick={add}>Add Announcement</button>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: "center", color: "#888", padding: "40px 0", background: "#fff", borderRadius: 12, border: "1px dashed #ddd" }}>
          No announcements yet. Add one above to display it on the homepage.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map(a => (
            <div key={a.id} style={{
              background: "#fff", border: "1px solid #e0e0e0", borderRadius: 10,
              padding: "14px 18px", display: "flex", alignItems: "center", gap: 14,
              opacity: a.active ? 1 : 0.5,
            }}>
              <span style={{
                background: typeBg[a.type], color: typeColor[a.type],
                fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 12,
                textTransform: "uppercase", flexShrink: 0,
              }}>{a.type}</span>
              <div style={{ flex: 1, fontSize: 14 }}>{a.text}</div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button onClick={() => toggle(a.id)} style={{
                  background: a.active ? "#e3f5eb" : "#f5f5f5",
                  color: a.active ? "#1B6B3A" : "#888",
                  border: "1px solid #ddd", borderRadius: 6, padding: "4px 12px", fontSize: 12, cursor: "pointer",
                }}>{a.active ? "Live ●" : "Hidden"}</button>
                <button onClick={() => remove(a.id)} style={{
                  background: "#fdecea", color: "#c0392b", border: "1px solid #f5b7b1",
                  borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer",
                }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Schedule Editor ─────────────────────────────────────────── */
function ScheduleEditor({ schedule, onChange }) {
  const [activeDay, setActiveDay] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm]   = useState({});
  const [addForm, setAddForm]     = useState({ time: "", title: "", type: "plenary", track: "", presenter: "" });
  const [adding, setAdding]       = useState(false);

  const day = schedule[activeDay];

  const startEdit = (s) => { setEditingId(s.id); setEditForm({ ...s }); };
  const cancelEdit = () => { setEditingId(null); };
  const saveEdit = () => {
    const updated = schedule.map((d, i) => i === activeDay
      ? { ...d, sessions: d.sessions.map(s => s.id === editingId ? { ...editForm } : s) }
      : d
    );
    onChange(updated);
    setEditingId(null);
  };

  const deleteSession = (id) => {
    onChange(schedule.map((d, i) => i === activeDay
      ? { ...d, sessions: d.sessions.filter(s => s.id !== id) }
      : d
    ));
  };

  const addSession = () => {
    if (!addForm.time.trim() || !addForm.title.trim()) return;
    const updated = schedule.map((d, i) => i === activeDay
      ? { ...d, sessions: [...d.sessions, { id: uid(), ...addForm }] }
      : d
    );
    onChange(updated);
    setAddForm({ time: "", title: "", type: "plenary", track: "", presenter: "" });
    setAdding(false);
  };

  const typeColors = { plenary: "#1B3A6B", parallel: "#0F2347", track: "#b5700a", break: "#777" };

  return (
    <div>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>Schedule Editor</h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>Changes update the Schedule page in real-time.</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {schedule.map((d, i) => (
          <button key={i} onClick={() => { setActiveDay(i); setEditingId(null); setAdding(false); }} style={{
            background: activeDay === i ? "#0F2347" : "#fff",
            color: activeDay === i ? "#fff" : "#333",
            border: "1px solid #ddd", borderRadius: 8, padding: "8px 18px",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>{d.day}</button>
        ))}
      </div>

      <div style={{ background: "#0F2347", borderRadius: "10px 10px 0 0", padding: "12px 20px" }}>
        <span style={{ fontWeight: 600, color: "#fff", fontSize: 14 }}>{day.day}</span>
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginLeft: 14 }}>{day.date}</span>
      </div>

      <div style={{ border: "1px solid #e0e0e0", borderTop: "none", borderRadius: "0 0 10px 10px", overflow: "hidden", marginBottom: 16 }}>
        {day.sessions.map((s, si) => (
          <div key={s.id}>
            {editingId === s.id ? (
              <div style={{ background: "#fffbf0", padding: "14px 20px", borderBottom: "1px solid #f0e0b0" }}>
                <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 130px 160px", gap: 10, marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#888", marginBottom: 3 }}>Time</div>
                    <input value={editForm.time} onChange={e => setEditForm(f => ({ ...f, time: e.target.value }))}
                      style={{ width: "100%", padding: "6px 8px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13 }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#888", marginBottom: 3 }}>Session Title</div>
                    <input value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                      style={{ width: "100%", padding: "6px 8px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13 }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#888", marginBottom: 3 }}>Type</div>
                    <select value={editForm.type} onChange={e => setEditForm(f => ({ ...f, type: e.target.value }))}
                      style={{ width: "100%", padding: "6px 8px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13 }}>
                      {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#888", marginBottom: 3 }}>Track</div>
                    <select value={editForm.track} onChange={e => setEditForm(f => ({ ...f, track: e.target.value }))}
                      style={{ width: "100%", padding: "6px 8px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13 }}>
                      {TRACK_OPTIONS.map(t => <option key={t} value={t}>{t || "— None —"}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: "#888", marginBottom: 3 }}>Presenter / Speaker</div>
                  <input value={editForm.presenter} onChange={e => setEditForm(f => ({ ...f, presenter: e.target.value }))}
                    style={{ width: "100%", padding: "6px 8px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13 }} placeholder="e.g. Prof. Kwame Asante" />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={saveEdit} className="btn-primary" style={{ padding: "7px 18px", fontSize: 13 }}>Save</button>
                  <button onClick={cancelEdit} style={{ background: "#f0f0f0", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 13, cursor: "pointer" }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div style={{
                display: "grid", gridTemplateColumns: "90px 1fr auto",
                alignItems: "center", padding: "12px 20px", gap: 12,
                background: si % 2 === 0 ? "#fff" : "#fafafa",
                borderBottom: si < day.sessions.length - 1 ? "1px solid #f0f0f0" : "none",
              }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#555" }}>{s.time}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{s.title}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 3, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, background: "#f0f0f0", color: typeColors[s.type] || "#555", padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>{s.type}</span>
                    {s.track && <span style={{ fontSize: 11, color: "#888" }}>{s.track}</span>}
                    {s.presenter && <span style={{ fontSize: 11, color: "#888" }}>· {s.presenter}</span>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => startEdit(s)} style={{ background: "#E5EAF3", color: "#1B3A6B", border: "none", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer" }}>Edit</button>
                  <button onClick={() => deleteSession(s.id)} style={{ background: "#fdecea", color: "#c0392b", border: "none", borderRadius: 6, padding: "5px 10px", fontSize: 12, cursor: "pointer" }}>✕</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {adding ? (
        <div className="card" style={{ border: "2px dashed #C9A84C" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#b5700a", marginBottom: 12 }}>New Session</div>
          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 130px 160px", gap: 10, marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 3 }}>Time</div>
              <input value={addForm.time} onChange={e => setAddForm(f => ({ ...f, time: e.target.value }))}
                placeholder="e.g. 10:00 AM" style={{ width: "100%", padding: "6px 8px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13 }} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 3 }}>Title</div>
              <input value={addForm.title} onChange={e => setAddForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Session title" style={{ width: "100%", padding: "6px 8px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13 }} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 3 }}>Type</div>
              <select value={addForm.type} onChange={e => setAddForm(f => ({ ...f, type: e.target.value }))}
                style={{ width: "100%", padding: "6px 8px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13 }}>
                {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 3 }}>Track</div>
              <select value={addForm.track} onChange={e => setAddForm(f => ({ ...f, track: e.target.value }))}
                style={{ width: "100%", padding: "6px 8px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13 }}>
                {TRACK_OPTIONS.map(t => <option key={t} value={t}>{t || "— None —"}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 3 }}>Presenter</div>
            <input value={addForm.presenter} onChange={e => setAddForm(f => ({ ...f, presenter: e.target.value }))}
              placeholder="Optional" style={{ width: "100%", padding: "6px 8px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13 }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={addSession} className="btn-primary" style={{ padding: "8px 18px", fontSize: 13 }}>Add Session</button>
            <button onClick={() => setAdding(false)} style={{ background: "#f0f0f0", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 13, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} style={{
          display: "flex", alignItems: "center", gap: 8, background: "#fff",
          border: "2px dashed #ddd", borderRadius: 10, padding: "12px 20px",
          fontSize: 13, color: "#888", cursor: "pointer", width: "100%", justifyContent: "center",
          transition: "border-color 0.2s, color 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#C9A84C"; e.currentTarget.style.color = "#b5700a"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#ddd"; e.currentTarget.style.color = "#888"; }}
        >
          + Add Session to {day.day}
        </button>
      )}
    </div>
  );
}

/* ── Participants Panel ──────────────────────────────────────── */
function ParticipantsPanel({ participants, onChange }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const setPayment = (id, status) =>
    onChange(participants.map(p => p.id === id ? { ...p, payment: status } : p));

  const exportCSV = () => {
    const header = "Name,Email,Programme,Type,Mode,Payment";
    const rows = participants.map(p =>
      [p.name, p.email, p.programme, p.type, p.mode, p.payment]
        .map(v => `"${v}"`)
        .join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "participants.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = participants
    .filter(p => filter === "All" || p.payment === filter)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ marginBottom: 4, fontFamily: "Playfair Display, serif" }}>Participants</h2>
          <p style={{ color: "#666", fontSize: 14 }}>{participants.length} registered · {participants.filter(p => p.payment === "Confirmed").length} confirmed</p>
        </div>
        <button onClick={exportCSV} style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "#1B3A6B", color: "#fff", border: "none",
          borderRadius: 8, padding: "9px 18px", fontSize: 13,
          fontWeight: 600, cursor: "pointer",
        }}>⬇ Export CSV</button>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…"
          style={{ flex: 1, minWidth: 220, padding: "8px 14px", border: "1.5px solid #ddd", borderRadius: 8, fontSize: 14 }} />
        <div style={{ display: "flex", gap: 6 }}>
          {["All", "Confirmed", "Pending"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? "#1B3A6B" : "#fff", color: filter === f ? "#fff" : "#555",
              border: "1px solid #ddd", padding: "6px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer",
            }}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e0e0e0", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f8f9fa" }}>
              {["Name", "Email", "Programme", "Mode", "Payment", "Actions"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#555", borderBottom: "1px solid #eee", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                <td style={{ padding: "12px 16px", fontWeight: 500 }}>{p.name}</td>
                <td style={{ padding: "12px 16px", color: "#666" }}>{p.email}</td>
                <td style={{ padding: "12px 16px", color: "#555" }}>{p.programme}</td>
                <td style={{ padding: "12px 16px" }}>{p.mode}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span className={`badge ${p.payment === "Confirmed" ? "badge-green" : "badge-red"}`}>{p.payment}</span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {p.payment !== "Confirmed" && (
                      <button onClick={() => setPayment(p.id, "Confirmed")} style={{
                        background: "#e3f5eb", color: "#1B6B3A", border: "1px solid #a8d5b8",
                        borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer", fontWeight: 600,
                      }}>Confirm</button>
                    )}
                    {p.payment !== "Pending" && (
                      <button onClick={() => setPayment(p.id, "Pending")} style={{
                        background: "#fdecea", color: "#c0392b", border: "1px solid #f5b7b1",
                        borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer",
                      }}>Revoke</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px", color: "#888", fontSize: 14 }}>No participants match the current filter.</div>
        )}
      </div>
    </div>
  );
}

/* ── Submissions Panel ───────────────────────────────────────── */
function SubmissionsPanel({ submissions, onChange }) {
  const setStatus = (id, status) =>
    onChange(submissions.map(s => s.id === id ? { ...s, status } : s));

  const statusColor = { "Accepted": "#1B6B3A", "Under Review": "#b5700a", "Rejected": "#c0392b" };
  const statusBg    = { "Accepted": "#e3f5eb", "Under Review": "#fdf3e0", "Rejected": "#fdecea" };

  return (
    <div>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>Submissions</h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>{submissions.length} total · {submissions.filter(s => s.status === "Accepted").length} accepted</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {submissions.map(s => (
          <div key={s.id} className="card" style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "start", gap: 20 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{s.title}</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <span className="badge badge-navy" style={{ fontSize: 11 }}>{s.category}</span>
                <span style={{ fontSize: 13, color: "#666" }}>by {s.author}</span>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 12,
                  background: statusBg[s.status], color: statusColor[s.status],
                }}>{s.status}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
              {s.status !== "Accepted" && (
                <button onClick={() => setStatus(s.id, "Accepted")} style={{
                  background: "#e3f5eb", color: "#1B6B3A", border: "1px solid #a8d5b8",
                  borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer", fontWeight: 600,
                }}>✓ Accept</button>
              )}
              {s.status !== "Under Review" && (
                <button onClick={() => setStatus(s.id, "Under Review")} style={{
                  background: "#fdf3e0", color: "#b5700a", border: "1px solid #e8d5a0",
                  borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer",
                }}>In Review</button>
              )}
              {s.status !== "Rejected" && (
                <button onClick={() => setStatus(s.id, "Rejected")} style={{
                  background: "#fdecea", color: "#c0392b", border: "1px solid #f5b7b1",
                  borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer",
                }}>Reject</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Live Feed Panel ─────────────────────────────────────────── */
function FeedPanel({ feed, onChange }) {
  const [form, setForm] = useState({ text: "", type: "update" });

  const typeColor = { update: "#1B3A6B", alert: "#c0392b", info: "#1B6B3A" };
  const typeBg    = { update: "#E5EAF3", alert: "#fdecea", info: "#e3f5eb" };

  const add = () => {
    if (!form.text.trim()) return;
    const now = new Date();
    const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) +
                 " · " + now.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    onChange([{ id: uid(), text: form.text, type: form.type, time, active: true }, ...feed]);
    setForm({ text: "", type: "update" });
  };

  const toggle = id => onChange(feed.map(f => f.id === id ? { ...f, active: !f.active } : f));
  const remove = id => onChange(feed.filter(f => f.id !== id));

  return (
    <div style={{ maxWidth: 720 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>Live Feed</h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 28 }}>
        Post real-time updates that appear as a live ticker on the homepage. Great for day-of announcements, room changes, or reminders.
      </p>

      <div className="card" style={{ marginBottom: 24 }}>
        <h4 style={{ marginBottom: 14 }}>New Update</h4>
        <div className="form-group">
          <label>Message</label>
          <input value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
            placeholder="e.g. Keynote is now starting in the Main Hall — all attendees please proceed"
            onKeyDown={e => e.key === "Enter" && add()} />
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
          <label style={{ fontSize: 14, fontWeight: 500 }}>Type:</label>
          {["update", "alert", "info"].map(t => (
            <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))} style={{
              background: form.type === t ? typeBg[t] : "#f0f0f0",
              color: form.type === t ? typeColor[t] : "#666",
              border: `1.5px solid ${form.type === t ? typeColor[t] : "#ddd"}`,
              borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer",
              textTransform: "capitalize",
            }}>{t}</button>
          ))}
        </div>
        <button className="btn-primary" onClick={add}>Post Update →</button>
      </div>

      {feed.length === 0 ? (
        <div style={{ textAlign: "center", color: "#888", padding: "40px 0", background: "#fff", borderRadius: 12, border: "1px dashed #ddd" }}>
          No feed updates yet. Post one above to display it on the homepage.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {feed.map(f => (
            <div key={f.id} style={{
              background: "#fff", border: "1px solid #e0e0e0", borderRadius: 10,
              padding: "14px 18px", display: "flex", alignItems: "center", gap: 14,
              opacity: f.active ? 1 : 0.5,
            }}>
              <span style={{
                background: typeBg[f.type], color: typeColor[f.type],
                fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 12,
                textTransform: "uppercase", flexShrink: 0,
              }}>{f.type}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14 }}>{f.text}</div>
                <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{f.time}</div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button onClick={() => toggle(f.id)} style={{
                  background: f.active ? "#e3f5eb" : "#f5f5f5",
                  color: f.active ? "#1B6B3A" : "#888",
                  border: "1px solid #ddd", borderRadius: 6, padding: "4px 12px", fontSize: 12, cursor: "pointer",
                }}>{f.active ? "Live ●" : "Hidden"}</button>
                <button onClick={() => remove(f.id)} style={{
                  background: "#fdecea", color: "#c0392b", border: "1px solid #f5b7b1",
                  borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer",
                }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Awards Panel ────────────────────────────────────────────── */
function AwardsPanel({ awards, onChange, pastWinners = [], onChangePastWinners }) {
  const [forms, setForms] = useState(awards.map(a => ({ winner: a.winner, paper: a.paper })));
  const [pastForms, setPastForms] = useState(pastWinners.map(w => ({ ...w })));
  const [saved, setSaved] = useState(false);
  const [pastSaved, setPastSaved] = useState(false);

  const updatePastForm = (i, field, val) =>
    setPastForms(pf => pf.map((w, wi) => wi === i ? { ...w, [field]: val } : w));

  const savePastWinners = () => {
    onChangePastWinners && onChangePastWinners(pastForms);
    setPastSaved(true);
    setTimeout(() => setPastSaved(false), 2500);
  };

  const updateForm = (i, field, val) => {
    const next = forms.map((f, fi) => fi === i ? { ...f, [field]: val } : f);
    setForms(next);
  };

  const saveAll = () => {
    onChange(awards.map((a, i) => ({ ...a, winner: forms[i].winner, paper: forms[i].paper })));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const toggleAnnounce = (i) => {
    onChange(awards.map((a, ai) => ai === i ? { ...a, announced: !a.announced } : a));
  };

  return (
    <div style={{ maxWidth: 680 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>Awards</h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 8 }}>Enter winner details and toggle "Announce" to make them visible on the Awards page.</p>

      <div className="alert alert-info" style={{ marginBottom: 24, fontSize: 13 }}>
        Winners only appear on the public Awards page when "Announced" is toggled on.
      </div>

      {saved && <div className="alert alert-success" style={{ marginBottom: 16 }}>✓ Award details saved.</div>}

      {awards.map((a, i) => (
        <div key={a.id} className="card" style={{ marginBottom: 16, borderLeft: `4px solid ${i === 0 ? "#C9A84C" : i === 1 ? "#aaa" : "#b5700a"}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 28 }}>{a.emoji}</span>
              <span style={{ fontWeight: 700, fontSize: 16, fontFamily: "Playfair Display, serif" }}>{a.label}</span>
            </div>
            <button onClick={() => toggleAnnounce(i)} style={{
              background: a.announced ? "#e3f5eb" : "#f5f5f5",
              color: a.announced ? "#1B6B3A" : "#888",
              border: `1.5px solid ${a.announced ? "#a8d5b8" : "#ddd"}`,
              borderRadius: 20, padding: "5px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}>{a.announced ? "● Announced" : "○ Not Announced"}</button>
          </div>
          <div className="form-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Winner Name</label>
              <input value={forms[i].winner} onChange={e => updateForm(i, "winner", e.target.value)}
                placeholder="e.g. Kwame Asante" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Paper Title</label>
              <input value={forms[i].paper} onChange={e => updateForm(i, "paper", e.target.value)}
                placeholder="e.g. Deep Learning for Malaria Detection" />
            </div>
          </div>
        </div>
      ))}

      <button className="btn-primary" onClick={saveAll} style={{ marginTop: 4 }}>Save Award Details →</button>

      {/* Past Winners */}
      <div style={{ marginTop: 36, paddingTop: 28, borderTop: "2px solid #f0f0f0" }}>
        <h3 style={{ fontFamily: "Playfair Display, serif", marginBottom: 6 }}>Past Winners (Historical)</h3>
        <p style={{ color: "#666", fontSize: 14, marginBottom: 20 }}>Names displayed on the Awards page under "Maiden Workshop 2025". Leave name blank to show placeholder text.</p>
        {pastSaved && <div className="alert alert-success" style={{ marginBottom: 16 }}>✓ Past winners saved.</div>}
        {pastForms.map((w, i) => (
          <div key={w.id || i} className="card" style={{ marginBottom: 14, borderLeft: `4px solid ${i === 0 ? "#C9A84C" : i === 1 ? "#aaa" : "#b5700a"}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 22 }}>{w.pos}</span>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{w.place}</span>
              <span style={{ fontSize: 12, color: "#888" }}>· {w.edition}</span>
            </div>
            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Winner Name</label>
                <input value={w.name} onChange={e => updatePastForm(i, "name", e.target.value)} placeholder="e.g. Akua Asante (or leave blank)" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Field / Programme</label>
                <input value={w.field} onChange={e => updatePastForm(i, "field", e.target.value)} placeholder="e.g. Computer Science" />
              </div>
            </div>
            <div className="form-row" style={{ marginTop: 10 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Edition Label</label>
                <input value={w.edition} onChange={e => updatePastForm(i, "edition", e.target.value)} placeholder="Maiden Workshop 2025" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Photo URL (optional)</label>
                <input value={w.avatar} onChange={e => updatePastForm(i, "avatar", e.target.value)} placeholder="/images/... or https://..." />
              </div>
            </div>
          </div>
        ))}
        <button className="btn-outline" onClick={savePastWinners}>Save Past Winners →</button>
      </div>
    </div>
  );
}

/* ── Speakers Panel ──────────────────────────────────────────── */
function SpeakersPanel({ speakers = {}, onChange }) {
  const [keynote, setKeynote] = useState({ ...(speakers.keynote || {}) });
  const [panelists, setPanelists] = useState((speakers.panelists || []).map(p => ({ ...p })));
  const [committee, setCommittee] = useState((speakers.committee || []).map(m => ({ ...m })));
  const [saved, setSaved] = useState(false);

  const save = () => {
    onChange({ keynote, panelists, committee });
    setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  const updatePanelist = (i, field, val) =>
    setPanelists(ps => ps.map((p, pi) => pi === i ? { ...p, [field]: val } : p));
  const updateCommittee = (i, field, val) =>
    setCommittee(cs => cs.map((m, mi) => mi === i ? { ...m, [field]: val } : m));

  const addPanelist = () => setPanelists(ps => [...ps, { id: uid(), name: "", title: "", institution: "", role: "Panelist", bio: "", photo: "" }]);
  const removePanelist = i => setPanelists(ps => ps.filter((_, pi) => pi !== i));
  const addCommittee = () => setCommittee(cs => [...cs, { id: uid(), name: "", role: "", institution: "" }]);
  const removeCommittee = i => setCommittee(cs => cs.filter((_, ci) => ci !== i));

  return (
    <div style={{ maxWidth: 760 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>Speakers &amp; Committee</h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>Changes appear immediately on the Speakers page.</p>
      {saved && <div className="alert alert-success" style={{ marginBottom: 20 }}>✓ Saved.</div>}

      {/* Keynote */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h4 style={{ marginBottom: 16, fontFamily: "Playfair Display, serif" }}>Keynote Speaker</h4>
        <div className="form-row">
          <div className="form-group"><label>Name</label><input value={keynote.name} onChange={e => setKeynote(k => ({ ...k, name: e.target.value }))} /></div>
          <div className="form-group"><label>Title</label><input value={keynote.title} onChange={e => setKeynote(k => ({ ...k, title: e.target.value }))} /></div>
        </div>
        <div className="form-group"><label>Institution</label><input value={keynote.institution} onChange={e => setKeynote(k => ({ ...k, institution: e.target.value }))} /></div>
        <div className="form-group"><label>Talk Topic</label><input value={keynote.topic} onChange={e => setKeynote(k => ({ ...k, topic: e.target.value }))} /></div>
        <div className="form-group"><label>Bio</label><textarea value={keynote.bio} onChange={e => setKeynote(k => ({ ...k, bio: e.target.value }))} style={{ minHeight: 80 }} /></div>
        <div className="form-row">
          <div className="form-group">
            <label>Photo URL</label>
            <input value={keynote.photo} onChange={e => setKeynote(k => ({ ...k, photo: e.target.value }))} placeholder="/images/..." />
            {keynote.photo && <img src={keynote.photo} alt="keynote preview" style={{ width: 96, height: 68, objectFit: "cover", borderRadius: 6, border: "1px solid #ddd", marginTop: 6, display: "block" }} />}
          </div>
          <div className="form-group"><label>Tags (comma-separated)</label><input value={keynote.tags} onChange={e => setKeynote(k => ({ ...k, tags: e.target.value }))} placeholder="AI, Machine Learning" /></div>
        </div>
      </div>

      {/* Panelists */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h4 style={{ fontFamily: "Playfair Display, serif" }}>Panelists</h4>
          <button onClick={addPanelist} style={{ background: "#1B3A6B", color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer" }}>+ Add</button>
        </div>
        {panelists.map((p, i) => (
          <div key={p.id} style={{ border: "1px solid #e0e0e0", borderRadius: 10, padding: "16px", marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{p.name || `Panelist ${i + 1}`}</span>
              <button onClick={() => removePanelist(i)} style={{ background: "#fdecea", color: "#c0392b", border: "none", borderRadius: 6, padding: "3px 10px", fontSize: 12, cursor: "pointer" }}>Remove</button>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Name</label><input value={p.name} onChange={e => updatePanelist(i, "name", e.target.value)} /></div>
              <div className="form-group"><label>Role</label><input value={p.role} onChange={e => updatePanelist(i, "role", e.target.value)} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Title</label><input value={p.title} onChange={e => updatePanelist(i, "title", e.target.value)} /></div>
              <div className="form-group"><label>Institution</label><input value={p.institution} onChange={e => updatePanelist(i, "institution", e.target.value)} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Bio</label><textarea value={p.bio} onChange={e => updatePanelist(i, "bio", e.target.value)} style={{ minHeight: 60 }} /></div>
              <div className="form-group">
                <label>Photo URL</label>
                <input value={p.photo} onChange={e => updatePanelist(i, "photo", e.target.value)} placeholder="/images/..." />
                {p.photo && <img src={p.photo} alt="panelist preview" style={{ width: 80, height: 58, objectFit: "cover", borderRadius: 6, border: "1px solid #ddd", marginTop: 6, display: "block" }} />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Committee */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h4 style={{ fontFamily: "Playfair Display, serif" }}>Organising Committee</h4>
          <button onClick={addCommittee} style={{ background: "#1B3A6B", color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer" }}>+ Add</button>
        </div>
        {committee.map((m, i) => (
          <div key={m.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 10, alignItems: "end", marginBottom: 10 }}>
            <div className="form-group" style={{ marginBottom: 0 }}><label>Name</label><input value={m.name} onChange={e => updateCommittee(i, "name", e.target.value)} /></div>
            <div className="form-group" style={{ marginBottom: 0 }}><label>Role</label><input value={m.role} onChange={e => updateCommittee(i, "role", e.target.value)} /></div>
            <div className="form-group" style={{ marginBottom: 0 }}><label>Institution</label><input value={m.institution} onChange={e => updateCommittee(i, "institution", e.target.value)} /></div>
            <button onClick={() => removeCommittee(i)} style={{ background: "#fdecea", color: "#c0392b", border: "none", borderRadius: 6, padding: "8px 10px", fontSize: 12, cursor: "pointer", marginBottom: 20 }}>✕</button>
          </div>
        ))}
      </div>

      <button className="btn-primary" onClick={save}>Save Speakers →</button>
    </div>
  );
}

/* ── Contact Info Panel ──────────────────────────────────────── */
function ContactPanel({ contact = {}, onChange }) {
  const [form, setForm] = useState({ email: "", website: "", location: "", hours: "", whatsapp: "", ...contact });
  const [saved, setSaved] = useState(false);

  const save = () => { onChange(form); setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>Contact Info</h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>These details appear on the Contact page and WhatsApp button.</p>
      {saved && <div className="alert alert-success" style={{ marginBottom: 20 }}>✓ Saved.</div>}

      <div className="card">
        <div className="form-row">
          <div className="form-group"><label>Email Address</label><input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="dcsworkshop@ug.edu.gh" /></div>
          <div className="form-group"><label>Website</label><input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="www.cs.ug.edu.gh" /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>WhatsApp Number</label><input value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} placeholder="233XXXXXXXXX" /></div>
          <div className="form-group"><label>Office Hours</label><input value={form.hours} onChange={e => setForm(f => ({ ...f, hours: e.target.value }))} placeholder="Mon–Fri · 8:00 AM – 5:00 PM GMT" /></div>
        </div>
        <div className="form-group">
          <label>Location (one line per line)</label>
          <textarea value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} style={{ minHeight: 80 }} />
        </div>
        <button className="btn-primary" onClick={save}>Save Contact Info →</button>
      </div>
    </div>
  );
}

/* ── Footer Panel ────────────────────────────────────────────── */
function FooterPanel({ footer = {}, onChange }) {
  const [form, setForm] = useState({
    tagline:     footer.tagline     || "",
    dates:       footer.dates       || "",
    organizers:  (footer.organizers  || []).join("\n"),
    sponsors:    (footer.sponsors    || []).join("\n"),
    publication: footer.publication || "",
  });
  const [saved, setSaved] = useState(false);

  const save = () => {
    onChange({
      tagline:     form.tagline,
      dates:       form.dates,
      organizers:  form.organizers.split("\n").map(s => s.trim()).filter(Boolean),
      sponsors:    form.sponsors.split("\n").map(s => s.trim()).filter(Boolean),
      publication: form.publication,
    });
    setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>Footer</h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>Edit the footer tagline, organizers, sponsors, and publication details.</p>
      {saved && <div className="alert alert-success" style={{ marginBottom: 20 }}>✓ Saved.</div>}

      <div className="card">
        <div className="form-row">
          <div className="form-group"><label>Tagline</label><input value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} placeholder="2nd Annual Postgraduate Students Workshop" /></div>
          <div className="form-group"><label>Dates</label><input value={form.dates} onChange={e => setForm(f => ({ ...f, dates: e.target.value }))} placeholder="27–29 August 2026 · Hybrid Format" /></div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Organizers (one per line)</label>
            <textarea value={form.organizers} onChange={e => setForm(f => ({ ...f, organizers: e.target.value }))} style={{ minHeight: 80 }} />
          </div>
          <div className="form-group">
            <label>Sponsors &amp; Funders (one per line)</label>
            <textarea value={form.sponsors} onChange={e => setForm(f => ({ ...f, sponsors: e.target.value }))} style={{ minHeight: 80 }} />
          </div>
        </div>
        <div className="form-group" style={{ maxWidth: 280 }}>
          <label>Publication Partner</label>
          <input value={form.publication} onChange={e => setForm(f => ({ ...f, publication: e.target.value }))} placeholder="CBAS Journal" />
        </div>
        <button className="btn-primary" onClick={save}>Save Footer →</button>
      </div>
    </div>
  );
}

/* ── Home Page Panel ─────────────────────────────────────────── */
function HomePanel({ event, onChange }) {
  const [form, setForm] = useState({ ...event });
  const [saved, setSaved] = useState(false);
  const save = () => { onChange(form); setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div style={{ maxWidth: 680 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>Home Page</h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 28 }}>Edit the headline, dates, venue and hero content shown on the Home page.</p>
      {saved && <div className="alert alert-success" style={{ marginBottom: 20 }}>✓ Saved — changes are live on the Home page.</div>}

      <div className="card" style={{ marginBottom: 20 }}>
        <h4 style={{ marginBottom: 16, fontFamily: "Playfair Display, serif" }}>Hero Section</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Event Title</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Edition</label>
            <input value={form.edition} onChange={e => setForm(f => ({ ...f, edition: e.target.value }))} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Dates</label>
            <input value={form.dates} onChange={e => setForm(f => ({ ...f, dates: e.target.value }))} placeholder="27–29 August 2026" />
          </div>
          <div className="form-group">
            <label>Venue</label>
            <input value={form.venue} onChange={e => setForm(f => ({ ...f, venue: e.target.value }))} />
          </div>
        </div>
        <div className="form-group">
          <label>Short Description</label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ minHeight: 80 }} />
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h4 style={{ marginBottom: 14, fontFamily: "Playfair Display, serif" }}>Registration</h4>
        <div className="form-group" style={{ maxWidth: 200 }}>
          <label>Registration Fee (GHS)</label>
          <input type="number" min="0" value={form.fee} onChange={e => setForm(f => ({ ...f, fee: Number(e.target.value) }))} />
        </div>
        <ToggleRow label="Registration Open" desc="Visitors can register from the Home page" value={form.registrationOpen}
          onChange={v => setForm(f => ({ ...f, registrationOpen: v }))} />
        <ToggleRow label="Submissions Open" desc="Participants can submit papers" value={form.submissionsOpen}
          onChange={v => setForm(f => ({ ...f, submissionsOpen: v }))} />
      </div>

      <div style={{ background: "#f8f9fa", borderRadius: 12, padding: "16px 20px", marginBottom: 20, fontSize: 13, color: "#666" }}>
        <strong style={{ color: "#1B3A6B" }}>Homepage banners & ticker</strong> — manage via <strong>Announcements</strong> and <strong>Live Feed</strong> in Admin Tools.
        <br />
        <strong style={{ color: "#1B3A6B" }}>Homepage photos</strong> — change images via <strong>Site Images</strong> in Admin Tools.
      </div>

      <button className="btn-primary" onClick={save}>Save Home Page →</button>
    </div>
  );
}

/* ── About Page Panel ────────────────────────────────────────── */
function AboutPanel({ about = {}, onChange }) {
  const [form, setForm] = useState({
    badge:        about.badge        || "2nd Annual Edition",
    title:        about.title        || "A Platform for Academic Excellence in Postgraduate Research",
    desc1:        about.desc1        || "",
    desc2:        about.desc2        || "",
    imageCaption1: about.imageCaption1 || "Advancing Research at UG",
    imageCaption2: about.imageCaption2 || "Dept. of Computer Science · SPMS",
    cardText:     about.cardText     || "",
  });
  const [saved, setSaved] = useState(false);
  const save = () => { onChange(form); setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div style={{ maxWidth: 680 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>About Page</h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>Edit the overview text, captions, and key messages shown on the About page.</p>
      {saved && <div className="alert alert-success" style={{ marginBottom: 20 }}>✓ Saved — changes are live on the About page.</div>}

      <div className="card" style={{ marginBottom: 20 }}>
        <h4 style={{ marginBottom: 16, fontFamily: "Playfair Display, serif" }}>Hero &amp; Overview</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Hero Badge Text</label>
            <input value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} placeholder="2nd Annual Edition" />
          </div>
        </div>
        <div className="form-group">
          <label>Section Heading</label>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="A Platform for Academic Excellence…" />
        </div>
        <div className="form-group">
          <label>First Paragraph</label>
          <textarea value={form.desc1} onChange={e => setForm(f => ({ ...f, desc1: e.target.value }))} style={{ minHeight: 80 }} placeholder="Introductory paragraph about the workshop…" />
        </div>
        <div className="form-group">
          <label>Second Paragraph</label>
          <textarea value={form.desc2} onChange={e => setForm(f => ({ ...f, desc2: e.target.value }))} style={{ minHeight: 80 }} placeholder="Continued description…" />
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h4 style={{ marginBottom: 16, fontFamily: "Playfair Display, serif" }}>Image Captions</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Caption Line 1</label>
            <input value={form.imageCaption1} onChange={e => setForm(f => ({ ...f, imageCaption1: e.target.value }))} placeholder="Advancing Research at UG" />
          </div>
          <div className="form-group">
            <label>Caption Line 2</label>
            <input value={form.imageCaption2} onChange={e => setForm(f => ({ ...f, imageCaption2: e.target.value }))} placeholder="Dept. of Computer Science · SPMS" />
          </div>
        </div>
        <div className="form-group">
          <label>Info Card Text</label>
          <textarea value={form.cardText} onChange={e => setForm(f => ({ ...f, cardText: e.target.value }))} style={{ minHeight: 70 }} placeholder="Brief note about this edition compared to the previous…" />
        </div>
      </div>

      <div style={{ background: "#f8f9fa", borderRadius: 12, padding: "14px 18px", marginBottom: 20, fontSize: 13, color: "#666" }}>
        <strong style={{ color: "#1B3A6B" }}>Hero background image</strong> — change via <strong>Site Images → Research Presentations</strong> in Admin Tools.
      </div>

      <button className="btn-primary" onClick={save}>Save About Page →</button>
    </div>
  );
}

/* ── Livestream Page Panel ───────────────────────────────────── */
function StreamPanel({ stream = {}, onChange }) {
  const [form, setForm] = useState({
    live:   stream.live   || false,
    note:   stream.note   || "",
    day1Id: stream.day1Id || "",
    day2Id: stream.day2Id || "",
    day3Id: stream.day3Id || "",
  });
  const [saved, setSaved] = useState(false);
  const save = () => { onChange(form); setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>Livestream Page</h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>Control the live stream status and YouTube video IDs for each day.</p>
      {saved && <div className="alert alert-success" style={{ marginBottom: 20 }}>✓ Saved — changes are live on the Livestream page.</div>}

      <div className="card" style={{ marginBottom: 20 }}>
        <ToggleRow label="Stream is Live" desc="Activates the video player for visitors — turn on when streaming begins" value={form.live}
          onChange={v => setForm(f => ({ ...f, live: v }))} />
        <div className="form-group" style={{ marginTop: 16 }}>
          <label>Stream Notice / Message</label>
          <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
            placeholder="e.g. Stream begins at 9:00 AM GMT on 27 August 2026. Please refresh if buffering." style={{ minHeight: 70 }} />
        </div>
      </div>

      <div className="card">
        <h4 style={{ marginBottom: 16, fontFamily: "Playfair Display, serif" }}>YouTube Video IDs — Per Day</h4>
        <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>
          Paste only the video ID (e.g. <code>1KWiyZnJFmw</code>), not the full URL. Leave blank if not yet available.
        </p>
        {[
          { key: "day1Id", label: "Day 1 — Thursday 27 Aug", placeholder: "e.g. dQw4w9WgXcQ" },
          { key: "day2Id", label: "Day 2 — Friday 28 Aug",   placeholder: "e.g. 1KWiyZnJFmw" },
          { key: "day3Id", label: "Day 3 — Saturday 29 Aug", placeholder: "e.g. NUAZDcQ_lJs" },
        ].map(d => (
          <div key={d.key} className="form-group">
            <label>{d.label}</label>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input value={form[d.key]} onChange={e => setForm(f => ({ ...f, [d.key]: e.target.value }))}
                placeholder={d.placeholder} style={{ flex: 1 }} />
              {form[d.key] && (
                <a href={`https://youtube.com/watch?v=${form[d.key]}`} target="_blank" rel="noreferrer"
                  style={{ fontSize: 12, color: "#1B3A6B", whiteSpace: "nowrap" }}>▶ Preview</a>
              )}
            </div>
          </div>
        ))}
        <button className="btn-primary" onClick={save}>Save Livestream Settings →</button>
      </div>
    </div>
  );
}

/* ── Sponsors Page Panel ─────────────────────────────────────── */
function SponsorsAdminPanel({ footer = {}, onChange }) {
  const [form, setForm] = useState({
    organizers:  (footer.organizers  || []).join("\n"),
    sponsors:    (footer.sponsors    || []).join("\n"),
    publication: footer.publication || "CBAS Journal",
  });
  const [saved, setSaved] = useState(false);

  const save = () => {
    onChange({
      ...footer,
      organizers:  form.organizers.split("\n").map(s => s.trim()).filter(Boolean),
      sponsors:    form.sponsors.split("\n").map(s => s.trim()).filter(Boolean),
      publication: form.publication,
    });
    setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>Sponsors Page</h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>Edit sponsor names and publication partner shown site-wide.</p>
      {saved && <div className="alert alert-success" style={{ marginBottom: 20 }}>✓ Saved.</div>}

      <div className="card" style={{ marginBottom: 20 }}>
        <h4 style={{ marginBottom: 14, fontFamily: "Playfair Display, serif" }}>Institutional Sponsors</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Organizers (one per line)</label>
            <textarea value={form.organizers} onChange={e => setForm(f => ({ ...f, organizers: e.target.value }))} style={{ minHeight: 90 }} />
          </div>
          <div className="form-group">
            <label>Sponsors & Funders (one per line)</label>
            <textarea value={form.sponsors} onChange={e => setForm(f => ({ ...f, sponsors: e.target.value }))} style={{ minHeight: 90 }} />
          </div>
        </div>
        <div className="form-group" style={{ maxWidth: 280 }}>
          <label>Publication Partner</label>
          <input value={form.publication} onChange={e => setForm(f => ({ ...f, publication: e.target.value }))} placeholder="CBAS Journal" />
        </div>
        <button className="btn-primary" onClick={save}>Save Sponsors →</button>
      </div>

      <div style={{ background: "#f8f9fa", borderRadius: 12, padding: "16px 20px", fontSize: 13, color: "#666" }}>
        <strong style={{ color: "#1B3A6B" }}>Sponsorship tiers & contact info</strong> — the tier packages (Platinum, Gold, Silver, Bronze) and the contact email on the Sponsors page are fixed. Contact the developer to update these.
      </div>
    </div>
  );
}

/* ── Register Page Panel ─────────────────────────────────────── */
function RegisterPanel({ event, onChange }) {
  const [form, setForm] = useState({ ...event });
  const [saved, setSaved] = useState(false);
  const save = () => { onChange(form); setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div style={{ maxWidth: 560 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>Register Page</h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 28 }}>Control registration availability and fee shown on the Register page.</p>
      {saved && <div className="alert alert-success" style={{ marginBottom: 20 }}>✓ Saved — changes are live on the Register page.</div>}

      <div className="card">
        <ToggleRow label="Registration Open" desc="Visitors can submit the registration form" value={form.registrationOpen}
          onChange={v => setForm(f => ({ ...f, registrationOpen: v }))} />
        <ToggleRow label="Submissions Open" desc="Participants can submit paper abstracts" value={form.submissionsOpen}
          onChange={v => setForm(f => ({ ...f, submissionsOpen: v }))} />
        <div className="form-group" style={{ maxWidth: 200, marginTop: 16 }}>
          <label>Registration Fee (GHS)</label>
          <input type="number" min="0" value={form.fee} onChange={e => setForm(f => ({ ...f, fee: Number(e.target.value) }))} />
        </div>
        <div className="form-group" style={{ marginTop: 16 }}>
          <label>Paystack Public Key</label>
          <input value={form.paystackKey || ""} onChange={e => setForm(f => ({ ...f, paystackKey: e.target.value }))}
            placeholder="pk_live_xxxxxxxxxxxxxxxxxxxxxxxx" />
          <p style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
            Get your key from <strong>paystack.com/dashboard</strong>. Also add to <code>index.html</code>:<br />
            <code style={{ fontSize: 11 }}>&lt;script src="https://js.paystack.co/v1/inline.js"&gt;&lt;/script&gt;</code>
          </p>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Event Dates</label>
            <input value={form.dates} onChange={e => setForm(f => ({ ...f, dates: e.target.value }))} placeholder="27–29 August 2026" />
          </div>
          <div className="form-group">
            <label>Venue</label>
            <input value={form.venue} onChange={e => setForm(f => ({ ...f, venue: e.target.value }))} />
          </div>
        </div>
        <button className="btn-primary" onClick={save}>Save Register Settings →</button>
      </div>
    </div>
  );
}

/* ── Site Images Panel ───────────────────────────────────────── */
function ImagesPanel({ images = {}, onChange }) {
  const [form, setForm] = useState({
    workshop:   images.workshop   || "/images/workshop-sessions.jpg",
    research:   images.research   || "/images/research-presentations.jpg",
    networking: images.networking || "/images/collaboration-networking.jpeg",
    students:   images.students   || "/images/dcs-research.jpg",
  });
  const [saved, setSaved] = useState(false);

  const save = () => { onChange(form); setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const IMAGE_DEFS = [
    {
      key: "workshop",
      label: "Workshop Sessions",
      usedOn: "Home hero background · Home photo strip · Home testimonials",
    },
    {
      key: "research",
      label: "Research Presentations",
      usedOn: "Home 'About' section · Home photo strip · About page hero",
    },
    {
      key: "networking",
      label: "Networking & Events",
      usedOn: "Home CTA background · Contact page · Speakers page · Sponsors page",
    },
    {
      key: "students",
      label: "Students / DCS Research",
      usedOn: "Home hero card photo · Home awards background · Home testimonials",
    },
  ];

  return (
    <div style={{ maxWidth: 720 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>Site Images</h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 8 }}>
        These 4 images appear across all pages of the site. Change a URL here and every page that uses it updates instantly.
      </p>
      <div className="alert alert-info" style={{ marginBottom: 24, fontSize: 13 }}>
        To use a local file: place it in <code>public/images/</code> and enter <code>/images/yourfile.jpg</code>. For external images, paste any direct image URL.
      </div>

      {saved && <div className="alert alert-success" style={{ marginBottom: 20 }}>✓ Images saved and live on the site.</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {IMAGE_DEFS.map(def => (
          <div key={def.key} style={{
            background: "#fff", border: "1px solid #e0e0e0", borderRadius: 14,
            padding: "20px 22px", display: "flex", gap: 20, alignItems: "flex-start",
          }}>
            {/* Preview thumbnail */}
            <div style={{
              width: 130, height: 90, borderRadius: 10, overflow: "hidden",
              border: "1px solid #e0e0e0", flexShrink: 0, background: "#f5f5f5",
              position: "relative",
            }}>
              {form[def.key] ? (
                <img src={form[def.key]} alt={def.label}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#bbb", fontSize: 28 }}>🖼️</div>
              )}
            </div>

            {/* Controls */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3, color: "#1B3A6B" }}>{def.label}</div>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 10 }}>
                Used on: {def.usedOn}
              </div>
              <input
                value={form[def.key]}
                onChange={e => setForm(f => ({ ...f, [def.key]: e.target.value }))}
                placeholder="https://... or /images/filename.jpg"
                style={{ width: "100%", padding: "8px 12px", border: "1.5px solid #ddd", borderRadius: 8, fontSize: 13 }}
              />
            </div>
          </div>
        ))}
      </div>

      <button className="btn-primary" onClick={save} style={{ marginTop: 24 }}>Save All Images →</button>
    </div>
  );
}

/* ── Gallery Panel ───────────────────────────────────────────── */
function GalleryPanel({ gallery = [], onChange }) {
  const [items, setItems] = useState(gallery.map(p => ({ ...p })));
  const [saved, setSaved] = useState(false);

  const save = () => { onChange(items); setSaved(true); setTimeout(() => setSaved(false), 2500); };
  const update = (i, field, val) => setItems(arr => arr.map((p, pi) => pi === i ? { ...p, [field]: val } : p));
  const remove = (i) => setItems(arr => arr.filter((_, pi) => pi !== i));
  const add = () => setItems(arr => [...arr, { src: "", caption: "New Photo", year: "2025" }]);

  return (
    <div style={{ maxWidth: 760 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>Gallery</h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>Manage photos shown on the Gallery page. Each photo has a caption and year label.</p>
      {saved && <div className="alert alert-success" style={{ marginBottom: 20 }}>✓ Gallery saved.</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
        {items.map((p, i) => (
          <div key={i} style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 12, padding: "16px 18px", display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ width: 110, height: 76, borderRadius: 8, overflow: "hidden", border: "1px solid #eee", flexShrink: 0, background: "#f5f5f5" }}>
              {p.src && <img src={p.src} alt={p.caption} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
            </div>
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: 10, alignItems: "end" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Image URL</label>
                <input value={p.src} onChange={e => update(i, "src", e.target.value)} placeholder="/images/... or https://..." />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Caption</label>
                <input value={p.caption} onChange={e => update(i, "caption", e.target.value)} />
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div className="form-group" style={{ marginBottom: 0, width: 72 }}>
                  <label>Year</label>
                  <input value={p.year} onChange={e => update(i, "year", e.target.value)} />
                </div>
                <button onClick={() => remove(i)} style={{ background: "#fdecea", color: "#c0392b", border: "none", borderRadius: 6, padding: "6px 10px", fontSize: 13, cursor: "pointer", marginTop: 20, flexShrink: 0 }}>✕</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={add} style={{ background: "#fff", border: "2px dashed #C9A84C", color: "#b5700a", borderRadius: 10, padding: "10px 20px", fontSize: 13, cursor: "pointer" }}>+ Add Photo</button>
        <button className="btn-primary" onClick={save}>Save Gallery →</button>
      </div>
    </div>
  );
}

/* ── Recordings Panel ────────────────────────────────────────── */
function RecordingsPanel({ recordings = [], onChange }) {
  const [items, setItems] = useState(recordings.map(r => ({ ...r })));
  const [saved, setSaved] = useState(false);

  const save = () => { onChange(items); setSaved(true); setTimeout(() => setSaved(false), 2500); };
  const update = (i, field, val) => setItems(arr => arr.map((r, ri) => ri === i ? { ...r, [field]: val } : r));
  const updateHighlight = (i, hi, val) => setItems(arr => arr.map((r, ri) => ri === i
    ? { ...r, highlights: r.highlights.map((h, hii) => hii === hi ? val : h) }
    : r
  ));

  return (
    <div style={{ maxWidth: 700 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>Recordings</h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>Set YouTube video IDs and highlight bullet points for each workshop day recording.</p>
      {saved && <div className="alert alert-success" style={{ marginBottom: 20 }}>✓ Recordings saved.</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {items.map((r, i) => (
          <div key={i} className="card" style={{ borderLeft: `4px solid ${r.color}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ fontWeight: 700, fontSize: 15, fontFamily: "Playfair Display, serif", color: r.color }}>{r.day}</span>
              <span style={{ fontSize: 13, color: "#666" }}>{r.label}</span>
            </div>
            <div className="form-group">
              <label>YouTube Video ID</label>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input value={r.youtubeId} onChange={e => update(i, "youtubeId", e.target.value)}
                  placeholder="e.g. 1KWiyZnJFmw (leave blank = coming soon)" style={{ flex: 1 }} />
                {r.youtubeId && (
                  <a href={`https://youtube.com/watch?v=${r.youtubeId}`} target="_blank" rel="noreferrer"
                    style={{ fontSize: 12, color: "#1B3A6B", whiteSpace: "nowrap" }}>▶ Preview</a>
                )}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 8 }}>Highlights (shown in sidebar)</label>
              {r.highlights.map((h, hi) => (
                <input key={hi} value={h} onChange={e => updateHighlight(i, hi, e.target.value)}
                  style={{ width: "100%", padding: "6px 10px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13, marginBottom: 6 }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="btn-primary" onClick={save} style={{ marginTop: 20 }}>Save Recordings →</button>
    </div>
  );
}

/* ── Support Page Panel ──────────────────────────────────────── */
function SupportAdminPanel({ contact = {}, onChange }) {
  const [form, setForm] = useState({ email: "", website: "", location: "", hours: "", whatsapp: "", ...contact });
  const [saved, setSaved] = useState(false);
  const save = () => { onChange(form); setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>Support Page</h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 8 }}>The Support page has FAQs (fixed) and a contact tab. Manage the contact details shown there.</p>
      <div className="alert alert-info" style={{ marginBottom: 24, fontSize: 13 }}>
        The FAQ answers are fixed content. The contact details below appear on both the <strong>Contact page</strong> and the <strong>Support page contact tab</strong>.
      </div>
      {saved && <div className="alert alert-success" style={{ marginBottom: 20 }}>✓ Saved — contact info updated on both Contact and Support pages.</div>}

      <div className="card">
        <div className="form-row">
          <div className="form-group"><label>Email Address</label><input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="dcsworkshop@ug.edu.gh" /></div>
          <div className="form-group"><label>Website</label><input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="www.cs.ug.edu.gh" /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>WhatsApp Number</label><input value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} placeholder="233XXXXXXXXX" /></div>
          <div className="form-group"><label>Office Hours</label><input value={form.hours} onChange={e => setForm(f => ({ ...f, hours: e.target.value }))} placeholder="Mon–Fri · 8:00 AM – 5:00 PM GMT" /></div>
        </div>
        <div className="form-group">
          <label>Location</label>
          <textarea value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} style={{ minHeight: 70 }} />
        </div>
        <button className="btn-primary" onClick={save}>Save Support Contact →</button>
      </div>
    </div>
  );
}
