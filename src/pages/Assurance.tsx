import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HealthDonut } from "@/components/dashboard/HealthDonut";
import { generateIssues, generateHealthTrend, getClientHealth, generateDevices, Issue } from "@/data/mockData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { AlertCircle, AlertTriangle, Info, CheckCircle, Clock } from "lucide-react";

export default function Assurance() {
  const issues = useMemo(() => generateIssues(), []);
  const healthTrend = useMemo(() => generateHealthTrend(), []);
  const clientHealth = useMemo(() => getClientHealth(), []);
  const devices = useMemo(() => generateDevices(), []);
  const [timeRange, setTimeRange] = useState<string>("24h");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const apDevices = devices.filter(d => d.type === 'ap');
  const apHealthy = apDevices.filter(d => d.healthScore >= 8).length;
  const apWarning = apDevices.filter(d => d.healthScore >= 5 && d.healthScore < 8).length;
  const apCritical = apDevices.filter(d => d.healthScore < 5).length;

  const sevConfig: Record<string, { icon: typeof AlertCircle; color: string }> = {
    P1: { icon: AlertCircle, color: 'hsl(0, 72%, 51%)' },
    P2: { icon: AlertTriangle, color: 'hsl(38, 92%, 50%)' },
    P3: { icon: Info, color: 'hsl(199, 96%, 43%)' },
    P4: { icon: CheckCircle, color: 'hsl(210, 20%, 60%)' },
  };

  const trendData = useMemo(() => {
    if (timeRange === '3h') return healthTrend.slice(-4);
    if (timeRange === '7d') return healthTrend;
    return healthTrend;
  }, [healthTrend, timeRange]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Assurance — Network Health</h1>
        <div className="flex items-center gap-1 border rounded-md p-1 bg-card">
          {['3h', '24h', '7d'].map(r => (
            <Button
              key={r}
              variant={timeRange === r ? "default" : "ghost"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setTimeRange(r)}
            >
              {r === '3h' ? 'Last 3h' : r === '24h' ? 'Last 24h' : 'Last 7d'}
            </Button>
          ))}
        </div>
      </div>

      {/* Health Trend */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Health Score Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: 'hsl(215, 14%, 46%)' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(215, 14%, 46%)' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(0, 0%, 100%)',
                  border: '1px solid hsl(214, 20%, 88%)',
                  borderRadius: '6px',
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="network" stroke="hsl(199, 96%, 43%)" strokeWidth={2} dot={false} name="Network" />
              <Line type="monotone" dataKey="client" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={false} name="Client" />
              <Line type="monotone" dataKey="ap" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={false} name="AP" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Health Donuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-0">
            <CardTitle className="text-base font-semibold">Client Health</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-4">
            <HealthDonut
              title="Clients"
              healthy={clientHealth.healthy}
              warning={clientHealth.warning}
              critical={clientHealth.critical}
              total={clientHealth.total}
              subtitle={`${clientHealth.total} total clients`}
            />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-0">
            <CardTitle className="text-base font-semibold">AP Health</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-4">
            <HealthDonut
              title="Access Points"
              healthy={apHealthy}
              warning={apWarning}
              critical={apCritical}
              total={apDevices.length}
              subtitle={`${apDevices.length} APs`}
            />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-0">
            <CardTitle className="text-base font-semibold">Client by SSID</CardTitle>
          </CardHeader>
          <CardContent className="py-4 space-y-3">
            {clientHealth.bySSID.map(ssid => {
              const pct = Math.round((ssid.healthy / ssid.clients) * 100);
              return (
                <div key={ssid.ssid}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-mono text-xs text-foreground">{ssid.ssid}</span>
                    <span className="text-xs text-muted-foreground">{ssid.clients} clients</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: pct >= 90 ? 'hsl(142, 71%, 45%)' : 'hsl(38, 92%, 50%)',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Top Issues */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Top 10 Issues</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {issues.map((issue) => {
            const config = sevConfig[issue.severity];
            const Icon = config.icon;
            return (
              <div
                key={issue.id}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => setSelectedIssue(issue)}
              >
                <Icon className="h-4 w-4 flex-shrink-0" style={{ color: config.color }} />
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 border-0 font-bold flex-shrink-0"
                  style={{
                    backgroundColor: `${config.color}15`,
                    color: config.color,
                  }}
                >
                  {issue.severity}
                </Badge>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-foreground truncate">{issue.title}</div>
                  <div className="text-xs text-muted-foreground">{issue.category} · {issue.deviceCount} device{issue.deviceCount > 1 ? 's' : ''}</div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                  <Clock className="h-3 w-3" />
                  {new Date(issue.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Issue Detail Drawer */}
      <Sheet open={!!selectedIssue} onOpenChange={() => setSelectedIssue(null)}>
        <SheetContent className="w-[480px] overflow-y-auto">
          {selectedIssue && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-0 text-xs"
                    style={{
                      backgroundColor: `${sevConfig[selectedIssue.severity].color}15`,
                      color: sevConfig[selectedIssue.severity].color,
                    }}
                  >
                    {selectedIssue.severity}
                  </Badge>
                  {selectedIssue.title}
                </SheetTitle>
                <SheetDescription>{selectedIssue.category}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Root Cause Analysis</h4>
                  <p className="text-sm text-muted-foreground">{selectedIssue.rootCause}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Suggested Action</h4>
                  <p className="text-sm text-muted-foreground">{selectedIssue.suggestedAction}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Affected Devices ({selectedIssue.deviceCount})
                  </h4>
                  <div className="space-y-1.5">
                    {selectedIssue.devices.map(d => (
                      <div key={d} className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/50 text-sm font-mono">
                        {d}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  Detected: {new Date(selectedIssue.timestamp).toLocaleString()}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
