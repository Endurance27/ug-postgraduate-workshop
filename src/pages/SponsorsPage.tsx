import {
  BookOpen,
  Handshake,
  Mail,
  ArrowRight,
  Check,
  Gem,
  Trophy,
  Medal,
  Landmark,
  FlaskConical,
  Laptop,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Sponsor {
  id: number;
  name: string;
  role: string;
  desc: string;
  tier: string;
  logo: React.ReactNode;
}

interface SponsorsPageProps {
  navigate?: (page: string) => void;
  images?: Record<string, string>;
  contact?: Record<string, string>;
  footer?: Record<string, string>;
  sponsors?: Sponsor[];
}

import React from "react";

export default function SponsorsPage({
  navigate,
  images = {},
  contact = {},
  footer = {},
  sponsors = [],
}: SponsorsPageProps) {
  const contactEmail = contact.email || "dcsworkshop@ug.edu.gh";
  const publication = footer.publication || "CBAS Journal";
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ug-navy to-ug-blue text-white py-[72px] pb-14">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.12]"
          style={{ backgroundImage: `url('${images.networking || `${import.meta.env.BASE_URL}images/collaboration-networking.jpeg`}')` }}
        />
        <div className="container relative z-10">
          <span
            className="badge inline-block mb-[14px]"
            style={{ background: "rgba(201,168,76,0.25)", color: "#C9A84C" }}
          >
            Supporters &amp; Partners
          </span>
          <h1 className="text-white font-serif text-[clamp(2rem,4.5vw,3rem)] mb-3">
            Sponsors &amp; Funders
          </h1>
          <p className="text-white/75 text-base max-w-[620px]">
            The 2026 DCS Postgradute Research Conference & Workshop is made
            possible through the generous support of our institutional partners
            and sponsors.
          </p>
        </div>
      </section>

      <div className="container section">
        {/* Institutional Sponsors */}
        <div className="mb-16">
          <h2 className="font-serif text-[1.6rem] mb-2 text-ug-blue">
            Institutional Sponsors
          </h2>
          <p className="text-[var(--text-muted)] text-sm mb-9">
            Primary supporters of the 2nd Annual DCS Postgraduate Workshop
          </p>

          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            }}
          >
            {(sponsors.length > 0 ?
              sponsors
            : [
                {
                  id: 1,
                  name: "University of Ghana",
                  role: "Host Institution",
                  desc: "The University of Ghana, founded in 1948, is the premier research university in Ghana and one of the leading universities in Africa.",
                  tier: "gold",
                  logo: <Landmark size={40} className="text-ug-gold" />,
                },
                {
                  id: 2,
                  name: "School of Physical & Mathematical Sciences",
                  role: "Faculty Sponsor",
                  desc: "SPMS provides direct academic and logistical support for the workshop through its faculty committee.",
                  tier: "gold",
                  logo: <FlaskConical size={40} className="text-ug-gold" />,
                },
                {
                  id: 3,
                  name: "Department of Computer Science",
                  role: "Organising Department",
                  desc: "The Department of Computer Science at UG is the primary organiser of the workshop.",
                  tier: "primary",
                  logo: <Laptop size={40} className="text-ug-blue" />,
                },
              ]
            ).map((s, i) => (
              <div
                key={i}
                className="card relative overflow-hidden"
                style={{
                  borderTop: `4px solid ${s.tier === "gold" ? "#C9A84C" : "#1B3A6B"}`,
                }}
              >
                <div className="mb-[14px] flex">{s.logo}</div>
                <div
                  className="inline-block text-[10px] font-bold px-[10px] py-[3px] rounded-xl tracking-[0.06em] uppercase mb-2.5"
                  style={{
                    background: s.tier === "gold" ? "#C9A84C" : "#1B3A6B",
                    color: s.tier === "gold" ? "#0F2347" : "#fff",
                  }}
                >
                  {s.role}
                </div>
                <h3 className="font-serif text-[1.05rem] mb-2.5 text-ug-blue">
                  {s.name}
                </h3>
                <p className="text-[13px] text-[var(--text-muted)] leading-[1.75] m-0">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Publication Partner */}
        <div className="bg-gradient-to-br from-ug-navy to-ug-blue rounded-[18px] p-[40px_44px] mb-16 flex items-center gap-9 flex-wrap">
          <div className="flex-shrink-0 text-ug-gold">
            <BookOpen size={52} />
          </div>
          <div className="flex-1 min-w-[240px]">
            <div
              className="inline-block text-[10px] font-bold px-[10px] py-[3px] rounded-xl tracking-[0.06em] uppercase mb-2.5"
              style={{ background: "rgba(201,168,76,0.25)", color: "#C9A84C" }}
            >
              Publication Partner
            </div>
            <h3 className="font-serif text-[1.4rem] text-white mb-2">
              {publication}
            </h3>
            <p className="text-white/70 text-sm leading-[1.75] m-0">
              Accepted papers from the workshop are considered for publication
              in the{" "}
              <strong className="text-ug-gold">
                College of Basic and Applied Sciences (CBAS) Journal
              </strong>
              . The editorial committee reviews eligible submissions and
              contacts authors after the workshop.
            </p>
          </div>
        </div>

        {/* Industry Partners */}
        <div className="mb-16">
          <h2 className="font-serif text-[1.6rem] mb-2 text-ug-blue">
            Industry Partners
          </h2>
          <p className="text-[var(--text-muted)] text-sm mb-9">
            Corporate and industry partners supporting postgraduate research in
            Ghana
          </p>

          <div className="bg-[#f9f9fb] border-2 border-dashed border-[#d0d8e8] rounded-2xl p-[48px_36px] text-center">
            <div className="mb-4 flex justify-center text-ug-blue">
              <Handshake size={48} />
            </div>
            <h3 className="font-serif text-[1.2rem] text-ug-blue mb-2">
              Partnerships Open for 2026
            </h3>
            <p className="text-[var(--text-muted)] text-sm leading-[1.8] max-w-[520px] mx-auto mb-7">
              We are actively seeking industry partners to support the 2nd
              Annual DCS Postgradute Research Conference & Workshop. Sponsorship
              provides visibility among Ghana's leading postgraduate research
              community.
            </p>
            <a
              href={`mailto:${contactEmail}?subject=Sponsorship%20Enquiry%20%E2%80%94%20DCS%20Workshop%202026`}
              className="btn-gold inline-flex items-center gap-2 bg-ug-gold text-ug-navy rounded-[10px] px-7 py-3 text-sm font-bold no-underline"
            >
              <Mail size={16} /> Express Interest in Sponsorship
            </a>
          </div>
        </div>

        {/* Sponsorship Tiers */}
        <div className="mb-16">
          <h2 className="font-serif text-[1.6rem] mb-2 text-ug-blue">
            Sponsorship Packages
          </h2>
          <p className="text-[var(--text-muted)] text-sm mb-9">
            Support the next generation of Ghanaian computer scientists
          </p>

          <div
            className="grid gap-5"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            {[
              {
                tier: "Platinum",
                color: "#5b5b7a",
                icon: <Gem size={24} />,
                perks: [
                  "Logo on all printed materials",
                  "Banner at venue",
                  "Speaking slot (5 min)",
                  "4 complimentary registrations",
                  "Social media mention",
                ],
              },
              {
                tier: "Gold",
                color: "#C9A84C",
                icon: <Trophy size={24} />,
                perks: [
                  "Logo on website & programme",
                  "Exhibitor table at venue",
                  "2 complimentary registrations",
                  "Social media mention",
                ],
              },
              {
                tier: "Silver",
                color: "#7a7a7a",
                icon: <Medal size={24} />,
                perks: [
                  "Logo on event programme",
                  "1 complimentary registration",
                  "Website acknowledgement",
                ],
              },
              {
                tier: "Bronze",
                color: "#b56f3e",
                icon: <Medal size={24} />,
                perks: ["Name on website", "Certificate of partnership"],
              },
            ].map((p, i) => (
              <div
                key={i}
                className="rounded-[14px] overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.08)] border border-[#eee]"
              >
                <div
                  className="p-[18px_20px] flex items-center gap-2.5"
                  style={{ background: p.color }}
                >
                  <span className="text-white flex items-center">{p.icon}</span>
                  <span className="font-serif font-bold text-base text-white">
                    {p.tier}
                  </span>
                </div>
                <div className="p-[18px_20px] bg-white">
                  {p.perks.map((perk, pi) => (
                    <div key={pi} className="flex gap-2 mb-2.5 items-start">
                      <span
                        className="flex-shrink-0 mt-px flex items-center"
                        style={{ color: p.color }}
                      >
                        <Check size={13} />
                      </span>
                      <span className="text-[13px] text-[var(--text)] leading-[1.5]">
                        {perk}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-ug-blue-light rounded-2xl p-[40px_32px]">
          <h3 className="font-serif text-[1.3rem] text-ug-blue mb-2.5">
            Interested in Supporting the Workshop?
          </h3>
          <p className="text-[var(--text-muted)] text-sm leading-[1.75] max-w-[500px] mx-auto mb-6">
            Contact the Workshop Planning Committee to discuss sponsorship
            opportunities and customised partnership packages.
          </p>
          <div className="flex gap-3.5 justify-center flex-wrap">
            <a
              href={`mailto:${contactEmail}?subject=Sponsorship%20Enquiry`}
              className="btn-primary no-underline inline-flex items-center gap-2"
            >
              <Mail size={16} /> {contactEmail}
            </a>
            {navigate && (
              <button
                onClick={() => navigate("contact")}
                className="btn-outline inline-flex items-center gap-1.5"
              >
                Contact Form <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
