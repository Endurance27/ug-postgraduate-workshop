import { useState, useEffect, useRef } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { auth, db, doc, getDoc, setDoc, collection, getDocs, onAuthStateChanged } from "./firebase.js";
import AdminLayout from "./layouts/AdminLayout.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import {
  adminRoutes,
  getChildRoutePath,
  getRoutePath,
  getRouteProps,
  mainRoutes,
  routeMap,
} from "./routes.js";
import "./index.css";

function stripBase64(obj) {
  if (typeof obj === "string") return obj.startsWith("data:") ? "" : obj;
  if (Array.isArray(obj)) return obj.map(stripBase64);
  if (obj && typeof obj === "object")
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, stripBase64(v)]));
  return obj;
}

const INIT_SCHEDULE = [
  {
    day: "Day 1", date: "Thursday, 27 August 2026",
    sessions: [
      { id: 101, time: "8:00 AM",  title: "Registration & Check-in",                    type: "plenary",  track: "",                    presenter: "" },
      { id: 102, time: "9:00 AM",  title: "Opening Ceremony & Welcome Address",          type: "plenary",  track: "",                    presenter: "HOD, Dept. of Computer Science" },
      { id: 103, time: "9:45 AM",  title: "Keynote Address",                             type: "plenary",  track: "",                    presenter: "Distinguished Invited Speaker" },
      { id: 104, time: "11:00 AM", title: "Coffee Break & Networking",                   type: "break",    track: "",                    presenter: "" },
      { id: 105, time: "11:30 AM", title: "Parallel Track Sessions — Morning Block",     type: "parallel", track: "",                    presenter: "" },
      { id: 106, time: "1:00 PM",  title: "Lunch Break",                                 type: "break",    track: "",                    presenter: "" },
      { id: 107, time: "2:00 PM",  title: "Parallel Track Sessions — Afternoon Block",   type: "parallel", track: "",                    presenter: "" },
      { id: 108, time: "4:00 PM",  title: "Day 1 Wrap-up & Announcements",               type: "plenary",  track: "",                    presenter: "" },
    ]
  },
  {
    day: "Day 2", date: "Friday, 28 August 2026",
    sessions: [
      { id: 201, time: "8:30 AM",  title: "Morning Briefing",                            type: "plenary",  track: "",                    presenter: "" },
      { id: 202, time: "9:00 AM",  title: "Poster Presentation Session",                 type: "track",    track: "Poster Track",         presenter: "" },
      { id: 203, time: "10:30 AM", title: "Technical Paper Session",                     type: "track",    track: "Technical Track",      presenter: "" },
      { id: 204, time: "11:00 AM", title: "Coffee Break",                                type: "break",    track: "",                    presenter: "" },
      { id: 205, time: "11:30 AM", title: "Panel Discussion: Research & Industry",       type: "plenary",  track: "",                    presenter: "Faculty Panel" },
      { id: 206, time: "1:00 PM",  title: "Lunch Break",                                 type: "break",    track: "",                    presenter: "" },
      { id: 207, time: "2:00 PM",  title: "Short Paper Session — CS & Data Science",    type: "parallel", track: "",                    presenter: "" },
      { id: 208, time: "4:00 PM",  title: "IT for Business Observation Sessions",        type: "track",    track: "IT for Business Track", presenter: "" },
    ]
  },
  {
    day: "Day 3", date: "Saturday, 29 August 2026",
    sessions: [
      { id: 301, time: "8:30 AM",  title: "Morning Briefing & Final Day Orientation",    type: "plenary",  track: "",                    presenter: "" },
      { id: 302, time: "9:00 AM",  title: "Regular Paper Session — Final Presentations", type: "track",    track: "CS Track",            presenter: "" },
      { id: 303, time: "10:30 AM", title: "Coffee Break",                                type: "break",    track: "",                    presenter: "" },
      { id: 304, time: "11:00 AM", title: "Judges' Deliberation (Closed)",               type: "plenary",  track: "",                    presenter: "Review Panel" },
      { id: 305, time: "12:00 PM", title: "Lunch Break",                                 type: "break",    track: "",                    presenter: "" },
      { id: 306, time: "1:30 PM",  title: "Awards Ceremony & Announcement",              type: "plenary",  track: "",                    presenter: "Workshop Committee" },
      { id: 307, time: "3:00 PM",  title: "Closing Ceremony & Group Photo",              type: "plenary",  track: "",                    presenter: "" },
    ]
  }
];

const INIT_PARTICIPANTS = [
  { id: 1, name: "Kwame Asante",   email: "k.asante@ug.edu.gh",   programme: "MSc Computer Science",   type: "Presenter", payment: "Confirmed", mode: "Physical" },
  { id: 2, name: "Abena Mensah",   email: "a.mensah@ug.edu.gh",   programme: "MPhil Data Science",     type: "Presenter", payment: "Confirmed", mode: "Virtual"  },
  { id: 3, name: "Kofi Boateng",   email: "k.boateng@ug.edu.gh",  programme: "PhD Computer Science",   type: "Presenter", payment: "Pending",   mode: "Physical" },
  { id: 4, name: "Ama Owusu",      email: "a.owusu@ug.edu.gh",    programme: "MSc IT for Business",    type: "Observer",  payment: "Confirmed", mode: "Virtual"  },
  { id: 5, name: "Yaw Darko",      email: "y.darko@ug.edu.gh",    programme: "MPhil Computer Science", type: "Presenter", payment: "Confirmed", mode: "Physical" },
  { id: 6, name: "Efua Amponsah",  email: "e.amponsah@ug.edu.gh", programme: "MSc Data Science",       type: "Presenter", payment: "Pending",   mode: "Hybrid"   },
];

const INIT_SUBMISSIONS = [
  { id: 1, title: "Deep Learning for Malaria Detection in Ghana",      author: "Kwame Asante",  category: "Regular Paper",   status: "Under Review" },
  { id: 2, title: "Predictive Analytics for Agricultural Yields",      author: "Abena Mensah",  category: "Technical Paper", status: "Accepted"     },
  { id: 3, title: "Blockchain for Land Registry in West Africa",        author: "Yaw Darko",     category: "Short Paper",     status: "Under Review" },
];

const INIT_CONTENT = {
  event: {
    title: "DCS Postgraduate Research Workshop 2026",
    edition: "2nd Annual Edition",
    dates: "27–29 August 2026",
    venue: "University of Ghana, Legon",
    fee: 100,
    paystackKey: "",
    registrationOpen: true,
    submissionsOpen: true,
    description: "A flagship academic event by the Department of Computer Science, University of Ghana — now in its second edition.",
  },
  about: {
    badge: "2nd Annual Edition",
    title: "A Platform for Academic Excellence in Postgraduate Research",
    desc1: "The 2nd Annual DCS Postgraduate Students Workshop builds on the success of the maiden edition held in 2025, bringing together MSc and MPhil students from Computer Science, Data Science, and IT for Business programmes.",
    desc2: "The workshop provides a structured platform for students to present original research, receive expert feedback, and engage with peers and academic staff in a rigorous yet supportive environment.",
    imageCaption1: "Advancing Research at UG",
    imageCaption2: "Dept. of Computer Science · SPMS",
    cardText: "Following the success of the 2025 inaugural edition, the 2026 workshop expands to include broader participation across all DCS postgraduate programmes, richer parallel tracks, and a formal awards ceremony.",
  },
  pastWinners: [
    { id: 1, pos: "🥇", place: "1st Place Award", desc: "Best Presenter",          edition: "Maiden Workshop 2025", field: "Computer Science", name: "", avatar: "" },
    { id: 2, pos: "🥈", place: "2nd Place Award", desc: "Outstanding Presentation", edition: "Maiden Workshop 2025", field: "Data Science",    name: "", avatar: "" },
    { id: 3, pos: "🥉", place: "3rd Place Award", desc: "Commended Presenter",      edition: "Maiden Workshop 2025", field: "Computer Science", name: "", avatar: "" },
  ],
  announcements: [],
  schedule: INIT_SCHEDULE,
  awards: [
    { id: 1, emoji: "🥇", label: "First Place",  winner: "", paper: "", announced: false },
    { id: 2, emoji: "🥈", label: "Second Place", winner: "", paper: "", announced: false },
    { id: 3, emoji: "🥉", label: "Third Place",  winner: "", paper: "", announced: false },
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
      topic: "AI and the Future of African Research: Opportunities, Challenges and Responsibilities",
      bio: "Professor Sarfo-Mensah is a distinguished faculty member at the Department of Computer Science, University of Ghana, with over 20 years of experience in artificial intelligence, machine learning, and their applications to African development challenges. He leads the AI for Africa research group and has published extensively in top-tier international journals and conferences.",
      photo: "/images/dcs-research.jpg",
      tags: "Artificial Intelligence, Machine Learning, Africa Tech",
    },
    panelists: [
      { id: 1, name: "Dr. Abena Osei-Bonsu",     title: "Senior Lecturer, Data Science",   institution: "Dept. of Computer Science, UG", role: "Panel Moderator", bio: "Specialises in data science applications for healthcare and agriculture in West Africa.",                              photo: "/images/research-presentations.jpg" },
      { id: 2, name: "Dr. Kwaku Darko-Mensah",   title: "Lecturer, Computer Networks",     institution: "Dept. of Computer Science, UG", role: "Panelist",        bio: "Research interests include network security, IoT systems, and rural connectivity solutions.",                         photo: "/images/workshop-sessions.jpg" },
      { id: 3, name: "Dr. Efua Asante",           title: "Lecturer, Software Engineering",  institution: "Dept. of Computer Science, UG", role: "Panelist",        bio: "Works on human-computer interaction, accessibility, and software development methodologies.",                         photo: "/images/collaboration-networking.jpeg" },
      { id: 4, name: "Dr. Kofi Oppong-Nkrumah",  title: "Lecturer, Cybersecurity",         institution: "Dept. of Computer Science, UG", role: "Panelist",        bio: "Expert in cybersecurity, digital forensics, and information assurance for African institutions.",                     photo: "/images/dcs-research.jpg" },
    ],
    committee: [
      { id: 1, name: "Prof. J.B. Hayfron-Acquah", role: "Head of Department",       institution: "Dept. of Computer Science, UG" },
      { id: 2, name: "Dr. Amos Nunoo",            role: "Workshop Chair",            institution: "Dept. of Computer Science, UG" },
      { id: 3, name: "Dr. Yaw Marfo-Owusu",       role: "Programme Committee Chair", institution: "Dept. of Computer Science, UG" },
      { id: 4, name: "Dr. Gifty Tetteh",          role: "Registration Coordinator",  institution: "Dept. of Computer Science, UG" },
      { id: 5, name: "Dr. Seth Larbi",            role: "Technical Committee Lead",  institution: "Dept. of Computer Science, UG" },
      { id: 6, name: "Dr. Emelia Amoako",         role: "Awards Committee Chair",    institution: "Dept. of Computer Science, UG" },
    ],
  },
  contact: {
    email:    "dcsworkshop@ug.edu.gh",
    website:  "www.cs.ug.edu.gh",
    location: "Department of Computer Science, University of Ghana, Legon, P.O. Box LG 25, Accra, Ghana",
    hours:    "Mon–Fri · 8:00 AM – 5:00 PM GMT",
    whatsapp: "233536909471",
    phone:    "+233 (0) 536 909 471",
  },
  footer: {
    tagline:     "2nd Annual Postgraduate Students Workshop",
    dates:       "27–29 August 2026 · Hybrid Format",
    organizers:  ["Department of Computer Science, UG", "Workshop Planning Committee"],
    sponsors:    ["University of Ghana", "DSC Workshop Committee", "Industry Partners (TBD)"],
    publication: "CBAS Journal",
  },
  images: {
    workshop:   "/images/workshop-sessions.jpg",
    research:   "/images/research-presentations.jpg",
    networking: "/images/collaboration-networking.jpeg",
    students:   "/images/dcs-research.jpg",
  },
  stream: {
    live:   false,
    note:   "",
    day1Id: "",
    day2Id: "1KWiyZnJFmw",
    day3Id: "NUAZDcQ_lJs",
  },
  gallery: [
    { src: "/images/workshop-sessions.jpg",         caption: "Workshop Sessions",          year: "2025" },
    { src: "/images/research-presentations.jpg",    caption: "Research Presentations",     year: "2025" },
    { src: "/images/collaboration-networking.jpeg", caption: "Networking & Collaboration", year: "2025" },
    { src: "/images/dcs-research.jpg",              caption: "Students at Work",           year: "2025" },
    { src: "/images/workshop-sessions.jpg",         caption: "Parallel Track Sessions",    year: "2025" },
    { src: "/images/collaboration-networking.jpeg", caption: "Department of CS Group",     year: "2025" },
    { src: "/images/research-presentations.jpg",    caption: "Panel Discussions",          year: "2025" },
    { src: "/images/dcs-research.jpg",              caption: "Individual Research Work",   year: "2025" },
  ],
  recordings: [
    { day: "Day 1", label: "Opening Ceremony & Keynote Address",        color: "#1B3A6B", youtubeId: "BWErDrKoRS4",   start: 0,    highlights: ["Welcome Address by HOD", "Keynote by Distinguished Speaker", "Morning Parallel Track Sessions"] },
    { day: "Day 2", label: "Research Presentations & Panel Discussion", color: "#C9A84C", youtubeId: "1KWiyZnJFmw", start: 9624, highlights: ["Poster & Technical Paper Sessions", "Faculty Panel Discussion", "Short Paper Presentations"] },
    { day: "Day 3", label: "Final Presentations & Awards Ceremony",     color: "#7b1fa2", youtubeId: "NUAZDcQ_lJs", start: 6,    highlights: ["Regular Paper Final Session", "Judges' Deliberation", "Awards Ceremony & Closing"] },
  ],
  home: {
    heroSubtitle: "Department of Computer Science · SPMS · University of Ghana",
    heroDesc:     "MSc, MPhil & PhD students present cutting-edge thesis research. Outstanding papers are considered for the CBAS Journal.",
    importantDates: [
      { id: 1, label: "Registration Opens",           date: "Now Open",    icon: "✅", done: true  },
      { id: 2, label: "Abstract Submission Deadline", date: "31 Jul 2026", icon: "📄", done: false },
      { id: 3, label: "Acceptance Notification",      date: "8 Aug 2026",  icon: "📬", done: false },
      { id: 4, label: "Workshop Begins",              date: "27 Aug 2026", icon: "🎓", done: false },
    ],
    featuredSessions: [
      { id: 1, icon: "🎤", tag: "Keynote",  session: "Opening Keynote",           role: "TBA — Keynote Speaker", status: "Announcement Coming Soon",        topic: "Technology, Research & the Future of Computing in Africa", accent: "#1B3A6B" },
      { id: 2, icon: "💡", tag: "Industry", session: "Industry Insights Session",  role: "TBA — Invited Speaker", status: "Industry / Academic Partner",      topic: "AI, Machine Learning & Applied Computer Science",          accent: "#C9A84C" },
      { id: 3, icon: "📚", tag: "Panel",    session: "Research Methods Panel",     role: "TBA — Panel Chair",     status: "University of Ghana, DCS Faculty", topic: "Publishing Research: From Submission to Acceptance",        accent: "#0F2347" },
    ],
    testimonials: [
      { id: 1, quote: "Presenting my thesis research here was a turning point. The feedback from the judges helped me refine my work before my final defence.", name: "Ama Boateng",  prog: "MPhil Computer Science" },
      { id: 2, quote: "The networking opportunities were incredible. I connected with PhD students and faculty whose work directly overlaps with my own research area.", name: "Kwame Asante", prog: "MSc Computer Science" },
      { id: 3, quote: "I wasn't sure if my work was ready to present, but the committee was very encouraging. The experience gave me real academic confidence.", name: "Efua Mensah",  prog: "MSc Computer Science" },
    ],
  },
  sponsors: [
    { id: 1, name: "University of Ghana",                        role: "Host Institution",      desc: "The University of Ghana, founded in 1948, is the premier research university in Ghana and one of the leading universities in Africa. The institution provides core funding and facilities for the workshop.", tier: "gold",    logo: "🏛️" },
    { id: 2, name: "School of Physical & Mathematical Sciences", role: "Faculty Sponsor",        desc: "SPMS provides direct academic and logistical support for the workshop through its faculty committee, enabling the Department of Computer Science to host this landmark postgraduate event.",               tier: "gold",    logo: "🔬" },
    { id: 3, name: "Department of Computer Science",             role: "Organising Department",  desc: "The Department of Computer Science at UG is the primary organiser of the workshop, coordinating all academic, logistical, and publication activities for the three-day event.",                          tier: "primary", logo: "💻" },
  ],
  payments: [
    { id: 1, transactionId: "UGPGW2026-PAY-1715234567890", studentId: "10827641", name: "Kwame Asante",   email: "k.asante@ug.edu.gh",   programme: "MSc Computer Science",   amount: 100, method: "mobile_money", date: "2026-05-09T11:57:00", status: "Confirmed" },
    { id: 2, transactionId: "UGPGW2026-PAY-1715134567890", studentId: "10834512", name: "Abena Mensah",   email: "a.mensah@ug.edu.gh",   programme: "MPhil Data Science",     amount: 100, method: "mobile_money", date: "2026-05-08T18:47:00", status: "Confirmed" },
    { id: 3, transactionId: "UGPGW2026-PAY-1715034567890", studentId: "10819073", name: "Kofi Boateng",   email: "k.boateng@ug.edu.gh",  programme: "PhD Computer Science",   amount: 100, method: "card",         date: "2026-05-08T16:16:00", status: "Pending"   },
    { id: 4, transactionId: "UGPGW2026-PAY-1714934567890", studentId: "10845209", name: "Ama Owusu",      email: "a.owusu@ug.edu.gh",    programme: "MSc IT for Business",    amount: 100, method: "mobile_money", date: "2026-05-08T15:28:00", status: "Confirmed" },
    { id: 5, transactionId: "UGPGW2026-PAY-1714834567890", studentId: "10823187", name: "Yaw Darko",      email: "y.darko@ug.edu.gh",    programme: "MPhil Computer Science", amount: 100, method: "card",         date: "2026-05-07T10:30:00", status: "Confirmed" },
    { id: 6, transactionId: "UGPGW2026-PAY-1714734567890", studentId: "10856394", name: "Efua Amponsah",  email: "e.amponsah@ug.edu.gh", programme: "MSc Data Science",       amount: 100, method: "mobile_money", date: "2026-05-07T09:15:00", status: "Pending"   },
  ],
};

function mergeRemote(base, remote) {
  return {
    ...base,
    ...remote,
    event:       { ...INIT_CONTENT.event,    ...(remote.event    || {}) },
    about:       remote.about       || base.about,
    pastWinners: remote.pastWinners || base.pastWinners,
    contact:     { ...INIT_CONTENT.contact,  ...(remote.contact  || {}) },
    home:        { ...(base.home || INIT_CONTENT.home), ...(remote.home || {}) },
    sponsors:    remote.sponsors    || base.sponsors,
  };
}

function normalizeEmail(email = "") {
  return email.trim().toLowerCase();
}

function makeDocId(...parts) {
  const id = parts
    .filter(Boolean)
    .map(part => String(part).trim())
    .filter(Boolean)
    .join("_")
    .replace(/[^\w.-]/g, "_");
  return id || String(Date.now());
}

function participantKey(item = {}) {
  const email = normalizeEmail(item.email);
  const studentId = String(item.studentId || "").trim().toLowerCase();
  return email || studentId ? `${email}|${studentId}` : String(item.id || Date.now());
}

function paymentKey(item = {}) {
  return String(item.transactionId || item.id || Date.now());
}

function mergeRecords(existing = [], incoming = [], getKey) {
  const map = new Map();
  existing.forEach(item => map.set(getKey(item), item));
  incoming.forEach(item => {
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

  // 1. Initialise from localStorage instantly (fast, works offline)
  const [siteContent, setSiteContent] = useState(() => {
    try {
      const saved = localStorage.getItem("dcs-workshop-content");
      if (saved) {
        const parsed = JSON.parse(saved);
        return mergeRemote(INIT_CONTENT, parsed);
      }
    } catch {}
    return INIT_CONTENT;
  });

  // 2. On mount: pull the latest from Firestore (overrides localStorage if newer)
  useEffect(() => {
    if (!db || !doc || !getDoc) return;
    let alive = true;

    const loadFirebaseRecords = () => {
      if (!collection || !getDocs) return;
      Promise.all([
        getDocs(collection(db, "registrations")),
        getDocs(collection(db, "payments")),
      ])
        .then(([registrationSnap, paymentSnap]) => {
          if (!alive) return;
          const firebaseParticipants = registrationSnap.docs.map(snap => ({
            id: snap.data().id || snap.id,
            ...snap.data(),
          }));
          const firebasePayments = paymentSnap.docs.map(snap => ({
            id: snap.data().id || snap.id,
            ...snap.data(),
          }));
          setSiteContent(c => ({
            ...c,
            participants: mergeRecords(c.participants || [], firebaseParticipants, participantKey),
            payments: mergeRecords(c.payments || [], firebasePayments, paymentKey),
          }));
        })
        .catch(() => {});
    };

    getDoc(doc(db, "workshop", "siteContent"))
      .then(snap => {
        if (alive && snap.exists()) setSiteContent(c => mergeRemote(c, snap.data()));
      })
      .catch(() => {}); // rules not set yet or offline — silently keep localStorage data

    loadFirebaseRecords();
    const unsubAuth = auth && onAuthStateChanged
      ? onAuthStateChanged(auth, user => { if (user) loadFirebaseRecords(); })
      : null;

    return () => {
      alive = false;
      if (unsubAuth) unsubAuth();
    };
  }, []);

  // 3. On every change: save to localStorage immediately + Firestore (debounced 800 ms)
  useEffect(() => {
    const stripped = stripBase64(siteContent);

    try {
      localStorage.setItem("dcs-workshop-content", JSON.stringify(stripped));
    } catch (e) {
      console.warn("localStorage quota exceeded:", e.message);
    }

    if (!db || !doc || !setDoc) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setDoc(doc(db, "workshop", "siteContent"), stripped)
        .catch(e => console.warn("Firestore save failed — add security rules:", e.message));
    }, 800);
  }, [siteContent]);


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navigate = (routeKeyOrPath) => {
    routerNavigate(getRoutePath(routeKeyOrPath));
  };

  const updateContent = (section, value) =>
    setSiteContent(c => (
      section && typeof section === "object"
        ? { ...c, ...section }
        : { ...c, [section]: value }
    ));

  const saveRegistration = (registration, options = {}) => {
    const now = new Date().toISOString();
    const email = normalizeEmail(registration.email);
    const studentId = String(registration.studentId || "").trim();
    const fullName = (registration.fullName || registration.name || "").trim();
    const paymentStatus = options.paymentStatus || registration.payment || "Pending";
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
      participationType: registration.participationType || registration.type || "Presenter",
      payment: paymentStatus,
      mode: registration.attendanceMode || registration.mode || "Physical",
      attendanceMode: registration.attendanceMode || registration.mode || "Physical",
      presentationType: registration.presentationType || "",
      registeredAt: registration.registeredAt || now,
      updatedAt: now,
    };

    if (options.paymentReference) participantRecord.payRef = options.paymentReference;

    const paymentRecord = options.paymentReference ? {
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
    } : null;

    setRegistrant({ ...participantRecord, payRef: options.paymentReference || "" });
    setSiteContent(c => {
      const participants = c.participants || [];
      const existing = participants.find(p => participantKey(p) === participantKey(participantRecord));
      const nextPaymentStatus = paymentStatus === "Confirmed" || existing?.payment !== "Confirmed"
        ? paymentStatus
        : existing.payment;
      const nextParticipant = {
        ...(existing || {}),
        ...participantRecord,
        id: existing?.id || participantRecord.id,
        payment: nextPaymentStatus,
        registeredAt: existing?.registeredAt || participantRecord.registeredAt,
      };
      const nextParticipants = existing
        ? participants.map(p => participantKey(p) === participantKey(participantRecord) ? nextParticipant : p)
        : [nextParticipant, ...participants];
      const nextPayments = paymentRecord
        ? mergeRecords(c.payments || [], [paymentRecord], paymentKey)
        : c.payments || [];

      return { ...c, participants: nextParticipants, payments: nextPayments };
    });

    if (db && doc && setDoc) {
      const registrationDocId = makeDocId(studentId, email);
      setDoc(doc(db, "registrations", registrationDocId), participantRecord, { merge: true })
        .catch(e => console.warn("Registration save failed:", e.message));
      if (paymentRecord) {
        setDoc(doc(db, "payments", makeDocId(paymentRecord.transactionId)), paymentRecord, { merge: true })
          .catch(e => console.warn("Payment save failed:", e.message));
      }
    }

    return participantRecord;
  };


  const renderPage = (route) => {
    const Page = route.component;
    return (
      <Page
        {...getRouteProps(route.key, {
          siteContent,
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
        {adminRoutes.map((route) => (
          <Route
            key={route.key}
            path={getChildRoutePath(route)}
            element={renderPage(route)}
          />
        ))}
      </Route>

      <Route path="*" element={<Navigate to={routeMap.home.path} replace />} />
    </Routes>
  );
}
