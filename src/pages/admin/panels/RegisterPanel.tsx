import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { ToggleRow } from "./shared";

export default function RegisterPanel({ event, onChange }) {
  const [form, setForm] = useState({ ...event });
  const [saved, setSaved] = useState(false);
  const save = () => {
    onChange(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ maxWidth: 560 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>
        Register Page
      </h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 28 }}>
        Control registration availability and fee shown on the Register page.
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
          Saved — changes are live on the Register page.
        </div>
      )}

      <div className="card">
        <ToggleRow
          label="Registration Open"
          desc="Visitors can submit the registration form"
          value={form.registrationOpen}
          onChange={(v) => setForm((f) => ({ ...f, registrationOpen: v }))}
        />
        <ToggleRow
          label="Submissions Open"
          desc="Participants can submit paper abstracts"
          value={form.submissionsOpen}
          onChange={(v) => setForm((f) => ({ ...f, submissionsOpen: v }))}
        />
        <div className="form-group" style={{ maxWidth: 200, marginTop: 16 }}>
          <label>Registration Fee (GHS)</label>
          <input
            type="number"
            min="0"
            value={form.fee}
            onChange={(e) =>
              setForm((f) => ({ ...f, fee: Number(e.target.value) }))
            }
          />
        </div>
        <div className="form-group" style={{ marginTop: 16 }}>
          <label>Paystack Public Key</label>
          <input
            value={form.paystackKey || ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, paystackKey: e.target.value }))
            }
            placeholder="pk_live_xxxxxxxxxxxxxxxxxxxxxxxx"
          />
          <p style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
            Get your key from <strong>paystack.com/dashboard</strong>. Also add
            to <code>index.html</code>:<br />
            <code style={{ fontSize: 11 }}>
              &lt;script
              src="https://js.paystack.co/v1/inline.js"&gt;&lt;/script&gt;
            </code>
          </p>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Event Dates</label>
            <input
              value={form.dates}
              onChange={(e) =>
                setForm((f) => ({ ...f, dates: e.target.value }))
              }
              placeholder="27–29 August 2026"
            />
          </div>
          <div className="form-group">
            <label>Venue</label>
            <input
              value={form.venue}
              onChange={(e) =>
                setForm((f) => ({ ...f, venue: e.target.value }))
              }
            />
          </div>
        </div>
        <button className="btn-primary" onClick={save}>
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            Save Register Settings <ArrowRight size={14} />
          </span>
        </button>
      </div>
    </div>
  );
}
