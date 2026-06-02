import { User } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface KeynoteSpeaker {
  name?: string;
  title?: string;
  institution?: string;
  topic?: string;
  bio?: string;
  photo?: string;
  tags?: string | string[];
}

interface Panelist {
  id?: number;
  name: string;
  title: string;
  institution: string;
  role: string;
  bio: string;
  photo?: string;
}

interface CommitteeMember {
  id?: number;
  name: string;
  role: string;
  institution: string;
}

interface SpeakersData {
  keynote?: KeynoteSpeaker;
  panelists?: Panelist[];
  committee?: CommitteeMember[];
}

interface SpeakersPageProps {
  speakers?: SpeakersData;
  images?: Record<string, string>;
}

export default function SpeakersPage({ speakers = {}, images = {} }: SpeakersPageProps) {
  const keynote: KeynoteSpeaker    = speakers.keynote   || {};
  const panelists: Panelist[]      = speakers.panelists || [];
  const committee: CommitteeMember[] = speakers.committee || [];
  const tags: string[]             = typeof keynote.tags === "string"
    ? keynote.tags.split(",").map(t => t.trim()).filter(t => t.length > 0)
    : (keynote.tags || []);
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ug-navy to-ug-blue text-white py-[72px] pb-14">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.18]"
          style={{ backgroundImage: `url('${images.networking || "/images/collaboration-networking.jpeg"}')` }}
        />
        <div className="container relative z-10">
          <span className="badge inline-block mb-[14px]" style={{ background: "rgba(201,168,76,0.25)", color: "#C9A84C" }}>
            2026 Workshop
          </span>
          <h1 className="text-white font-serif mb-3" style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)" }}>
            Speakers &amp; Committee
          </h1>
          <p className="text-white/75 text-base">
            Meet the keynote speaker, panel members, and the organising committee
          </p>
        </div>
      </section>

      <div className="container section">

        {/* ── KEYNOTE ──────────────────────────────────────────── */}
        <div className="text-center mb-4">
          <span className="badge badge-gold mb-3">Keynote Speaker</span>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>Opening Keynote</h2>
        </div>

        <div className="keynote-card keynote-grid grid bg-white rounded-[20px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.1)] mb-[72px] border border-[#e8e8e8]"
          style={{ gridTemplateColumns: "280px 1fr", gap: 40, alignItems: "start" }}>
          <div className="relative">
            <img src={keynote.photo} alt={keynote.name}
              className="w-full object-cover block" style={{ height: 320 }} />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(15,35,71,0.85)] flex items-end p-4">
              <span className="bg-ug-gold text-ug-navy text-[11px] font-bold px-3 py-1 rounded-[20px] uppercase tracking-[0.05em]">
                Keynote Speaker
              </span>
            </div>
          </div>
          <div className="py-8 pr-8">
            <h2 className="font-serif text-[1.7rem] mb-1.5 text-ug-navy">
              {keynote.name}
            </h2>
            <div className="text-[15px] text-ug-gold font-semibold mb-1">{keynote.title}</div>
            <div className="text-[14px] text-[#888] mb-5">{keynote.institution}</div>
            <div className="bg-ug-blue-light border-l-[3px] border-ug-blue px-4 py-3 rounded-[0_8px_8px_0] text-[14px] text-ug-blue italic font-medium leading-[1.6] mb-5">
              "{keynote.topic}"
            </div>
            <p className="text-[14px] text-[#555] leading-[1.8] mb-5">{keynote.bio}</p>
            <div className="flex gap-2 flex-wrap">
              {tags.map(t => (
                <span key={t} className="badge badge-blue text-[12px]">{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── PANEL ────────────────────────────────────────────── */}
        <div className="text-center mb-9">
          <span className="badge badge-navy mb-3">Day 2</span>
          <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)" }}>Panel Discussion: Research &amp; Industry</h2>
          <p className="text-[#555] max-w-[560px] mx-auto mt-2.5 text-[15px]">
            A moderated discussion on the intersection of academic research and real-world impact in the African tech ecosystem.
          </p>
        </div>

        <div className="grid gap-5 mb-[72px]" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {panelists.map((p, i) => (
            <div key={i}
              className="bg-white border border-[#e8e8e8] rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-[transform,box-shadow] duration-200"
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(27,58,107,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; }}
            >
              <div className="relative h-[180px]">
                <img src={p.photo} alt={p.name}
                  className="w-full h-full object-cover block" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(15,35,71,0.8)]" />
                <span className="absolute bottom-3 left-[14px] text-[11px] font-bold px-[10px] py-[3px] rounded-xl backdrop-blur-sm"
                  style={{
                    background: i === 0 ? "#C9A84C" : "rgba(255,255,255,0.2)",
                    color: i === 0 ? "#0F2347" : "#fff",
                  }}>{p.role}</span>
              </div>
              <div className="px-[18px] pt-4 pb-5">
                <div className="font-bold text-[15px] mb-[3px]">{p.name}</div>
                <div className="text-[12px] text-ug-gold font-semibold mb-0.5">{p.title}</div>
                <div className="text-[11px] text-[#888] mb-2.5">{p.institution}</div>
                <p className="text-[13px] text-[#666] leading-[1.65] m-0">{p.bio}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── COMMITTEE ────────────────────────────────────────── */}
        <div className="bg-ug-surface rounded-[20px] p-10">
          <div className="text-center mb-8">
            <span className="badge badge-blue mb-3">Leadership</span>
            <h2 className="about-heading" style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)" }}>Organising Committee</h2>
          </div>
          <div className="grid gap-[14px]" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            {committee.map((m, i) => (
              <div key={i} className="bg-white border border-[#e0e0e0] rounded-xl px-5 py-4 flex items-center gap-[14px] border-l-[3px] border-l-ug-blue">
                <div className="w-10 h-10 rounded-full bg-ug-blue-light flex items-center justify-center flex-shrink-0 text-ug-blue">
                  <User size={20} />
                </div>
                <div>
                  <div className="font-semibold text-[14px]">{m.name}</div>
                  <div className="text-[12px] text-ug-gold font-medium mt-0.5">{m.role}</div>
                  <div className="text-[11px] text-[#888] mt-px">{m.institution}</div>
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
