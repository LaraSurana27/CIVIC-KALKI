import { requireAuth, getUser } from '../auth.js';
import { renderLayout, attachLayoutEvents } from '../components/layout.js';
import { entities as apiEntities, forms as apiForms, agent as agentApi } from '../api.js';
import { toastError, toastSuccess } from '../components/toast.js';
import { navigate } from '../router.js';
import { formatStatusLabel } from '../utils/terminology.js';

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
  );
}

function renderMarkdownLite(text) {
  return escapeHtml(text || '')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

function formatFileSize(bytes) {
  if (!bytes || isNaN(bytes)) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/* ══════════════════════════════════════════════════════════════
   Dashboard SVG Icons — Precision Curated Set
   ══════════════════════════════════════════════════════════════ */
const DSVG = {
  sparkle: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z"/></svg>`,
  layoutGrid: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  search: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  mic: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>`,
  send: `<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>`,
  arrowRight: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  chevronRight: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
  paperclip: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>`,
  rotateCcw: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>`,
  maximize: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>`,

  // Gateways & Categories
  alertTriangle: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`,
  lightbulb: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>`,
  users: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
  bookOpen: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>`,

  clipboard: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>`,
  heart: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`,
  checkCircle: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,

  road: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19L8 5"/><path d="M20 19L16 5"/><line x1="12" y1="6" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="14"/><line x1="12" y1="18" x2="12" y2="20"/></svg>`,
  trash: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  zap: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  leaf: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 1 8.5-2 2-5.5 3.5-9 3.5"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></svg>`,
  mapPin: `<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
  usersSm: `<svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>`,

  // Rapid action & telemetry icons (Replacing emojis with clean SVGs)
  hazardCone: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  lamp: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;"><path d="M9 2h6l3 7H6l3-7z"/><path d="M12 9v13"/><path d="M8 22h8"/></svg>`,
  trashBin: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
  tree: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/><path d="M5 19h14"/></svg>`,
  bulb: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5"/></svg>`,
  scroll: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  scale: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;"><path d="M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/><path d="M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h18"/></svg>`,
  camera: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  fileDoc: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  shieldCheck: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`,
  dotRed: `<svg width="8" height="8" viewBox="0 0 8 8" style="vertical-align:middle;"><circle cx="4" cy="4" r="3.5" fill="#ef4444"/></svg>`,
  dotGreen: `<svg width="8" height="8" viewBox="0 0 8 8" style="vertical-align:middle;"><circle cx="4" cy="4" r="3.5" fill="#10b981"/></svg>`,
  dotAmber: `<svg width="8" height="8" viewBox="0 0 8 8" style="vertical-align:middle;"><circle cx="4" cy="4" r="3.5" fill="#f59e0b"/></svg>`,
};

export async function renderDashboard() {
  if (!requireAuth(navigate)) return;
  const user = getUser();
  
  const app = document.getElementById('app');
  app.innerHTML = renderLayout(`
    <div class="page-header">
      <div class="page-header-left">
        <h1>Loading Workspace...</h1>
      </div>
    </div>
    <div id="dash-content">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `, 'Workspace');
  attachLayoutEvents();

  try {
    const metaRes = await apiForms.getMetadata().catch(() => ({ success: false, data: { entityTypes: [], rules: [], domains: [] } }));
    const metaData = metaRes.data || { entityTypes: [], rules: [], domains: [] };

    let pageTitle = 'Home';
    let pageSubtitle = `Good day, <strong>${escapeHtml(user.name)}</strong>. Here is what is happening in your civic workspace.`;
    if (user.role === 'coordinator_area' || user.role === 'coordinator_general') {
      pageTitle = 'Civic Operations Workspace';
      pageSubtitle = `Operations view for <strong>${escapeHtml(user.name)}</strong>`;
    } else if (user.role === 'director') {
      pageTitle = 'Executive Governance Workspace';
      pageSubtitle = `Executive view for <strong>${escapeHtml(user.name)}</strong>`;
    } else if (user.role === 'admin') {
      pageTitle = 'Civic OS Administration';
      pageSubtitle = `Platform admin for <strong>${escapeHtml(user.name)}</strong>`;
    }

    const isCitizen = user.role === 'citizen';

    app.innerHTML = renderLayout(`
      ${!isCitizen ? `
      <div class="page-header mb-6">
        <div class="page-header-left">
          <h1 style="font-size:1.75rem; font-weight:800; color:var(--text-primary);">${escapeHtml(pageTitle)}</h1>
          <p style="color:var(--text-secondary); margin-top:2px;">${pageSubtitle}</p>
        </div>
        <div class="page-header-actions" id="dash-actions"></div>
      </div>
      ` : `<div id="dash-actions" style="display:none;"></div>`}
      
      <div id="dash-content">
        <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
      </div>
    `, pageTitle, metaData.entityTypes);
    attachLayoutEvents();

    const newContent = document.getElementById('dash-content');
    const newActions = document.getElementById('dash-actions');

    if (user.role === 'citizen') {
      newActions.innerHTML = '';
      const pageContent = document.getElementById('page-content');
      if (pageContent) pageContent.classList.add('ck-citizen-page-content');
      await renderCitizenDash(newContent, user, metaData);
    } else if (user.role === 'coordinator_area') {
      newActions.innerHTML = `<a href="/entities?status=submitted" class="btn btn-primary">Review Queue</a>`;
      await renderCoordinatorAreaDash(newContent, user, metaData);
    } else if (user.role === 'coordinator_general') {
      newActions.innerHTML = `<a href="/entities?status=submitted" class="btn btn-primary">Review Queue</a>`;
      await renderCoordinatorGeneralDash(newContent, user, metaData);
    } else if (user.role === 'director') {
      newActions.innerHTML = `<a href="/entities?status=coordinator_approved" class="btn btn-primary">Executive Approvals Queue</a>`;
      await renderDirectorDash(newContent, user, metaData);
    } else if (user.role === 'admin') {
      newActions.innerHTML = `
        <a href="/module-builder" class="btn btn-secondary" style="display:inline-flex; align-items:center; gap:8px;">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
          No-Code Builder
        </a>
        <a href="/admin" class="btn btn-primary">User Admin</a>
      `;
      await renderAdminDash(newContent, user, metaData);
    }

    if (typeof window.civicTranslatePage === 'function') {
      window.civicTranslatePage();
    }
  } catch (err) {
    toastError('Failed to load workspace data');
    document.getElementById('dash-content').innerHTML = `<div class="alert alert-error">Failed to load workspace data. Please try again.</div>`;
    if (typeof window.civicTranslatePage === 'function') {
      window.civicTranslatePage();
    }
  }
}

/* ══════════════════════════════════════════════════════════════
   CITIZEN DASHBOARD: TABBED AGENTIC AI HERO EXPERIENCE
   ══════════════════════════════════════════════════════════════ */
let citizenSessionId = null;
let citizenPendingFile = null;
let citizenLocation = null;
let citizenIsWaiting = false;
let rotatorIntervalId = null;

async function renderCitizenDash(container, user, metaData) {
  // Generate session ID for this dashboard visit
  citizenSessionId = 'ck-dash-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  citizenPendingFile = null;
  citizenIsWaiting = false;

  const myRes = await apiEntities.list({ owner_user_id: user.user_id, limit: 50 }).catch(() => ({ data: [] }));
  const myItems = myRes.data || [];

  const drafts    = myItems.filter(i => i.status === 'draft').length;
  const active    = myItems.filter(i => ['submitted', 'coordinator_approved', 'in_review'].includes(i.status)).length;
  const completed = myItems.filter(i => ['approved', 'closed', 'rejected'].includes(i.status)).length;
  const following = myItems.filter(i => i.isFollowing).length || 5;

  const publicRes = await apiEntities.list({ limit: 6 }).catch(() => ({ data: [] }));
  let publicItems = publicRes.data || [];
  let nearbyItems = publicItems.length >= 3 ? publicItems : _blendWithCleanDemo(publicItems);

  const statusPill = (status) => {
    const map = {
      submitted:            { label: 'Submitted',     bg: '#fef3c7', color: '#92400e' },
      coordinator_approved: { label: 'In Progress',   bg: '#dbeafe', color: '#1e40af' },
      approved:             { label: 'Open',          bg: '#dcfce7', color: '#166534' },
      draft:                { label: 'Draft',         bg: '#f1f5f9', color: '#475569' },
      rejected:             { label: 'Closed',        bg: '#fee2e2', color: '#991b1b' },
      default:              { label: 'Active',        bg: '#ffedd5', color: '#9a3412' },
    };
    const s = map[status] || map.default;
    return `<span class="ck-rx-status-pill" style="background:${s.bg}; color:${s.color}; font-weight:700;">${s.label}</span>`;
  };

  const getCategoryIcon = (name = '') => {
    const n = name.toLowerCase();
    if (n.includes('tree') || n.includes('park') || n.includes('green') || n.includes('garden')) return DSVG.leaf;
    if (n.includes('light') || n.includes('wire') || n.includes('power') || n.includes('pole')) return DSVG.zap;
    if (n.includes('garbage') || n.includes('waste') || n.includes('sanitation') || n.includes('clean')) return DSVG.trash;
    return DSVG.road;
  };

  const nearbyCards = nearbyItems.map((item, idx) => {
    const icon = getCategoryIcon(item.name);
    return `
      <div class="ck-rx-issue-card">
        <div class="ck-rx-issue-top">
          <div class="ck-rx-issue-icon">${icon}</div>
          ${statusPill(item.status)}
        </div>
        <div class="ck-rx-issue-name" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</div>
        <div class="ck-rx-issue-area">
          ${DSVG.mapPin}
          <span>${escapeHtml(item.area || 'Ward 14 · Pune')}</span>
        </div>
        <div class="ck-rx-issue-footer">
          <span class="ck-rx-issue-meta">
            ${DSVG.usersSm}
            ${(idx * 14 + 18)} citizens backing
          </span>
          <a href="/entities/${item.entity_id || ''}" class="ck-rx-issue-link">
            View ${DSVG.chevronRight}
          </a>
        </div>
      </div>
    `;
  }).join('');

  const trendingList = _getCleanTrending();

  container.innerHTML = `
    <!-- ░░ 1. DYNAMIC TEXT-IN-MOTION LIVE TICKER ░░ -->
    <div class="ck-motion-ticker-wrap" title="Live municipal telemetry feed — hover to pause">
      <div class="ck-motion-ticker-label">
        <span class="ck-pulse-dot"></span>
        <span>LIVE CIVIC STREAM</span>
      </div>
      <div class="ck-motion-ticker-viewport">
        <div class="ck-motion-ticker-track">
          <div class="ck-motion-ticker-item">
            <span style="display:inline-flex; align-items:center; gap:5px;"><span style="display:inline-flex; align-items:center;">${DSVG.dotRed}</span> <strong>WARD 14:</strong></span> Urgent pothole reported on FC Road auto-triaged to Road Works Dept #9182
          </div>
          <span class="ck-motion-ticker-sep">✦</span>
          <div class="ck-motion-ticker-item">
            <span style="color:#fbbf24; display:inline-flex; align-items:center; gap:5px;"><span style="display:inline-flex; align-items:center;">${DSVG.scale}</span> <strong>BYLAW RAG:</strong></span> PMC Section 44(A) applied to fallen tree branch removal request
          </div>
          <span class="ck-motion-ticker-sep">✦</span>
          <div class="ck-motion-ticker-item">
            <span style="color:#f59e0b; display:inline-flex; align-items:center; gap:5px;"><span style="display:inline-flex; align-items:center;">${DSVG.bulb}</span> <strong>INITIATIVE:</strong></span> Model Colony Park Solar Composter backed by 48 verified citizens
          </div>
          <span class="ck-motion-ticker-sep">✦</span>
          <div class="ck-motion-ticker-item">
            <span style="color:#38bdf8; display:inline-flex; align-items:center; gap:5px;"><span style="display:inline-flex; align-items:center;">${DSVG.trashBin}</span> <strong>SANITATION:</strong></span> Route #4 garbage clearance confirmed by coordinator Anand V.
          </div>
          <span class="ck-motion-ticker-sep">✦</span>
          <div class="ck-motion-ticker-item">
            <span style="color:#10b981; display:inline-flex; align-items:center; gap:5px;"><span style="display:inline-flex; align-items:center;">${DSVG.dotGreen}</span> <strong>DISPATCHED:</strong></span> Streetlight repair unit deployed near Deccan Gymkhana
          </div>
          <span class="ck-motion-ticker-sep">✦</span>
          <div class="ck-motion-ticker-item">
            <span style="display:inline-flex; align-items:center; gap:5px;"><span style="display:inline-flex; align-items:center;">${DSVG.dotRed}</span> <strong>WARD 14:</strong></span> Urgent pothole reported on FC Road auto-triaged to Road Works Dept #9182
          </div>
          <span class="ck-motion-ticker-sep">✦</span>
          <div class="ck-motion-ticker-item">
            <span style="color:#fbbf24; display:inline-flex; align-items:center; gap:5px;"><span style="display:inline-flex; align-items:center;">${DSVG.scale}</span> <strong>BYLAW RAG:</strong></span> PMC Section 44(A) applied to fallen tree branch removal request
          </div>
        </div>
      </div>
    </div>

    <!-- ░░ 2. TAB NAVIGATION BAR ░░ -->
    <div class="ck-dash-tabs-bar">
      <nav class="ck-dash-tabs-nav" role="tablist">
        <button class="ck-dash-tab active" data-tab="ai" id="ck-tab-btn-ai" role="tab" aria-selected="true">
          <span class="ck-tab-icon">${DSVG.sparkle}</span>
          <span>Kalki Agentic AI</span>
          <span class="ck-tab-pill-live">● HIGHLIGHT</span>
        </button>
        <button class="ck-dash-tab" data-tab="overview" id="ck-tab-btn-overview" role="tab" aria-selected="false">
          <span class="ck-tab-icon">${DSVG.layoutGrid}</span>
          <span>Civic Overview</span>
        </button>
        <button class="ck-dash-tab" data-tab="community" id="ck-tab-btn-community" role="tab" aria-selected="false">
          <span class="ck-tab-icon">${DSVG.users}</span>
          <span>Community Pulse</span>
          <span class="ck-tab-badge">${nearbyItems.length}</span>
        </button>
        <button class="ck-dash-tab" data-tab="records" id="ck-tab-btn-records" role="tab" aria-selected="false">
          <span class="ck-tab-icon">${DSVG.clipboard}</span>
          <span>My Trackers</span>
          <span class="ck-tab-badge">${active + drafts}</span>
        </button>
      </nav>

      <div class="ck-dash-tabs-right">
        <div class="ck-node-status-chip">
          <span class="ck-pulse-dot"></span>
          <span>Ward 14 Node Active</span>
        </div>
      </div>
    </div>

    <!-- ░░ 3. TAB PANE: AGENTIC AI (PRIMARY HIGHLIGHT) ░░ -->
    <div class="ck-tab-pane" id="ck-pane-ai" style="display:block;">

      <!-- Hero Highlight Banner with Rotating Text in Motion -->
      <div class="ck-ai-hero-card">
        <div class="ck-ai-hero-top">
          <div class="ck-ai-badge-row">
            <span class="ck-ai-badge-primary">${DSVG.sparkle} Autonomous Civic Co-Pilot</span>
            <span class="ck-ai-badge-secondary">Zero Bureaucracy Triage</span>
          </div>
          <span style="font-size:0.75rem; color:#94a3b8; font-weight:600;">PMC Ward 14 · Shivajinagar</span>
        </div>

        <h1 class="ck-ai-hero-title">
          Speak your civic need. <span>Kalki takes the action.</span>
        </h1>

        <!-- DYNAMIC ROTATING TEXT IN MOTION -->
        <div class="ck-ai-prompt-rotator">
          <span class="ck-ai-rotator-label">Trending Prompts:</span>
          <div class="ck-ai-rotator-text-box" id="ck-rotating-prompt-box" title="Click to ask this prompt">
            <span id="ck-rotating-prompt-text">Broken streetlight outside Modern College on FC Road</span>
            <span class="ck-ai-rotator-action">Insert ↵</span>
          </div>
        </div>
      </div>

      <!-- Main Two-Column AI Console -->
      <div class="ck-ai-console-grid">

        <!-- Left Main: In-Tab Conversational Chat Console -->
        <div class="ck-ai-chat-card">
          <div class="ck-ai-chat-header">
            <div class="ck-ai-chat-agent-info">
              <div class="ck-ai-chat-avatar">
                ${DSVG.sparkle}
              </div>
              <div>
                <div class="ck-ai-chat-agent-name">Kalki Autonomous Agent</div>
                <div class="ck-ai-chat-agent-sub">Online · Direct municipal coordinator link</div>
              </div>
            </div>
            <div class="ck-ai-chat-header-actions">
              <button class="ck-ai-header-btn" id="ck-reset-chat-btn" title="Clear conversation and start fresh">
                ${DSVG.rotateCcw} Reset
              </button>
              <button class="ck-ai-header-btn" id="ck-fullscreen-chat-btn" title="Open full dedicated conversation page">
                ${DSVG.maximize} Expand
              </button>
            </div>
          </div>

          <!-- Message Thread Container -->
          <div class="ck-ai-messages-wrap" id="ck-inline-chat-messages">
            <!-- Initial Agent Welcome Bubble -->
            <div class="agent-msg-row agent-msg-agent">
              <div class="agent-bubble-avatar" aria-hidden="true">${DSVG.sparkle}</div>
              <div class="agent-bubble agent-bubble-agent">
                Good day, <strong>${escapeHtml(user.name)}</strong>! I am your municipal co-pilot for Ward 14.<br><br>
                Tell me what needs attention in your neighborhood, or tap one of these immediate civic triggers:
                <div class="ck-ai-chips-container">
                  <button class="ck-ai-rapid-chip" data-prompt="Dangerous pothole on main road with high traffic">
                    ${DSVG.hazardCone} <span>Dangerous Pothole</span>
                  </button>
                  <button class="ck-ai-rapid-chip" data-prompt="Streetlight is not working and street is completely dark">
                    ${DSVG.lamp} <span>Broken Streetlight</span>
                  </button>
                  <button class="ck-ai-rapid-chip" data-prompt="Garbage dump overflowing on corner near residential area">
                    ${DSVG.trashBin} <span>Overflowing Waste</span>
                  </button>
                  <button class="ck-ai-rapid-chip" data-prompt="Fallen tree branches blocking pedestrian pavement">
                    ${DSVG.tree} <span>Tree Pruning Needed</span>
                  </button>
                  <button class="ck-ai-rapid-chip" data-prompt="I want to propose a neighborhood park cleanup initiative">
                    ${DSVG.bulb} <span>Propose Initiative</span>
                  </button>
                  <button class="ck-ai-rapid-chip" data-prompt="What are municipal bylaws regarding noise pollution after 10 PM?">
                    ${DSVG.scroll} <span>Check PMC Bylaws</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Input Zone -->
          <div class="ck-ai-input-zone">
            <!-- Location status bar -->
            <div id="ck-location-bar" style="display:flex; justify-content:space-between; align-items:center; padding:7px 14px; background:rgba(255,255,255,0.7); border-bottom:1px solid #e2e8f0; font-size:0.75rem;">
              <div style="display:flex; align-items:center; gap:6px; color:#475569;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>GPS Location: <strong id="ck-location-text" style="color:#0f172a;">Not attached</strong></span>
              </div>
              <div style="display:flex; gap:6px; align-items:center;">
                <button type="button" class="btn btn-ghost btn-sm" id="ck-detect-location-btn" style="padding:2px 8px; font-size:0.72rem; color:#ea580c; font-weight:700; display:inline-flex; align-items:center; gap:4px;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
                  Use My Location
                </button>
                <button type="button" class="btn btn-ghost btn-sm" id="ck-clear-location-btn" style="padding:2px 6px; font-size:0.72rem; color:#dc2626; display:none;" title="Remove Location">&times;</button>
              </div>
            </div>

            <!-- File preview bar -->
            <div class="ck-ai-file-preview-bar" id="ck-file-preview-bar"></div>

            <div class="ck-ai-input-bar-inner">
              <textarea
                id="ck-inline-textarea"
                class="ck-ai-textarea"
                rows="1"
                placeholder="Type your request or drop photo evidence (e.g. 'Garbage not cleared near FC Road')..."
                aria-label="Civic AI Message"
              ></textarea>

              <div class="ck-ai-input-actions">
                <!-- Audio Waveform (shown when recording) -->
                <div class="ck-ai-waveform" id="ck-waveform">
                  <span class="ck-ai-wave-bar"></span>
                  <span class="ck-ai-wave-bar"></span>
                  <span class="ck-ai-wave-bar"></span>
                  <span class="ck-ai-wave-bar"></span>
                </div>

                <!-- Hidden file input -->
                <input type="file" id="ck-inline-file-input" style="display:none;" accept="image/*,.pdf,.doc,.docx" />
                
                <button type="button" class="ck-ai-action-icon-btn" id="ck-attach-btn" title="Attach photo or document">
                  ${DSVG.paperclip}
                </button>
                <button type="button" class="ck-ai-action-icon-btn" id="ck-mic-btn" title="Voice dictation">
                  ${DSVG.mic}
                </button>
                <button type="button" class="ck-ai-send-btn" id="ck-inline-send-btn" title="Send (Enter)">
                  <span>Send</span>
                  ${DSVG.send}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Ward Telemetry & Coordinator Status -->
        <aside class="ck-ai-telemetry-col">
          <div class="ck-telemetry-panel">
            <div class="ck-telemetry-header">
              <span>Ward 14 Telemetry</span>
              <span class="ck-pulse-dot"></span>
            </div>
            <div class="ck-telemetry-stat-row">
              <div class="ck-telemetry-stat-item">
                <span class="ck-telemetry-label">Assigned Node</span>
                <span class="ck-telemetry-val">Ward 14 · Shivajinagar</span>
              </div>
              <div class="ck-telemetry-stat-item">
                <span class="ck-telemetry-label">Area Coordinator</span>
                <span class="ck-telemetry-val">Officer Anand V.</span>
              </div>
              <div class="ck-telemetry-stat-item">
                <span class="ck-telemetry-label">Triage Accuracy</span>
                <span class="ck-telemetry-val accent-green">99.4% Automated</span>
              </div>
              <div class="ck-telemetry-stat-item">
                <span class="ck-telemetry-label">Avg Verification</span>
                <span class="ck-telemetry-val accent-amber">~2.1 Hours</span>
              </div>
              <div class="ck-telemetry-stat-item">
                <span class="ck-telemetry-label">Indexed Bylaws</span>
                <span class="ck-telemetry-val">148 Municipal Rules</span>
              </div>
            </div>
          </div>

          <div class="ck-telemetry-panel">
            <div class="ck-telemetry-header">
              <span>Autonomous Dispatches</span>
              <span style="font-size:0.68rem; color:#f97316; font-weight:700;">TODAY</span>
            </div>
            <div style="font-size:0.78rem; color:#475569; display:flex; flex-direction:column; gap:10px;">
              <div style="padding:8px 10px; background:#f8fafc; border-radius:8px; border-left:3px solid #10b981;">
                <div style="font-weight:700; color:#0f172a;">FC Road Crosswalk Lighting</div>
                <div style="font-size:0.7rem; color:#64748b;">Coordinator approved · Assigned to Crew #2</div>
              </div>
              <div style="padding:8px 10px; background:#f8fafc; border-radius:8px; border-left:3px solid #f59e0b;">
                <div style="font-weight:700; color:#0f172a;">Model Colony Composting Drive</div>
                <div style="font-size:0.7rem; color:#64748b;">Community backing: 42 signatures</div>
              </div>
              <div style="padding:8px 10px; background:#f8fafc; border-radius:8px; border-left:3px solid #3b82f6;">
                <div style="font-weight:700; color:#0f172a;">Bhandarkar Road Drainage Clearing</div>
                <div style="font-size:0.7rem; color:#64748b;">Scheduled for tomorrow 9 AM</div>
              </div>
            </div>
          </div>

          <div class="ck-rx-spotlight-card">
            <div class="ck-rx-spotlight-tag">Civic Hack</div>
            <div class="ck-rx-spotlight-title">Photo Evidence Speeds Triage</div>
            <div class="ck-rx-spotlight-desc">Attaching a clear photo of street hazards allows Kalki AI Vision to auto-detect coordinates and urgency within 3 seconds.</div>
          </div>
        </aside>

      </div><!-- /.ck-ai-console-grid -->
    </div><!-- /#ck-pane-ai -->


    <!-- ░░ 4. TAB PANE: CIVIC OVERVIEW ░░ -->
    <div class="ck-tab-pane" id="ck-pane-overview" style="display:none;">
      <div class="ck-rx-overview-head">
        <h1 class="ck-rx-overview-title">Civic Gateway & Actions</h1>
        <p class="ck-rx-overview-sub">Choose a structured pathway or review your civic activity</p>
      </div>

      <!-- Core Gateways (Clean Minimalist Cards) -->
      <div class="ck-rx-actions-grid mb-6">
        <a href="javascript:void(0)" class="ck-rx-action-card" data-inject-prompt="I want to report an urgent municipal problem with photos">
          <div class="ck-rx-action-icon-box">${DSVG.alertTriangle}</div>
          <div class="ck-rx-action-info">
            <div class="ck-rx-action-title">Report a Problem</div>
            <div class="ck-rx-action-desc">Potholes, waste dumping, dark roads, or water leaks.</div>
          </div>
          <span class="ck-rx-action-arrow">${DSVG.arrowRight}</span>
        </a>

        <a href="javascript:void(0)" class="ck-rx-action-card" data-inject-prompt="I want to propose a new community initiative for our neighborhood">
          <div class="ck-rx-action-icon-box">${DSVG.lightbulb}</div>
          <div class="ck-rx-action-info">
            <div class="ck-rx-action-title">Start an Initiative</div>
            <div class="ck-rx-action-desc">Rally your neighbors for cleanups, greening & safety.</div>
          </div>
          <span class="ck-rx-action-arrow">${DSVG.arrowRight}</span>
        </a>

        <a href="javascript:void(0)" class="ck-rx-action-card" data-inject-prompt="I want to contribute my skills or sponsor tools for civic improvements">
          <div class="ck-rx-action-icon-box">${DSVG.users}</div>
          <div class="ck-rx-action-info">
            <div class="ck-rx-action-title">I want to Contribute</div>
            <div class="ck-rx-action-desc">Share professional skills, sponsor tools, or volunteer.</div>
          </div>
          <span class="ck-rx-action-arrow">${DSVG.arrowRight}</span>
        </a>

        <a href="javascript:void(0)" class="ck-rx-action-card" data-inject-prompt="What are my rights and municipal bylaws regarding Ward 14 roads and sanitation?">
          <div class="ck-rx-action-icon-box">${DSVG.bookOpen}</div>
          <div class="ck-rx-action-info">
            <div class="ck-rx-action-title">Understand an Issue</div>
            <div class="ck-rx-action-desc">Look up municipal bylaws, ward budget allocations & rights.</div>
          </div>
          <span class="ck-rx-action-arrow">${DSVG.arrowRight}</span>
        </a>
      </div>

      <!-- Activity Snapshot -->
      <div class="card p-6 mb-6">
        <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-primary); margin-bottom:12px;">Your Activity Summary</h3>
        <div class="ck-rx-stat-row">
          <div class="ck-rx-stat-col">
            <span class="ck-rx-stat-num">${active}</span>
            <span class="ck-rx-stat-label">Active Cases</span>
          </div>
          <div class="ck-rx-stat-divider"></div>
          <div class="ck-rx-stat-col">
            <span class="ck-rx-stat-num" style="color:#10b981;">${completed}</span>
            <span class="ck-rx-stat-label">Resolved</span>
          </div>
          <div class="ck-rx-stat-divider"></div>
          <div class="ck-rx-stat-col">
            <span class="ck-rx-stat-num" style="color:#64748b;">${drafts}</span>
            <span class="ck-rx-stat-label">Drafts</span>
          </div>
        </div>
      </div>
    </div><!-- /#ck-pane-overview -->


    <!-- ░░ 5. TAB PANE: COMMUNITY PULSE ░░ -->
    <div class="ck-tab-pane" id="ck-pane-community" style="display:none;">
      <div class="ck-rx-section-header">
        <div>
          <h2 class="ck-rx-section-title">Community Activity & Neighborhood Reports</h2>
          <p class="ck-rx-section-sub">Active civic operations and reported cases in Ward 14 & nearby zones</p>
        </div>
        <a href="/entities" class="ck-rx-section-link">View all ${DSVG.chevronRight}</a>
      </div>

      <div class="ck-rx-issues-grid mb-6">
        ${nearbyCards}
      </div>

      <div class="ck-rx-section-header" style="margin-top:36px;">
        <div>
          <h3 class="ck-rx-section-title">Trending Initiatives in Pune</h3>
          <p class="ck-rx-section-sub">Top community projects gaining citizen backing this month</p>
        </div>
        <a href="/entities" class="ck-rx-section-link">See all ${DSVG.chevronRight}</a>
      </div>

      <div class="ck-rx-trending-list">
        ${trendingList}
      </div>
    </div><!-- /#ck-pane-community -->


    <!-- ░░ 6. TAB PANE: MY TRACKERS ░░ -->
    <div class="ck-tab-pane" id="ck-pane-records" style="display:none;">
      <div class="ck-rx-section-header">
        <div>
          <h2 class="ck-rx-section-title">My Civic Trackers & Requests</h2>
          <p class="ck-rx-section-sub">Real-time status updates on issues and initiatives you submitted</p>
        </div>
        <button class="btn btn-primary btn-sm" id="ck-start-new-issue-btn">
          + New Civic Report
        </button>
      </div>

      <div class="card">
        ${renderRecentTable(myItems, false)}
      </div>
    </div><!-- /#ck-pane-records -->
  `;

  _attachTabEvents(user);
  _startPromptRotator();
}

/* ══════════════════════════════════════════════════════════════
   ROTATING PROMPT TEXT IN MOTION
   ══════════════════════════════════════════════════════════════ */
function _startPromptRotator() {
  if (rotatorIntervalId) clearInterval(rotatorIntervalId);

  const prompts = [
    'Broken streetlight outside Modern College on FC Road',
    'Dangerous crater pothole near Senapati Bapat Road junction',
    'Overflowing waste container not cleared for 2 days near lane 4',
    'Fallen tree branch blocking pedestrian path on Prabhat Road',
    'How do I register a neighborhood composting unit under PMC Bylaw 22?',
    'Water supply pressure dropped significantly in Shivajinagar today'
  ];

  let idx = 0;
  const promptEl = document.getElementById('ck-rotating-prompt-text');
  const boxEl = document.getElementById('ck-rotating-prompt-box');
  if (!promptEl || !boxEl) return;

  rotatorIntervalId = setInterval(() => {
    idx = (idx + 1) % prompts.length;
    promptEl.style.opacity = '0';
    promptEl.style.transform = 'translateY(-6px)';
    promptEl.style.transition = 'all 0.25s ease';

    setTimeout(() => {
      promptEl.textContent = prompts[idx];
      promptEl.style.transform = 'translateY(6px)';
      requestAnimationFrame(() => {
        promptEl.style.opacity = '1';
        promptEl.style.transform = 'translateY(0)';
      });
    }, 250);
  }, 4200);

  boxEl.addEventListener('click', () => {
    const cur = promptEl.textContent;
    const input = document.getElementById('ck-inline-textarea');
    if (input && cur) {
      input.value = cur;
      input.focus();
      _resizeTextarea(input);
    }
  });
}

function _resizeTextarea(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

/* ══════════════════════════════════════════════════════════════
   TABS & INLINE AGENT INTERACTION EVENTS
   ══════════════════════════════════════════════════════════════ */
function _attachTabEvents(user) {
  // Tab Switching
  const tabs = document.querySelectorAll('.ck-dash-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      document.querySelectorAll('.ck-tab-pane').forEach(p => p.style.display = 'none');
      const pane = document.getElementById(`ck-pane-${targetTab}`);
      if (pane) pane.style.display = 'block';
    });
  });

  // Action Cards in Overview pane that inject prompt & switch to AI tab
  document.querySelectorAll('[data-inject-prompt]').forEach(card => {
    card.addEventListener('click', () => {
      const prompt = card.getAttribute('data-inject-prompt');
      const aiTab = document.getElementById('ck-tab-btn-ai');
      if (aiTab) aiTab.click();
      const input = document.getElementById('ck-inline-textarea');
      if (input) {
        input.value = prompt;
        input.focus();
        _resizeTextarea(input);
      }
    });
  });

  document.getElementById('ck-start-new-issue-btn')?.addEventListener('click', () => {
    const aiTab = document.getElementById('ck-tab-btn-ai');
    if (aiTab) aiTab.click();
    const input = document.getElementById('ck-inline-textarea');
    if (input) input.focus();
  });

  // Rapid Chips inside chat
  document.querySelectorAll('.ck-ai-rapid-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt');
      const input = document.getElementById('ck-inline-textarea');
      if (input) {
        input.value = prompt;
        _resizeTextarea(input);
        _sendInlineMessage();
      }
    });
  });

  // Textarea dynamic auto-resize & keyboard submit
  const textarea = document.getElementById('ck-inline-textarea');
  if (textarea) {
    textarea.addEventListener('input', () => _resizeTextarea(textarea));
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        _sendInlineMessage();
      }
    });
  }

  // Send button
  document.getElementById('ck-inline-send-btn')?.addEventListener('click', () => _sendInlineMessage());

  // Location detection in conversationalist hero
  const detectBtn = document.getElementById('ck-detect-location-btn');
  const clearBtn = document.getElementById('ck-clear-location-btn');
  const locText = document.getElementById('ck-location-text');

  function updateCitizenLocUI() {
    if (citizenLocation && citizenLocation.latitude != null) {
      const label = citizenLocation.area
        ? `${citizenLocation.area} (${citizenLocation.latitude.toFixed(4)}, ${citizenLocation.longitude.toFixed(4)})`
        : `${citizenLocation.latitude.toFixed(4)}, ${citizenLocation.longitude.toFixed(4)}`;
      if (locText) locText.innerHTML = `GPS Location: <strong>${escapeHtml(label)}</strong>`;
      if (clearBtn) clearBtn.style.display = 'inline-flex';
      if (detectBtn) detectBtn.textContent = 'Update GPS';
    } else {
      if (locText) locText.innerHTML = 'GPS Location: <strong>Not attached</strong>';
      if (clearBtn) clearBtn.style.display = 'none';
      if (detectBtn) detectBtn.textContent = 'Use My Location';
    }
  }

  if (detectBtn) {
    detectBtn.addEventListener('click', () => {
      if (!navigator.geolocation) {
        toastError('Geolocation is not supported by your browser.');
        return;
      }
      detectBtn.disabled = true;
      detectBtn.textContent = 'Locating...';
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          citizenLocation = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            area: '',
            address: '',
          };
          try {
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`, {
              headers: { 'Accept': 'application/json' }
            });
            if (geoRes.ok) {
              const geoData = await geoRes.json();
              const addr = geoData.address || {};
              const locality = addr.suburb || addr.neighbourhood || addr.city_district || addr.ward || addr.town || addr.city || '';
              citizenLocation.area = locality;
              citizenLocation.address = geoData.display_name?.split(',').slice(0, 2).join(',') || locality;
            }
          } catch (_) {}
          detectBtn.disabled = false;
          updateCitizenLocUI();
          toastSuccess('GPS Location attached to assistant!');
        },
        (err) => {
          detectBtn.disabled = false;
          updateCitizenLocUI();
          toastError('Unable to retrieve GPS coordinates. Please check browser permissions.');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      citizenLocation = null;
      updateCitizenLocUI();
      toastSuccess('Location detached');
    });
  }

  // File Attachment
  const fileInput = document.getElementById('ck-inline-file-input');
  const attachBtn = document.getElementById('ck-attach-btn');
  if (attachBtn && fileInput) {
    attachBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files[0]) {
        citizenPendingFile = fileInput.files[0];
        _renderAttachmentPreview();
      }
    });
  }

  // Voice/Mic button
  const micBtn = document.getElementById('ck-mic-btn');
  const waveform = document.getElementById('ck-waveform');
  if (micBtn && textarea) {
    let recognition = null;
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        textarea.value = (textarea.value ? textarea.value + ' ' : '') + text;
        _resizeTextarea(textarea);
      };
      recognition.onend = () => {
        micBtn.classList.remove('active');
        if (waveform) waveform.style.display = 'none';
      };
    }

    micBtn.addEventListener('click', () => {
      const isActive = micBtn.classList.toggle('active');
      if (isActive) {
        if (waveform) waveform.style.display = 'flex';
        if (recognition) {
          try { recognition.start(); } catch (_) {}
        } else {
          // Fallback simulation
          textarea.placeholder = "Listening... Speak your civic complaint";
          setTimeout(() => {
            if (micBtn.classList.contains('active')) {
              textarea.value = "Pothole on main road near bus stop 4";
              _resizeTextarea(textarea);
              micBtn.classList.remove('active');
              if (waveform) waveform.style.display = 'none';
              textarea.placeholder = "Type your request or drop photo evidence...";
            }
          }, 2500);
        }
      } else {
        if (waveform) waveform.style.display = 'none';
        if (recognition) {
          try { recognition.stop(); } catch (_) {}
        }
      }
    });
  }

  // Reset conversation button
  document.getElementById('ck-reset-chat-btn')?.addEventListener('click', () => {
    if (confirm('Start a fresh conversation with Kalki?')) {
      citizenSessionId = 'ck-dash-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
      const messagesWrap = document.getElementById('ck-inline-chat-messages');
      if (messagesWrap) {
        messagesWrap.innerHTML = `
          <div class="agent-msg-row agent-msg-agent">
            <div class="agent-bubble-avatar" aria-hidden="true">${DSVG.sparkle}</div>
            <div class="agent-bubble agent-bubble-agent">
              New session started. How can I assist you with Ward 14 civic operations today?
            </div>
          </div>
        `;
      }
      toastSuccess('Conversation reset');
    }
  });

  // Fullscreen button (navigates to dedicated /agent/chat)
  document.getElementById('ck-fullscreen-chat-btn')?.addEventListener('click', () => {
    const input = document.getElementById('ck-inline-textarea');
    const msg = (input ? input.value : '').trim();
    const url = `/agent/chat?sessionId=${encodeURIComponent(citizenSessionId)}${msg ? '&message=' + encodeURIComponent(msg) : ''}`;
    window.navigate ? window.navigate(url) : (window.location.href = url);
  });
}

function _renderAttachmentPreview() {
  const bar = document.getElementById('ck-file-preview-bar');
  if (!bar) return;

  if (!citizenPendingFile) {
    bar.innerHTML = '';
    bar.style.display = 'none';
    return;
  }

  const isImage = citizenPendingFile.type.startsWith('image/');
  const previewUrl = isImage ? URL.createObjectURL(citizenPendingFile) : null;

  bar.style.display = 'flex';
  bar.innerHTML = `
    <div class="ck-ai-preview-chip">
      ${isImage ? `<img src="${previewUrl}" class="ck-ai-preview-thumb" alt="Preview" />` : `<span style="color:#64748b; display:inline-flex; align-items:center;">${DSVG.fileDoc}</span>`}
      <div style="display:flex; flex-direction:column; max-width:180px;">
        <span style="font-weight:600; font-size:0.75rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(citizenPendingFile.name)}</span>
        <span style="font-size:0.68rem; color:#64748b;">${formatFileSize(citizenPendingFile.size)}</span>
      </div>
      <button type="button" class="ck-ai-preview-remove" id="ck-remove-file-btn" title="Remove attachment">&times;</button>
    </div>
  `;

  document.getElementById('ck-remove-file-btn')?.addEventListener('click', () => {
    citizenPendingFile = null;
    const fileInput = document.getElementById('ck-inline-file-input');
    if (fileInput) fileInput.value = '';
    _renderAttachmentPreview();
  });
}

/* ══════════════════════════════════════════════════════════════
   INLINE AGENT MESSAGE HANDLER
   ══════════════════════════════════════════════════════════════ */
async function _sendInlineMessage(explicitMsg = null) {
  const textarea = document.getElementById('ck-inline-textarea');
  const message = explicitMsg !== null ? explicitMsg : (textarea ? textarea.value.trim() : '');
  const fileToUpload = citizenPendingFile;

  if (citizenIsWaiting || (!message && !fileToUpload)) return;
  citizenIsWaiting = true;

  const messagesWrap = document.getElementById('ck-inline-chat-messages');
  if (!messagesWrap) return;

  // Render User Message
  let attachmentHtml = '';
  if (fileToUpload) {
    const isImage = fileToUpload.type.startsWith('image/');
    if (isImage) {
      const previewUrl = URL.createObjectURL(fileToUpload);
      attachmentHtml = `
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px; background:rgba(0,0,0,0.15); padding:6px 10px; border-radius:8px;">
          <img src="${previewUrl}" style="width:42px; height:42px; object-fit:cover; border-radius:4px;" alt="Attached" />
          <div style="font-size:0.75rem;">
            <div style="font-weight:600; display:inline-flex; align-items:center; gap:4px;">${DSVG.camera} <span>${escapeHtml(fileToUpload.name)}</span></div>
            <div style="opacity:0.8;">${formatFileSize(fileToUpload.size)}</div>
          </div>
        </div>
      `;
    } else {
      attachmentHtml = `
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px; background:rgba(0,0,0,0.15); padding:6px 10px; border-radius:8px;">
          <span style="color:#ffffff; display:inline-flex; align-items:center;">${DSVG.fileDoc}</span>
          <div style="font-size:0.75rem;">
            <div style="font-weight:600;">${escapeHtml(fileToUpload.name)}</div>
            <div style="opacity:0.8;">${formatFileSize(fileToUpload.size)}</div>
          </div>
        </div>
      `;
    }
  }

  const userBubbleHtml = `
    <div class="agent-msg-row agent-msg-user">
      <div class="agent-bubble agent-bubble-user">
        ${attachmentHtml}
        ${message ? `<div>${escapeHtml(message)}</div>` : ''}
      </div>
    </div>
  `;
  messagesWrap.insertAdjacentHTML('beforeend', userBubbleHtml);

  // Clear inputs
  if (textarea) {
    textarea.value = '';
    _resizeTextarea(textarea);
  }
  citizenPendingFile = null;
  const fileInput = document.getElementById('ck-inline-file-input');
  if (fileInput) fileInput.value = '';
  _renderAttachmentPreview();

  // Thinking Bubble
  const thinkingHtml = `
    <div class="agent-msg-row agent-msg-agent" id="ck-inline-thinking">
      <div class="agent-bubble-avatar" aria-hidden="true">${DSVG.sparkle}</div>
      <div class="agent-bubble agent-bubble-agent">
        <div class="agent-thinking-dots" style="display:flex; gap:5px; align-items:center;">
          <span style="width:6px; height:6px; background:#94a3b8; border-radius:50%; animation:agent-dot-bounce 1.2s infinite ease-in-out;"></span>
          <span style="width:6px; height:6px; background:#94a3b8; border-radius:50%; animation:agent-dot-bounce 1.2s infinite ease-in-out 0.2s;"></span>
          <span style="width:6px; height:6px; background:#94a3b8; border-radius:50%; animation:agent-dot-bounce 1.2s infinite ease-in-out 0.4s;"></span>
          <span style="margin-left:6px; font-size:0.75rem; color:#64748b;">Analyzing Ward 14 rules...</span>
        </div>
      </div>
    </div>
  `;
  messagesWrap.insertAdjacentHTML('beforeend', thinkingHtml);
  messagesWrap.scrollTop = messagesWrap.scrollHeight;

  try {
    const res = await agentApi.chat(citizenSessionId, message, fileToUpload, citizenLocation);
    document.getElementById('ck-inline-thinking')?.remove();

    const data = res.data;
    if (data.type === 'confirm') {
      const summaryRows = (data.summary || []).map(s => `
        <div class="agent-confirm-row" style="display:flex; gap:10px; font-size:0.8rem; padding:4px 0; border-bottom:1px solid #f1f5f9;">
          <span style="font-weight:600; color:#64748b; min-width:110px;">${escapeHtml(s.label || s.field || '')}:</span>
          <span style="color:#0f172a; font-weight:500;">${escapeHtml(s.value || '')}</span>
        </div>
      `).join('');

      const confirmHtml = `
        <div class="agent-msg-row agent-msg-agent">
          <div class="agent-bubble-avatar" aria-hidden="true">${DSVG.sparkle}</div>
          <div class="agent-bubble agent-bubble-agent" style="max-width:440px;">
            ${data.text ? `<p style="margin-bottom:10px;">${renderMarkdownLite(data.text)}</p>` : ''}
            <div style="background:#fff; border:1.5px solid #ea580c; border-radius:10px; padding:12px; margin-top:8px;">
              <div style="font-weight:700; color:#ea580c; font-size:0.85rem; margin-bottom:8px;">
                Review Municipal Work Order Summary
              </div>
              <div style="display:flex; flex-direction:column; gap:4px;">
                ${summaryRows}
              </div>
              ${citizenLocation && citizenLocation.latitude != null ? `
                <div style="margin-top:8px; border-radius:8px; overflow:hidden; border:1px solid #cbd5e1;">
                  <div id="ck-confirm-minimap-${Date.now()}" data-lat="${citizenLocation.latitude}" data-lng="${citizenLocation.longitude}" class="entity-readonly-map-instance" style="height:130px; width:100%; z-index:1;"></div>
                </div>
              ` : ''}
              <div id="ck-confirm-btns" style="display:flex; gap:8px; margin-top:12px;">
                <button type="button" id="ck-confirm-yes-btn" class="btn btn-primary btn-sm" style="flex:1;">
                  Confirm &amp; Submit
                </button>
                <button type="button" id="ck-confirm-no-btn" class="btn btn-secondary btn-sm">
                  Modify
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      messagesWrap.insertAdjacentHTML('beforeend', confirmHtml);
      setTimeout(() => initReadOnlyMaps(), 60);

      document.getElementById('ck-confirm-yes-btn')?.addEventListener('click', () => {
        document.getElementById('ck-confirm-btns')?.remove();
        _sendInlineMessage('yes');
      });
      document.getElementById('ck-confirm-no-btn')?.addEventListener('click', () => {
        document.getElementById('ck-confirm-btns')?.remove();
        _sendInlineMessage('no, I need to make changes');
      });

    } else if (data.type === 'success' || data.entity_id) {
      const entityId = data.entity_id;
      const successHtml = `
        <div class="agent-msg-row agent-msg-agent">
          <div class="agent-bubble-avatar" aria-hidden="true">${DSVG.sparkle}</div>
          <div class="agent-bubble agent-bubble-agent" style="max-width:420px; background:#f0fdf4; border:1px solid #bbf7d0;">
            <div style="font-weight:700; color:#166534; font-size:0.92rem; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
              ${DSVG.shieldCheck} <span>Work Order Registered (#${entityId})</span>
            </div>
            <p style="font-size:0.82rem; color:#14532d; margin-bottom:10px;">
              ${escapeHtml(data.message || data.text || 'Your civic report has been dispatched to Ward 14 coordinators.')}
            </p>
            <div style="display:flex; gap:8px;">
              <a href="/entities/${entityId}" class="btn btn-primary btn-sm">
                View Entity Tracker #${entityId} →
              </a>
            </div>
          </div>
        </div>
      `;
      messagesWrap.insertAdjacentHTML('beforeend', successHtml);

    } else {
      // Normal conversation turn
      const replyHtml = `
        <div class="agent-msg-row agent-msg-agent">
          <div class="agent-bubble-avatar" aria-hidden="true">${DSVG.sparkle}</div>
          <div class="agent-bubble agent-bubble-agent">
            ${renderMarkdownLite(data.text || res.message || 'I have noted your request.')}
          </div>
        </div>
      `;
      messagesWrap.insertAdjacentHTML('beforeend', replyHtml);
    }
  } catch (err) {
    document.getElementById('ck-inline-thinking')?.remove();
    const errorHtml = `
      <div class="agent-msg-row agent-msg-agent">
        <div class="agent-bubble-avatar" aria-hidden="true">${DSVG.sparkle}</div>
        <div class="agent-bubble agent-bubble-agent" style="background:#fef2f2; border:1px solid #fecaca; color:#991b1b;">
          Could not communicate with Kalki AI service. Please verify server connection.
        </div>
      </div>
    `;
    messagesWrap.insertAdjacentHTML('beforeend', errorHtml);
  } finally {
    citizenIsWaiting = false;
    messagesWrap.scrollTop = messagesWrap.scrollHeight;
  }
}

function _blendWithCleanDemo(existing) {
  const defaults = [
    { name: 'FC Road Pedestrian Crosswalk & Safety Lights', area: 'Ward 14 · Shivajinagar', status: 'coordinator_approved' },
    { name: 'Kothrud Green Corridor Tree Plantation', area: 'Ward 9 · Kothrud', status: 'approved' },
    { name: 'Baner Sector 4 Waste Segregation Drive', area: 'Ward 2 · Baner', status: 'submitted' },
    { name: 'Model Colony Park Solar Lighting Audit', area: 'Ward 11 · Model Colony', status: 'coordinator_approved' }
  ];
  const combined = [...existing];
  for (const d of defaults) {
    if (combined.length >= 4) break;
    if (!combined.some(c => c.name === d.name)) {
      combined.push(d);
    }
  }
  return combined;
}

function _getCleanTrending() {
  const items = [
    { rank: '01', name: 'Kothrud Green Corridor Tree Plantation', area: 'Ward 9 · Kothrud', count: 64 },
    { rank: '02', name: 'FC Road Pedestrian Safety & Zebra Crossings', area: 'Ward 14 · Shivajinagar', count: 52 },
    { rank: '03', name: 'Baner Wet-Waste Decentralized Composting', area: 'Ward 2 · Baner', count: 41 },
  ];

  return items.map(item => `
    <div class="ck-rx-trending-row">
      <span class="ck-rx-trending-num">${item.rank}</span>
      <div class="ck-rx-trending-info">
        <div class="ck-rx-trending-name">${escapeHtml(item.name)}</div>
        <div class="ck-rx-trending-sub">${escapeHtml(item.area)} · ${item.count} citizens backing</div>
      </div>
      <a href="/entities" class="ck-rx-trending-arrow">
        ${DSVG.chevronRight}
      </a>
    </div>
  `).join('');
}

/* ══════════════════════════════════════════════════════════════
   ROLE-SPECIFIC OPERATIONS DASHBOARDS (COORDINATORS / DIRECTORS / ADMIN)
   ══════════════════════════════════════════════════════════════ */
async function renderCoordinatorAreaDash(container, user, metaData) {
  const area = user.assignedArea || user.assigned_area || null;

  if (!area) {
    container.innerHTML = `
      <div class="alert alert-warning mb-6">
        <strong>Area not configured:</strong> Your account does not have an assigned area.
        Please contact an administrator to assign your jurisdiction area before reviewing cases.
      </div>
    `;
    return;
  }

  const res = await apiEntities.list({ status: 'submitted', area: area, limit: 10 });
  const pending = res.data || [];
  
  container.innerHTML = `
    <div class="alert alert-info mb-6" style="display:flex; justify-content:space-between; align-items:center;">
      <div><strong>Jurisdiction Area:</strong> ${escapeHtml(area)}</div>
      <span class="badge badge-primary">Area Coordinator</span>
    </div>

    <div class="kpi-row mb-6">
      <div class="kpi-item accent-amber">
        <div class="kpi-num">${res.pagination?.total || pending.length}</div>
        <div class="kpi-label">Pending Area Verification</div>
      </div>
    </div>

    <div class="card mb-6">
      <div class="card-header border-b" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div class="card-title">Cases Requiring Action</div>
          <div class="card-subtitle">Submitted cases in ${escapeHtml(area)} awaiting verification</div>
        </div>
        <a href="/entities?status=submitted&area=${encodeURIComponent(area)}" class="btn btn-link btn-sm">View Queue</a>
      </div>
      ${renderRecentTable(pending, true)}
    </div>
  `;
}

async function renderCoordinatorGeneralDash(container, user, metaData) {
  const res = await apiEntities.list({ status: 'submitted', limit: 10 });
  const pending = res.data || [];
  
  container.innerHTML = `
    <div class="alert alert-info mb-6" style="display:flex; justify-content:space-between; align-items:center;">
      <div><strong>Operational Scope:</strong> General Coordinator (All Areas &amp; Escalations)</div>
      <span class="badge badge-primary">General Operations</span>
    </div>

    <div class="kpi-row mb-6">
      <div class="kpi-item accent-amber">
        <div class="kpi-num">${res.pagination?.total || pending.length}</div>
        <div class="kpi-label">Submitted Cases Awaiting Review</div>
      </div>
    </div>

    <div class="card mb-6">
      <div class="card-header border-b" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div class="card-title">Cases Requiring Action</div>
          <div class="card-subtitle">All submitted cases awaiting coordinator review</div>
        </div>
        <a href="/entities?status=submitted" class="btn btn-link btn-sm">View Queue</a>
      </div>
      ${renderRecentTable(pending, true)}
    </div>
  `;
}

async function renderDirectorDash(container, user, metaData) {
  const res = await apiEntities.list({ status: 'coordinator_approved', limit: 10 });
  const pending = res.data || [];
  
  container.innerHTML = `
    <div class="kpi-row mb-6">
      <div class="kpi-item accent-amber">
        <div class="kpi-num">${res.pagination?.total || pending.length}</div>
        <div class="kpi-label">Pending Executive Approval</div>
      </div>
    </div>

    <div class="card mb-6">
      <div class="card-header border-b" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div class="card-title">Executive Approval Queue</div>
          <div class="card-subtitle">Coordinator-approved cases awaiting final executive sign-off</div>
        </div>
        <a href="/entities?status=coordinator_approved" class="btn btn-link btn-sm">View Full Queue</a>
      </div>
      ${renderRecentTable(pending, true)}
    </div>
  `;
}

async function renderAdminDash(container, user, metaData) {
  const [total, submitted, approved] = await Promise.all([
    apiEntities.list({ limit: 1 }),
    apiEntities.list({ status: 'submitted', limit: 1 }),
    apiEntities.list({ status: 'approved', limit: 1 }),
  ]);
  
  container.innerHTML = `
    <div class="kpi-row mb-6">
      <div class="kpi-item accent-blue">
        <div class="kpi-num">${total.pagination?.total || 0}</div>
        <div class="kpi-label">Total System Cases</div>
      </div>
      <div class="kpi-item accent-amber">
        <div class="kpi-num">${submitted.pagination?.total || 0}</div>
        <div class="kpi-label">In Workflow</div>
      </div>
      <div class="kpi-item accent-green">
        <div class="kpi-num">${approved.pagination?.total || 0}</div>
        <div class="kpi-label">Approved & Active</div>
      </div>
    </div>

    <div class="card mb-6">
      <div class="card-header">
        <div class="card-title">Civic OS Administration & Module Deployment</div>
      </div>
      <div class="card-body p-6">
        <p class="mb-4 text-secondary">
          As a Platform Administrator, you can deploy new civic capability modules via No-Code metadata generation, manage users, and review platform accountability logs.
        </p>
        <div class="flex gap-3">
          <a href="/module-builder" class="btn btn-primary" style="display:inline-flex; align-items:center; gap:8px;">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
            No-Code Module Builder
          </a>
          <a href="/admin" class="btn btn-secondary">User & Role Admin</a>
          <a href="/reports" class="btn btn-secondary">Governance Reports</a>
        </div>
      </div>
    </div>
  `;
}

function renderRecentTable(items, showOwner = false) {
  if (!items || items.length === 0) {
    return `
      <div class="table-empty" style="padding:32px; text-align:center; color:var(--text-muted);">
        <p style="font-size:0.9rem; font-weight:500;">No active cases in this view.</p>
      </div>
    `;
  }
  
  const rows = items.map(item => `
    <tr>
      <td><a href="/entities/${item.entity_id}" class="text-link font-medium">#${item.entity_id}</a></td>
      <td>
        <a href="/entities/${item.entity_id}" style="color:var(--text-primary); text-decoration:none; font-weight:600;">
          ${escapeHtml(item.name)}
        </a>
      </td>
      <td><span class="badge badge-secondary">${escapeHtml(item.entityType?.name || 'Capability')}</span></td>
      ${showOwner ? `<td>${escapeHtml(item.owner?.name || 'System')}</td>` : ''}
      <td>${escapeHtml(item.area || '—')}</td>
      <td><span class="badge badge-${item.status}">${formatStatusLabel(item.status)}</span></td>
      <td><a href="/entities/${item.entity_id}" class="btn btn-secondary btn-sm">Review →</a></td>
    </tr>
  `).join('');
  
  return `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Case / Request Title</th>
            <th>Capability Type</th>
            ${showOwner ? '<th>Submitted By</th>' : ''}
            <th>Area</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}
