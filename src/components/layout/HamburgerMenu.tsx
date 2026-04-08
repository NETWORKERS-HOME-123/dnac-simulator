import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MenuItem {
  label: string;
  path?: string;
  children?: MenuItem[];
  comingSoon?: boolean;
}

const menuTree: MenuItem[] = [
  {
    label: 'Design',
    children: [
      { label: 'Network Hierarchy', comingSoon: true },
      { label: 'Network Settings', comingSoon: true },
      { label: 'Network Profiles', comingSoon: true },
      { label: 'Image Repository', comingSoon: true },
      { label: 'Feature Templates', comingSoon: true },
    ],
  },
  {
    label: 'Policy',
    children: [
      { label: 'Group-Based Access Control', comingSoon: true },
      { label: 'IP Based Access Control', comingSoon: true },
      { label: 'Application Policies', comingSoon: true },
      { label: 'Traffic Copy', comingSoon: true },
    ],
  },
  {
    label: 'Provision',
    children: [
      { label: 'Inventory', path: '/provision/inventory' },
      { label: 'Topology', path: '/provision/topology' },
      { label: 'Network Devices', comingSoon: true },
      { label: 'Virtual Networks', comingSoon: true },
      { label: 'Fabric Sites', comingSoon: true },
    ],
  },
  {
    label: 'Assurance',
    children: [
      { label: 'Health', path: '/assurance' },
      { label: 'Issues & Events', path: '/assurance?tab=issues' },
      { label: 'Manage', comingSoon: true },
    ],
  },
  { label: 'Workflows', comingSoon: true },
  { label: 'Tools', comingSoon: true },
  { label: 'Platform', comingSoon: true },
  { label: 'Activities', comingSoon: true },
  { label: 'Reports', comingSoon: true },
  {
    label: 'System',
    children: [
      { label: 'System 360', comingSoon: true },
      { label: 'Settings', comingSoon: true },
      { label: 'Data Platform', comingSoon: true },
      { label: 'Users & Roles', comingSoon: true },
      { label: 'Backup & Restore', comingSoon: true },
      { label: 'Software Management', comingSoon: true },
      { label: 'Disaster Recovery', comingSoon: true },
    ],
  },
  { label: 'Explore', comingSoon: true },
];

interface HamburgerMenuProps {
  open: boolean;
  onClose: () => void;
}

export function HamburgerMenu({ open, onClose }: HamburgerMenuProps) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string[]>(['Provision', 'Assurance']);

  const toggleExpand = (label: string) => {
    setExpanded(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  const handleClick = (item: MenuItem) => {
    if (item.comingSoon) {
      toast.info(`${item.label} — Coming Soon`, { duration: 2000 });
      return;
    }
    if (item.path) {
      navigate(item.path);
      onClose();
    } else if (item.children) {
      toggleExpand(item.label);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />

      {/* Menu panel */}
      <div
        className="fixed left-0 top-0 bottom-0 z-50 w-72 overflow-y-auto cisco-scrollbar"
        style={{ backgroundColor: 'hsl(213, 27%, 12%)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-4 border-b" style={{ borderColor: 'hsl(213, 20%, 20%)' }}>
          <span className="text-sm font-semibold text-white tracking-wide">Menu</span>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10 transition-colors">
            <X className="h-5 w-5 text-white/70" />
          </button>
        </div>

        {/* Home link */}
        <div className="px-2 pt-3 pb-1">
          <button
            onClick={() => { navigate('/'); onClose(); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-white/90 hover:bg-white/10 transition-colors"
          >
            Home
          </button>
        </div>

        {/* Menu tree */}
        <nav className="px-2 pb-6 space-y-0.5">
          {menuTree.map(item => (
            <div key={item.label}>
              <button
                onClick={() => handleClick(item)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition-colors",
                  item.comingSoon
                    ? "text-white/40 hover:bg-white/5"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                )}
              >
                <span className="font-medium">{item.label}</span>
                {item.children && (
                  expanded.includes(item.label)
                    ? <ChevronDown className="h-4 w-4 text-white/40" />
                    : <ChevronRight className="h-4 w-4 text-white/40" />
                )}
                {item.comingSoon && !item.children && (
                  <span className="text-[10px] uppercase tracking-wider text-white/25">Soon</span>
                )}
              </button>
              {item.children && expanded.includes(item.label) && (
                <div className="ml-3 border-l pl-2 space-y-0.5 my-0.5" style={{ borderColor: 'hsl(213, 20%, 25%)' }}>
                  {item.children.map(child => (
                    <button
                      key={child.label}
                      onClick={() => handleClick(child)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                        child.comingSoon
                          ? "text-white/35 hover:bg-white/5"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      <span className="flex items-center justify-between">
                        {child.label}
                        {child.comingSoon && (
                          <span className="text-[9px] uppercase tracking-wider text-white/20">Soon</span>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
