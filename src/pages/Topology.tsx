import { useState, useCallback, useMemo, useRef } from "react";
import { generateDevices, generateTopologyNodes, generateTopologyLinks, TopologyNode } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw, ChevronRight, ChevronDown } from "lucide-react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";

const deviceIcons: Record<string, { shape: string; color: string }> = {
  router: { shape: 'circle', color: 'hsl(199, 96%, 43%)' },
  switch: { shape: 'rect', color: 'hsl(142, 71%, 45%)' },
  ap: { shape: 'triangle', color: 'hsl(38, 92%, 50%)' },
  wlc: { shape: 'diamond', color: 'hsl(270, 60%, 55%)' },
};

interface SiteNode {
  name: string;
  children?: SiteNode[];
}

const siteHierarchy: SiteNode[] = [
  {
    name: 'Global', children: [
      { name: 'San Jose', children: [{ name: 'Building-1' }, { name: 'Building-2' }] },
      { name: 'New York', children: [{ name: 'HQ' }] },
      { name: 'London', children: [{ name: 'Office-1' }] },
      { name: 'Austin', children: [{ name: 'DC-1' }] },
    ],
  },
];

export default function Topology() {
  const devices = useMemo(() => generateDevices(), []);
  const [nodes, setNodes] = useState(() => generateTopologyNodes());
  const links = useMemo(() => generateTopologyLinks(), []);
  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [expandedSites, setExpandedSites] = useState<Set<string>>(new Set(['Global', 'San Jose']));
  const svgRef = useRef<SVGSVGElement>(null);
  const dragStart = useRef({ x: 0, y: 0 });

  const selectedDevice = useMemo(() => {
    if (!selectedNode) return null;
    const node = nodes.find(n => n.id === selectedNode);
    if (!node) return null;
    return devices.find(d => d.id === node.deviceId) || null;
  }, [selectedNode, nodes, devices]);

  const filteredNodes = filter ? nodes.filter(n => n.type === filter) : nodes;
  const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
  const filteredLinks = links.filter(l => filteredNodeIds.has(l.source) && filteredNodeIds.has(l.target));

  const getLinkColor = (util: number, status: string) => {
    if (status === 'down') return 'hsl(0, 72%, 51%)';
    if (util > 80) return 'hsl(0, 72%, 51%)';
    if (util > 60) return 'hsl(38, 92%, 50%)';
    return 'hsl(142, 71%, 45%)';
  };

  const getNodePos = (id: string) => nodes.find(n => n.id === id);

  const handleMouseDown = useCallback((nodeId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(nodeId);
    const node = nodes.find(n => n.id === nodeId)!;
    dragStart.current = { x: e.clientX - node.x * zoom, y: e.clientY - node.y * zoom };
  }, [nodes, zoom]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    setNodes(prev => prev.map(n =>
      n.id === dragging
        ? { ...n, x: (e.clientX - dragStart.current.x) / zoom, y: (e.clientY - dragStart.current.y) / zoom }
        : n
    ));
  }, [dragging, zoom]);

  const handleMouseUp = useCallback(() => setDragging(null), []);

  const toggleSite = (name: string) => {
    setExpandedSites(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const renderSiteTree = (items: SiteNode[], depth = 0): React.ReactNode => (
    <div className={depth > 0 ? "ml-3 border-l pl-2" : ""} style={depth > 0 ? { borderColor: 'hsl(214, 20%, 88%)' } : {}}>
      {items.map(item => (
        <div key={item.name}>
          <button
            onClick={() => item.children && toggleSite(item.name)}
            className="w-full flex items-center gap-1.5 px-2 py-1.5 text-xs hover:bg-muted/50 rounded transition-colors text-foreground"
          >
            {item.children ? (
              expandedSites.has(item.name)
                ? <ChevronDown className="h-3 w-3 text-muted-foreground" />
                : <ChevronRight className="h-3 w-3 text-muted-foreground" />
            ) : <span className="w-3" />}
            {item.name}
          </button>
          {item.children && expandedSites.has(item.name) && renderSiteTree(item.children, depth + 1)}
        </div>
      ))}
    </div>
  );

  const renderNode = (node: TopologyNode) => {
    const config = deviceIcons[node.type];
    const isSelected = selectedNode === node.id;
    const size = 18;
    return (
      <g key={node.id} transform={`translate(${node.x}, ${node.y})`}
        onMouseDown={(e) => handleMouseDown(node.id, e)}
        onClick={() => setSelectedNode(node.id)}
        className="cursor-pointer"
      >
        {config.shape === 'circle' && <circle r={size} fill={config.color} stroke={isSelected ? 'white' : 'none'} strokeWidth={isSelected ? 3 : 0} opacity={0.9} />}
        {config.shape === 'rect' && <rect x={-size} y={-size} width={size * 2} height={size * 2} rx={4} fill={config.color} stroke={isSelected ? 'white' : 'none'} strokeWidth={isSelected ? 3 : 0} opacity={0.9} />}
        {config.shape === 'triangle' && <polygon points={`0,${-size} ${size},${size} ${-size},${size}`} fill={config.color} stroke={isSelected ? 'white' : 'none'} strokeWidth={isSelected ? 3 : 0} opacity={0.9} />}
        {config.shape === 'diamond' && <polygon points={`0,${-size} ${size},0 0,${size} ${-size},0`} fill={config.color} stroke={isSelected ? 'white' : 'none'} strokeWidth={isSelected ? 3 : 0} opacity={0.9} />}
        <text y={size + 16} textAnchor="middle" fill="hsl(213, 27%, 30%)" fontSize={11} fontWeight={500}>{node.label}</text>
      </g>
    );
  };

  return (
    <div className="flex h-full">
      {/* Site Hierarchy Panel */}
      <div className="w-52 flex-shrink-0 border-r bg-card overflow-y-auto p-3" style={{ borderColor: 'hsl(214, 20%, 88%)' }}>
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Site Hierarchy</div>
        {renderSiteTree(siteHierarchy)}
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 space-y-4 overflow-auto">
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground">Network Topology</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 border rounded-md p-1 bg-card">
              {[
                { type: null, label: 'All' },
                { type: 'router', label: 'Routers' },
                { type: 'switch', label: 'Switches' },
                { type: 'ap', label: 'APs' },
                { type: 'wlc', label: 'WLCs' },
              ].map(f => (
                <Button key={f.label} variant={filter === f.type ? "default" : "ghost"} size="sm" className="h-7 text-xs"
                  onClick={() => setFilter(f.type)}
                >{f.label}</Button>
              ))}
            </div>
            <div className="flex items-center gap-1 border rounded-md p-1 bg-card">
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setZoom(z => Math.min(z + 0.15, 2))}><ZoomIn className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setZoom(z => Math.max(z - 0.15, 0.4))}><ZoomOut className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}><RotateCcw className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {Object.entries(deviceIcons).map(([type, config]) => (
            <span key={type} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: config.color }} />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          ))}
          <span className="ml-4 flex items-center gap-1.5">
            Link: <span className="w-6 h-0.5 inline-block" style={{ backgroundColor: 'hsl(142, 71%, 45%)' }} /> Low
            <span className="w-6 h-0.5 inline-block" style={{ backgroundColor: 'hsl(38, 92%, 50%)' }} /> Med
            <span className="w-6 h-0.5 inline-block" style={{ backgroundColor: 'hsl(0, 72%, 51%)' }} /> High/Down
          </span>
        </div>

        {/* Canvas */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <svg ref={svgRef} width="100%" height="620" className="topology-canvas bg-card"
              onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
            >
              <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                {filteredLinks.map(link => {
                  const s = getNodePos(link.source);
                  const t = getNodePos(link.target);
                  if (!s || !t) return null;
                  return (
                    <g key={link.id}>
                      <line x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                        stroke={getLinkColor(link.utilization, link.status)}
                        strokeWidth={link.status === 'down' ? 1.5 : 2}
                        strokeDasharray={link.status === 'down' ? '6,4' : 'none'} opacity={0.7} />
                      <text x={(s.x + t.x) / 2} y={(s.y + t.y) / 2 - 6}
                        textAnchor="middle" fill="hsl(215, 14%, 46%)" fontSize={9}>
                        {link.utilization}% · {link.bandwidth}
                      </text>
                    </g>
                  );
                })}
                {filteredNodes.map(renderNode)}
              </g>
            </svg>
          </CardContent>
        </Card>
      </div>

      {/* Device Detail Sheet */}
      <Sheet open={!!selectedDevice} onOpenChange={() => setSelectedNode(null)}>
        <SheetContent className="w-96 overflow-y-auto">
          {selectedDevice && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  {selectedDevice.hostname}
                  <Badge variant="outline" className="border-0 text-[10px]"
                    style={{
                      backgroundColor: selectedDevice.healthScore >= 70 ? 'hsl(142, 71%, 90%)' : selectedDevice.healthScore >= 40 ? 'hsl(38, 92%, 90%)' : 'hsl(0, 72%, 90%)',
                      color: selectedDevice.healthScore >= 70 ? 'hsl(142, 71%, 30%)' : selectedDevice.healthScore >= 40 ? 'hsl(38, 92%, 30%)' : 'hsl(0, 72%, 30%)',
                    }}
                  >Health: {selectedDevice.healthScore}%</Badge>
                </SheetTitle>
                <SheetDescription>{selectedDevice.deviceFamily} · {selectedDevice.platform}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-3">
                {[
                  ['IP Address', selectedDevice.ip],
                  ['Software', selectedDevice.softwareVersion],
                  ['Role', selectedDevice.role],
                  ['Uptime', selectedDevice.uptime],
                  ['Reachability', selectedDevice.reachability],
                  ['Manageability', selectedDevice.managementState],
                  ['Compliance', selectedDevice.compliance],
                  ['Serial', selectedDevice.serialNumber],
                  ['MAC', selectedDevice.macAddress],
                  ['Site', selectedDevice.site],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-3 text-foreground">Interfaces ({selectedDevice.interfaces.length})</h4>
                <div className="space-y-1.5 max-h-60 overflow-y-auto">
                  {selectedDevice.interfaces.slice(0, 12).map((intf, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-muted/50">
                      <span className="font-mono">{intf.name}</span>
                      <Badge variant="outline" className="text-[10px] border-0"
                        style={{
                          backgroundColor: intf.status === 'up' ? 'hsl(142, 71%, 90%)' : 'hsl(0, 72%, 90%)',
                          color: intf.status === 'up' ? 'hsl(142, 71%, 30%)' : 'hsl(0, 72%, 30%)',
                        }}
                      >{intf.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
