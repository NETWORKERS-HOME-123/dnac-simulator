import { Bell, Search, User, ChevronRight, HelpCircle, Star, Download, Menu } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { HamburgerMenu } from "./HamburgerMenu";

interface CiscoHeaderProps {
  breadcrumb: string[];
}

export function CiscoHeader({ breadcrumb }: CiscoHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header
        className="flex items-center justify-between h-12 px-4 border-b flex-shrink-0"
        style={{
          backgroundColor: 'hsl(213, 27%, 14%)',
          borderColor: 'hsl(213, 20%, 25%)',
        }}
      >
        {/* Left: Hamburger + Logo + Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(true)}
            className="p-1.5 rounded-md transition-colors hover:bg-white/10"
            style={{ color: 'hsl(210, 20%, 80%)' }}
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Cisco bridge logo placeholder + text */}
          <div className="flex items-center gap-2 pr-3 border-r mr-1" style={{ borderColor: 'hsl(213, 20%, 25%)' }}>
            <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
              <rect x="0" y="6" width="2" height="6" rx="1" fill="hsl(199, 96%, 43%)" />
              <rect x="4" y="3" width="2" height="9" rx="1" fill="hsl(199, 96%, 43%)" />
              <rect x="8" y="0" width="2" height="12" rx="1" fill="hsl(199, 96%, 43%)" />
              <rect x="12" y="0" width="2" height="12" rx="1" fill="hsl(199, 96%, 43%)" />
              <rect x="16" y="0" width="2" height="12" rx="1" fill="hsl(199, 96%, 43%)" />
              <rect x="20" y="3" width="2" height="9" rx="1" fill="hsl(199, 96%, 43%)" />
              <rect x="22" y="6" width="2" height="6" rx="1" fill="hsl(199, 96%, 43%)" />
            </svg>
            <span className="text-xs font-semibold tracking-wide text-white/90 hidden sm:inline">
              Catalyst Center
            </span>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm">
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="h-3 w-3" style={{ color: 'hsl(210, 20%, 50%)' }} />}
                <span
                  style={{
                    color: i === breadcrumb.length - 1 ? 'hsl(0, 0%, 100%)' : 'hsl(210, 20%, 60%)',
                  }}
                  className={i === breadcrumb.length - 1 ? 'font-medium' : ''}
                >
                  {crumb}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1.5">
          {/* Search */}
          {searchOpen ? (
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'hsl(210, 20%, 50%)' }} />
              <input
                autoFocus
                className="h-7 w-56 rounded-md pl-9 pr-3 text-sm outline-none"
                style={{
                  backgroundColor: 'hsl(213, 27%, 22%)',
                  color: 'white',
                  border: '1px solid hsl(213, 20%, 30%)',
                }}
                placeholder="Search devices, issues, clients..."
                onBlur={() => setSearchOpen(false)}
              />
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="p-1.5 rounded-md transition-colors hover:bg-white/10"
              style={{ color: 'hsl(210, 20%, 70%)' }}
            >
              <Search className="h-4 w-4" />
            </button>
          )}

          <button className="p-1.5 rounded-md transition-colors hover:bg-white/10" style={{ color: 'hsl(210, 20%, 70%)' }}>
            <Star className="h-4 w-4" />
          </button>

          <button className="p-1.5 rounded-md transition-colors hover:bg-white/10" style={{ color: 'hsl(210, 20%, 70%)' }}>
            <HelpCircle className="h-4 w-4" />
          </button>

          <button className="p-1.5 rounded-md transition-colors hover:bg-white/10" style={{ color: 'hsl(210, 20%, 70%)' }}>
            <Download className="h-4 w-4" />
          </button>

          {/* Notifications */}
          <button className="relative p-1.5 rounded-md transition-colors hover:bg-white/10" style={{ color: 'hsl(210, 20%, 70%)' }}>
            <Bell className="h-4 w-4" />
            <Badge
              className="absolute -top-0.5 -right-0.5 h-3.5 min-w-3.5 px-1 text-[9px] flex items-center justify-center bg-destructive text-destructive-foreground border-0"
            >
              3
            </Badge>
          </button>

          {/* User */}
          <div className="flex items-center gap-2 pl-2 ml-1 border-l" style={{ borderColor: 'hsl(213, 20%, 25%)' }}>
            <div className="h-7 w-7 rounded-full flex items-center justify-center" style={{ backgroundColor: 'hsl(199, 96%, 43%)' }}>
              <User className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-xs hidden lg:inline" style={{ color: 'hsl(210, 20%, 80%)' }}>admin</span>
          </div>
        </div>
      </header>

      <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
