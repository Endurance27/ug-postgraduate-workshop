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
    <div style={{ maxWidth: 760 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>
        Sponsors Page
      </h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>
        Manage institutional sponsor cards, publication partner, and footer
        sponsor lists.
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
          Saved — Sponsors page updated.
        </div>
      )}

      {/* Institutional Sponsor Cards */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h4 style={{ fontFamily: "Playfair Display, serif" }}>
            Institutional Sponsor Cards
          </h4>
          <button
            onClick={add}
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
            + Add Sponsor
          </button>
        </div>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 14 }}>
          These cards appear in the "Institutional Sponsors" grid on the
          Sponsors page.
        </p>

        {items.map((s, i) => (
          <div
            key={s.id || i}
            style={{
              border: `2px solid ${tierColors[s.tier] || "#ddd"}`,
              borderRadius: 12,
              padding: "16px",
              marginBottom: 14,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 24 }}>{s.logo}</span>
                <span style={{ fontWeight: 600, fontSize: 14 }}>
                  {s.name || `Sponsor ${i + 1}`}
                </span>
              </div>
              <button
                onClick={() => remove(i)}
                style={{
                  background: "#fdecea",
                  color: "#c0392b",
                  border: "none",
                  borderRadius: 6,
                  padding: "4px 10px",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr 1fr 120px",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 12 }}>Logo / Icon</label>
                <input
                  value={s.logo}
                  onChange={(e) => update(i, "logo", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    fontSize: 18,
                    textAlign: "center",
                  }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 12 }}>Organisation Name</label>
                <input
                  value={s.name}
                  onChange={(e) => update(i, "name", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    fontSize: 13,
                  }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 12 }}>Role / Badge Label</label>
                <input
                  value={s.role}
                  onChange={(e) => update(i, "role", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    fontSize: 13,
                  }}
                  placeholder="Host Institution"
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 12 }}>Tier</label>
                <select
                  value={s.tier}
                  onChange={(e) => update(i, "tier", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    fontSize: 13,
                  }}
                >
                  <option value="gold">Gold</option>
                  <option value="primary">Primary (Blue)</option>
                  <option value="silver">Silver</option>
                  <option value="bronze">Bronze</option>
                </select>
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: 12 }}>Description</label>
              <textarea
                value={s.desc}
                onChange={(e) => update(i, "desc", e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  fontSize: 13,
                  minHeight: 60,
                  resize: "vertical",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Publication Partner */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h4 style={{ marginBottom: 14, fontFamily: "Playfair Display, serif" }}>
          Publication Partner
        </h4>
        <div className="form-group" style={{ maxWidth: 300 }}>
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
      <div className="card" style={{ marginBottom: 20 }}>
        <h4 style={{ marginBottom: 14, fontFamily: "Playfair Display, serif" }}>
          Footer Sponsor Lists
        </h4>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 14 }}>
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
              style={{ minHeight: 80 }}
            />
          </div>
          <div className="form-group">
            <label>Sponsors & Funders (one per line)</label>
            <textarea
              value={footerForm.sponsors}
              onChange={(e) =>
                setFooterForm((f) => ({ ...f, sponsors: e.target.value }))
              }
              style={{ minHeight: 80 }}
            />
          </div>
        </div>
      </div>

      <button className="btn-primary" onClick={saveAll}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          Save Sponsors Page <ArrowRight size={14} />
        </span>
      </button>
    </div>
  );
}
