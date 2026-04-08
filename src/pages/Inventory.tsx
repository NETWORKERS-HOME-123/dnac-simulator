import { useState, useMemo } from "react";
import { generateDevices, NetworkDevice } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Download, ArrowUpDown, ChevronUp, ChevronDown, MoreVertical, RefreshCw, Trash2, Edit, RotateCcw } from "lucide-react";

type SortKey = 'hostname' | 'ip' | 'deviceFamily' | 'role' | 'site' | 'reachability' | 'managementState' | 'softwareVersion' | 'healthScore' | 'compliance' | 'lastSyncStatus';

export default function Inventory() {
  const devices = useMemo(() => generateDevices(), []);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("hostname");
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<NetworkDevice | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [focus, setFocus] = useState<'inventory' | 'provision'>('inventory');

  const filtered = useMemo(() => {
    let list = devices;
    if (tab !== 'all') list = list.filter(d => d.type === tab);
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(d =>
        d.hostname.toLowerCase().includes(s) ||
        d.ip.includes(s) ||
        d.deviceFamily.toLowerCase().includes(s) ||
        d.site.toLowerCase().includes(s)
      );
    }
    list = [...list].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'number' && typeof bVal === 'number') return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      return sortDir === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
    });
    return list;
  }, [devices, tab, search, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-40" />;
    return sortDir === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />;
  };

  const tabs = [
    { key: 'all', label: 'All', count: devices.length },
    { key: 'router', label: 'Routers', count: devices.filter(d => d.type === 'router').length },
    { key: 'switch', label: 'Switches', count: devices.filter(d => d.type === 'switch').length },
    { key: 'ap', label: 'APs', count: devices.filter(d => d.type === 'ap').length },
    { key: 'wlc', label: 'WLCs', count: devices.filter(d => d.type === 'wlc').length },
  ];

  const healthColor = (score: number) =>
    score >= 70 ? 'hsl(142, 71%, 45%)' : score >= 40 ? 'hsl(38, 92%, 50%)' : 'hsl(0, 72%, 51%)';

  const reachabilityStyle = (r: string) => {
    if (r === 'Reachable') return { bg: 'hsl(142, 71%, 90%)', color: 'hsl(142, 71%, 30%)' };
    if (r === 'Ping Reachable') return { bg: 'hsl(38, 92%, 90%)', color: 'hsl(38, 92%, 30%)' };
    return { bg: 'hsl(0, 72%, 90%)', color: 'hsl(0, 72%, 30%)' };
  };

  const columns: { key: SortKey; label: string; className?: string }[] = [
    { key: 'hostname', label: 'Device Name' },
    { key: 'ip', label: 'IP Address' },
    { key: 'deviceFamily', label: 'Device Family' },
    { key: 'role', label: 'Device Role' },
    { key: 'site', label: 'Site' },
    { key: 'reachability', label: 'Reachability' },
    { key: 'managementState', label: 'Manageability' },
    { key: 'softwareVersion', label: 'Software Version' },
    { key: 'healthScore', label: 'Health' },
    { key: 'compliance', label: 'Compliance' },
    { key: 'lastSyncStatus', label: 'Last Sync' },
  ];

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-foreground">Inventory</h1>
          {/* Focus selector */}
          <div className="flex items-center gap-1 border rounded-md p-0.5 bg-card">
            <Button
              variant={focus === 'inventory' ? 'default' : 'ghost'}
              size="sm" className="h-6 text-xs px-3"
              onClick={() => setFocus('inventory')}
            >Focus: Inventory</Button>
            <Button
              variant={focus === 'provision' ? 'default' : 'ghost'}
              size="sm" className="h-6 text-xs px-3"
              onClick={() => setFocus('provision')}
            >Focus: Provision</Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {checkedIds.size > 0 && (
            <span className="text-xs text-muted-foreground mr-2">{checkedIds.size} selected</span>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                Actions <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-xs gap-2"><RefreshCw className="h-3 w-3" /> Resync</DropdownMenuItem>
              <DropdownMenuItem className="text-xs gap-2"><Edit className="h-3 w-3" /> Edit Device</DropdownMenuItem>
              <DropdownMenuItem className="text-xs gap-2"><RotateCcw className="h-3 w-3" /> Reset Device</DropdownMenuItem>
              <DropdownMenuItem className="text-xs gap-2 text-destructive"><Trash2 className="h-3 w-3" /> Delete Device</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t.key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label} <span className="text-xs text-muted-foreground ml-1">({t.count})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, IP, family, or site..."
          className="pl-9 h-9"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-10">
                  <input
                    type="checkbox" className="rounded"
                    checked={checkedIds.size === filtered.length && filtered.length > 0}
                    onChange={e => setCheckedIds(e.target.checked ? new Set(filtered.map(d => d.id)) : new Set())}
                  />
                </TableHead>
                {columns.map(col => (
                  <TableHead
                    key={col.key}
                    className="cursor-pointer select-none hover:text-foreground text-xs whitespace-nowrap"
                    onClick={() => toggleSort(col.key)}
                  >
                    <div className="flex items-center">{col.label}<SortIcon col={col.key} /></div>
                  </TableHead>
                ))}
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(device => {
                const rs = reachabilityStyle(device.reachability);
                return (
                  <TableRow key={device.id} className="cursor-pointer" onClick={() => setSelected(device)}>
                    <TableCell onClick={e => e.stopPropagation()}>
                      <input type="checkbox" className="rounded"
                        checked={checkedIds.has(device.id)}
                        onChange={e => {
                          const next = new Set(checkedIds);
                          e.target.checked ? next.add(device.id) : next.delete(device.id);
                          setCheckedIds(next);
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-foreground font-mono text-xs whitespace-nowrap">{device.hostname}</TableCell>
                    <TableCell className="font-mono text-xs">{device.ip}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap">{device.deviceFamily}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px] font-medium">{device.role}</Badge></TableCell>
                    <TableCell className="text-xs whitespace-nowrap">{device.site}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] border-0" style={{ backgroundColor: rs.bg, color: rs.color }}>
                        {device.reachability}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] border-0"
                        style={{
                          backgroundColor: device.managementState === 'Managed' ? 'hsl(199, 96%, 90%)' : 'hsl(210, 20%, 90%)',
                          color: device.managementState === 'Managed' ? 'hsl(199, 96%, 30%)' : 'hsl(210, 20%, 40%)',
                        }}
                      >{device.managementState}</Badge>
                    </TableCell>
                    <TableCell className="text-xs whitespace-nowrap">{device.softwareVersion}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <div className="w-7 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${device.healthScore}%`, backgroundColor: healthColor(device.healthScore) }} />
                        </div>
                        <span className="text-[11px] font-medium" style={{ color: healthColor(device.healthScore) }}>{device.healthScore}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] border-0"
                        style={{
                          backgroundColor: device.compliance === 'Compliant' ? 'hsl(142, 71%, 90%)' : device.compliance === 'Non-Compliant' ? 'hsl(0, 72%, 90%)' : 'hsl(210, 20%, 93%)',
                          color: device.compliance === 'Compliant' ? 'hsl(142, 71%, 30%)' : device.compliance === 'Non-Compliant' ? 'hsl(0, 72%, 30%)' : 'hsl(210, 20%, 50%)',
                        }}
                      >{device.compliance}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] border-0"
                        style={{
                          backgroundColor: device.lastSyncStatus === 'Success' ? 'hsl(142, 71%, 90%)' : device.lastSyncStatus === 'Failed' ? 'hsl(0, 72%, 90%)' : 'hsl(38, 92%, 90%)',
                          color: device.lastSyncStatus === 'Success' ? 'hsl(142, 71%, 30%)' : device.lastSyncStatus === 'Failed' ? 'hsl(0, 72%, 30%)' : 'hsl(38, 92%, 30%)',
                        }}
                      >{device.lastSyncStatus}</Badge>
                    </TableCell>
                    <TableCell onClick={e => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><MoreVertical className="h-3.5 w-3.5" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-xs gap-2"><RefreshCw className="h-3 w-3" /> Resync</DropdownMenuItem>
                          <DropdownMenuItem className="text-xs gap-2"><Edit className="h-3 w-3" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-xs gap-2 text-destructive"><Trash2 className="h-3 w-3" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className="px-4 py-3 text-xs text-muted-foreground border-t">
            Showing {filtered.length} of {devices.length} devices
          </div>
        </CardContent>
      </Card>

      {/* Device Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="w-[480px] overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.hostname}</SheetTitle>
                <SheetDescription>{selected.deviceFamily} · {selected.platform}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-3">
                {[
                  ['IP Address', selected.ip],
                  ['Device Family', selected.deviceFamily],
                  ['Platform', selected.platform],
                  ['Software Version', selected.softwareVersion],
                  ['Role', selected.role],
                  ['Uptime', selected.uptime],
                  ['Reachability', selected.reachability],
                  ['Manageability', selected.managementState],
                  ['Health Score', `${selected.healthScore}%`],
                  ['Compliance', selected.compliance],
                  ['Last Sync', selected.lastSyncStatus],
                  ['Serial Number', selected.serialNumber],
                  ['MAC Address', selected.macAddress],
                  ['Site', selected.site],
                  ['Last Updated', new Date(selected.lastUpdated).toLocaleString()],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-3 text-foreground">Interfaces ({selected.interfaces.length})</h4>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-xs">Name</TableHead>
                        <TableHead className="text-xs">Status</TableHead>
                        <TableHead className="text-xs">Speed</TableHead>
                        <TableHead className="text-xs">VLAN</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selected.interfaces.map((intf, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-mono text-xs py-1.5">{intf.name}</TableCell>
                          <TableCell className="py-1.5">
                            <Badge variant="outline" className="text-[10px] border-0"
                              style={{
                                backgroundColor: intf.status === 'up' ? 'hsl(142, 71%, 90%)' : 'hsl(0, 72%, 90%)',
                                color: intf.status === 'up' ? 'hsl(142, 71%, 30%)' : 'hsl(0, 72%, 30%)',
                              }}
                            >{intf.status}</Badge>
                          </TableCell>
                          <TableCell className="text-xs py-1.5">{intf.speed}</TableCell>
                          <TableCell className="text-xs py-1.5">{intf.vlan}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
