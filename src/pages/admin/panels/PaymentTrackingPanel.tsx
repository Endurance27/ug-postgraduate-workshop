import { useState } from "react";
import {
  Check,
  X,
  Trash2,
  Download,
  Plus,
  Eye,
  Search,
  ChevronUp,
  ChevronDown,
  CreditCard,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useAdminContext } from "../../../context/AdminContext";

export default function PaymentTrackingPanel() {
  const { siteContent, updateContent } = useAdminContext();
  const payments = (siteContent.payments as any[]) || [];
  const fee = (siteContent.event as any)?.fee || 100;
  const onChange = (v: unknown) => updateContent("payments", v);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    programme: "",
    studentId: "",
    transactionId: "",
    amount: fee,
    method: "mobile_money",
    date: "",
    status: "Confirmed",
  });

  /* ── stats ── */
  const confirmed = payments.filter((p) => p.status === "Confirmed");
  const pending = payments.filter((p) => p.status === "Pending");
  const totalAmount = payments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const confirmedAmt = confirmed.reduce(
    (s, p) => s + (Number(p.amount) || 0),
    0,
  );
  const pendingAmt = pending.reduce((s, p) => s + (Number(p.amount) || 0), 0);

  const fmt = (n) => n.toLocaleString("en-GH");

  /* ── sort + filter ── */
  const toggle = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const visible = payments
    .filter((p) => filter === "All" || p.status === filter)
    .filter((p) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        (p.transactionId || "").toLowerCase().includes(q) ||
        (p.studentId || "").toLowerCase().includes(q) ||
        (p.name || "").toLowerCase().includes(q) ||
        (p.email || "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      let va = a[sortKey],
        vb = b[sortKey];
      if (sortKey === "date") {
        va = new Date(va || 0);
        vb = new Date(vb || 0);
      }
      if (sortKey === "amount") {
        va = Number(va);
        vb = Number(vb);
      }
      return sortDir === "asc" ? (va > vb ? 1 : -1) : va < vb ? 1 : -1;
    });

  /* ── helpers ── */
  const fmtDate = (d) => {
    if (!d) return "—";
    const dt = new Date(d);
    return (
      dt.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) +
      " " +
      dt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    );
  };

  const exportCSV = () => {
    const header =
      "Transaction ID,Student ID,Name,Email,Programme,Amount (GHS),Method,Date,Status";
    const rows = payments.map((p) =>
      [
        p.transactionId,
        p.studentId,
        p.name,
        p.email,
        p.programme,
        p.amount,
        p.method,
        fmtDate(p.date),
        p.status,
      ]
        .map((v) => `"${v || ""}"`)
        .join(","),
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: "payments.csv",
    });
    a.click();
    URL.revokeObjectURL(url);
  };

  const addPayment = () => {
    if (!addForm.name.trim() || !addForm.transactionId.trim()) return;
    const newRec = {
      ...addForm,
      id: Date.now(),
      date: addForm.date || new Date().toISOString(),
    };
    onChange([newRec, ...payments]);
    setAddForm({
      name: "",
      email: "",
      programme: "",
      studentId: "",
      transactionId: "",
      amount: fee,
      method: "mobile_money",
      date: "",
      status: "Confirmed",
    });
    setShowAdd(false);
  };

  const updateStatus = (id, status) =>
    onChange(payments.map((p) => (p.id === id ? { ...p, status } : p)));

  const removePayment = (id) => onChange(payments.filter((p) => p.id !== id));

  const SortIcon = ({ k }) => {
    if (sortKey !== k)
      return <span style={{ color: "#ccc", fontSize: 11 }}>↕</span>;
    return sortDir === "asc" ? (
      <ChevronUp size={13} color="#1B3A6B" />
    ) : (
      <ChevronDown size={13} color="#1B3A6B" />
    );
  };

  const methodBadge = (m) => (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: m === "card" ? "#E5EAF3" : "#e8f5ee",
        color: m === "card" ? "#1B3A6B" : "#1B6B3A",
        fontSize: 11,
        fontWeight: 600,
        padding: "4px 10px",
        borderRadius: 20,
        whiteSpace: "nowrap",
        minWidth: 100,
        textAlign: "center",
      }}
    >
      {m === "card" ? "Card" : "Mobile Money"}
    </span>
  );

  const statusBadge = (s) => (
    <span
      style={{
        background: s === "Confirmed" ? "#e8f5ee" : "#fdf3e0",
        color: s === "Confirmed" ? "#1B6B3A" : "#b5700a",
        fontSize: 11,
        fontWeight: 700,
        padding: "3px 10px",
        borderRadius: 20,
      }}
    >
      {s}
    </span>
  );

  /* ── STAT CARDS ── */
  const cards = [
    {
      label: "Total Transactions",
      value: payments.length,
      sub: null,
      icon: <CreditCard size={22} color="#1B3A6B" />,
      iconBg: "#E5EAF3",
    },
    {
      label: "Total Amount",
      value: `GH₵ ${fmt(totalAmount)}`,
      sub: null,
      icon: <TrendingUp size={22} color="#1B6B3A" />,
      iconBg: "#e8f5ee",
    },
    {
      label: "Confirmed Payments",
      value: confirmed.length,
      sub: `GH₵ ${fmt(confirmedAmt)}`,
      subColor: "#1B6B3A",
      icon: <CheckCircle2 size={22} color="#1B6B3A" />,
      iconBg: "#e8f5ee",
    },
    {
      label: "Pending Payments",
      value: pending.length,
      sub: `GH₵ ${fmt(pendingAmt)}`,
      subColor: "#b5700a",
      icon: <AlertTriangle size={22} color="#b5700a" />,
      iconBg: "#fdf3e0",
    },
  ];

  return (
    <div>
      {/* Header */}
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
            Payment Tracking
          </h2>
          <p style={{ color: "#666", fontSize: 14 }}>
            Monitor and manage all transaction records
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={exportCSV}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#fff",
              color: "#1B3A6B",
              border: "1.5px solid #b0bdd8",
              borderRadius: 8,
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            onClick={() => setShowAdd((s) => !s)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#1B3A6B",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Plus size={14} /> Add Payment
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {cards.map((c, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              border: "1px solid #e8eaf0",
              borderRadius: 14,
              padding: "20px 22px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>
                {c.label}
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#0F2347",
                  fontFamily: "Playfair Display, serif",
                }}
              >
                {c.value}
              </div>
              {c.sub && (
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: c.subColor,
                    marginTop: 4,
                  }}
                >
                  {c.sub}
                </div>
              )}
            </div>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: c.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {c.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Add payment form */}
      {showAdd && (
        <div
          className="card"
          style={{ marginBottom: 20, border: "2px solid #C9A84C" }}
        >
          <h4
            style={{ marginBottom: 16, fontFamily: "Playfair Display, serif" }}
          >
            Add Manual Payment Record
          </h4>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                value={addForm.name}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. Kwame Asante"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={addForm.email}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, email: e.target.value }))
                }
                placeholder="e.g. kwame@ug.edu.gh"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Transaction ID *</label>
              <input
                value={addForm.transactionId}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, transactionId: e.target.value }))
                }
                placeholder="e.g. UGPGW2026-PAY-..."
              />
            </div>
            <div className="form-group">
              <label>Student ID</label>
              <input
                value={addForm.studentId}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, studentId: e.target.value }))
                }
                placeholder="e.g. 10823456"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Amount (GHS)</label>
              <input
                type="number"
                value={addForm.amount}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, amount: Number(e.target.value) }))
                }
              />
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <select
                value={addForm.method}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, method: e.target.value }))
                }
              >
                <option value="mobile_money">Mobile Money</option>
                <option value="card">Card</option>
                <option value="cash">Cash</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={addForm.status}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, status: e.target.value }))
                }
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button className="btn-primary" onClick={addPayment}>
              <span
                style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                <Check size={14} /> Save Record
              </span>
            </button>
            <button
              onClick={() => setShowAdd(false)}
              style={{
                background: "#f0f0f0",
                border: "none",
                borderRadius: 8,
                padding: "9px 16px",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search + filter */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 20,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative", flex: 1, minWidth: 240 }}>
          <Search
            size={15}
            color="#aaa"
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by transaction ID, name, email, booking code…"
            style={{
              width: "100%",
              paddingLeft: 36,
              paddingRight: 12,
              paddingTop: 9,
              paddingBottom: 9,
              border: "1.5px solid #ddd",
              borderRadius: 10,
              fontSize: 13,
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["All", "Confirmed", "Pending"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? "#1B3A6B" : "#fff",
                color: filter === f ? "#fff" : "#555",
                border: "1.5px solid #ddd",
                borderRadius: 20,
                padding: "6px 16px",
                fontSize: 13,
                cursor: "pointer",
                fontWeight: filter === f ? 600 : 400,
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e0e0e0",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr
                style={{
                  background: "#f8f9fa",
                  borderBottom: "1px solid #eee",
                }}
              >
                {[
                  { label: "Transaction ID", key: "transactionId" },
                  { label: "Student ID", key: "studentId" },
                  { label: "Name", key: "name" },
                  { label: "Payment Date", key: "date" },
                  { label: "Amount (GHS)", key: "amount" },
                  { label: "Method", key: "method" },
                  { label: "Status", key: "status" },
                  { label: "", key: null },
                ].map((col, i) => (
                  <th
                    key={i}
                    onClick={col.key ? () => toggle(col.key) : undefined}
                    style={{
                      padding: "13px 16px",
                      textAlign: "left",
                      fontWeight: 600,
                      fontSize: 12,
                      color: "#555",
                      whiteSpace: "nowrap",
                      cursor: col.key ? "pointer" : "default",
                      userSelect: "none",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      {col.label} {col.key && <SortIcon k={col.key} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "#888",
                    }}
                  >
                    No payment records found.
                  </td>
                </tr>
              )}
              {visible.map((p, i) => (
                <tr
                  key={p.id}
                  style={{
                    borderBottom: "1px solid #f5f5f5",
                    background: i % 2 === 0 ? "#fff" : "#fafafa",
                  }}
                >
                  <td style={{ padding: "13px 16px", maxWidth: 200 }}>
                    <span
                      style={{
                        color: "#1B3A6B",
                        fontFamily: "monospace",
                        fontSize: 11,
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      onClick={() => setSelected(p)}
                    >
                      {(p.transactionId || "—").slice(0, 28)}
                      {(p.transactionId || "").length > 28 ? "…" : ""}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "13px 16px",
                      color: "#555",
                      fontWeight: 500,
                    }}
                  >
                    {p.studentId || "—"}
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ fontWeight: 500 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "#888" }}>{p.email}</div>
                  </td>
                  <td
                    style={{
                      padding: "13px 16px",
                      color: "#555",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div>
                      {p.date
                        ? new Date(p.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </div>
                    <div style={{ fontSize: 11, color: "#aaa" }}>
                      {p.date
                        ? new Date(p.date).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "13px 16px",
                      fontWeight: 700,
                      color: "#0F2347",
                    }}
                  >
                    GH₵ {fmt(Number(p.amount) || 0)}
                  </td>
                  <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                    {methodBadge(p.method)}
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    {statusBadge(p.status)}
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <button
                      onClick={() => setSelected(p)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        background: "#f4f6fb",
                        color: "#1B3A6B",
                        border: "1px solid #b0bdd8",
                        borderRadius: 8,
                        padding: "5px 12px",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      <Eye size={13} /> View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          style={{
            padding: "12px 20px",
            borderTop: "1px solid #eee",
            fontSize: 12,
            color: "#888",
          }}
        >
          Showing {visible.length} of {payments.length} records
        </div>
      </div>

      {/* Details modal */}
      {selected && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 32,
              maxWidth: 520,
              width: "100%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <h3 style={{ fontFamily: "Playfair Display, serif", margin: 0 }}>
                Payment Details
              </h3>
              <button
                onClick={() => setSelected(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#888",
                }}
              >
                <X size={20} />
              </button>
            </div>

            {[
              [
                "Transaction ID",
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: 12,
                    wordBreak: "break-all",
                  }}
                >
                  {selected.transactionId}
                </span>,
              ],
              ["Student ID", selected.studentId || "—"],
              ["Full Name", selected.name],
              ["Email", selected.email],
              ["Programme", selected.programme],
              ["Amount", `GH₵ ${fmt(Number(selected.amount) || 0)}`],
              [
                "Payment Method",
                selected.method === "card"
                  ? "Debit / Credit Card"
                  : "Mobile Money",
              ],
              ["Date & Time", fmtDate(selected.date)],
            ].map(([label, val]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom: "1px solid #f0f0f0",
                  fontSize: 14,
                }}
              >
                <span style={{ color: "#666", flexShrink: 0, marginRight: 16 }}>
                  {label}
                </span>
                <span style={{ fontWeight: 500, textAlign: "right" }}>
                  {val}
                </span>
              </div>
            ))}

            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
                Update Status
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => {
                    updateStatus(selected.id, "Confirmed");
                    setSelected((p) => ({ ...p, status: "Confirmed" }));
                  }}
                  style={{
                    flex: 1,
                    background:
                      selected.status === "Confirmed" ? "#e8f5ee" : "#f5f5f5",
                    color: selected.status === "Confirmed" ? "#1B6B3A" : "#555",
                    border: `1.5px solid ${selected.status === "Confirmed" ? "#a8d5b8" : "#ddd"}`,
                    borderRadius: 8,
                    padding: "9px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <Check size={14} /> Confirmed
                  </span>
                </button>
                <button
                  onClick={() => {
                    updateStatus(selected.id, "Pending");
                    setSelected((p) => ({ ...p, status: "Pending" }));
                  }}
                  style={{
                    flex: 1,
                    background:
                      selected.status === "Pending" ? "#fdf3e0" : "#f5f5f5",
                    color: selected.status === "Pending" ? "#b5700a" : "#555",
                    border: `1.5px solid ${selected.status === "Pending" ? "#e8d5a0" : "#ddd"}`,
                    borderRadius: 8,
                    padding: "9px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <AlertTriangle size={14} /> Pending
                  </span>
                </button>
                <button
                  onClick={() => {
                    removePayment(selected.id);
                    setSelected(null);
                  }}
                  style={{
                    background: "#fdecea",
                    color: "#c0392b",
                    border: "1px solid #f5b7b1",
                    borderRadius: 8,
                    padding: "9px 14px",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
