import { useState } from "react";
import { Download } from "lucide-react";

export default function ParticipantsPanel({ participants, onChange }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const setPayment = (id, status) =>
    onChange(
      participants.map((p) => (p.id === id ? { ...p, payment: status } : p)),
    );

  const exportCSV = () => {
    const header = "Name,Email,Programme,Type,Mode,Payment";
    const rows = participants.map((p) =>
      [p.name, p.email, p.programme, p.type, p.mode, p.payment]
        .map((v) => `"${v}"`)
        .join(","),
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "participants.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = participants
    .filter((p) => filter === "All" || p.payment === filter)
    .filter(
      (p) =>
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase()),
    );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h2
            style={{ marginBottom: 4, fontFamily: "Playfair Display, serif" }}
          >
            Participants
          </h2>
          <p style={{ color: "#666", fontSize: 14 }}>
            {participants.length} registered ·{" "}
            {participants.filter((p) => p.payment === "Confirmed").length}{" "}
            confirmed
          </p>
        </div>
        <button
          onClick={exportCSV}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "#1B3A6B",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "9px 18px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <Download size={14} /> Export CSV
          </span>
        </button>
      </div>

      <div
        style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          style={{
            flex: 1,
            minWidth: 220,
            padding: "8px 14px",
            border: "1.5px solid #ddd",
            borderRadius: 8,
            fontSize: 14,
          }}
        />
        <div style={{ display: "flex", gap: 6 }}>
          {["All", "Confirmed", "Pending"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? "#1B3A6B" : "#fff",
                color: filter === f ? "#fff" : "#555",
                border: "1px solid #ddd",
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #e0e0e0",
          overflowX: "auto",
        }}
      >
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr style={{ background: "#f8f9fa" }}>
              {["Name", "Email", "Programme", "Mode", "Payment", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontWeight: 600,
                      color: "#555",
                      borderBottom: "1px solid #eee",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                <td style={{ padding: "12px 16px", fontWeight: 500 }}>
                  {p.name}
                </td>
                <td style={{ padding: "12px 16px", color: "#666" }}>
                  {p.email}
                </td>
                <td style={{ padding: "12px 16px", color: "#555" }}>
                  {p.programme}
                </td>
                <td style={{ padding: "12px 16px" }}>{p.mode}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span
                    className={`badge ${p.payment === "Confirmed" ? "badge-green" : "badge-red"}`}
                  >
                    {p.payment}
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {p.payment !== "Confirmed" && (
                      <button
                        onClick={() => setPayment(p.id, "Confirmed")}
                        style={{
                          background: "#e3f5eb",
                          color: "#1B6B3A",
                          border: "1px solid #a8d5b8",
                          borderRadius: 6,
                          padding: "4px 10px",
                          fontSize: 11,
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        Confirm
                      </button>
                    )}
                    {p.payment !== "Pending" && (
                      <button
                        onClick={() => setPayment(p.id, "Pending")}
                        style={{
                          background: "#fdecea",
                          color: "#c0392b",
                          border: "1px solid #f5b7b1",
                          borderRadius: 6,
                          padding: "4px 10px",
                          fontSize: 11,
                          cursor: "pointer",
                        }}
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "32px",
              color: "#888",
              fontSize: 14,
            }}
          >
            No participants match the current filter.
          </div>
        )}
      </div>
    </div>
  );
}
