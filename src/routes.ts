import { ComponentType } from "react";
import AboutPage from "./pages/AboutPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import AwardsPage from "./pages/AwardsPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import GalleryPage from "./pages/GalleryPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LiveStreamPage from "./pages/LiveStreamPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import RecordingsPage from "./pages/RecordingsPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import SchedulePage from "./pages/SchedulePage.jsx";
import SpeakersPage from "./pages/SpeakersPage.jsx";
import SponsorsPage from "./pages/SponsorsPage.jsx";
import SupportPage from "./pages/SupportPage.jsx";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Route {
  key: string;
  path: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
  index?: boolean;
  showInNav?: boolean;
  gold?: boolean;
  layout?: "admin" | "main";
}

export interface RouteContext {
  siteContent: Record<string, unknown>;
  navigate: (page: string) => void;
  setRegistrant: (r: unknown) => void;
  saveRegistration: (data: unknown) => void;
  updateContent: (key: string, value: unknown) => void;
}

// ─── Routes ───────────────────────────────────────────────────────────────────
export const routes: Route[] = [
  { key: "home", path: "/", index: true, label: "Home", component: HomePage, showInNav: true },
  { key: "about", path: "/about", label: "About", component: AboutPage, showInNav: true },
  {
    key: "schedule",
    path: "/schedule",
    label: "Schedule",
    component: SchedulePage,
    showInNav: true,
  },
  {
    key: "stream",
    path: "/livestream",
    label: "Livestream",
    component: LiveStreamPage,
    showInNav: true,
  },
  { key: "recordings", path: "/recordings", label: "Recordings", component: RecordingsPage },
  { key: "awards", path: "/awards", label: "Awards", component: AwardsPage },
  { key: "speakers", path: "/speakers", label: "Speakers", component: SpeakersPage },
  { key: "support", path: "/support", label: "Support", component: SupportPage },
  { key: "gallery", path: "/gallery", label: "Gallery", component: GalleryPage },
  {
    key: "sponsors",
    path: "/sponsors",
    label: "Sponsors",
    component: SponsorsPage,
    showInNav: true,
  },
  { key: "contact", path: "/contact", label: "Contact", component: ContactPage, showInNav: true },
  { key: "payment", path: "/payment", label: "Pay Fee", component: PaymentPage },
  {
    key: "register",
    path: "/register",
    label: "Register Now",
    component: RegisterPage,
    showInNav: true,
    gold: true,
  },
  { key: "admin", path: "/admin", label: "Admin", component: AdminPage, layout: "admin" },
];

export const navRoutes = routes.filter((route) => route.showInNav);

export const mainRoutes = routes.filter((route) => route.layout !== "admin");

export const adminRoutes = routes.filter((route) => route.layout === "admin");

export const routeMap = Object.fromEntries(
  routes.map((route) => [route.key, route]),
);

export function getRoutePath(routeKeyOrPath: string): string {
  if (!routeKeyOrPath) return routeMap.home.path;
  const target = String(routeKeyOrPath);
  if (target.startsWith("/")) return target;
  return routeMap[target]?.path || routeMap.home.path;
}

export function getChildRoutePath(route: Route): string | undefined {
  if (route.index) return undefined;
  return route.path.replace(/^\//, "");
}

export function getRouteByPathname(pathname: string): Route {
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  return routes.find((route) => route.path === normalizedPath) || routeMap.home;
}

export function getRouteProps(routeKey: string, context: RouteContext): Record<string, unknown> {
  const {
    siteContent,
    navigate,
    setRegistrant,
    saveRegistration,
    updateContent,
  } = context;

  const routeProps = {
    home: {
      navigate,
      event: siteContent.event,
      announcements: siteContent.announcements,
      feed: siteContent.feed,
      images: siteContent.images,
      home: siteContent.home,
    },
    about: {
      navigate,
      images: siteContent.images,
      about: siteContent.about,
      event: siteContent.event,
    },
    register: {
      navigate,
      setRegistrant,
      event: siteContent.event,
      onRegister: saveRegistration,
    },
    schedule: {
      schedule: siteContent.schedule,
      images: siteContent.images,
    },
    stream: {
      event: siteContent.event,
      navigate,
      stream: siteContent.stream,
    },
    recordings: {
      recordings: siteContent.recordings,
    },
    awards: {
      awards: siteContent.awards,
      pastWinners: siteContent.pastWinners,
      event: siteContent.event,
    },
    speakers: {
      speakers: siteContent.speakers,
      images: siteContent.images,
    },
    support: {
      contact: siteContent.contact,
      faqs: siteContent.faqs,
    },
    gallery: {
      gallery: siteContent.gallery,
    },
    sponsors: {
      navigate,
      images: siteContent.images,
      contact: siteContent.contact,
      footer: siteContent.footer,
      sponsors: siteContent.sponsors,
    },
    contact: {
      contact: siteContent.contact,
      images: siteContent.images,
    },
    payment: {
      navigate,
      event: siteContent.event,
      participants: siteContent.participants,
      onRegister: saveRegistration,
    },
    admin: {
      siteContent,
      updateContent,
      navigate,
    },
  };

  return routeProps[routeKey] || routeProps.home;
}
