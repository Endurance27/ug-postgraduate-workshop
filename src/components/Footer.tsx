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

const COL_HEAD = {
  color: "#C9A84C",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
  marginBottom: 16,
};

const COL_TEXT: React.CSSProperties = {
  color: "rgba(255,255,255,0.78)",
  fontSize: 14,
  lineHeight: 1.7,
};

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
      <div style={{ height: 3, background: "linear-gradient(90deg, transparent, #C9A84C 25%, #C9A84C 75%, transparent)" }} />

      <div className="container" style={{ padding: "48px 24px 28px" }}>

        {/* ── Brand + Right columns ───────────────────────────────── */}
        <div
          className="footer-main"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 0, marginBottom: 40, flexWrap: "wrap" }}
        >

          {/* ── Brand (left) ─────────────────────────────────────── */}
          <div style={{ maxWidth: 230, flexShrink: 0 }}>
            {/* Logo badge */}
            <div
              style={{
                display: "inline-block",
                background: "#fff",
                borderRadius: 8,
                padding: "6px 12px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                marginBottom: 16,
              }}
            >
              <svg
                viewBox="0 0 430 60"
                style={{ height: 32, width: "auto", display: "block" }}
                xmlns="http://www.w3.org/2000/svg"
                aria-label="University of Ghana — Department of Computer Science"
              >
                <image href={`${import.meta.env.BASE_URL}ug-logo.svg`} x="0" y="0" width="193" height="60" preserveAspectRatio="xMidYMid meet" />
                <line x1="201" y1="8" x2="201" y2="52" stroke="#C9A84C" strokeWidth="1.5" />
                <text x="210" y="23" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="20" fill="#1B3A6B" letterSpacing="0.5">DEPARTMENT OF</text>
                <text x="210" y="50" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="20" fill="#1B3A6B" letterSpacing="0.5">COMPUTER SCIENCE</text>
              </svg>
            </div>
            <p style={{ ...COL_TEXT, fontWeight: 500, marginBottom: 4 }}>{tagline}</p>
            <p style={{ ...COL_TEXT }}>{dates}</p>
          </div>

          {/* ── Right section (Quick Links · Organizers · Sponsors) ── */}
          <div
            className="footer-right"
            style={{ display: "flex", gap: "0 48px", flexWrap: "wrap", justifyContent: "flex-end", flex: 1 }}
          >

            {/* Quick Links */}
            <div style={{ minWidth: 170 }}>
              <p style={COL_HEAD}>Quick Links</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 10 }}>
                {QUICK_LINKS.map(({ key, label }) => (
                  <Link
                    key={key}
                    to={getRoutePath(key)}
                    style={{ ...COL_TEXT, display: "block", padding: "4px 0", textDecoration: "none" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.78)")}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Organizers */}
            <div style={{ minWidth: 160 }}>
              <p style={COL_HEAD}>Organizers</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {organizers.map((o, i) => (
                  <span key={i} style={COL_TEXT}>{o}</span>
                ))}
              </div>
            </div>

            {/* Sponsors & Funders */}
            <div style={{ minWidth: 160 }}>
              <p style={COL_HEAD}>Sponsors &amp; Funders</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {sponsors.map((s, i) => (
                  <span key={i} style={COL_TEXT}>{s}</span>
                ))}
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14 }}>
                <p style={{ ...COL_TEXT, color: "rgba(255,255,255,0.78)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
                  Publication in
                </p>
                <span style={{ color: "#C9A84C", fontSize: 14, fontWeight: 600 }}>{publication}</span>
              </div>
            </div>

          </div>
        </div>

        {/* ── Bottom bar ─────────────────────────────────────────── */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20 }}>
          <div className="footer-bottom" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
              © 2026 University of Ghana · Department of Computer Science · All rights reserved.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
                GHS 100 · Hybrid Event · 27–29 Aug 2026
              </span>
              <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 11 }}>|</span>
              <Link
                to={getRoutePath("admin")}
                style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.85)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
              >
                Admin
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Responsive breakpoints */}
      <style>{`
        @media (max-width: 860px) {
          .footer-main  { flex-direction: column !important; }
          .footer-right { justify-content: flex-start !important; gap: 32px !important; }
        }
        @media (max-width: 520px) {
          .footer-right { flex-direction: column !important; gap: 28px !important; }
          .footer-bottom { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>
    </footer>
  );
}
