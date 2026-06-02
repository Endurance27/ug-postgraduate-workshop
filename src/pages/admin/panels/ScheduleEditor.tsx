import { useState } from "react";
import { X } from "lucide-react";
import { uid, TRACK_OPTIONS, TYPE_OPTIONS } from "./shared";

export default function ScheduleEditor({ schedule, onChange }) {
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
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>
        Schedule Editor
      </h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>
        Changes update the Schedule page in real-time.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {schedule.map((d, i) => (
          <button
            key={i}
            onClick={() => {
              setActiveDay(i);
              setEditingId(null);
              setAdding(false);
            }}
            style={{
              background: activeDay === i ? "#0F2347" : "#fff",
              color: activeDay === i ? "#fff" : "#333",
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: "8px 18px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {d.day}
          </button>
        ))}
      </div>

      <div
        style={{
          background: "#0F2347",
          borderRadius: "10px 10px 0 0",
          padding: "12px 20px",
        }}
      >
        <span style={{ fontWeight: 600, color: "#fff", fontSize: 14 }}>
          {day.day}
        </span>
        <span
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: 13,
            marginLeft: 14,
          }}
        >
          {day.date}
        </span>
      </div>

      <div
        style={{
          border: "1px solid #e0e0e0",
          borderTop: "none",
          borderRadius: "0 0 10px 10px",
          overflow: "hidden",
          marginBottom: 16,
        }}
      >
        {day.sessions.map((s, si) => (
          <div key={s.id}>
            {editingId === s.id ? (
              <div
                style={{
                  background: "#fffbf0",
                  padding: "14px 20px",
                  borderBottom: "1px solid #f0e0b0",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "100px 1fr 130px 160px",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <div>
                    <div
                      style={{ fontSize: 11, color: "#888", marginBottom: 3 }}
                    >
                      Time
                    </div>
                    <input
                      value={editForm.time}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, time: e.target.value }))
                      }
                      style={{
                        width: "100%",
                        padding: "6px 8px",
                        border: "1px solid #ddd",
                        borderRadius: 6,
                        fontSize: 13,
                      }}
                    />
                  </div>
                  <div>
                    <div
                      style={{ fontSize: 11, color: "#888", marginBottom: 3 }}
                    >
                      Session Title
                    </div>
                    <input
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, title: e.target.value }))
                      }
                      style={{
                        width: "100%",
                        padding: "6px 8px",
                        border: "1px solid #ddd",
                        borderRadius: 6,
                        fontSize: 13,
                      }}
                    />
                  </div>
                  <div>
                    <div
                      style={{ fontSize: 11, color: "#888", marginBottom: 3 }}
                    >
                      Type
                    </div>
                    <select
                      value={editForm.type}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, type: e.target.value }))
                      }
                      style={{
                        width: "100%",
                        padding: "6px 8px",
                        border: "1px solid #ddd",
                        borderRadius: 6,
                        fontSize: 13,
                      }}
                    >
                      {TYPE_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div
                      style={{ fontSize: 11, color: "#888", marginBottom: 3 }}
                    >
                      Track
                    </div>
                    <select
                      value={editForm.track}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, track: e.target.value }))
                      }
                      style={{
                        width: "100%",
                        padding: "6px 8px",
                        border: "1px solid #ddd",
                        borderRadius: 6,
                        fontSize: 13,
                      }}
                    >
                      {TRACK_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t || "— None —"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: "#888", marginBottom: 3 }}>
                    Presenter / Speaker
                  </div>
                  <input
                    value={editForm.presenter}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, presenter: e.target.value }))
                    }
                    style={{
                      width: "100%",
                      padding: "6px 8px",
                      border: "1px solid #ddd",
                      borderRadius: 6,
                      fontSize: 13,
                    }}
                    placeholder="e.g. Prof. Kwame Asante"
                  />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={saveEdit}
                    className="btn-primary"
                    style={{ padding: "7px 18px", fontSize: 13 }}
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    style={{
                      background: "#f0f0f0",
                      border: "none",
                      borderRadius: 8,
                      padding: "7px 14px",
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "90px 1fr auto",
                  alignItems: "center",
                  padding: "12px 20px",
                  gap: 12,
                  background: si % 2 === 0 ? "#fff" : "#fafafa",
                  borderBottom:
                    si < day.sessions.length - 1 ? "1px solid #f0f0f0" : "none",
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 500, color: "#555" }}>
                  {s.time}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{s.title}</div>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      marginTop: 3,
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        background: "#f0f0f0",
                        color: typeColors[s.type] || "#555",
                        padding: "2px 8px",
                        borderRadius: 10,
                        fontWeight: 600,
                      }}
                    >
                      {s.type}
                    </span>
                    {s.track && (
                      <span style={{ fontSize: 11, color: "#888" }}>
                        {s.track}
                      </span>
                    )}
                    {s.presenter && (
                      <span style={{ fontSize: 11, color: "#888" }}>
                        · {s.presenter}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => startEdit(s)}
                    style={{
                      background: "#E5EAF3",
                      color: "#1B3A6B",
                      border: "none",
                      borderRadius: 6,
                      padding: "5px 12px",
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteSession(s.id)}
                    style={{
                      background: "#fdecea",
                      color: "#c0392b",
                      border: "none",
                      borderRadius: 6,
                      padding: "5px 10px",
                      fontSize: 12,
                      cursor: "pointer",
                    }}
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
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#b5700a",
              marginBottom: 12,
            }}
          >
            New Session
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "100px 1fr 130px 160px",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 3 }}>
                Time
              </div>
              <input
                value={addForm.time}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, time: e.target.value }))
                }
                placeholder="e.g. 10:00 AM"
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  fontSize: 13,
                }}
              />
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 3 }}>
                Title
              </div>
              <input
                value={addForm.title}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Session title"
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  fontSize: 13,
                }}
              />
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 3 }}>
                Type
              </div>
              <select
                value={addForm.type}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, type: e.target.value }))
                }
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  fontSize: 13,
                }}
              >
                {TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 3 }}>
                Track
              </div>
              <select
                value={addForm.track}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, track: e.target.value }))
                }
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  fontSize: 13,
                }}
              >
                {TRACK_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t || "— None —"}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 3 }}>
              Presenter
            </div>
            <input
              value={addForm.presenter}
              onChange={(e) =>
                setAddForm((f) => ({ ...f, presenter: e.target.value }))
              }
              placeholder="Optional"
              style={{
                width: "100%",
                padding: "6px 8px",
                border: "1px solid #ddd",
                borderRadius: 6,
                fontSize: 13,
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={addSession}
              className="btn-primary"
              style={{ padding: "8px 18px", fontSize: 13 }}
            >
              Add Session
            </button>
            <button
              onClick={() => setAdding(false)}
              style={{
                background: "#f0f0f0",
                border: "none",
                borderRadius: 8,
                padding: "8px 14px",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#fff",
            border: "2px dashed #ddd",
            borderRadius: 10,
            padding: "12px 20px",
            fontSize: 13,
            color: "#888",
            cursor: "pointer",
            width: "100%",
            justifyContent: "center",
            transition: "border-color 0.2s, color 0.2s",
          }}
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
