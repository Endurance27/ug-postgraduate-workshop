import { Outlet } from "react-router-dom";

// ─── Component ───────────────────────────────────────────────────────────────
export default function AdminLayout() {
  return (
    <div className="app">
      <Outlet />
    </div>
  );
}
