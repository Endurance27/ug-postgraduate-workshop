// @ts-nocheck
import { useState, useEffect, useRef } from "react";
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
  BarChart2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Upload,
  Download,
  Plus,
  Trash2,
  LogOut,
  Settings,
  Star,
  BookOpen,
  Globe,
  MapPin,
  Clock,
  ChevronRight,
  AlertCircle,
  Save,
  RefreshCw,
  User,
  ClipboardList,
  Layers,
  Cpu,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Search,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  auth,
  storage,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "../firebase.js";

// Upload a file to Firebase Storage and return the public download URL
async function uploadToStorage(file) {
  if (!storage || !storageRef || !uploadBytesResumable || !getDownloadURL) {
    throw new Error(
      "Firebase Storage is not configured. Enable it in the Firebase console and set security rules.",
    );
  }
  if (!auth.currentUser) {
    throw new Error("Please sign in before uploading images.");
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Please choose an image smaller than 10 MB.");
  }
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `workshop-images/${auth.currentUser.uid}/${Date.now()}-${safeName}`;
  const ref = storageRef(storage, path);
  const task = uploadBytesResumable(ref, file);
  await new Promise((resolve, reject) =>
    task.on("state_changed", null, reject, resolve),
  );
  return getDownloadURL(task.snapshot.ref);
}

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

function storageErrorMsg(error) {
  const map = {
    "storage/unauthorized":
      "Firebase Storage rejected the upload. Check Storage rules for signed-in admins.",
    "storage/canceled": "The upload was cancelled.",
    "storage/quota-exceeded": "Firebase Storage quota has been exceeded.",
    "storage/retry-limit-exceeded": "The upload timed out. Please try again.",
    "storage/invalid-format": "Please choose a valid image file.",
  };
  return (
    map[error?.code] ||
    error?.message ||
    "Image upload failed. Check Firebase Storage and try again."
  );
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

const TRACK_OPTIONS = [
  "",
  "CS Track",
  "Data Science Track",
  "Technical Track",
  "IT for Business Track",
  "Poster Track",
];
const TYPE_OPTIONS = ["plenary", "parallel", "track", "break"];

let _nextId = 9000;
const uid = () => ++_nextId;

export default function AdminPage({ siteContent, updateContent, navigate }) {
  const [fireUser, setFireUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authView, setAuthView] = useState("signin"); // "signin" | "signup" | "forgot"
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [authError, setAuthError] = useState("");
  const [authMsg, setAuthMsg] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [tab, setTab] = useState("home");

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
        if (list.length > 0 && !list.includes(u.email.toLowerCase())) {
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

  const {
    event,
    announcements,
    schedule,
    awards,
    participants,
    submissions,
    feed = [],
  } = siteContent;

  const confirmed = participants.filter(
    (p) => p.payment === "Confirmed",
  ).length;
  const pending = participants.filter((p) => p.payment === "Pending").length;
  const accepted = submissions.filter((s) => s.status === "Accepted").length;

  return (
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
                onClick={() => setTab(s.key)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background:
                    tab === s.key ? "rgba(201,168,76,0.18)" : "transparent",
                  border:
                    tab === s.key
                      ? "1px solid rgba(201,168,76,0.3)"
                      : "1px solid transparent",
                  borderRadius: 8,
                  padding: "9px 12px",
                  marginBottom: 3,
                  color: tab === s.key ? "#C9A84C" : "rgba(255,255,255,0.65)",
                  fontSize: 13,
                  fontWeight: tab === s.key ? 600 : 400,
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
                onClick={() => setTab(s.key)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background:
                    tab === s.key ? "rgba(201,168,76,0.18)" : "transparent",
                  border:
                    tab === s.key
                      ? "1px solid rgba(201,168,76,0.3)"
                      : "1px solid transparent",
                  borderRadius: 8,
                  padding: "9px 12px",
                  marginBottom: 3,
                  color: tab === s.key ? "#C9A84C" : "rgba(255,255,255,0.65)",
                  fontSize: 13,
                  fontWeight: tab === s.key ? 600 : 400,
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
          {/* ── HOME PAGE ────────────────────────────────────────── */}
          {tab === "home" && (
            <HomePanel
              event={event}
              onChange={(v) => updateContent("event", v)}
              home={siteContent.home || {}}
              onChangeHome={(v) => updateContent("home", v)}
              onSaveAll={(v) => updateContent(v)}
            />
          )}

          {/* ── ABOUT PAGE ───────────────────────────────────────── */}
          {tab === "about" && (
            <AboutPanel
              about={siteContent.about}
              onChange={(v) => updateContent("about", v)}
            />
          )}

          {/* ── LIVESTREAM PAGE ──────────────────────────────────── */}
          {tab === "stream" && (
            <StreamPanel
              stream={siteContent.stream}
              onChange={(v) => updateContent("stream", v)}
            />
          )}

          {/* ── SPONSORS PAGE ────────────────────────────────────── */}
          {tab === "sponsors" && (
            <SponsorsAdminPanel
              sponsors={siteContent.sponsors || []}
              onChangeSponsors={(v) => updateContent("sponsors", v)}
              footer={siteContent.footer}
              onChange={(v) => updateContent("footer", v)}
            />
          )}

          {/* ── REGISTER PAGE ────────────────────────────────────── */}
          {tab === "register" && (
            <RegisterPanel
              event={event}
              onChange={(v) => updateContent("event", v)}
            />
          )}

          {/* ── GALLERY PAGE ─────────────────────────────────────── */}
          {tab === "gallery" && (
            <GalleryPanel
              gallery={siteContent.gallery}
              onChange={(v) => updateContent("gallery", v)}
            />
          )}

          {/* ── RECORDINGS PAGE ──────────────────────────────────── */}
          {tab === "recordings" && (
            <RecordingsPanel
              recordings={siteContent.recordings}
              onChange={(v) => updateContent("recordings", v)}
            />
          )}

          {/* ── SUPPORT PAGE ─────────────────────────────────────── */}
          {tab === "support" && (
            <SupportAdminPanel
              contact={siteContent.contact}
              onChange={(v) => updateContent("contact", v)}
            />
          )}

          {/* ── DASHBOARD ────────────────────────────────────────── */}
          {tab === "overview" && (
            <div>
              <h2
                style={{
                  marginBottom: 6,
                  fontFamily: "Playfair Display, serif",
                }}
              >
                Dashboard
              </h2>
              <p style={{ color: "#666", fontSize: 14, marginBottom: 28 }}>
                {event.edition} · {event.dates}
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: 16,
                  marginBottom: 32,
                }}
              >
                {[
                  {
                    label: "Total Registered",
                    value: participants.length,
                    color: "#0F2347",
                    bg: "#e8edf6",
                  },
                  {
                    label: "Payments Confirmed",
                    value: confirmed,
                    color: "#1B6B3A",
                    bg: "#e3f5eb",
                  },
                  {
                    label: "Payments Pending",
                    value: pending,
                    color: "#c0392b",
                    bg: "#fdecea",
                  },
                  {
                    label: "Submissions",
                    value: submissions.length,
                    color: "#7b1fa2",
                    bg: "#f5e8fa",
                  },
                  {
                    label: "Accepted Papers",
                    value: accepted,
                    color: "#b5700a",
                    bg: "#fdf3e0",
                  },
                  {
                    label: "Revenue (GHS)",
                    value: confirmed * event.fee,
                    color: "#1B3A6B",
                    bg: "#E5EAF3",
                  },
                ].map((s, i) => (
                  <div
                    key={i}
                    style={{
                      background: s.bg,
                      borderRadius: 12,
                      padding: "18px 20px",
                      border: `1px solid ${s.color}20`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        color: s.color,
                        fontWeight: 500,
                        marginBottom: 4,
                      }}
                    >
                      {s.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "Playfair Display, serif",
                        fontSize: 28,
                        fontWeight: 700,
                        color: s.color,
                      }}
                    >
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                }}
              >
                <div className="card">
                  <h4
                    style={{
                      marginBottom: 14,
                      fontFamily: "Playfair Display, serif",
                    }}
                  >
                    Quick Toggles
                  </h4>
                  <ToggleRow
                    label="Registration"
                    desc="Allow new participants to register"
                    value={event.registrationOpen}
                    onChange={(v) =>
                      updateContent("event", { ...event, registrationOpen: v })
                    }
                  />
                  <ToggleRow
                    label="Submissions"
                    desc="Allow paper submissions"
                    value={event.submissionsOpen}
                    onChange={(v) =>
                      updateContent("event", { ...event, submissionsOpen: v })
                    }
                  />
                </div>
                <div className="card">
                  <h4
                    style={{
                      marginBottom: 14,
                      fontFamily: "Playfair Display, serif",
                    }}
                  >
                    Recent Registrations
                  </h4>
                  {participants.slice(0, 4).map((p) => (
                    <div
                      key={p.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 0",
                        borderBottom: "1px solid #f5f5f5",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>
                          {p.name}
                        </div>
                        <div style={{ fontSize: 11, color: "#888" }}>
                          {p.programme}
                        </div>
                      </div>
                      <span
                        className={`badge ${p.payment === "Confirmed" ? "badge-green" : "badge-red"}`}
                        style={{ fontSize: 11 }}
                      >
                        {p.payment}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ANNOUNCEMENTS ────────────────────────────────────── */}
          {tab === "announcements" && (
            <AnnouncementsPanel
              items={announcements}
              onChange={(v) => updateContent("announcements", v)}
            />
          )}

          {/* ── LIVE FEED ────────────────────────────────────────── */}
          {tab === "feed" && (
            <FeedPanel feed={feed} onChange={(v) => updateContent("feed", v)} />
          )}

          {/* ── SCHEDULE ─────────────────────────────────────────── */}
          {tab === "schedule" && (
            <ScheduleEditor
              schedule={schedule}
              onChange={(v) => updateContent("schedule", v)}
            />
          )}

          {/* ── PAYMENT TRACKING ─────────────────────────────────── */}
          {tab === "payments" && (
            <PaymentTrackingPanel
              payments={siteContent.payments || []}
              fee={event.fee || 100}
              onChange={(v) => updateContent("payments", v)}
            />
          )}

          {/* ── PARTICIPANTS ─────────────────────────────────────── */}
          {tab === "participants" && (
            <ParticipantsPanel
              participants={participants}
              onChange={(v) => updateContent("participants", v)}
            />
          )}

          {/* ── SUBMISSIONS ──────────────────────────────────────── */}
          {tab === "submissions" && (
            <SubmissionsPanel
              submissions={submissions}
              onChange={(v) => updateContent("submissions", v)}
            />
          )}

          {/* ── AWARDS ───────────────────────────────────────────── */}
          {tab === "awards" && (
            <AwardsPanel
              awards={awards}
              onChange={(v) => updateContent("awards", v)}
              pastWinners={siteContent.pastWinners || []}
              onChangePastWinners={(v) => updateContent("pastWinners", v)}
            />
          )}

          {/* ── SPEAKERS ─────────────────────────────────────────── */}
          {tab === "speakers" && (
            <SpeakersPanel
              speakers={siteContent.speakers}
              onChange={(v) => updateContent("speakers", v)}
            />
          )}

          {/* ── CONTACT INFO ─────────────────────────────────────── */}
          {tab === "contact" && (
            <ContactPanel
              contact={siteContent.contact}
              onChange={(v) => updateContent("contact", v)}
            />
          )}

          {/* ── FOOTER ───────────────────────────────────────────── */}
          {tab === "footer" && (
            <FooterPanel
              footer={siteContent.footer}
              onChange={(v) => updateContent("footer", v)}
            />
          )}

          {/* ── SITE IMAGES ──────────────────────────────────────── */}
          {tab === "images" && (
            <ImagesPanel
              images={siteContent.images}
              onChange={(v) => updateContent("images", v)}
            />
          )}

          {/* ── SECURITY ─────────────────────────────────────────── */}
          {tab === "security" && <SecurityPanel />}
        </div>
      </div>
      {/* end sidebar+content flex row */}
    </div>
  );
}

/* ── Reusable toggle row ──────────────────────────────────────── */
function ToggleRow({ label, desc, value, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 0",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <div>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 12, color: "#888" }}>{desc}</div>
      </div>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 44,
          height: 24,
          borderRadius: 12,
          border: "none",
          cursor: "pointer",
          background: value ? "#1B6B3A" : "#ccc",
          position: "relative",
          transition: "background 0.2s",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#fff",
            position: "absolute",
            top: 3,
            left: value ? 23 : 3,
            transition: "left 0.2s",
            boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
          }}
        />
      </button>
    </div>
  );
}

/* ── Reusable image upload field ─────────────────────────────── */
function ImageUploadField({ value, onChange, label, placeholder }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const isBase64 = value && value.startsWith("data:");

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = "";
    setUploading(true);
    try {
      const url = await uploadToStorage(file);
      onChange(url);
    } catch (err) {
      console.error("Storage upload failed:", err);
      alert(storageErrorMsg(err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {label && (
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "#333",
            marginBottom: 6,
          }}
        >
          {label}
        </div>
      )}
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div
          style={{
            width: 96,
            height: 68,
            borderRadius: 8,
            overflow: "hidden",
            border: "1px solid #ddd",
            flexShrink: 0,
            background: "#f5f5f5",
          }}
        >
          {value && !isBase64 ? (
            <img
              src={value}
              alt="preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Image size={24} color="#ccc" />
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <input
            value={!isBase64 && value ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "/images/... or https://..."}
            style={{
              width: "100%",
              padding: "7px 10px",
              border: "1.5px solid #ddd",
              borderRadius: 7,
              fontSize: 13,
              marginBottom: 6,
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current.click()}
            disabled={uploading}
            style={{
              background: "#E5EAF3",
              color: "#1B3A6B",
              border: "1px solid #b0bdd8",
              borderRadius: 7,
              padding: "5px 14px",
              fontSize: 12,
              cursor: uploading ? "not-allowed" : "pointer",
              fontWeight: 500,
              opacity: uploading ? 0.65 : 1,
            }}
          >
            <span
              style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
            >
              <Upload size={13} /> {uploading ? "Uploading…" : "Upload Image"}
            </span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFile}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Event Settings ───────────────────────────────────────────── */
function EventSettings({ event, onChange }) {
  const [form, setForm] = useState({ ...event });
  const [saved, setSaved] = useState(false);

  const save = () => {
    onChange(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ maxWidth: 680 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>
        Event Settings
      </h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 28 }}>
        Changes here appear immediately on the live website.
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
          Settings saved and live on the site.
        </div>
      )}

      <div className="card">
        <div className="form-row">
          <div className="form-group">
            <label>Event Title</label>
            <input
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
            />
          </div>
          <div className="form-group">
            <label>Edition</label>
            <input
              value={form.edition}
              onChange={(e) =>
                setForm((f) => ({ ...f, edition: e.target.value }))
              }
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Dates</label>
            <input
              value={form.dates}
              onChange={(e) =>
                setForm((f) => ({ ...f, dates: e.target.value }))
              }
              placeholder="e.g. 27–29 August 2026"
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
        <div className="form-group" style={{ maxWidth: 220 }}>
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
        <div className="form-group">
          <label>Event Description</label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            style={{ minHeight: 90 }}
          />
        </div>

        <div
          style={{
            background: "#f8f9fa",
            borderRadius: 10,
            padding: "16px 20px",
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
            Access Controls
          </div>
          <ToggleRow
            label="Registration Open"
            desc="Participants can register"
            value={form.registrationOpen}
            onChange={(v) => setForm((f) => ({ ...f, registrationOpen: v }))}
          />
          <ToggleRow
            label="Submissions Open"
            desc="Participants can submit papers"
            value={form.submissionsOpen}
            onChange={(v) => setForm((f) => ({ ...f, submissionsOpen: v }))}
          />
        </div>

        <button className="btn-primary" onClick={save}>
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            Save Changes <ArrowRight size={14} />
          </span>
        </button>
      </div>
    </div>
  );
}

/* ── Announcements Panel ─────────────────────────────────────── */
function AnnouncementsPanel({ items, onChange }) {
  const [form, setForm] = useState({ text: "", type: "info" });

  const add = () => {
    if (!form.text.trim()) return;
    onChange([
      ...items,
      { id: uid(), text: form.text, type: form.type, active: true },
    ]);
    setForm({ text: "", type: "info" });
  };

  const toggle = (id) =>
    onChange(items.map((a) => (a.id === id ? { ...a, active: !a.active } : a)));
  const remove = (id) => onChange(items.filter((a) => a.id !== id));

  const typeColor = { info: "#1B3A6B", warning: "#b5700a", success: "#1B6B3A" };
  const typeBg = { info: "#E5EAF3", warning: "#fdf3e0", success: "#e3f5eb" };

  return (
    <div style={{ maxWidth: 720 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>
        Announcements
      </h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 28 }}>
        Active announcements appear as banners on the homepage for all visitors.
      </p>

      <div className="card" style={{ marginBottom: 24 }}>
        <h4 style={{ marginBottom: 14 }}>New Announcement</h4>
        <div className="form-group">
          <label>Message</label>
          <input
            value={form.text}
            onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
            placeholder="e.g. Registration deadline extended to 15 August 2026"
            onKeyDown={(e) => e.key === "Enter" && add()}
          />
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <label style={{ fontSize: 14, fontWeight: 500 }}>Type:</label>
          {["info", "warning", "success"].map((t) => (
            <button
              key={t}
              onClick={() => setForm((f) => ({ ...f, type: t }))}
              style={{
                background: form.type === t ? typeBg[t] : "#f0f0f0",
                color: form.type === t ? typeColor[t] : "#666",
                border: `1.5px solid ${form.type === t ? typeColor[t] : "#ddd"}`,
                borderRadius: 20,
                padding: "4px 14px",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <button className="btn-primary" onClick={add}>
          Add Announcement
        </button>
      </div>

      {items.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            color: "#888",
            padding: "40px 0",
            background: "#fff",
            borderRadius: 12,
            border: "1px dashed #ddd",
          }}
        >
          No announcements yet. Add one above to display it on the homepage.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((a) => (
            <div
              key={a.id}
              style={{
                background: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: 10,
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                opacity: a.active ? 1 : 0.5,
              }}
            >
              <span
                style={{
                  background: typeBg[a.type],
                  color: typeColor[a.type],
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: 12,
                  textTransform: "uppercase",
                  flexShrink: 0,
                }}
              >
                {a.type}
              </span>
              <div style={{ flex: 1, fontSize: 14 }}>{a.text}</div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button
                  onClick={() => toggle(a.id)}
                  style={{
                    background: a.active ? "#e3f5eb" : "#f5f5f5",
                    color: a.active ? "#1B6B3A" : "#888",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    padding: "4px 12px",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  {a.active ? "Live ●" : "Hidden"}
                </button>
                <button
                  onClick={() => remove(a.id)}
                  style={{
                    background: "#fdecea",
                    color: "#c0392b",
                    border: "1px solid #f5b7b1",
                    borderRadius: 6,
                    padding: "4px 10px",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Schedule Editor ─────────────────────────────────────────── */
function ScheduleEditor({ schedule, onChange }) {
  const [activeDay, setActiveDay] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
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

/* ── Participants Panel ──────────────────────────────────────── */
function ParticipantsPanel({ participants, onChange }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const setPayment = (id, status) =>
    onChange(
      participants.map((p) => (p.id === id ? { ...p, payment: status } : p)),
    );

  const exportCSV = () => {
    const header = "Name,Email,Programme,Type,Mode,Payment";
    const rows = participants.map((p) =>
      [p.name, p.email, p.programme, p.type, p.mode, p.payment]
        .map((v) => `"${v}"`)
        .join(","),
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "participants.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = participants
    .filter((p) => filter === "All" || p.payment === filter)
    .filter(
      (p) =>
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase()),
    );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h2
            style={{ marginBottom: 4, fontFamily: "Playfair Display, serif" }}
          >
            Participants
          </h2>
          <p style={{ color: "#666", fontSize: 14 }}>
            {participants.length} registered ·{" "}
            {participants.filter((p) => p.payment === "Confirmed").length}{" "}
            confirmed
          </p>
        </div>
        <button
          onClick={exportCSV}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "#1B3A6B",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "9px 18px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <Download size={14} /> Export CSV
          </span>
        </button>
      </div>

      <div
        style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          style={{
            flex: 1,
            minWidth: 220,
            padding: "8px 14px",
            border: "1.5px solid #ddd",
            borderRadius: 8,
            fontSize: 14,
          }}
        />
        <div style={{ display: "flex", gap: 6 }}>
          {["All", "Confirmed", "Pending"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? "#1B3A6B" : "#fff",
                color: filter === f ? "#fff" : "#555",
                border: "1px solid #ddd",
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #e0e0e0",
          overflowX: "auto",
        }}
      >
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr style={{ background: "#f8f9fa" }}>
              {["Name", "Email", "Programme", "Mode", "Payment", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontWeight: 600,
                      color: "#555",
                      borderBottom: "1px solid #eee",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                <td style={{ padding: "12px 16px", fontWeight: 500 }}>
                  {p.name}
                </td>
                <td style={{ padding: "12px 16px", color: "#666" }}>
                  {p.email}
                </td>
                <td style={{ padding: "12px 16px", color: "#555" }}>
                  {p.programme}
                </td>
                <td style={{ padding: "12px 16px" }}>{p.mode}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span
                    className={`badge ${p.payment === "Confirmed" ? "badge-green" : "badge-red"}`}
                  >
                    {p.payment}
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {p.payment !== "Confirmed" && (
                      <button
                        onClick={() => setPayment(p.id, "Confirmed")}
                        style={{
                          background: "#e3f5eb",
                          color: "#1B6B3A",
                          border: "1px solid #a8d5b8",
                          borderRadius: 6,
                          padding: "4px 10px",
                          fontSize: 11,
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        Confirm
                      </button>
                    )}
                    {p.payment !== "Pending" && (
                      <button
                        onClick={() => setPayment(p.id, "Pending")}
                        style={{
                          background: "#fdecea",
                          color: "#c0392b",
                          border: "1px solid #f5b7b1",
                          borderRadius: 6,
                          padding: "4px 10px",
                          fontSize: 11,
                          cursor: "pointer",
                        }}
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "32px",
              color: "#888",
              fontSize: 14,
            }}
          >
            No participants match the current filter.
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Submissions Panel ───────────────────────────────────────── */
function SubmissionsPanel({ submissions, onChange }) {
  const setStatus = (id, status) =>
    onChange(submissions.map((s) => (s.id === id ? { ...s, status } : s)));

  const statusColor = {
    Accepted: "#1B6B3A",
    "Under Review": "#b5700a",
    Rejected: "#c0392b",
  };
  const statusBg = {
    Accepted: "#e3f5eb",
    "Under Review": "#fdf3e0",
    Rejected: "#fdecea",
  };

  return (
    <div>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>
        Submissions
      </h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>
        {submissions.length} total ·{" "}
        {submissions.filter((s) => s.status === "Accepted").length} accepted
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {submissions.map((s) => (
          <div
            key={s.id}
            className="card"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              alignItems: "start",
              gap: 20,
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>
                {s.title}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <span className="badge badge-navy" style={{ fontSize: 11 }}>
                  {s.category}
                </span>
                <span style={{ fontSize: 13, color: "#666" }}>
                  by {s.author}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 12,
                    background: statusBg[s.status],
                    color: statusColor[s.status],
                  }}
                >
                  {s.status}
                </span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                justifyContent: "flex-end",
              }}
            >
              {s.status !== "Accepted" && (
                <button
                  onClick={() => setStatus(s.id, "Accepted")}
                  style={{
                    background: "#e3f5eb",
                    color: "#1B6B3A",
                    border: "1px solid #a8d5b8",
                    borderRadius: 8,
                    padding: "6px 14px",
                    fontSize: 13,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Check size={14} /> Accept
                  </span>
                </button>
              )}
              {s.status !== "Under Review" && (
                <button
                  onClick={() => setStatus(s.id, "Under Review")}
                  style={{
                    background: "#fdf3e0",
                    color: "#b5700a",
                    border: "1px solid #e8d5a0",
                    borderRadius: 8,
                    padding: "6px 14px",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  In Review
                </button>
              )}
              {s.status !== "Rejected" && (
                <button
                  onClick={() => setStatus(s.id, "Rejected")}
                  style={{
                    background: "#fdecea",
                    color: "#c0392b",
                    border: "1px solid #f5b7b1",
                    borderRadius: 8,
                    padding: "6px 14px",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Reject
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Live Feed Panel ─────────────────────────────────────────── */
function FeedPanel({ feed, onChange }) {
  const [form, setForm] = useState({ text: "", type: "update" });

  const typeColor = { update: "#1B3A6B", alert: "#c0392b", info: "#1B6B3A" };
  const typeBg = { update: "#E5EAF3", alert: "#fdecea", info: "#e3f5eb" };

  const add = () => {
    if (!form.text.trim()) return;
    const now = new Date();
    const time =
      now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) +
      " · " +
      now.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    onChange([
      { id: uid(), text: form.text, type: form.type, time, active: true },
      ...feed,
    ]);
    setForm({ text: "", type: "update" });
  };

  const toggle = (id) =>
    onChange(feed.map((f) => (f.id === id ? { ...f, active: !f.active } : f)));
  const remove = (id) => onChange(feed.filter((f) => f.id !== id));

  return (
    <div style={{ maxWidth: 720 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>
        Live Feed
      </h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 28 }}>
        Post real-time updates that appear as a live ticker on the homepage.
        Great for day-of announcements, room changes, or reminders.
      </p>

      <div className="card" style={{ marginBottom: 24 }}>
        <h4 style={{ marginBottom: 14 }}>New Update</h4>
        <div className="form-group">
          <label>Message</label>
          <input
            value={form.text}
            onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
            placeholder="e.g. Keynote is now starting in the Main Hall — all attendees please proceed"
            onKeyDown={(e) => e.key === "Enter" && add()}
          />
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <label style={{ fontSize: 14, fontWeight: 500 }}>Type:</label>
          {["update", "alert", "info"].map((t) => (
            <button
              key={t}
              onClick={() => setForm((f) => ({ ...f, type: t }))}
              style={{
                background: form.type === t ? typeBg[t] : "#f0f0f0",
                color: form.type === t ? typeColor[t] : "#666",
                border: `1.5px solid ${form.type === t ? typeColor[t] : "#ddd"}`,
                borderRadius: 20,
                padding: "4px 14px",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <button className="btn-primary" onClick={add}>
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            Post Update <ArrowRight size={14} />
          </span>
        </button>
      </div>

      {feed.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            color: "#888",
            padding: "40px 0",
            background: "#fff",
            borderRadius: 12,
            border: "1px dashed #ddd",
          }}
        >
          No feed updates yet. Post one above to display it on the homepage.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {feed.map((f) => (
            <div
              key={f.id}
              style={{
                background: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: 10,
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                opacity: f.active ? 1 : 0.5,
              }}
            >
              <span
                style={{
                  background: typeBg[f.type],
                  color: typeColor[f.type],
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: 12,
                  textTransform: "uppercase",
                  flexShrink: 0,
                }}
              >
                {f.type}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14 }}>{f.text}</div>
                <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>
                  {f.time}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button
                  onClick={() => toggle(f.id)}
                  style={{
                    background: f.active ? "#e3f5eb" : "#f5f5f5",
                    color: f.active ? "#1B6B3A" : "#888",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    padding: "4px 12px",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  {f.active ? "Live ●" : "Hidden"}
                </button>
                <button
                  onClick={() => remove(f.id)}
                  style={{
                    background: "#fdecea",
                    color: "#c0392b",
                    border: "1px solid #f5b7b1",
                    borderRadius: 6,
                    padding: "4px 10px",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Awards Panel ────────────────────────────────────────────── */
function AwardsPanel({
  awards,
  onChange,
  pastWinners = [],
  onChangePastWinners,
}) {
  const [forms, setForms] = useState(
    awards.map((a) => ({ winner: a.winner, paper: a.paper })),
  );
  const [pastForms, setPastForms] = useState(
    pastWinners.map((w) => ({ ...w })),
  );
  const [saved, setSaved] = useState(false);
  const [pastSaved, setPastSaved] = useState(false);

  const updatePastForm = (i, field, val) =>
    setPastForms((pf) =>
      pf.map((w, wi) => (wi === i ? { ...w, [field]: val } : w)),
    );

  const savePastWinners = () => {
    onChangePastWinners && onChangePastWinners(pastForms);
    setPastSaved(true);
    setTimeout(() => setPastSaved(false), 2500);
  };

  const updateForm = (i, field, val) => {
    const next = forms.map((f, fi) => (fi === i ? { ...f, [field]: val } : f));
    setForms(next);
  };

  const saveAll = () => {
    onChange(
      awards.map((a, i) => ({
        ...a,
        winner: forms[i].winner,
        paper: forms[i].paper,
      })),
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const toggleAnnounce = (i) => {
    onChange(
      awards.map((a, ai) => (ai === i ? { ...a, announced: !a.announced } : a)),
    );
  };

  return (
    <div style={{ maxWidth: 680 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>
        Awards
      </h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 8 }}>
        Enter winner details and toggle "Announce" to make them visible on the
        Awards page.
      </p>

      <div
        className="alert alert-info"
        style={{ marginBottom: 24, fontSize: 13 }}
      >
        Winners only appear on the public Awards page when "Announced" is
        toggled on.
      </div>

      {saved && (
        <div className="alert alert-success" style={{ marginBottom: 16 }}>
          <Check
            size={14}
            style={{
              display: "inline",
              verticalAlign: "middle",
              marginRight: 4,
            }}
          />{" "}
          Award details saved.
        </div>
      )}

      {awards.map((a, i) => (
        <div
          key={a.id}
          className="card"
          style={{
            marginBottom: 16,
            borderLeft: `4px solid ${i === 0 ? "#C9A84C" : i === 1 ? "#aaa" : "#b5700a"}`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 28 }}>{a.emoji}</span>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 16,
                  fontFamily: "Playfair Display, serif",
                }}
              >
                {a.label}
              </span>
            </div>
            <button
              onClick={() => toggleAnnounce(i)}
              style={{
                background: a.announced ? "#e3f5eb" : "#f5f5f5",
                color: a.announced ? "#1B6B3A" : "#888",
                border: `1.5px solid ${a.announced ? "#a8d5b8" : "#ddd"}`,
                borderRadius: 20,
                padding: "5px 16px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {a.announced ? "● Announced" : "○ Not Announced"}
            </button>
          </div>
          <div className="form-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Winner Name</label>
              <input
                value={forms[i].winner}
                onChange={(e) => updateForm(i, "winner", e.target.value)}
                placeholder="e.g. Kwame Asante"
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Paper Title</label>
              <input
                value={forms[i].paper}
                onChange={(e) => updateForm(i, "paper", e.target.value)}
                placeholder="e.g. Deep Learning for Malaria Detection"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        className="btn-primary"
        onClick={saveAll}
        style={{ marginTop: 4 }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          Save Award Details <ArrowRight size={14} />
        </span>
      </button>

      {/* Past Winners */}
      <div
        style={{
          marginTop: 36,
          paddingTop: 28,
          borderTop: "2px solid #f0f0f0",
        }}
      >
        <h3 style={{ fontFamily: "Playfair Display, serif", marginBottom: 6 }}>
          Past Winners (Historical)
        </h3>
        <p style={{ color: "#666", fontSize: 14, marginBottom: 20 }}>
          Names displayed on the Awards page under "Maiden Workshop 2025". Leave
          name blank to show placeholder text.
        </p>
        {pastSaved && (
          <div className="alert alert-success" style={{ marginBottom: 16 }}>
            <Check
              size={14}
              style={{
                display: "inline",
                verticalAlign: "middle",
                marginRight: 4,
              }}
            />{" "}
            Past winners saved.
          </div>
        )}
        {pastForms.map((w, i) => (
          <div
            key={w.id || i}
            className="card"
            style={{
              marginBottom: 14,
              borderLeft: `4px solid ${i === 0 ? "#C9A84C" : i === 1 ? "#aaa" : "#b5700a"}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 12,
              }}
            >
              <span style={{ fontSize: 22 }}>{w.pos}</span>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{w.place}</span>
              <span style={{ fontSize: 12, color: "#888" }}>· {w.edition}</span>
            </div>
            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Winner Name</label>
                <input
                  value={w.name}
                  onChange={(e) => updatePastForm(i, "name", e.target.value)}
                  placeholder="e.g. Akua Asante (or leave blank)"
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Field / Programme</label>
                <input
                  value={w.field}
                  onChange={(e) => updatePastForm(i, "field", e.target.value)}
                  placeholder="e.g. Computer Science"
                />
              </div>
            </div>
            <div className="form-row" style={{ marginTop: 10 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Edition Label</label>
                <input
                  value={w.edition}
                  onChange={(e) => updatePastForm(i, "edition", e.target.value)}
                  placeholder="Maiden Workshop 2025"
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <ImageUploadField
                  label="Photo (optional)"
                  value={w.avatar}
                  onChange={(v) => updatePastForm(i, "avatar", v)}
                />
              </div>
            </div>
          </div>
        ))}
        <button className="btn-outline" onClick={savePastWinners}>
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            Save Past Winners <ArrowRight size={14} />
          </span>
        </button>
      </div>
    </div>
  );
}

/* ── Speakers Panel ──────────────────────────────────────────── */
function SpeakersPanel({ speakers = {}, onChange }) {
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
    <div style={{ maxWidth: 760 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>
        Speakers &amp; Committee
      </h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>
        Changes appear immediately on the Speakers page.
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
          Saved.
        </div>
      )}

      {/* Keynote */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h4 style={{ marginBottom: 16, fontFamily: "Playfair Display, serif" }}>
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
            style={{ minHeight: 80 }}
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
      <div className="card" style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h4 style={{ fontFamily: "Playfair Display, serif" }}>Panelists</h4>
          <button
            onClick={addPanelist}
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
            + Add
          </button>
        </div>
        {panelists.map((p, i) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: 10,
              padding: "16px",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <span style={{ fontWeight: 600, fontSize: 14 }}>
                {p.name || `Panelist ${i + 1}`}
              </span>
              <button
                onClick={() => removePanelist(i)}
                style={{
                  background: "#fdecea",
                  color: "#c0392b",
                  border: "none",
                  borderRadius: 6,
                  padding: "3px 10px",
                  fontSize: 12,
                  cursor: "pointer",
                }}
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
                  style={{ minHeight: 60 }}
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
      <div className="card" style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h4 style={{ fontFamily: "Playfair Display, serif" }}>
            Organising Committee
          </h4>
          <button
            onClick={addCommittee}
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
            + Add
          </button>
        </div>
        {committee.map((m, i) => (
          <div
            key={m.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr auto",
              gap: 10,
              alignItems: "end",
              marginBottom: 10,
            }}
          >
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Name</label>
              <input
                value={m.name}
                onChange={(e) => updateCommittee(i, "name", e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Role</label>
              <input
                value={m.role}
                onChange={(e) => updateCommittee(i, "role", e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
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
              style={{
                background: "#fdecea",
                color: "#c0392b",
                border: "none",
                borderRadius: 6,
                padding: "8px 10px",
                fontSize: 12,
                cursor: "pointer",
                marginBottom: 20,
              }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <button className="btn-primary" onClick={save}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          Save Speakers <ArrowRight size={14} />
        </span>
      </button>
    </div>
  );
}

/* ── Contact Info Panel ──────────────────────────────────────── */
function ContactPanel({ contact = {}, onChange }) {
  const [form, setForm] = useState({
    email: "",
    website: "",
    location: "",
    hours: "",
    whatsapp: "",
    phone: "",
    ...contact,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm((f) => ({ ...f, ...contact }));
  }, [contact]);

  const save = () => {
    onChange(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>
        Contact Info
      </h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 8 }}>
        These details appear on the Contact page, Support page contact tab, and
        the WhatsApp float button.
      </p>
      <div
        className="alert alert-info"
        style={{ marginBottom: 20, fontSize: 13 }}
      >
        Changes here update the <strong>Contact</strong> page,{" "}
        <strong>Support</strong> page, and <strong>WhatsApp</strong> button
        across the whole site.
      </div>
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
          Saved — contact details updated site-wide.
        </div>
      )}

      <div className="card">
        <div className="form-row">
          <div className="form-group">
            <label>Email Address</label>
            <input
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              placeholder="dcsworkshop@ug.edu.gh"
            />
          </div>
          <div className="form-group">
            <label>Website</label>
            <input
              value={form.website}
              onChange={(e) =>
                setForm((f) => ({ ...f, website: e.target.value }))
              }
              placeholder="www.cs.ug.edu.gh"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Phone Number</label>
            <input
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
              placeholder="+233 (0) 536 909 471"
            />
          </div>
          <div className="form-group">
            <label>WhatsApp Number</label>
            <input
              value={form.whatsapp}
              onChange={(e) =>
                setForm((f) => ({ ...f, whatsapp: e.target.value }))
              }
              placeholder="233XXXXXXXXX (no + or spaces)"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Office Hours</label>
          <input
            value={form.hours}
            onChange={(e) => setForm((f) => ({ ...f, hours: e.target.value }))}
            placeholder="Mon–Fri · 8:00 AM – 5:00 PM GMT"
          />
        </div>
        <div className="form-group">
          <label>Location / Address</label>
          <textarea
            value={form.location}
            onChange={(e) =>
              setForm((f) => ({ ...f, location: e.target.value }))
            }
            style={{ minHeight: 80 }}
          />
        </div>
        <button className="btn-primary" onClick={save}>
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            Save Contact Info <ArrowRight size={14} />
          </span>
        </button>
      </div>
    </div>
  );
}

/* ── Footer Panel ────────────────────────────────────────────── */
function FooterPanel({ footer = {}, onChange }) {
  const [form, setForm] = useState({
    tagline: footer.tagline || "",
    dates: footer.dates || "",
    organizers: (footer.organizers || []).join("\n"),
    sponsors: (footer.sponsors || []).join("\n"),
    publication: footer.publication || "",
  });
  const [saved, setSaved] = useState(false);

  const save = () => {
    onChange({
      tagline: form.tagline,
      dates: form.dates,
      organizers: form.organizers
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      sponsors: form.sponsors
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      publication: form.publication,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>
        Footer
      </h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>
        Edit the footer tagline, organizers, sponsors, and publication details.
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
          Saved.
        </div>
      )}

      <div className="card">
        <div className="form-row">
          <div className="form-group">
            <label>Tagline</label>
            <input
              value={form.tagline}
              onChange={(e) =>
                setForm((f) => ({ ...f, tagline: e.target.value }))
              }
              placeholder="2nd Annual Postgraduate Students Workshop"
            />
          </div>
          <div className="form-group">
            <label>Dates</label>
            <input
              value={form.dates}
              onChange={(e) =>
                setForm((f) => ({ ...f, dates: e.target.value }))
              }
              placeholder="27–29 August 2026 · Hybrid Format"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Organizers (one per line)</label>
            <textarea
              value={form.organizers}
              onChange={(e) =>
                setForm((f) => ({ ...f, organizers: e.target.value }))
              }
              style={{ minHeight: 80 }}
            />
          </div>
          <div className="form-group">
            <label>Sponsors &amp; Funders (one per line)</label>
            <textarea
              value={form.sponsors}
              onChange={(e) =>
                setForm((f) => ({ ...f, sponsors: e.target.value }))
              }
              style={{ minHeight: 80 }}
            />
          </div>
        </div>
        <div className="form-group" style={{ maxWidth: 280 }}>
          <label>Publication Partner</label>
          <input
            value={form.publication}
            onChange={(e) =>
              setForm((f) => ({ ...f, publication: e.target.value }))
            }
            placeholder="CBAS Journal"
          />
        </div>
        <button className="btn-primary" onClick={save}>
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            Save Footer <ArrowRight size={14} />
          </span>
        </button>
      </div>
    </div>
  );
}

/* ── Home Page Panel ─────────────────────────────────────────── */
function makeHomeForm(home = {}) {
  return {
    heroSubtitle:
      home.heroSubtitle ||
      "Department of Computer Science · SPMS · University of Ghana",
    heroDesc: home.heroDesc || "",
    importantDates: Array.isArray(home.importantDates)
      ? home.importantDates
      : [],
    featuredSessions: Array.isArray(home.featuredSessions)
      ? home.featuredSessions
      : [],
    testimonials: Array.isArray(home.testimonials) ? home.testimonials : [],
  };
}

function HomePanel({ event, onChange, home = {}, onChangeHome, onSaveAll }) {
  const [evForm, setEvForm] = useState({ ...event });
  const [homeForm, setHomeForm] = useState(() => makeHomeForm(home));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setEvForm({ ...event });
  }, [event]);

  useEffect(() => {
    setHomeForm(makeHomeForm(home));
  }, [home]);

  const saveAll = () => {
    const nextEvent = { ...event, ...evForm };
    const nextHome = { ...home, ...homeForm };
    if (onSaveAll) {
      onSaveAll({ event: nextEvent, home: nextHome });
    } else {
      onChange(nextEvent);
      onChangeHome(nextHome);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const updateDate = (i, field, val) =>
    setHomeForm((f) => ({
      ...f,
      importantDates: f.importantDates.map((d, di) =>
        di === i ? { ...d, [field]: val } : d,
      ),
    }));
  const updateSession = (i, field, val) =>
    setHomeForm((f) => ({
      ...f,
      featuredSessions: f.featuredSessions.map((s, si) =>
        si === i ? { ...s, [field]: val } : s,
      ),
    }));
  const updateTestimonial = (i, field, val) =>
    setHomeForm((f) => ({
      ...f,
      testimonials: f.testimonials.map((t, ti) =>
        ti === i ? { ...t, [field]: val } : t,
      ),
    }));

  const addDate = () =>
    setHomeForm((f) => ({
      ...f,
      importantDates: [
        ...f.importantDates,
        { id: uid(), label: "New Date", date: "TBD", icon: "📅", done: false },
      ],
    }));
  const removeDate = (i) =>
    setHomeForm((f) => ({
      ...f,
      importantDates: f.importantDates.filter((_, di) => di !== i),
    }));

  const addSession = () =>
    setHomeForm((f) => ({
      ...f,
      featuredSessions: [
        ...f.featuredSessions,
        {
          id: uid(),
          icon: "🎤",
          tag: "Session",
          session: "New Session",
          role: "",
          status: "",
          topic: "",
          accent: "#1B3A6B",
        },
      ],
    }));
  const removeSession = (i) =>
    setHomeForm((f) => ({
      ...f,
      featuredSessions: f.featuredSessions.filter((_, si) => si !== i),
    }));

  const addTestimonial = () =>
    setHomeForm((f) => ({
      ...f,
      testimonials: [
        ...f.testimonials,
        { id: uid(), quote: "", name: "", prog: "" },
      ],
    }));
  const removeTestimonial = (i) =>
    setHomeForm((f) => ({
      ...f,
      testimonials: f.testimonials.filter((_, ti) => ti !== i),
    }));

  return (
    <div style={{ maxWidth: 760 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>
        Home Page
      </h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 28 }}>
        Edit all sections shown on the Home page — hero, dates, sessions, and
        testimonials.
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
          Saved — all Home page changes are live.
        </div>
      )}

      {/* ── Hero ── */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h4 style={{ marginBottom: 16, fontFamily: "Playfair Display, serif" }}>
          Hero Section
        </h4>
        <div className="form-row">
          <div className="form-group">
            <label>Event Title</label>
            <input
              value={evForm.title}
              onChange={(e) =>
                setEvForm((f) => ({ ...f, title: e.target.value }))
              }
            />
          </div>
          <div className="form-group">
            <label>Edition Badge</label>
            <input
              value={evForm.edition}
              onChange={(e) =>
                setEvForm((f) => ({ ...f, edition: e.target.value }))
              }
              placeholder="2nd Annual Edition"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Dates</label>
            <input
              value={evForm.dates}
              onChange={(e) =>
                setEvForm((f) => ({ ...f, dates: e.target.value }))
              }
              placeholder="27–29 August 2026"
            />
          </div>
          <div className="form-group">
            <label>Venue</label>
            <input
              value={evForm.venue}
              onChange={(e) =>
                setEvForm((f) => ({ ...f, venue: e.target.value }))
              }
            />
          </div>
        </div>
        <div className="form-group">
          <label>Subtitle Line (shown below title)</label>
          <input
            value={homeForm.heroSubtitle}
            onChange={(e) =>
              setHomeForm((f) => ({ ...f, heroSubtitle: e.target.value }))
            }
            placeholder="Department of Computer Science · SPMS · University of Ghana"
          />
        </div>
        <div className="form-group">
          <label>Hero Description</label>
          <textarea
            value={homeForm.heroDesc}
            onChange={(e) =>
              setHomeForm((f) => ({ ...f, heroDesc: e.target.value }))
            }
            style={{ minHeight: 80 }}
            placeholder="Brief description shown below the title in the hero…"
          />
        </div>
        <div className="form-group" style={{ maxWidth: 200 }}>
          <label>Registration Fee (GHS)</label>
          <input
            type="number"
            min="0"
            value={evForm.fee}
            onChange={(e) =>
              setEvForm((f) => ({ ...f, fee: Number(e.target.value) }))
            }
          />
        </div>
        <ToggleRow
          label="Registration Open"
          desc="Show 'Register Now' button on hero"
          value={evForm.registrationOpen}
          onChange={(v) => setEvForm((f) => ({ ...f, registrationOpen: v }))}
        />
        <ToggleRow
          label="Submissions Open"
          desc="Allow paper/abstract submissions"
          value={evForm.submissionsOpen}
          onChange={(v) => setEvForm((f) => ({ ...f, submissionsOpen: v }))}
        />
      </div>

      {/* ── Important Dates ── */}
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
            Important Dates
          </h4>
          <button
            onClick={addDate}
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
            + Add Date
          </button>
        </div>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 14 }}>
          These date cards appear in the dark navy strip on the Home page.
        </p>
        {homeForm.importantDates.map((d, i) => (
          <div
            key={d.id || i}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: 10,
              padding: "14px 16px",
              marginBottom: 10,
              background: d.done ? "#f0fff5" : "#fafafa",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr 1fr 60px auto",
                gap: 10,
                alignItems: "end",
              }}
            >
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 12 }}>Icon</label>
                <input
                  value={d.icon}
                  onChange={(e) => updateDate(i, "icon", e.target.value)}
                  style={{
                    padding: "6px 8px",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    fontSize: 18,
                    textAlign: "center",
                  }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 12 }}>Label</label>
                <input
                  value={d.label}
                  onChange={(e) => updateDate(i, "label", e.target.value)}
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
                <label style={{ fontSize: 12 }}>Date / Status</label>
                <input
                  value={d.date}
                  onChange={(e) => updateDate(i, "date", e.target.value)}
                  placeholder="e.g. 31 Jul 2026"
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    fontSize: 13,
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <label style={{ fontSize: 11, color: "#888" }}>Done</label>
                <button
                  onClick={() => updateDate(i, "done", !d.done)}
                  style={{
                    width: 36,
                    height: 22,
                    borderRadius: 11,
                    border: "none",
                    cursor: "pointer",
                    background: d.done ? "#1B6B3A" : "#ccc",
                    position: "relative",
                    transition: "background 0.2s",
                  }}
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "#fff",
                      position: "absolute",
                      top: 3,
                      left: d.done ? 17 : 3,
                      transition: "left 0.2s",
                    }}
                  />
                </button>
              </div>
              <button
                onClick={() => removeDate(i)}
                style={{
                  background: "#fdecea",
                  color: "#c0392b",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px 10px",
                  fontSize: 12,
                  cursor: "pointer",
                  marginBottom: 20,
                }}
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Featured Sessions ── */}
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
            Featured Sessions
          </h4>
          <button
            onClick={addSession}
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
            + Add Session
          </button>
        </div>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 14 }}>
          Speaker / session cards in the "Programme Highlights" section on the
          Home page.
        </p>
        {homeForm.featuredSessions.map((s, i) => (
          <div
            key={s.id || i}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: 10,
              padding: "16px",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <span style={{ fontWeight: 600, fontSize: 14 }}>
                {s.session || `Session ${i + 1}`}
              </span>
              <button
                onClick={() => removeSession(i)}
                style={{
                  background: "#fdecea",
                  color: "#c0392b",
                  border: "none",
                  borderRadius: 6,
                  padding: "3px 10px",
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
                gridTemplateColumns: "60px 1fr 1fr",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 12 }}>Icon</label>
                <input
                  value={s.icon}
                  onChange={(e) => updateSession(i, "icon", e.target.value)}
                  style={{
                    padding: "6px 8px",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    fontSize: 18,
                    textAlign: "center",
                    width: "100%",
                  }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 12 }}>Tag (shown as badge)</label>
                <input
                  value={s.tag}
                  onChange={(e) => updateSession(i, "tag", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    fontSize: 13,
                  }}
                  placeholder="e.g. Keynote"
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 12 }}>Accent Colour</label>
                <input
                  value={s.accent}
                  onChange={(e) => updateSession(i, "accent", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    fontSize: 13,
                  }}
                  placeholder="#1B3A6B"
                />
              </div>
            </div>
            <div className="form-row" style={{ marginBottom: 10 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 12 }}>Session Title</label>
                <input
                  value={s.session}
                  onChange={(e) => updateSession(i, "session", e.target.value)}
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
                <label style={{ fontSize: 12 }}>Speaker / Role</label>
                <input
                  value={s.role}
                  onChange={(e) => updateSession(i, "role", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    fontSize: 13,
                  }}
                  placeholder="TBA — Keynote Speaker"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 12 }}>Status / Affiliation</label>
                <input
                  value={s.status}
                  onChange={(e) => updateSession(i, "status", e.target.value)}
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
                <label style={{ fontSize: 12 }}>Topic / Theme</label>
                <input
                  value={s.topic}
                  onChange={(e) => updateSession(i, "topic", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    fontSize: 13,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Testimonials ── */}
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
            Testimonials
          </h4>
          <button
            onClick={addTestimonial}
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
            + Add
          </button>
        </div>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 14 }}>
          Participant quotes in the "What Participants Say" section. Photos use
          the global site images.
        </p>
        {homeForm.testimonials.map((t, i) => (
          <div
            key={t.id || i}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: 10,
              padding: "14px 16px",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: 8,
              }}
            >
              <button
                onClick={() => removeTestimonial(i)}
                style={{
                  background: "#fdecea",
                  color: "#c0392b",
                  border: "none",
                  borderRadius: 6,
                  padding: "3px 10px",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
            <div className="form-group" style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 12 }}>Quote</label>
              <textarea
                value={t.quote}
                onChange={(e) => updateTestimonial(i, "quote", e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  fontSize: 13,
                  minHeight: 70,
                  resize: "vertical",
                }}
              />
            </div>
            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 12 }}>Name</label>
                <input
                  value={t.name}
                  onChange={(e) => updateTestimonial(i, "name", e.target.value)}
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
                <label style={{ fontSize: 12 }}>Programme</label>
                <input
                  value={t.prog}
                  onChange={(e) => updateTestimonial(i, "prog", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    fontSize: 13,
                  }}
                  placeholder="MSc Computer Science"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "#f8f9fa",
          borderRadius: 12,
          padding: "14px 18px",
          marginBottom: 20,
          fontSize: 13,
          color: "#666",
        }}
      >
        <strong style={{ color: "#1B3A6B" }}>Announcements & Live Feed</strong>{" "}
        — manage via Admin Tools sidebar.
        <br />
        <strong style={{ color: "#1B3A6B" }}>Homepage photos</strong> — change
        via <strong>Site Images</strong> in Admin Tools.
      </div>

      <button className="btn-primary" onClick={saveAll}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          Save All Home Page Changes <ArrowRight size={14} />
        </span>
      </button>
    </div>
  );
}

/* ── About Page Panel ────────────────────────────────────────── */
function AboutPanel({ about = {}, onChange }) {
  const [form, setForm] = useState({
    badge: about.badge || "2nd Annual Edition",
    title:
      about.title ||
      "A Platform for Academic Excellence in Postgraduate Research",
    desc1: about.desc1 || "",
    desc2: about.desc2 || "",
    imageCaption1: about.imageCaption1 || "Advancing Research at UG",
    imageCaption2: about.imageCaption2 || "Dept. of Computer Science · SPMS",
    cardText: about.cardText || "",
  });
  const [saved, setSaved] = useState(false);
  const save = () => {
    onChange(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ maxWidth: 680 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>
        About Page
      </h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>
        Edit the overview text, captions, and key messages shown on the About
        page.
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
          Saved — changes are live on the About page.
        </div>
      )}

      <div className="card" style={{ marginBottom: 20 }}>
        <h4 style={{ marginBottom: 16, fontFamily: "Playfair Display, serif" }}>
          Hero &amp; Overview
        </h4>
        <div className="form-row">
          <div className="form-group">
            <label>Hero Badge Text</label>
            <input
              value={form.badge}
              onChange={(e) =>
                setForm((f) => ({ ...f, badge: e.target.value }))
              }
              placeholder="2nd Annual Edition"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Section Heading</label>
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="A Platform for Academic Excellence…"
          />
        </div>
        <div className="form-group">
          <label>First Paragraph</label>
          <textarea
            value={form.desc1}
            onChange={(e) => setForm((f) => ({ ...f, desc1: e.target.value }))}
            style={{ minHeight: 80 }}
            placeholder="Introductory paragraph about the workshop…"
          />
        </div>
        <div className="form-group">
          <label>Second Paragraph</label>
          <textarea
            value={form.desc2}
            onChange={(e) => setForm((f) => ({ ...f, desc2: e.target.value }))}
            style={{ minHeight: 80 }}
            placeholder="Continued description…"
          />
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h4 style={{ marginBottom: 16, fontFamily: "Playfair Display, serif" }}>
          Image Captions
        </h4>
        <div className="form-row">
          <div className="form-group">
            <label>Caption Line 1</label>
            <input
              value={form.imageCaption1}
              onChange={(e) =>
                setForm((f) => ({ ...f, imageCaption1: e.target.value }))
              }
              placeholder="Advancing Research at UG"
            />
          </div>
          <div className="form-group">
            <label>Caption Line 2</label>
            <input
              value={form.imageCaption2}
              onChange={(e) =>
                setForm((f) => ({ ...f, imageCaption2: e.target.value }))
              }
              placeholder="Dept. of Computer Science · SPMS"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Info Card Text</label>
          <textarea
            value={form.cardText}
            onChange={(e) =>
              setForm((f) => ({ ...f, cardText: e.target.value }))
            }
            style={{ minHeight: 70 }}
            placeholder="Brief note about this edition compared to the previous…"
          />
        </div>
      </div>

      <div
        style={{
          background: "#f8f9fa",
          borderRadius: 12,
          padding: "14px 18px",
          marginBottom: 20,
          fontSize: 13,
          color: "#666",
        }}
      >
        <strong style={{ color: "#1B3A6B" }}>Hero background image</strong> —
        change via <strong>Site Images → Research Presentations</strong> in
        Admin Tools.
      </div>

      <button className="btn-primary" onClick={save}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          Save About Page <ArrowRight size={14} />
        </span>
      </button>
    </div>
  );
}

/* ── Livestream Page Panel ───────────────────────────────────── */
function StreamPanel({ stream = {}, onChange }) {
  const [form, setForm] = useState({
    live: stream.live || false,
    note: stream.note || "",
    day1Id: stream.day1Id || "",
    day2Id: stream.day2Id || "",
    day3Id: stream.day3Id || "",
  });
  const [saved, setSaved] = useState(false);
  const save = () => {
    onChange(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>
        Livestream Page
      </h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>
        Control the live stream status and YouTube video IDs for each day.
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
          Saved — changes are live on the Livestream page.
        </div>
      )}

      <div className="card" style={{ marginBottom: 20 }}>
        <ToggleRow
          label="Stream is Live"
          desc="Activates the video player for visitors — turn on when streaming begins"
          value={form.live}
          onChange={(v) => setForm((f) => ({ ...f, live: v }))}
        />
        <div className="form-group" style={{ marginTop: 16 }}>
          <label>Stream Notice / Message</label>
          <textarea
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            placeholder="e.g. Stream begins at 9:00 AM GMT on 27 August 2026. Please refresh if buffering."
            style={{ minHeight: 70 }}
          />
        </div>
      </div>

      <div className="card">
        <h4 style={{ marginBottom: 16, fontFamily: "Playfair Display, serif" }}>
          YouTube Video IDs — Per Day
        </h4>
        <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>
          Paste only the video ID (e.g. <code>1KWiyZnJFmw</code>), not the full
          URL. Leave blank if not yet available.
        </p>
        {[
          {
            key: "day1Id",
            label: "Day 1 — Thursday 27 Aug",
            placeholder: "e.g. dQw4w9WgXcQ",
          },
          {
            key: "day2Id",
            label: "Day 2 — Friday 28 Aug",
            placeholder: "e.g. 1KWiyZnJFmw",
          },
          {
            key: "day3Id",
            label: "Day 3 — Saturday 29 Aug",
            placeholder: "e.g. NUAZDcQ_lJs",
          },
        ].map((d) => (
          <div key={d.key} className="form-group">
            <label>{d.label}</label>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                value={form[d.key]}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [d.key]: e.target.value }))
                }
                placeholder={d.placeholder}
                style={{ flex: 1 }}
              />
              {form[d.key] && (
                <a
                  href={`https://youtube.com/watch?v=${form[d.key]}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: 12,
                    color: "#1B3A6B",
                    whiteSpace: "nowrap",
                  }}
                >
                  ▶ Preview
                </a>
              )}
            </div>
          </div>
        ))}
        <button className="btn-primary" onClick={save}>
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            Save Livestream Settings <ArrowRight size={14} />
          </span>
        </button>
      </div>
    </div>
  );
}

/* ── Sponsors Page Panel ─────────────────────────────────────── */
function SponsorsAdminPanel({
  sponsors = [],
  onChangeSponsors,
  footer = {},
  onChange,
}) {
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

/* ── Register Page Panel ─────────────────────────────────────── */
function RegisterPanel({ event, onChange }) {
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

/* ── Site Images Panel ───────────────────────────────────────── */
function ImagesPanel({ images = {}, onChange }) {
  const [form, setForm] = useState({
    workshop: images.workshop || "/images/workshop-sessions.jpg",
    research: images.research || "/images/research-presentations.jpg",
    networking: images.networking || "/images/collaboration-networking.jpeg",
    students: images.students || "/images/dcs-research.jpg",
  });
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(null);
  const fileRef = useRef(null);
  const uploadingKeyRef = useRef(null);

  const save = () => {
    onChange(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const triggerUpload = (key) => {
    uploadingKeyRef.current = key;
    fileRef.current.click();
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file || !uploadingKeyRef.current) return;
    const key = uploadingKeyRef.current;
    e.target.value = "";
    setUploading(key);
    try {
      const url = await uploadToStorage(file);
      setForm((f) => {
        const next = { ...f, [key]: url };
        onChange(next);
        return next;
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Upload failed:", err);
      alert(storageErrorMsg(err));
    } finally {
      setUploading(null);
    }
  };

  const IMAGE_DEFS = [
    {
      key: "workshop",
      label: "Workshop Sessions",
      usedOn: "Home hero background · Home photo strip · Home testimonials",
    },
    {
      key: "research",
      label: "Research Presentations",
      usedOn: "Home 'About' section · Home photo strip · About page hero",
    },
    {
      key: "networking",
      label: "Networking & Events",
      usedOn:
        "Home CTA background · Contact page · Speakers page · Sponsors page",
    },
    {
      key: "students",
      label: "Students / DCS Research",
      usedOn:
        "Home hero card photo · Home awards background · Home testimonials",
    },
  ];

  return (
    <div style={{ maxWidth: 760 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>
        Site Images
      </h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 8 }}>
        These 4 images appear across all pages of the site. Upload a new image
        or paste a URL — every page updates instantly.
      </p>
      <div
        className="alert alert-info"
        style={{ marginBottom: 24, fontSize: 13 }}
      >
        <strong>Upload:</strong> click "Upload" to pick a file from your device.{" "}
        <strong>URL:</strong> paste <code>/images/yourfile.jpg</code> for files
        in <code>public/images/</code>, or any direct image link.
      </div>
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
          Images saved and live on the site.
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFile}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {IMAGE_DEFS.map((def) => {
          const val = form[def.key];
          const isUploading = uploading === def.key;
          return (
            <div
              key={def.key}
              style={{
                background: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: 14,
                padding: "20px 22px",
                display: "flex",
                gap: 20,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 140,
                  height: 96,
                  borderRadius: 10,
                  overflow: "hidden",
                  border: "1px solid #e0e0e0",
                  flexShrink: 0,
                  background: "#f5f5f5",
                }}
              >
                {val ? (
                  <img
                    src={val}
                    alt={def.label}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                    }}
                  >
                    <Image size={28} color="#bbb" />
                  </div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    marginBottom: 2,
                    color: "#1B3A6B",
                  }}
                >
                  {def.label}
                </div>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 10 }}>
                  Used on: {def.usedOn}
                </div>
                <input
                  value={val || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [def.key]: e.target.value }))
                  }
                  placeholder="https://... or /images/filename.jpg"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1.5px solid #ddd",
                    borderRadius: 8,
                    fontSize: 13,
                    marginBottom: 8,
                  }}
                />
                <button
                  type="button"
                  onClick={() => triggerUpload(def.key)}
                  disabled={!!uploading}
                  style={{
                    background: "#E5EAF3",
                    color: "#1B3A6B",
                    border: "1px solid #b0bdd8",
                    borderRadius: 7,
                    padding: "6px 16px",
                    fontSize: 13,
                    cursor: uploading ? "not-allowed" : "pointer",
                    fontWeight: 500,
                    opacity: uploading ? 0.65 : 1,
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <Upload size={13} />{" "}
                    {isUploading ? "Uploading…" : "Upload Image"}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button className="btn-primary" onClick={save} style={{ marginTop: 24 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          Save All Images <ArrowRight size={14} />
        </span>
      </button>
    </div>
  );
}

/* ── Gallery Panel ───────────────────────────────────────────── */
function GalleryPanel({ gallery = [], onChange }) {
  const [items, setItems] = useState(gallery.map((p) => ({ ...p })));
  const [saved, setSaved] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState(null);
  const fileRef = useRef(null);
  const uploadingIdxRef = useRef(null);

  const save = () => {
    onChange(items);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  const update = (i, field, val) =>
    setItems((arr) =>
      arr.map((p, pi) => (pi === i ? { ...p, [field]: val } : p)),
    );
  const remove = (i) => setItems((arr) => arr.filter((_, pi) => pi !== i));
  const add = () =>
    setItems((arr) => [
      ...arr,
      { src: "", caption: "New Photo", year: "2026" },
    ]);

  const triggerUpload = (i) => {
    uploadingIdxRef.current = i;
    fileRef.current.click();
  };
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file || uploadingIdxRef.current === null) return;
    const idx = uploadingIdxRef.current;
    e.target.value = "";
    setUploadingIdx(idx);
    try {
      const url = await uploadToStorage(file);
      setItems((arr) => {
        const next = arr.map((p, pi) => (pi === idx ? { ...p, src: url } : p));
        onChange(next);
        return next;
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Upload failed:", err);
      alert(storageErrorMsg(err));
    } finally {
      setUploadingIdx(null);
    }
  };

  return (
    <div style={{ maxWidth: 800 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>
        Gallery
      </h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>
        Manage photos shown on the Gallery page. Upload images or paste URLs.
        Each photo shows with a caption and year label.
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
          Gallery saved.
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFile}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          marginBottom: 20,
        }}
      >
        {items.map((p, i) => {
          const isUploading = uploadingIdx === i;
          return (
            <div
              key={i}
              style={{
                background: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: 12,
                padding: "16px 18px",
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 120,
                  height: 84,
                  borderRadius: 8,
                  overflow: "hidden",
                  border: "1px solid #eee",
                  flexShrink: 0,
                  background: "#f5f5f5",
                }}
              >
                {p.src ? (
                  <img
                    src={p.src}
                    alt={p.caption}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                    }}
                  >
                    <Image size={24} color="#ccc" />
                  </div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 100px 70px",
                    gap: 10,
                    marginBottom: 8,
                    alignItems: "end",
                  }}
                >
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Caption</label>
                    <input
                      value={p.caption}
                      onChange={(e) => update(i, "caption", e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Year</label>
                    <input
                      value={p.year}
                      onChange={(e) => update(i, "year", e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() => remove(i)}
                    style={{
                      background: "#fdecea",
                      color: "#c0392b",
                      border: "none",
                      borderRadius: 6,
                      padding: "8px 10px",
                      fontSize: 13,
                      cursor: "pointer",
                      marginBottom: 20,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <X size={12} /> Remove
                    </span>
                  </button>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    value={p.src || ""}
                    onChange={(e) => update(i, "src", e.target.value)}
                    placeholder="/images/... or https://..."
                    style={{
                      flex: 1,
                      padding: "7px 10px",
                      border: "1.5px solid #ddd",
                      borderRadius: 7,
                      fontSize: 13,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => triggerUpload(i)}
                    disabled={uploadingIdx !== null}
                    style={{
                      background: "#E5EAF3",
                      color: "#1B3A6B",
                      border: "1px solid #b0bdd8",
                      borderRadius: 7,
                      padding: "7px 14px",
                      fontSize: 12,
                      cursor: uploadingIdx !== null ? "not-allowed" : "pointer",
                      fontWeight: 500,
                      flexShrink: 0,
                      opacity: uploadingIdx !== null ? 0.65 : 1,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <Upload size={13} />{" "}
                      {isUploading ? "Uploading…" : "Upload"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={add}
          style={{
            background: "#fff",
            border: "2px dashed #C9A84C",
            color: "#b5700a",
            borderRadius: 10,
            padding: "10px 20px",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          + Add Photo
        </button>
        <button className="btn-primary" onClick={save}>
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            Save Gallery <ArrowRight size={14} />
          </span>
        </button>
      </div>
    </div>
  );
}

/* ── Recordings Panel ────────────────────────────────────────── */
function RecordingsPanel({ recordings = [], onChange }) {
  const [items, setItems] = useState(recordings.map((r) => ({ ...r })));
  const [saved, setSaved] = useState(false);

  const save = () => {
    onChange(items);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  const update = (i, field, val) =>
    setItems((arr) =>
      arr.map((r, ri) => (ri === i ? { ...r, [field]: val } : r)),
    );
  const updateHighlight = (i, hi, val) =>
    setItems((arr) =>
      arr.map((r, ri) =>
        ri === i
          ? {
              ...r,
              highlights: r.highlights.map((h, hii) => (hii === hi ? val : h)),
            }
          : r,
      ),
    );

  return (
    <div style={{ maxWidth: 700 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>
        Recordings
      </h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>
        Set YouTube video IDs and highlight bullet points for each workshop day
        recording.
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
          Recordings saved.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {items.map((r, i) => (
          <div
            key={i}
            className="card"
            style={{ borderLeft: `4px solid ${r.color}` }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  fontFamily: "Playfair Display, serif",
                  color: r.color,
                }}
              >
                {r.day}
              </span>
              <span style={{ fontSize: 13, color: "#666" }}>{r.label}</span>
            </div>
            <div className="form-group">
              <label>YouTube Video ID</label>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input
                  value={r.youtubeId}
                  onChange={(e) => update(i, "youtubeId", e.target.value)}
                  placeholder="e.g. 1KWiyZnJFmw (leave blank = coming soon)"
                  style={{ flex: 1 }}
                />
                {r.youtubeId && (
                  <a
                    href={`https://youtube.com/watch?v=${r.youtubeId}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: 12,
                      color: "#1B3A6B",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ▶ Preview
                  </a>
                )}
              </div>
            </div>
            <div>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  display: "block",
                  marginBottom: 8,
                }}
              >
                Highlights (shown in sidebar)
              </label>
              {r.highlights.map((h, hi) => (
                <input
                  key={hi}
                  value={h}
                  onChange={(e) => updateHighlight(i, hi, e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 10px",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    fontSize: 13,
                    marginBottom: 6,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="btn-primary" onClick={save} style={{ marginTop: 20 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          Save Recordings <ArrowRight size={14} />
        </span>
      </button>
    </div>
  );
}

/* ── Support Page Panel ──────────────────────────────────────── */
function SupportAdminPanel({ contact = {}, onChange }) {
  const [form, setForm] = useState({
    email: "",
    website: "",
    location: "",
    hours: "",
    whatsapp: "",
    phone: "",
    ...contact,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm((f) => ({ ...f, ...contact }));
  }, [contact]);

  const save = () => {
    onChange(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <h2 style={{ marginBottom: 6, fontFamily: "Playfair Display, serif" }}>
        Support Page
      </h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 8 }}>
        The Support page shows FAQs (fixed content) and a contact tab. Edit the
        contact details shown there — these are shared with the Contact page.
      </p>
      <div
        className="alert alert-info"
        style={{ marginBottom: 24, fontSize: 13 }}
      >
        FAQ questions and answers are fixed in code. Contact details here are
        shared with the <strong>Contact page</strong> and the{" "}
        <strong>WhatsApp button</strong>.
      </div>
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
          Saved — contact info updated on both Contact and Support pages.
        </div>
      )}

      <div className="card">
        <div className="form-row">
          <div className="form-group">
            <label>Email Address</label>
            <input
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              placeholder="dcsworkshop@ug.edu.gh"
            />
          </div>
          <div className="form-group">
            <label>Website</label>
            <input
              value={form.website}
              onChange={(e) =>
                setForm((f) => ({ ...f, website: e.target.value }))
              }
              placeholder="www.cs.ug.edu.gh"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Phone Number</label>
            <input
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
              placeholder="+233 (0) 536 909 471"
            />
          </div>
          <div className="form-group">
            <label>WhatsApp Number</label>
            <input
              value={form.whatsapp}
              onChange={(e) =>
                setForm((f) => ({ ...f, whatsapp: e.target.value }))
              }
              placeholder="233XXXXXXXXX"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Office Hours</label>
          <input
            value={form.hours}
            onChange={(e) => setForm((f) => ({ ...f, hours: e.target.value }))}
            placeholder="Mon–Fri · 8:00 AM – 5:00 PM GMT"
          />
        </div>
        <div className="form-group">
          <label>Location / Address</label>
          <textarea
            value={form.location}
            onChange={(e) =>
              setForm((f) => ({ ...f, location: e.target.value }))
            }
            style={{ minHeight: 70 }}
          />
        </div>
        <button className="btn-primary" onClick={save}>
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            Save Support Contact <ArrowRight size={14} />
          </span>
        </button>
      </div>
    </div>
  );
}

/* ── Security Panel ─────────────────────────────────────────────── */
function SecurityPanel() {
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
    if (user && email === user.email.toLowerCase()) {
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

/* ── Payment Tracking Panel ──────────────────────────────────────── */
function PaymentTrackingPanel({ payments = [], fee = 100, onChange }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    programme: "",
    studentId: "",
    transactionId: "",
    amount: fee,
    method: "mobile_money",
    date: "",
    status: "Confirmed",
  });

  /* ── stats ── */
  const confirmed = payments.filter((p) => p.status === "Confirmed");
  const pending = payments.filter((p) => p.status === "Pending");
  const totalAmount = payments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const confirmedAmt = confirmed.reduce(
    (s, p) => s + (Number(p.amount) || 0),
    0,
  );
  const pendingAmt = pending.reduce((s, p) => s + (Number(p.amount) || 0), 0);

  const fmt = (n) => n.toLocaleString("en-GH");

  /* ── sort + filter ── */
  const toggle = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const visible = payments
    .filter((p) => filter === "All" || p.status === filter)
    .filter((p) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        (p.transactionId || "").toLowerCase().includes(q) ||
        (p.studentId || "").toLowerCase().includes(q) ||
        (p.name || "").toLowerCase().includes(q) ||
        (p.email || "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      let va = a[sortKey],
        vb = b[sortKey];
      if (sortKey === "date") {
        va = new Date(va || 0);
        vb = new Date(vb || 0);
      }
      if (sortKey === "amount") {
        va = Number(va);
        vb = Number(vb);
      }
      return sortDir === "asc" ? (va > vb ? 1 : -1) : va < vb ? 1 : -1;
    });

  /* ── helpers ── */
  const fmtDate = (d) => {
    if (!d) return "—";
    const dt = new Date(d);
    return (
      dt.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) +
      " " +
      dt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    );
  };

  const exportCSV = () => {
    const header =
      "Transaction ID,Student ID,Name,Email,Programme,Amount (GHS),Method,Date,Status";
    const rows = payments.map((p) =>
      [
        p.transactionId,
        p.studentId,
        p.name,
        p.email,
        p.programme,
        p.amount,
        p.method,
        fmtDate(p.date),
        p.status,
      ]
        .map((v) => `"${v || ""}"`)
        .join(","),
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: "payments.csv",
    });
    a.click();
    URL.revokeObjectURL(url);
  };

  const addPayment = () => {
    if (!addForm.name.trim() || !addForm.transactionId.trim()) return;
    const newRec = {
      ...addForm,
      id: Date.now(),
      date: addForm.date || new Date().toISOString(),
    };
    onChange([newRec, ...payments]);
    setAddForm({
      name: "",
      email: "",
      programme: "",
      studentId: "",
      transactionId: "",
      amount: fee,
      method: "mobile_money",
      date: "",
      status: "Confirmed",
    });
    setShowAdd(false);
  };

  const updateStatus = (id, status) =>
    onChange(payments.map((p) => (p.id === id ? { ...p, status } : p)));

  const removePayment = (id) => onChange(payments.filter((p) => p.id !== id));

  const SortIcon = ({ k }) => {
    if (sortKey !== k)
      return <span style={{ color: "#ccc", fontSize: 11 }}>↕</span>;
    return sortDir === "asc" ? (
      <ChevronUp size={13} color="#1B3A6B" />
    ) : (
      <ChevronDown size={13} color="#1B3A6B" />
    );
  };

  const methodBadge = (m) => (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: m === "card" ? "#E5EAF3" : "#e8f5ee",
        color: m === "card" ? "#1B3A6B" : "#1B6B3A",
        fontSize: 11,
        fontWeight: 600,
        padding: "4px 10px",
        borderRadius: 20,
        whiteSpace: "nowrap",
        minWidth: 100,
        textAlign: "center",
      }}
    >
      {m === "card" ? "Card" : "Mobile Money"}
    </span>
  );

  const statusBadge = (s) => (
    <span
      style={{
        background: s === "Confirmed" ? "#e8f5ee" : "#fdf3e0",
        color: s === "Confirmed" ? "#1B6B3A" : "#b5700a",
        fontSize: 11,
        fontWeight: 700,
        padding: "3px 10px",
        borderRadius: 20,
      }}
    >
      {s}
    </span>
  );

  /* ── STAT CARDS ── */
  const cards = [
    {
      label: "Total Transactions",
      value: payments.length,
      sub: null,
      icon: <CreditCard size={22} color="#1B3A6B" />,
      iconBg: "#E5EAF3",
    },
    {
      label: "Total Amount",
      value: `GH₵ ${fmt(totalAmount)}`,
      sub: null,
      icon: <TrendingUp size={22} color="#1B6B3A" />,
      iconBg: "#e8f5ee",
    },
    {
      label: "Confirmed Payments",
      value: confirmed.length,
      sub: `GH₵ ${fmt(confirmedAmt)}`,
      subColor: "#1B6B3A",
      icon: <CheckCircle2 size={22} color="#1B6B3A" />,
      iconBg: "#e8f5ee",
    },
    {
      label: "Pending Payments",
      value: pending.length,
      sub: `GH₵ ${fmt(pendingAmt)}`,
      subColor: "#b5700a",
      icon: <AlertTriangle size={22} color="#b5700a" />,
      iconBg: "#fdf3e0",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h2
            style={{ marginBottom: 4, fontFamily: "Playfair Display, serif" }}
          >
            Payment Tracking
          </h2>
          <p style={{ color: "#666", fontSize: 14 }}>
            Monitor and manage all transaction records
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={exportCSV}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#fff",
              color: "#1B3A6B",
              border: "1.5px solid #b0bdd8",
              borderRadius: 8,
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            onClick={() => setShowAdd((s) => !s)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#1B3A6B",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Plus size={14} /> Add Payment
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {cards.map((c, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              border: "1px solid #e8eaf0",
              borderRadius: 14,
              padding: "20px 22px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>
                {c.label}
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#0F2347",
                  fontFamily: "Playfair Display, serif",
                }}
              >
                {c.value}
              </div>
              {c.sub && (
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: c.subColor,
                    marginTop: 4,
                  }}
                >
                  {c.sub}
                </div>
              )}
            </div>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: c.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {c.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Add payment form */}
      {showAdd && (
        <div
          className="card"
          style={{ marginBottom: 20, border: "2px solid #C9A84C" }}
        >
          <h4
            style={{ marginBottom: 16, fontFamily: "Playfair Display, serif" }}
          >
            Add Manual Payment Record
          </h4>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                value={addForm.name}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. Kwame Asante"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={addForm.email}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, email: e.target.value }))
                }
                placeholder="e.g. kwame@ug.edu.gh"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Transaction ID *</label>
              <input
                value={addForm.transactionId}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, transactionId: e.target.value }))
                }
                placeholder="e.g. UGPGW2026-PAY-..."
              />
            </div>
            <div className="form-group">
              <label>Student ID</label>
              <input
                value={addForm.studentId}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, studentId: e.target.value }))
                }
                placeholder="e.g. 10823456"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Amount (GHS)</label>
              <input
                type="number"
                value={addForm.amount}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, amount: Number(e.target.value) }))
                }
              />
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <select
                value={addForm.method}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, method: e.target.value }))
                }
              >
                <option value="mobile_money">Mobile Money</option>
                <option value="card">Card</option>
                <option value="cash">Cash</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={addForm.status}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, status: e.target.value }))
                }
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button className="btn-primary" onClick={addPayment}>
              <span
                style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                <Check size={14} /> Save Record
              </span>
            </button>
            <button
              onClick={() => setShowAdd(false)}
              style={{
                background: "#f0f0f0",
                border: "none",
                borderRadius: 8,
                padding: "9px 16px",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search + filter */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 20,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative", flex: 1, minWidth: 240 }}>
          <Search
            size={15}
            color="#aaa"
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by transaction ID, name, email, booking code…"
            style={{
              width: "100%",
              paddingLeft: 36,
              paddingRight: 12,
              paddingTop: 9,
              paddingBottom: 9,
              border: "1.5px solid #ddd",
              borderRadius: 10,
              fontSize: 13,
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["All", "Confirmed", "Pending"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? "#1B3A6B" : "#fff",
                color: filter === f ? "#fff" : "#555",
                border: "1.5px solid #ddd",
                borderRadius: 20,
                padding: "6px 16px",
                fontSize: 13,
                cursor: "pointer",
                fontWeight: filter === f ? 600 : 400,
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e0e0e0",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr
                style={{
                  background: "#f8f9fa",
                  borderBottom: "1px solid #eee",
                }}
              >
                {[
                  { label: "Transaction ID", key: "transactionId" },
                  { label: "Student ID", key: "studentId" },
                  { label: "Name", key: "name" },
                  { label: "Payment Date", key: "date" },
                  { label: "Amount (GHS)", key: "amount" },
                  { label: "Method", key: "method" },
                  { label: "Status", key: "status" },
                  { label: "", key: null },
                ].map((col, i) => (
                  <th
                    key={i}
                    onClick={col.key ? () => toggle(col.key) : undefined}
                    style={{
                      padding: "13px 16px",
                      textAlign: "left",
                      fontWeight: 600,
                      fontSize: 12,
                      color: "#555",
                      whiteSpace: "nowrap",
                      cursor: col.key ? "pointer" : "default",
                      userSelect: "none",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      {col.label} {col.key && <SortIcon k={col.key} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "#888",
                    }}
                  >
                    No payment records found.
                  </td>
                </tr>
              )}
              {visible.map((p, i) => (
                <tr
                  key={p.id}
                  style={{
                    borderBottom: "1px solid #f5f5f5",
                    background: i % 2 === 0 ? "#fff" : "#fafafa",
                  }}
                >
                  <td style={{ padding: "13px 16px", maxWidth: 200 }}>
                    <span
                      style={{
                        color: "#1B3A6B",
                        fontFamily: "monospace",
                        fontSize: 11,
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      onClick={() => setSelected(p)}
                    >
                      {(p.transactionId || "—").slice(0, 28)}
                      {(p.transactionId || "").length > 28 ? "…" : ""}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "13px 16px",
                      color: "#555",
                      fontWeight: 500,
                    }}
                  >
                    {p.studentId || "—"}
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ fontWeight: 500 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "#888" }}>{p.email}</div>
                  </td>
                  <td
                    style={{
                      padding: "13px 16px",
                      color: "#555",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div>
                      {p.date
                        ? new Date(p.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </div>
                    <div style={{ fontSize: 11, color: "#aaa" }}>
                      {p.date
                        ? new Date(p.date).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "13px 16px",
                      fontWeight: 700,
                      color: "#0F2347",
                    }}
                  >
                    GH₵ {fmt(Number(p.amount) || 0)}
                  </td>
                  <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                    {methodBadge(p.method)}
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    {statusBadge(p.status)}
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <button
                      onClick={() => setSelected(p)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        background: "#f4f6fb",
                        color: "#1B3A6B",
                        border: "1px solid #b0bdd8",
                        borderRadius: 8,
                        padding: "5px 12px",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      <Eye size={13} /> View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          style={{
            padding: "12px 20px",
            borderTop: "1px solid #eee",
            fontSize: 12,
            color: "#888",
          }}
        >
          Showing {visible.length} of {payments.length} records
        </div>
      </div>

      {/* Details modal */}
      {selected && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 32,
              maxWidth: 520,
              width: "100%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <h3 style={{ fontFamily: "Playfair Display, serif", margin: 0 }}>
                Payment Details
              </h3>
              <button
                onClick={() => setSelected(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#888",
                }}
              >
                <X size={20} />
              </button>
            </div>

            {[
              [
                "Transaction ID",
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: 12,
                    wordBreak: "break-all",
                  }}
                >
                  {selected.transactionId}
                </span>,
              ],
              ["Student ID", selected.studentId || "—"],
              ["Full Name", selected.name],
              ["Email", selected.email],
              ["Programme", selected.programme],
              ["Amount", `GH₵ ${fmt(Number(selected.amount) || 0)}`],
              [
                "Payment Method",
                selected.method === "card"
                  ? "Debit / Credit Card"
                  : "Mobile Money",
              ],
              ["Date & Time", fmtDate(selected.date)],
            ].map(([label, val]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom: "1px solid #f0f0f0",
                  fontSize: 14,
                }}
              >
                <span style={{ color: "#666", flexShrink: 0, marginRight: 16 }}>
                  {label}
                </span>
                <span style={{ fontWeight: 500, textAlign: "right" }}>
                  {val}
                </span>
              </div>
            ))}

            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
                Update Status
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => {
                    updateStatus(selected.id, "Confirmed");
                    setSelected((p) => ({ ...p, status: "Confirmed" }));
                  }}
                  style={{
                    flex: 1,
                    background:
                      selected.status === "Confirmed" ? "#e8f5ee" : "#f5f5f5",
                    color: selected.status === "Confirmed" ? "#1B6B3A" : "#555",
                    border: `1.5px solid ${selected.status === "Confirmed" ? "#a8d5b8" : "#ddd"}`,
                    borderRadius: 8,
                    padding: "9px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <Check size={14} /> Confirmed
                  </span>
                </button>
                <button
                  onClick={() => {
                    updateStatus(selected.id, "Pending");
                    setSelected((p) => ({ ...p, status: "Pending" }));
                  }}
                  style={{
                    flex: 1,
                    background:
                      selected.status === "Pending" ? "#fdf3e0" : "#f5f5f5",
                    color: selected.status === "Pending" ? "#b5700a" : "#555",
                    border: `1.5px solid ${selected.status === "Pending" ? "#e8d5a0" : "#ddd"}`,
                    borderRadius: 8,
                    padding: "9px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <AlertTriangle size={14} /> Pending
                  </span>
                </button>
                <button
                  onClick={() => {
                    removePayment(selected.id);
                    setSelected(null);
                  }}
                  style={{
                    background: "#fdecea",
                    color: "#c0392b",
                    border: "1px solid #f5b7b1",
                    borderRadius: 8,
                    padding: "9px 14px",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
