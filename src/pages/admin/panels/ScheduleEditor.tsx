import { useState } from "react";
import { X } from "lucide-react";
import { uid, TRACK_OPTIONS, TYPE_OPTIONS } from "./shared";
import { useAdminContext } from "../../../context/AdminContext";

export default function ScheduleEditor() {
  const { siteContent, updateContent } = useAdminContext();
  const schedule = siteContent.schedule as any[];
  const onChange = (v: unknown) => updateContent("schedule", v);
  const [activeDay, setActiveDay] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState<Record<string, string>>({});
  const [addForm, setAddForm] = useState({
    time: "",
    title: "",
    type: "plenary",
    track: "",
    presenter: "",
  });
  const [adding, setAdding] = useState(false);

  const day = schedule[activeDay];

  const startEdit = (s) => {
    setEditingId(s.id);
    setEditForm({ ...s });
  };
  const cancelEdit = () => {
    setEditingId(null);
  };
  const saveEdit = () => {
    const updated = schedule.map((d, i) =>
      i === activeDay
        ? {
            ...d,
            sessions: d.sessions.map((s) =>
              s.id === editingId ? { ...editForm } : s,
            ),
          }
        : d,
    );
    onChange(updated);
    setEditingId(null);
  };

  const deleteSession = (id) => {
    onChange(
      schedule.map((d, i) =>
        i === activeDay
          ? { ...d, sessions: d.sessions.filter((s) => s.id !== id) }
          : d,
      ),
    );
  };

  const addSession = () => {
    if (!addForm.time.trim() || !addForm.title.trim()) return;
    const updated = schedule.map((d, i) =>
      i === activeDay
        ? { ...d, sessions: [...d.sessions, { id: uid(), ...addForm }] }
        : d,
    );
    onChange(updated);
    setAddForm({
      time: "",
      title: "",
      type: "plenary",
      track: "",
      presenter: "",
    });
    setAdding(false);
  };

  const typeColors = {
    plenary: "#1B3A6B",
    parallel: "#0F2347",
    track: "#b5700a",
    break: "#777",
  };

  return (
    <div>
      <h2 className="mb-1.5 font-serif">
        Schedule Editor
      </h2>
      <p className="text-[#666] text-sm mb-6">
        Changes update the Schedule page in real-time.
      </p>

      <div className="flex gap-2 mb-6">
        {schedule.map((d, i) => (
          <button
            key={i}
            onClick={() => {
              setActiveDay(i);
              setEditingId(null);
              setAdding(false);
            }}
            className={`border border-[#ddd] rounded-lg px-[18px] py-2 text-[13px] font-semibold cursor-pointer ${
              activeDay === i
                ? "bg-ug-navy text-white"
                : "bg-white text-[#333]"
            }`}
          >
            {d.day}
          </button>
        ))}
      </div>

      <div className="bg-ug-navy rounded-t-[10px] px-5 py-3">
        <span className="font-semibold text-white text-sm">
          {day.day}
        </span>
        <span className="text-white/60 text-[13px] ml-[14px]">
          {day.date}
        </span>
      </div>

      <div className="border border-[#e0e0e0] border-t-0 rounded-b-[10px] overflow-hidden mb-4">
        {day.sessions.map((s, si) => (
          <div key={s.id}>
            {editingId === s.id ? (
              <div className="bg-[#fffbf0] p-[14px_20px] border-b border-[#f0e0b0]">
                <div className="grid grid-cols-[100px_1fr_130px_160px] gap-[10px] mb-[10px]">
                  <div>
                    <div className="text-[11px] text-[#888] mb-[3px]">
                      Time
                    </div>
                    <input
                      value={editForm.time}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, time: e.target.value }))
                      }
                      className="w-full p-[6px_8px] border border-[#ddd] rounded-md text-[13px]"
                    />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#888] mb-[3px]">
                      Session Title
                    </div>
                    <input
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, title: e.target.value }))
                      }
                      className="w-full p-[6px_8px] border border-[#ddd] rounded-md text-[13px]"
                    />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#888] mb-[3px]">
                      Type
                    </div>
                    <select
                      value={editForm.type}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, type: e.target.value }))
                      }
                      className="w-full p-[6px_8px] border border-[#ddd] rounded-md text-[13px]"
                    >
                      {TYPE_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#888] mb-[3px]">
                      Track
                    </div>
                    <select
                      value={editForm.track}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, track: e.target.value }))
                      }
                      className="w-full p-[6px_8px] border border-[#ddd] rounded-md text-[13px]"
                    >
                      {TRACK_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t || "— None —"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-[10px]">
                  <div className="text-[11px] text-[#888] mb-[3px]">
                    Presenter / Speaker
                  </div>
                  <input
                    value={editForm.presenter}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, presenter: e.target.value }))
                    }
                    className="w-full p-[6px_8px] border border-[#ddd] rounded-md text-[13px]"
                    placeholder="e.g. Prof. Kwame Asante"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={saveEdit}
                    className="btn-primary"
                    style={{ padding: "7px 18px", fontSize: 13 }}
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-[#f0f0f0] border-none rounded-lg px-[14px] py-[7px] text-[13px] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`grid grid-cols-[90px_1fr_auto] items-center px-5 py-3 gap-3 border-b border-[#f0f0f0] ${
                  si % 2 === 0 ? "bg-white" : "bg-[#fafafa]"
                } ${si >= day.sessions.length - 1 ? "border-b-0" : ""}`}
              >
                <div className="text-[13px] font-medium text-[#555]">
                  {s.time}
                </div>
                <div>
                  <div className="text-sm font-semibold">{s.title}</div>
                  <div className="flex gap-2 mt-[3px] flex-wrap">
                    <span
                      className="text-[11px] bg-[#f0f0f0] px-2 py-[2px] rounded-[10px] font-semibold"
                      style={{ color: typeColors[s.type] || "#555" }}
                    >
                      {s.type}
                    </span>
                    {s.track && (
                      <span className="text-[11px] text-[#888]">
                        {s.track}
                      </span>
                    )}
                    {s.presenter && (
                      <span className="text-[11px] text-[#888]">
                        · {s.presenter}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-[6px]">
                  <button
                    onClick={() => startEdit(s)}
                    className="bg-ug-blue-light text-ug-blue border-none rounded-md px-3 py-[5px] text-xs cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteSession(s.id)}
                    className="bg-[#fdecea] text-[#c0392b] border-none rounded-md px-[10px] py-[5px] text-xs cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {adding ? (
        <div className="card" style={{ border: "2px dashed #C9A84C" }}>
          <div className="text-[13px] font-semibold text-[#b5700a] mb-3">
            New Session
          </div>
          <div className="grid grid-cols-[100px_1fr_130px_160px] gap-[10px] mb-[10px]">
            <div>
              <div className="text-[11px] text-[#888] mb-[3px]">
                Time
              </div>
              <input
                value={addForm.time}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, time: e.target.value }))
                }
                placeholder="e.g. 10:00 AM"
                className="w-full p-[6px_8px] border border-[#ddd] rounded-md text-[13px]"
              />
            </div>
            <div>
              <div className="text-[11px] text-[#888] mb-[3px]">
                Title
              </div>
              <input
                value={addForm.title}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Session title"
                className="w-full p-[6px_8px] border border-[#ddd] rounded-md text-[13px]"
              />
            </div>
            <div>
              <div className="text-[11px] text-[#888] mb-[3px]">
                Type
              </div>
              <select
                value={addForm.type}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, type: e.target.value }))
                }
                className="w-full p-[6px_8px] border border-[#ddd] rounded-md text-[13px]"
              >
                {TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-[11px] text-[#888] mb-[3px]">
                Track
              </div>
              <select
                value={addForm.track}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, track: e.target.value }))
                }
                className="w-full p-[6px_8px] border border-[#ddd] rounded-md text-[13px]"
              >
                {TRACK_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t || "— None —"}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-3">
            <div className="text-[11px] text-[#888] mb-[3px]">
              Presenter
            </div>
            <input
              value={addForm.presenter}
              onChange={(e) =>
                setAddForm((f) => ({ ...f, presenter: e.target.value }))
              }
              placeholder="Optional"
              className="w-full p-[6px_8px] border border-[#ddd] rounded-md text-[13px]"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={addSession}
              className="btn-primary"
              style={{ padding: "8px 18px", fontSize: 13 }}
            >
              Add Session
            </button>
            <button
              onClick={() => setAdding(false)}
              className="bg-[#f0f0f0] border-none rounded-lg px-[14px] py-2 text-[13px] cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 bg-white border-2 border-dashed border-[#ddd] rounded-[10px] px-5 py-3 text-[13px] text-[#888] cursor-pointer w-full justify-center transition-[border-color,color] duration-200"
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#C9A84C";
            e.currentTarget.style.color = "#b5700a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#ddd";
            e.currentTarget.style.color = "#888";
          }}
        >
          + Add Session to {day.day}
        </button>
      )}
    </div>
  );
}
