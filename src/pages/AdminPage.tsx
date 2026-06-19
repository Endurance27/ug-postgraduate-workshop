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


const BASE = import.meta.env.BASE_URL;
const SLIDE_IMAGES = [
  { src: `${BASE}images/dcs-research.jpg`,              caption: "Research in Action" },
  { src: `${BASE}images/collaboration-networking.jpeg`, caption: "Collaboration & Networking" },
  { src: `${BASE}images/research-presentations.jpg`,    caption: "Academic Presentations" },
  { src: `${BASE}images/workshop-sessions.jpg`,         caption: "Workshop Excellence" },
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
      <div className="min-h-screen flex items-center justify-center bg-ug-admin-bg">
        <div className="text-center">
          <div className="mb-4 text-ug-blue">
            <Shield size={36} />
          </div>
          <p className="text-[#555] text-[15px]">Loading admin console…</p>
        </div>
      </div>
    );

  if (!fireUser)
    return (
      <main className="min-h-screen flex">
        {/* ── Left: image slideshow ── */}
        <div
          className="flex-1 relative overflow-hidden min-h-[500px] flex admin-slide-panel"
        >
          {SLIDE_IMAGES.map((img, i) => (
            <div
              key={i}
              style={{
                backgroundImage: `url('${img.src}')`,
                opacity: i === slide ? (fading ? 0 : 1) : 0,
              }}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-[600ms]"
            >
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,35,71,0.75)_0%,rgba(27,58,107,0.55)_100%)]" />
            </div>
          ))}

          {/* Overlay content */}
          <div className="relative z-[1] flex flex-col justify-between p-[48px_40px] w-full">
            <div>
              <div className="inline-block bg-[rgba(201,168,76,0.2)] border border-[rgba(201,168,76,0.4)] rounded-lg px-3.5 py-1.5 mb-6">
                <span className="text-ug-gold text-[13px] font-semibold">
                  DCS Workshop 2026
                </span>
              </div>
              <h2 className="text-white font-serif text-[2rem] leading-[1.3] max-w-[340px]">
                Postgraduate Research Workshop Administration
              </h2>
              <p className="text-white/70 mt-3.5 text-[15px] max-w-[340px]">
                Manage registrations, submissions, schedule, and live updates
                for the 2nd Annual Workshop.
              </p>
            </div>

            {/* Slide caption + dots */}
            <div>
              <p className="text-white/60 text-[13px] mb-3 italic">
                {SLIDE_IMAGES[slide].caption}
              </p>
              <div className="flex gap-2">
                {SLIDE_IMAGES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSlide(i);
                    }}
                    style={{
                      width: i === slide ? 24 : 8,
                      background: i === slide ? "#C9A84C" : "rgba(255,255,255,0.35)",
                    }}
                    className="h-2 rounded-[4px] border-none cursor-pointer p-0 transition-all duration-300"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: auth form ── */}
        <div
          className="flex-1 flex items-center justify-center px-10 py-12 bg-white admin-form-panel"
        >
          <div className="w-full max-w-[400px]">
            {/* ── SIGN IN ── */}
            {authView === "signin" && (
              <>
                <div className="text-center mb-8">
                  <div className="text-xs text-ug-gold font-bold tracking-[0.1em] uppercase mb-2.5">
                    Admin Console
                  </div>
                  <h2 className="font-serif text-[2rem] text-ug-navy mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-[#666] text-[15px]">
                    Sign in to manage the workshop.
                  </p>
                </div>
                <div className="border-t border-[#e8eaf0] mb-7" />
                {authError && (
                  <div className="bg-[#fff3f3] border border-[#f5b8b8] rounded-[10px] px-3.5 py-2.5 mb-[18px] text-[#c0392b] text-[13px]">
                    {authError}
                  </div>
                )}
                {authMsg && (
                  <div className="bg-[#f0faf4] border border-[#a8d5b5] rounded-[10px] px-3.5 py-2.5 mb-[18px] text-[#1e7e3e] text-[13px]">
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
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="m-0">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        setAuthView("forgot");
                      }}
                      className="bg-none border-none text-ug-blue text-xs cursor-pointer p-0 font-semibold"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
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
                      className="pr-11"
                      onKeyDown={(e) =>
                        e.key === "Enter" && !authLoading && handleSignIn()
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[#888] text-base p-0"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button
                  className={`btn-primary w-full justify-center px-0 py-3.5 text-[15px] rounded-[10px] mt-2${authLoading ? " opacity-65 cursor-not-allowed" : ""}`}
                  onClick={handleSignIn}
                  disabled={authLoading}
                >
                  {authLoading ? (
                    "Signing in…"
                  ) : (
                    <span className="inline-flex items-center gap-1.5">
                      Sign In <ArrowRight size={14} />
                    </span>
                  )}
                </button>
                <div className="text-center mt-5">
                  <span className="text-[#888] text-[13px]">
                    Don't have an account?{" "}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setAuthView("signup");
                    }}
                    className="bg-transparent border-none text-ug-blue text-[13px] font-bold cursor-pointer p-0"
                  >
                    Create account
                  </button>
                </div>
              </>
            )}

            {/* ── SIGN UP ── */}
            {authView === "signup" && (
              <>
                <div className="text-center mb-8">
                  <div className="text-xs text-ug-gold font-bold tracking-[0.1em] uppercase mb-2.5">
                    Admin Console
                  </div>
                  <h2 className="font-serif text-[2rem] text-ug-navy mb-2">
                    Create Account
                  </h2>
                  <p className="text-[#666] text-[15px]">
                    Set up admin access for the workshop.
                  </p>
                </div>
                <div className="border-t border-[#e8eaf0] mb-7" />
                {authError && (
                  <div className="bg-[#fff3f3] border border-[#f5b8b8] rounded-[10px] px-3.5 py-2.5 mb-[18px] text-[#c0392b] text-[13px]">
                    {authError}
                  </div>
                )}
                {authMsg && (
                  <div className="bg-[#f0faf4] border border-[#a8d5b5] rounded-[10px] px-3.5 py-2.5 mb-[18px] text-[#1e7e3e] text-[13px] leading-relaxed">
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
                      <div className="relative">
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
                          className="pr-11"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[#888] text-base p-0"
                        >
                          {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Confirm Password</label>
                      <div className="relative">
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
                          className="pr-11"
                          onKeyDown={(e) =>
                            e.key === "Enter" && !authLoading && handleSignUp()
                          }
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[#888] text-base p-0"
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
                      <div className="flex gap-1.5 flex-wrap mb-4">
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
                            className={`text-[11px] px-2 py-0.5 rounded-xl font-semibold${ok ? " bg-[#e8f5ee] text-[#27ae60]" : " bg-[#f5f5f5] text-[#aaa]"}`}
                          >
                            {ok ? <Check size={11} /> : "○"} {label}
                          </span>
                        ))}
                      </div>
                    )}
                    <button
                      className={`btn-primary w-full justify-center px-0 py-3.5 text-[15px] rounded-[10px]${authLoading ? " opacity-65 cursor-not-allowed" : ""}`}
                      onClick={handleSignUp}
                      disabled={authLoading}
                    >
                      {authLoading ? (
                        "Creating account…"
                      ) : (
                        <span className="inline-flex items-center gap-1.5">
                          Create Account <ArrowRight size={14} />
                        </span>
                      )}
                    </button>
                  </>
                )}
                <div className="text-center mt-5">
                  <span className="text-[#888] text-[13px]">
                    Already have an account?{" "}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setAuthView("signin");
                    }}
                    className="bg-transparent border-none text-ug-blue text-[13px] font-bold cursor-pointer p-0"
                  >
                    Sign in
                  </button>
                </div>
              </>
            )}

            {/* ── FORGOT PASSWORD ── */}
            {authView === "forgot" && (
              <>
                <div className="text-center mb-8">
                  <div className="text-xs text-ug-gold font-bold tracking-[0.1em] uppercase mb-2.5">
                    Admin Console
                  </div>
                  <h2 className="font-serif text-[2rem] text-ug-navy mb-2">
                    Reset Password
                  </h2>
                  <p className="text-[#666] text-[15px]">
                    Enter your email and we'll send a reset link.
                  </p>
                </div>
                <div className="border-t border-[#e8eaf0] mb-7" />
                {authError && (
                  <div className="bg-[#fff3f3] border border-[#f5b8b8] rounded-[10px] px-3.5 py-2.5 mb-[18px] text-[#c0392b] text-[13px]">
                    {authError}
                  </div>
                )}
                {authMsg && (
                  <div className="bg-[#f0faf4] border border-[#a8d5b5] rounded-[10px] px-3.5 py-2.5 mb-[18px] text-[#1e7e3e] text-[13px]">
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
                      className={`btn-primary w-full justify-center px-0 py-3.5 text-[15px] rounded-[10px]${authLoading ? " opacity-65 cursor-not-allowed" : ""}`}
                      onClick={handleForgotPassword}
                      disabled={authLoading}
                    >
                      {authLoading ? (
                        "Sending…"
                      ) : (
                        <span className="inline-flex items-center gap-1.5">
                          Send Reset Link <ArrowRight size={14} />
                        </span>
                      )}
                    </button>
                  </>
                )}
                <div className="text-center mt-5">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setAuthView("signin");
                    }}
                    className="bg-transparent border-none text-ug-blue text-[13px] font-bold cursor-pointer p-0"
                  >
                    <span className="inline-flex items-center gap-1.5">
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

  // Derive current section label + icon for breadcrumb
  const allNavItems = [...SIDEBAR_TOOLS, ...SIDEBAR_PAGES];
  const currentNavItem = allNavItems.find(s => s.key === activeSection);
  const SectionIcon = currentNavItem?.icon ?? LayoutDashboard;
  const sectionLabel = currentNavItem?.label ?? "Dashboard";

  // User display
  const userEmail = fireUser?.email ?? "";
  const userHandle = userEmail.split("@")[0];
  const userInitial = userEmail.charAt(0).toUpperCase() || "A";

  return (
    <AdminContext.Provider value={{ siteContent, updateContent, navigate }}>
    <div className="flex flex-col min-h-screen bg-ug-admin-bg">

      {/* ── TOP BAR ─────────────────────────────────────────────── */}
      <div className="bg-[#07152A] border-b border-[rgba(201,168,76,0.2)] px-5 h-[50px] flex justify-between items-center shrink-0 z-10">
        {/* Left: brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-[5px] bg-ug-gold flex items-center justify-center">
              <Shield size={13} color="#0A1A35" />
            </div>
            <span className="text-white font-bold text-[13px] tracking-[0.03em]">
              DCS Admin Console
            </span>
          </div>
          <span className="text-white/20 text-[10px]">|</span>
          <span className="text-white/40 text-[12px] hidden sm:block">
            {event.edition}
          </span>
        </div>

        {/* Right: user + website link */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-white/[0.06] rounded-lg px-3 py-1.5">
            <div className="w-5 h-5 rounded-full bg-ug-gold/80 flex items-center justify-center text-[10px] font-bold text-ug-navy shrink-0">
              {userInitial}
            </div>
            <span className="text-white/60 text-[12px] max-w-[120px] truncate">{userHandle}</span>
          </div>
          <button
            onClick={() => navigate && navigate("home")}
            className="bg-ug-gold text-ug-navy border-none rounded-lg px-4 py-[6px] text-[12px] font-bold cursor-pointer hover:bg-ug-gold-dark transition-colors duration-150"
          >
            <span className="inline-flex items-center gap-1.5">
              <ArrowLeft size={13} /> Website
            </span>
          </button>
        </div>
      </div>

      {/* ── SIDEBAR + CONTENT ────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── SIDEBAR ──────────────────────────────────────────────── */}
        <aside
          className="w-[232px] bg-ug-navy flex flex-col shrink-0 overflow-y-auto"
          style={{ boxShadow: "2px 0 12px rgba(0,0,0,0.18)" }}
        >
          {/* Workspace header */}
          <div className="px-4 pt-5 pb-3 border-b border-white/[0.07]">
            <div className="text-[10px] text-white/35 tracking-[0.12em] uppercase mb-0.5">Workspace</div>
            <div className="text-[13px] font-semibold text-white/90 truncate">DCS Workshop 2026</div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-2.5 py-3">

            <div className="text-[10px] text-white/35 tracking-[0.12em] uppercase px-2 pb-1.5 pt-0.5">
              Site Pages
            </div>
            {SIDEBAR_PAGES.map((s) => {
              const active = activeSection === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => adminNav('/admin/' + s.key)}
                  style={{
                    borderLeft: `2px solid ${active ? "#C9A84C" : "transparent"}`,
                    paddingLeft: active ? 10 : 12,
                  }}
                  className={`w-full flex items-center gap-2.5 rounded-[7px] pr-3 py-[8px] mb-[1px] text-[13px] cursor-pointer text-left transition-all duration-150${
                    active
                      ? " bg-[rgba(201,168,76,0.13)] text-ug-gold font-semibold"
                      : " bg-transparent text-white/55 font-normal hover:bg-white/[0.07] hover:text-white/85"
                  }`}
                >
                  <s.icon size={14} className="shrink-0" />
                  {s.label}
                </button>
              );
            })}

            <div className="h-px bg-white/[0.08] my-2.5 mx-1" />

            <div className="text-[10px] text-white/35 tracking-[0.12em] uppercase px-2 pb-1.5">
              Admin Tools
            </div>
            {SIDEBAR_TOOLS.map((s) => {
              const active = activeSection === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => adminNav('/admin/' + s.key)}
                  style={{
                    borderLeft: `2px solid ${active ? "#C9A84C" : "transparent"}`,
                    paddingLeft: active ? 10 : 12,
                  }}
                  className={`w-full flex items-center gap-2.5 rounded-[7px] pr-3 py-[8px] mb-[1px] text-[13px] cursor-pointer text-left transition-all duration-150${
                    active
                      ? " bg-[rgba(201,168,76,0.13)] text-ug-gold font-semibold"
                      : " bg-transparent text-white/55 font-normal hover:bg-white/[0.07] hover:text-white/85"
                  }`}
                >
                  <s.icon size={14} className="shrink-0" />
                  {s.label}
                </button>
              );
            })}
          </nav>

          {/* Bottom: status + user + sign out */}
          <div className="px-2.5 py-3 border-t border-white/[0.07] space-y-2">
            {/* Registration status pill */}
            <div
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[12px]${
                event.registrationOpen
                  ? " bg-[rgba(50,180,100,0.12)] text-[#5dbb7a]"
                  : " bg-[rgba(220,50,50,0.12)] text-[#f07070]"
              }`}
            >
              <span className="text-[8px] leading-none">●</span>
              <span className="font-medium">Registration {event.registrationOpen ? "Open" : "Closed"}</span>
            </div>

            {/* User row */}
            <div className="flex items-center gap-2.5 px-2 py-1.5">
              <div className="w-7 h-7 rounded-full bg-ug-gold/20 border border-ug-gold/30 flex items-center justify-center text-[11px] font-bold text-ug-gold shrink-0">
                {userInitial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-medium text-white/80 truncate">{userHandle}</div>
                <div className="text-[10px] text-white/35">Administrator</div>
              </div>
            </div>

            {/* Sign out */}
            <button
              onClick={() => { signOut(auth); navigate && navigate("home"); }}
              className="w-full bg-white/[0.06] hover:bg-white/[0.1] text-white/50 hover:text-white/75 border border-white/[0.1] rounded-lg py-2 text-[12px] cursor-pointer transition-all duration-150"
            >
              Sign Out
            </button>
          </div>
        </aside>

        {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Breadcrumb bar */}
          <div className="bg-white border-b border-[#ebebef] px-8 py-2.5 flex items-center gap-1.5 text-[12px] shrink-0">
            <SectionIcon size={13} style={{ color: "#aaa", flexShrink: 0 }} />
            <span className="text-[#bbb]">Admin</span>
            <span className="text-[#ddd] mx-0.5">/</span>
            <span className="text-[#555] font-semibold">{sectionLabel}</span>
          </div>

          {/* Panel content */}
          <div className="flex-1 px-8 py-7">
            <Outlet />
          </div>
        </div>

      </div>
    </div>
    </AdminContext.Provider>
  );
}
