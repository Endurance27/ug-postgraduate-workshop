import { useState, useEffect } from "react";
import { Outlet, useNavigate as useAdminNavigate, useLocation } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AdminPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  siteContent: { [key: string]: any };
  updateContent: (section: string | Record<string, unknown>, value?: unknown) => void;
  navigate?: (page: string) => void;
}
import {
  Home,
  Info,
  Calendar,
  Tv,
  Mic,
  Trophy,
  Handshake,
  Phone,
  FileText,
  Image,
  Link,
  Shield,
  LayoutDashboard,
  Users,
  Megaphone,
  Radio,
  Film,
  HelpCircle,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Check,
  ClipboardList,
  CreditCard,
} from "lucide-react";
import {
  auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
} from "../firebase";


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


const SLIDE_IMAGES = [
  { src: "/images/dcs-research.jpg", caption: "Research in Action" },
  {
    src: "/images/collaboration-networking.jpeg",
    caption: "Collaboration & Networking",
  },
  {
    src: "/images/research-presentations.jpg",
    caption: "Academic Presentations",
  },
  { src: "/images/workshop-sessions.jpg", caption: "Workshop Excellence" },
];

const SIDEBAR_PAGES = [
  { key: "home", icon: Home, label: "Home" },
  { key: "about", icon: Info, label: "About" },
  { key: "schedule", icon: Calendar, label: "Schedule" },
  { key: "stream", icon: Tv, label: "Livestream" },
  { key: "speakers", icon: Mic, label: "Speakers" },
  { key: "awards", icon: Trophy, label: "Awards" },
  { key: "sponsors", icon: Handshake, label: "Sponsors" },
  { key: "contact", icon: Phone, label: "Contact" },
  { key: "register", icon: ClipboardList, label: "Register" },
  { key: "gallery", icon: Image, label: "Gallery" },
  { key: "recordings", icon: Film, label: "Recordings" },
  { key: "support", icon: HelpCircle, label: "Support" },
];

const SIDEBAR_TOOLS = [
  { key: "overview", icon: LayoutDashboard, label: "Dashboard" },
  { key: "participants", icon: Users, label: "Participants" },
  { key: "payments", icon: CreditCard, label: "Payments" },
  { key: "submissions", icon: FileText, label: "Submissions" },
  { key: "announcements", icon: Megaphone, label: "Announcements" },
  { key: "feed", icon: Radio, label: "Live Feed" },
  { key: "images", icon: Image, label: "Site Images" },
  { key: "footer", icon: Link, label: "Footer" },
  { key: "security", icon: Shield, label: "Security" },
];


export default function AdminPage({ siteContent, updateContent, navigate }: AdminPageProps) {
  const [fireUser, setFireUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authView, setAuthView] = useState("signin"); // "signin" | "signup" | "forgot"
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [authError, setAuthError] = useState("");
  const [authMsg, setAuthMsg] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const adminNav = useAdminNavigate();
  const location = useLocation();
  const activeSection = location.pathname.replace(/^\/admin\/?/, "") || "overview";

  const [slide, setSlide] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setSlide((s) => (s + 1) % SLIDE_IMAGES.length);
        setFading(false);
      }, 600);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Firebase auth state listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        const list = getAllowlist();
        if (list.length > 0 && !list.includes((u.email || "").toLowerCase())) {
          signOut(auth);
          setAuthError(
            "This email is not authorised to access the admin console.",
          );
          setFireUser(null);
        } else {
          setFireUser(u);
        }
      } else {
        setFireUser(null);
      }
      setAuthReady(true);
    });
    return unsub;
  }, []);

  function resetForm() {
    setForm({ email: "", password: "", confirm: "" });
    setAuthError("");
    setAuthMsg("");
  }

  async function handleSignIn() {
    setAuthError("");
    setAuthMsg("");
    if (!form.email || !form.password) {
      setAuthError("Please enter your email and password.");
      return;
    }
    setAuthLoading(true);
    try {
      await signInWithEmailAndPassword(auth, form.email.trim(), form.password);
    } catch (e) {
      setAuthError(firebaseErrorMsg(e.code));
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleSignUp() {
    setAuthError("");
    setAuthMsg("");
    if (!form.email || !form.password) {
      setAuthError("Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirm) {
      setAuthError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setAuthError("Password must be at least 6 characters.");
      return;
    }
    setAuthLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        form.email.trim(),
        form.password,
      );
      try {
        await sendEmailVerification(credential.user);
      } catch (verifyError) {
        console.warn("Email verification failed:", verifyError.message);
      }
      setAuthMsg("Account created! Signing you in…");
    } catch (e) {
      setAuthError(firebaseErrorMsg(e.code));
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleForgotPassword() {
    setAuthError("");
    setAuthMsg("");
    if (!form.email) {
      setAuthError("Please enter your email address.");
      return;
    }
    setAuthLoading(true);
    try {
      await sendPasswordResetEmail(auth, form.email.trim());
      setAuthMsg("Password reset email sent. Check your inbox.");
    } catch (e) {
      setAuthError(firebaseErrorMsg(e.code));
    } finally {
      setAuthLoading(false);
    }
  }

  // ── Loading while Firebase resolves auth state ──
  if (!authReady)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f1f3f7",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ marginBottom: 16, color: "#1B3A6B" }}>
            <Shield size={36} />
          </div>
          <p style={{ color: "#555", fontSize: 15 }}>Loading admin console…</p>
        </div>
      </div>
    );

  if (!fireUser)
    return (
      <main style={{ minHeight: "100vh", display: "flex" }}>
        {/* ── Left: image slideshow ── */}
        <div
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            minHeight: 500,
            display: "flex",
          }}
          className="admin-slide-panel"
        >
          {SLIDE_IMAGES.map((img, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url('${img.src}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: i === slide ? (fading ? 0 : 1) : 0,
                transition: "opacity 0.6s ease",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(135deg, rgba(15,35,71,0.75) 0%, rgba(27,58,107,0.55) 100%)",
                }}
              />
            </div>
          ))}

          {/* Overlay content */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "48px 40px",
              width: "100%",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-block",
                  background: "rgba(201,168,76,0.2)",
                  border: "1px solid rgba(201,168,76,0.4)",
                  borderRadius: 8,
                  padding: "6px 14px",
                  marginBottom: 24,
                }}
              >
                <span
                  style={{ color: "#C9A84C", fontSize: 13, fontWeight: 600 }}
                >
                  DCS Workshop 2026
                </span>
              </div>
              <h2
                style={{
                  color: "#fff",
                  fontFamily: "Playfair Display, serif",
                  fontSize: "2rem",
                  lineHeight: 1.3,
                  maxWidth: 340,
                }}
              >
                Postgraduate Research Workshop Administration
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.7)",
                  marginTop: 14,
                  fontSize: 15,
                  maxWidth: 340,
                }}
              >
                Manage registrations, submissions, schedule, and live updates
                for the 2nd Annual Workshop.
              </p>
            </div>

            {/* Slide caption + dots */}
            <div>
              <p
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 13,
                  marginBottom: 12,
                  fontStyle: "italic",
                }}
              >
                {SLIDE_IMAGES[slide].caption}
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                {SLIDE_IMAGES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSlide(i);
                    }}
                    style={{
                      width: i === slide ? 24 : 8,
                      height: 8,
                      borderRadius: 4,
                      background:
                        i === slide ? "#C9A84C" : "rgba(255,255,255,0.35)",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      transition: "all 0.3s ease",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: auth form ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 40px",
            background: "#fff",
          }}
          className="admin-form-panel"
        >
          <div style={{ width: "100%", maxWidth: 400 }}>
            {/* ── SIGN IN ── */}
            {authView === "signin" && (
              <>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#C9A84C",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: 10,
                    }}
                  >
                    Admin Console
                  </div>
                  <h2
                    style={{
                      fontFamily: "Playfair Display, serif",
                      fontSize: "2rem",
                      color: "#0F2347",
                      marginBottom: 8,
                    }}
                  >
                    Welcome Back
                  </h2>
                  <p style={{ color: "#666", fontSize: 15 }}>
                    Sign in to manage the workshop.
                  </p>
                </div>
                <div
                  style={{ borderTop: "1px solid #e8eaf0", marginBottom: 28 }}
                />
                {authError && (
                  <div
                    style={{
                      background: "#fff3f3",
                      border: "1px solid #f5b8b8",
                      borderRadius: 10,
                      padding: "10px 14px",
                      marginBottom: 18,
                      color: "#c0392b",
                      fontSize: 13,
                    }}
                  >
                    {authError}
                  </div>
                )}
                {authMsg && (
                  <div
                    style={{
                      background: "#f0faf4",
                      border: "1px solid #a8d5b5",
                      borderRadius: 10,
                      padding: "10px 14px",
                      marginBottom: 18,
                      color: "#1e7e3e",
                      fontSize: 13,
                    }}
                  >
                    {authMsg}
                  </div>
                )}
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    autoComplete="username"
                    value={form.email}
                    disabled={authLoading}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, email: e.target.value }));
                      setAuthError("");
                    }}
                    placeholder="admin@ug.edu.gh"
                  />
                </div>
                <div className="form-group">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <label style={{ margin: 0 }}>Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        setAuthView("forgot");
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#1B3A6B",
                        fontSize: 12,
                        cursor: "pointer",
                        padding: 0,
                        fontWeight: 600,
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPass ? "text" : "password"}
                      autoComplete="current-password"
                      value={form.password}
                      disabled={authLoading}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, password: e.target.value }));
                        setAuthError("");
                      }}
                      placeholder="••••••••"
                      style={{ paddingRight: 44 }}
                      onKeyDown={(e) =>
                        e.key === "Enter" && !authLoading && handleSignIn()
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#888",
                        fontSize: 16,
                        padding: 0,
                      }}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button
                  className="btn-primary"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    padding: "14px",
                    fontSize: 15,
                    borderRadius: 10,
                    marginTop: 8,
                    opacity: authLoading ? 0.65 : 1,
                    cursor: authLoading ? "not-allowed" : "pointer",
                  }}
                  onClick={handleSignIn}
                  disabled={authLoading}
                >
                  {authLoading ? (
                    "Signing in…"
                  ) : (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      Sign In <ArrowRight size={14} />
                    </span>
                  )}
                </button>
                <div style={{ textAlign: "center", marginTop: 20 }}>
                  <span style={{ color: "#888", fontSize: 13 }}>
                    Don't have an account?{" "}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setAuthView("signup");
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#1B3A6B",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    Create account
                  </button>
                </div>
              </>
            )}

            {/* ── SIGN UP ── */}
            {authView === "signup" && (
              <>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#C9A84C",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: 10,
                    }}
                  >
                    Admin Console
                  </div>
                  <h2
                    style={{
                      fontFamily: "Playfair Display, serif",
                      fontSize: "2rem",
                      color: "#0F2347",
                      marginBottom: 8,
                    }}
                  >
                    Create Account
                  </h2>
                  <p style={{ color: "#666", fontSize: 15 }}>
                    Set up admin access for the workshop.
                  </p>
                </div>
                <div
                  style={{ borderTop: "1px solid #e8eaf0", marginBottom: 28 }}
                />
                {authError && (
                  <div
                    style={{
                      background: "#fff3f3",
                      border: "1px solid #f5b8b8",
                      borderRadius: 10,
                      padding: "10px 14px",
                      marginBottom: 18,
                      color: "#c0392b",
                      fontSize: 13,
                    }}
                  >
                    {authError}
                  </div>
                )}
                {authMsg && (
                  <div
                    style={{
                      background: "#f0faf4",
                      border: "1px solid #a8d5b5",
                      borderRadius: 10,
                      padding: "10px 14px",
                      marginBottom: 18,
                      color: "#1e7e3e",
                      fontSize: 13,
                      lineHeight: 1.6,
                    }}
                  >
                    {authMsg}
                  </div>
                )}
                {!authMsg && (
                  <>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        disabled={authLoading}
                        onChange={(e) => {
                          setForm((f) => ({ ...f, email: e.target.value }));
                          setAuthError("");
                        }}
                        placeholder="admin@ug.edu.gh"
                      />
                    </div>
                    <div className="form-group">
                      <label>Password</label>
                      <div style={{ position: "relative" }}>
                        <input
                          type={showPass ? "text" : "password"}
                          autoComplete="new-password"
                          value={form.password}
                          disabled={authLoading}
                          onChange={(e) => {
                            setForm((f) => ({
                              ...f,
                              password: e.target.value,
                            }));
                            setAuthError("");
                          }}
                          placeholder="At least 6 characters"
                          style={{ paddingRight: 44 }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass((v) => !v)}
                          style={{
                            position: "absolute",
                            right: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#888",
                            fontSize: 16,
                            padding: 0,
                          }}
                        >
                          {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Confirm Password</label>
                      <div style={{ position: "relative" }}>
                        <input
                          type={showConfirm ? "text" : "password"}
                          autoComplete="new-password"
                          value={form.confirm}
                          disabled={authLoading}
                          onChange={(e) => {
                            setForm((f) => ({ ...f, confirm: e.target.value }));
                            setAuthError("");
                          }}
                          placeholder="Re-enter your password"
                          style={{ paddingRight: 44 }}
                          onKeyDown={(e) =>
                            e.key === "Enter" && !authLoading && handleSignUp()
                          }
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((v) => !v)}
                          style={{
                            position: "absolute",
                            right: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#888",
                            fontSize: 16,
                            padding: 0,
                          }}
                        >
                          {showConfirm ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                    {form.password && (
                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                          flexWrap: "wrap",
                          marginBottom: 16,
                        }}
                      >
                        {[
                          { label: "6+ chars", ok: form.password.length >= 6 },
                          {
                            label: "Uppercase",
                            ok: /[A-Z]/.test(form.password),
                          },
                          { label: "Number", ok: /\d/.test(form.password) },
                        ].map(({ label, ok }) => (
                          <span
                            key={label}
                            style={{
                              fontSize: 11,
                              padding: "2px 8px",
                              borderRadius: 12,
                              fontWeight: 600,
                              background: ok ? "#e8f5ee" : "#f5f5f5",
                              color: ok ? "#27ae60" : "#aaa",
                            }}
                          >
                            {ok ? <Check size={11} /> : "○"} {label}
                          </span>
                        ))}
                      </div>
                    )}
                    <button
                      className="btn-primary"
                      style={{
                        width: "100%",
                        justifyContent: "center",
                        padding: "14px",
                        fontSize: 15,
                        borderRadius: 10,
                        opacity: authLoading ? 0.65 : 1,
                        cursor: authLoading ? "not-allowed" : "pointer",
                      }}
                      onClick={handleSignUp}
                      disabled={authLoading}
                    >
                      {authLoading ? (
                        "Creating account…"
                      ) : (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          Create Account <ArrowRight size={14} />
                        </span>
                      )}
                    </button>
                  </>
                )}
                <div style={{ textAlign: "center", marginTop: 20 }}>
                  <span style={{ color: "#888", fontSize: 13 }}>
                    Already have an account?{" "}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setAuthView("signin");
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#1B3A6B",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    Sign in
                  </button>
                </div>
              </>
            )}

            {/* ── FORGOT PASSWORD ── */}
            {authView === "forgot" && (
              <>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#C9A84C",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: 10,
                    }}
                  >
                    Admin Console
                  </div>
                  <h2
                    style={{
                      fontFamily: "Playfair Display, serif",
                      fontSize: "2rem",
                      color: "#0F2347",
                      marginBottom: 8,
                    }}
                  >
                    Reset Password
                  </h2>
                  <p style={{ color: "#666", fontSize: 15 }}>
                    Enter your email and we'll send a reset link.
                  </p>
                </div>
                <div
                  style={{ borderTop: "1px solid #e8eaf0", marginBottom: 28 }}
                />
                {authError && (
                  <div
                    style={{
                      background: "#fff3f3",
                      border: "1px solid #f5b8b8",
                      borderRadius: 10,
                      padding: "10px 14px",
                      marginBottom: 18,
                      color: "#c0392b",
                      fontSize: 13,
                    }}
                  >
                    {authError}
                  </div>
                )}
                {authMsg && (
                  <div
                    style={{
                      background: "#f0faf4",
                      border: "1px solid #a8d5b5",
                      borderRadius: 10,
                      padding: "10px 14px",
                      marginBottom: 18,
                      color: "#1e7e3e",
                      fontSize: 13,
                    }}
                  >
                    {authMsg}
                  </div>
                )}
                {!authMsg && (
                  <>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        disabled={authLoading}
                        onChange={(e) => {
                          setForm((f) => ({ ...f, email: e.target.value }));
                          setAuthError("");
                        }}
                        placeholder="admin@ug.edu.gh"
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          !authLoading &&
                          handleForgotPassword()
                        }
                      />
                    </div>
                    <button
                      className="btn-primary"
                      style={{
                        width: "100%",
                        justifyContent: "center",
                        padding: "14px",
                        fontSize: 15,
                        borderRadius: 10,
                        opacity: authLoading ? 0.65 : 1,
                        cursor: authLoading ? "not-allowed" : "pointer",
                      }}
                      onClick={handleForgotPassword}
                      disabled={authLoading}
                    >
                      {authLoading ? (
                        "Sending…"
                      ) : (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          Send Reset Link <ArrowRight size={14} />
                        </span>
                      )}
                    </button>
                  </>
                )}
                <div style={{ textAlign: "center", marginTop: 20 }}>
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setAuthView("signin");
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#1B3A6B",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <ArrowLeft size={14} /> Back to Sign In
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <style>{`
        @media (max-width: 768px) {
          .admin-slide-panel { display: none !important; }
          .admin-form-panel  { width: 100% !important; }
        }
      `}</style>
      </main>
    );

  const { event } = siteContent;

  return (
    <AdminContext.Provider value={{ siteContent, updateContent, navigate }}>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "#f1f3f7",
      }}
    >
      {/* ── ADMIN TOP BAR ────────────────────────────────────────── */}
      <div
        style={{
          background: "#0A1A35",
          borderBottom: "1px solid rgba(201,168,76,0.25)",
          padding: "10px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span
            style={{
              color: "#C9A84C",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            DCS Admin Console
          </span>
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
            |
          </span>
          <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>
            {event.edition}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => navigate && navigate("home")}
            style={{
              background: "#C9A84C",
              color: "#0F2347",
              border: "none",
              borderRadius: 8,
              padding: "7px 18px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <span
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <ArrowLeft size={14} /> View Website
            </span>
          </button>
        </div>
      </div>

      {/* ── SIDEBAR + CONTENT ────────────────────────────────────── */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* ── SIDEBAR ──────────────────────────────────────────────── */}
        <aside
          style={{
            width: 220,
            background: "#0F2347",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          <div style={{ padding: "24px 20px 16px" }}>
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Console
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#C9A84C" }}>
              DCS Workshop Admin
            </div>
          </div>

          <nav style={{ flex: 1, padding: "8px 12px", overflowY: "auto" }}>
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "6px 4px 4px",
                marginBottom: 2,
              }}
            >
              Pages
            </div>
            {SIDEBAR_PAGES.map((s) => (
              <button
                key={s.key}
                onClick={() => adminNav('/admin/' + s.key)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background:
                    activeSection === s.key ? "rgba(201,168,76,0.18)" : "transparent",
                  border:
                    activeSection === s.key
                      ? "1px solid rgba(201,168,76,0.3)"
                      : "1px solid transparent",
                  borderRadius: 8,
                  padding: "9px 12px",
                  marginBottom: 3,
                  color: activeSection === s.key ? "#C9A84C" : "rgba(255,255,255,0.65)",
                  fontSize: 13,
                  fontWeight: activeSection === s.key ? 600 : 400,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                }}
              >
                <s.icon size={15} />
                {s.label}
              </button>
            ))}
            <div
              style={{
                height: 1,
                background: "rgba(255,255,255,0.1)",
                margin: "8px 4px",
              }}
            />
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "4px 4px 4px",
                marginBottom: 2,
              }}
            >
              Admin Tools
            </div>
            {SIDEBAR_TOOLS.map((s) => (
              <button
                key={s.key}
                onClick={() => adminNav('/admin/' + s.key)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background:
                    activeSection === s.key ? "rgba(201,168,76,0.18)" : "transparent",
                  border:
                    activeSection === s.key
                      ? "1px solid rgba(201,168,76,0.3)"
                      : "1px solid transparent",
                  borderRadius: 8,
                  padding: "9px 12px",
                  marginBottom: 3,
                  color: activeSection === s.key ? "#C9A84C" : "rgba(255,255,255,0.65)",
                  fontSize: 13,
                  fontWeight: activeSection === s.key ? 600 : 400,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                }}
              >
                <s.icon size={15} />
                {s.label}
              </button>
            ))}
          </nav>

          <div style={{ padding: "16px 12px" }}>
            <div
              style={{
                background: event.registrationOpen
                  ? "rgba(50,180,100,0.15)"
                  : "rgba(220,50,50,0.15)",
                borderRadius: 8,
                padding: "10px 12px",
                marginBottom: 8,
              }}
            >
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
                Registration
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: event.registrationOpen ? "#5dbb7a" : "#f07070",
                }}
              >
                {event.registrationOpen ? "● Open" : "● Closed"}
              </div>
            </div>
            <button
              onClick={() => {
                signOut(auth);
                navigate && navigate("home");
              }}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.07)",
                color: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8,
                padding: "8px",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Sign Out
            </button>
          </div>
        </aside>

        {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
        <div style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>
          <Outlet />
        </div>
      </div>
      {/* end sidebar+content flex row */}
    </div>
    </AdminContext.Provider>
  );
}

