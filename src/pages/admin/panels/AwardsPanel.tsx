import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { ImageUploadField } from "./shared";

export default function AwardsPanel({
  awards,
  onChange,
  pastWinners = [],
  onChangePastWinners,
}) {
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
    <div style={{ maxWidth: 680 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>
        Awards
      </h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 8 }}>
        Enter winner details and toggle "Announce" to make them visible on the
        Awards page.
      </p>

      <div
        className="alert alert-info"
        style={{ marginBottom: 24, fontSize: 13 }}
      >
        Winners only appear on the public Awards page when "Announced" is
        toggled on.
      </div>

      {saved && (
        <div className="alert alert-success" style={{ marginBottom: 16 }}>
          <Check
            size={14}
            style={{
              display: "inline",
              verticalAlign: "middle",
              marginRight: 4,
            }}
          />{" "}
          Award details saved.
        </div>
      )}

      {awards.map((a, i) => (
        <div
          key={a.id}
          className="card"
          style={{
            marginBottom: 16,
            borderLeft: `4px solid ${i === 0 ? "#C9A84C" : i === 1 ? "#aaa" : "#b5700a"}`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 28 }}>{a.emoji}</span>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 16,
                  fontFamily: "Playfair Display, serif",
                }}
              >
                {a.label}
              </span>
            </div>
            <button
              onClick={() => toggleAnnounce(i)}
              style={{
                background: a.announced ? "#e3f5eb" : "#f5f5f5",
                color: a.announced ? "#1B6B3A" : "#888",
                border: `1.5px solid ${a.announced ? "#a8d5b8" : "#ddd"}`,
                borderRadius: 20,
                padding: "5px 16px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {a.announced ? "● Announced" : "○ Not Announced"}
            </button>
          </div>
          <div className="form-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Winner Name</label>
              <input
                value={forms[i].winner}
                onChange={(e) => updateForm(i, "winner", e.target.value)}
                placeholder="e.g. Kwame Asante"
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
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
        className="btn-primary"
        onClick={saveAll}
        style={{ marginTop: 4 }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          Save Award Details <ArrowRight size={14} />
        </span>
      </button>

      {/* Past Winners */}
      <div
        style={{
          marginTop: 36,
          paddingTop: 28,
          borderTop: "2px solid #f0f0f0",
        }}
      >
        <h3 style={{ fontFamily: "Playfair Display, serif", marginBottom: 6 }}>
          Past Winners (Historical)
        </h3>
        <p style={{ color: "#666", fontSize: 14, marginBottom: 20 }}>
          Names displayed on the Awards page under "Maiden Workshop 2025". Leave
          name blank to show placeholder text.
        </p>
        {pastSaved && (
          <div className="alert alert-success" style={{ marginBottom: 16 }}>
            <Check
              size={14}
              style={{
                display: "inline",
                verticalAlign: "middle",
                marginRight: 4,
              }}
            />{" "}
            Past winners saved.
          </div>
        )}
        {pastForms.map((w, i) => (
          <div
            key={w.id || i}
            className="card"
            style={{
              marginBottom: 14,
              borderLeft: `4px solid ${i === 0 ? "#C9A84C" : i === 1 ? "#aaa" : "#b5700a"}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 12,
              }}
            >
              <span style={{ fontSize: 22 }}>{w.pos}</span>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{w.place}</span>
              <span style={{ fontSize: 12, color: "#888" }}>· {w.edition}</span>
            </div>
            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Winner Name</label>
                <input
                  value={w.name}
                  onChange={(e) => updatePastForm(i, "name", e.target.value)}
                  placeholder="e.g. Akua Asante (or leave blank)"
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Field / Programme</label>
                <input
                  value={w.field}
                  onChange={(e) => updatePastForm(i, "field", e.target.value)}
                  placeholder="e.g. Computer Science"
                />
              </div>
            </div>
            <div className="form-row" style={{ marginTop: 10 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Edition Label</label>
                <input
                  value={w.edition}
                  onChange={(e) => updatePastForm(i, "edition", e.target.value)}
                  placeholder="Maiden Workshop 2025"
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
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
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            Save Past Winners <ArrowRight size={14} />
          </span>
        </button>
      </div>
    </div>
  );
}
