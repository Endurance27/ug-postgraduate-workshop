import { useState, useEffect, useRef } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  auth,
  db,
  doc,
  setDoc,
  collection,
  onSnapshot,
  onAuthStateChanged,
} from "./firebase.js";
import AdminLayout from "./layouts/AdminLayout.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import {
  adminRoutes,
  adminChildRoutes,
  getChildRoutePath,
  getRoutePath,
  getRouteProps,
  mainRoutes,
  routeMap,
  Route as AppRoute,
} from "./routes.js";
import "./index.css";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Participant {
  id: string | number;
  _docId?: string; // Firestore document ID — populated by the registrations listener
  name: string;
  fullName?: string;
  email: string;
  phone?: string;
  studentId?: string;
  department?: string;
  programme?: string;
  level?: string;
  type?: string;
  participationType?: string;
  payment?: string;
  mode?: string;
  attendanceMode?: string;
  presentationType?: string;
  nationality?: string;
  presentationTitle?: string;
  abstract?: string;
  registeredAt?: string;
  updatedAt?: string;
  payRef?: string;
  paymentMethod?: string;
  // Email notification metadata — written by the Cloud Function, never by the frontend
  emailSent?: boolean;
  emailSentAt?: string | null;
  emailDeliveryStatus?: "processing" | "delivered" | "failed" | null;
  emailError?: string | null;
}

interface PaymentRecord {
  id: string | number;
  transactionId: string;
  studentId: string;
  name: string;
  email: string;
  programme: string;
  amount: number;
  method: string;
  date: string;
  status: string;
}

interface SaveOptions {
  paymentStatus?: string;
  paymentReference?: string;
  amount?: number;
  method?: string;
}

interface ContentStatus {
  loading: boolean;
  error: string;
}

interface SiteContent {
  event: Record<string, unknown>;
  about: Record<string, unknown>;
  home: Record<string, unknown>;
  footer: Record<string, unknown>;
  contact: Record<string, unknown>;
  schedule: unknown[];
  participants: Participant[];
  payments: PaymentRecord[];
  speakers: Record<string, unknown>;
  sponsors: unknown[];
  gallery: unknown[];
  recordings: unknown[];
  faqs: unknown[];
  stream: Record<string, unknown>;
  awards: unknown[];
  pastWinners: unknown[];
  announcements: unknown[];
  submissions: unknown[];
  feed: unknown[];
  votes: Record<string, unknown>;
  images: Record<string, string>;
}

// ─── Asset base (resolves /workshop/ in production, / in dev) ─────────────────
// Use this for every public/ folder reference so the sub-path deploy works.
const B = import.meta.env.BASE_URL; // e.g. "/workshop/" or "/"

// ─── Helpers ──────────────────────────────────────────────────────────────────
function stripBase64(obj: unknown): unknown {
  if (typeof obj === "string") return obj.startsWith("data:") ? "" : obj;
  if (Array.isArray(obj)) return obj.map(stripBase64);
  if (obj && typeof obj === "object")
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, stripBase64(v)]),
    );
  return obj;
}

const INIT_SCHEDULE = [
  {
    day: "Day 1",
    date: "Thursday, 27 August 2026",
    sessions: [
      {
        id: 101,
        time: "8:00 AM",
        title: "Registration & Check-in",
        type: "plenary",
        track: "",
        presenter: "",
      },
      {
        id: 102,
        time: "9:00 AM",
        title: "Opening Ceremony & Welcome Address",
        type: "plenary",
        track: "",
        presenter: "HOD, Dept. of Computer Science",
      },
      {
        id: 103,
        time: "9:45 AM",
        title: "Keynote Address",
        type: "plenary",
        track: "",
        presenter: "Distinguished Invited Speaker",
      },
      {
        id: 104,
        time: "11:00 AM",
        title: "Coffee Break & Networking",
        type: "break",
        track: "",
        presenter: "",
      },
      {
        id: 105,
        time: "11:30 AM",
        title: "Parallel Track Sessions — Morning Block",
        type: "parallel",
        track: "",
        presenter: "",
      },
      {
        id: 106,
        time: "1:00 PM",
        title: "Lunch Break",
        type: "break",
        track: "",
        presenter: "",
      },
      {
        id: 107,
        time: "2:00 PM",
        title: "Parallel Track Sessions — Afternoon Block",
        type: "parallel",
        track: "",
        presenter: "",
      },
      {
        id: 108,
        time: "4:00 PM",
        title: "Day 1 Wrap-up & Announcements",
        type: "plenary",
        track: "",
        presenter: "",
      },
    ],
  },
  {
    day: "Day 2",
    date: "Friday, 28 August 2026",
    sessions: [
      {
        id: 201,
        time: "8:30 AM",
        title: "Morning Briefing",
        type: "plenary",
        track: "",
        presenter: "",
      },
      {
        id: 202,
        time: "9:00 AM",
        title: "Poster Presentation Session",
        type: "track",
        track: "Poster Track",
        presenter: "",
      },
      {
        id: 203,
        time: "10:30 AM",
        title: "Technical Paper Session",
        type: "track",
        track: "Technical Track",
        presenter: "",
      },
      {
        id: 204,
        time: "11:00 AM",
        title: "Coffee Break",
        type: "break",
        track: "",
        presenter: "",
      },
      {
        id: 205,
        time: "11:30 AM",
        title: "Panel Discussion: Research & Industry",
        type: "plenary",
        track: "",
        presenter: "Faculty Panel",
      },
      {
        id: 206,
        time: "1:00 PM",
        title: "Lunch Break",
        type: "break",
        track: "",
        presenter: "",
      },
      {
        id: 207,
        time: "2:00 PM",
        title: "Short Paper Session — CS & Data Science",
        type: "parallel",
        track: "",
        presenter: "",
      },
      {
        id: 208,
        time: "4:00 PM",
        title: "IT for Business Observation Sessions",
        type: "track",
        track: "IT for Business Track",
        presenter: "",
      },
    ],
  },
  {
    day: "Day 3",
    date: "Saturday, 29 August 2026",
    sessions: [
      {
        id: 301,
        time: "8:30 AM",
        title: "Morning Briefing & Final Day Orientation",
        type: "plenary",
        track: "",
        presenter: "",
      },
      {
        id: 302,
        time: "9:00 AM",
        title: "Regular Paper Session — Final Presentations",
        type: "track",
        track: "CS Track",
        presenter: "",
      },
      {
        id: 303,
        time: "10:30 AM",
        title: "Coffee Break",
        type: "break",
        track: "",
        presenter: "",
      },
      {
        id: 304,
        time: "11:00 AM",
        title: "Judges' Deliberation (Closed)",
        type: "plenary",
        track: "",
        presenter: "Review Panel",
      },
      {
        id: 305,
        time: "12:00 PM",
        title: "Lunch Break",
        type: "break",
        track: "",
        presenter: "",
      },
      {
        id: 306,
        time: "1:30 PM",
        title: "Awards Ceremony & Announcement",
        type: "plenary",
        track: "",
        presenter: "Workshop Committee",
      },
      {
        id: 307,
        time: "3:00 PM",
        title: "Closing Ceremony & Group Photo",
        type: "plenary",
        track: "",
        presenter: "",
      },
    ],
  },
];

// Participants are loaded exclusively from the "registrations" Firestore collection.
// Do NOT put hardcoded records here — they would appear in the admin dashboard as real students.
const INIT_PARTICIPANTS: Participant[] = [];

const INIT_SUBMISSIONS = [
  {
    id: 1,
    title: "Deep Learning for Malaria Detection in Ghana",
    author: "Kwame Asante",
    category: "Regular Paper",
    status: "Under Review",
  },
  {
    id: 2,
    title: "Predictive Analytics for Agricultural Yields",
    author: "Abena Mensah",
    category: "Technical Paper",
    status: "Accepted",
  },
  {
    id: 3,
    title: "Blockchain for Land Registry in West Africa",
    author: "Yaw Darko",
    category: "Short Paper",
    status: "Under Review",
  },
];

const INIT_CONTENT = {
  event: {
    title: "2026 DCS Postgradute Research Conference & Workshop",
    edition: "2nd Annual Edition",
    dates: "27–29 August 2026",
    venue: "University of Ghana, Legon",
    fee: 100,
    paystackKey: "",
    registrationOpen: true,
    submissionsOpen: true,
    morningCapacity: 60,
    afternoonCapacity: 60,
    sessionCounts: {
      "27Aug_Morning": 0, "27Aug_Afternoon": 0,
      "28Aug_Morning": 0, "28Aug_Afternoon": 0,
      "29Aug_Morning": 0, "29Aug_Afternoon": 0,
    },
    description:
      "A flagship academic event by the Department of Computer Science, University of Ghana — now in its second edition.",
  },
  about: {
    badge: "2nd Annual Edition",
    title: "A Platform for Academic Excellence in Postgraduate Research",
    desc1:
      "The 2nd Annual DCS Postgraduate Students Workshop builds on the success of the maiden edition held in 2025, bringing together MSc and MPhil students from Computer Science, Data Science, and IT for Business programmes.",
    desc2:
      "The workshop provides a structured platform for students to present original research, receive expert feedback, and engage with peers and academic staff in a rigorous yet supportive environment.",
    imageCaption1: "Advancing Research at UG",
    imageCaption2: "Dept. of Computer Science · SPMS",
    cardText:
      "Following the success of the 2025 inaugural edition, the 2026 workshop expands to include broader participation across all DCS postgraduate programmes, richer parallel tracks, and a formal awards ceremony.",
  },
  pastWinners: [
    {
      id: 1,
      pos: "🥇",
      place: "1st Place Award",
      desc: "Best Presenter",
      edition: "Maiden Workshop 2025",
      field: "Computer Science",
      name: "",
      avatar: "",
    },
    {
      id: 2,
      pos: "🥈",
      place: "2nd Place Award",
      desc: "Outstanding Presentation",
      edition: "Maiden Workshop 2025",
      field: "Data Science",
      name: "",
      avatar: "",
    },
    {
      id: 3,
      pos: "🥉",
      place: "3rd Place Award",
      desc: "Commended Presenter",
      edition: "Maiden Workshop 2025",
      field: "Computer Science",
      name: "",
      avatar: "",
    },
  ],
  announcements: [],
  schedule: INIT_SCHEDULE,
  awards: [
    {
      id: 1,
      emoji: "🥇",
      label: "First Place",
      winner: "",
      paper: "",
      announced: false,
    },
    {
      id: 2,
      emoji: "🥈",
      label: "Second Place",
      winner: "",
      paper: "",
      announced: false,
    },
    {
      id: 3,
      emoji: "🥉",
      label: "Third Place",
      winner: "",
      paper: "",
      announced: false,
    },
  ],
  participants: INIT_PARTICIPANTS,
  submissions: INIT_SUBMISSIONS,
  feed: [],
  votes: {},
  speakers: {
    keynote: {
      name: "Prof. Acheampong Sarfo-Mensah",
      title: "Professor of Artificial Intelligence",
      institution: "University of Ghana, Legon",
      topic:
        "AI and the Future of African Research: Opportunities, Challenges and Responsibilities",
      bio: "Professor Sarfo-Mensah is a distinguished faculty member at the Department of Computer Science, University of Ghana, with over 20 years of experience in artificial intelligence, machine learning, and their applications to African development challenges. He leads the AI for Africa research group and has published extensively in top-tier international journals and conferences.",
      photo: `${B}images/dcs-research.jpg`,
      tags: "Artificial Intelligence, Machine Learning, Africa Tech",
    },
    panelists: [
      { id: 1, name: "Dr. Abena Osei-Bonsu",     title: "Senior Lecturer, Data Science",   institution: "Dept. of Computer Science, UG", role: "Panel Moderator", bio: "Specialises in data science applications for healthcare and agriculture in West Africa.",                              photo: `${B}images/research-presentations.jpg` },
      { id: 2, name: "Dr. Kwaku Darko-Mensah",   title: "Lecturer, Computer Networks",     institution: "Dept. of Computer Science, UG", role: "Panelist",        bio: "Research interests include network security, IoT systems, and rural connectivity solutions.",                         photo: `${B}images/workshop-sessions.jpg` },
      { id: 3, name: "Dr. Efua Asante",           title: "Lecturer, Software Engineering",  institution: "Dept. of Computer Science, UG", role: "Panelist",        bio: "Works on human-computer interaction, accessibility, and software development methodologies.",                         photo: `${B}images/collaboration-networking.jpeg` },
      { id: 4, name: "Dr. Kofi Oppong-Nkrumah",  title: "Lecturer, Cybersecurity",         institution: "Dept. of Computer Science, UG", role: "Panelist",        bio: "Expert in cybersecurity, digital forensics, and information assurance for African institutions.",                     photo: `${B}images/dcs-research.jpg` },
    ],
    committee: [
      {
        id: 1,
        name: "Prof. J.B. Hayfron-Acquah",
        role: "Head of Department",
        institution: "Dept. of Computer Science, UG",
      },
      {
        id: 2,
        name: "Dr. Amos Nunoo",
        role: "Workshop Chair",
        institution: "Dept. of Computer Science, UG",
      },
      {
        id: 3,
        name: "Dr. Yaw Marfo-Owusu",
        role: "Programme Committee Chair",
        institution: "Dept. of Computer Science, UG",
      },
      {
        id: 4,
        name: "Dr. Gifty Tetteh",
        role: "Registration Coordinator",
        institution: "Dept. of Computer Science, UG",
      },
      {
        id: 5,
        name: "Dr. Seth Larbi",
        role: "Technical Committee Lead",
        institution: "Dept. of Computer Science, UG",
      },
      {
        id: 6,
        name: "Dr. Emelia Amoako",
        role: "Awards Committee Chair",
        institution: "Dept. of Computer Science, UG",
      },
    ],
  },
  contact: {
    email: "dcsworkshop@ug.edu.gh",
    website: "www.cs.ug.edu.gh",
    location:
      "Department of Computer Science, University of Ghana, Legon, P.O. Box LG 25, Accra, Ghana",
    hours: "Mon–Fri · 8:00 AM – 5:00 PM GMT",
    whatsapp: "233536909471",
    phone: "+233 (0) 536 909 471",
  },
  footer: {
    tagline: "2nd Annual Postgraduate Students Workshop",
    dates: "27–29 August 2026 · Hybrid Format",
    organizers: [
      "Department of Computer Science, UG",
      "Workshop Planning Committee",
    ],
    sponsors: [
      "University of Ghana",
      "DSC Workshop Committee",
      "Industry Partners (TBD)",
    ],
    publication: "CBAS Journal",
  },
  images: {
    workshop:   `${B}images/workshop-sessions.jpg`,
    research:   `${B}images/research-presentations.jpg`,
    networking: `${B}images/collaboration-networking.jpeg`,
    students:   `${B}images/dcs-research.jpg`,
  },
  stream: {
    live: false,
    note: "",
    day1Id: "",
    day2Id: "1KWiyZnJFmw",
    day3Id: "NUAZDcQ_lJs",
  },
  gallery: [
    { src: `${B}images/workshop-sessions.jpg`,         caption: "Workshop Sessions",          year: "2025" },
    { src: `${B}images/research-presentations.jpg`,    caption: "Research Presentations",     year: "2025" },
    { src: `${B}images/collaboration-networking.jpeg`, caption: "Networking & Collaboration", year: "2025" },
    { src: `${B}images/dcs-research.jpg`,              caption: "Students at Work",           year: "2025" },
    { src: `${B}images/workshop-sessions.jpg`,         caption: "Parallel Track Sessions",    year: "2025" },
    { src: `${B}images/collaboration-networking.jpeg`, caption: "Department of CS Group",     year: "2025" },
    { src: `${B}images/research-presentations.jpg`,    caption: "Panel Discussions",          year: "2025" },
    { src: `${B}images/dcs-research.jpg`,              caption: "Individual Research Work",   year: "2025" },
  ],
  recordings: [
    {
      day: "Day 1",
      label: "Opening Ceremony & Keynote Address",
      color: "#1B3A6B",
      youtubeId: "BWErDrKoRS4",
      start: 0,
      highlights: [
        "Welcome Address by HOD",
        "Keynote by Distinguished Speaker",
        "Morning Parallel Track Sessions",
      ],
    },
    {
      day: "Day 2",
      label: "Research Presentations & Panel Discussion",
      color: "#C9A84C",
      youtubeId: "1KWiyZnJFmw",
      start: 9624,
      highlights: [
        "Poster & Technical Paper Sessions",
        "Faculty Panel Discussion",
        "Short Paper Presentations",
      ],
    },
    {
      day: "Day 3",
      label: "Final Presentations & Awards Ceremony",
      color: "#7b1fa2",
      youtubeId: "NUAZDcQ_lJs",
      start: 6,
      highlights: [
        "Regular Paper Final Session",
        "Judges' Deliberation",
        "Awards Ceremony & Closing",
      ],
    },
  ],
  faqs: [], // empty = SupportPage uses built-in defaults
  home: {
    heroSubtitle: "Department of Computer Science · SPMS · University of Ghana",
    heroDesc:
      "MSc, MPhil & PhD students present cutting-edge thesis research. Outstanding papers are considered for the CBAS Journal.",
    importantDates: [
      {
        id: 1,
        label: "Registration Opens",
        date: "Now Open",
        icon: "✅",
        done: true,
      },
      {
        id: 2,
        label: "Abstract Submission Deadline",
        date: "31 Jul 2026",
        icon: "📄",
        done: false,
      },
      {
        id: 3,
        label: "Acceptance Notification",
        date: "8 Aug 2026",
        icon: "📬",
        done: false,
      },
      {
        id: 4,
        label: "Workshop Begins",
        date: "27 Aug 2026",
        icon: "🎓",
        done: false,
      },
    ],
    featuredSessions: [
      {
        id: 1,
        icon: "🎤",
        tag: "Keynote",
        session: "Opening Keynote",
        role: "TBA — Keynote Speaker",
        status: "Announcement Coming Soon",
        topic: "Technology, Research & the Future of Computing in Africa",
        accent: "#1B3A6B",
      },
      {
        id: 2,
        icon: "💡",
        tag: "Industry",
        session: "Industry Insights Session",
        role: "TBA — Invited Speaker",
        status: "Industry / Academic Partner",
        topic: "AI, Machine Learning & Applied Computer Science",
        accent: "#C9A84C",
      },
      {
        id: 3,
        icon: "📚",
        tag: "Panel",
        session: "Research Methods Panel",
        role: "TBA — Panel Chair",
        status: "University of Ghana, DCS Faculty",
        topic: "Publishing Research: From Submission to Acceptance",
        accent: "#0F2347",
      },
    ],
    testimonials: [
      {
        id: 1,
        quote:
          "Presenting my thesis research here was a turning point. The feedback from the judges helped me refine my work before my final defence.",
        name: "Ama Boateng",
        prog: "MPhil Computer Science",
      },
      {
        id: 2,
        quote:
          "The networking opportunities were incredible. I connected with PhD students and faculty whose work directly overlaps with my own research area.",
        name: "Kwame Asante",
        prog: "MSc Computer Science",
      },
      {
        id: 3,
        quote:
          "I wasn't sure if my work was ready to present, but the committee was very encouraging. The experience gave me real academic confidence.",
        name: "Efua Mensah",
        prog: "MSc Computer Science",
      },
    ],
  },
  sponsors: [
    {
      id: 1,
      name: "University of Ghana",
      role: "Host Institution",
      desc: "The University of Ghana, founded in 1948, is the premier research university in Ghana and one of the leading universities in Africa. The institution provides core funding and facilities for the workshop.",
      tier: "gold",
      logo: "🏛️",
    },
    {
      id: 2,
      name: "School of Physical & Mathematical Sciences",
      role: "Faculty Sponsor",
      desc: "SPMS provides direct academic and logistical support for the workshop through its faculty committee, enabling the Department of Computer Science to host this landmark postgraduate event.",
      tier: "gold",
      logo: "🔬",
    },
    {
      id: 3,
      name: "Department of Computer Science",
      role: "Organising Department",
      desc: "The Department of Computer Science at UG is the primary organiser of the workshop, coordinating all academic, logistical, and publication activities for the three-day event.",
      tier: "primary",
      logo: "💻",
    },
  ],
  payments: [
    {
      id: 1,
      transactionId: "UGPGW2026-PAY-1715234567890",
      studentId: "10827641",
      name: "Kwame Asante",
      email: "k.asante@ug.edu.gh",
      programme: "MSc Computer Science",
      amount: 100,
      method: "mobile_money",
      date: "2026-05-09T11:57:00",
      status: "Confirmed",
    },
    {
      id: 2,
      transactionId: "UGPGW2026-PAY-1715134567890",
      studentId: "10834512",
      name: "Abena Mensah",
      email: "a.mensah@ug.edu.gh",
      programme: "MPhil Data Science",
      amount: 100,
      method: "mobile_money",
      date: "2026-05-08T18:47:00",
      status: "Confirmed",
    },
    {
      id: 3,
      transactionId: "UGPGW2026-PAY-1715034567890",
      studentId: "10819073",
      name: "Kofi Boateng",
      email: "k.boateng@ug.edu.gh",
      programme: "PhD Computer Science",
      amount: 100,
      method: "card",
      date: "2026-05-08T16:16:00",
      status: "Pending",
    },
    {
      id: 4,
      transactionId: "UGPGW2026-PAY-1714934567890",
      studentId: "10845209",
      name: "Ama Owusu",
      email: "a.owusu@ug.edu.gh",
      programme: "MSc IT for Business",
      amount: 100,
      method: "mobile_money",
      date: "2026-05-08T15:28:00",
      status: "Confirmed",
    },
    {
      id: 5,
      transactionId: "UGPGW2026-PAY-1714834567890",
      studentId: "10823187",
      name: "Yaw Darko",
      email: "y.darko@ug.edu.gh",
      programme: "MPhil Computer Science",
      amount: 100,
      method: "card",
      date: "2026-05-07T10:30:00",
      status: "Confirmed",
    },
    {
      id: 6,
      transactionId: "UGPGW2026-PAY-1714734567890",
      studentId: "10856394",
      name: "Efua Amponsah",
      email: "e.amponsah@ug.edu.gh",
      programme: "MSc Data Science",
      amount: 100,
      method: "mobile_money",
      date: "2026-05-07T09:15:00",
      status: "Pending",
    },
  ],
};

function mergeRemote(
  base: SiteContent,
  remote: Partial<SiteContent>,
): SiteContent {
  // Exclude participants and payments: they are managed exclusively by their own
  // Firestore collection listeners (onSnapshot on "registrations" / "payments").
  // Spreading them from workshop/siteContent would overwrite real-time data with stale snapshots.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { participants: _p, payments: _pay, ...restRemote } = remote;
  return {
    ...base,
    ...restRemote,
    event: { ...INIT_CONTENT.event, ...(remote.event || {}) },
    about: remote.about || base.about,
    pastWinners: remote.pastWinners || base.pastWinners,
    contact: { ...INIT_CONTENT.contact, ...(remote.contact || {}) },
    home: { ...(base.home || INIT_CONTENT.home), ...(remote.home || {}) },
    sponsors: remote.sponsors || base.sponsors,
  };
}

function normalizeEmail(email = ""): string {
  return email.trim().toLowerCase();
}

function makeDocId(...parts: unknown[]): string {
  const id = parts
    .filter(Boolean)
    .map((part) => String(part).trim())
    .filter(Boolean)
    .join("_")
    .replace(/[^\w.-]/g, "_");
  return id || String(Date.now());
}

function participantKey(item: Partial<Participant> = {}): string {
  const email = normalizeEmail(item.email);
  const studentId = String(item.studentId || "")
    .trim()
    .toLowerCase();
  return email || studentId ?
      `${email}|${studentId}`
    : String(item.id || Date.now());
}

function paymentKey(item: Partial<PaymentRecord> = {}): string {
  return String(item.transactionId || item.id || Date.now());
}

function mergeRecords<T>(
  existing: T[] = [],
  incoming: T[] = [],
  getKey: (item: T) => string,
): T[] {
  const map = new Map();
  existing.forEach((item) => map.set(getKey(item), item));
  incoming.forEach((item) => {
    const key = getKey(item);
    map.set(key, { ...(map.get(key) || {}), ...item });
  });
  return Array.from(map.values());
}

export default function App() {
  const routerNavigate = useNavigate();
  const location = useLocation();
  const [, setRegistrant] = useState(null);
  const saveTimer = useRef(null);
  const [contentStatus, setContentStatus] = useState<ContentStatus>({
    loading: true,
    error: "",
  });

  // 1. Initialise from localStorage instantly (fast, works offline)
  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    try {
      const saved = localStorage.getItem("dcs-workshop-content");
      if (saved) {
        const parsed = JSON.parse(saved);
        return mergeRemote(INIT_CONTENT as SiteContent, parsed);
      }
    } catch {}
    return INIT_CONTENT as SiteContent;
  });

  // Track whether the current user is a signed-in admin.
  // Admin-only Firestore operations (writing siteContent, reading registrations/payments)
  // are gated behind this flag to avoid permission errors for public visitors.
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (!auth || !onAuthStateChanged) return;
    const unsub = onAuthStateChanged(auth, (user) => setIsAdmin(!!user));
    return () => unsub();
  }, []);

  // 2a. Always-on listener: public site content (event details, schedule, etc.)
  useEffect(() => {
    if (!db || !doc || !onSnapshot) {
      setContentStatus({ loading: false, error: "Firestore is not configured." });
      return;
    }
    let alive = true;
    const unsub = onSnapshot(
      doc(db, "workshop", "siteContent"),
      (snap) => {
        if (!alive) return;
        if (snap.exists()) {
          setSiteContent((c) => mergeRemote(c, snap.data()));
          setContentStatus({ loading: false, error: "" });
        } else {
          setContentStatus({ loading: false, error: "No site content found in Firestore yet." });
        }
      },
      (err) => {
        if (!alive) return;
        console.warn("Firestore read failed:", err.message);
        setContentStatus({ loading: false, error: err.message });
      },
    );
    return () => { alive = false; unsub(); };
  }, []);

  // 2b. Admin-only listeners: registrations + payments collections.
  // Only starts after sign-in; torn down on sign-out to avoid permission errors.
  useEffect(() => {
    if (!isAdmin || !db || !collection || !onSnapshot) return;
    let alive = true;

    const unsubReg = onSnapshot(
      collection(db, "registrations"),
      (snap) => {
        if (!alive) return;
        const participants = snap.docs.map((d) => ({
          _docId: d.id,
          id: d.data().id || d.id,
          ...d.data(),
        }));
        setSiteContent((c) => ({ ...c, participants: participants as Participant[] }) as SiteContent);
      },
      (err) => console.warn("Registrations listener:", err.message),
    );

    const unsubPay = onSnapshot(
      collection(db, "payments"),
      (snap) => {
        if (!alive) return;
        const payments = snap.docs.map((d) => ({ id: d.data().id || d.id, ...d.data() }));
        setSiteContent((c) => ({ ...c, payments: payments as PaymentRecord[] }) as SiteContent);
      },
      (err) => console.warn("Payments listener:", err.message),
    );

    return () => { alive = false; unsubReg(); unsubPay(); };
  }, [isAdmin]);

  // 3. On every content change: always save to localStorage; save to Firestore only when admin.
  useEffect(() => {
    const stripped = stripBase64(siteContent) as Record<string, unknown>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { participants: _p, payments: _pay, ...contentToSave } = stripped;

    try {
      localStorage.setItem("dcs-workshop-content", JSON.stringify(contentToSave));
    } catch (e) {
      console.warn("localStorage quota exceeded:", e.message);
    }

    // Only admins can write to workshop/siteContent — skip for public visitors
    if (!isAdmin || !db || !doc || !setDoc) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setDoc(doc(db, "workshop", "siteContent"), contentToSave).catch((e) =>
        console.warn("Firestore save failed:", e.message),
      );
    }, 800);
  }, [siteContent, isAdmin]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navigate = (routeKeyOrPath: string): void => {
    routerNavigate(getRoutePath(routeKeyOrPath));
  };

  const updateContent = (
    section: string | Record<string, unknown>,
    value?: unknown,
  ) => {
    // Participants are owned by the "registrations" collection.
    // When the admin updates a participant (e.g. confirms payment), write the
    // changed record directly to Firestore so onSnapshot propagates it in real-time.
    if (
      section === "participants" &&
      Array.isArray(value) &&
      db &&
      doc &&
      setDoc
    ) {
      const updated = value as Participant[];
      const prev = siteContent.participants || [];
      updated.forEach((p) => {
        const old = prev.find((pp) => pp.id === p.id);
        if (!old || JSON.stringify(old) !== JSON.stringify(p)) {
          const docId =
            p._docId ||
            makeDocId(String(p.studentId || ""), normalizeEmail(p.email));
          setDoc(
            doc(db, "registrations", docId),
            { ...p, updatedAt: new Date().toISOString() },
            { merge: true },
          ).catch((e) => console.warn("Participant update failed:", e.message));
        }
      });
    }
    setSiteContent((c) =>
      section && typeof section === "object" ?
        ({ ...c, ...(section as Partial<SiteContent>) } as SiteContent)
      : ({ ...c, [section as string]: value } as SiteContent),
    );
  };

  const saveRegistration = async (
    registration: Partial<Participant>,
    options: SaveOptions = {},
  ): Promise<Participant> => {
    const now = new Date().toISOString();
    const email = normalizeEmail(registration.email);
    const studentId = String(registration.studentId || "").trim();
    const fullName = (registration.fullName || registration.name || "").trim();
    const paymentStatus =
      options.paymentStatus || registration.payment || "Pending";
    const participantId = registration.id || makeDocId(studentId, email, now);
    const participantRecord = {
      id: participantId,
      name: fullName || email,
      fullName: fullName || email,
      email,
      phone: registration.phone || "",
      studentId,
      department: registration.department || "",
      programme: registration.programme || "",
      level: registration.level || "",
      type: registration.participationType || registration.type || "Presenter",
      participationType:
        registration.participationType || registration.type || "Presenter",
      payment: paymentStatus,
      mode: registration.attendanceMode || registration.mode || "Physical",
      attendanceMode:
        registration.attendanceMode || registration.mode || "Physical",
      presentationType: registration.presentationType || "",
      nationality:
        ((registration as Record<string, unknown>).nationality as string) || "",
      presentationTitle:
        ((registration as Record<string, unknown>)
          .presentationTitle as string) || "",
      abstract:
        ((registration as Record<string, unknown>).abstract as string) || "",
      sessionPreference:
        ((registration as Record<string, unknown>).sessionPreference as string) || "",
      registeredAt: registration.registeredAt || now,
      updatedAt: now,
      paymentMethod: options.method || "offline",
    };

    if (options.paymentReference)
      (participantRecord as Participant).payRef = options.paymentReference;

    const paymentRecord =
      options.paymentReference ?
        {
          id: makeDocId(options.paymentReference),
          transactionId: options.paymentReference,
          studentId,
          name: participantRecord.name,
          email,
          programme: participantRecord.programme,
          amount: Number(options.amount || siteContent.event?.fee || 100),
          method: options.method || "paystack",
          date: now,
          status: paymentStatus === "Confirmed" ? "Confirmed" : "Pending",
        }
      : null;

    setRegistrant({
      ...participantRecord,
      payRef: options.paymentReference || "",
    });
    setSiteContent((c) => {
      const participants = c.participants || [];
      const existing = participants.find(
        (p) => participantKey(p) === participantKey(participantRecord),
      );
      const nextPaymentStatus =
        paymentStatus === "Confirmed" || existing?.payment !== "Confirmed" ?
          paymentStatus
        : existing.payment;
      const nextParticipant = {
        ...(existing || {}),
        ...participantRecord,
        id: existing?.id || participantRecord.id,
        payment: nextPaymentStatus,
        registeredAt: existing?.registeredAt || participantRecord.registeredAt,
      };
      const nextParticipants =
        existing ?
          participants.map((p) =>
            participantKey(p) === participantKey(participantRecord) ?
              nextParticipant
            : p,
          )
        : [nextParticipant, ...participants];
      const nextPayments =
        paymentRecord ?
          mergeRecords(c.payments || [], [paymentRecord], paymentKey)
        : c.payments || [];

      return {
        ...c,
        participants: nextParticipants as Participant[],
        payments: nextPayments as PaymentRecord[],
      } as SiteContent;
    });

    if (db && doc && setDoc) {
      const registrationDocId = makeDocId(studentId, email);
      // Exclude Cloud-Function-only fields so the Firestore update rule doesn't reject them
      const { emailSent: _es, emailDeliveryStatus: _eds, emailSentAt: _esa, emailError: _ee, ...safeRecord } =
        participantRecord as Record<string, unknown>;
      try {
        await setDoc(doc(db, "registrations", registrationDocId), safeRecord, { merge: true });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error("Registration save failed:", msg);
        throw new Error(msg);
      }
      // Payment records require admin auth to write — the Cloud Function writes
      // payment metadata via Admin SDK instead. Skip the frontend write entirely.
    }

    return participantRecord;
  };

  const renderPage = (route: AppRoute) => {
    const Page = route.component;
    return (
      <Page
        {...getRouteProps(route.key, {
          siteContent: siteContent as unknown as Record<string, unknown>,
          navigate,
          setRegistrant,
          saveRegistration,
          updateContent,
        })}
      />
    );
  };

  return (
    <Routes>
      <Route
        element={
          <MainLayout
            footer={siteContent.footer}
            contentStatus={contentStatus}
          />
        }
      >
        {mainRoutes.map((route) => (
          <Route
            key={route.key}
            index={route.index}
            path={getChildRoutePath(route)}
            element={renderPage(route)}
          />
        ))}
      </Route>

      <Route element={<AdminLayout />}>
        <Route path="admin/*" element={renderPage(adminRoutes[0])}>
          <Route index element={<Navigate to="overview" replace />} />
          {adminChildRoutes.map((child) => {
            const Component = child.component;
            return (
              <Route
                key={child.key}
                path={child.path}
                element={<Component />}
              />
            );
          })}
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={routeMap.home.path} replace />} />
    </Routes>
  );
}
