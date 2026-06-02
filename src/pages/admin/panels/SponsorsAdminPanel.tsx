import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { uid } from "./shared";
import { useAdminContext } from "../../../context/AdminContext";

export default function SponsorsAdminPanel() {
  const { siteContent, updateContent } = useAdminContext();
  const sponsors = (siteContent.sponsors as any[]) || [];
  const onChangeSponsors = (v: unknown) => updateContent("sponsors", v);
  const footer = (siteContent.footer as Record<string, any>) || {};
  const onChange = (v: unknown) => updateContent("footer", v);
  const [items, setItems] = useState(sponsors.map((s) => ({ ...s })));
  const [footerForm, setFooterForm] = useState({
    publication: footer.publication || "CBAS Journal",
    organizers: (footer.organizers || []).join("\n"),
    sponsors: (footer.sponsors || []).join("\n"),
  });
  const [saved, setSaved] = useState(false);

  const update = (i, field, val) =>
    setItems((arr) =>
      arr.map((s, si) => (si === i ? { ...s, [field]: val } : s)),
    );
  const remove = (i) => setItems((arr) => arr.filter((_, si) => si !== i));
  const add = () =>
    setItems((arr) => [
      ...arr,
      {
        id: uid(),
        name: "New Sponsor",
        role: "Partner",
        desc: "Description of this sponsor's contribution.",
        tier: "gold",
        logo: "🏢",
      },
    ]);

  const saveAll = () => {
    onChangeSponsors(items);
    onChange({
      ...footer,
      publication: footerForm.publication,
      organizers: footerForm.organizers
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      sponsors: footerForm.sponsors
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tierColors = {
    gold: "#C9A84C",
    primary: "#1B3A6B",
    silver: "#7a7a7a",
    bronze: "#b56f3e",
  };

  return (
    <div className="max-w-[760px]">
      <h2 className="mb-1.5 font-serif">
        Sponsors Page
      </h2>
      <p className="text-[#666] text-sm mb-6">
        Manage institutional sponsor cards, publication partner, and footer
        sponsor lists.
      </p>
      {saved && (
        <div className="alert alert-success mb-5">
          <Check
            size={14}
            className="inline align-middle mr-1"
          />{" "}
          Saved — Sponsors page updated.
        </div>
      )}

      {/* Institutional Sponsor Cards */}
      <div className="card mb-5">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-serif">
            Institutional Sponsor Cards
          </h4>
          <button
            onClick={add}
            className="bg-ug-blue text-white border-none rounded-lg px-[14px] py-[6px] text-[13px] cursor-pointer"
          >
            + Add Sponsor
          </button>
        </div>
        <p className="text-[13px] text-[#888] mb-[14px]">
          These cards appear in the "Institutional Sponsors" grid on the
          Sponsors page.
        </p>

        {items.map((s, i) => (
          <div
            key={s.id || i}
            className="rounded-xl p-4 mb-[14px]"
            style={{
              border: `2px solid ${tierColors[s.tier] || "#ddd"}`,
            }}
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-[10px]">
                <span className="text-2xl">{s.logo}</span>
                <span className="font-semibold text-sm">
                  {s.name || `Sponsor ${i + 1}`}
                </span>
              </div>
              <button
                onClick={() => remove(i)}
                className="bg-[#fdecea] text-[#c0392b] border-none rounded-md px-[10px] py-1 text-xs cursor-pointer"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-[60px_1fr_1fr_120px] gap-[10px] mb-[10px]">
              <div className="form-group mb-0">
                <label className="text-xs">Logo / Icon</label>
                <input
                  value={s.logo}
                  onChange={(e) => update(i, "logo", e.target.value)}
                  className="w-full p-[6px_8px] border border-[#ddd] rounded-md text-[18px] text-center"
                />
              </div>
              <div className="form-group mb-0">
                <label className="text-xs">Organisation Name</label>
                <input
                  value={s.name}
                  onChange={(e) => update(i, "name", e.target.value)}
                  className="w-full p-[6px_8px] border border-[#ddd] rounded-md text-[13px]"
                />
              </div>
              <div className="form-group mb-0">
                <label className="text-xs">Role / Badge Label</label>
                <input
                  value={s.role}
                  onChange={(e) => update(i, "role", e.target.value)}
                  className="w-full p-[6px_8px] border border-[#ddd] rounded-md text-[13px]"
                  placeholder="Host Institution"
                />
              </div>
              <div className="form-group mb-0">
                <label className="text-xs">Tier</label>
                <select
                  value={s.tier}
                  onChange={(e) => update(i, "tier", e.target.value)}
                  className="w-full p-[6px_8px] border border-[#ddd] rounded-md text-[13px]"
                >
                  <option value="gold">Gold</option>
                  <option value="primary">Primary (Blue)</option>
                  <option value="silver">Silver</option>
                  <option value="bronze">Bronze</option>
                </select>
              </div>
            </div>
            <div className="form-group mb-0">
              <label className="text-xs">Description</label>
              <textarea
                value={s.desc}
                onChange={(e) => update(i, "desc", e.target.value)}
                className="w-full p-[6px_8px] border border-[#ddd] rounded-md text-[13px] min-h-[60px] resize-y"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Publication Partner */}
      <div className="card mb-5">
        <h4 className="mb-[14px] font-serif">
          Publication Partner
        </h4>
        <div className="form-group max-w-[300px]">
          <label>Journal / Publisher Name</label>
          <input
            value={footerForm.publication}
            onChange={(e) =>
              setFooterForm((f) => ({ ...f, publication: e.target.value }))
            }
            placeholder="CBAS Journal"
          />
        </div>
      </div>

      {/* Footer Lists */}
      <div className="card mb-5">
        <h4 className="mb-[14px] font-serif">
          Footer Sponsor Lists
        </h4>
        <p className="text-[13px] text-[#888] mb-[14px]">
          These text lists appear in the site footer (not the Sponsors page
          cards).
        </p>
        <div className="form-row">
          <div className="form-group">
            <label>Organizers (one per line)</label>
            <textarea
              value={footerForm.organizers}
              onChange={(e) =>
                setFooterForm((f) => ({ ...f, organizers: e.target.value }))
              }
              className="min-h-[80px]"
            />
          </div>
          <div className="form-group">
            <label>Sponsors & Funders (one per line)</label>
            <textarea
              value={footerForm.sponsors}
              onChange={(e) =>
                setFooterForm((f) => ({ ...f, sponsors: e.target.value }))
              }
              className="min-h-[80px]"
            />
          </div>
        </div>
      </div>

      <button className="btn-primary" onClick={saveAll}>
        <span className="inline-flex items-center gap-[6px]">
          Save Sponsors Page <ArrowRight size={14} />
        </span>
      </button>
    </div>
  );
}
