
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  User,
  Layers3
} from "lucide-react";

import LogoutButton from "./LogoutButton";

const links = [
  ["/student", "Dashboard", LayoutDashboard],
  ["/student/groups", "My Groups", Users],
  ["/student/assignments", "Assignments", ClipboardList],
  ["/student/profile", "Profile", User]
];

function Sidebar() {
  return (
<aside className="group peer fixed left-0 top-0 z-40 h-screen w-[76px] shrink-0 overflow-hidden border-r border-[#E5E7EB] bg-white transition-all duration-300 ease-in-out hover:w-[260px]">
    
          {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-[#E5E7EB] px-5 min-w-[260px]">

        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-900 text-white">
          <Layers3 size={20} />
        </div>

        <span className="text-xl font-bold text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          AssignHub
        </span>

      </div>

      {/* Navigation */}
      <nav className="space-y-1 p-4">

        {links.map(([to, label, Icon]) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/student"}
            title={label}
            className={({ isActive }) =>
              `flex min-w-[220px] items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`
            }
          >
            <Icon size={18} className="shrink-0" />

            <span className="opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {label}
            </span>

          </NavLink>
        ))}

      </nav>

      {/* Logout */}
      <div className="absolute bottom-5 left-4 right-4 overflow-hidden">
        <LogoutButton />
      </div>

    </aside>
  );
}

export default Sidebar;
