import { Trophy, Medal } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Award {
  id: number;
  emoji: string;
  label: string;
  winner: string;
  paper: string;
  announced: boolean;
}

interface PastWinner {
  id: number;
  pos: React.ReactNode;
  place: string;
  desc: string;
  edition: string;
  field: string;
  name: string;
  avatar: string;
}

interface AwardsPageProps {
  awards?: Award[];
  pastWinners?: PastWinner[];
  event?: Record<string, string>;
}

import React from "react";

const criteria = [
  { label: "Research Quality", weight: "30%", desc: "Originality, depth, and rigour of the research." },
  { label: "Presentation Skills", weight: "25%", desc: "Clarity, confidence, and delivery of the presentation." },
  { label: "Content & Structure", weight: "20%", desc: "Logical flow, clarity of argument, and organisation." },
  { label: "Q&A Performance", weight: "15%", desc: "Ability to answer questions from judges and audience." },
  { label: "Practical Impact", weight: "10%", desc: "Potential real-world or academic contribution of the work." },
];

const FALLBACK_PAST_WINNERS = [
  { id: 1, pos: <Trophy size={36} className="text-ug-gold" />, place: "1st Place Award", desc: "Best Presenter",          edition: "Maiden Workshop 2025", field: "Computer Science", name: "", avatar: "" },
  { id: 2, pos: <Medal  size={36} style={{ color: "#888" }} />,    place: "2nd Place Award", desc: "Outstanding Presentation", edition: "Maiden Workshop 2025", field: "Data Science",    name: "", avatar: "" },
  { id: 3, pos: <Medal  size={36} style={{ color: "#b5700a" }} />, place: "3rd Place Award", desc: "Commended Presenter",      edition: "Maiden Workshop 2025", field: "Computer Science", name: "", avatar: "" },
];

export default function AwardsPage({ awards, pastWinners, event = {} }: AwardsPageProps) {
  const displayPastWinners = (pastWinners && pastWinners.length > 0) ? pastWinners : FALLBACK_PAST_WINNERS;
  return (
    <main>
      {/* IMAGE-BACKED HERO */}
      <section className="relative overflow-hidden bg-ug-navy text-white py-[72px] pb-14">
        {/* Background image overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=1600&q=80')" }}
        />
        <div className="container relative z-10">
          <span className="badge inline-block mb-[14px]" style={{ background: "rgba(201,168,76,0.25)", color: "#C9A84C" }}>
            2026 Awards
          </span>
          <h1 className="text-white font-serif text-[clamp(2rem,4.5vw,3rem)] mb-3">
            Awards &amp; Recognition
          </h1>
          <p className="text-white/75 text-base mb-0">
            Honouring academic excellence at the UG Postgraduate Workshop
          </p>
        </div>
      </section>

      <div className="container section">
        {/* PRIZES */}
        <div className="text-center mb-14">
          <span className="badge badge-gold mb-[14px]">2026 Awards</span>
          <h2 className="text-[clamp(1.5rem,3vw,2rem)] mb-3">Prizes &amp; Recognition</h2>
          <p className="text-[#555] max-w-[520px] mx-auto mb-10">
            A panel of academic judges will evaluate all presentations across the three days and award the top three presenters.
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            {[
              { pos: <Trophy size={52} className="text-ug-gold" />, label: "First Place", color: "#C9A84C", bg: "#FAF0D0", desc: "Best overall presentation judged across all categories" },
              { pos: <Medal  size={52} style={{ color: "#888" }} />,    label: "Second Place", color: "#888", bg: "#f5f5f5", desc: "Runner-up recognition for outstanding research presentation" },
              { pos: <Medal  size={52} style={{ color: "#b5700a" }} />, label: "Third Place", color: "#b5700a", bg: "#fef3e2", desc: "Third-place commendation for excellent academic work" },
            ].map((a, i) => (
              <div key={i}
                className="rounded-2xl p-9 min-w-[220px] max-w-[260px] flex-[1_1_220px]"
                style={{ background: a.bg, border: `2px solid ${a.color}30` }}
              >
                <div className="mb-3 flex justify-center">{a.pos}</div>
                <div className="font-serif text-xl font-bold mb-2" style={{ color: a.color }}>{a.label}</div>
                <p className="text-[13px] text-[#666] leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* INSPIRATION BANNER — full-width between prizes and judging criteria */}
      <div className="relative h-[280px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=1400&q=80"
          alt="Diverse students"
          className="w-full h-full object-cover block"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          style={{ background: "rgba(15,35,71,0.72)" }}
        >
          <p className="font-serif text-[clamp(1.4rem,3.5vw,2.2rem)] text-white italic font-semibold m-0 leading-snug">
            "Excellence Recognised. Research Celebrated."
          </p>
          <div className="w-12 h-[3px] bg-ug-gold rounded-sm mt-5" />
        </div>
      </div>

      <div className="container section pt-14">
        {/* JUDGING CRITERIA */}
        <div className="max-w-[700px] mx-auto mb-16">
          <h3 className="text-center mb-7">Judging Criteria</h3>
          <div className="border border-[#eee] rounded-2xl overflow-hidden">
            {criteria.map((c, i) => (
              <div key={i}
                className={`grid grid-cols-[1fr_auto] items-center p-4 px-5 gap-4 ${i % 2 === 0 ? "bg-white" : "bg-ug-surface"} ${i < criteria.length - 1 ? "border-b border-[#f0f0f0]" : ""}`}
              >
                <div>
                  <div className="font-semibold text-sm">{c.label}</div>
                  <div className="text-[13px] text-[#666] mt-[3px]">{c.desc}</div>
                </div>
                <div className="bg-ug-blue-light text-ug-blue font-bold text-[15px] px-[14px] py-[6px] rounded-full whitespace-nowrap">
                  {c.weight}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PAST WINNERS */}
        <div className="bg-ug-surface rounded-2xl p-10 mb-10">
          <h3 className="about-heading text-center mb-2">Maiden Workshop 2025 — Award Recipients</h3>
          <p className="text-center text-[#888] text-sm mb-7">
            Names of inaugural award recipients — congratulations to all!
          </p>
          <div className="flex gap-5 justify-center flex-wrap">
            {displayPastWinners.map((w, i) => (
              <div key={w.id || i} className="bg-white border border-[#e0e0e0] rounded-2xl px-6 py-5 min-w-[200px] text-center">
                {w.avatar && (
                  <div className="flex justify-center mb-[10px]">
                    <img src={w.avatar} alt={w.name || w.place}
                      className="w-16 h-16 rounded-full object-cover border-[3px] border-ug-blue-light block" />
                  </div>
                )}
                <div className="mb-2 flex justify-center">{w.pos}</div>
                <div className="font-semibold text-sm">{w.name || w.place}</div>
                {w.name && <div className="text-xs text-[#888] mt-0.5">{w.place}</div>}
                <div className="text-xs text-[#888] mt-1">{w.desc}</div>
                <div className="mt-2">
                  <span className="badge badge-navy text-[11px]">{w.field}</span>
                </div>
                <div className="text-[11px] text-[#aaa] mt-1.5">{w.edition}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-[13px] text-[#aaa] mt-5">
            * Recipient names displayed where consent has been given.
          </p>
        </div>

        {awards && awards.some(a => a.announced && a.winner) ? (
          <div className="mb-10">
            <h3 className="text-center mb-2">2026 Workshop — Award Winners</h3>
            <p className="text-center text-[#888] text-sm mb-7">Congratulations to the outstanding presenters of the 2nd DCS Postgraduate Workshop!</p>
            <div className="flex gap-5 justify-center flex-wrap">
              {awards.filter(a => a.announced && a.winner).map(a => (
                <div key={a.id} className="bg-white border border-[#e0e0e0] rounded-2xl px-7 py-6 min-w-[200px] text-center shadow-[0_4px_16px_rgba(0,0,0,0.07)]">
                  <div className="text-[40px] mb-[10px]">{a.emoji}</div>
                  <div className="font-bold text-[15px] font-serif mb-1.5">{a.winner}</div>
                  {a.paper && <div className="text-xs text-[#666] leading-relaxed mb-2">{a.paper}</div>}
                  <span className="badge badge-gold">{a.label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="alert alert-info max-w-[600px] mx-auto">
            <strong>2026 Awards:</strong> Results will be announced during the Awards Ceremony on Day 3 ({event.dates ? event.dates.split("–")[1] || "29 August 2026" : "29 August 2026"}) and published here.
          </div>
        )}
      </div>
    </main>
  );
}
