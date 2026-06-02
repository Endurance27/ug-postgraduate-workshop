import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { ToggleRow } from "./shared";
import { useAdminContext } from "../../../context/AdminContext";

export default function RegisterPanel() {
  const { siteContent, updateContent } = useAdminContext();
  const event = siteContent.event as Record<string, any>;
  const onChange = (v: unknown) => updateContent("event", v);
  const [form, setForm] = useState({ ...event });
  const [saved, setSaved] = useState(false);
  const save = () => {
    onChange(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-[560px]">
      <h2 className="mb-1.5 font-serif">Register Page</h2>
      <p className="text-[#666] text-sm mb-7">
        Control registration availability and fee shown on the Register page.
      </p>
      {saved && (
        <div className="alert alert-success mb-5">
          <Check
            size={14}
            className="inline align-middle mr-1"
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
        <div className="form-group max-w-[200px] mt-4">
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
        <div className="form-group mt-4">
          <label>Paystack Public Key</label>
          <input
            value={form.paystackKey || ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, paystackKey: e.target.value }))
            }
            placeholder="pk_live_xxxxxxxxxxxxxxxxxxxxxxxx"
          />
          <p className="text-xs text-[#888] mt-1">
            Get your key from <strong>paystack.com/dashboard</strong>. Also add
            to <code>index.html</code>:<br />
            <code className="text-[11px]">
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
          <span className="inline-flex items-center gap-1.5">
            Save Register Settings <ArrowRight size={14} />
          </span>
        </button>
      </div>
    </div>
  );
}
