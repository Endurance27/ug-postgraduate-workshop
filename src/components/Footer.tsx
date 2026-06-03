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

const QUICK_LINKS = [
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
];

// ─── Component ───────────────────────────────────────────────────────────────
export default function Footer({ footer = {} }: FooterProps) {
  const tagline     = footer.tagline     || "2nd Annual Postgraduate Students Workshop";
  const dates       = footer.dates       || "27–29 August 2026 · Hybrid Format";
  const organizers  = footer.organizers  || ["Department of Computer Science, UG", "Workshop Planning Committee"];
  const sponsors    = footer.sponsors    || ["University of Ghana", "DSC Workshop Committee", "Industry Partners (TBD)"];
  const publication = footer.publication || "CBAS Journal";

  return (
    <footer
      className="text-white mt-auto"
      style={{ background: "linear-gradient(175deg, #0F2347 0%, #080F1E 100%)" }}
    >
      {/* Gold accent line */}
      <div style={{ height: 3, background: "linear-gradient(90deg, transparent, #C9A84C 30%, #C9A84C 70%, transparent)" }} />

      <div className="container px-6 pt-12 pb-6">

        {/* ── Main grid ─────────────────────────────────────────── */}
        <div
          className="footer-grid gap-10 mb-10"
          style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr 1fr 1fr", alignItems: "start" }}
        >

          {/* ── Brand col ── */}
          <div>
            {/* Logo in a clean white badge — standard for white-bg institutional logos on dark backgrounds */}
            <div className="inline-block mb-5 rounded-[10px] overflow-hidden" style={{ background: "#fff", padding: "7px 14px", boxShadow: "0 2px 12px rgba(0,0,0,0.25)" }}>
              <svg
                viewBox="0 0 430 60"
                style={{ height: 36, width: "auto", display: "block" }}
                xmlns="http://www.w3.org/2000/svg"
                aria-label="University of Ghana — Department of Computer Science"
              >
                <image href="/ug-logo.svg" x="0" y="0" width="193" height="60" preserveAspectRatio="xMidYMid meet" />
                <line x1="201" y1="8" x2="201" y2="52" stroke="#C9A84C" strokeWidth="1.5" />
                <text x="210" y="23" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="20" fill="#1B3A6B" letterSpacing="0.5">DEPARTMENT OF</text>
                <text x="210" y="50" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="20" fill="#1B3A6B" letterSpacing="0.5">COMPUTER SCIENCE</text>
              </svg>
            </div>
            <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)", maxWidth: 230 }}>
              {tagline}<br />{dates}
            </p>
          </div>

          {/* ── Quick Links col ── */}
          <div>
            <h4 className="text-ug-gold font-semibold text-[11px] tracking-[0.12em] uppercase mb-4">
              Quick Links
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 12 }}>
              {QUICK_LINKS.map(({ key, label }) => (
                <Link
                  key={key}
                  to={getRoutePath(key)}
                  className="block text-[13px] py-[5px] transition-colors duration-150 no-underline"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* ── Organizers col ── */}
          <div>
            <h4 className="text-ug-gold font-semibold text-[11px] tracking-[0.12em] uppercase mb-4">
              Organizers
            </h4>
            <div className="flex flex-col gap-2.5">
              {organizers.map((o, i) => (
                <span key={i} className="text-[13px]" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
                  {o}
                </span>
              ))}
            </div>
          </div>

          {/* ── Sponsors & Funders col ── */}
          <div>
            <h4 className="text-ug-gold font-semibold text-[11px] tracking-[0.12em] uppercase mb-4">
              Sponsors &amp; Funders
            </h4>
            <div className="flex flex-col gap-2.5">
              {sponsors.map((s, i) => (
                <span key={i} className="text-[13px]" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
                  {s}
                </span>
              ))}
            </div>
            <div
              className="mt-4 pt-4"
              style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div
                className="text-[11px] uppercase tracking-wider mb-1"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Publication in
              </div>
              <span className="text-ug-gold text-[13px] font-medium">{publication}</span>
            </div>
          </div>

        </div>

        {/* ── Bottom bar ────────────────────────────────────────── */}
        <div
          className="pt-5 flex justify-between items-center flex-wrap gap-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.3)" }}>
            © 2026 University of Ghana · Department of Computer Science · All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.3)" }}>
              GHS 100 · Hybrid Event · 27–29 Aug 2026
            </p>
            <Link
              to={getRoutePath("admin")}
              className="text-[13px] transition-colors duration-150 no-underline"
              style={{ color: "rgba(255,255,255,0.3)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
            >
              Admin
            </Link>
          </div>
        </div>

      </div>

      {/* Responsive: collapse to 2-col then 1-col */}
      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
