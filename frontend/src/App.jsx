import { NavLink, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";
import RequestsPage from "./pages/RequestsPage.jsx";
import RequesterPage from "./pages/RequesterPage.jsx";
import InventoryPage from "./pages/InventoryPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AllocationPage from "./pages/AllocationPage.jsx";
import SimulatorPage from "./pages/SimulatorPage.jsx";
import DriverPage from "./pages/DriverPage.jsx";
import RequesterTrackerPage from "./pages/RequesterTrackerPage.jsx";
import ResetDemoButton from "./components/ResetDemoButton.jsx";

// No real login: the role switch decides which screens show (PRD section 3).
const ROLES = {
  requester: { label: "Requester", home: "/requester", links: [["/requester", "New request"], ["/tracker", "Track delivery"]] },
  depot: { label: "Depot manager", home: "/inventory", links: [["/inventory", "Inventory"]] },
  coordinator: { label: "Coordinator", home: "/requests", links: [["/dashboard", "Dashboard"], ["/requests", "Requests"], ["/allocation", "Allocation"], ["/simulator", "Simulator"]] },
  driver: { label: "Driver", home: "/driver", links: [["/driver", "Delivery"]] },
};

export default function App() {
  const [role, setRole] = useState("coordinator");
  const nav = useNavigate();
  const r = ROLES[role];

  function pickRole(k) { setRole(k); nav(ROLES[k].home); }

  return (
    <div className="flex h-full flex-col">
      <header className="relative z-[1100] flex flex-wrap items-center gap-2 border-b border-line bg-card px-3 py-2 sm:gap-4 sm:px-4">
        <span className="font-display text-xl font-extrabold">Karwan</span>
        <label className="flex items-center gap-2 text-sm">
          Role
          <select className="field w-auto" value={role} onChange={(e) => pickRole(e.target.value)}>
            {Object.entries(ROLES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </label>
        <nav className="order-3 flex w-full gap-1 overflow-x-auto sm:order-none sm:w-auto">
          {r.links.map(([to, label]) => (
            <NavLink key={to} to={to} className={({ isActive }) => `rounded-ui px-3 py-2 text-sm font-medium ${isActive ? "bg-ink text-white" : "hover:bg-paper"}`}>{label}</NavLink>
          ))}
        </nav>
        <div className="ml-auto"><ResetDemoButton /></div>
      </header>
      <main className="min-h-0 flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/requests" replace />} />
          <Route path="/requester" element={<RequesterPage />} />
          <Route path="/tracker" element={<RequesterTrackerPage />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/allocation" element={<AllocationPage />} />
          <Route path="/simulator" element={<SimulatorPage />} />
          <Route path="/driver" element={<DriverPage />} />
        </Routes>
      </main>
    </div>
  );
}
