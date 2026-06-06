import { useState } from "react";
import { Download, ChevronDown, ChevronUp, Users } from "lucide-react";
import { useAdminContext } from "../../../context/AdminContext";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Participant {
  id: string | number;
  _docId?: string;
  name?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  studentId?: string;
  department?: string;
  programme?: string;
  level?: string;
  nationality?: string;
  type?: string;
  participationType?: string;
  mode?: string;
  attendanceMode?: string;
  presentationType?: string;
  presentationTitle?: string;
  abstract?: string;
  payment?: string;
  paymentMethod?: string;
  payRef?: string;
  registeredAt?: string;
  updatedAt?: string;
  emailSent?: boolean;
  emailSentAt?: string | null;
  emailDeliveryStatus?: "processing" | "delivered" | "failed" | null;
  emailError?: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(val?: string) {
  return val && val.trim() ? val : "—";
}

function fmtDate(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

const PAYMENT_COLOURS: Record<string, { bg: string; color: string; border: string }> = {
  Confirmed: { bg: "#e3f5eb", color: "#1B6B3A", border: "#a8d5b8" },
  Pending:   { bg: "#fdecea", color: "#c0392b", border: "#f5b7b1" },
};
function payStyle(status = "Pending") {
  return PAYMENT_COLOURS[status] ?? PAYMENT_COLOURS.Pending;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ParticipantsPanel() {
  const { siteContent, updateContent } = useAdminContext();
  const participants: Participant[] = (siteContent.participants as Participant[]) || [];

  const [filter, setFilter]       = useState("All");
  const [search, setSearch]       = useState("");
  const [expandedId, setExpandedId] = useState<string | number | null>(null);

  // ── Actions ─────────────────────────────────────────────────────────────────
  const setPayment = (id: string | number, status: string) =>
    updateContent(
      "participants",
      participants.map(p => (p.id === id ? { ...p, payment: status } : p))
    );

  // ── Filter + search ─────────────────────────────────────────────────────────
  const filtered = participants
    .filter(p => filter === "All" || p.payment === filter)
    .filter(p => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        (p.name        || "").toLowerCase().includes(q) ||
        (p.fullName    || "").toLowerCase().includes(q) ||
        (p.email       || "").toLowerCase().includes(q) ||
        (p.programme   || "").toLowerCase().includes(q) ||
        (p.nationality || "").toLowerCase().includes(q) ||
        (p.studentId   || "").toLowerCase().includes(q) ||
        (p.department  || "").toLowerCase().includes(q)
      );
    });

  const confirmedCount = participants.filter(p => p.payment === "Confirmed").length;
  const pendingCount   = participants.filter(p => p.payment === "Pending").length;

  // ── CSV export ──────────────────────────────────────────────────────────────
  const exportCSV = () => {
    const cols = [
      "Name", "Email", "Phone", "Student ID", "Department", "Programme",
      "Level", "Nationality", "Participation Type", "Attendance Mode",
      "Presentation Type", "Presentation Title", "Abstract",
      "Payment Status", "Payment Method", "Payment Ref",
      "Registered At", "Updated At",
    ];
    const rows = participants.map(p => [
      p.fullName || p.name,
      p.email,
      p.phone,
      p.studentId,
      p.department,
      p.programme,
      p.level,
      p.nationality,
      p.participationType || p.type,
      p.attendanceMode || p.mode,
      p.presentationType,
      p.presentationTitle,
      (p.abstract || "").replace(/\n/g, " "),
      p.payment,
      p.paymentMethod,
      p.payRef,
      p.registeredAt,
      p.updatedAt,
    ].map(v => `"${(v ?? "").toString().replace(/"/g, '""')}"`).join(","));

    const blob = new Blob([[cols.join(","), ...rows].join("\n")], { type: "text/csv" });
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(blob),
      download: `registrations_${new Date().toISOString().slice(0, 10)}.csv`,
    });
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-5 flex-wrap gap-3">
        <div>
          <h2 className="mb-1 font-serif">Registered Students</h2>
          <p className="text-[#666] text-sm">
            {participants.length} total &nbsp;·&nbsp;
            <span style={{ color: "#1B6B3A", fontWeight: 600 }}>{confirmedCount} confirmed</span>
            &nbsp;·&nbsp;
            <span style={{ color: "#c0392b", fontWeight: 600 }}>{pendingCount} pending</span>
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 bg-ug-blue text-white border-none rounded-lg px-[18px] py-[9px] text-[13px] font-semibold cursor-pointer"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, nationality, programme, student ID…"
          className="flex-1 min-w-[260px] px-3.5 py-2 border-[1.5px] border-[#ddd] rounded-lg text-sm"
        />
        <div className="flex gap-1.5">
          {["All", "Confirmed", "Pending"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                border: "1px solid #ddd",
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: 13,
                cursor: "pointer",
                background: filter === f ? "#1B3A6B" : "#fff",
                color:      filter === f ? "#fff"    : "#555",
                fontWeight: filter === f ? 600       : 400,
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {participants.length === 0 && (
        <div style={{
          textAlign: "center", padding: "56px 24px",
          background: "#f9fafb", borderRadius: 12,
          border: "1px dashed #dde1ea",
        }}>
          <Users size={40} style={{ color: "#c5cad5", margin: "0 auto 12px" }} />
          <p style={{ color: "#888", fontSize: 15, fontWeight: 500, marginBottom: 4 }}>
            No registrations yet
          </p>
          <p style={{ color: "#aaa", fontSize: 13 }}>
            Students who complete the registration form will appear here in real time.
          </p>
        </div>
      )}

      {/* No-match state */}
      {participants.length > 0 && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 24px", color: "#888", fontSize: 14 }}>
          No participants match the current filter or search.
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="bg-ug-surface">
                {["#", "Student", "Nationality", "Programme", "Participation", "Payment", "Registered", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-[#555] border-b border-[#eee] whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, idx) => {
                const isOpen = expandedId === p.id;
                const ps = payStyle(p.payment);
                const displayName = fmt(p.fullName || p.name);
                const isPresenter = (p.participationType || p.type || "").toLowerCase() !== "observer";

                return (
                  <>
                    {/* Main row */}
                    <tr
                      key={`row-${p.id}`}
                      className="border-b border-[#f5f5f5]"
                      style={{ cursor: "pointer", background: isOpen ? "#f8fafd" : undefined }}
                      onClick={() => setExpandedId(isOpen ? null : p.id)}
                    >
                      {/* # */}
                      <td className="px-4 py-3 text-[#aaa]">{idx + 1}</td>

                      {/* Student */}
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#1a1a1a]">{displayName}</div>
                        <div className="text-[11px] text-[#888] mt-0.5">{fmt(p.email)}</div>
                        {p.studentId && (
                          <div className="text-[11px] text-[#aaa]">ID: {p.studentId}</div>
                        )}
                      </td>

                      {/* Nationality */}
                      <td className="px-4 py-3 text-[#555]">{fmt(p.nationality)}</td>

                      {/* Programme */}
                      <td className="px-4 py-3">
                        <div className="text-[#444]">{fmt(p.programme)}</div>
                        <div className="text-[11px] text-[#888] mt-0.5">{fmt(p.level)}</div>
                      </td>

                      {/* Participation */}
                      <td className="px-4 py-3">
                        <div className="text-[#444]">{fmt(p.participationType || p.type)}</div>
                        <div className="text-[11px] text-[#888] mt-0.5">{fmt(p.attendanceMode || p.mode)}</div>
                      </td>

                      {/* Payment */}
                      <td className="px-4 py-3">
                        <span style={{
                          display: "inline-block",
                          background: ps.bg,
                          color: ps.color,
                          border: `1px solid ${ps.border}`,
                          borderRadius: 20,
                          padding: "2px 10px",
                          fontSize: 11,
                          fontWeight: 600,
                        }}>
                          {p.payment || "Pending"}
                        </span>
                      </td>

                      {/* Registered */}
                      <td className="px-4 py-3 text-[#888] whitespace-nowrap text-[12px]">
                        {fmtDate(p.registeredAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <div className="flex gap-1.5 items-center">
                          {p.payment !== "Confirmed" && (
                            <button
                              onClick={() => setPayment(p.id, "Confirmed")}
                              style={{
                                background: "#e3f5eb", color: "#1B6B3A",
                                border: "1px solid #a8d5b8",
                                borderRadius: 6, padding: "3px 10px",
                                fontSize: 11, cursor: "pointer", fontWeight: 600,
                              }}
                            >
                              Confirm
                            </button>
                          )}
                          {p.payment !== "Pending" && (
                            <button
                              onClick={() => setPayment(p.id, "Pending")}
                              style={{
                                background: "#fdecea", color: "#c0392b",
                                border: "1px solid #f5b7b1",
                                borderRadius: 6, padding: "3px 10px",
                                fontSize: 11, cursor: "pointer",
                              }}
                            >
                              Revoke
                            </button>
                          )}
                          {isOpen
                            ? <ChevronUp size={14} style={{ color: "#aaa", marginLeft: 4 }} />
                            : <ChevronDown size={14} style={{ color: "#aaa", marginLeft: 4 }} />
                          }
                        </div>
                      </td>
                    </tr>

                    {/* Expanded details row */}
                    {isOpen && (
                      <tr key={`exp-${p.id}`} style={{ background: "#f4f7fd" }}>
                        <td />
                        <td colSpan={7} style={{ padding: "14px 16px 18px" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px 32px" }}>
                            {[
                              ["Full Name",   fmt(p.fullName || p.name)],
                              ["Email",       fmt(p.email)],
                              ["Phone",       fmt(p.phone)],
                              ["Student ID",  fmt(p.studentId)],
                              ["Department",  fmt(p.department)],
                              ["Level",       fmt(p.level)],
                              ["Nationality", fmt(p.nationality)],
                              ["Attendance",  fmt(p.attendanceMode || p.mode)],
                              isPresenter && ["Presentation Type", fmt(p.presentationType)],
                              ["Payment Method", fmt(p.paymentMethod)],
                              p.payRef && ["Payment Ref", fmt(p.payRef)],
                              ["Last Updated", fmtDate(p.updatedAt)],
                              ["Email Notification",
                                p.emailDeliveryStatus === "delivered" ? "✅ Sent" :
                                p.emailDeliveryStatus === "processing" ? "⏳ Sending…" :
                                p.emailDeliveryStatus === "failed" ? `❌ Failed${p.emailError ? ` — ${p.emailError.slice(0, 60)}` : ""}` :
                                "⏳ Pending"
                              ],
                            ].filter(Boolean).map(([label, val]) => (
                              <div key={label as string}>
                                <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>
                                  {label as string}
                                </div>
                                <div style={{ fontSize: 13, color: "#333" }}>{val as string}</div>
                              </div>
                            ))}
                          </div>

                          {/* Presentation title + abstract */}
                          {isPresenter && p.presentationTitle && (
                            <div style={{ marginTop: 14, borderTop: "1px solid #dde4f0", paddingTop: 12 }}>
                              <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
                                Presentation Title
                              </div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: "#1B3A6B", marginBottom: 10 }}>
                                {p.presentationTitle}
                              </div>
                              {p.abstract && (
                                <>
                                  <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
                                    Abstract
                                  </div>
                                  <div style={{
                                    fontSize: 13, color: "#444", lineHeight: 1.65,
                                    background: "#fff", borderRadius: 8,
                                    padding: "10px 14px", border: "1px solid #e0e6f0",
                                    whiteSpace: "pre-wrap",
                                  }}>
                                    {p.abstract}
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
