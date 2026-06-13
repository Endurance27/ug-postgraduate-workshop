// Fix: was prop-only (App.tsx one-time fetch); now subscribes to
// workshop/siteContent via onSnapshot for real-time admin updates.
import React, { useState, useEffect, useRef, RefObject } from "react";
import {
  Calendar,
  CreditCard,
  Mic,
  Trophy,
  Medal,
  Radio,
  CheckCircle,
  MailOpen,
  GraduationCap,
  BookOpen,
  Lightbulb,
  Landmark,
  Eye,
  ArrowRight,
} from "lucide-react";
import Countdown from "../components/Countdown";
import { useSiteContent } from "../hooks/useSiteContent";

// ─── Types ────────────────────────────────────────────────────────────────────
interface EventData {
  fee?: number;
  edition?: string;
  dates?: string;
  title?: string;
  registrationOpen?: boolean;
}

interface Announcement {
  id: number | string;
  active: boolean;
  type: string;
  text: string;
}

interface FeedItem {
  id: number | string;
  active: boolean;
  text: string;
  time?: string;
}

interface ImportantDate {
  id?: number;
  label: string;
  date: string;
  icon?: React.ReactNode;
  done: boolean;
}

interface FeaturedSession {
  id?: number;
  icon?: React.ReactNode;
  tag: string;
  session: string;
  role: string;
  status?: string;
  topic: string;
  accent: string;
}

interface Testimonial {
  id?: number;
  quote: string;
  name: string;
  prog: string;
  photo?: string;
}

interface TrackItem {
  title: string;
  desc: string;
  color: string;
}

interface ProgrammeItem {
  name: string;
  role: string;
  required: boolean;
}

interface HomeData {
  heroSubtitle?: string;
  heroDesc?: string;
  importantDates?: ImportantDate[];
  featuredSessions?: FeaturedSession[];
  testimonials?: Testimonial[];
  workshopDays?: number;
  presentationTracks?: number;
  awardPositions?: number;
  tracks?: TrackItem[];
  programmes?: ProgrammeItem[];
  [key: string]: unknown;
}

interface HomePageProps {
  navigate: (page: string) => void;
  event?: EventData;
  announcements?: Announcement[];
  feed?: FeedItem[];
  images?: Record<string, string>;
  home?: HomeData;
}

function useReveal(threshold = 0.15): [RefObject<HTMLElement>, boolean] {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState<boolean>(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

const makeStats = (
  event?: EventData,
  home?: Record<string, unknown>,
): { n: string; label: string; icon: React.ReactNode }[] => [
  {
    n: String(home?.workshopDays ?? 3),
    label: "Workshop Days",
    icon: <Calendar size={24} color="#1B3A6B" />,
  },
  {
    n: `GHS ${event?.fee ?? 100}`,
    label: "Registration Fee",
    icon: <CreditCard size={24} color="#1B3A6B" />,
  },
  {
    n: String(home?.presentationTracks ?? 4),
    label: "Presentation Tracks",
    icon: <Mic size={24} color="#1B3A6B" />,
  },
  {
    n: String(home?.awardPositions ?? 3),
    label: "Award Positions",
    icon: <Trophy size={24} color="#1B3A6B" />,
  },
];

const DEFAULT_TRACKS = [
  {
    title: "Regular Paper",
    desc: "Full research papers presenting completed or ongoing thesis work.",
    color: "#1B3A6B",
  },
  {
    title: "Short Paper",
    desc: "Focused work-in-progress presentations with Q&A discussion.",
    color: "#0F2347",
  },
  {
    title: "Poster Presentation",
    desc: "Visual poster displays of thesis topics and research findings.",
    color: "#C9A84C",
  },
  {
    title: "Technical Paper",
    desc: "Applied and technical implementations tied to your research.",
    color: "#1B3A6B",
  },
];

const DEFAULT_PROGRAMMES = [
  { name: "MSc Computer Science", role: "Presenter", required: true },
  { name: "MPhil Computer Science", role: "Presenter", required: true },
  { name: "MSc Data Science", role: "Presenter", required: true },
  { name: "MPhil Data Science", role: "Presenter", required: true },
  {
    name: "MSc IT for Business",
    role: "Observer / Presenter",
    required: false,
  },
  { name: "PhD Computer Science", role: "Presenter", required: false },
  { name: "Other PG Students (UG)", role: "Open", required: false },
];

const organizers = [
  {
    title: "Department of Computer Science",
    sub: "University of Ghana",
    role: "Lead Organizer",
  },
  {
    title: "Postgraduate Committee",
    sub: "Department of Computer Science",
    role: "Academic Oversight",
  },
  {
    title: "Workshop Planning Committee",
    sub: "Dept. of Computer Science, UG",
    role: "Event Coordination",
  },
];

const DEFAULT_SPONSORS = [
  {
    name: "University of Ghana",
    tier: "Principal Funder",
    icon: <Landmark size={32} color="#1B3A6B" />,
  },
  {
    name: "DCS Alumni Support",
    tier: "Alumni Support",
    icon: <GraduationCap size={32} color="#1B3A6B" />,
  },
  {
    name: "Industry Partners",
    tier: "Corporate Sponsors",
    icon: <Trophy size={32} color="#1B3A6B" />,
  },
];

function splitHeroTitle(title: string | undefined): {
  lead: string;
  highlight: string;
} {
  const fallback = "2026 DCS Postgradute Research Conference & Workshop";
  const text = (title || "").trim() || fallback;
  const match = text.match(/\bResearch Workshop\b.*$/i);
  if (!match || match.index === 0) return { lead: text, highlight: "" };
  return {
    lead: text.slice(0, match.index).trim(),
    highlight: match[0].trim(),
  };
}

export default function HomePage({
  navigate,
  event: eventProp,
  announcements: announcementsProp,
  feed: feedProp = [],
  images: imagesProp = {},
  home: homeProp = {},
}: HomePageProps) {
  // Real-time subscription to workshop/siteContent
  const { data: sc } = useSiteContent();

  // Merge Firestore data over props (Firestore wins once loaded)
  const event = {
    ...(eventProp || {}),
    ...((sc.event as EventData) || {}),
  } as EventData;
  const home = {
    ...(homeProp || {}),
    ...((sc.home as HomeData) || {}),
  } as HomeData;
  const announcements =
    (sc.announcements as Announcement[]) ?? (announcementsProp || []);
  const feed = (sc.feed as FeedItem[]) ?? feedProp;
  const images = { ...imagesProp, ...(sc.images || {}) };

  const img = {
    workshop: images.workshop || "/images/workshop-sessions.jpg",
    research: images.research || "/images/research-presentations.jpg",
    networking: images.networking || "/images/collaboration-networking.jpeg",
    students: images.students || "/images/dcs-research.jpg",
  };
  const PHOTOS = [
    { src: img.workshop, label: "Workshop Sessions" },
    { src: img.research, label: "Research Presentations" },
    { src: img.networking, label: "Collaboration & Networking" },
  ];

  const activeTracks =
    Array.isArray(home?.tracks) && (home.tracks as unknown[]).length > 0 ?
      (home.tracks as typeof DEFAULT_TRACKS)
    : DEFAULT_TRACKS;
  const activeProgrammes =
    (
      Array.isArray(home?.programmes) &&
      (home.programmes as unknown[]).length > 0
    ) ?
      (home.programmes as typeof DEFAULT_PROGRAMMES)
    : DEFAULT_PROGRAMMES;

  // Sponsors: use Firestore sponsors array if available, else icon-based defaults
  const rawSponsors = sc.sponsors as {
    name?: string;
    tier?: string;
    logo?: string;
  }[];
  const activeSponsors =
    rawSponsors && rawSponsors.length > 0 ?
      rawSponsors.map((s) => ({
        name: s.name || "",
        tier: s.tier || "Partner",
        icon: <Landmark size={32} color="#1B3A6B" />,
      }))
    : DEFAULT_SPONSORS;

  const stats = makeStats(event, home as Record<string, unknown>);
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

  const activeAnnouncements = (announcements || []).filter((a) => a.active);
  const activeFeed = (feed || []).filter((f) => f.active);
  const annBg: Record<string, string> = {
    info: "#E5EAF3",
    warning: "#fdf3e0",
    success: "#e3f5eb",
  };
  const annColor: Record<string, string> = {
    info: "#1B3A6B",
    warning: "#b5700a",
    success: "#1B6B3A",
  };
  const heroTitle = splitHeroTitle(event?.title);
  const heroSubtitle =
    home.heroSubtitle ||
    "Department of Computer Science · SPMS · University of Ghana";
  const heroDesc =
    home.heroDesc ||
    "MSc, MPhil & PhD students present cutting-edge thesis research. Outstanding papers are considered for the CBAS Journal.";

  return (
    <main>
      {/* ── ANNOUNCEMENTS BANNER ─────────────────────────────────────── */}
      {activeAnnouncements.length > 0 && (
        <div>
          {activeAnnouncements.map((a) => (
            <div
              key={a.id}
              style={{
                background: annBg[a.type] || annBg.info,
                color: annColor[a.type] || annColor.info,
                borderBottom: `1px solid ${annColor[a.type] || annColor.info}30`,
              }}
              className="py-3"
            >
              <div className="container flex items-center gap-[10px] text-sm">
                <span className="font-bold uppercase text-[11px] tracking-[0.06em]">
                  {a.type}
                </span>
                <span className="flex-1">{a.text}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── LIVE FEED TICKER ─────────────────────────────────────────── */}
      {activeFeed.length > 0 && (
        <div className="bg-ug-navy text-white py-[10px] border-b-2 border-ug-gold overflow-hidden">
          <div className="container flex items-center gap-4">
            <span className="bg-ug-gold text-ug-navy text-[10px] font-extrabold py-[3px] px-[10px] rounded shrink-0 tracking-[0.1em] whitespace-nowrap">
              <span className="inline-flex items-center gap-1">
                <Radio size={12} /> LIVE
              </span>
            </span>
            <div className="overflow-hidden flex-1">
              <div
                className="flex gap-12 whitespace-nowrap"
                style={{
                  animation:
                    activeFeed.length > 1 ?
                      "tickerScroll 18s linear infinite"
                    : "none",
                }}
              >
                {activeFeed.map((f) => (
                  <span
                    key={f.id}
                    className="text-[13px] text-white/90 shrink-0"
                  >
                    {f.text}
                    {f.time && (
                      <span className="text-[11px] text-white/60 ml-[10px]">
                        {f.time}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="hero-section relative overflow-hidden min-h-[92vh] flex items-center bg-ug-navy">
        {/* background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.18]"
          style={{ backgroundImage: `url('${img.workshop}')` }}
        />
        {/* gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(120deg, #0F2347 55%, rgba(27,58,107,0.85) 100%)",
          }}
        />

        {/* floating gold orbs */}
        <div className="hero-orb orb-1" />
        <div className="hero-orb orb-2" />

        <div className="container hero-container relative z-[2] grid grid-cols-2 gap-12 items-center py-[100px] px-6 pb-[80px]">
          {/* LEFT: text */}
          <div>
            <div
              className={`flex gap-2 flex-wrap mb-6 ${heroReady ? "animate-fade-up delay-1" : "pre-anim"}`}
            >
              <span
                className="badge"
                style={{
                  background: "rgba(201,168,76,0.25)",
                  color: "#C9A84C",
                }}
              >
                {event?.edition || "2nd Annual Edition"}
              </span>
              <span
                className="badge"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                Hybrid Event
              </span>
              <span
                className="badge"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                {event?.dates || "27–29 August 2026"}
              </span>
            </div>

            <h1
              className={`font-serif font-bold text-white leading-[1.12] max-w-[600px] mb-5 ${heroReady ? "animate-fade-up delay-2" : "pre-anim"}`}
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)" }}
            >
              {heroTitle.highlight ?
                <>
                  {heroTitle.lead}
                  <br />
                  <span className="text-ug-gold">{heroTitle.highlight}</span>
                </>
              : heroTitle.lead}
            </h1>

            <p
              className={`text-white/80 max-w-[520px] leading-[1.75] mb-[10px] ${heroReady ? "animate-fade-up delay-3" : "pre-anim"}`}
              style={{ fontSize: 17 }}
            >
              {heroSubtitle}
            </p>
            <p
              className={`text-white/60 max-w-[520px] leading-[1.75] mb-9 ${heroReady ? "animate-fade-up delay-3" : "pre-anim"}`}
              style={{ fontSize: 15 }}
            >
              {heroDesc}
            </p>

            <div
              className={`flex gap-3 flex-wrap mb-[52px] ${heroReady ? "animate-fade-up delay-4" : "pre-anim"}`}
            >
              {event?.registrationOpen !== false ?
                <button
                  className="btn-gold animate-pulse-gold"
                  onClick={() => navigate("register")}
                  style={{ fontSize: 16, padding: "14px 32px" }}
                >
                  <span className="inline-flex items-center gap-[6px]">
                    Register Now — GHS {event?.fee || 100}
                    <ArrowRight size={14} />
                  </span>
                </button>
              : <div
                  className="bg-white/10 border border-white/25 rounded-[10px] px-6 py-3 text-white/70"
                  style={{ fontSize: 15 }}
                >
                  Registration is currently closed
                </div>
              }
              <button
                className="btn-outline"
                onClick={() => navigate("schedule")}
                style={{
                  color: "#fff",
                  borderColor: "rgba(255,255,255,0.4)",
                  background: "rgba(255,255,255,0.06)",
                }}
              >
                View Schedule
              </button>
            </div>

            <div className={heroReady ? "animate-fade-up delay-5" : "pre-anim"}>
              <p className="text-[11px] text-white/40 mb-[14px] uppercase tracking-[0.12em]">
                Countdown to Workshop
              </p>
              <Countdown />
            </div>
          </div>

          {/* RIGHT: floating image card — hidden on mobile */}
          <div
            className={`hide-mobile relative flex justify-center ${heroReady ? "animate-fade-right delay-3" : "pre-anim"}`}
          >
            {/* main photo */}
            <div className="hero-img-card relative z-[2]">
              <img
                src={img.students}
                alt="Students presenting research"
                className="w-full object-cover block"
                style={{ height: 340 }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 p-5 pt-7"
                style={{
                  background:
                    "linear-gradient(transparent, rgba(15,35,71,0.9))",
                }}
              >
                <p className="text-white text-sm font-semibold m-0">
                  Present · Collaborate · Publish
                </p>
                <p className="text-white/65 text-xs mt-[3px]">
                  University of Ghana, Legon
                </p>
              </div>
            </div>

            {/* floating stat badge */}
            <div
              className="animate-float absolute bottom-[-20px] left-[-20px] z-[3] bg-ug-gold rounded-[14px] py-[14px] px-5"
              style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }}
            >
              <div className="text-[22px] font-bold text-white leading-none">
                GHS {event?.fee || 100}
              </div>
              <div className="text-[11px] text-white/85 mt-[2px]">
                Registration Fee
              </div>
            </div>

            {/* floating date badge */}
            <div
              className="animate-float-slow absolute top-[-16px] right-[-16px] z-[3] bg-white rounded-[14px] py-3 px-[18px]"
              style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.18)" }}
            >
              <div className="text-[13px] font-bold text-ug-blue">
                {event?.dates || "27–29 Aug 2026"}
              </div>
              <div className="text-[11px] text-gray-400 mt-[2px]">
                3-Day Hybrid Event
              </div>
            </div>
          </div>
        </div>

        {/* bottom wave */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[60px] bg-white"
          style={{ clipPath: "ellipse(55% 100% at 50% 100%)" }}
        />
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────── */}
      <section ref={statsRef} className="bg-white border-b border-[#eee]">
        <div className="container">
          <div className="stats-grid grid grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={i}
                className={`py-8 px-5 text-center ${i < 3 ? "border-r border-[#eee]" : ""} ${statsVisible ? `animate-fade-up delay-${i + 1}` : "pre-anim"}`}
              >
                <div className="flex justify-center">{s.icon}</div>
                <div className="font-serif text-[26px] font-bold text-ug-blue mt-[6px]">
                  {s.n}
                </div>
                <div className="text-[13px] text-[#666] mt-[3px]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHOTO STRIP ──────────────────────────────────────────────── */}
      <section ref={photoRef} className="overflow-hidden">
        <div className="photo-strip grid grid-cols-3 h-[260px]">
          {PHOTOS.map((p, i) => (
            <div
              key={i}
              className={`relative overflow-hidden ${photoVisible ? `animate-fade-up delay-${i + 1}` : "pre-anim"}`}
            >
              <img
                src={p.src}
                alt={p.label}
                className="w-full h-full object-cover block transition-transform duration-500 ease-in-out"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.06)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(transparent 45%, rgba(15,35,71,0.75))",
                }}
              />
              <p className="absolute bottom-4 left-5 text-white text-sm font-semibold m-0">
                {p.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── IMPORTANT DATES ──────────────────────────────────────────── */}
      <section className="bg-ug-navy py-[52px] border-t-4 border-ug-gold">
        <div className="container">
          <div className="text-center mb-9">
            <span className="inline-block text-[11px] font-extrabold bg-ug-gold/20 text-ug-gold py-1 px-[14px] rounded-[20px] tracking-[0.12em] uppercase border border-ug-gold/40 mb-3">
              Key Dates
            </span>
            <h2
              className="text-white font-serif m-0"
              style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)" }}
            >
              Important Deadlines
            </h2>
          </div>
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            }}
          >
            {(
              home.importantDates || [
                {
                  id: 1,
                  label: "Registration Opens",
                  date: "Now Open",
                  icon: <CheckCircle size={28} color="#4ade80" />,
                  done: true,
                },
                {
                  id: 2,
                  label: "Abstract Submission Deadline",
                  date: "31 Jul 2026",
                  icon: <Calendar size={28} color="#C9A84C" />,
                  done: false,
                },
                {
                  id: 3,
                  label: "Acceptance Notification",
                  date: "8 Aug 2026",
                  icon: <MailOpen size={28} color="#C9A84C" />,
                  done: false,
                },
                {
                  id: 4,
                  label: "Workshop Begins",
                  date: "27 Aug 2026",
                  icon: <GraduationCap size={28} color="#C9A84C" />,
                  done: false,
                },
              ]
            ).map((d, i) => (
              <div
                key={i}
                className="flex flex-col items-start gap-[10px] rounded-[14px] p-[24px_22px]"
                style={{
                  background:
                    d.done ? "rgba(74,222,128,0.08)" : "rgba(255,255,255,0.07)",
                  border: `1px solid ${d.done ? "rgba(74,222,128,0.3)" : "rgba(201,168,76,0.25)"}`,
                  borderTop: `3px solid ${d.done ? "#4ade80" : "#C9A84C"}`,
                }}
              >
                <span className="flex">
                  {typeof d.icon === "string" ? d.icon : d.icon}
                </span>
                <div>
                  <div className="text-[12px] text-white/75 tracking-[0.04em] mb-[6px] leading-[1.4]">
                    {d.label}
                  </div>
                  <div
                    className="text-[18px] font-extrabold font-sans tracking-[-0.01em]"
                    style={{ color: d.done ? "#4ade80" : "#C9A84C" }}
                  >
                    {d.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────────────── */}
      <section ref={aboutRef} className="section bg-ug-surface">
        <div className="container">
          <div className="home-about-grid grid grid-cols-2 gap-16 items-center">
            <div className={aboutVisible ? "animate-fade-left" : "pre-anim"}>
              <span className="badge badge-blue mb-4">About the Workshop</span>
              <h2
                className="about-heading mb-5 leading-[1.25]"
                style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}
              >
                The Premier Research Platform for DCS Postgraduate Students
              </h2>
              <p className="text-[#555] leading-[1.85] mb-4">
                A flagship academic event by the Department of Computer Science,
                University of Ghana — now in its <strong>second edition</strong>
                . It brings postgraduate researchers together to share, debate,
                and celebrate academic work.
              </p>
              <p className="text-[#555] leading-[1.85] mb-7">
                Students present thesis work as posters, papers, or technical
                demos. A panel of judges awards prizes for the best
                presentations across all categories.
              </p>
              <div className="about-tracks-grid grid grid-cols-2 gap-3">
                {activeTracks.map((t, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-[16px_18px] border border-[#eee] transition-shadow duration-200"
                    style={{ borderTop: `3px solid ${t.color}` }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 4px 18px rgba(27,58,107,0.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.boxShadow = "none")
                    }
                  >
                    <div
                      className="text-[13px] font-semibold mb-[6px]"
                      style={{ color: t.color }}
                    >
                      {t.title}
                    </div>
                    <p className="text-[12px] text-[#666] leading-[1.6] m-0">
                      {t.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* image panel */}
            <div
              className={`relative ${aboutVisible ? "animate-fade-right" : "pre-anim"}`}
            >
              <div
                className="rounded-[20px] overflow-hidden"
                style={{ boxShadow: "0 20px 60px rgba(15,35,71,0.18)" }}
              >
                <img
                  src={img.research}
                  alt="Academic lecture hall"
                  className="w-full object-cover block"
                  style={{ height: 420 }}
                />
              </div>
              {/* overlay info card */}
              <div
                className="absolute bottom-[-24px] left-[-24px] rounded-[14px] p-[20px_24px] min-w-[230px]"
                style={{
                  background: "linear-gradient(135deg, #1B3A6B, #0F2347)",
                  borderTop: "3px solid #C9A84C",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={18} color="#C9A84C" />
                  <span className="text-[11px] font-bold text-ug-gold uppercase tracking-[0.08em]">
                    Publication Opportunity
                  </span>
                </div>
                <div className="text-[17px] font-bold text-white mb-[6px]">
                  CBAS Journal
                </div>
                <div className="text-[12px] text-white/90 leading-[1.5]">
                  Top papers considered for publication
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHO CAN REGISTER ─────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-12">
            <span className="badge badge-navy mb-3">Eligibility</span>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
              Who Can Register?
            </h2>
            <p className="text-[#555] max-w-[520px] mx-auto mt-3 text-[15px]">
              All postgraduate students at the University of Ghana may register
              and attend.
            </p>
          </div>
          <div
            className="grid gap-[14px] max-w-[900px] mx-auto"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            }}
          >
            {activeProgrammes.map((p, i) => (
              <div
                key={i}
                className="bg-white border border-[#e8e8e8] rounded-xl p-[16px_20px] flex items-center gap-[14px] transition-[box-shadow,transform] duration-200"
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 4px 18px rgba(27,58,107,0.12)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "none";
                }}
              >
                <div
                  className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-base ${p.required ? "bg-ug-blue-light" : "bg-[#f5f5f5]"}`}
                >
                  {p.required ?
                    <GraduationCap size={18} color="#1B3A6B" />
                  : <Eye size={18} color="#888" />}
                </div>
                <div>
                  <div className="text-[14px] font-semibold">{p.name}</div>
                  <div className="text-[12px] text-[#666] mt-[2px]">
                    {p.role} ·{" "}
                    {p.required ?
                      <span className="text-ug-blue font-medium">
                        Presenter expected
                      </span>
                    : <span className="text-[#888]">Optional</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-9">
            <p className="text-[14px] text-[#666] mb-4">
              Registration fee: <strong>GHS {event?.fee || 100}</strong> —
              includes snacks, water, and workshop materials
            </p>
            <button
              className="btn-primary"
              onClick={() => navigate("register")}
            >
              <span className="inline-flex items-center gap-[6px]">
                Register Now
                <ArrowRight size={14} />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ── AWARDS ───────────────────────────────────────────────────── */}
      <section
        ref={awardsRef}
        className="relative overflow-hidden bg-ug-navy text-white"
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.12]"
          style={{ backgroundImage: `url('${img.students}')` }}
        />
        {/* gradient overlay for depth */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(15,35,71,0.85) 0%, rgba(27,58,107,0.7) 100%)",
          }}
        />
        <div className="section container relative text-center">
          <span
            className="badge border border-ug-gold/40 mb-4"
            style={{ background: "rgba(201,168,76,0.3)", color: "#C9A84C" }}
          >
            Recognition
          </span>
          <h2
            className="text-white mb-3"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
          >
            Awards &amp; Recognition
          </h2>
          <p className="text-white/80 max-w-[500px] mx-auto mb-12 text-[15px]">
            A panel of academic judges evaluates all presentations and rewards
            the top performers.
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            {[
              {
                pos: <Trophy size={48} color="#C9A84C" />,
                label: "First Place",
                desc: "Best overall presentation",
                border: "#C9A84C",
              },
              {
                pos: <Medal size={48} color="#b0b8c8" />,
                label: "Second Place",
                desc: "Runner-up recognition",
                border: "#b0b8c8",
              },
              {
                pos: <Medal size={48} color="#c87941" />,
                label: "Third Place",
                desc: "Honourable mention",
                border: "#c87941",
              },
            ].map((a, i) => (
              <div
                key={i}
                className={`rounded-[18px] p-[36px_44px] min-w-[210px] transition-[transform,background,box-shadow] duration-[250ms] ${awardsVisible ? `animate-fade-up delay-${i + 1}` : "pre-anim"}`}
                style={{
                  background: "rgba(255,255,255,0.13)",
                  backdropFilter: "blur(12px)",
                  border: `2px solid ${a.border}60`,
                  borderTop: `3px solid ${a.border}`,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                  e.currentTarget.style.boxShadow =
                    "0 16px 40px rgba(0,0,0,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.background = "rgba(255,255,255,0.13)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(0,0,0,0.25)";
                }}
              >
                <div className="mb-[14px] flex justify-center">{a.pos}</div>
                <div className="font-bold text-[18px] text-white mb-[6px]">
                  {a.label}
                </div>
                <div className="text-[13px] text-white/75 leading-[1.5]">
                  {a.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED SESSIONS ────────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-3">
            <span className="badge badge-blue mb-3">Programme Highlights</span>
            <h2
              className="mb-[10px]"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
            >
              Featured Sessions
            </h2>
            <p className="font-semibold text-base text-ug-blue mb-2">
              Keynote &amp; Invited Speakers
            </p>
            <p className="text-[#666] text-[14px] max-w-[560px] mx-auto mb-11 leading-[1.75]">
              Speaker announcements will be made progressively. Check back for
              updates as confirmed invitations are received.
            </p>
          </div>
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            }}
          >
            {(
              home.featuredSessions || [
                {
                  id: 1,
                  icon: <Mic size={28} />,
                  tag: "Keynote",
                  session: "Opening Keynote",
                  role: "TBA — Keynote Speaker",
                  status: "Announcement Coming Soon",
                  topic:
                    "Technology, Research & the Future of Computing in Africa",
                  accent: "#1B3A6B",
                },
                {
                  id: 2,
                  icon: <Lightbulb size={28} />,
                  tag: "Industry",
                  session: "Industry Insights Session",
                  role: "TBA — Invited Speaker",
                  status: "Industry / Academic Partner",
                  topic: "AI, Machine Learning & Applied Computer Science",
                  accent: "#C9A84C",
                },
                {
                  id: 3,
                  icon: <BookOpen size={28} />,
                  tag: "Panel",
                  session: "Research Methods Panel",
                  role: "TBA — Panel Chair",
                  status: "University of Ghana, DCS Faculty",
                  topic: "Publishing Research: From Submission to Acceptance",
                  accent: "#0F2347",
                },
              ]
            ).map((s, i) => (
              <div
                key={i}
                className="card transition-[box-shadow,transform] duration-200"
                style={{ borderTop: `4px solid ${s.accent}` }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 8px 28px rgba(27,58,107,0.13)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "none";
                }}
              >
                {/* session icon */}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                  style={{
                    background: `${s.accent}15`,
                    border: `2px solid ${s.accent}30`,
                  }}
                >
                  {typeof s.icon === "string" ? s.icon : s.icon}
                </div>

                <div
                  className="inline-block text-[10px] font-bold text-white py-[3px] px-[10px] rounded-xl uppercase tracking-[0.06em] mb-3"
                  style={{ background: s.accent }}
                >
                  {s.tag}
                </div>

                <h3 className="text-base font-serif mb-1 text-[#1a1a1a]">
                  {s.session}
                </h3>
                <p
                  className="text-[13px] font-semibold mb-1"
                  style={{ color: s.accent }}
                >
                  {s.role}
                </p>
                {s.status && (
                  <p className="text-[12px] text-[#888] mb-3">{s.status}</p>
                )}
                <div
                  className="bg-ug-surface rounded-lg p-[10px_14px]"
                  style={{ borderLeft: `3px solid ${s.accent}` }}
                >
                  <p className="text-[12px] text-[#555] leading-[1.6] m-0 italic">
                    <strong className="text-ug-blue not-italic">Theme: </strong>
                    {s.topic}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ORGANIZERS ───────────────────────────────────────────────── */}
      <section ref={orgRef} className="section">
        <div className="container">
          <div className="text-center mb-11">
            <span className="badge badge-blue mb-3">Leadership</span>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>Organizers</h2>
          </div>
          <div
            className="grid gap-5"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            }}
          >
            {organizers.map((o, i) => (
              <div
                key={i}
                className={`bg-white border border-[#e0e0e0] rounded-2xl p-[28px_24px] text-center border-t-[3px] border-t-ug-blue transition-[box-shadow,transform] duration-200 ${orgVisible ? `animate-fade-up delay-${i + 1}` : "pre-anim"}`}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 8px 28px rgba(27,58,107,0.12)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "none";
                }}
              >
                <div className="w-[52px] h-[52px] rounded-full bg-ug-blue-light flex items-center justify-center mx-auto mb-[14px]">
                  <Landmark size={22} color="#1B3A6B" />
                </div>
                <div className="font-semibold text-[15px]">{o.title}</div>
                <div className="text-[13px] text-[#666] mt-1">{o.sub}</div>
                <span className="badge badge-blue mt-3">{o.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPONSORS ─────────────────────────────────────────────────── */}
      <section className="section-sm bg-ug-surface border-t border-[#eee]">
        <div className="container">
          <div className="text-center mb-8">
            <span className="badge badge-gold mb-3">Support</span>
            <h2 className="about-heading text-[1.6rem]">
              Sponsors &amp; Funders
            </h2>
          </div>
          <div className="flex gap-5 justify-center flex-wrap">
            {activeSponsors.map((s, i) => (
              <div
                key={i}
                className="bg-white border border-[#e8e0cc] rounded-[14px] p-[24px_32px] text-center min-w-[200px] transition-shadow duration-200"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(201,168,76,0.18)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <div className="mb-[10px] flex justify-center">{s.icon}</div>
                <div className="font-semibold text-[15px]">{s.name}</div>
                <span className="badge badge-gold mt-2">{s.tier}</span>
              </div>
            ))}
          </div>
          <p className="text-center mt-6 text-[13px] text-[#888]">
            Interested in sponsoring? Contact the Workshop Planning Committee at
            the Department of Computer Science, UG.
          </p>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="section bg-ug-surface">
        <div className="container">
          <div className="text-center mb-11">
            <span className="badge badge-gold mb-3">Voices from 2025</span>
            <h2
              className="about-heading"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
            >
              What Participants Say
            </h2>
          </div>
          <div
            className="grid gap-5"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            }}
          >
            {(
              home.testimonials || [
                {
                  id: 1,
                  quote:
                    "Presenting my thesis research here was a turning point. The feedback from the judges helped me refine my work before my final defence.",
                  name: "Ama Boateng",
                  prog: "MPhil Computer Science",
                },
                {
                  id: 2,
                  quote:
                    "The networking opportunities were incredible. I connected with PhD students and faculty whose work directly overlaps with my own research area.",
                  name: "Kwame Asante",
                  prog: "MSc Computer Science",
                },
                {
                  id: 3,
                  quote:
                    "I wasn't sure if my work was ready to present, but the committee was very encouraging. The experience gave me real academic confidence.",
                  name: "Efua Mensah",
                  prog: "MSc Computer Science",
                },
              ]
            ).map((t, i) => (
              <div key={i} className="card relative">
                <div className="text-[40px] text-ug-gold font-['Georgia,serif'] leading-none mb-2">
                  "
                </div>
                <p className="text-[14px] text-[#444] leading-[1.85] mb-5 italic">
                  {t.quote}
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={
                      t.photo ||
                      [img.research, img.students, img.workshop][i % 3]
                    }
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-ug-blue-light"
                  />
                  <div>
                    <div className="font-semibold text-[14px]">{t.name}</div>
                    <div className="text-[12px] text-[#888]">{t.prog}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-[80px] text-center"
        style={{
          background: "linear-gradient(135deg, #1B3A6B 0%, #0F2347 100%)",
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.07]"
          style={{ backgroundImage: `url('${img.networking}')` }}
        />
        <div className="container relative">
          <h2
            className="text-white mb-[14px]"
            style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)" }}
          >
            Ready to Present Your Research?
          </h2>
          <p className="text-white/70 text-base max-w-[500px] mx-auto mb-9 leading-[1.75]">
            Secure your spot at the{" "}
            {event?.edition || "2nd DCS Postgraduate Workshop"}. GHS{" "}
            {event?.fee || 100} covers snacks, water &amp; all workshop
            materials.
          </p>
          <button
            className="btn-gold animate-pulse-gold"
            onClick={() => navigate("register")}
            style={{ fontSize: 17, padding: "16px 44px" }}
          >
            <span className="inline-flex items-center gap-[6px]">
              Register Now
              <ArrowRight size={14} />
            </span>
          </button>
        </div>
      </section>
    </main>
  );
}
