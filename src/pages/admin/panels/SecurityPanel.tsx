import { useState } from "react";
import { Check, AlertCircle, ArrowRight } from "lucide-react";
import { auth, sendPasswordResetEmail } from "../../../firebase";

const ALLOWLIST_KEY = "dcs-admin-allowlist";

function getAllowlist() {
  try {
    return JSON.parse(localStorage.getItem(ALLOWLIST_KEY) || "[]");
  } catch {
    return [];
  }
}

function firebaseErrorMsg(code) {
  const map = {
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/invalid-credential": "Invalid email or password.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/too-many-requests": "Too many attempts. Please wait and try again.",
    "auth/network-request-failed": "Network error. Check your connection.",
    "auth/missing-password": "Please enter your password.",
    "auth/operation-not-allowed":
      "Email/password sign-in is disabled in Firebase Auth.",
    "auth/configuration-not-found":
      "Firebase Auth is not enabled for this project.",
  };
  return map[code] || "Something went wrong. Please try again.";
}

export default function SecurityPanel() {
  const [status, setStatus] = useState(null);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [newEntry, setNewEntry] = useState("");
  const [allowlist, setAllowlist] = useState(getAllowlist);

  const user = auth.currentUser;

  function saveAllowlist(list) {
    setAllowlist(list);
    localStorage.setItem(ALLOWLIST_KEY, JSON.stringify(list));
  }

  function addEmail() {
    const e = newEntry.trim().toLowerCase();
    if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      setStatus({ type: "error", msg: "Please enter a valid email address." });
      return;
    }
    if (allowlist.includes(e)) {
      setStatus({ type: "error", msg: "This email is already in the list." });
      return;
    }
    saveAllowlist([...allowlist, e]);
    setNewEntry("");
    setStatus({ type: "success", msg: `${e} added to the admin allowlist.` });
  }

  function removeEmail(email) {
    if (user && email === (user.email || "").toLowerCase()) {
      setStatus({
        type: "error",
        msg: "You cannot remove your own email from the allowlist.",
      });
      return;
    }
    saveAllowlist(allowlist.filter((e) => e !== email));
    setStatus({ type: "success", msg: `${email} removed.` });
  }

  async function sendReset() {
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      setResetSent(true);
    } catch (e) {
      setStatus({ type: "error", msg: firebaseErrorMsg(e.code) });
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 620 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>
        Security Settings
      </h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>
        Manage admin access and account security.
      </p>

      {status && (
        <div
          style={{
            marginBottom: 20,
            padding: "12px 16px",
            borderRadius: 10,
            fontSize: 13,
            background: status.type === "success" ? "#f0faf4" : "#fff3f3",
            border: `1px solid ${status.type === "success" ? "#a8d5b5" : "#f5b8b8"}`,
            color: status.type === "success" ? "#1e7e3e" : "#c0392b",
          }}
        >
          {status.type === "success" ? (
            <Check
              size={13}
              style={{
                display: "inline",
                verticalAlign: "middle",
                marginRight: 4,
              }}
            />
          ) : (
            <AlertCircle
              size={13}
              style={{
                display: "inline",
                verticalAlign: "middle",
                marginRight: 4,
              }}
            />
          )}
          {status.msg}
        </div>
      )}

      {/* Current account */}
      <div
        style={{
          background: "#f4f6fb",
          borderRadius: 12,
          padding: "16px 20px",
          marginBottom: 24,
          border: "1px solid #e0e4ef",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "#1B3A6B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#C9A84C",
            fontSize: 20,
            flexShrink: 0,
          }}
        >
          {user?.email?.[0]?.toUpperCase() || "A"}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#0F2347" }}>
            {user?.email}
          </div>
          <div
            style={{
              fontSize: 12,
              color: user?.emailVerified ? "#27ae60" : "#e67e22",
              marginTop: 2,
            }}
          >
            {user?.emailVerified ? (
              <>
                <Check
                  size={12}
                  style={{
                    display: "inline",
                    verticalAlign: "middle",
                    marginRight: 3,
                  }}
                />{" "}
                Email verified
              </>
            ) : (
              <>
                <AlertCircle
                  size={12}
                  style={{
                    display: "inline",
                    verticalAlign: "middle",
                    marginRight: 3,
                  }}
                />{" "}
                Email not verified
              </>
            )}
          </div>
        </div>
      </div>

      {/* Password reset */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h4 style={{ fontFamily: "Playfair Display, serif", marginBottom: 8 }}>
          Change Password
        </h4>
        <p style={{ color: "#666", fontSize: 13, marginBottom: 16 }}>
          Firebase will email a secure password reset link to your account
          email.
        </p>
        {resetSent ? (
          <div
            style={{
              background: "#f0faf4",
              border: "1px solid #a8d5b5",
              borderRadius: 10,
              padding: "12px 16px",
              fontSize: 13,
              color: "#1e7e3e",
            }}
          >
            <Check
              size={14}
              style={{
                display: "inline",
                verticalAlign: "middle",
                marginRight: 4,
              }}
            />{" "}
            Password reset email sent to <strong>{user?.email}</strong>. Check
            your inbox.
          </div>
        ) : (
          <button
            className="btn-primary"
            onClick={sendReset}
            disabled={resetLoading}
            style={{
              opacity: resetLoading ? 0.65 : 1,
              cursor: resetLoading ? "not-allowed" : "pointer",
            }}
          >
            {resetLoading ? (
              "Sending…"
            ) : (
              <span
                style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                Send Password Reset Email <ArrowRight size={14} />
              </span>
            )}
          </button>
        )}
      </div>

      {/* Admin allowlist */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h4 style={{ fontFamily: "Playfair Display, serif", marginBottom: 8 }}>
          Admin Email Allowlist
        </h4>
        <p style={{ color: "#666", fontSize: 13, marginBottom: 16 }}>
          Only emails in this list can sign in to the admin console. Leave the
          list <strong>empty</strong> to allow any verified Firebase account.
        </p>

        {allowlist.length === 0 ? (
          <div
            style={{
              background: "#fffbea",
              border: "1px solid #f0d080",
              borderRadius: 8,
              padding: "10px 14px",
              fontSize: 13,
              color: "#7a6000",
              marginBottom: 16,
            }}
          >
            No allowlist — any verified account can access this console. Add
            emails below to restrict access.
          </div>
        ) : (
          <div style={{ marginBottom: 16 }}>
            {allowlist.map((email) => (
              <div
                key={email}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "9px 14px",
                  background: "#f8f9fb",
                  borderRadius: 8,
                  marginBottom: 6,
                  border: "1px solid #e8eaf0",
                }}
              >
                <span style={{ fontSize: 13, color: "#333" }}>{email}</span>
                <button
                  onClick={() => removeEmail(email)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#c0392b",
                    fontSize: 12,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="admin@example.com"
            onKeyDown={(e) => e.key === "Enter" && addEmail()}
            style={{
              flex: 1,
              padding: "9px 14px",
              border: "1.5px solid #ddd",
              borderRadius: 8,
              fontSize: 14,
            }}
          />
          <button
            className="btn-primary"
            onClick={addEmail}
            style={{ whiteSpace: "nowrap" }}
          >
            Add Email
          </button>
        </div>
      </div>

      {/* Session info */}
      <div className="card">
        <h4 style={{ fontFamily: "Playfair Display, serif", marginBottom: 12 }}>
          Session & Security Info
        </h4>
        <div style={{ fontSize: 13, color: "#555", lineHeight: 1.9 }}>
          <div>
            Authentication is powered by <strong>Firebase Auth</strong> —
            sessions persist across page refreshes.
          </div>
          <div>
            Email verification is required before accessing the admin console.
          </div>
          <div>
            Firebase automatically rate-limits repeated failed login attempts.
          </div>
          <div style={{ marginTop: 8 }}>
            <a
              href="https://console.firebase.google.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#1B3A6B",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              Open Firebase Console <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
