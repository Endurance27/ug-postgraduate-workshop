import { useState, useEffect } from "react";

export default function Countdown() {
  const target = new Date("2026-08-27T08:00:00");
  const calc = () => {
    const diff = target - new Date();
    if (diff <= 0) return { d:0, h:0, m:0, s:0 };
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  };
  const [t, setT] = useState(calc());
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id); }, []);

  const Box = ({ n, label }) => (
    <div style={{ textAlign: "center" }}>
      <div style={{
        background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)",
        border: "1px solid rgba(255,255,255,0.25)",
        borderRadius: 12, padding: "16px 20px", minWidth: 72,
        fontFamily: "Playfair Display, serif", fontSize: 36, fontWeight: 700,
        color: "#fff", lineHeight: 1
      }}>{String(n).padStart(2,"0")}</div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
    </div>
  );

  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
      <Box n={t.d} label="Days" />
      <Box n={t.h} label="Hours" />
      <Box n={t.m} label="Min" />
      <Box n={t.s} label="Sec" />
    </div>
  );
}
