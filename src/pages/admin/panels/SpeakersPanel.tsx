import { useState } from "react";
import { Check, ArrowRight, X } from "lucide-react";
import { uid, ImageUploadField } from "./shared";
import { useAdminContext } from "../../../context/AdminContext";

export default function SpeakersPanel() {
  const { siteContent, updateContent } = useAdminContext();
  const speakers = (siteContent.speakers as Record<string, any>) || {};
  const onChange = (v: unknown) => updateContent("speakers", v);
  const [keynote, setKeynote] = useState({ ...(speakers.keynote || {}) });
  const [panelists, setPanelists] = useState(
    (speakers.panelists || []).map((p) => ({ ...p })),
  );
  const [committee, setCommittee] = useState(
    (speakers.committee || []).map((m) => ({ ...m })),
  );
  const [saved, setSaved] = useState(false);

  const save = () => {
    onChange({ keynote, panelists, committee });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const updatePanelist = (i, field, val) =>
    setPanelists((ps) =>
      ps.map((p, pi) => (pi === i ? { ...p, [field]: val } : p)),
    );
  const updateCommittee = (i, field, val) =>
    setCommittee((cs) =>
      cs.map((m, mi) => (mi === i ? { ...m, [field]: val } : m)),
    );

  const addPanelist = () =>
    setPanelists((ps) => [
      ...ps,
      {
        id: uid(),
        name: "",
        title: "",
        institution: "",
        role: "Panelist",
        bio: "",
        photo: "",
      },
    ]);
  const removePanelist = (i) =>
    setPanelists((ps) => ps.filter((_, pi) => pi !== i));
  const addCommittee = () =>
    setCommittee((cs) => [
      ...cs,
      { id: uid(), name: "", role: "", institution: "" },
    ]);
  const removeCommittee = (i) =>
    setCommittee((cs) => cs.filter((_, ci) => ci !== i));

  return (
    <div style={{ maxWidth: 760 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>
        Speakers &amp; Committee
      </h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>
        Changes appear immediately on the Speakers page.
      </p>
      {saved && (
        <div className="alert alert-success" style={{ marginBottom: 20 }}>
          <Check
            size={14}
            style={{
              display: "inline",
              verticalAlign: "middle",
              marginRight: 4,
            }}
          />{" "}
          Saved.
        </div>
      )}

      {/* Keynote */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h4 style={{ marginBottom: 16, fontFamily: "Playfair Display, serif" }}>
          Keynote Speaker
        </h4>
        <div className="form-row">
          <div className="form-group">
            <label>Name</label>
            <input
              value={keynote.name}
              onChange={(e) =>
                setKeynote((k) => ({ ...k, name: e.target.value }))
              }
            />
          </div>
          <div className="form-group">
            <label>Title</label>
            <input
              value={keynote.title}
              onChange={(e) =>
                setKeynote((k) => ({ ...k, title: e.target.value }))
              }
            />
          </div>
        </div>
        <div className="form-group">
          <label>Institution</label>
          <input
            value={keynote.institution}
            onChange={(e) =>
              setKeynote((k) => ({ ...k, institution: e.target.value }))
            }
          />
        </div>
        <div className="form-group">
          <label>Talk Topic</label>
          <input
            value={keynote.topic}
            onChange={(e) =>
              setKeynote((k) => ({ ...k, topic: e.target.value }))
            }
          />
        </div>
        <div className="form-group">
          <label>Bio</label>
          <textarea
            value={keynote.bio}
            onChange={(e) => setKeynote((k) => ({ ...k, bio: e.target.value }))}
            style={{ minHeight: 80 }}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <ImageUploadField
              label="Photo"
              value={keynote.photo}
              onChange={(v) => setKeynote((k) => ({ ...k, photo: v }))}
            />
          </div>
          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input
              value={keynote.tags}
              onChange={(e) =>
                setKeynote((k) => ({ ...k, tags: e.target.value }))
              }
              placeholder="AI, Machine Learning"
            />
          </div>
        </div>
      </div>

      {/* Panelists */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h4 style={{ fontFamily: "Playfair Display, serif" }}>Panelists</h4>
          <button
            onClick={addPanelist}
            style={{
              background: "#1B3A6B",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "6px 14px",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            + Add
          </button>
        </div>
        {panelists.map((p, i) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: 10,
              padding: "16px",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <span style={{ fontWeight: 600, fontSize: 14 }}>
                {p.name || `Panelist ${i + 1}`}
              </span>
              <button
                onClick={() => removePanelist(i)}
                style={{
                  background: "#fdecea",
                  color: "#c0392b",
                  border: "none",
                  borderRadius: 6,
                  padding: "3px 10px",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  value={p.name}
                  onChange={(e) => updatePanelist(i, "name", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <input
                  value={p.role}
                  onChange={(e) => updatePanelist(i, "role", e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input
                  value={p.title}
                  onChange={(e) => updatePanelist(i, "title", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Institution</label>
                <input
                  value={p.institution}
                  onChange={(e) =>
                    updatePanelist(i, "institution", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Bio</label>
                <textarea
                  value={p.bio}
                  onChange={(e) => updatePanelist(i, "bio", e.target.value)}
                  style={{ minHeight: 60 }}
                />
              </div>
              <div className="form-group">
                <ImageUploadField
                  label="Photo"
                  value={p.photo}
                  onChange={(v) => updatePanelist(i, "photo", v)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Committee */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h4 style={{ fontFamily: "Playfair Display, serif" }}>
            Organising Committee
          </h4>
          <button
            onClick={addCommittee}
            style={{
              background: "#1B3A6B",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "6px 14px",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            + Add
          </button>
        </div>
        {committee.map((m, i) => (
          <div
            key={m.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr auto",
              gap: 10,
              alignItems: "end",
              marginBottom: 10,
            }}
          >
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Name</label>
              <input
                value={m.name}
                onChange={(e) => updateCommittee(i, "name", e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Role</label>
              <input
                value={m.role}
                onChange={(e) => updateCommittee(i, "role", e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Institution</label>
              <input
                value={m.institution}
                onChange={(e) =>
                  updateCommittee(i, "institution", e.target.value)
                }
              />
            </div>
            <button
              onClick={() => removeCommittee(i)}
              style={{
                background: "#fdecea",
                color: "#c0392b",
                border: "none",
                borderRadius: 6,
                padding: "8px 10px",
                fontSize: 12,
                cursor: "pointer",
                marginBottom: 20,
              }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <button className="btn-primary" onClick={save}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          Save Speakers <ArrowRight size={14} />
        </span>
      </button>
    </div>
  );
}
