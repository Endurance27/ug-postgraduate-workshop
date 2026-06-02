import { useState } from "react";
import { Radio, Video, MessageCircle, RefreshCw, ArrowRight, Megaphone } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface StreamScheduleItem {
  time: string;
  title: string;
}

interface StreamDay {
  day: string;
  date: string;
  color: string;
  idKey: string;
  schedule: StreamScheduleItem[];
  youtubeId?: string;
}

interface StreamData {
  live?: boolean;
  note?: string;
  day1Id?: string;
  day2Id?: string;
  day3Id?: string;
  [key: string]: string | boolean | undefined;
}

interface EventData {
  edition?: string;
  dates?: string;
}

interface LiveStreamPageProps {
  event?: EventData;
  navigate?: (page: string) => void;
  stream?: StreamData;
}

const BASE_DAYS = [
  {
    day: "Day 1", date: "Thursday, 27 August 2026", color: "#1B3A6B",
    idKey: "day1Id",
    schedule: [
      { time: "8:00 AM",  title: "Registration & Check-in"                   },
      { time: "9:00 AM",  title: "Opening Ceremony & Welcome Address"         },
      { time: "9:45 AM",  title: "Keynote Address"                            },
      { time: "11:00 AM", title: "Coffee Break & Networking"                  },
      { time: "11:30 AM", title: "Parallel Track Sessions — Morning Block"    },
      { time: "1:00 PM",  title: "Lunch Break"                                },
      { time: "2:00 PM",  title: "Parallel Track Sessions — Afternoon Block"  },
      { time: "4:00 PM",  title: "Day 1 Wrap-up & Announcements"              },
    ],
  },
  {
    day: "Day 2", date: "Friday, 28 August 2026", color: "#C9A84C",
    idKey: "day2Id",
    schedule: [
      { time: "8:30 AM",  title: "Morning Briefing"                           },
      { time: "9:00 AM",  title: "Poster Presentation Session"                },
      { time: "10:30 AM", title: "Technical Paper Session"                    },
      { time: "11:00 AM", title: "Coffee Break"                               },
      { time: "11:30 AM", title: "Panel Discussion: Research & Industry"      },
      { time: "1:00 PM",  title: "Lunch Break"                                },
      { time: "2:00 PM",  title: "Short Paper Session — CS & Data Science"    },
      { time: "4:00 PM",  title: "IT for Business Observation Sessions"        },
    ],
  },
  {
    day: "Day 3", date: "Saturday, 29 August 2026", color: "#7b1fa2",
    idKey: "day3Id",
    schedule: [
      { time: "8:30 AM",  title: "Morning Briefing & Final Day Orientation"   },
      { time: "9:00 AM",  title: "Regular Paper Session — Final Presentations"},
      { time: "10:30 AM", title: "Coffee Break"                               },
      { time: "11:00 AM", title: "Judges' Deliberation (Closed)"              },
      { time: "12:00 PM", title: "Lunch Break"                                },
      { time: "1:30 PM",  title: "Awards Ceremony & Announcement"             },
      { time: "3:00 PM",  title: "Closing Ceremony & Group Photo"             },
    ],
  },
];

export default function LiveStreamPage({ event, navigate, stream = {} }: LiveStreamPageProps) {
  const isLive = stream.live || false;
  const [activeDay, setActiveDay] = useState<number>(0);
  const STREAM_DAYS: StreamDay[] = BASE_DAYS.map(d => ({ ...d, youtubeId: (stream[d.idKey] as string) || "" }));
  const current = STREAM_DAYS[activeDay];

  return (
    <main>
      {/* HERO */}
      <section
        className="relative overflow-hidden text-white py-[72px] pb-14"
        style={{ background: "linear-gradient(135deg, #0F2347, #1B3A6B)" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: "url('/images/workshop-sessions.jpg')" }}
        />
        <div className="container relative z-10">
          <span
            className="badge inline-flex items-center gap-[7px] mb-[14px]"
            style={{
              background: isLive ? "rgba(220,50,50,0.35)" : "rgba(201,168,76,0.25)",
              color: isLive ? "#ff6b6b" : "#C9A84C",
            }}
          >
            {isLive
              ? <><span className="w-2 h-2 rounded-full bg-[#ff4444] inline-block animate-pulse" />LIVE NOW</>
              : <><Radio size={14} className="mr-[5px]" />Live Stream · Aug 2026</>}
          </span>
          <h1 className="text-white font-serif text-[clamp(2rem,4.5vw,3rem)] mb-3">
            Live Stream
          </h1>
          <p className="text-white/75 text-base">
            Watch the {event?.edition || "2nd DCS Postgraduate Workshop"} live online · {event?.dates || "27–29 August 2026"}
          </p>
        </div>
      </section>

      <div className="container section">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 className="font-serif mb-1">2026 Workshop Live Stream</h2>
            <p className="text-[#666] text-sm">Stream links will be activated when each day goes live</p>
          </div>
          {isLive && (
            <span className="inline-flex items-center gap-2 bg-[#fdecea] text-[#c0392b] border-[1.5px] border-[#f5b7b1] rounded-lg px-4 py-[7px] text-[13px] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#c0392b] inline-block" />
              LIVE NOW
            </span>
          )}
        </div>

        {/* Day tabs — active bg/border are dynamic per-day color */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {STREAM_DAYS.map((d, i) => (
            <button
              key={i}
              onClick={() => setActiveDay(i)}
              className="rounded-lg px-[22px] py-2 text-[13px] font-semibold cursor-pointer transition-all duration-150"
              style={{
                background: activeDay === i ? d.color : "#fff",
                color: activeDay === i ? "#fff" : "#555",
                border: `2px solid ${activeDay === i ? d.color : "#ddd"}`,
              }}
            >{d.day}</button>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_280px] gap-6 items-start stream-grid">
          {/* Player */}
          <div>
            <div className="bg-[#0d1117] rounded-2xl overflow-hidden relative shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
              {current.youtubeId && isLive ? (
                <div className="relative pb-[56.25%] h-0">
                  <iframe
                    src={`https://www.youtube.com/embed/${current.youtubeId}?autoplay=1`}
                    title={`Live Stream ${current.day}`}
                    className="absolute top-0 left-0 w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="aspect-video flex flex-col items-center justify-center p-10">
                  <div className="mb-4 text-ug-gold"><Radio size={52} /></div>
                  <h3 className="text-white font-serif mb-2 text-center">
                    {current.day} Stream
                  </h3>
                  <p className="text-white/50 text-sm text-center max-w-[360px] leading-[1.75] mb-5">
                    Goes live on <strong className="text-ug-gold">{current.date}</strong>.<br />
                    Register to receive the stream link by email.
                  </p>
                  <div className="inline-flex items-center gap-2 rounded-lg px-[18px] py-[9px]"
                    style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)" }}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#555]" />
                    <span className="text-white/50 text-[13px]">Offline · Goes live {current.date}</span>
                  </div>
                </div>
              )}
              {/* Day label badge — dynamic color from data */}
              <div
                className="absolute top-3 left-3 rounded-md px-3 py-1 text-xs font-bold text-white pointer-events-none"
                style={{ background: current.color }}
              >{current.day}</div>
            </div>
            <div className="mt-3 px-4 py-3 bg-ug-surface rounded-[10px] text-[13px] text-[#666]">
              <strong className="text-ug-blue">{current.date}</strong> · Stream link sent to registered virtual participants before the event.
            </div>
            {stream.note && (
              <div className="mt-[10px] px-[18px] py-3 rounded-[10px] bg-[#fffbf0] border-[1.5px] border-[#e8c96e] text-[13px] text-[#7a5800] leading-relaxed">
                <span className="inline-flex items-center gap-1.5"><Megaphone size={16} /><strong>Notice:</strong></span> {stream.note}
              </div>
            )}
          </div>

          {/* Schedule sidebar — dynamic heading color from data */}
          <div className="card px-5 py-[18px]">
            <h4 className="font-serif mb-[14px] text-base" style={{ color: current.color }}>
              {current.day} Schedule
            </h4>
            {current.schedule.map((s, i) => (
              <div key={i}
                className={`flex gap-[10px] py-[9px] ${i < current.schedule.length - 1 ? "border-b border-[#f5f5f5]" : ""}`}
              >
                <span className="text-[11px] font-semibold text-[#888] whitespace-nowrap mt-0.5 min-w-[58px]">{s.time}</span>
                <span className="text-[13px] text-[#333] leading-snug">{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mt-8">
          {[
            { icon: <Radio size={24} />,          title: "Stream Link",  body: "Emailed to all registered virtual and hybrid participants before each day." },
            { icon: <Video size={24} />,          title: "YouTube Live", body: "No login required. Watch directly in your browser or on the YouTube app."   },
            { icon: <MessageCircle size={24} />,  title: "Live Q&A",     body: "Submit questions via YouTube chat during panel sessions and Q&A blocks."    },
            { icon: <RefreshCw size={24} />,      title: "Recordings",   body: "Session recordings made available to registered participants after each day."},
          ].map((c, i) => (
            <div key={i} className="card flex gap-[14px]">
              <span className="flex-shrink-0 text-ug-blue">{c.icon}</span>
              <div>
                <div className="font-semibold text-sm mb-1">{c.title}</div>
                <p className="text-[13px] text-[#666] leading-relaxed m-0">{c.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="alert alert-info mt-6 text-sm">
          <strong>Registration required:</strong> You must register as a virtual or hybrid participant to receive the stream link.{" "}
          {navigate && (
            <button onClick={() => navigate("register")} className="bg-transparent border-0 text-ug-blue font-semibold cursor-pointer p-0 text-sm">
              <span className="inline-flex items-center gap-1.5">Register now <ArrowRight size={14} /></span>
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(1.3); } }
        @media (max-width: 768px) { .stream-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </main>
  );
}
