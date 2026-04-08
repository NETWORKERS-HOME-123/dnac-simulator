import { Bell, Search, User, ChevronRight, Settings, HelpCircle } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface CiscoHeaderProps {
  breadcrumb: string[];
}

export function CiscoHeader({ breadcrumb }: CiscoHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header
      className="flex items-center justify-between h-14 px-4 border-b flex-shrink-0"
      style={{
        backgroundColor: 'hsl(213, 27%, 14%)',
        borderColor: 'hsl(213, 20%, 25%)',
      }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm">
        {breadcrumb.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5" style={{ color: 'hsl(210, 20%, 50%)' }} />}
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

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        {searchOpen ? (
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'hsl(210, 20%, 50%)' }} />
            <input
              autoFocus
              className="h-8 w-64 rounded-md pl-9 pr-3 text-sm outline-none"
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
            className="p-2 rounded-md transition-colors hover:bg-white/10"
            style={{ color: 'hsl(210, 20%, 70%)' }}
          >
            <Search className="h-4.5 w-4.5" />
          </button>
        )}

        <button className="p-2 rounded-md transition-colors hover:bg-white/10" style={{ color: 'hsl(210, 20%, 70%)' }}>
          <HelpCircle className="h-4.5 w-4.5" />
        </button>

        <button className="p-2 rounded-md transition-colors hover:bg-white/10" style={{ color: 'hsl(210, 20%, 70%)' }}>
          <Settings className="h-4.5 w-4.5" />
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-md transition-colors hover:bg-white/10" style={{ color: 'hsl(210, 20%, 70%)' }}>
          <Bell className="h-4.5 w-4.5" />
          <Badge
            className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 text-[10px] flex items-center justify-center bg-destructive text-destructive-foreground border-0"
          >
            3
          </Badge>
        </button>

        {/* User */}
        <div className="flex items-center gap-2 pl-2 border-l" style={{ borderColor: 'hsl(213, 20%, 25%)' }}>
          <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'hsl(199, 96%, 43%)' }}>
            <User className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm hidden lg:inline" style={{ color: 'hsl(210, 20%, 80%)' }}>admin</span>
        </div>
      </div>
    </header>
  );
}
