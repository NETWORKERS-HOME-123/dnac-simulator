import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { generateDevices, generateIssues, getNetworkSnapshot, getClientHealth } from "@/data/mockData";
import {
  AlertCircle, AlertTriangle, TrendingUp, Globe, Server, Layers,
  Shield, Image, Download, Key, AlertOctagon, FileText, Brain,
  ChevronRight, Wifi, Monitor
} from "lucide-react";

export default function Dashboard() {
  const devices = useMemo(() => generateDevices(), []);
  const issues = useMemo(() => generateIssues(), []);
  const snapshot = useMemo(() => getNetworkSnapshot(), []);
  const clientHealth = useMemo(() => getClientHealth(), []);

  const navigate = useNavigate();

  const networkHealth = useMemo(() => {
    const healthy = devices.filter(d => d.healthScore >= 70).length;
    return Math.round((healthy / devices.length) * 100);
  }, [devices]);

  const wiredPct = Math.round((clientHealth.healthy / clientHealth.total) * 100);

  const p1Count = issues.filter(i => i.severity === 'P1').length;
  const p2Count = issues.filter(i => i.severity === 'P2').length;

  return (
    <div className="p-6 space-y-8">
      {/* Assurance Summary */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-4">Assurance Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Overall Health */}
          <Card className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/assurance')}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Health</div>
                  <div className="text-3xl font-bold text-foreground">{networkHealth}%</div>
                  <div className="text-xs text-muted-foreground mt-1">Enterprise Health Score</div>
                </div>
                <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Server className="h-3.5 w-3.5" style={{ color: 'hsl(199, 96%, 43%)' }} />
                    <span>Network Devices: {networkHealth}%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Monitor className="h-3.5 w-3.5" style={{ color: 'hsl(142, 71%, 45%)' }} />
                    <span>Wired Clients: {wiredPct}%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Wifi className="h-3.5 w-3.5" style={{ color: 'hsl(38, 92%, 50%)' }} />
                    <span>Wireless Clients: {Math.round((clientHealth.wireless - clientHealth.critical) / clientHealth.wireless * 100)}%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 text-xs font-medium" style={{ color: 'hsl(199, 96%, 43%)' }}>
                View Details <ChevronRight className="h-3 w-3" />
              </div>
            </CardContent>
          </Card>

          {/* Critical Issues */}
          <Card className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/assurance?tab=issues')}>
            <CardContent className="p-5">
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Critical Issues</div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" style={{ color: 'hsl(0, 72%, 51%)' }} />
                  <div>
                    <div className="text-2xl font-bold text-foreground">{p1Count}</div>
                    <div className="text-xs text-muted-foreground">P1 Critical</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" style={{ color: 'hsl(38, 92%, 50%)' }} />
                  <div>
                    <div className="text-2xl font-bold text-foreground">{p2Count}</div>
                    <div className="text-xs text-muted-foreground">P2 Major</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 text-xs font-medium" style={{ color: 'hsl(199, 96%, 43%)' }}>
                View Details <ChevronRight className="h-3 w-3" />
              </div>
            </CardContent>
          </Card>

          {/* Trends and Insights */}
          <Card className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/assurance')}>
            <CardContent className="p-5">
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Trends and Insights</div>
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: 'hsl(142, 71%, 45%)' }} />
                <div className="text-sm text-foreground leading-relaxed">
                  Network health improved 3% in the last 24 hours. {p1Count > 0 ? `${p1Count} critical issue${p1Count > 1 ? 's' : ''} require${p1Count === 1 ? 's' : ''} attention.` : 'No critical issues detected.'}
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 text-xs font-medium" style={{ color: 'hsl(199, 96%, 43%)' }}>
                View Details <ChevronRight className="h-3 w-3" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Network Snapshot */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-4">Network Snapshot</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <SnapshotTile
            icon={Globe}
            title="Sites"
            value={snapshot.sites.total}
            details={[`${snapshot.sites.dnsServers} DNS servers`, `${snapshot.sites.ntpServers} NTP servers`]}
            action="Add Sites"
          />
          <SnapshotTile
            icon={Server}
            title="Network Devices"
            value={snapshot.networkDevices.total}
            details={[
              `${snapshot.networkDevices.unclaimed} unclaimed`,
              `${snapshot.networkDevices.unprovisioned} unprovisioned`,
              `${snapshot.networkDevices.unreachable} unreachable`,
            ]}
            action="Find New Devices"
            onClick={() => navigate('/provision/inventory')}
          />
          <SnapshotTile
            icon={Layers}
            title="Network Profiles"
            value={snapshot.networkProfiles.total}
            details={['Switching, Wireless, Routing']}
            action="Manage Profiles"
          />
          <SnapshotTile
            icon={Shield}
            title="Application Policies"
            value={snapshot.applicationPolicies.total}
            details={[
              `${snapshot.applicationPolicies.successful} successful`,
              `${snapshot.applicationPolicies.errored} errored`,
            ]}
          />
          <SnapshotTile
            icon={Image}
            title="Import Images/SMUs"
            value={snapshot.images.total}
            details={[`${snapshot.images.untagged} untagged`, `${snapshot.images.unverified} unverified`]}
          />
          <SnapshotTile
            icon={Download}
            title="Software Updates"
            value={snapshot.softwareUpdates.available}
            details={['Updates available']}
          />
          <SnapshotTile
            icon={Key}
            title="Licensed Devices"
            value={snapshot.licensedDevices.switches + snapshot.licensedDevices.routers + snapshot.licensedDevices.wireless}
            details={[
              `${snapshot.licensedDevices.switches} switches`,
              `${snapshot.licensedDevices.routers} routers`,
              `${snapshot.licensedDevices.wireless} wireless`,
            ]}
          />
          <SnapshotTile
            icon={AlertOctagon}
            title="EoX Status"
            value={snapshot.eoxStatus.alerts}
            details={[`${snapshot.eoxStatus.scanned} devices scanned`, `${snapshot.eoxStatus.alerts} alerts`]}
          />
        </div>
      </div>
    </div>
  );
}

interface SnapshotTileProps {
  icon: React.ElementType;
  title: string;
  value: number;
  details: string[];
  action?: string;
  onClick?: () => void;
}

function SnapshotTile({ icon: Icon, title, value, details, action, onClick }: SnapshotTileProps) {
  return (
    <Card
      className={`border-0 shadow-sm ${onClick ? 'cursor-pointer hover:shadow-md' : ''} transition-shadow`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="h-4 w-4" style={{ color: 'hsl(199, 96%, 43%)' }} />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</span>
        </div>
        <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
        <div className="space-y-0.5">
          {details.map((d, i) => (
            <div key={i} className="text-[11px] text-muted-foreground">{d}</div>
          ))}
        </div>
        {action && (
          <div className="flex items-center gap-1 mt-2 text-[11px] font-medium" style={{ color: 'hsl(199, 96%, 43%)' }}>
            {action} <ChevronRight className="h-3 w-3" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
