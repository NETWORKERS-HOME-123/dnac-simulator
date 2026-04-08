import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
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
      '/': ['Home'],
      '/provision/topology': ['Provision', 'Topology'],
      '/provision/inventory': ['Provision', 'Inventory'],
      '/assurance': ['Assurance', 'Health'],
    };
    return map[location.pathname] || ['Home'];
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden" style={{ backgroundColor: 'hsl(213, 27%, 14%)' }}>
      <CiscoHeader breadcrumb={getBreadcrumb()} />
      <main className="flex-1 overflow-auto bg-background">
        <Outlet />
      </main>
    </div>
  );
}
