import { ToggleRow } from "./shared";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function OverviewPanel({ siteContent, updateContent }: { siteContent: { [key: string]: any }; updateContent: (section: string | Record<string, unknown>, value?: unknown) => void }) {
  const event = siteContent.event || {};
  const participants = siteContent.participants || [];
  const submissions = siteContent.submissions || [];
  const confirmed = participants.filter((p) => p.payment === "Confirmed").length;
  const pending = participants.filter((p) => p.payment === "Pending").length;
  const accepted = submissions.filter((s) => s.status === "Accepted").length;

  return (
    <div>
      <h2
        style={{
          marginBottom: 6,
          fontFamily: "Playfair Display, serif",
        }}
      >
        Dashboard
      </h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 28 }}>
        {event.edition} · {event.dates}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
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
            style={{
              background: s.bg,
              borderRadius: 12,
              padding: "18px 20px",
              border: `1px solid ${s.color}20`,
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: s.color,
                fontWeight: 500,
                marginBottom: 4,
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: 28,
                fontWeight: 700,
                color: s.color,
              }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
        }}
      >
        <div className="card">
          <h4
            style={{
              marginBottom: 14,
              fontFamily: "Playfair Display, serif",
            }}
          >
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
          <h4
            style={{
              marginBottom: 14,
              fontFamily: "Playfair Display, serif",
            }}
          >
            Recent Registrations
          </h4>
          {participants.slice(0, 4).map((p) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 0",
                borderBottom: "1px solid #f5f5f5",
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>
                  {p.name}
                </div>
                <div style={{ fontSize: 11, color: "#888" }}>
                  {p.programme}
                </div>
              </div>
              <span
                className={`badge ${p.payment === "Confirmed" ? "badge-green" : "badge-red"}`}
                style={{ fontSize: 11 }}
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
