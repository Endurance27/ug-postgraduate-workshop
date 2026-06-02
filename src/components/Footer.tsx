import { Link } from "react-router-dom";
import { getRoutePath } from "../routes.js";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FooterData {
  tagline?: string;
  dates?: string;
  organizers?: string[];
  sponsors?: string[];
  publication?: string;
}

interface FooterProps {
  footer?: FooterData;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function Footer({ footer = {} }: FooterProps) {
  const tagline     = footer.tagline     || "2nd Annual Postgraduate Students Workshop";
  const dates       = footer.dates       || "27–29 August 2026 · Hybrid Format";
  const organizers  = footer.organizers  || ["Department of Computer Science, UG", "Workshop Planning Committee"];
  const sponsors    = footer.sponsors    || ["University of Ghana", "DSC Workshop Committee", "Industry Partners (TBD)"];
  const publication = footer.publication || "CBAS Journal";

  return (
    <footer className="bg-ug-navy text-white mt-auto">
      <div className="container px-6 pt-14 pb-8">
        <div className="flex justify-between items-start gap-[34px] mb-10 flex-wrap row-gap-8">

          {/* ── Logo (left) ── */}
          <div className="shrink-0">
            <div className="mb-4">
              <div className="inline-block bg-white p-[8px_14px]">
                <svg viewBox="0 0 430 60" className="h-8 w-auto block"
                  xmlns="http://www.w3.org/2000/svg" aria-label="University of Ghana — Department of Computer Science">
                  <image href="/ug-logo.svg" x="0" y="0" width="193" height="60" preserveAspectRatio="xMidYMid meet" />
                  <line x1="201" y1="8" x2="201" y2="52" stroke="#C9A84C" strokeWidth="1.5" />
                  <text x="210" y="23" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="20" fill="#1B3A6B" letterSpacing="0.5">DEPARTMENT OF</text>
                  <text x="210" y="50" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="20" fill="#1B3A6B" letterSpacing="0.5">COMPUTER SCIENCE</text>
                </svg>
              </div>
            </div>
            <p className="text-[13px] text-[#ccc] leading-[1.7]">
              {tagline}<br />{dates}
            </p>
          </div>

          {/* ── Right group (Quick Links · Organizers · Sponsors) ── */}
          <div className="footer-right flex gap-[50px] flex-wrap justify-end">

            <div>
              <h4 className="font-serif text-base mb-4 text-ug-gold">Quick Links</h4>
              {[
                { key: "home",       label: "Home"        },
                { key: "about",      label: "About"       },
                { key: "schedule",   label: "Schedule"    },
                { key: "speakers",   label: "Speakers"    },
                { key: "awards",     label: "Awards"      },
                { key: "stream",     label: "Livestream"  },
                { key: "gallery",    label: "Gallery"     },
                { key: "recordings", label: "Recordings"  },
                { key: "sponsors",   label: "Sponsors"    },
                { key: "support",    label: "Support"     },
                { key: "contact",    label: "Contact"     },
                { key: "register",   label: "Register Now"},
              ].map(({ key, label }) => (
                <Link key={key} to={getRoutePath(key)} className="block bg-transparent border-0 text-[#ccc] text-[13px] py-1 cursor-pointer text-left no-underline">{label}</Link>
              ))}
            </div>

            <div>
              <h4 className="font-serif text-base mb-4 text-ug-gold">Organizers</h4>
              <p className="text-[13px] text-[#ccc] leading-[1.9]">
                {organizers.map((o, i) => <span key={i}>{o}{i < organizers.length - 1 && <br />}</span>)}
              </p>
            </div>

            <div>
              <h4 className="font-serif text-base mb-4 text-ug-gold">Sponsors &amp; Funders</h4>
              <p className="text-[13px] text-[#ccc] leading-[1.9]">
                {sponsors.map((s, i) => <span key={i}>{s}{i < sponsors.length - 1 && <br />}</span>)}
              </p>
              <div className="mt-4">
                <span className="text-[12px] text-[#bbb]">Publication in:</span><br />
                <span className="text-[13px] text-ug-gold font-medium">{publication}</span>
              </div>
            </div>

          </div>
        </div>

        <div className="border-t border-[#1A2E50] pt-6 flex justify-between items-center flex-wrap gap-3">
          <p className="text-[14.5px] text-[#aaa] ml-0">© 2026 University of Ghana · Department of Computer Science · All rights reserved.</p>
          <div className="flex items-center gap-4">
            <p className="text-[14.5px] text-[#aaa]">Registration Fee: GHS 100 · Hybrid Event · 27–29 Aug 2026</p>
            <Link to={getRoutePath("admin")} className="bg-transparent border-0 text-[#aaa] text-[14.5px] cursor-pointer p-0 underline no-underline hover:underline">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
