import { Check } from "lucide-react";
import { useAdminContext } from "../../../context/AdminContext";

export default function SubmissionsPanel() {
  const { siteContent, updateContent } = useAdminContext();
  const submissions = siteContent.submissions as any[];
  const onChange = (v: unknown) => updateContent("submissions", v);
  const setStatus = (id, status) =>
    onChange(submissions.map((s) => (s.id === id ? { ...s, status } : s)));

  const statusColor = {
    Accepted: "#1B6B3A",
    "Under Review": "#b5700a",
    Rejected: "#c0392b",
  };
  const statusBg = {
    Accepted: "#e3f5eb",
    "Under Review": "#fdf3e0",
    Rejected: "#fdecea",
  };

  return (
    <div>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>
        Submissions
      </h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>
        {submissions.length} total ·{" "}
        {submissions.filter((s) => s.status === "Accepted").length} accepted
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {submissions.map((s) => (
          <div
            key={s.id}
            className="card"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              alignItems: "start",
              gap: 20,
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>
                {s.title}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <span className="badge badge-navy" style={{ fontSize: 11 }}>
                  {s.category}
                </span>
                <span style={{ fontSize: 13, color: "#666" }}>
                  by {s.author}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 12,
                    background: statusBg[s.status],
                    color: statusColor[s.status],
                  }}
                >
                  {s.status}
                </span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                justifyContent: "flex-end",
              }}
            >
              {s.status !== "Accepted" && (
                <button
                  onClick={() => setStatus(s.id, "Accepted")}
                  style={{
                    background: "#e3f5eb",
                    color: "#1B6B3A",
                    border: "1px solid #a8d5b8",
                    borderRadius: 8,
                    padding: "6px 14px",
                    fontSize: 13,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Check size={14} /> Accept
                  </span>
                </button>
              )}
              {s.status !== "Under Review" && (
                <button
                  onClick={() => setStatus(s.id, "Under Review")}
                  style={{
                    background: "#fdf3e0",
                    color: "#b5700a",
                    border: "1px solid #e8d5a0",
                    borderRadius: 8,
                    padding: "6px 14px",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  In Review
                </button>
              )}
              {s.status !== "Rejected" && (
                <button
                  onClick={() => setStatus(s.id, "Rejected")}
                  style={{
                    background: "#fdecea",
                    color: "#c0392b",
                    border: "1px solid #f5b7b1",
                    borderRadius: 8,
                    padding: "6px 14px",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Reject
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
