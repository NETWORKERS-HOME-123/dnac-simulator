export type StepType = 'navigate' | 'find' | 'answer' | 'action';
export type ValidationType = 'exact' | 'contains' | 'choice' | 'navigation';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface LabStepValidation {
  type: ValidationType;
  answer?: string;
  choices?: string[];
  route?: string;
  acceptAny?: string[]; // multiple acceptable answers
}

export interface LabStepDef {
  instruction: string;
  type: StepType;
  hint: string;
  validation: LabStepValidation;
}

export interface LabDefinition {
  id: string;
  number: number;
  title: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  description: string;
  steps: LabStepDef[];
}

export const labDefinitions: LabDefinition[] = [
  // ===== BEGINNER (1-7) =====
  {
    id: 'lab-01',
    number: 1,
    title: 'Login & Navigate the Dashboard',
    difficulty: 'Beginner',
    estimatedMinutes: 5,
    description: 'Log in with credentials, identify health score, find P1 issue count, and navigate to Assurance.',
    steps: [
      {
        instruction: 'Navigate to the Login page at /login.',
        type: 'navigate',
        hint: 'Type /login in the address bar or log out first.',
        validation: { type: 'navigation', route: '/login' },
      },
      {
        instruction: 'Log in using the default credentials (admin / admin).',
        type: 'action',
        hint: 'The credentials are shown on the login page: username "admin", password "admin".',
        validation: { type: 'navigation', route: '/' },
      },
      {
        instruction: 'What is the overall Enterprise Health percentage shown on the Dashboard? (Enter just the number)',
        type: 'find',
        hint: 'Look at the Assurance Summary section at the top — the Health card shows a large percentage.',
        validation: { type: 'contains', answer: '%', acceptAny: ['70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85'] },
      },
      {
        instruction: 'How many P1 (Critical) issues are shown on the Dashboard?',
        type: 'find',
        hint: 'Check the Critical Issues card in the Assurance Summary row.',
        validation: { type: 'contains', acceptAny: ['1', '2', '3', '4', '5'] },
      },
      {
        instruction: 'Click "View Details" on the Health card to navigate to Assurance.',
        type: 'navigate',
        hint: 'Click the "View Details" link on the Health card in Assurance Summary.',
        validation: { type: 'navigation', route: '/assurance' },
      },
    ],
  },
  {
    id: 'lab-02',
    number: 2,
    title: 'Explore the Hamburger Menu',
    difficulty: 'Beginner',
    estimatedMinutes: 5,
    description: 'Open the hamburger menu, expand sections, and navigate to Inventory, Topology, and Home.',
    steps: [
      {
        instruction: 'Open the hamburger menu by clicking the ☰ icon in the top-left of the header.',
        type: 'action',
        hint: 'The three-line icon is on the far left of the dark header bar.',
        validation: { type: 'choice', choices: ['Done'] },
      },
      {
        instruction: 'Expand the "Provision" section in the hamburger menu. What sub-items do you see? (List them comma-separated)',
        type: 'answer',
        hint: 'Click Provision to expand it — it has items like Inventory, Topology, etc.',
        validation: { type: 'contains', answer: 'inventory' },
      },
      {
        instruction: 'Navigate to Provision > Inventory using the hamburger menu.',
        type: 'navigate',
        hint: 'Click "Inventory" under the Provision section.',
        validation: { type: 'navigation', route: '/provision/inventory' },
      },
      {
        instruction: 'Now navigate to Provision > Topology.',
        type: 'navigate',
        hint: 'Open the hamburger menu again, expand Provision, click Topology.',
        validation: { type: 'navigation', route: '/provision/topology' },
      },
      {
        instruction: 'Navigate back to the Home/Dashboard page.',
        type: 'navigate',
        hint: 'Click "Home" at the top of the hamburger menu, or click the Cisco logo.',
        validation: { type: 'navigation', route: '/' },
      },
    ],
  },
  {
    id: 'lab-03',
    number: 3,
    title: 'Read Device Inventory',
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    description: 'Navigate to Inventory, find a specific device, and identify its key attributes.',
    steps: [
      {
        instruction: 'Navigate to Provision > Inventory.',
        type: 'navigate',
        hint: 'Use the hamburger menu → Provision → Inventory.',
        validation: { type: 'navigation', route: '/provision/inventory' },
      },
      {
        instruction: 'Find the device with hostname "SW-CORE-01" in the inventory table. What is its IP address?',
        type: 'find',
        hint: 'Use the search bar to type "SW-CORE-01" and look at the IP Address column.',
        validation: { type: 'exact', answer: '10.10.1.1' },
      },
      {
        instruction: 'What is the Software Version running on SW-CORE-01?',
        type: 'find',
        hint: 'Look at the Software Version column for SW-CORE-01.',
        validation: { type: 'contains', answer: '17.9' },
      },
      {
        instruction: 'What Site is SW-CORE-01 assigned to?',
        type: 'find',
        hint: 'Check the Site column in the inventory table.',
        validation: { type: 'contains', answer: 'Global/San Jose/Building 1' },
      },
      {
        instruction: 'What is the Device Family of SW-CORE-01?',
        type: 'find',
        hint: 'Check the Device Family column.',
        validation: { type: 'contains', answer: 'Catalyst 9500' },
      },
    ],
  },
  {
    id: 'lab-04',
    number: 4,
    title: 'Filter Inventory by Device Type',
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    description: 'Use inventory filters to isolate device types and count them.',
    steps: [
      {
        instruction: 'Navigate to Provision > Inventory.',
        type: 'navigate',
        hint: 'Use the hamburger menu → Provision → Inventory.',
        validation: { type: 'navigation', route: '/provision/inventory' },
      },
      {
        instruction: 'How many total devices are shown in the inventory before filtering?',
        type: 'find',
        hint: 'Count the rows in the table or look for a total count indicator.',
        validation: { type: 'contains', acceptAny: ['12', '13', '14', '15'] },
      },
      {
        instruction: 'Filter the inventory to show only Access Points (APs). How many APs are there?',
        type: 'find',
        hint: 'Use the device type filter or search for "AP" in the search bar.',
        validation: { type: 'contains', acceptAny: ['3', '4', '5'] },
      },
      {
        instruction: 'Now filter to show only Routers. How many routers are listed?',
        type: 'find',
        hint: 'Change the filter to "router" type.',
        validation: { type: 'contains', acceptAny: ['2', '3'] },
      },
      {
        instruction: 'Clear all filters. Which device type has the most devices?',
        type: 'answer',
        hint: 'Count each type — switches, routers, APs, WLCs.',
        validation: { type: 'contains', answer: 'switch' },
      },
    ],
  },
  {
    id: 'lab-05',
    number: 5,
    title: 'Check Device Health Scores',
    difficulty: 'Beginner',
    estimatedMinutes: 10,
    description: 'Sort inventory by health, identify the unhealthiest device, and inspect its interfaces.',
    steps: [
      {
        instruction: 'Navigate to Provision > Inventory.',
        type: 'navigate',
        hint: 'Use the hamburger menu → Provision → Inventory.',
        validation: { type: 'navigation', route: '/provision/inventory' },
      },
      {
        instruction: 'Sort the inventory table by Health score (ascending). Which device has the lowest health score?',
        type: 'find',
        hint: 'Click the Health column header to sort. The device at the top has the lowest score.',
        validation: { type: 'contains', acceptAny: ['SW-ACCESS', 'AP-', 'RTR-'] },
      },
      {
        instruction: 'What is the health score of that device? (Enter the number)',
        type: 'find',
        hint: 'Read the Health column value for the lowest-health device.',
        validation: { type: 'contains', acceptAny: ['25', '30', '35', '40', '42', '45', '48', '50', '55'] },
      },
      {
        instruction: 'Click on that device row to open its detail panel. How many interfaces does it have?',
        type: 'find',
        hint: 'Click the device row — a side panel shows device details including interfaces.',
        validation: { type: 'contains', acceptAny: ['2', '3', '4', '5', '6', '8', '10', '12', '24', '48'] },
      },
      {
        instruction: 'Is there any interface in "down" status on this device?',
        type: 'answer',
        hint: 'Check the interface list in the detail panel for status indicators.',
        validation: { type: 'choice', choices: ['Yes', 'No'] },
      },
    ],
  },
  {
    id: 'lab-06',
    number: 6,
    title: 'Explore the Network Topology',
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    description: 'Open the topology view, identify core routers, and inspect a distribution switch.',
    steps: [
      {
        instruction: 'Navigate to Provision > Topology.',
        type: 'navigate',
        hint: 'Use the hamburger menu → Provision → Topology.',
        validation: { type: 'navigation', route: '/provision/topology' },
      },
      {
        instruction: 'How many CORE devices do you see on the topology map?',
        type: 'find',
        hint: 'Look for devices labeled with "CORE" in their hostname or with the CORE role badge.',
        validation: { type: 'contains', acceptAny: ['1', '2'] },
      },
      {
        instruction: 'Click on a distribution switch (SW-DIST-*) on the topology. What is its role?',
        type: 'find',
        hint: 'Click a node labeled SW-DIST — the detail panel shows its role.',
        validation: { type: 'exact', answer: 'DISTRIBUTION' },
      },
      {
        instruction: 'What is the IP address of the distribution switch you clicked?',
        type: 'find',
        hint: 'Check the detail panel that appeared when you clicked the device.',
        validation: { type: 'contains', answer: '10.10.' },
      },
    ],
  },
  {
    id: 'lab-07',
    number: 7,
    title: 'Identify Link Utilization Issues',
    difficulty: 'Beginner',
    estimatedMinutes: 10,
    description: 'Find the highest-utilization link on topology and identify the connected devices.',
    steps: [
      {
        instruction: 'Navigate to Provision > Topology.',
        type: 'navigate',
        hint: 'Use the hamburger menu → Provision → Topology.',
        validation: { type: 'navigation', route: '/provision/topology' },
      },
      {
        instruction: 'Which link color indicates the highest utilization? (Enter the color)',
        type: 'answer',
        hint: 'Links are colored green (low), yellow (medium), red (high utilization).',
        validation: { type: 'exact', answer: 'red' },
      },
      {
        instruction: 'Find a link with high utilization (red or orange). What two devices does it connect? (Format: Device1 - Device2)',
        type: 'find',
        hint: 'Click on a red/orange colored link — it shows the two endpoint devices.',
        validation: { type: 'contains', answer: 'SW-' },
      },
      {
        instruction: 'What is the bandwidth/speed of that link?',
        type: 'find',
        hint: 'The link detail shows bandwidth (e.g., 10 Gbps, 1 Gbps).',
        validation: { type: 'contains', answer: 'Gbps' },
      },
    ],
  },

  // ===== INTERMEDIATE (8-14) =====
  {
    id: 'lab-08',
    number: 8,
    title: 'Triage Critical Issues',
    difficulty: 'Intermediate',
    estimatedMinutes: 12,
    description: 'Navigate to Assurance Issues & Events, filter P1 issues, and identify affected devices.',
    steps: [
      {
        instruction: 'Navigate to Assurance.',
        type: 'navigate',
        hint: 'Use the hamburger menu → Assurance → Health.',
        validation: { type: 'navigation', route: '/assurance' },
      },
      {
        instruction: 'Switch to the "Issues & Events" tab.',
        type: 'action',
        hint: 'Click the "Issues & Events" tab at the top of the Assurance page.',
        validation: { type: 'choice', choices: ['Done'] },
      },
      {
        instruction: 'How many P1 (Critical) issues are listed?',
        type: 'find',
        hint: 'Filter or look at the severity column — count rows with P1.',
        validation: { type: 'contains', acceptAny: ['1', '2', '3', '4', '5'] },
      },
      {
        instruction: 'Pick any P1 issue. What device is it affecting? (Enter the hostname)',
        type: 'find',
        hint: 'Check the "Device" column for a P1 issue.',
        validation: { type: 'contains', acceptAny: ['SW-', 'RTR-', 'AP-', 'WLC-'] },
      },
      {
        instruction: 'What is the root cause or description of that P1 issue?',
        type: 'find',
        hint: 'Read the Description or Root Cause column for the issue you selected.',
        validation: { type: 'contains', acceptAny: ['interface', 'link', 'down', 'unreachable', 'high', 'cpu', 'memory', 'failure'] },
      },
      {
        instruction: 'Is that issue currently Open or Resolved?',
        type: 'answer',
        hint: 'Check the Status column.',
        validation: { type: 'choice', choices: ['Open', 'Resolved'] },
      },
    ],
  },
  {
    id: 'lab-09',
    number: 9,
    title: 'Analyze Network Health Trends',
    difficulty: 'Intermediate',
    estimatedMinutes: 12,
    description: 'Review Assurance health trends, identify low-health periods, and compare metrics.',
    steps: [
      {
        instruction: 'Navigate to Assurance Health tab.',
        type: 'navigate',
        hint: 'Go to Assurance — the Health tab is the default view.',
        validation: { type: 'navigation', route: '/assurance' },
      },
      {
        instruction: 'Look at the Network Health section. What is the current overall Network Health percentage?',
        type: 'find',
        hint: 'The health donut or large number shows the current network health percentage.',
        validation: { type: 'contains', acceptAny: ['70', '75', '78', '80', '82', '85', '88', '90'] },
      },
      {
        instruction: 'What percentage of network devices are in "healthy" status?',
        type: 'find',
        hint: 'Look for the breakdown of healthy vs warning vs critical devices.',
        validation: { type: 'contains', answer: '%' },
      },
      {
        instruction: 'Switch to the Client Health sub-view. What is the Wireless Client health percentage?',
        type: 'find',
        hint: 'Click the Client tab and look at the wireless health section.',
        validation: { type: 'contains', acceptAny: ['60', '65', '70', '72', '75', '78', '80', '85'] },
      },
      {
        instruction: 'Is Network health higher or lower than Client health?',
        type: 'answer',
        hint: 'Compare the two percentages you just found.',
        validation: { type: 'choice', choices: ['Higher', 'Lower', 'About the same'] },
      },
    ],
  },
  {
    id: 'lab-10',
    number: 10,
    title: 'Device Compliance Audit',
    difficulty: 'Intermediate',
    estimatedMinutes: 12,
    description: 'Filter for non-compliant devices, identify hostnames and the common software version.',
    steps: [
      {
        instruction: 'Navigate to Provision > Inventory.',
        type: 'navigate',
        hint: 'Use the hamburger menu → Provision → Inventory.',
        validation: { type: 'navigation', route: '/provision/inventory' },
      },
      {
        instruction: 'How many devices have a Compliance status of "Non-Compliant"?',
        type: 'find',
        hint: 'Look at the Compliance column and count the Non-Compliant entries.',
        validation: { type: 'contains', acceptAny: ['1', '2', '3', '4', '5'] },
      },
      {
        instruction: 'List the hostnames of all Non-Compliant devices. (Comma-separated)',
        type: 'find',
        hint: 'Filter or scan the table for Non-Compliant rows and note the Device Name.',
        validation: { type: 'contains', acceptAny: ['SW-', 'RTR-', 'AP-'] },
      },
      {
        instruction: 'What software version are the Non-Compliant devices running? Is there a common version?',
        type: 'find',
        hint: 'Check the Software Version column for the Non-Compliant devices.',
        validation: { type: 'contains', answer: '17' },
      },
      {
        instruction: 'What would you recommend to fix the compliance issues? (Choose one)',
        type: 'answer',
        hint: 'Non-compliance is typically resolved by upgrading software or applying the correct configuration.',
        validation: { type: 'choice', choices: ['Upgrade software to compliant version', 'Reboot the devices', 'Replace the hardware', 'Ignore the compliance warning'] },
      },
    ],
  },
  {
    id: 'lab-11',
    number: 11,
    title: 'Troubleshoot an Unreachable Device',
    difficulty: 'Intermediate',
    estimatedMinutes: 15,
    description: 'Find unreachable devices, check their site, and trace to upstream switch on topology.',
    steps: [
      {
        instruction: 'Navigate to Provision > Inventory.',
        type: 'navigate',
        hint: 'Use the hamburger menu → Provision → Inventory.',
        validation: { type: 'navigation', route: '/provision/inventory' },
      },
      {
        instruction: 'Find all devices with Reachability status "Unreachable". How many are there?',
        type: 'find',
        hint: 'Check the Reachability column for "Unreachable" entries.',
        validation: { type: 'contains', acceptAny: ['1', '2', '3'] },
      },
      {
        instruction: 'What is the hostname of an unreachable device?',
        type: 'find',
        hint: 'Note the Device Name of any row showing "Unreachable".',
        validation: { type: 'contains', acceptAny: ['SW-', 'RTR-', 'AP-', 'WLC-'] },
      },
      {
        instruction: 'What Site is the unreachable device located at?',
        type: 'find',
        hint: 'Check the Site column for that device.',
        validation: { type: 'contains', answer: 'Global/' },
      },
      {
        instruction: 'Navigate to Topology and find that device. What is its upstream switch?',
        type: 'navigate',
        hint: 'Go to Provision > Topology, locate the device, and check what it connects to.',
        validation: { type: 'navigation', route: '/provision/topology' },
      },
      {
        instruction: 'Based on the topology, what upstream device should you investigate to restore connectivity?',
        type: 'answer',
        hint: 'The unreachable device connects upward to a distribution or core switch — that is the device to check.',
        validation: { type: 'contains', acceptAny: ['SW-DIST', 'SW-CORE', 'RTR-'] },
      },
    ],
  },
  {
    id: 'lab-12',
    number: 12,
    title: 'Wireless Client Health Analysis',
    difficulty: 'Intermediate',
    estimatedMinutes: 12,
    description: 'Review client health in Assurance, compare wired vs wireless, and find problematic SSIDs.',
    steps: [
      {
        instruction: 'Navigate to Assurance.',
        type: 'navigate',
        hint: 'Use the hamburger menu → Assurance → Health.',
        validation: { type: 'navigation', route: '/assurance' },
      },
      {
        instruction: 'On the Health tab, what is the overall Client Health percentage?',
        type: 'find',
        hint: 'Look for the Client Health section or donut chart.',
        validation: { type: 'contains', acceptAny: ['60', '65', '70', '72', '75', '78', '80', '82', '85'] },
      },
      {
        instruction: 'What is the Wired Client health percentage?',
        type: 'find',
        hint: 'Client Health often breaks down into Wired and Wireless categories.',
        validation: { type: 'contains', acceptAny: ['80', '82', '85', '88', '90', '92'] },
      },
      {
        instruction: 'What is the Wireless Client health percentage?',
        type: 'find',
        hint: 'Check the wireless-specific health number.',
        validation: { type: 'contains', acceptAny: ['60', '65', '68', '70', '72', '75'] },
      },
      {
        instruction: 'Is Wired or Wireless client health lower?',
        type: 'answer',
        hint: 'Compare the two numbers you just found.',
        validation: { type: 'choice', choices: ['Wired', 'Wireless'] },
      },
    ],
  },
  {
    id: 'lab-13',
    number: 13,
    title: 'Site-Level Health Comparison',
    difficulty: 'Intermediate',
    estimatedMinutes: 12,
    description: 'From the Dashboard, navigate to Assurance and compare health across sites.',
    steps: [
      {
        instruction: 'Navigate to the Dashboard (Home).',
        type: 'navigate',
        hint: 'Click Home in the hamburger menu or the Cisco logo.',
        validation: { type: 'navigation', route: '/' },
      },
      {
        instruction: 'In the Network Snapshot, how many Sites are listed?',
        type: 'find',
        hint: 'Look at the Sites tile in the Network Snapshot grid.',
        validation: { type: 'contains', acceptAny: ['3', '4', '5', '6'] },
      },
      {
        instruction: 'Navigate to Assurance to view detailed health information.',
        type: 'navigate',
        hint: 'Click "View Details" on the Health card, or use the hamburger menu.',
        validation: { type: 'navigation', route: '/assurance' },
      },
      {
        instruction: 'Which category of devices has the lowest health: Network, Client, or Application?',
        type: 'answer',
        hint: 'Compare the health percentages for each category on the Assurance page.',
        validation: { type: 'choice', choices: ['Network', 'Client', 'Application'] },
      },
    ],
  },
  {
    id: 'lab-14',
    number: 14,
    title: 'Software Version Audit',
    difficulty: 'Intermediate',
    estimatedMinutes: 12,
    description: 'Identify all unique software versions, find devices on the oldest version.',
    steps: [
      {
        instruction: 'Navigate to Provision > Inventory.',
        type: 'navigate',
        hint: 'Use the hamburger menu → Provision → Inventory.',
        validation: { type: 'navigation', route: '/provision/inventory' },
      },
      {
        instruction: 'How many unique software versions are running across all devices?',
        type: 'find',
        hint: 'Look at the Software Version column and count distinct values.',
        validation: { type: 'contains', acceptAny: ['3', '4', '5', '6', '7'] },
      },
      {
        instruction: 'What is the oldest (lowest numbered) software version you can find?',
        type: 'find',
        hint: 'Sort by Software Version or scan through — look for the lowest IOS-XE version number.',
        validation: { type: 'contains', answer: '17.' },
      },
      {
        instruction: 'How many devices are running that oldest version?',
        type: 'find',
        hint: 'Count the devices with the version number you identified.',
        validation: { type: 'contains', acceptAny: ['1', '2', '3', '4'] },
      },
      {
        instruction: 'Would upgrading these devices likely improve compliance? (Yes/No)',
        type: 'answer',
        hint: 'Non-compliant devices often run outdated software — upgrading typically resolves compliance.',
        validation: { type: 'choice', choices: ['Yes', 'No'] },
      },
    ],
  },

  // ===== ADVANCED (15-20) =====
  {
    id: 'lab-15',
    number: 15,
    title: 'Root Cause Analysis Workflow',
    difficulty: 'Advanced',
    estimatedMinutes: 18,
    description: 'Trace a P1 issue from Assurance through Inventory and Topology to recommend a fix.',
    steps: [
      {
        instruction: 'Navigate to Assurance > Issues & Events.',
        type: 'navigate',
        hint: 'Go to Assurance, then click the Issues & Events tab.',
        validation: { type: 'navigation', route: '/assurance' },
      },
      {
        instruction: 'Find a P1 issue. What device is affected and what is the root cause?',
        type: 'find',
        hint: 'Look at P1 severity issues — note the device hostname and description.',
        validation: { type: 'contains', acceptAny: ['SW-', 'RTR-', 'AP-', 'WLC-'] },
      },
      {
        instruction: 'Navigate to Inventory and find that affected device. What is its current health score?',
        type: 'navigate',
        hint: 'Go to Provision > Inventory and search for the device hostname.',
        validation: { type: 'navigation', route: '/provision/inventory' },
      },
      {
        instruction: 'What is the Reachability and Compliance status of the affected device?',
        type: 'find',
        hint: 'Check the Reachability and Compliance columns for that device.',
        validation: { type: 'contains', acceptAny: ['Reachable', 'Unreachable', 'Ping Reachable'] },
      },
      {
        instruction: 'Navigate to Topology and locate the device. What devices is it connected to?',
        type: 'navigate',
        hint: 'Go to Provision > Topology and find the device node.',
        validation: { type: 'navigation', route: '/provision/topology' },
      },
      {
        instruction: 'Based on your analysis, what would you recommend to resolve the issue?',
        type: 'answer',
        hint: 'Consider: Is it a link issue (check cables/interface)? Software issue (upgrade)? Hardware (replace)?',
        validation: { type: 'choice', choices: ['Reseat/replace cable and bounce interface', 'Upgrade device software', 'Reboot the device', 'Replace the hardware'] },
      },
    ],
  },
  {
    id: 'lab-16',
    number: 16,
    title: 'Network Capacity Planning',
    difficulty: 'Advanced',
    estimatedMinutes: 18,
    description: 'Analyze topology link utilizations, identify bottlenecks, and recommend bandwidth upgrades.',
    steps: [
      {
        instruction: 'Navigate to Provision > Topology.',
        type: 'navigate',
        hint: 'Use the hamburger menu → Provision → Topology.',
        validation: { type: 'navigation', route: '/provision/topology' },
      },
      {
        instruction: 'Identify all links with utilization above 80% (red/orange). How many high-utilization links are there?',
        type: 'find',
        hint: 'Count the red or orange colored links on the topology map.',
        validation: { type: 'contains', acceptAny: ['1', '2', '3', '4'] },
      },
      {
        instruction: 'For the most heavily utilized link, what two devices does it connect?',
        type: 'find',
        hint: 'Click on the reddest link to see endpoint devices.',
        validation: { type: 'contains', answer: 'SW-' },
      },
      {
        instruction: 'Check the health of both connected devices in Inventory. Are either unhealthy (<70)?',
        type: 'navigate',
        hint: 'Go to Inventory and search for each device hostname.',
        validation: { type: 'navigation', route: '/provision/inventory' },
      },
      {
        instruction: 'What bandwidth upgrade would you recommend for the bottleneck link?',
        type: 'answer',
        hint: 'If current link is 1 Gbps, upgrade to 10 Gbps. If 10 Gbps, consider link aggregation or 40 Gbps.',
        validation: { type: 'choice', choices: ['Upgrade to 10 Gbps', 'Upgrade to 40 Gbps', 'Add link aggregation (LAG)', 'No upgrade needed — optimize traffic'] },
      },
    ],
  },
  {
    id: 'lab-17',
    number: 17,
    title: 'Full Incident Response',
    difficulty: 'Advanced',
    estimatedMinutes: 20,
    description: 'Respond to a simulated AP outage: trace the issue through all systems and document findings.',
    steps: [
      {
        instruction: 'Navigate to Assurance > Issues & Events and find any issue related to an Access Point (AP).',
        type: 'navigate',
        hint: 'Go to Assurance, switch to Issues & Events tab, look for AP-related issues.',
        validation: { type: 'navigation', route: '/assurance' },
      },
      {
        instruction: 'What is the affected AP hostname and what is the issue description?',
        type: 'find',
        hint: 'Look for issues with "AP" in the device name.',
        validation: { type: 'contains', acceptAny: ['AP-'] },
      },
      {
        instruction: 'Navigate to Topology and locate the affected AP. What is its upstream switch?',
        type: 'navigate',
        hint: 'Go to Provision > Topology and find the AP node.',
        validation: { type: 'navigation', route: '/provision/topology' },
      },
      {
        instruction: 'Check the upstream switch health in Inventory. Is it healthy (≥70)?',
        type: 'navigate',
        hint: 'Go to Inventory and search for the upstream switch.',
        validation: { type: 'navigation', route: '/provision/inventory' },
      },
      {
        instruction: 'Find the WLC (Wireless LAN Controller) in Inventory. What is its health and reachability?',
        type: 'find',
        hint: 'Search for "WLC" in the inventory search bar.',
        validation: { type: 'contains', acceptAny: ['Reachable', 'Unreachable'] },
      },
      {
        instruction: 'Based on your investigation, what is the most likely root cause of the AP issue?',
        type: 'answer',
        hint: 'Consider: Is the upstream switch healthy? Is the WLC reachable? Is it a PoE, cable, or software issue?',
        validation: { type: 'choice', choices: ['Upstream switch port/PoE issue', 'WLC connectivity problem', 'AP hardware failure', 'Network configuration error'] },
      },
    ],
  },
  {
    id: 'lab-18',
    number: 18,
    title: 'Multi-Site Health Assessment',
    difficulty: 'Advanced',
    estimatedMinutes: 18,
    description: 'Compare all sites by device count, health, compliance, and reachability to produce a ranking.',
    steps: [
      {
        instruction: 'Navigate to Provision > Inventory.',
        type: 'navigate',
        hint: 'Use the hamburger menu → Provision → Inventory.',
        validation: { type: 'navigation', route: '/provision/inventory' },
      },
      {
        instruction: 'How many unique sites are devices assigned to?',
        type: 'find',
        hint: 'Look at the Site column and count distinct site values.',
        validation: { type: 'contains', acceptAny: ['2', '3', '4', '5'] },
      },
      {
        instruction: 'Which site has the most devices?',
        type: 'find',
        hint: 'Count devices per site by looking at the Site column.',
        validation: { type: 'contains', answer: 'Global/' },
      },
      {
        instruction: 'Which site has the most Non-Compliant or Unreachable devices?',
        type: 'find',
        hint: 'Cross-reference Site with Compliance and Reachability columns.',
        validation: { type: 'contains', answer: 'Global/' },
      },
      {
        instruction: 'Rank the sites from healthiest to least healthy. Which site would you prioritize for remediation?',
        type: 'answer',
        hint: 'Consider: device health scores, compliance, reachability — the worst overall is the priority.',
        validation: { type: 'contains', answer: 'Global/' },
      },
    ],
  },
  {
    id: 'lab-19',
    number: 19,
    title: 'Change Impact Analysis',
    difficulty: 'Advanced',
    estimatedMinutes: 18,
    description: 'Analyze the blast radius of planned maintenance on SW-CORE-01: identify all downstream devices.',
    steps: [
      {
        instruction: 'Navigate to Provision > Topology.',
        type: 'navigate',
        hint: 'Use the hamburger menu → Provision → Topology.',
        validation: { type: 'navigation', route: '/provision/topology' },
      },
      {
        instruction: 'Find SW-CORE-01 on the topology. How many direct connections does it have?',
        type: 'find',
        hint: 'Click on SW-CORE-01 and count the links going to/from it.',
        validation: { type: 'contains', acceptAny: ['2', '3', '4', '5', '6'] },
      },
      {
        instruction: 'List all devices directly connected to SW-CORE-01. (Comma-separated)',
        type: 'find',
        hint: 'Note the hostname of each device connected by a link to SW-CORE-01.',
        validation: { type: 'contains', acceptAny: ['SW-DIST', 'RTR-', 'SW-CORE-02'] },
      },
      {
        instruction: 'Navigate to Inventory and check the health of all downstream devices. How many have health below 70?',
        type: 'navigate',
        hint: 'Go to Inventory and search for each downstream device.',
        validation: { type: 'navigation', route: '/provision/inventory' },
      },
      {
        instruction: 'If SW-CORE-01 goes down for maintenance, how many end devices (APs, access switches) could be affected?',
        type: 'find',
        hint: 'Count all devices downstream of the distribution switches connected to SW-CORE-01.',
        validation: { type: 'contains', acceptAny: ['3', '4', '5', '6', '7', '8', '9', '10'] },
      },
      {
        instruction: 'What risk mitigation strategy would you recommend before the maintenance window?',
        type: 'answer',
        hint: 'Consider redundancy — does SW-CORE-02 exist? Can traffic failover? Should you notify users?',
        validation: { type: 'choice', choices: ['Verify SW-CORE-02 redundancy and failover path', 'Move all traffic to a different site first', 'Schedule during off-hours with no preparation', 'Cancel the maintenance'] },
      },
    ],
  },
  {
    id: 'lab-20',
    number: 20,
    title: 'End-to-End Network Audit',
    difficulty: 'Advanced',
    estimatedMinutes: 20,
    description: 'Complete comprehensive audit: issues, compliance, reachability, topology, and health summary.',
    steps: [
      {
        instruction: 'Navigate to Assurance > Issues & Events. How many total open issues (P1 + P2 + P3) exist?',
        type: 'navigate',
        hint: 'Go to Assurance, click Issues & Events tab, count all Open status issues.',
        validation: { type: 'navigation', route: '/assurance' },
      },
      {
        instruction: 'How many P1 issues and how many P2 issues are currently open? (Format: P1:X, P2:Y)',
        type: 'find',
        hint: 'Count issues by severity — P1 and P2 separately.',
        validation: { type: 'contains', answer: 'P' },
      },
      {
        instruction: 'Navigate to Inventory. What percentage of devices are Compliant?',
        type: 'navigate',
        hint: 'Go to Provision > Inventory, count Compliant vs total devices.',
        validation: { type: 'navigation', route: '/provision/inventory' },
      },
      {
        instruction: 'How many devices are Unreachable?',
        type: 'find',
        hint: 'Check the Reachability column for "Unreachable" status.',
        validation: { type: 'contains', acceptAny: ['0', '1', '2', '3'] },
      },
      {
        instruction: 'Navigate to Topology. Are there any visually broken links (red/down)?',
        type: 'navigate',
        hint: 'Go to Provision > Topology and look for any dashed or red lines indicating down links.',
        validation: { type: 'navigation', route: '/provision/topology' },
      },
      {
        instruction: 'Based on your full audit, rate the overall network health: Good, Fair, or Poor.',
        type: 'answer',
        hint: 'Consider: open P1 issues, unreachable devices, non-compliant devices, topology issues.',
        validation: { type: 'choice', choices: ['Good — minor issues only', 'Fair — some issues need attention', 'Poor — critical issues require immediate action'] },
      },
      {
        instruction: 'Write a one-sentence summary of your audit findings.',
        type: 'answer',
        hint: 'Summarize: number of issues, compliance %, unreachable devices, and your overall assessment.',
        validation: { type: 'contains', acceptAny: ['issue', 'device', 'health', 'compliant', 'network'] },
      },
    ],
  },
];
