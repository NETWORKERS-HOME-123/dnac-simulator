

# Simulation Labs — 20 Interactive Hands-On Labs (Basic to Advanced)

## Concept
A new `/labs` page accessible from the hamburger menu and dashboard. Each lab is a **guided, interactive simulation** where the student performs real actions inside the existing Cisco Catalyst Center UI (clicking, configuring, troubleshooting) with step-by-step task tracking, validation, hints, and a completion score. No passive reading — every lab requires the student to DO something.

## The 20 Labs (Basic → Advanced)

### Beginner (1-7)
1. **Login & Navigate the Dashboard** — Log in with credentials, identify health score, find P1 issue count, navigate to Assurance via the dashboard card
2. **Explore the Hamburger Menu** — Open the menu, expand Provision, navigate to Inventory, then to Topology, then back to Home
3. **Read Device Inventory** — Go to Inventory, find a specific device by hostname using search, identify its IP address, software version, and site
4. **Filter Inventory by Device Type** — Filter to show only Access Points, count them, then filter to show only routers
5. **Check Device Health Scores** — Sort inventory by health score, identify the lowest-health device, open its detail sheet, find the interface that is down
6. **Explore the Network Topology** — Open topology, identify the core routers, click a distribution switch, read its detail panel info
7. **Identify Link Utilization Issues** — On topology, find the link with highest utilization (red), identify the two connected devices, note the bandwidth

### Intermediate (8-14)
8. **Triage Critical Issues** — Go to Assurance > Issues & Events, filter P1 issues, read root cause for each, identify which devices are affected
9. **Analyze Network Health Trends** — On Assurance Health tab, read the 24h trend chart, identify the time period with lowest network health, compare client vs network health
10. **Device Compliance Audit** — In Inventory, filter for Non-Compliant devices, list all non-compliant hostnames, identify the common software version causing non-compliance
11. **Troubleshoot an Unreachable Device** — Find all devices with "Unreachable" reachability status, check their site location, cross-reference with topology to find upstream switch
12. **Wireless Client Health Analysis** — Navigate to Assurance, review client health donut, identify wired vs wireless health percentage, find the SSID with most issues
13. **Site-Level Health Comparison** — From Dashboard network snapshot, navigate to Assurance, compare health across sites, identify the worst-performing site
14. **Software Version Audit** — In Inventory, identify all unique software versions running, find devices running the oldest version, count how many need upgrade

### Advanced (15-20)
15. **Root Cause Analysis Workflow** — Given a P1 issue, trace through: read root cause → find affected devices in inventory → locate on topology → check link status → recommend fix
16. **Network Capacity Planning** — Analyze topology link utilizations, identify bottleneck links (>80%), check connected device health, propose which links need bandwidth upgrade
17. **Full Incident Response** — Simulated scenario: AP goes down → find it in issues → locate in topology → check upstream switch health → check WLC status → document findings
18. **Multi-Site Health Assessment** — Compare all sites: device counts, health scores, compliance status, reachability — produce a site ranking by overall health
19. **Change Impact Analysis** — Given a planned maintenance on SW-CORE-01: identify all downstream devices on topology, check their health, list affected access switches and APs, assess blast radius
20. **End-to-End Network Audit** — Complete audit: check all P1/P2 issues, verify device compliance across sites, identify unreachable devices, check topology for down links, summarize findings

## Technical Implementation

### New Files
| File | Purpose |
|------|---------|
| `src/pages/Labs.tsx` | Main labs listing page with 20 lab cards, difficulty badges, completion tracking |
| `src/components/labs/LabRunner.tsx` | Lab execution engine — shows current step, validates actions, tracks progress |
| `src/components/labs/LabStep.tsx` | Individual step component with instruction, hint toggle, validation status |
| `src/data/labDefinitions.ts` | All 20 lab definitions: steps, validation criteria, hints, expected answers |

### Lab Runner Mechanics
- Each lab has 3-8 steps with clear instructions (e.g., "Navigate to Provision > Inventory")
- Steps use **action types**: `navigate` (go to a page), `find` (locate specific data and enter answer), `click` (interact with UI element), `answer` (multiple choice or free text answer about what they observed)
- **Validation**: text input checked against expected answers (case-insensitive, fuzzy match), navigation steps validated by checking current context
- **Hints**: each step has a toggleable hint (costs points)
- **Completion**: percentage score based on steps completed and hints used
- **Progress persistence**: saved in localStorage per lab

### Modified Files
| File | Change |
|------|--------|
| `src/App.tsx` | Add `/labs` and `/labs/:labId` routes |
| `src/components/layout/HamburgerMenu.tsx` | Add "Simulation Labs" menu item under a new top-level entry |
| `src/pages/Dashboard.tsx` | Add a "Training Labs" quick-access card in the Network Snapshot section |

### Lab Page UI
- Grid of 20 lab cards, each showing: lab number, title, difficulty badge (Beginner/Intermediate/Advanced with green/yellow/red), estimated time (5-20 min), completion status (checkmark or progress bar)
- Click a lab → opens LabRunner with step-by-step panel on the right side (or bottom on mobile)
- Lab runner shows: current step instruction, text input or multiple-choice for answers, "Check Answer" button, hint toggle, next/previous step, progress bar
- The student interacts with the real simulation pages — the lab runner acts as an overlay/sidebar guide

### Lab Definition Structure
```text
Lab {
  id, title, difficulty, estimatedMinutes, description,
  steps: [
    {
      instruction: string,        // "Navigate to Provision > Inventory"
      type: 'navigate' | 'find' | 'answer' | 'action',
      hint: string,               // "Use the hamburger menu..."
      validation: {
        type: 'exact' | 'contains' | 'choice' | 'navigation',
        answer?: string,          // expected answer
        choices?: string[],       // for multiple choice
        route?: string,           // for navigation validation
      }
    }
  ]
}
```

