import { ToggleRow } from "./shared";
import { useAdminContext } from "../../../context/AdminContext";

export default function OverviewPanel() {
  const { siteContent, updateContent } = useAdminContext();
  const event = siteContent.event || {};
  const participants = siteContent.participants || [];
  const submissions = siteContent.submissions || [];
  const confirmed = participants.filter((p) => p.payment === "Confirmed").length;
  const pending = participants.filter((p) => p.payment === "Pending").length;
  const accepted = submissions.filter((s) => s.status === "Accepted").length;

  return (
    <div>
      <h2 className="mb-[6px] font-serif">
        Dashboard
      </h2>
      <p className="text-[#666] text-sm mb-7">
        {event.edition} · {event.dates}
      </p>

      <div
        className="grid gap-4 mb-8"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}
      >
        {[
          {
            label: "Total Registered",
            value: participants.length,
            color: "#0F2347",
            bg: "#e8edf6",
          },
          {
            label: "Payments Confirmed",
            value: confirmed,
            color: "#1B6B3A",
            bg: "#e3f5eb",
          },
          {
            label: "Payments Pending",
            value: pending,
            color: "#c0392b",
            bg: "#fdecea",
          },
          {
            label: "Submissions",
            value: submissions.length,
            color: "#7b1fa2",
            bg: "#f5e8fa",
          },
          {
            label: "Accepted Papers",
            value: accepted,
            color: "#b5700a",
            bg: "#fdf3e0",
          },
          {
            label: "Revenue (GHS)",
            value: confirmed * (event.fee || 0),
            color: "#1B3A6B",
            bg: "#E5EAF3",
          },
        ].map((s, i) => (
          <div
            key={i}
            className="rounded-xl py-[18px] px-5"
            style={{
              background: s.bg,
              border: `1px solid ${s.color}20`,
            }}
          >
            <div
              className="text-xs font-medium mb-1"
              style={{ color: s.color }}
            >
              {s.label}
            </div>
            <div
              className="font-serif text-[28px] font-bold"
              style={{ color: s.color }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="card">
          <h4 className="mb-[14px] font-serif">
            Quick Toggles
          </h4>
          <ToggleRow
            label="Registration"
            desc="Allow new participants to register"
            value={event.registrationOpen}
            onChange={(v) =>
              updateContent("event", { ...event, registrationOpen: v })
            }
          />
          <ToggleRow
            label="Submissions"
            desc="Allow paper submissions"
            value={event.submissionsOpen}
            onChange={(v) =>
              updateContent("event", { ...event, submissionsOpen: v })
            }
          />
        </div>
        <div className="card">
          <h4 className="mb-[14px] font-serif">
            Recent Registrations
          </h4>
          {participants.slice(0, 4).map((p) => (
            <div
              key={p.id}
              className="flex justify-between items-center py-2 border-b border-[#f5f5f5]"
            >
              <div>
                <div className="text-[13px] font-medium">
                  {p.name}
                </div>
                <div className="text-[11px] text-[#888]">
                  {p.programme}
                </div>
              </div>
              <span
                className={`badge ${p.payment === "Confirmed" ? "badge-green" : "badge-red"} text-[11px]`}
              >
                {p.payment}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
