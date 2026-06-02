import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { navRoutes } from "../routes.js";

// ─── Component ───────────────────────────────────────────────────────────────
export default function Navbar() {
  const [open, setOpen] = useState<boolean>(false);
  const links = navRoutes;

  return (
    <nav className="bg-white border-b border-[#e0e0e0] sticky top-0 z-[100] shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between h-16 pl-4 pr-6">
        <NavLink
          to="/"
          className="nav-logo bg-transparent border-0 cursor-pointer p-0 flex items-center"
          onClick={() => setOpen(false)}
        >
          <svg
            viewBox="0 0 430 60"
            className="h-11 w-auto block"
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
        <div className="nav-links flex gap-px items-center mr-5">
          {links.map((l) =>
            l.gold ? (
              <NavLink
                key={l.key}
                to={l.path}
                onClick={() => setOpen(false)}
                className="bg-ug-gold text-ug-navy border-0 py-[6px] px-[13px] rounded-[7px] text-base font-bold mx-1 cursor-pointer transition-[background] duration-200 whitespace-nowrap no-underline"
              >
                {l.label}
              </NavLink>
            ) : (
              <NavLink
                key={l.key}
                to={l.path}
                end={l.index}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  [
                    "border-0 py-[5px] px-2 rounded-[6px] text-base transition-all duration-150 cursor-pointer whitespace-nowrap no-underline",
                    isActive
                      ? "bg-ug-blue-light font-semibold text-ug-blue"
                      : "bg-transparent font-normal text-[#444]",
                  ].join(" ")
                }
              >
                {l.label}
              </NavLink>
            ),
          )}
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="hamburger hidden bg-transparent border-0 text-[26px] cursor-pointer text-ug-blue py-1 px-2 leading-none"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div
          className="mobile-menu bg-white border-t border-[#eee] py-3 pb-5 shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
        >
          <div className="container">
            {links.map((l) =>
              l.gold ? (
                <NavLink
                  key={l.key}
                  to={l.path}
                  onClick={() => setOpen(false)}
                  className="block w-full text-center bg-ug-gold text-ug-navy border-0 p-3 rounded-lg text-base font-bold cursor-pointer my-[6px] no-underline"
                >
                  <span className="inline-flex items-center gap-[6px]">
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
                  className={({ isActive }) =>
                    [
                      "block w-full text-left border-0 py-3 px-4 rounded-lg text-base cursor-pointer mb-[2px] no-underline",
                      isActive
                        ? "bg-ug-blue-light font-semibold text-ug-blue"
                        : "bg-transparent font-normal text-[#333]",
                    ].join(" ")
                  }
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
