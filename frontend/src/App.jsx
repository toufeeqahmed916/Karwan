import { NavLink, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";
import RequestsPage from "./pages/RequestsPage.jsx";
import RequesterPage from "./pages/RequesterPage.jsx";
import PhasePage from "./pages/PhasePage.jsx";
import { resetDemo } from "./lib/api.js";

// No real login: the role switch decides which screens show (PRD section 3).
const ROLES = {
  requester: { label: "Requester", home: "/requester", links: [["/requester", "New request"]] },
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
      <header className="flex flex-wrap items-center gap-4 border-b border-line bg-card px-4 py-2">
        <span className="font-display text-xl font-extrabold">Karwan</span>
        <label className="flex items-center gap-2 text-sm">
          Role
          <select className="field w-auto" value={role} onChange={(e) => pickRole(e.target.value)}>
            {Object.entries(ROLES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </label>
        <nav className="flex gap-1">
          {r.links.map(([to, label]) => (
            <NavLink key={to} to={to} className={({ isActive }) => `rounded-ui px-3 py-2 text-sm font-medium ${isActive ? "bg-ink text-white" : "hover:bg-paper"}`}>{label}</NavLink>
          ))}
        </nav>
        <button className="btn-ghost ml-auto" onClick={async () => { await resetDemo(); window.location.reload(); }}>Reset demo</button>
      </header>
      <main className="min-h-0 flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/requests" replace />} />
          <Route path="/requester" element={<RequesterPage />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/inventory" element={<PhasePage title="Inventory" phase="Phase 3">Depot cards, stock edits, capacity, vehicles, transaction log.</PhasePage>} />
          <Route path="/dashboard" element={<PhasePage title="Dashboard" phase="Phase 3">KPI cards and the live map.</PhasePage>} />
          <Route path="/allocation" element={<PhasePage title="Allocation" phase="Phase 4">Generate, review and approve.</PhasePage>} />
          <Route path="/simulator" element={<PhasePage title="Simulator" phase="Phase 5">What-if controls and the before and after view.</PhasePage>} />
          <Route path="/driver" element={<PhasePage title="Delivery" phase="Phase 7">Load card, route, Start Trip and Mark Delivered.</PhasePage>} />
        </Routes>
      </main>
    </div>
  );
}
