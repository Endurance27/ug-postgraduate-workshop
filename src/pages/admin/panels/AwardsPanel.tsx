import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { ImageUploadField } from "./shared";
import { useAdminContext } from "../../../context/AdminContext";

export default function AwardsPanel() {
  const { siteContent, updateContent } = useAdminContext();
  const awards = siteContent.awards as any[];
  const onChange = (v: unknown) => updateContent("awards", v);
  const pastWinners = (siteContent.pastWinners as any[]) || [];
  const onChangePastWinners = (v: unknown) => updateContent("pastWinners", v);
  const [forms, setForms] = useState(
    awards.map((a) => ({ winner: a.winner, paper: a.paper })),
  );
  const [pastForms, setPastForms] = useState(
    pastWinners.map((w) => ({ ...w })),
  );
  const [saved, setSaved] = useState(false);
  const [pastSaved, setPastSaved] = useState(false);

  const updatePastForm = (i, field, val) =>
    setPastForms((pf) =>
      pf.map((w, wi) => (wi === i ? { ...w, [field]: val } : w)),
    );

  const savePastWinners = () => {
    onChangePastWinners && onChangePastWinners(pastForms);
    setPastSaved(true);
    setTimeout(() => setPastSaved(false), 2500);
  };

  const updateForm = (i, field, val) => {
    const next = forms.map((f, fi) => (fi === i ? { ...f, [field]: val } : f));
    setForms(next);
  };

  const saveAll = () => {
    onChange(
      awards.map((a, i) => ({
        ...a,
        winner: forms[i].winner,
        paper: forms[i].paper,
      })),
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const toggleAnnounce = (i) => {
    onChange(
      awards.map((a, ai) => (ai === i ? { ...a, announced: !a.announced } : a)),
    );
  };

  return (
    <div className="max-w-[680px]">
      <h2 className="mb-1.5 font-serif">
        Awards
      </h2>
      <p className="text-[#666] text-sm mb-2">
        Enter winner details and toggle "Announce" to make them visible on the
        Awards page.
      </p>

      <div
        className="alert alert-info mb-6 text-[13px]"
      >
        Winners only appear on the public Awards page when "Announced" is
        toggled on.
      </div>

      {saved && (
        <div className="alert alert-success mb-4">
          <Check
            size={14}
            className="inline align-middle mr-1"
          />{" "}
          Award details saved.
        </div>
      )}

      {awards.map((a, i) => (
        <div
          key={a.id}
          className="card mb-4"
          style={{
            borderLeft: `4px solid ${i === 0 ? "#C9A84C" : i === 1 ? "#aaa" : "#b5700a"}`,
          }}
        >
          <div
            className="flex justify-between items-center mb-[14px]"
          >
            <div className="flex items-center gap-[10px]">
              <span className="text-[28px]">{a.emoji}</span>
              <span className="font-bold text-base font-serif">
                {a.label}
              </span>
            </div>
            <button
              onClick={() => toggleAnnounce(i)}
              className={`rounded-[20px] px-4 py-[5px] text-xs font-bold cursor-pointer border-[1.5px] ${
                a.announced
                  ? "bg-[#e3f5eb] text-[#1B6B3A] border-[#a8d5b8]"
                  : "bg-[#f5f5f5] text-[#888] border-[#ddd]"
              }`}
            >
              {a.announced ? "● Announced" : "○ Not Announced"}
            </button>
          </div>
          <div className="form-row">
            <div className="form-group mb-0">
              <label>Winner Name</label>
              <input
                value={forms[i].winner}
                onChange={(e) => updateForm(i, "winner", e.target.value)}
                placeholder="e.g. Kwame Asante"
              />
            </div>
            <div className="form-group mb-0">
              <label>Paper Title</label>
              <input
                value={forms[i].paper}
                onChange={(e) => updateForm(i, "paper", e.target.value)}
                placeholder="e.g. Deep Learning for Malaria Detection"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        className="btn-primary mt-1"
        onClick={saveAll}
      >
        <span className="inline-flex items-center gap-[6px]">
          Save Award Details <ArrowRight size={14} />
        </span>
      </button>

      {/* Past Winners */}
      <div className="mt-9 pt-7 border-t-2 border-[#f0f0f0]">
        <h3 className="font-serif mb-1.5">
          Past Winners (Historical)
        </h3>
        <p className="text-[#666] text-sm mb-5">
          Names displayed on the Awards page under "Maiden Workshop 2025". Leave
          name blank to show placeholder text.
        </p>
        {pastSaved && (
          <div className="alert alert-success mb-4">
            <Check
              size={14}
              className="inline align-middle mr-1"
            />{" "}
            Past winners saved.
          </div>
        )}
        {pastForms.map((w, i) => (
          <div
            key={w.id || i}
            className="card mb-[14px]"
            style={{
              borderLeft: `4px solid ${i === 0 ? "#C9A84C" : i === 1 ? "#aaa" : "#b5700a"}`,
            }}
          >
            <div className="flex items-center gap-[10px] mb-3">
              <span className="text-[22px]">{w.pos}</span>
              <span className="font-bold text-sm">{w.place}</span>
              <span className="text-xs text-[#888]">· {w.edition}</span>
            </div>
            <div className="form-row">
              <div className="form-group mb-0">
                <label>Winner Name</label>
                <input
                  value={w.name}
                  onChange={(e) => updatePastForm(i, "name", e.target.value)}
                  placeholder="e.g. Akua Asante (or leave blank)"
                />
              </div>
              <div className="form-group mb-0">
                <label>Field / Programme</label>
                <input
                  value={w.field}
                  onChange={(e) => updatePastForm(i, "field", e.target.value)}
                  placeholder="e.g. Computer Science"
                />
              </div>
            </div>
            <div className="form-row mt-[10px]">
              <div className="form-group mb-0">
                <label>Edition Label</label>
                <input
                  value={w.edition}
                  onChange={(e) => updatePastForm(i, "edition", e.target.value)}
                  placeholder="Maiden Workshop 2025"
                />
              </div>
              <div className="form-group mb-0">
                <ImageUploadField
                  label="Photo (optional)"
                  value={w.avatar}
                  onChange={(v) => updatePastForm(i, "avatar", v)}
                />
              </div>
            </div>
          </div>
        ))}
        <button className="btn-outline" onClick={savePastWinners}>
          <span className="inline-flex items-center gap-[6px]">
            Save Past Winners <ArrowRight size={14} />
          </span>
        </button>
      </div>
    </div>
  );
}
