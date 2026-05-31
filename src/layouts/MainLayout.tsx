import { Outlet } from "react-router-dom";
import ChatBot from "../components/ChatBot.jsx";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FooterData {
  tagline?: string;
  dates?: string;
  organizers?: string[];
  sponsors?: string[];
  publication?: string;
}

interface MainLayoutProps {
  footer?: FooterData;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function MainLayout({ footer }: MainLayoutProps) {
  return (
    <div className="app">
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer footer={footer} />

      <ChatBot />
      <a
        href="https://wa.me/233536909471?text=Hello%2C%20I%20have%20a%20question%20about%20the%20DCS%20Postgraduate%20Workshop%202026"
        target="_blank"
        rel="noreferrer"
        title="Chat on WhatsApp"
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          zIndex: 999,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#25D366",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          boxShadow: "0 4px 20px rgba(37,211,102,0.45)",
          textDecoration: "none",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.transform = "scale(1)";
        }}
      >
        💬
      </a>
    </div>
  );
}
