
# Cisco Catalyst Center (DNA Center) — Interactive Frontend Simulation

A faithful recreation of the Cisco Catalyst Center UI for training and demo purposes, with mock data, interactive navigation, and simulated workflows.

## Design Direction
- **Dark sidebar** with Cisco-style teal/blue branding (#049fd9 primary, #1a2332 sidebar bg, #f5f5f5 content bg)
- **Top header bar** with global search, notifications bell, and user profile
- **Left sidebar** with collapsible navigation matching DNAC's menu structure
- Clean dashboard cards with health score donuts, charts, and data tables

## Pages & Features

### 1. Dashboard / Overview (Home)
- **Network Health Summary** — donut charts showing overall health scores (Healthy / Warning / Critical devices)
- **Site Health** panel with site hierarchy and health percentages
- **Client Health** summary — wired vs wireless client counts and health
- **Issue Summary** cards — P1/P2/P3/P4 issues with counts
- **Quick Links** tiles for common tasks
- All data is realistic mock data with randomized but plausible values

### 2. Network Topology Map
- **Interactive SVG/Canvas topology** showing routers, switches, APs, and WLCs as device icons
- **Drag-to-reposition** devices on the canvas
- **Click a device** to open a detail side-panel (hostname, IP, model, status, uptime, OS version)
- **Connection lines** between devices with link utilization color coding (green/yellow/red)
- **Zoom & pan** controls
- **Filter by device type** toolbar (routers, switches, APs)
- Simulated with ~15-20 mock devices in a realistic campus topology

### 3. Device Inventory
- **Sortable/filterable data table** with columns: Hostname, IP Address, Platform, Software Version, Role, Uptime, Reachability, Health Score
- **Search bar** to filter devices
- **Device type tabs** (All, Routers, Switches, APs, WLCs)
- **Click a row** to open device detail page with:
  - Device info summary
  - Interface table (name, status, speed, VLAN)
  - Health timeline chart
- **Bulk actions** toolbar (assign to site, tag, export)
- 50+ realistic mock device entries

### 4. Assurance / Health
- **Network Health dashboard** with health score trend line chart (24h)
- **Top 10 Issues** list with severity, category, and affected devices
- **Client Health** — donut chart of healthy vs unhealthy clients, breakdown by SSID/VLAN
- **AP Health** panel with coverage and performance metrics
- **Issue detail drawer** — click any issue to see root cause analysis, suggested actions, and affected devices
- Timeframe selector (last 3h / 24h / 7d)

### 5. Global Navigation & Layout
- **Collapsible left sidebar** with icons: Dashboard, Topology, Inventory, Assurance, Design, Policy, Platform
- **Top bar** with Cisco Catalyst Center logo, global search, notification badge, and user avatar
- **Breadcrumb navigation** on each page
- **Responsive** — works on desktop and tablet viewports

### 6. Interactive Demo Features
- Mock data refreshes with slight randomization on page load to simulate a live system
- Toast notifications for simulated events ("New critical issue detected on SW-CORE-01")
- Loading skeletons on page transitions for realism
