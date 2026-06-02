import { useState } from "react";
import { Download } from "lucide-react";
import { useAdminContext } from "../../../context/AdminContext";

export default function ParticipantsPanel() {
  const { siteContent, updateContent } = useAdminContext();
  const participants = siteContent.participants as any[];
  const onChange = (v: unknown) => updateContent("participants", v);
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
      <div className="flex justify-between items-start mb-6 flex-wrap gap-3">
        <div>
          <h2 className="mb-1 font-serif">
            Participants
          </h2>
          <p className="text-[#666] text-sm">
            {participants.length} registered ·{" "}
            {participants.filter((p) => p.payment === "Confirmed").length}{" "}
            confirmed
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 bg-ug-blue text-white border-none rounded-lg px-[18px] py-[9px] text-[13px] font-semibold cursor-pointer"
        >
          <span className="inline-flex items-center gap-1.5">
            <Download size={14} /> Export CSV
          </span>
        </button>
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="flex-1 min-w-[220px] px-3.5 py-2 border-[1.5px] border-[#ddd] rounded-lg text-sm"
        />
        <div className="flex gap-1.5">
          {["All", "Confirmed", "Pending"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`border border-[#ddd] px-3.5 py-1.5 rounded-[20px] text-[13px] cursor-pointer${filter === f ? " bg-ug-blue text-white" : " bg-white text-[#555]"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-ug-surface">
              {["Name", "Email", "Programme", "Mode", "Payment", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-semibold text-[#555] border-b border-[#eee] whitespace-nowrap"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-[#f5f5f5]">
                <td className="px-4 py-3 font-medium">
                  {p.name}
                </td>
                <td className="px-4 py-3 text-[#666]">
                  {p.email}
                </td>
                <td className="px-4 py-3 text-[#555]">
                  {p.programme}
                </td>
                <td className="px-4 py-3">{p.mode}</td>
                <td className="px-4 py-3">
                  <span
                    className={`badge ${p.payment === "Confirmed" ? "badge-green" : "badge-red"}`}
                  >
                    {p.payment}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    {p.payment !== "Confirmed" && (
                      <button
                        onClick={() => setPayment(p.id, "Confirmed")}
                        className="bg-[#e3f5eb] text-[#1B6B3A] border border-[#a8d5b8] rounded-md px-2.5 py-1 text-[11px] cursor-pointer font-semibold"
                      >
                        Confirm
                      </button>
                    )}
                    {p.payment !== "Pending" && (
                      <button
                        onClick={() => setPayment(p.id, "Pending")}
                        className="bg-[#fdecea] text-[#c0392b] border border-[#f5b7b1] rounded-md px-2.5 py-1 text-[11px] cursor-pointer"
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
          <div className="text-center p-8 text-[#888] text-sm">
            No participants match the current filter.
          </div>
        )}
      </div>
    </div>
  );
}
