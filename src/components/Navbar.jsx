import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { navRoutes } from "../routes.js";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const links = navRoutes;

  return (
    <nav
      style={{
        background: "#fff",
        borderBottom: "1px solid #e0e0e0",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
          paddingLeft: 16,
          paddingRight: 24,
        }}
      >
        <NavLink
          to="/"
          className="nav-logo"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
          }}
          onClick={() => setOpen(false)}
        >
          <svg
            viewBox="0 0 430 60"
            style={{ height: 44, width: "auto", display: "block" }}
            xmlns="http://www.w3.org/2000/svg"
            aria-label="University of Ghana — Department of Computer Science"
          >
            <image
              href="/ug-logo.svg"
              x="0"
              y="0"
              width="193"
              height="60"
              preserveAspectRatio="xMidYMid meet"
            />
            <line
              x1="201"
              y1="8"
              x2="201"
              y2="52"
              stroke="#1B3A6B"
              strokeWidth="1.5"
            />
            <text
              x="210"
              y="23"
              fontFamily="Arial, Helvetica, sans-serif"
              fontWeight="700"
              fontSize="20"
              fill="#1B3A6B"
              letterSpacing="0.5"
            >
              DEPARTMENT OF
            </text>
            <text
              x="210"
              y="50"
              fontFamily="Arial, Helvetica, sans-serif"
              fontWeight="700"
              fontSize="20"
              fill="#1B3A6B"
              letterSpacing="0.5"
            >
              COMPUTER SCIENCE
            </text>
          </svg>
        </NavLink>

        {/* Desktop nav */}
        <div
          style={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            marginRight: 20,
          }}
          className="nav-links"
        >
          {links.map((l) =>
            l.gold ? (
              <NavLink
                key={l.key}
                to={l.path}
                onClick={() => setOpen(false)}
                style={{
                  background: "#C9A84C",
                  color: "#0F2347",
                  border: "none",
                  padding: "6px 13px",
                  borderRadius: 7,
                  fontSize: 16,
                  fontWeight: 700,
                  margin: "0 4px",
                  cursor: "pointer",
                  transition: "background 0.2s",
                  whiteSpace: "nowrap",
                  textDecoration: "none",
                }}
              >
                {l.label}
              </NavLink>
            ) : (
              <NavLink
                key={l.key}
                to={l.path}
                end={l.index}
                onClick={() => setOpen(false)}
                style={({ isActive }) => ({
                  background: isActive ? "#E5EAF3" : "none",
                  border: "none",
                  padding: "5px 8px",
                  borderRadius: 6,
                  fontSize: 16,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#1B3A6B" : "#444",
                  transition: "all 0.15s",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  textDecoration: "none",
                })}
              >
                {l.label}
              </NavLink>
            ),
          )}
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            fontSize: 26,
            cursor: "pointer",
            color: "#1B3A6B",
            padding: "4px 8px",
            lineHeight: 1,
          }}
          className="hamburger"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div
          className="mobile-menu"
          style={{
            background: "#fff",
            borderTop: "1px solid #eee",
            padding: "12px 0 20px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          }}
        >
          <div className="container">
            {links.map((l) =>
              l.gold ? (
                <NavLink
                  key={l.key}
                  to={l.path}
                  onClick={() => setOpen(false)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "center",
                    background: "#C9A84C",
                    color: "#0F2347",
                    border: "none",
                    padding: "12px",
                    borderRadius: 8,
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: "pointer",
                    margin: "6px 0",
                    textDecoration: "none",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    {l.label}
                    <ArrowRight size={14} />
                  </span>
                </NavLink>
              ) : (
                <NavLink
                  key={l.key}
                  to={l.path}
                  end={l.index}
                  onClick={() => setOpen(false)}
                  style={({ isActive }) => ({
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    background: isActive ? "#E5EAF3" : "none",
                    border: "none",
                    padding: "12px 16px",
                    borderRadius: 8,
                    fontSize: 16,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#1B3A6B" : "#333",
                    cursor: "pointer",
                    marginBottom: 2,
                    textDecoration: "none",
                  })}
                >
                  {l.label}
                </NavLink>
              ),
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .nav-links { display: none !important; }
          .hamburger { display: block !important; }
        }
        @media (max-width: 480px) {
          .nav-logo svg { height: 34px !important; }
        }
      `}</style>
    </nav>
  );
}
