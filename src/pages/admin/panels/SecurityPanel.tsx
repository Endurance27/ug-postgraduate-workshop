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
    <div className="max-w-[620px]">
      <h2 className="mb-1.5 font-serif">Security Settings</h2>
      <p className="text-[#666] text-sm mb-6">
        Manage admin access and account security.
      </p>

      {status && (
        <div
          className="mb-5 px-4 py-3 rounded-[10px] text-[13px] border"
          style={{
            background: status.type === "success" ? "#f0faf4" : "#fff3f3",
            borderColor: status.type === "success" ? "#a8d5b5" : "#f5b8b8",
            color: status.type === "success" ? "#1e7e3e" : "#c0392b",
          }}
        >
          {status.type === "success" ? (
            <Check size={13} className="inline align-middle mr-1" />
          ) : (
            <AlertCircle size={13} className="inline align-middle mr-1" />
          )}
          {status.msg}
        </div>
      )}

      {/* Current account */}
      <div className="bg-[#f4f6fb] rounded-xl px-5 py-4 mb-6 border border-[#e0e4ef] flex items-center gap-4">
        <div className="w-11 h-11 rounded-full bg-ug-blue flex items-center justify-center text-ug-gold text-xl flex-shrink-0">
          {user?.email?.[0]?.toUpperCase() || "A"}
        </div>
        <div>
          <div className="text-sm font-semibold text-ug-navy">
            {user?.email}
          </div>
          <div
            className="text-xs mt-0.5"
            style={{ color: user?.emailVerified ? "#27ae60" : "#e67e22" }}
          >
            {user?.emailVerified ? (
              <>
                <Check size={12} className="inline align-middle mr-0.5" />{" "}
                Email verified
              </>
            ) : (
              <>
                <AlertCircle size={12} className="inline align-middle mr-0.5" />{" "}
                Email not verified
              </>
            )}
          </div>
        </div>
      </div>

      {/* Password reset */}
      <div className="card mb-6">
        <h4 className="font-serif mb-2">Change Password</h4>
        <p className="text-[#666] text-[13px] mb-4">
          Firebase will email a secure password reset link to your account
          email.
        </p>
        {resetSent ? (
          <div className="bg-[#f0faf4] border border-[#a8d5b5] rounded-[10px] px-4 py-3 text-[13px] text-[#1e7e3e]">
            <Check size={14} className="inline align-middle mr-1" />{" "}
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
              <span className="inline-flex items-center gap-1.5">
                Send Password Reset Email <ArrowRight size={14} />
              </span>
            )}
          </button>
        )}
      </div>

      {/* Admin allowlist */}
      <div className="card mb-6">
        <h4 className="font-serif mb-2">Admin Email Allowlist</h4>
        <p className="text-[#666] text-[13px] mb-4">
          Only emails in this list can sign in to the admin console. Leave the
          list <strong>empty</strong> to allow any verified Firebase account.
        </p>

        {allowlist.length === 0 ? (
          <div className="bg-[#fffbea] border border-[#f0d080] rounded-lg px-3.5 py-2.5 text-[13px] text-[#7a6000] mb-4">
            No allowlist — any verified account can access this console. Add
            emails below to restrict access.
          </div>
        ) : (
          <div className="mb-4">
            {allowlist.map((email) => (
              <div
                key={email}
                className="flex items-center justify-between px-3.5 py-[9px] bg-[#f8f9fb] rounded-lg mb-1.5 border border-[#e8eaf0]"
              >
                <span className="text-[13px] text-[#333]">{email}</span>
                <button
                  onClick={() => removeEmail(email)}
                  className="bg-transparent border-none text-[#c0392b] text-xs cursor-pointer font-semibold"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2.5">
          <input
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="admin@example.com"
            onKeyDown={(e) => e.key === "Enter" && addEmail()}
            className="flex-1 px-3.5 py-[9px] border-[1.5px] border-[#ddd] rounded-lg text-sm"
          />
          <button
            className="btn-primary whitespace-nowrap"
            onClick={addEmail}
          >
            Add Email
          </button>
        </div>
      </div>

      {/* Session info */}
      <div className="card">
        <h4 className="font-serif mb-3">Session & Security Info</h4>
        <div className="text-[13px] text-[#555] leading-[1.9]">
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
          <div className="mt-2">
            <a
              href="https://console.firebase.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ug-blue font-semibold inline-flex items-center gap-1"
            >
              Open Firebase Console <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
