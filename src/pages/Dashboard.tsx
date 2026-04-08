import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HealthDonut } from "@/components/dashboard/HealthDonut";
import { generateDevices, generateIssues, getSiteHealth, getClientHealth } from "@/data/mockData";
import { AlertTriangle, AlertCircle, Info, CheckCircle, Wifi, Monitor, Server as ServerIcon } from "lucide-react";

export default function Dashboard() {
  const devices = useMemo(() => generateDevices(), []);
  const issues = useMemo(() => generateIssues(), []);
  const siteHealth = useMemo(() => getSiteHealth(), []);
  const clientHealth = useMemo(() => getClientHealth(), []);

  const networkHealth = useMemo(() => {
    const healthy = devices.filter(d => d.healthScore >= 8).length;
    const warning = devices.filter(d => d.healthScore >= 5 && d.healthScore < 8).length;
    const critical = devices.filter(d => d.healthScore < 5).length;
    return { healthy, warning, critical, total: devices.length };
  }, [devices]);

  const devicesByType = useMemo(() => ({
    routers: devices.filter(d => d.type === 'router'),
    switches: devices.filter(d => d.type === 'switch'),
    aps: devices.filter(d => d.type === 'ap'),
    wlcs: devices.filter(d => d.type === 'wlc'),
  }), [devices]);

  const issueCounts = useMemo(() => ({
    P1: issues.filter(i => i.severity === 'P1').length,
    P2: issues.filter(i => i.severity === 'P2').length,
    P3: issues.filter(i => i.severity === 'P3').length,
    P4: issues.filter(i => i.severity === 'P4').length,
  }), [issues]);

  const severityConfig = {
    P1: { icon: AlertCircle, color: 'hsl(0, 72%, 51%)', bg: 'hsl(0, 72%, 95%)', label: 'Critical' },
    P2: { icon: AlertTriangle, color: 'hsl(38, 92%, 50%)', bg: 'hsl(38, 92%, 95%)', label: 'Major' },
    P3: { icon: Info, color: 'hsl(199, 96%, 43%)', bg: 'hsl(199, 96%, 95%)', label: 'Minor' },
    P4: { icon: CheckCircle, color: 'hsl(210, 20%, 60%)', bg: 'hsl(210, 20%, 95%)', label: 'Warning' },
  };

  return (
    <div className="space-y-6">
      {/* Issue Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(Object.entries(issueCounts) as [keyof typeof severityConfig, number][]).map(([sev, count]) => {
          const config = severityConfig[sev];
          const Icon = config.icon;
          return (
            <Card key={sev} className="border-0 shadow-sm">
              <CardContent className="flex items-center gap-3 py-4 px-5">
                <div className="p-2 rounded-lg" style={{ backgroundColor: config.bg }}>
                  <Icon className="h-5 w-5" style={{ color: config.color }} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{count}</div>
                  <div className="text-xs text-muted-foreground">{sev} - {config.label}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Health Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ServerIcon className="h-4 w-4" style={{ color: 'hsl(199, 96%, 43%)' }} />
              Network Health
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-4">
            <HealthDonut
              title="Overall Network"
              healthy={networkHealth.healthy}
              warning={networkHealth.warning}
              critical={networkHealth.critical}
              total={networkHealth.total}
              subtitle={`${networkHealth.total} devices`}
            />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Monitor className="h-4 w-4" style={{ color: 'hsl(199, 96%, 43%)' }} />
              Client Health
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-4">
            <HealthDonut
              title="Client Health"
              healthy={clientHealth.healthy}
              warning={clientHealth.warning}
              critical={clientHealth.critical}
              total={clientHealth.total}
              subtitle={`${clientHealth.wired} wired / ${clientHealth.wireless} wireless`}
            />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Wifi className="h-4 w-4" style={{ color: 'hsl(199, 96%, 43%)' }} />
              Device Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="py-4 space-y-3">
            {[
              { label: 'Routers', count: devicesByType.routers.length, healthy: devicesByType.routers.filter(d => d.healthScore >= 8).length },
              { label: 'Switches', count: devicesByType.switches.length, healthy: devicesByType.switches.filter(d => d.healthScore >= 8).length },
              { label: 'Access Points', count: devicesByType.aps.length, healthy: devicesByType.aps.filter(d => d.healthScore >= 8).length },
              { label: 'WLCs', count: devicesByType.wlcs.length, healthy: devicesByType.wlcs.filter(d => d.healthScore >= 8).length },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{item.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(item.healthy / item.count) * 100}%`,
                        backgroundColor: 'hsl(142, 71%, 45%)',
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-14 text-right">
                    {item.healthy}/{item.count}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Site Health & Recent Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Site Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {siteHealth.map((site) => {
              const pct = Math.round((site.healthy / site.total) * 100);
              return (
                <div key={site.name} className="flex items-center justify-between">
                  <span className="text-sm text-foreground truncate max-w-48">{site.name}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-28 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: pct >= 90 ? 'hsl(142, 71%, 45%)' : pct >= 70 ? 'hsl(38, 92%, 50%)' : 'hsl(0, 72%, 51%)',
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium w-10 text-right" style={{
                      color: pct >= 90 ? 'hsl(142, 71%, 45%)' : pct >= 70 ? 'hsl(38, 92%, 50%)' : 'hsl(0, 72%, 51%)',
                    }}>
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Recent Issues</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {issues.slice(0, 5).map((issue) => (
              <div key={issue.id} className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 border-0 font-bold flex-shrink-0 mt-0.5"
                  style={{
                    backgroundColor: severityConfig[issue.severity].bg,
                    color: severityConfig[issue.severity].color,
                  }}
                >
                  {issue.severity}
                </Badge>
                <div className="min-w-0">
                  <div className="text-sm text-foreground truncate">{issue.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {issue.deviceCount} device{issue.deviceCount > 1 ? 's' : ''} · {issue.category}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
