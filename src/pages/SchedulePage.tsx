import {
  Calendar,
  Laptop,
  BarChart2,
  Settings,
  Briefcase,
  Layers,
  Printer,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Session {
  id?: number;
  time: string;
  title: string;
  type: string;
  track?: string;
  presenter?: string;
}

interface ScheduleDay {
  day: string;
  date: string;
  sessions: Session[];
}

interface SchedulePageProps {
  schedule: ScheduleDay[];
  images?: Record<string, string>;
}

const tracks = [
  {
    name: "CS Track",
    color: "#1B3A6B",
    bg: "#E5EAF3",
    desc: "MSc & MPhil Computer Science presentations",
  },
  {
    name: "Data Science Track",
    color: "#0F2347",
    bg: "#e8edf6",
    desc: "MSc & MPhil Data Science presentations",
  },
  {
    name: "Technical Track",
    color: "#b5700a",
    bg: "#fdf3e0",
    desc: "Applied & technical paper presentations",
  },
  {
    name: "IT for Business Track",
    color: "#7b1fa2",
    bg: "#f5e8fa",
    desc: "IT for Business observation & optional presentations",
  },
  {
    name: "Poster Track",
    color: "#c62828",
    bg: "#fdecea",
    desc: "Poster display and Q&A sessions",
  },
];
import { useState } from "react";

const typeStyle = {
  plenary: { bg: "#E5EAF3", color: "#1B3A6B", label: "Plenary" },
  parallel: { bg: "#e8edf6", color: "#0F2347", label: "Parallel Tracks" },
  track: { bg: "#fdf3e0", color: "#b5700a", label: "Track Session" },
  break: { bg: "#f5f5f5", color: "#777", label: "Break" },
};

export default function SchedulePage({
  schedule: days,
  images = {},
}: SchedulePageProps) {
  const heroPhotos = [
    {
      src: images.research || "/images/research-presentations.jpg",
      label: "Research Sessions",
    },
    {
      src: images.workshop || "/images/workshop-sessions.jpg",
      label: "Panel Discussions",
    },
    {
      src: images.networking || "/images/collaboration-networking.jpeg",
      label: "Networking",
    },
  ];
  const [filter, setFilter] = useState("All");

  const filterOptions = ["All", "Plenary", "Track Sessions", "Breaks"];

  const matchesFilter = (s: Session): boolean => {
    if (filter === "All") return true;
    if (filter === "Plenary")
      return s.type === "plenary" || s.type === "parallel";
    if (filter === "Track Sessions") return s.type === "track";
    if (filter === "Breaks") return s.type === "break";
    return true;
  };

  return (
    <main>
      {/* IMAGE-BACKED HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ug-navy to-ug-blue text-white py-[72px] pb-14">
        {/* Background image overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1644174547761-de211415598e?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        <div className="container relative z-10">
          <span
            className="badge inline-block mb-[14px]"
            style={{ background: "rgba(201,168,76,0.25)", color: "#C9A84C" }}
          >
            27–29 August 2026
          </span>
          <h1
            className="text-white font-serif mb-3"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)" }}
          >
            Workshop Schedule
          </h1>
          <p className="text-white/75 text-base mb-0">
            3-Day Programme · 27–29 August 2026 · Parallel Track Sessions
          </p>
        </div>
      </section>

      {/* PHOTO ROW */}
      <div className="photo-strip grid grid-cols-3 h-[220px] overflow-hidden">
        {heroPhotos.map((photo, idx) => (
          <div key={idx} className="relative overflow-hidden">
            <img
              src={photo.src}
              alt={photo.label}
              className="w-full h-full object-cover block"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(15,35,71,0.82)] flex items-end px-[18px] py-4">
              <span className="text-white text-[13px] font-bold tracking-[0.5px]">
                {photo.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="container section">
        {/* TRACK LEGEND */}
        <div className="mb-[52px]">
          <div className="mb-5">
            <span className="badge badge-blue inline-block mb-2">
              Parallel Tracks
            </span>
            <h3 className="m-0 text-[1.2rem] text-ug-blue">
              Presentation Tracks
            </h3>
          </div>
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            {[
              {
                name: "CS Track",
                color: "#1B3A6B",
                bg: "#E5EAF3",
                icon: <Laptop size={22} />,
                desc: "MSc & MPhil Computer Science presentations",
              },
              {
                name: "Data Science Track",
                color: "#0F2347",
                bg: "#e8edf6",
                icon: <BarChart2 size={22} />,
                desc: "MSc & MPhil Data Science presentations",
              },
              {
                name: "Technical Track",
                color: "#b5700a",
                bg: "#fdf3e0",
                icon: <Settings size={22} />,
                desc: "Applied & technical paper presentations",
              },
              {
                name: "IT for Business Track",
                color: "#7b1fa2",
                bg: "#f5e8fa",
                icon: <Briefcase size={22} />,
                desc: "IT for Business observation & optional presentations",
              },
              {
                name: "Poster Track",
                color: "#c62828",
                bg: "#fdecea",
                icon: <Layers size={22} />,
                desc: "Poster display and Q&A sessions",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="rounded-xl p-[18px_20px] flex items-start gap-[14px] shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-[box-shadow,transform] duration-200"
                style={{
                  background: t.bg,
                  borderLeft: `4px solid ${t.color}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 6px 20px ${t.color}22`;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 2px 10px rgba(0,0,0,0.05)";
                  e.currentTarget.style.transform = "none";
                }}
              >
                <span
                  className="flex-shrink-0 mt-0.5 flex items-center"
                  style={{ color: t.color }}
                >
                  {t.icon}
                </span>
                <div>
                  <div
                    className="font-bold text-[14px] mb-[5px]"
                    style={{ color: t.color }}
                  >
                    {t.name}
                  </div>
                  <div className="text-[13px] text-[#555] leading-[1.55]">
                    {t.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FILTER + ACTIONS */}
        <div className="flex justify-between items-center flex-wrap gap-3 mb-8">
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-[13px] text-[#888] mr-1">Show:</span>
            {filterOptions.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="border-[1.5px] border-[#ddd] rounded-3xl px-4 py-1.5 text-[13px] font-medium cursor-pointer transition-all duration-150"
                style={{
                  background: filter === f ? "#1B3A6B" : "#fff",
                  color: filter === f ? "#fff" : "#555",
                }}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <a
              href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("2026 DCS Postgradute Research Conference & Workshop")}&dates=20260827%2F20260830&details=${encodeURIComponent("2nd Annual DCS Postgraduate Research Workshop — Department of Computer Science, University of Ghana")}&location=${encodeURIComponent("University of Ghana, Legon")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 bg-ug-blue-light text-ug-blue border-[1.5px] border-[#c5d0e8] rounded-lg px-[14px] py-[7px] text-[13px] font-semibold no-underline transition-[background] duration-150"
            >
              <Calendar size={14} /> Add to Calendar
            </a>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 bg-white text-[#555] border-[1.5px] border-[#ddd] rounded-lg px-[14px] py-[7px] text-[13px] font-semibold cursor-pointer transition-[background] duration-150"
            >
              <Printer size={14} /> Print Programme
            </button>
          </div>
        </div>

        {/* DAYS */}
        {days.map((d, di) => (
          <div key={di} className="mb-12">
            <div className="bg-ug-navy text-white px-6 py-4 rounded-t-xl flex items-center gap-4">
              <span className="bg-ug-gold text-white rounded-lg px-[14px] py-1 font-bold text-[14px]">
                {d.day}
              </span>
              <span className="text-[15px] text-white/85">{d.date}</span>
            </div>
            <div className="border border-[#e0e0e0] border-t-0 rounded-b-xl overflow-hidden">
              {d.sessions.filter(matchesFilter).map((s, si) => {
                const ts = typeStyle[s.type as keyof typeof typeStyle];
                return (
                  <div
                    key={si}
                    className="session-row grid items-center px-5 py-[14px] gap-4"
                    style={{
                      gridTemplateColumns: "100px 1fr auto",
                      background: si % 2 === 0 ? "#fff" : "#fafafa",
                      borderBottom:
                        si < d.sessions.length - 1 ?
                          "1px solid #f0f0f0"
                        : "none",
                    }}
                  >
                    <div className="text-[13px] font-medium text-[#555] flex-shrink-0">
                      {s.time}
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold text-[#1a1a1a]">
                        {s.title}
                      </div>
                      {s.presenter && (
                        <div className="text-[12px] text-[#888] mt-0.5">
                          {s.presenter}
                        </div>
                      )}
                      {s.track && (
                        <span
                          className="inline-block mt-1 text-[11px] font-medium px-[10px] py-[2px] rounded-[20px]"
                          style={{
                            background:
                              tracks.find((t) => t.name === s.track)?.bg ||
                              "#eee",
                            color:
                              tracks.find((t) => t.name === s.track)?.color ||
                              "#333",
                          }}
                        >
                          {s.track}
                        </span>
                      )}
                    </div>
                    <span
                      className="text-[11px] font-semibold px-[10px] py-[3px] rounded-[20px] whitespace-nowrap"
                      style={{ background: ts.bg, color: ts.color }}
                    >
                      {ts.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="alert alert-info">
          <strong>Note:</strong> The schedule above is indicative and subject to
          change. Registered participants will receive confirmed session
          assignments and virtual links via email before the event.
        </div>
      </div>
    </main>
  );
}
