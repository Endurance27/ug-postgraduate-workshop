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
      <h2 className="mb-[6px] font-serif">
        Submissions
      </h2>
      <p className="text-[#666] text-sm mb-6">
        {submissions.length} total ·{" "}
        {submissions.filter((s) => s.status === "Accepted").length} accepted
      </p>

      <div className="flex flex-col gap-[14px]">
        {submissions.map((s) => (
          <div
            key={s.id}
            className="card grid items-start gap-5"
            style={{ gridTemplateColumns: "1fr auto" }}
          >
            <div>
              <div className="font-semibold text-[15px] mb-[6px]">
                {s.title}
              </div>
              <div className="flex gap-[10px] flex-wrap items-center">
                <span className="badge badge-navy text-[11px]">
                  {s.category}
                </span>
                <span className="text-[13px] text-[#666]">
                  by {s.author}
                </span>
                <span
                  className="text-[11px] font-bold py-[3px] px-[10px] rounded-xl"
                  style={{
                    background: statusBg[s.status],
                    color: statusColor[s.status],
                  }}
                >
                  {s.status}
                </span>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              {s.status !== "Accepted" && (
                <button
                  onClick={() => setStatus(s.id, "Accepted")}
                  className="bg-[#e3f5eb] text-[#1B6B3A] border border-[#a8d5b8] rounded-lg py-[6px] px-[14px] text-[13px] cursor-pointer font-semibold"
                >
                  <span className="inline-flex items-center gap-1">
                    <Check size={14} /> Accept
                  </span>
                </button>
              )}
              {s.status !== "Under Review" && (
                <button
                  onClick={() => setStatus(s.id, "Under Review")}
                  className="bg-[#fdf3e0] text-[#b5700a] border border-[#e8d5a0] rounded-lg py-[6px] px-[14px] text-[13px] cursor-pointer"
                >
                  In Review
                </button>
              )}
              {s.status !== "Rejected" && (
                <button
                  onClick={() => setStatus(s.id, "Rejected")}
                  className="bg-[#fdecea] text-[#c0392b] border border-[#f5b7b1] rounded-lg py-[6px] px-[14px] text-[13px] cursor-pointer"
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
