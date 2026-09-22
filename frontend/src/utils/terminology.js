/**
 * CIVIC-KALKI — Presentation Terminology & Capability Mapping Utility
 * Translates underlying metadata concepts into human-readable civic terminology
 * without mutating database schemas or backend contracts.
 */

// SVG path data for each capability icon (Heroicons 24/outline)
const ICONS = {
  initiative:  'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  grievance:   'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  park:        'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  passport:    'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2',
  charter:     'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  employment:  'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  volunteer:   'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  legacy:      'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z',
  feedback:    'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  survey:      'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
  default:     'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
};

// Maps legacy emoji characters stored in DB or configs to modern SVG icon keys
const EMOJI_TO_KEY = {
  '🌱': 'initiative',
  '🚨': 'grievance',
  '⚠️': 'grievance',
  '🪪': 'passport',
  '📜': 'charter',
  '💼': 'employment',
  '🤝': 'volunteer',
  '🏛️': 'legacy',
  '🏛': 'legacy',
  '💬': 'feedback',
  '📢': 'feedback',
  '📊': 'survey',
  '📋': 'survey',
  '🌳': 'park',
  '🏞️': 'park',
  '🏞': 'park',
  '🏗️': 'legacy',
  '🏗': 'legacy',
  '🛡️': 'charter',
  '🛡': 'charter',
  '⚡': 'default',
  '⚡️': 'default',
};

/**
 * Returns an inline SVG string for the given icon key or emoji.
 * @param {string} keyOrEmoji - Key from ICONS map, or legacy emoji character
 * @param {number} size       - Width/height in px
 * @param {string} className  - Optional CSS classes
 */
export function capabilityIcon(keyOrEmoji, size = 20, className = '') {
  const key = EMOJI_TO_KEY[keyOrEmoji] || keyOrEmoji;
  const path = ICONS[key] || ICONS.default;
  return `<svg width="${size}" height="${size}" class="${className}" style="flex-shrink:0; display:inline-block; vertical-align:middle;" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${path}"/></svg>`;
}

// Presentation mapping for built-in and common EntityType names
const CAPABILITY_MAP = {
  'Movement': {
    title: 'Start a Civic Initiative',
    shortTitle: 'Civic Initiative',
    description: 'Organize citizens around community goals, public spaces, and urban projects.',
    category: 'Community Action',
    iconKey: 'initiative',
    actionLabel: 'Start Initiative',
  },
  'Grievance': {
    title: 'Report a Civic Problem',
    shortTitle: 'Civic Problem',
    description: 'Report infrastructure defects, sanitation issues, or public safety concerns.',
    category: 'Public Services',
    iconKey: 'grievance',
    actionLabel: 'Report Issue',
  },
  'Park Renovation Request': {
    title: 'Park Renovation Request',
    shortTitle: 'Park Renovation',
    description: 'Propose public park upgrades, playground repairs, or green space restoration.',
    category: 'Urban Infrastructure',
    iconKey: 'park',
    actionLabel: 'Request Renovation',
  },
  'Citizen Passport': {
    title: 'Citizen Passport & Contribution',
    shortTitle: 'Citizen Passport',
    description: 'Track community contributions, volunteer hours, and civic engagement history.',
    category: 'Civic Identity',
    iconKey: 'passport',
    actionLabel: 'Update Passport',
  },
  'Digital Civic Constitution': {
    title: 'Civic Charter & Guidelines',
    shortTitle: 'Civic Charter',
    description: 'Establish community guidelines, governance rules, and transparency terms.',
    category: 'Governance',
    iconKey: 'charter',
    actionLabel: 'Draft Charter',
  },
  'Employment Exchange': {
    title: 'Civic Skills & Employment',
    shortTitle: 'Employment Exchange',
    description: 'Post and discover civic project roles, community jobs, and skill opportunities.',
    category: 'Opportunity',
    iconKey: 'employment',
    actionLabel: 'Post Role',
  },
  'Volunteer Management': {
    title: 'Volunteer Operations',
    shortTitle: 'Volunteer Drive',
    description: 'Coordinate volunteer tasks, register community helpers, and track activities.',
    category: 'Community Action',
    iconKey: 'volunteer',
    actionLabel: 'Register Volunteer',
  },
  'Legacy & Continuity': {
    title: 'Project Continuity & Legacy',
    shortTitle: 'Project Continuity',
    description: 'Transition completed initiatives into permanent NGOs, startups, or civic centers.',
    category: 'Governance',
    iconKey: 'legacy',
    actionLabel: 'Plan Continuity',
  },
  'Public Feedback': {
    title: 'Public Feedback',
    shortTitle: 'Public Feedback',
    description: 'Collect structured community feedback on civic initiatives and public services.',
    category: 'Civic Operations',
    iconKey: 'feedback',
    actionLabel: 'Submit Feedback',
  },
  'Public Survey': {
    title: 'Public Survey',
    shortTitle: 'Public Survey',
    description: 'Run community surveys and opinion polls for civic decision-making.',
    category: 'Civic Operations',
    iconKey: 'survey',
    actionLabel: 'Start Survey',
  },
};

/**
 * Returns a user-friendly presentation object for an EntityType metadata record.
 * Falls back to raw metadata values safely for any newly created No-Code modules.
 */
export function getCapabilityPresentation(entityType) {
  if (!entityType) {
    return {
      title: 'Civic Capability',
      shortTitle: 'Capability',
      description: 'Metadata-driven civic module.',
      category: 'Civic Operations',
      iconKey: 'default',
      icon: capabilityIcon('default', 16),
      iconLarge: capabilityIcon('default', 24),
      actionLabel: 'Start Action',
    };
  }

  const rawName = entityType.name || '';
  const mapped = CAPABILITY_MAP[rawName];

  if (mapped) {
    return {
      title: mapped.title,
      shortTitle: mapped.shortTitle,
      description: entityType.description || mapped.description,
      category: mapped.category,
      iconKey: mapped.iconKey,
      icon: capabilityIcon(mapped.iconKey, 16),
      iconLarge: capabilityIcon(mapped.iconKey, 24),
      actionLabel: mapped.actionLabel,
      rawName: rawName,
    };
  }

  // Fallback for custom no-code dynamic modules
  const detectedKey = (entityType.icon && EMOJI_TO_KEY[entityType.icon])
    || (entityType.icon && ICONS[entityType.icon] ? entityType.icon : null)
    || 'default';

  return {
    title: rawName,
    shortTitle: rawName,
    description: entityType.description || 'Metadata-configured civic capability module.',
    category: entityType.domain?.domain_name || 'Civic Operations',
    iconKey: detectedKey,
    icon: capabilityIcon(detectedKey, 16),
    iconLarge: capabilityIcon(detectedKey, 24),
    actionLabel: `Start ${rawName}`,
    rawName: rawName,
  };
}

/**
 * Translates technical backend terminology into user-facing terminology.
 */
export function translateConcept(conceptKey) {
  const map = {
    entityType: 'Civic Capability',
    entityTypes: 'Civic Capabilities',
    entity: 'Case / Request',
    entities: 'Cases & Requests',
    formMaster: 'Request Form',
    workflowMaster: 'Process & Workflow',
    ruleEngine: 'Civic Automation',
    entityRelationshipRule: 'Automation Rule',
    lineage: 'Civic Lineage',
    reportMaster: 'Civic Report',
    reports: 'Governance Reports',
    aiEngine: 'Civic Intelligence',
    auditLog: 'Activity & Accountability',
  };

  return map[conceptKey] || conceptKey;
}

/**
 * Formats a workflow status string into a human-readable display badge text.
 */
export function formatStatusLabel(status) {
  if (!status) return 'Unknown';
  switch (status.toLowerCase()) {
    case 'draft':               return 'Draft (Unsubmitted)';
    case 'submitted':           return 'Submitted (Awaiting Review)';
    case 'coordinator_approved':return 'Verified (Pending Approval)';
    case 'verified':            return 'Verified';
    case 'approved':            return 'Approved & Active';
    case 'rejected':            return 'Rejected';
    case 'closed':              return 'Closed';
    default:
      return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
}
