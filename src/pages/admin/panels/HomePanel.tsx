import { useState, useEffect } from "react";
import { Check, ArrowRight, X } from "lucide-react";
import { uid, ToggleRow } from "./shared";
import { useAdminContext } from "../../../context/AdminContext";

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

export default function HomePanel() {
  const { siteContent, updateContent } = useAdminContext();
  const event = siteContent.event as Record<string, any>;
  const home = (siteContent.home as Record<string, any>) || {};
  const onChange = (v: unknown) => updateContent("event", v);
  const onChangeHome = (v: unknown) => updateContent("home", v);
  const onSaveAll = (v: unknown) => updateContent(v as Record<string, unknown>);
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
    <div className="max-w-[760px]">
      <h2 className="mb-1.5 font-serif">
        Home Page
      </h2>
      <p className="text-[#666] text-sm mb-7">
        Edit all sections shown on the Home page — hero, dates, sessions, and
        testimonials.
      </p>
      {saved && (
        <div className="alert alert-success mb-5">
          <Check
            size={14}
            className="inline align-middle mr-1"
          />{" "}
          Saved — all Home page changes are live.
        </div>
      )}

      {/* ── Hero ── */}
      <div className="card mb-5">
        <h4 className="mb-4 font-serif">
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
            className="min-h-[80px]"
            placeholder="Brief description shown below the title in the hero…"
          />
        </div>
        <div className="form-group max-w-[200px]">
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
      <div className="card mb-5">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-serif">
            Important Dates
          </h4>
          <button
            onClick={addDate}
            className="bg-ug-blue text-white border-none rounded-lg px-3.5 py-1.5 text-[13px] cursor-pointer"
          >
            + Add Date
          </button>
        </div>
        <p className="text-[13px] text-[#888] mb-3.5">
          These date cards appear in the dark navy strip on the Home page.
        </p>
        {homeForm.importantDates.map((d, i) => (
          <div
            key={d.id || i}
            className={`border border-[#e0e0e0] rounded-[10px] px-4 py-3.5 mb-2.5${d.done ? " bg-[#f0fff5]" : " bg-[#fafafa]"}`}
          >
            <div className="grid grid-cols-[60px_1fr_1fr_60px_auto] gap-[10px] items-end">
              <div className="form-group mb-0">
                <label className="text-xs">Icon</label>
                <input
                  value={d.icon}
                  onChange={(e) => updateDate(i, "icon", e.target.value)}
                  className="px-2 py-1.5 border border-[#ddd] rounded-md text-lg text-center"
                />
              </div>
              <div className="form-group mb-0">
                <label className="text-xs">Label</label>
                <input
                  value={d.label}
                  onChange={(e) => updateDate(i, "label", e.target.value)}
                  className="w-full px-2 py-1.5 border border-[#ddd] rounded-md text-[13px]"
                />
              </div>
              <div className="form-group mb-0">
                <label className="text-xs">Date / Status</label>
                <input
                  value={d.date}
                  onChange={(e) => updateDate(i, "date", e.target.value)}
                  placeholder="e.g. 31 Jul 2026"
                  className="w-full px-2 py-1.5 border border-[#ddd] rounded-md text-[13px]"
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <label className="text-[11px] text-[#888]">Done</label>
                <button
                  onClick={() => updateDate(i, "done", !d.done)}
                  className={`w-9 h-[22px] rounded-[11px] border-none cursor-pointer relative transition-colors${d.done ? " bg-[#1B6B3A]" : " bg-[#ccc]"}`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white absolute top-[3px] transition-[left]${d.done ? " left-[17px]" : " left-[3px]"}`}
                  />
                </button>
              </div>
              <button
                onClick={() => removeDate(i)}
                className="bg-[#fdecea] text-[#c0392b] border-none rounded-md px-2.5 py-1.5 text-xs cursor-pointer mb-5"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Featured Sessions ── */}
      <div className="card mb-5">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-serif">
            Featured Sessions
          </h4>
          <button
            onClick={addSession}
            className="bg-ug-blue text-white border-none rounded-lg px-3.5 py-1.5 text-[13px] cursor-pointer"
          >
            + Add Session
          </button>
        </div>
        <p className="text-[13px] text-[#888] mb-3.5">
          Speaker / session cards in the "Programme Highlights" section on the
          Home page.
        </p>
        {homeForm.featuredSessions.map((s, i) => (
          <div
            key={s.id || i}
            className="border border-[#e0e0e0] rounded-[10px] p-4 mb-3"
          >
            <div className="flex justify-between mb-2.5">
              <span className="font-semibold text-sm">
                {s.session || `Session ${i + 1}`}
              </span>
              <button
                onClick={() => removeSession(i)}
                className="bg-[#fdecea] text-[#c0392b] border-none rounded-md px-2.5 py-[3px] text-xs cursor-pointer"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-[60px_1fr_1fr] gap-[10px] mb-2.5">
              <div className="form-group mb-0">
                <label className="text-xs">Icon</label>
                <input
                  value={s.icon}
                  onChange={(e) => updateSession(i, "icon", e.target.value)}
                  className="px-2 py-1.5 border border-[#ddd] rounded-md text-lg text-center w-full"
                />
              </div>
              <div className="form-group mb-0">
                <label className="text-xs">Tag (shown as badge)</label>
                <input
                  value={s.tag}
                  onChange={(e) => updateSession(i, "tag", e.target.value)}
                  className="w-full px-2 py-1.5 border border-[#ddd] rounded-md text-[13px]"
                  placeholder="e.g. Keynote"
                />
              </div>
              <div className="form-group mb-0">
                <label className="text-xs">Accent Colour</label>
                <input
                  value={s.accent}
                  onChange={(e) => updateSession(i, "accent", e.target.value)}
                  className="w-full px-2 py-1.5 border border-[#ddd] rounded-md text-[13px]"
                  placeholder="#1B3A6B"
                />
              </div>
            </div>
            <div className="form-row mb-2.5">
              <div className="form-group mb-0">
                <label className="text-xs">Session Title</label>
                <input
                  value={s.session}
                  onChange={(e) => updateSession(i, "session", e.target.value)}
                  className="w-full px-2 py-1.5 border border-[#ddd] rounded-md text-[13px]"
                />
              </div>
              <div className="form-group mb-0">
                <label className="text-xs">Speaker / Role</label>
                <input
                  value={s.role}
                  onChange={(e) => updateSession(i, "role", e.target.value)}
                  className="w-full px-2 py-1.5 border border-[#ddd] rounded-md text-[13px]"
                  placeholder="TBA — Keynote Speaker"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group mb-0">
                <label className="text-xs">Status / Affiliation</label>
                <input
                  value={s.status}
                  onChange={(e) => updateSession(i, "status", e.target.value)}
                  className="w-full px-2 py-1.5 border border-[#ddd] rounded-md text-[13px]"
                />
              </div>
              <div className="form-group mb-0">
                <label className="text-xs">Topic / Theme</label>
                <input
                  value={s.topic}
                  onChange={(e) => updateSession(i, "topic", e.target.value)}
                  className="w-full px-2 py-1.5 border border-[#ddd] rounded-md text-[13px]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Testimonials ── */}
      <div className="card mb-5">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-serif">
            Testimonials
          </h4>
          <button
            onClick={addTestimonial}
            className="bg-ug-blue text-white border-none rounded-lg px-3.5 py-1.5 text-[13px] cursor-pointer"
          >
            + Add
          </button>
        </div>
        <p className="text-[13px] text-[#888] mb-3.5">
          Participant quotes in the "What Participants Say" section. Photos use
          the global site images.
        </p>
        {homeForm.testimonials.map((t, i) => (
          <div
            key={t.id || i}
            className="border border-[#e0e0e0] rounded-[10px] px-4 py-3.5 mb-2.5"
          >
            <div className="flex justify-end mb-2">
              <button
                onClick={() => removeTestimonial(i)}
                className="bg-[#fdecea] text-[#c0392b] border-none rounded-md px-2.5 py-[3px] text-xs cursor-pointer"
              >
                Remove
              </button>
            </div>
            <div className="form-group mb-2.5">
              <label className="text-xs">Quote</label>
              <textarea
                value={t.quote}
                onChange={(e) => updateTestimonial(i, "quote", e.target.value)}
                className="w-full px-2 py-1.5 border border-[#ddd] rounded-md text-[13px] min-h-[70px] resize-y"
              />
            </div>
            <div className="form-row">
              <div className="form-group mb-0">
                <label className="text-xs">Name</label>
                <input
                  value={t.name}
                  onChange={(e) => updateTestimonial(i, "name", e.target.value)}
                  className="w-full px-2 py-1.5 border border-[#ddd] rounded-md text-[13px]"
                />
              </div>
              <div className="form-group mb-0">
                <label className="text-xs">Programme</label>
                <input
                  value={t.prog}
                  onChange={(e) => updateTestimonial(i, "prog", e.target.value)}
                  className="w-full px-2 py-1.5 border border-[#ddd] rounded-md text-[13px]"
                  placeholder="MSc Computer Science"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Stats Bar ── */}
      <div className="card mb-5">
        <h4 className="mb-2 font-serif">Stats Bar</h4>
        <p className="text-[13px] text-[#888] mb-4">
          Numbers shown in the strip below the hero. Registration Fee is set by the fee field above.
        </p>
        <div className="grid grid-cols-[1fr_1fr_1fr] gap-[16px]">
          <div className="form-group mb-0">
            <label>Workshop Days</label>
            <input
              type="number" min="1"
              value={homeForm.workshopDays}
              onChange={(e) => setHomeForm((f) => ({ ...f, workshopDays: Number(e.target.value) }))}
            />
          </div>
          <div className="form-group mb-0">
            <label>Presentation Tracks</label>
            <input
              type="number" min="1"
              value={homeForm.presentationTracks}
              onChange={(e) => setHomeForm((f) => ({ ...f, presentationTracks: Number(e.target.value) }))}
            />
          </div>
          <div className="form-group mb-0">
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
      <div className="card mb-5">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-serif">Research Tracks</h4>
          <button
            onClick={addTrack}
            className="bg-ug-blue text-white border-none rounded-lg px-3.5 py-1.5 text-[13px] cursor-pointer"
          >
            + Add Track
          </button>
        </div>
        <p className="text-[13px] text-[#888] mb-3.5">
          Presentation tracks in the "How to Participate" section. Leave empty to use the built-in defaults.
        </p>
        {homeForm.tracks.length === 0 && (
          <p className="text-[13px] text-[#aaa] italic mb-2">Using built-in defaults. Add a track to override all of them.</p>
        )}
        {homeForm.tracks.map((t, i) => (
          <div key={i} className="border border-[#e0e0e0] rounded-[10px] px-4 py-3.5 mb-2.5">
            <div className="flex justify-between mb-2.5">
              <span className="font-semibold text-sm">{t.title || `Track ${i + 1}`}</span>
              <button
                onClick={() => removeTrack(i)}
                className="bg-[#fdecea] text-[#c0392b] border-none rounded-md px-2.5 py-[3px] text-xs cursor-pointer"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-[1fr_90px] gap-[10px] mb-2.5">
              <div className="form-group mb-0">
                <label className="text-xs">Track Title</label>
                <input
                  value={t.title}
                  onChange={(e) => updateTrack(i, "title", e.target.value)}
                  className="w-full px-2 py-1.5 border border-[#ddd] rounded-md text-[13px]"
                />
              </div>
              <div className="form-group mb-0">
                <label className="text-xs">Colour</label>
                <input
                  value={t.color}
                  onChange={(e) => updateTrack(i, "color", e.target.value)}
                  placeholder="#1B3A6B"
                  className="w-full px-2 py-1.5 border border-[#ddd] rounded-md text-[13px]"
                />
              </div>
            </div>
            <div className="form-group mb-0">
              <label className="text-xs">Description</label>
              <input
                value={t.desc}
                onChange={(e) => updateTrack(i, "desc", e.target.value)}
                placeholder="Brief description of this track…"
                className="w-full px-2 py-1.5 border border-[#ddd] rounded-md text-[13px]"
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── Eligible Programmes ── */}
      <div className="card mb-5">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-serif">Eligible Programmes</h4>
          <button
            onClick={addProgramme}
            className="bg-ug-blue text-white border-none rounded-lg px-3.5 py-1.5 text-[13px] cursor-pointer"
          >
            + Add Programme
          </button>
        </div>
        <p className="text-[13px] text-[#888] mb-3.5">
          Eligibility table in the "Who Can Participate" section. Leave empty to use built-in defaults.
        </p>
        {homeForm.programmes.length === 0 && (
          <p className="text-[13px] text-[#aaa] italic mb-2">Using built-in defaults. Add a programme to override all of them.</p>
        )}
        {homeForm.programmes.map((p, i) => (
          <div key={i} className="grid grid-cols-[1fr_140px_auto_auto] gap-[10px] items-end mb-2.5">
            <div className="form-group mb-0">
              <label className="text-xs">Programme Name</label>
              <input
                value={p.name}
                onChange={(e) => updateProgramme(i, "name", e.target.value)}
                className="w-full px-2 py-1.5 border border-[#ddd] rounded-md text-[13px]"
              />
            </div>
            <div className="form-group mb-0">
              <label className="text-xs">Role</label>
              <input
                value={p.role}
                onChange={(e) => updateProgramme(i, "role", e.target.value)}
                placeholder="Presenter"
                className="w-full px-2 py-1.5 border border-[#ddd] rounded-md text-[13px]"
              />
            </div>
            <div className="flex flex-col items-center gap-1 pb-0.5">
              <label className="text-[11px] text-[#888]">Required</label>
              <button
                onClick={() => updateProgramme(i, "required", !p.required)}
                className={`w-9 h-[22px] rounded-[11px] border-none cursor-pointer relative transition-colors${p.required ? " bg-[#1B6B3A]" : " bg-[#ccc]"}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-[3px] transition-[left]${p.required ? " left-[17px]" : " left-[3px]"}`} />
              </button>
            </div>
            <button
              onClick={() => removeProgramme(i)}
              className="bg-[#fdecea] text-[#c0392b] border-none rounded-md px-2.5 py-1.5 text-xs cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-ug-surface rounded-xl px-[18px] py-3.5 mb-5 text-[13px] text-[#666]">
        <strong className="text-ug-blue">Announcements & Live Feed</strong>{" "}
        — manage via Admin Tools sidebar.
        <br />
        <strong className="text-ug-blue">Homepage photos</strong> — change
        via <strong>Site Images</strong> in Admin Tools.
      </div>

      <button className="btn-primary" onClick={saveAll}>
        <span className="inline-flex items-center gap-1.5">
          Save All Home Page Changes <ArrowRight size={14} />
        </span>
      </button>
    </div>
  );
}
