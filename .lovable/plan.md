

# Cisco Catalyst Center — Accuracy Overhaul Plan

## Research Findings (Sources: Cisco Live BRKOPS-2464 PDF, Cisco User Guide 2.3.7.x, Official Documentation)

### Critical Inaccuracies Found

**1. Navigation Structure is Wrong**
The real Catalyst Center uses a **hamburger menu** (top-left icon), NOT a persistent left sidebar. The menu opens as an overlay/flyout with these top-level items (from Cisco Live PDF slide "System 360"):
- Design
- Policy
- Provision
- Assurance
- Workflows
- Tools
- Platform
- Activities
- Reports
- System (with sub-items: System 360, Settings, Data Platform, Users & Roles, Backup & Restore, Software Management, Disaster Recovery)
- Explore

Our current sidebar shows only 4 items (Dashboard, Topology, Inventory, Assurance) as a permanent left rail, which is not how the real product works.

**2. Home Page Structure is Wrong**
The real home page has two sections per official docs:
- **Assurance Summary**: Health score (overall enterprise including network devices, wired clients, wireless clients), Critical Issues (P1/P2 counts with "View Details"), Trends and Insights
- **Network Snapshot**: Sites count, Network Devices count (with unclaimed/unprovisioned/unreachable), Network Profiles, Application Policies, Import Images/SMUs, Software Image Updates, Licensed Devices, EoX Status, Field Notices, AI Endpoint Analytics

Our current dashboard is a generic health dashboard, not matching this structure.

**3. Inventory is Under Provision, Not a Top-Level Item**
In the real product, device inventory is accessed via **Provision > Inventory**, not as a separate top-level page. The inventory table columns include: Device Name, IP Address, Device Family, Device Role, Site, Reachability, Manageability (Managed/Unmanaged), Software Version, Health, Compliance, Last Sync Status.

**4. Topology is Under Provision, Not Top-Level**
Network Topology is accessed via **Provision > Topology** or the main topology view.

**5. Header Bar Details**
The real header has (right side): Search icon, Favorites (star), Help (?), Software Updates, Notifications (bell), and User avatar. The Cisco logo + "Catalyst Center" branding is on the left side of the header bar.

**6. Assurance Sub-Navigation**
Assurance has its own sub-tabs: **Health** (with Network/Client/Application sub-views), **Issues & Events**, **AI-Driven**, **Manage** (Sensors, etc.)

---

## Implementation Plan

### Step 1: Fix Navigation to Hamburger Menu
- Remove the persistent left sidebar (`CiscoSidebar.tsx`)
- Redesign header to include:
  - Left: Hamburger menu icon (three lines), then Cisco Catalyst Center logo/text
  - Right: Search, Favorites (star), Help (?), Notifications bell with badge, User avatar
- Create a `HamburgerMenu` overlay component with the full menu tree:
  - Design > Network Hierarchy, Network Settings, Network Profiles, Image Repository, Feature Templates
  - Policy > Group-Based Access Control, IP/URL Access Control, Application Policies, Traffic Copy
  - Provision > Inventory, Topology (these replace current top-level pages)
  - Assurance > Health (Network/Client/Application), Issues & Events
  - Workflows, Tools, Platform, Activities, Reports
  - System > System 360, Settings, Users & Roles, Backup & Restore, Software Management
  - Most items show "Coming Soon" placeholders; Inventory, Topology, Assurance, and Home are functional

### Step 2: Rebuild Home Page to Match Real Structure
- **Top section**: "Assurance Summary" card row:
  - Health: overall enterprise health score with percentage, "View Details" link to Assurance
  - Critical Issues: P1 count and P2 count, "View Details" link
  - Trends and Insights: brief insight text, "View Details" link
- **Bottom section**: "Network Snapshot" — a grid of summary tiles:
  - Sites: count + DNS/NTP server counts, "Add Sites" link
  - Network Devices: total count + unclaimed/unprovisioned/unreachable, "Find New Devices" link
  - Network Profiles: count, "Manage Profiles" link
  - Application Policies: count + successful/errored deployments
  - Import Images/SMUs: image count + untagged/unverified
  - Licensed Devices: count by type (switches, routers, wireless)
  - EoX Status: devices scanned + alerts
  - All using realistic mock data

### Step 3: Fix Inventory Table Columns and Location
- Route changes to `/provision/inventory`
- Update columns to match real product: Device Name, IP Address, Device Family (not Platform), Device Role, Site, Reachability (with Reachable/Ping Reachable/Unreachable states per docs), Manageability (Managed/Unmanaged), Software Version, Health, Compliance, Last Sync Status
- Add "Focus" selector at top (Inventory / Provision view toggle, matching real UI)
- Add Actions dropdown menu (Resync, Delete, Edit Device, etc.)

### Step 4: Fix Topology Location
- Route changes to `/provision/topology`
- Add site hierarchy selector (left panel tree: Global > Areas > Buildings)

### Step 5: Fix Assurance Page Structure
- Add sub-tabs matching real product: **Health** (default), **Issues & Events**, **Manage**
- Health tab has its own sub-views: Overall, Network, Client, Application
- Network Health view: device health timeline chart, top/bottom N healthy devices, device category breakdown
- Client Health view: wired vs wireless health, SSID breakdown, onboarding stats
- Issues & Events tab: filterable issue list with severity, timestamp, category, status (Open/Resolved)

### Step 6: Update Mock Data for Accuracy
- Add `managementState: 'Managed' | 'Unmanaged'` to device type
- Add `compliance: 'Compliant' | 'Non-Compliant'` field
- Add `lastSyncStatus: 'Success' | 'Failed' | 'In Progress'`
- Add `deviceFamily` field (Cisco Catalyst 9000 Series, Cisco ASR 1000 Series, etc.)
- Update reachability to include `'Ping Reachable'` as a third state
- Add site/network snapshot mock data (site count, profile count, etc.)

### Step 7: Visual Polish for Accuracy
- Header: dark background (#1b2a32 or similar), Cisco bridge logo SVG on the left
- Hamburger menu: dark overlay panel matching Cisco's slide-out menu style
- Content area: light gray background (#f5f5f5)
- Typography: use system fonts that match Cisco's CiscoSans look (Inter or similar)
- Health scores displayed as percentage (0-100%) not 1-10 scale (the real product uses percentage)

---

## Technical Details

### File Changes Summary
| File | Action |
|------|--------|
| `CiscoSidebar.tsx` | Remove or repurpose as hamburger menu overlay |
| `CiscoHeader.tsx` | Rebuild with hamburger icon, Cisco logo, correct right-side icons |
| `CiscoLayout.tsx` | Remove sidebar layout, use full-width with header only |
| `HamburgerMenu.tsx` | New component — slide-out menu with full navigation tree |
| `Dashboard.tsx` | Rebuild as Assurance Summary + Network Snapshot |
| `Inventory.tsx` | Update columns, route to `/provision/inventory` |
| `Topology.tsx` | Route to `/provision/topology`, add site hierarchy |
| `Assurance.tsx` | Add sub-tabs (Health/Issues & Events/Manage), sub-views |
| `mockData.ts` | Add missing fields (managementState, compliance, deviceFamily, etc.), health as 0-100% |
| `App.tsx` | Update routes for new structure |

### Estimated Scope
- 10 files modified/created
- Navigation completely restructured
- Home page rebuilt
- All data fields corrected for training accuracy

