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
      return <span className="text-[#ccc] text-[11px]">↕</span>;
    return sortDir === "asc" ? (
      <ChevronUp size={13} color="#1B3A6B" />
    ) : (
      <ChevronDown size={13} color="#1B3A6B" />
    );
  };

  const methodBadge = (m) => (
    <span
      className={`inline-flex items-center justify-center text-[11px] font-semibold px-[10px] py-1 rounded-[20px] whitespace-nowrap min-w-[100px] text-center ${
        m === "card"
          ? "bg-ug-blue-light text-ug-blue"
          : "bg-[#e8f5ee] text-[#1B6B3A]"
      }`}
    >
      {m === "card" ? "Card" : "Mobile Money"}
    </span>
  );

  const statusBadge = (s) => (
    <span
      className={`text-[11px] font-bold px-[10px] py-[3px] rounded-[20px] ${
        s === "Confirmed"
          ? "bg-[#e8f5ee] text-[#1B6B3A]"
          : "bg-[#fdf3e0] text-[#b5700a]"
      }`}
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
      <div className="flex justify-between items-start mb-6 flex-wrap gap-3">
        <div>
          <h2 className="mb-1 font-serif">
            Payment Tracking
          </h2>
          <p className="text-[#666] text-sm">
            Monitor and manage all transaction records
          </p>
        </div>
        <div className="flex gap-[10px]">
          <button
            onClick={exportCSV}
            className="flex items-center gap-[6px] bg-white text-ug-blue border-[1.5px] border-[#b0bdd8] rounded-lg px-4 py-2 text-[13px] font-semibold cursor-pointer"
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            onClick={() => setShowAdd((s) => !s)}
            className="flex items-center gap-[6px] bg-ug-blue text-white border-none rounded-lg px-4 py-2 text-[13px] font-semibold cursor-pointer"
          >
            <Plus size={14} /> Add Payment
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-[16px] mb-7">
        {cards.map((c, i) => (
          <div
            key={i}
            className="bg-white border border-[#e8eaf0] rounded-[14px] p-[20px_22px] flex justify-between items-start"
          >
            <div>
              <div className="text-[13px] text-[#888] mb-2">
                {c.label}
              </div>
              <div className="text-[26px] font-extrabold text-ug-navy font-serif">
                {c.value}
              </div>
              {c.sub && (
                <div
                  className="text-[13px] font-semibold mt-1"
                  style={{ color: c.subColor }}
                >
                  {c.sub}
                </div>
              )}
            </div>
            <div
              className="w-[44px] h-[44px] rounded-xl flex items-center justify-center shrink-0"
              style={{ background: c.iconBg }}
            >
              {c.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Add payment form */}
      {showAdd && (
        <div className="card mb-5 border-2 border-ug-gold">
          <h4 className="mb-4 font-serif">
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
          <div className="flex gap-[10px] mt-1">
            <button className="btn-primary" onClick={addPayment}>
              <span className="inline-flex items-center gap-[6px]">
                <Check size={14} /> Save Record
              </span>
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="bg-[#f0f0f0] border-none rounded-lg px-4 py-[9px] text-[13px] cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search + filter */}
      <div className="flex gap-3 mb-5 flex-wrap items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search
            size={15}
            color="#aaa"
            className="absolute left-3 top-1/2 -translate-y-1/2"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by transaction ID, name, email, booking code…"
            className="w-full pl-9 pr-3 pt-[9px] pb-[9px] border-[1.5px] border-[#ddd] rounded-[10px] text-[13px]"
          />
        </div>
        <div className="flex gap-[6px]">
          {["All", "Confirmed", "Pending"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`border-[1.5px] border-[#ddd] rounded-[20px] px-4 py-[6px] text-[13px] cursor-pointer ${
                filter === f
                  ? "bg-ug-blue text-white font-semibold"
                  : "bg-white text-[#555] font-normal"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e0e0e0] rounded-[14px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="bg-ug-surface border-b border-[#eee]">
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
                    className={`px-4 py-[13px] text-left font-semibold text-xs text-[#555] whitespace-nowrap select-none ${col.key ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <span className="inline-flex items-center gap-1">
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
                    className="text-center p-[40px] text-[#888]"
                  >
                    No payment records found.
                  </td>
                </tr>
              )}
              {visible.map((p, i) => (
                <tr
                  key={p.id}
                  className={`border-b border-[#f5f5f5] ${i % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}`}
                >
                  <td className="px-4 py-[13px] max-w-[200px]">
                    <span
                      className="text-ug-blue font-mono text-[11px] cursor-pointer underline"
                      onClick={() => setSelected(p)}
                    >
                      {(p.transactionId || "—").slice(0, 28)}
                      {(p.transactionId || "").length > 28 ? "…" : ""}
                    </span>
                  </td>
                  <td className="px-4 py-[13px] text-[#555] font-medium">
                    {p.studentId || "—"}
                  </td>
                  <td className="px-4 py-[13px]">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-[11px] text-[#888]">{p.email}</div>
                  </td>
                  <td className="px-4 py-[13px] text-[#555] whitespace-nowrap">
                    <div>
                      {p.date
                        ? new Date(p.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </div>
                    <div className="text-[11px] text-[#aaa]">
                      {p.date
                        ? new Date(p.date).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </div>
                  </td>
                  <td className="px-4 py-[13px] font-bold text-ug-navy">
                    GH₵ {fmt(Number(p.amount) || 0)}
                  </td>
                  <td className="px-4 py-[13px] whitespace-nowrap">
                    {methodBadge(p.method)}
                  </td>
                  <td className="px-4 py-[13px]">
                    {statusBadge(p.status)}
                  </td>
                  <td className="px-4 py-[13px]">
                    <button
                      onClick={() => setSelected(p)}
                      className="inline-flex items-center gap-[5px] bg-[#f4f6fb] text-ug-blue border border-[#b0bdd8] rounded-lg px-3 py-[5px] text-xs font-semibold cursor-pointer"
                    >
                      <Eye size={13} /> View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-[#eee] text-xs text-[#888]">
          Showing {visible.length} of {payments.length} records
        </div>
      </div>

      {/* Details modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/45 z-[999] flex items-center justify-center p-6"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-[520px] w-full shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif m-0">
                Payment Details
              </h3>
              <button
                onClick={() => setSelected(null)}
                className="bg-transparent border-none cursor-pointer text-[#888]"
              >
                <X size={20} />
              </button>
            </div>

            {[
              [
                "Transaction ID",
                <span className="font-mono text-xs break-all">
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
                className="flex justify-between py-[10px] border-b border-[#f0f0f0] text-sm"
              >
                <span className="text-[#666] shrink-0 mr-4">
                  {label}
                </span>
                <span className="font-medium text-right">
                  {val}
                </span>
              </div>
            ))}

            <div className="mt-5">
              <div className="text-[13px] font-semibold mb-[10px]">
                Update Status
              </div>
              <div className="flex gap-[10px]">
                <button
                  onClick={() => {
                    updateStatus(selected.id, "Confirmed");
                    setSelected((p) => ({ ...p, status: "Confirmed" }));
                  }}
                  className={`flex-1 border-[1.5px] rounded-lg p-[9px] text-[13px] font-semibold cursor-pointer ${
                    selected.status === "Confirmed"
                      ? "bg-[#e8f5ee] text-[#1B6B3A] border-[#a8d5b8]"
                      : "bg-[#f5f5f5] text-[#555] border-[#ddd]"
                  }`}
                >
                  <span className="inline-flex items-center gap-[5px]">
                    <Check size={14} /> Confirmed
                  </span>
                </button>
                <button
                  onClick={() => {
                    updateStatus(selected.id, "Pending");
                    setSelected((p) => ({ ...p, status: "Pending" }));
                  }}
                  className={`flex-1 border-[1.5px] rounded-lg p-[9px] text-[13px] font-semibold cursor-pointer ${
                    selected.status === "Pending"
                      ? "bg-[#fdf3e0] text-[#b5700a] border-[#e8d5a0]"
                      : "bg-[#f5f5f5] text-[#555] border-[#ddd]"
                  }`}
                >
                  <span className="inline-flex items-center gap-[5px]">
                    <AlertTriangle size={14} /> Pending
                  </span>
                </button>
                <button
                  onClick={() => {
                    removePayment(selected.id);
                    setSelected(null);
                  }}
                  className="bg-[#fdecea] text-[#c0392b] border border-[#f5b7b1] rounded-lg px-[14px] py-[9px] text-[13px] cursor-pointer"
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
