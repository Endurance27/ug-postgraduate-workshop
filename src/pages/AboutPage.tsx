import { useState, useEffect } from "react";
import { ArrowRight, Play, Video, Calendar, Globe, BookOpen, Trophy, FolderOpen, FileText, ClipboardList, Settings, Check, Sparkles, AlertCircle } from "lucide-react";
import { db, doc, getDoc } from "../firebase";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AboutData {
  badge?: string;
  title?: string;
  desc1?: string;
  desc2?: string;
  imageCaption1?: string;
  imageCaption2?: string;
  cardText?: string;
}

interface EventData {
  fee?: number;
}

interface AboutPageProps {
  navigate: (page: string) => void;
  images?: Record<string, string>;
  about?: AboutData;
  event?: EventData;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────
const DEFAULTS: Required<AboutData> = {
  badge:         "2nd Annual Edition",
  title:         "A Platform for Academic Excellence in Postgraduate Research",
  desc1:         "The 2nd Annual DCS Postgraduate Students Workshop builds on the success of the maiden edition held in 2025, bringing together MSc and MPhil students from Computer Science, Data Science, and IT for Business programmes.",
  desc2:         "The workshop provides a structured platform for students to present original research, receive expert feedback, and engage with peers and academic staff in a rigorous yet supportive environment.",
  imageCaption1: "Advancing Research at UG",
  imageCaption2: "Dept. of Computer Science · SPMS",
  cardText:      "Following the success of the 2025 inaugural edition, the 2026 workshop expands to include broader participation across all DCS postgraduate programmes, richer parallel tracks, and a formal awards ceremony.",
};

export default function AboutPage({ navigate, images = {}, about = {}, event = {} }: AboutPageProps) {
  // Seed state from prop (instantly available from siteContent), then upgrade from Firestore
  const [aboutData, setAboutData] = useState<AboutData>(about);
  const [loading,   setLoading]   = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    if (!db || !doc || !getDoc) { setLoading(false); return; }
    getDoc(doc(db, "about", "main"))
      .then((snap) => {
        if (snap.exists()) setAboutData(snap.data() as AboutData);
        setLoading(false);
      })
      .catch((e: Error) => {
        setFetchError(e.message);
        setLoading(false);
      });
  }, []);

  // Merge priority: Firestore fetch > siteContent prop > hardcoded defaults
  const a: Required<AboutData> = {
    badge:         aboutData.badge         || DEFAULTS.badge,
    title:         aboutData.title         || DEFAULTS.title,
    desc1:         aboutData.desc1         || DEFAULTS.desc1,
    desc2:         aboutData.desc2         || DEFAULTS.desc2,
    imageCaption1: aboutData.imageCaption1 || DEFAULTS.imageCaption1,
    imageCaption2: aboutData.imageCaption2 || DEFAULTS.imageCaption2,
    cardText:      aboutData.cardText      || DEFAULTS.cardText,
  };
  const fee = event.fee || 100;

  // ── Loading skeleton ──
  if (loading) return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-[3px] border-[#e0e0e0] border-t-ug-blue rounded-full mx-auto mb-4"
          style={{ animation: "spin 0.9s linear infinite" }} />
        <p className="text-[#888] text-[14px]">Loading about content…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );

  // ── Fetch error notice (non-blocking — still shows content from prop) ──
  const errorBanner = fetchError ? (
    <div className="bg-[#fff8e1] border border-[#f5c842] rounded-lg py-[10px] px-4 my-4 text-[13px] text-[#856404] flex items-center gap-2">
      <AlertCircle size={14} className="shrink-0" />
      Could not fetch the latest content from the server. Showing cached version.
    </div>
  ) : null;

  return (
    <main>
      {errorBanner && <div className="container">{errorBanner}</div>}

      {/* ── HERO ── */}
      <section className="relative overflow-hidden text-white py-[72px_0_56px]"
        style={{ background: "linear-gradient(135deg, #0F2347, #1B3A6B)" }}>
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.13]"
          style={{ backgroundImage: `url('${images.research || "/images/research-presentations.jpg"}')` }} />
        <div className="container relative z-[1] py-[72px] pb-[56px]">
          <span className="badge inline-block mb-[14px]"
            style={{ background: "rgba(201,168,76,0.25)", color: "#C9A84C" }}>
            {a.badge}
          </span>
          <h1 className="text-white font-serif mb-[10px]"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)" }}>
            About the Workshop
          </h1>
          <p className="text-white/65 text-[15px] max-w-[540px]">
            Department of Computer Science · SPMS · University of Ghana, Legon
          </p>
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className="section bg-white">
        <div className="container">
          <div className="mb-[14px]">
            <span className="badge badge-blue mb-[10px]">Overview</span>
          </div>
          <div className="about-grid grid grid-cols-2 gap-14 items-start">

            <div>
              <h2 className="about-heading leading-[1.3] mb-5" style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)" }}>
                {a.title}
              </h2>
              <p className="text-[#555] leading-[1.85] mb-4 text-[15px]">{a.desc1}</p>
              <p className="text-[#555] leading-[1.85] text-[15px] mb-5">{a.desc2}</p>
              <p className="text-[13px] text-[#888] italic mb-4">
                Workshop theme announcement coming soon
              </p>
              <button onClick={() => navigate("recordings")}
                className="bg-ug-gold text-ug-navy border-none rounded-lg py-[10px] px-[22px] text-[13px] font-bold cursor-pointer">
                <span className="inline-flex items-center gap-[6px]">Watch Highlights<ArrowRight size={14} /></span>
              </button>
            </div>

            <div className="flex flex-col gap-[18px]">
              <div className="rounded-2xl overflow-hidden relative">
                <img src={images.research || "/images/research-presentations.jpg"} alt="Workshop"
                  className="w-full object-cover block" style={{ height: 220 }} />
                <div className="absolute inset-0 flex flex-col justify-end p-[18px_20px]"
                  style={{ background: "linear-gradient(transparent 40%, rgba(15,35,71,0.88))" }}>
                  <p className="text-white font-bold text-[14px] m-0">{a.imageCaption1}</p>
                  <p className="text-white/65 text-[12px] mt-[3px] mb-0">{a.imageCaption2}</p>
                </div>
              </div>

              <div className="bg-ug-blue rounded-[14px] p-[18px_22px] flex items-center gap-[18px]">
                <div className="shrink-0">
                  <div className="text-[11px] text-white/55 mb-[2px]">Registration Fee</div>
                  <div className="text-[28px] font-extrabold text-ug-gold leading-none">GHC {fee}</div>
                  <div className="text-[11px] text-white/50 mt-[3px]">Snacks, water & materials</div>
                </div>
                <p className="text-[13px] text-white/75 leading-[1.75] m-0">
                  {a.cardText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VIDEO HIGHLIGHTS ── */}
      <section className="section bg-ug-surface">
        <div className="container">
          <div className="text-center mb-9">
            <span className="badge badge-gold mb-[10px]">Watch Highlights</span>
            <h2 className="about-heading mb-2" style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)" }}>
              Maiden Workshop 2025 — Video Highlights
            </h2>
            <p className="text-[#666] text-[14px] max-w-[520px] mx-auto">
              Experience the energy and academic rigor of our inaugural workshop. Watch highlights from the 2025 edition.
            </p>
          </div>

          <div className="video-grid grid grid-cols-3 gap-5">
            {[
              { day: "DAY 1", label: "Opening Ceremony & First Day Sessions",       color: "#1B3A6B", id: "BWErDrKoRS4", start: 0    },
              { day: "DAY 2", label: "Technical Presentations & Panel Discussions",  color: "#C9A84C", id: "1KWiyZnJFmw", start: 9624 },
              { day: "DAY 3", label: "Closing Ceremony & Awards Announcement",       color: "#7b1fa2", id: "NUAZDcQ_lJs", start: 6    },
            ].map((v, i) => (
              <div key={i} className="rounded-[14px] overflow-hidden border border-[#eee] bg-white"
                style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.09)" }}>
                <div className="py-[10px] px-4 flex justify-between items-center" style={{ background: v.color }}>
                  <span className="font-extrabold text-[13px] text-white tracking-[0.05em]">{v.day}</span>
                  <span className="text-[11px] text-white/65">August 2025</span>
                </div>
                {v.id ? (
                  <div className="relative pb-[56.25%] h-0 overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${v.id}?start=${v.start}`}
                      title={`Workshop 2025 ${v.day}`}
                      className="absolute top-0 left-0 w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="bg-[#111] flex items-center justify-center" style={{ aspectRatio: "16/9" }}>
                    <Video size={32} color="rgba(255,255,255,0.4)" />
                  </div>
                )}
                <div className="p-[12px_16px]">
                  <p className="text-[13px] text-[#444] leading-[1.55] m-0 mb-[10px] font-medium">{v.label}</p>
                  {v.id ? (
                    <a href={`https://www.youtube.com/watch?v=${v.id}&t=${v.start}s`} target="_blank" rel="noreferrer"
                      className="text-[12px] text-ug-blue font-bold no-underline">
                      <span className="inline-flex items-center gap-1"><Play size={12} /> Watch on YouTube <ArrowRight size={12} /></span>
                    </a>
                  ) : (
                    <span className="text-[12px] text-[#aaa]">Recording coming soon</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-[#e3f5eb] border border-[#a8d5b8] rounded-[10px] py-3 px-5 text-center text-[13px] text-[#1B6B3A] font-medium">
            <span className="inline-flex items-center gap-[6px]"><Sparkles size={14} /> Complete coverage from all 3 days of the maiden 2025 workshop is now available!</span>
          </div>
        </div>
      </section>

      {/* ── HIGHLIGHTS CARDS ── */}
      <section className="bg-white py-[52px] border-t border-[#eee]">
        <div className="container">
          <div className="highlights-grid grid grid-cols-4 gap-5">
            {[
              { icon: <Calendar size={28} color="#1B3A6B" />, title: "3-Day Event",          body: "27–29 August 2026 — three full days of research presentations, panel discussions, and academic networking." },
              { icon: <Globe size={28} color="#1B3A6B" />,    title: "Hybrid Format",         body: "Attend physically on the UG campus or join virtually. Parallel tracks run across CS, Data Science, and IT for Business." },
              { icon: <BookOpen size={28} color="#1B3A6B" />, title: "CBAS Publication",      body: "Accepted papers may be considered for publication in the College of Basic and Applied Sciences (CBAS) Journal." },
              { icon: <Trophy size={28} color="#1B3A6B" />,   title: "Awards & Recognition",  body: "1st, 2nd, and 3rd place awards per presentation track, evaluated by an academic faculty review panel." },
            ].map((h, i) => (
              <div key={i} className="bg-[#f7f9fc] rounded-[14px] p-[28px_22px] border border-[#e8eef6] border-t-[3px] border-t-ug-blue transition-[box-shadow,transform] duration-200"
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(27,58,107,0.1)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
              >
                <div className="mb-[14px]">{h.icon}</div>
                <div className="font-bold text-[14px] text-ug-blue mb-[10px]">{h.title}</div>
                <p className="text-[13px] text-[#666] leading-[1.75] m-0">{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EVENT DETAILS ── */}
      <section className="bg-ug-navy py-[52px]">
        <div className="container max-w-[960px]">
          <div className="text-center mb-9">
            <span className="badge border border-ug-gold/35 mb-[10px]"
              style={{ background: "rgba(201,168,76,0.2)", color: "#C9A84C" }}>
              Event Details
            </span>
          </div>
          <div className="rounded-[14px] overflow-hidden border border-white/10">
            {[
              [
                { label: "Event Name",       value: "2nd Annual DCS Postgraduate Students Workshop" },
                { label: "Organizing Body",  value: "Department of Computer Science, University of Ghana" },
                { label: "Faculty",          value: "School of Physical & Mathematical Sciences (SPMS)" },
              ],
              [
                { label: "Dates",            value: "27th – 29th August, 2026 (3 Days)" },
                { label: "Edition",          value: "2nd — Following the Maiden Workshop held in 2025" },
                { label: "Format",           value: "Hybrid — Physical Attendance + Virtual Participation" },
              ],
              [
                { label: "Registration Fee", value: `GHC ${fee}.00 (Snacks, water & workshop materials)` },
                { label: "Publication",      value: "Accepted papers may be considered for CBAS Journal" },
                { label: "Session Format",   value: "Parallel Track Sessions across multiple categories" },
              ],
            ].map((row, ri) => (
              <div key={ri} className="details-row grid grid-cols-3"
                style={{
                  borderBottom: ri < 2 ? "1px solid rgba(255,255,255,0.08)" : "none",
                  background: ri % 2 === 0 ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.06)",
                }}>
                {row.map((cell, ci) => (
                  <div key={ci} className="p-[20px_24px]"
                    style={{ borderRight: ci < 2 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                    <div className="text-[10px] font-bold text-ug-gold uppercase tracking-[0.1em] mb-[6px]">{cell.label}</div>
                    <div className="text-[14px] text-white font-medium leading-[1.5]">{cell.value}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CALL FOR PAPERS ── */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-3">
            <span className="badge badge-blue mb-[10px]">Submissions</span>
            <h2 className="mb-[10px] text-ug-blue" style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)" }}>
              Call for Papers
            </h2>
            <p className="text-[#666] text-[14px] max-w-[580px] mx-auto mb-9 leading-[1.8]">
              We invite postgraduate students to submit original research for presentation at the workshop. All submissions undergo peer review by the academic faculty panel.
            </p>
          </div>

          {/* Paper type cards */}
          <div className="cfp-grid grid grid-cols-4 gap-4 mb-9">
            {[
              { icon: <FolderOpen size={24} color="#56d364" />,    type: "Poster Presentation", pages: "1–2 pages", desc: "Visual display with Q&A interaction. Ideal for early-stage research.",             color: "#56d364", bg: "#eafbee" },
              { icon: <FileText size={24} color="#1B3A6B" />,      type: "Regular Paper",        pages: "3–5 pages", desc: "Full-length research with methodology, results and discussion.",                    color: "#1B3A6B", bg: "#e8eef6" },
              { icon: <ClipboardList size={24} color="#79c0ff" />, type: "Short Paper",          pages: "4–6 pages", desc: "Focused presentation of work-in-progress or preliminary findings.",                color: "#79c0ff", bg: "#e8f4ff" },
              { icon: <Settings size={24} color="#f78166" />,      type: "Technical Paper",      pages: "6–8 pages", desc: "System demonstration or technical implementation report.",                          color: "#f78166", bg: "#fff0ed" },
            ].map((c, i) => (
              <div key={i} className="rounded-[14px] p-[22px_18px] border transition-shadow duration-200"
                style={{
                  background: c.bg,
                  borderTop: `3px solid ${c.color}`,
                  border: `1px solid ${c.color}30`,
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = `0 6px 20px ${c.color}25`}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
              >
                <div className="mb-[10px]">{c.icon}</div>
                <div className="font-bold text-[13px] mb-2" style={{ color: c.color }}>{c.type}</div>
                <div className="inline-block text-base font-extrabold text-[#1a1a1a] font-mono bg-black/[0.06] rounded-md py-[3px] px-[10px] mb-[10px]">{c.pages}</div>
                <p className="text-[12px] text-[#555] leading-[1.7] m-0">{c.desc}</p>
              </div>
            ))}
          </div>

          {/* Guidelines + Deadlines */}
          <div className="cfp-cols grid grid-cols-2 gap-5">
            <div className="bg-ug-navy rounded-[14px] p-[24px_26px]">
              <h4 className="text-ug-gold mb-4 font-serif text-base">
                Submission Guidelines
              </h4>
              {[
                "Submissions must be original, unpublished work",
                "Written in English using the provided template",
                "Abstract of 150–250 words required",
                "All authors must be registered participants",
                "Submitted via the online registration portal",
                "Accepted papers receive certificates of presentation",
              ].map((g, i) => (
                <div key={i} className="flex gap-[10px] mb-[11px] items-start">
                  <Check size={14} color="#C9A84C" className="shrink-0 mt-[2px]" />
                  <span className="text-[13px] text-white leading-[1.6]">{g}</span>
                </div>
              ))}
            </div>

            <div className="bg-[#fdf3e0] rounded-[14px] p-[24px_26px] border border-[#e8c97a]">
              <h4 className="text-[#8a5c00] mb-4 font-serif text-base">
                Submission Deadlines
              </h4>
              {[
                { milestone: "Abstract Submission Opens", date: "June 2026",        done: true  },
                { milestone: "Abstract Deadline",          date: "01 August 2026",  done: false },
                { milestone: "Full Paper Deadline",        date: "01 August 2026",  done: false },
                { milestone: "Acceptance Notification",    date: "15 August 2026",  done: false },
                { milestone: "Camera-Ready Submission",    date: "22 August 2026",  done: false },
                { milestone: "Workshop Dates",             date: "27–29 Aug 2026",  done: false },
              ].map((d, i) => (
                <div key={i} className="flex justify-between items-center py-[9px]"
                  style={{ borderBottom: i < 5 ? "1px solid rgba(0,0,0,0.07)" : "none" }}>
                  <span className="text-[13px] text-[#5a3e00] leading-[1.5]">{d.milestone}</span>
                  <span className="text-[12px] font-bold font-mono shrink-0 ml-3 py-[2px] px-2 rounded-md"
                    style={{
                      color: d.done ? "#1B6B3A" : "#8a5c00",
                      background: d.done ? "#d4f0de" : "#f5dfa0",
                    }}>{d.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── READY TO SUBMIT CTA ── */}
      <div className="bg-ug-navy py-5 border-t-[3px] border-ug-gold">
        <div className="container flex items-center justify-between gap-5 flex-wrap">
          <div className="flex items-center gap-4">
            <FileText size={28} color="#C9A84C" />
            <div>
              <div className="font-bold text-white text-[15px]">Ready to submit?</div>
              <div className="text-[13px] text-white/88">Register first, then upload your abstract or paper via the registration portal.</div>
            </div>
          </div>
          <button className="btn-gold" onClick={() => navigate("register")}
            style={{ fontSize: 14, padding: "12px 32px", whiteSpace: "nowrap" }}>
            <span className="inline-flex items-center gap-[6px]">Register &amp; Submit<ArrowRight size={14} /></span>
          </button>
        </div>
      </div>

      {/* ── PARTICIPANT ELIGIBILITY ── */}
      <section className="section bg-white">
        <div className="container max-w-[900px]">
          <div className="text-center mb-8">
            <span className="badge badge-blue mb-[10px]">Participant Eligibility</span>
          </div>
          <div className="rounded-[14px] overflow-hidden border border-[#e0e0e0]">
            <div className="amber-grid grid bg-ug-navy" style={{ gridTemplateColumns: "1.4fr 1fr 1.6fr" }}>
              {["Programme", "Role", "Presentation Types"].map(h => (
                <div key={h} className="py-[13px] px-5 text-ug-gold text-[12px] font-bold uppercase tracking-[0.07em]">{h}</div>
              ))}
            </div>
            {[
              { prog: "MSc Computer Science",    role: "Presenter (Required)",  types: "Poster, Regular, Short, Technical" },
              { prog: "MPhil Computer Science",  role: "Presenter (Required)",  types: "Poster, Regular, Short, Technical" },
              { prog: "MSc Data Science",        role: "Presenter (Required)",  types: "Poster, Regular, Short, Technical" },
              { prog: "MPhil Data Science",      role: "Presenter (Required)",  types: "Poster, Regular, Short, Technical" },
              { prog: "MSc IT for Business",     role: "Observer or Presenter", types: "Any category if presenting"        },
              { prog: "PhD Computer Science",    role: "Presenter (Optional)",  types: "Poster, Regular, Short, Technical" },
              { prog: "Other PG Students (UG)",  role: "Observer or Presenter", types: "Open registration"                 },
            ].map((r, i) => (
              <div key={i} className="amber-grid grid border-t border-[#f0f0f0]"
                style={{
                  gridTemplateColumns: "1.4fr 1fr 1.6fr",
                  background: i % 2 === 0 ? "#fff" : "#fafafa",
                }}>
                <div className="py-[13px] px-5 text-[13px] font-semibold text-[#1a1a1a]">{r.prog}</div>
                <div className="py-[13px] px-5 text-[13px] font-medium"
                  style={{ color: r.role.includes("Required") ? "#1B6B3A" : "#b5700a" }}>{r.role}</div>
                <div className="py-[13px] px-5 text-[13px] text-[#555]">{r.types}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 960px) {
          .about-grid    { grid-template-columns: 1fr !important; }
          .highlights-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .details-row   { grid-template-columns: 1fr !important; }
          .video-grid    { grid-template-columns: 1fr !important; }
          .cfp-grid      { grid-template-columns: repeat(2, 1fr) !important; }
          .cfp-cols      { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) {
          .cfp-grid      { grid-template-columns: 1fr !important; }
          .highlights-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
