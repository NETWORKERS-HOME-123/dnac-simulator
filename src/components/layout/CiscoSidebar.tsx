import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Network,
  Server,
  Activity,
  ChevronLeft,
  ChevronRight,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CiscoSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/topology', icon: Network, label: 'Topology' },
  { path: '/inventory', icon: Server, label: 'Inventory' },
  { path: '/assurance', icon: Activity, label: 'Assurance' },
];

export function CiscoSidebar({ collapsed, onToggle }: CiscoSidebarProps) {
  return (
    <aside
      className={cn(
        "flex flex-col h-full transition-all duration-300 cisco-scrollbar",
        collapsed ? "w-16" : "w-60"
      )}
      style={{ backgroundColor: 'hsl(213, 27%, 17%)' }}
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-4 border-b" style={{ borderColor: 'hsl(213, 20%, 25%)' }}>
        <Globe className="h-7 w-7 flex-shrink-0" style={{ color: 'hsl(199, 96%, 43%)' }} />
        {!collapsed && (
          <div className="ml-3 overflow-hidden">
            <div className="text-sm font-bold tracking-wide" style={{ color: 'hsl(0, 0%, 100%)' }}>
              Catalyst Center
            </div>
            <div className="text-[10px] tracking-wider" style={{ color: 'hsl(210, 20%, 60%)' }}>
              CISCO
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 space-y-1 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                collapsed && "justify-center px-0",
                isActive
                  ? "text-white"
                  : "hover:text-white"
              )
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'hsl(199, 96%, 43%)' : 'transparent',
              color: isActive ? 'white' : 'hsl(210, 20%, 70%)',
            })}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center h-10 border-t transition-colors hover:bg-white/5"
        style={{ borderColor: 'hsl(213, 20%, 25%)', color: 'hsl(210, 20%, 60%)' }}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
}
