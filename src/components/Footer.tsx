// @ts-nocheck
import { Link } from "react-router-dom";
import { getRoutePath } from "../routes.js";

export default function Footer({ footer = {} }) {
  const tagline     = footer.tagline     || "2nd Annual Postgraduate Students Workshop";
  const dates       = footer.dates       || "27–29 August 2026 · Hybrid Format";
  const organizers  = footer.organizers  || ["Department of Computer Science, UG", "Workshop Planning Committee"];
  const sponsors    = footer.sponsors    || ["University of Ghana", "DSC Workshop Committee", "Industry Partners (TBD)"];
  const publication = footer.publication || "CBAS Journal";

  return (
    <footer style={{
      background: "#0F2347", color: "#fff", marginTop: "auto"
    }}>
      <div className="container" style={{ padding: "56px 24px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 34, marginBottom: 40, flexWrap: "wrap", rowGap: 32 }}>

          {/* ── Logo (left) ── */}
          <div style={{ flexShrink: 0 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "inline-block", background: "#fff", borderRadius: 0, padding: "8px 14px" }}>
                <svg viewBox="0 0 430 60" style={{ height: 32, width: "auto", display: "block" }}
                  xmlns="http://www.w3.org/2000/svg" aria-label="University of Ghana — Department of Computer Science">
                  <image href="/ug-logo.svg" x="0" y="0" width="193" height="60" preserveAspectRatio="xMidYMid meet" />
                  <line x1="201" y1="8" x2="201" y2="52" stroke="#C9A84C" strokeWidth="1.5" />
                  <text x="210" y="23" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="20" fill="#1B3A6B" letterSpacing="0.5">DEPARTMENT OF</text>
                  <text x="210" y="50" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="20" fill="#1B3A6B" letterSpacing="0.5">COMPUTER SCIENCE</text>
                </svg>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "#ccc", lineHeight: 1.7 }}>
              {tagline}<br />{dates}
            </p>
          </div>

          {/* ── Right group (Quick Links · Organizers · Sponsors) ── */}
          <div className="footer-right" style={{ display: "flex", gap: 50, flexWrap: "wrap", justifyContent: "flex-end" }}>

            <div>
              <h4 style={{ fontFamily: "Playfair Display, serif", fontSize: 16, marginBottom: 16, color: "#C9A84C" }}>Quick Links</h4>
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
                <Link key={key} to={getRoutePath(key)} style={{
                  display: "block", background: "none", border: "none",
                  color: "#ccc", fontSize: 13, padding: "4px 0",
                  cursor: "pointer", textAlign: "left",
                }}>{label}</Link>
              ))}
            </div>

            <div>
              <h4 style={{ fontFamily: "Playfair Display, serif", fontSize: 16, marginBottom: 16, color: "#C9A84C" }}>Organizers</h4>
              <p style={{ fontSize: 13, color: "#ccc", lineHeight: 1.9 }}>
                {organizers.map((o, i) => <span key={i}>{o}{i < organizers.length - 1 && <br />}</span>)}
              </p>
            </div>

            <div>
              <h4 style={{ fontFamily: "Playfair Display, serif", fontSize: 16, marginBottom: 16, color: "#C9A84C" }}>Sponsors &amp; Funders</h4>
              <p style={{ fontSize: 13, color: "#ccc", lineHeight: 1.9 }}>
                {sponsors.map((s, i) => <span key={i}>{s}{i < sponsors.length - 1 && <br />}</span>)}
              </p>
              <div style={{ marginTop: 16 }}>
                <span style={{ fontSize: 12, color: "#bbb" }}>Publication in:</span><br />
                <span style={{ fontSize: 13, color: "#C9A84C", fontWeight: 500 }}>{publication}</span>
              </div>
            </div>

          </div>
        </div>

        <div style={{ borderTop: "1px solid #1A2E50", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 14.5, color: "#aaa", marginLeft: 0 }}>© 2026 University of Ghana · Department of Computer Science · All rights reserved.</p>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <p style={{ fontSize: 14.5, color: "#aaa" }}>Registration Fee: GHS 100 · Hybrid Event · 27–29 Aug 2026</p>
            <Link to={getRoutePath("admin")} style={{
              background: "none", border: "none", color: "#aaa", fontSize: 14.5,
              cursor: "pointer", padding: 0, textDecoration: "underline",
            }}>Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
