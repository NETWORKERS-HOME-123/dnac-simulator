import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { CiscoSidebar } from "./CiscoSidebar";
import { CiscoHeader } from "./CiscoHeader";
import { toast } from "sonner";

const criticalEvents = [
  "New critical issue detected on SW-CORE-01: High CPU utilization",
  "Interface GigabitEthernet0/0/4 went down on SW-ACCESS-05",
  "RADIUS timeout affecting wireless clients on Floor 2",
  "DHCP pool VLAN-100 approaching exhaustion (92%)",
  "AP-CONF-01 coverage hole detected in conference area",
];

export function CiscoLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      const event = criticalEvents[Math.floor(Math.random() * criticalEvents.length)];
      toast.error(event, { duration: 6000 });
    }, 15000 + Math.random() * 30000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const getBreadcrumb = () => {
    const map: Record<string, string[]> = {
      '/': ['Home', 'Dashboard'],
      '/topology': ['Network', 'Topology'],
      '/inventory': ['Provision', 'Device Inventory'],
      '/assurance': ['Assurance', 'Health'],
    };
    return map[location.pathname] || ['Home'];
  };

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ backgroundColor: 'hsl(213, 27%, 14%)' }}>
      <CiscoSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex flex-1 flex-col min-w-0">
        <CiscoHeader breadcrumb={getBreadcrumb()} />
        <main className="flex-1 overflow-auto bg-background p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
