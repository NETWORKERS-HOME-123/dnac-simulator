// Mock data for Cisco DNA Center simulation

export type DeviceRole = 'CORE' | 'DISTRIBUTION' | 'ACCESS' | 'BORDER ROUTER' | 'WLC' | 'AP';
export type DeviceType = 'router' | 'switch' | 'ap' | 'wlc';
export type Reachability = 'Reachable' | 'Unreachable';
export type HealthStatus = 'healthy' | 'warning' | 'critical';

export interface NetworkDevice {
  id: string;
  hostname: string;
  ip: string;
  platform: string;
  softwareVersion: string;
  role: DeviceRole;
  type: DeviceType;
  uptime: string;
  reachability: Reachability;
  healthScore: number;
  macAddress: string;
  serialNumber: string;
  site: string;
  lastUpdated: string;
  interfaces: DeviceInterface[];
}

export interface DeviceInterface {
  name: string;
  status: 'up' | 'down' | 'admin-down';
  speed: string;
  vlan: string;
  duplex: string;
  description: string;
}

export interface TopologyNode {
  id: string;
  deviceId: string;
  x: number;
  y: number;
  type: DeviceType;
  label: string;
}

export interface TopologyLink {
  id: string;
  source: string;
  target: string;
  utilization: number; // 0-100
  bandwidth: string;
  status: 'up' | 'down';
}

export interface Issue {
  id: string;
  title: string;
  severity: 'P1' | 'P2' | 'P3' | 'P4';
  category: string;
  deviceCount: number;
  devices: string[];
  timestamp: string;
  status: 'active' | 'resolved';
  rootCause: string;
  suggestedAction: string;
}

const randomUptime = () => {
  const days = Math.floor(Math.random() * 365) + 1;
  const hours = Math.floor(Math.random() * 24);
  return `${days}d ${hours}h`;
};

const randomHealth = (): number => {
  const r = Math.random();
  if (r > 0.15) return Math.floor(Math.random() * 3) + 8; // 8-10
  if (r > 0.05) return Math.floor(Math.random() * 3) + 5; // 5-7
  return Math.floor(Math.random() * 4) + 1; // 1-4
};

const generateInterfaces = (type: DeviceType): DeviceInterface[] => {
  const count = type === 'ap' ? 2 : type === 'wlc' ? 8 : Math.floor(Math.random() * 24) + 12;
  const interfaces: DeviceInterface[] = [];
  for (let i = 0; i < count; i++) {
    const prefix = type === 'router' ? 'GigabitEthernet' : type === 'ap' ? 'wlan' : 'GigabitEthernet';
    const slot = type === 'ap' ? '' : `0/${Math.floor(i / 12)}/`;
    interfaces.push({
      name: `${prefix}${slot}${i % 12}`,
      status: Math.random() > 0.2 ? 'up' : Math.random() > 0.5 ? 'down' : 'admin-down',
      speed: type === 'ap' ? '1 Gbps' : Math.random() > 0.5 ? '10 Gbps' : '1 Gbps',
      vlan: `${Math.floor(Math.random() * 200) + 1}`,
      duplex: 'full',
      description: Math.random() > 0.5 ? `Link to ${['Core', 'Dist', 'Access', 'Server'][Math.floor(Math.random() * 4)]}` : '',
    });
  }
  return interfaces;
};

const sites = ['Global/San Jose/Building-1', 'Global/San Jose/Building-2', 'Global/New York/HQ', 'Global/London/Office-1', 'Global/Austin/DC-1'];

export const generateDevices = (): NetworkDevice[] => {
  const devices: NetworkDevice[] = [
    // Core routers
    ...['CORE-RTR-01', 'CORE-RTR-02'].map((h, i) => ({
      id: `rtr-${i}`, hostname: h, ip: `10.1.1.${i + 1}`, platform: 'Cisco ASR 1001-X',
      softwareVersion: 'IOS-XE 17.6.3', role: 'BORDER ROUTER' as DeviceRole, type: 'router' as DeviceType,
      uptime: randomUptime(), reachability: 'Reachable' as Reachability, healthScore: randomHealth(),
      macAddress: `00:1A:2B:${i}C:3D:4E`, serialNumber: `FCW2${i}34K0${i}P`, site: sites[0],
      lastUpdated: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      interfaces: generateInterfaces('router'),
    })),
    // Core switches
    ...['SW-CORE-01', 'SW-CORE-02'].map((h, i) => ({
      id: `sw-core-${i}`, hostname: h, ip: `10.1.2.${i + 1}`, platform: 'Cisco Catalyst 9500',
      softwareVersion: 'IOS-XE 17.6.4', role: 'CORE' as DeviceRole, type: 'switch' as DeviceType,
      uptime: randomUptime(), reachability: 'Reachable' as Reachability, healthScore: randomHealth(),
      macAddress: `00:2B:3C:${i}D:4E:5F`, serialNumber: `FDO2${i}45L0${i}R`, site: sites[0],
      lastUpdated: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      interfaces: generateInterfaces('switch'),
    })),
    // Distribution switches
    ...Array.from({ length: 6 }, (_, i) => ({
      id: `sw-dist-${i}`, hostname: `SW-DIST-0${i + 1}`, ip: `10.1.3.${i + 1}`, platform: 'Cisco Catalyst 9400',
      softwareVersion: 'IOS-XE 17.5.1', role: 'DISTRIBUTION' as DeviceRole, type: 'switch' as DeviceType,
      uptime: randomUptime(), reachability: (Math.random() > 0.05 ? 'Reachable' : 'Unreachable') as Reachability,
      healthScore: randomHealth(), macAddress: `00:3C:4D:${i}E:5F:6A`, serialNumber: `FDO2${i}56M0${i}S`,
      site: sites[i % sites.length], lastUpdated: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      interfaces: generateInterfaces('switch'),
    })),
    // Access switches
    ...Array.from({ length: 24 }, (_, i) => ({
      id: `sw-acc-${i}`, hostname: `SW-ACCESS-${String(i + 1).padStart(2, '0')}`, ip: `10.1.4.${i + 1}`,
      platform: i % 3 === 0 ? 'Cisco Catalyst 9300' : i % 3 === 1 ? 'Cisco Catalyst 9200' : 'Cisco Catalyst 3850',
      softwareVersion: i % 2 === 0 ? 'IOS-XE 17.6.4' : 'IOS-XE 17.3.5',
      role: 'ACCESS' as DeviceRole, type: 'switch' as DeviceType, uptime: randomUptime(),
      reachability: (Math.random() > 0.08 ? 'Reachable' : 'Unreachable') as Reachability,
      healthScore: randomHealth(), macAddress: `00:4D:5E:${String(i).padStart(2, '0')}:6A:7B`,
      serialNumber: `FDO2${i}67N0${i}T`, site: sites[i % sites.length],
      lastUpdated: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      interfaces: generateInterfaces('switch'),
    })),
    // WLCs
    ...['WLC-01', 'WLC-02'].map((h, i) => ({
      id: `wlc-${i}`, hostname: h, ip: `10.1.5.${i + 1}`, platform: 'Cisco Catalyst 9800-40',
      softwareVersion: 'IOS-XE 17.6.2', role: 'WLC' as DeviceRole, type: 'wlc' as DeviceType,
      uptime: randomUptime(), reachability: 'Reachable' as Reachability, healthScore: randomHealth(),
      macAddress: `00:5E:6F:${i}A:7B:8C`, serialNumber: `FCW2${i}78P0${i}U`, site: sites[0],
      lastUpdated: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      interfaces: generateInterfaces('wlc'),
    })),
    // APs
    ...Array.from({ length: 18 }, (_, i) => ({
      id: `ap-${i}`, hostname: `AP-${['LOBBY', 'FLOOR1', 'FLOOR2', 'FLOOR3', 'CONF', 'CAFE'][i % 6]}-${String(Math.floor(i / 6) + 1).padStart(2, '0')}`,
      ip: `10.1.6.${i + 1}`, platform: i % 2 === 0 ? 'Cisco Catalyst 9120AXI' : 'Cisco Catalyst 9130AXE',
      softwareVersion: '17.6.4', role: 'AP' as DeviceRole, type: 'ap' as DeviceType, uptime: randomUptime(),
      reachability: (Math.random() > 0.1 ? 'Reachable' : 'Unreachable') as Reachability,
      healthScore: randomHealth(), macAddress: `00:6F:7A:${String(i).padStart(2, '0')}:8C:9D`,
      serialNumber: `FCW2${i}89Q0${i}V`, site: sites[i % sites.length],
      lastUpdated: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      interfaces: generateInterfaces('ap'),
    })),
  ];
  return devices;
};

export const generateTopologyNodes = (): TopologyNode[] => [
  { id: 'n-rtr-0', deviceId: 'rtr-0', x: 400, y: 60, type: 'router', label: 'CORE-RTR-01' },
  { id: 'n-rtr-1', deviceId: 'rtr-1', x: 600, y: 60, type: 'router', label: 'CORE-RTR-02' },
  { id: 'n-sw-core-0', deviceId: 'sw-core-0', x: 350, y: 180, type: 'switch', label: 'SW-CORE-01' },
  { id: 'n-sw-core-1', deviceId: 'sw-core-1', x: 650, y: 180, type: 'switch', label: 'SW-CORE-02' },
  { id: 'n-sw-dist-0', deviceId: 'sw-dist-0', x: 150, y: 310, type: 'switch', label: 'SW-DIST-01' },
  { id: 'n-sw-dist-1', deviceId: 'sw-dist-1', x: 350, y: 310, type: 'switch', label: 'SW-DIST-02' },
  { id: 'n-sw-dist-2', deviceId: 'sw-dist-2', x: 550, y: 310, type: 'switch', label: 'SW-DIST-03' },
  { id: 'n-sw-dist-3', deviceId: 'sw-dist-3', x: 750, y: 310, type: 'switch', label: 'SW-DIST-04' },
  { id: 'n-wlc-0', deviceId: 'wlc-0', x: 850, y: 180, type: 'wlc', label: 'WLC-01' },
  { id: 'n-sw-acc-0', deviceId: 'sw-acc-0', x: 80, y: 440, type: 'switch', label: 'SW-ACCESS-01' },
  { id: 'n-sw-acc-1', deviceId: 'sw-acc-1', x: 220, y: 440, type: 'switch', label: 'SW-ACCESS-02' },
  { id: 'n-sw-acc-2', deviceId: 'sw-acc-2', x: 360, y: 440, type: 'switch', label: 'SW-ACCESS-03' },
  { id: 'n-sw-acc-3', deviceId: 'sw-acc-3', x: 500, y: 440, type: 'switch', label: 'SW-ACCESS-04' },
  { id: 'n-sw-acc-4', deviceId: 'sw-acc-4', x: 640, y: 440, type: 'switch', label: 'SW-ACCESS-05' },
  { id: 'n-sw-acc-5', deviceId: 'sw-acc-5', x: 780, y: 440, type: 'switch', label: 'SW-ACCESS-06' },
  { id: 'n-ap-0', deviceId: 'ap-0', x: 80, y: 560, type: 'ap', label: 'AP-LOBBY-01' },
  { id: 'n-ap-1', deviceId: 'ap-1', x: 220, y: 560, type: 'ap', label: 'AP-FLOOR1-01' },
  { id: 'n-ap-2', deviceId: 'ap-2', x: 500, y: 560, type: 'ap', label: 'AP-FLOOR2-01' },
  { id: 'n-ap-3', deviceId: 'ap-3', x: 640, y: 560, type: 'ap', label: 'AP-FLOOR3-01' },
];

export const generateTopologyLinks = (): TopologyLink[] => [
  { id: 'l1', source: 'n-rtr-0', target: 'n-sw-core-0', utilization: 45, bandwidth: '10 Gbps', status: 'up' },
  { id: 'l2', source: 'n-rtr-0', target: 'n-sw-core-1', utilization: 38, bandwidth: '10 Gbps', status: 'up' },
  { id: 'l3', source: 'n-rtr-1', target: 'n-sw-core-0', utilization: 42, bandwidth: '10 Gbps', status: 'up' },
  { id: 'l4', source: 'n-rtr-1', target: 'n-sw-core-1', utilization: 55, bandwidth: '10 Gbps', status: 'up' },
  { id: 'l5', source: 'n-sw-core-0', target: 'n-sw-dist-0', utilization: 62, bandwidth: '10 Gbps', status: 'up' },
  { id: 'l6', source: 'n-sw-core-0', target: 'n-sw-dist-1', utilization: 35, bandwidth: '10 Gbps', status: 'up' },
  { id: 'l7', source: 'n-sw-core-1', target: 'n-sw-dist-2', utilization: 71, bandwidth: '10 Gbps', status: 'up' },
  { id: 'l8', source: 'n-sw-core-1', target: 'n-sw-dist-3', utilization: 28, bandwidth: '10 Gbps', status: 'up' },
  { id: 'l9', source: 'n-sw-core-1', target: 'n-wlc-0', utilization: 40, bandwidth: '10 Gbps', status: 'up' },
  { id: 'l10', source: 'n-sw-dist-0', target: 'n-sw-acc-0', utilization: 55, bandwidth: '1 Gbps', status: 'up' },
  { id: 'l11', source: 'n-sw-dist-0', target: 'n-sw-acc-1', utilization: 30, bandwidth: '1 Gbps', status: 'up' },
  { id: 'l12', source: 'n-sw-dist-1', target: 'n-sw-acc-2', utilization: 88, bandwidth: '1 Gbps', status: 'up' },
  { id: 'l13', source: 'n-sw-dist-2', target: 'n-sw-acc-3', utilization: 45, bandwidth: '1 Gbps', status: 'up' },
  { id: 'l14', source: 'n-sw-dist-2', target: 'n-sw-acc-4', utilization: 92, bandwidth: '1 Gbps', status: 'down' },
  { id: 'l15', source: 'n-sw-dist-3', target: 'n-sw-acc-5', utilization: 22, bandwidth: '1 Gbps', status: 'up' },
  { id: 'l16', source: 'n-sw-acc-0', target: 'n-ap-0', utilization: 15, bandwidth: '1 Gbps', status: 'up' },
  { id: 'l17', source: 'n-sw-acc-1', target: 'n-ap-1', utilization: 25, bandwidth: '1 Gbps', status: 'up' },
  { id: 'l18', source: 'n-sw-acc-3', target: 'n-ap-2', utilization: 35, bandwidth: '1 Gbps', status: 'up' },
  { id: 'l19', source: 'n-sw-acc-4', target: 'n-ap-3', utilization: 0, bandwidth: '1 Gbps', status: 'down' },
];

export const generateIssues = (): Issue[] => [
  { id: 'iss-1', title: 'High CPU utilization detected', severity: 'P1', category: 'Device Health',
    deviceCount: 2, devices: ['SW-CORE-01', 'SW-DIST-03'], timestamp: new Date(Date.now() - 1200000).toISOString(),
    status: 'active', rootCause: 'BGP route calculation causing sustained CPU spikes above 90%',
    suggestedAction: 'Review BGP neighbor configurations and consider route summarization' },
  { id: 'iss-2', title: 'Interface down on access switch', severity: 'P1', category: 'Connectivity',
    deviceCount: 1, devices: ['SW-ACCESS-05'], timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'active', rootCause: 'Physical link failure detected on GigabitEthernet0/0/4',
    suggestedAction: 'Check physical cabling and SFP module on affected interface' },
  { id: 'iss-3', title: 'Wireless client authentication failures', severity: 'P2', category: 'Onboarding',
    deviceCount: 3, devices: ['AP-FLOOR1-01', 'AP-FLOOR2-01', 'AP-LOBBY-01'], timestamp: new Date(Date.now() - 7200000).toISOString(),
    status: 'active', rootCause: 'RADIUS server intermittent timeouts causing 802.1X failures',
    suggestedAction: 'Verify RADIUS server reachability and check AAA configuration' },
  { id: 'iss-4', title: 'Software version mismatch', severity: 'P3', category: 'Compliance',
    deviceCount: 8, devices: ['SW-ACCESS-03', 'SW-ACCESS-07', 'SW-ACCESS-11', 'SW-ACCESS-15', 'SW-ACCESS-19', 'SW-ACCESS-22', 'SW-ACCESS-08', 'SW-ACCESS-14'],
    timestamp: new Date(Date.now() - 14400000).toISOString(), status: 'active',
    rootCause: 'Multiple access switches running outdated IOS-XE 17.3.5',
    suggestedAction: 'Schedule maintenance window to upgrade to approved IOS-XE 17.6.4' },
  { id: 'iss-5', title: 'AP coverage hole detected', severity: 'P2', category: 'Wireless',
    deviceCount: 1, devices: ['AP-CONF-01'], timestamp: new Date(Date.now() - 10800000).toISOString(),
    status: 'active', rootCause: 'Coverage gap in conference room area due to AP power reduction',
    suggestedAction: 'Adjust AP transmit power level or add additional AP for coverage' },
  { id: 'iss-6', title: 'Memory utilization warning', severity: 'P3', category: 'Device Health',
    deviceCount: 1, devices: ['WLC-01'], timestamp: new Date(Date.now() - 18000000).toISOString(),
    status: 'active', rootCause: 'WLC memory usage at 82% due to high client count',
    suggestedAction: 'Monitor client load and consider load balancing across WLCs' },
  { id: 'iss-7', title: 'Spanning tree topology change', severity: 'P4', category: 'Network',
    deviceCount: 2, devices: ['SW-DIST-01', 'SW-DIST-02'], timestamp: new Date(Date.now() - 21600000).toISOString(),
    status: 'active', rootCause: 'STP topology change notification triggered by port flapping',
    suggestedAction: 'Investigate flapping port and consider enabling BPDU Guard' },
  { id: 'iss-8', title: 'DHCP scope exhaustion warning', severity: 'P2', category: 'IP Services',
    deviceCount: 1, devices: ['CORE-RTR-01'], timestamp: new Date(Date.now() - 25200000).toISOString(),
    status: 'active', rootCause: 'VLAN 100 DHCP pool at 92% utilization',
    suggestedAction: 'Expand DHCP scope or reduce lease time for VLAN 100' },
  { id: 'iss-9', title: 'NTP synchronization failure', severity: 'P4', category: 'System',
    deviceCount: 4, devices: ['SW-ACCESS-06', 'SW-ACCESS-12', 'SW-ACCESS-18', 'SW-ACCESS-24'],
    timestamp: new Date(Date.now() - 28800000).toISOString(), status: 'active',
    rootCause: 'NTP server unreachable from access layer due to ACL misconfiguration',
    suggestedAction: 'Update access control list to permit NTP traffic from access VLANs' },
  { id: 'iss-10', title: 'Power supply redundancy lost', severity: 'P3', category: 'Hardware',
    deviceCount: 1, devices: ['SW-CORE-02'], timestamp: new Date(Date.now() - 36000000).toISOString(),
    status: 'active', rootCause: 'Secondary power supply unit failure detected',
    suggestedAction: 'Replace failed PSU and verify power redundancy is restored' },
];

export const generateHealthTrend = () => {
  const data = [];
  const now = Date.now();
  for (let i = 24; i >= 0; i--) {
    const time = new Date(now - i * 3600000);
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      network: Math.floor(75 + Math.random() * 20),
      client: Math.floor(70 + Math.random() * 25),
      ap: Math.floor(80 + Math.random() * 18),
    });
  }
  return data;
};

export const getSiteHealth = () => [
  { name: 'San Jose / Building-1', healthy: 28, warning: 3, critical: 1, total: 32 },
  { name: 'San Jose / Building-2', healthy: 12, warning: 1, critical: 0, total: 13 },
  { name: 'New York / HQ', healthy: 8, warning: 2, critical: 0, total: 10 },
  { name: 'London / Office-1', healthy: 6, warning: 0, critical: 1, total: 7 },
  { name: 'Austin / DC-1', healthy: 4, warning: 1, critical: 0, total: 5 },
];

export const getClientHealth = () => ({
  total: 1247,
  wired: 423,
  wireless: 824,
  healthy: 1138,
  warning: 78,
  critical: 31,
  bySSID: [
    { ssid: 'Corp-WiFi', clients: 512, healthy: 485 },
    { ssid: 'Guest-WiFi', clients: 198, healthy: 172 },
    { ssid: 'IoT-Network', clients: 114, healthy: 105 },
  ],
});
