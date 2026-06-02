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
    <div className="max-w-[760px]">
      <h2 className="mb-1.5 font-serif">
        Speakers &amp; Committee
      </h2>
      <p className="text-[#666] text-sm mb-6">
        Changes appear immediately on the Speakers page.
      </p>
      {saved && (
        <div className="alert alert-success mb-5">
          <Check
            size={14}
            className="inline align-middle mr-1"
          />{" "}
          Saved.
        </div>
      )}

      {/* Keynote */}
      <div className="card mb-6">
        <h4 className="mb-4 font-serif">
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
            className="min-h-[80px]"
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
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-serif">Panelists</h4>
          <button
            onClick={addPanelist}
            className="bg-ug-blue text-white border-none rounded-lg px-3.5 py-1.5 text-[13px] cursor-pointer"
          >
            + Add
          </button>
        </div>
        {panelists.map((p, i) => (
          <div
            key={p.id}
            className="border border-[#e0e0e0] rounded-[10px] p-4 mb-3"
          >
            <div className="flex justify-between mb-2.5">
              <span className="font-semibold text-sm">
                {p.name || `Panelist ${i + 1}`}
              </span>
              <button
                onClick={() => removePanelist(i)}
                className="bg-[#fdecea] text-[#c0392b] border-none rounded-md px-2.5 py-[3px] text-xs cursor-pointer"
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
                  className="min-h-[60px]"
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
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-serif">
            Organising Committee
          </h4>
          <button
            onClick={addCommittee}
            className="bg-ug-blue text-white border-none rounded-lg px-3.5 py-1.5 text-[13px] cursor-pointer"
          >
            + Add
          </button>
        </div>
        {committee.map((m, i) => (
          <div
            key={m.id}
            className="grid grid-cols-[1fr_1fr_1fr_auto] gap-[10px] items-end mb-2.5"
          >
            <div className="form-group mb-0">
              <label>Name</label>
              <input
                value={m.name}
                onChange={(e) => updateCommittee(i, "name", e.target.value)}
              />
            </div>
            <div className="form-group mb-0">
              <label>Role</label>
              <input
                value={m.role}
                onChange={(e) => updateCommittee(i, "role", e.target.value)}
              />
            </div>
            <div className="form-group mb-0">
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
              className="bg-[#fdecea] text-[#c0392b] border-none rounded-md px-2.5 py-2 text-xs cursor-pointer mb-5"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <button className="btn-primary" onClick={save}>
        <span className="inline-flex items-center gap-1.5">
          Save Speakers <ArrowRight size={14} />
        </span>
      </button>
    </div>
  );
}
