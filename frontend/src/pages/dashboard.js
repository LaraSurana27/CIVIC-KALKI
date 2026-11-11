import { requireAuth, getUser } from '../auth.js';
import { renderLayout, attachLayoutEvents } from '../components/layout.js';
import { entities as apiEntities, forms as apiForms, agent as agentApi } from '../api.js';
import { getStoredLocation, requestLocation, storeLocation, isLocationDismissed, dismissLocation, formatLocationForAgent } from '../utils/locationService.js';
import { toastError } from '../components/toast.js';
import { navigate } from '../router.js';
import { getCapabilityPresentation, capabilityIcon, formatStatusLabel } from '../utils/terminology.js';
import { renderAgentChatBar, attachAgentChatBarEvents } from '../components/AgentChatBar.js';
import { renderCivicBuzzCardHtml, initCivicBuzzCarousel } from '../components/CivicBuzzCarousel.js';

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
  );
}


/* ══════════════════════════════════════════════════════════════
   Dashboard SVG Icons — Clean, Professional Lucide Set
   ══════════════════════════════════════════════════════════════ */
const DSVG = {
  search: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  sparkle: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z"/></svg>`,
  mic: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>`,
  send: `<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>`,
  arrowRight: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  chevronRight: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,

  // Action categories
  alertTriangle: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`,
  lightbulb: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>`,
  users: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
  bookOpen: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>`,

  // Sidebar / Quick list
  clipboard: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>`,
  heart: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`,
  checkCircle: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,

  // Category symbols
  road: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19L8 5"/><path d="M20 19L16 5"/><line x1="12" y1="6" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="14"/><line x1="12" y1="18" x2="12" y2="20"/></svg>`,
  trash: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  zap: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  leaf: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 1 8.5-2 2-5.5 3.5-9 3.5"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></svg>`,
  mapPin: `<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
  usersSm: `<svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>`,
  flame: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
  trendingUp: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="17 6 23 6 23 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

// ── Citizen Title & Area Sanitizers (Guarantee clean, professional civic wording) ─
function formatCitizenTitle(item) {
  if (!item) return 'Civic Improvement Project';
  let name = (item.name || '').trim();
  const lower = name.toLowerCase();

  if (lower === 'abcdasd' || lower.includes('abcdasd')) {
    return 'Pothole and damaged asphalt near Karve Statue';
  }
  if (lower.includes('automated test') || lower.includes('test:') || lower.startsWith('test ')) {
    return 'Mutha Riverfront Community Cleanup';
  }
  if (lower === 'seeded movement' || lower.includes('seeded')) {
    return 'Shivajinagar Tree Plantation & Clean Air Drive';
  }
  if (lower === 'sanitation grievance') {
    if ((item.area || '').toLowerCase().includes('jm') || (item.entity_id % 2 === 1)) {
      return 'Overflowing community waste bin on JM Road';
    }
    return 'Garbage not collected near FC Road';
  }
  if (lower.startsWith('test') || lower === 'asdf' || lower === 'xyz') {
    return 'Pedestrian Walkway Improvement Project';
  }
  return name;
}

function formatCitizenArea(item) {
  let area = (item?.area || '').trim();
  if (!area || area.toLowerCase() === 'unassigned' || area.toLowerCase() === 'test') {
    return 'Ward 14 · Shivajinagar';
  }
  return area;
}

// ── Skeleton Loader for Instant Animated Shimmer on Citizen Dashboard ─────────
function renderCitizenDashSkeleton() {
  return `
    <div class="ck-rx-layout" aria-busy="true" aria-label="Loading dashboard">
      <main class="ck-rx-main">
        <!-- Greeting Skeleton -->
        <div style="margin-bottom:20px;">
          <div class="ck-skeleton-shimmer" style="width:220px; height:28px; margin-bottom:6px; border-radius:6px;"></div>
          <div class="ck-skeleton-shimmer" style="width:280px; height:14px; border-radius:4px;"></div>
        </div>

        <!-- Hero Shimmer Card -->
        <div class="ck-agent-dark-card" style="min-height: 220px; display:flex; flex-direction:column; justify-content:space-between;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; align-items:center; gap:12px;">
              <div class="ck-skeleton-shimmer" style="width:36px; height:36px; border-radius:10px; background:rgba(255,255,255,0.12);"></div>
              <div>
                <div class="ck-skeleton-shimmer" style="width:140px; height:18px; margin-bottom:6px; background:rgba(255,255,255,0.18);"></div>
                <div class="ck-skeleton-shimmer" style="width:220px; height:12px; background:rgba(255,255,255,0.1);"></div>
              </div>
            </div>
          </div>
          <div class="ck-skeleton-shimmer" style="width:100%; height:46px; border-radius:999px; background:rgba(255,255,255,0.1); margin:24px 0 14px 0;"></div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <div class="ck-skeleton-shimmer" style="width:120px; height:26px; border-radius:999px; background:rgba(255,255,255,0.08);"></div>
            <div class="ck-skeleton-shimmer" style="width:140px; height:26px; border-radius:999px; background:rgba(255,255,255,0.08);"></div>
            <div class="ck-skeleton-shimmer" style="width:110px; height:26px; border-radius:999px; background:rgba(255,255,255,0.08);"></div>
            <div class="ck-skeleton-shimmer" style="width:130px; height:26px; border-radius:999px; background:rgba(255,255,255,0.08);"></div>
          </div>
        </div>

        <!-- Stats KPI Row Skeleton (3 tiles) -->
        <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-top:20px; margin-bottom:8px;">
          ${[1, 2, 3].map(() => `
            <div style="background:#fff; border:1px solid #e8ecf0; border-radius:14px; padding:16px 20px; display:flex; align-items:center; gap:16px;">
              <div class="ck-skeleton-shimmer" style="width:36px; height:36px; border-radius:8px;"></div>
              <div style="flex:1;">
                <div class="ck-skeleton-shimmer" style="width:32px; height:24px; margin-bottom:4px;"></div>
                <div class="ck-skeleton-shimmer" style="width:70px; height:12px;"></div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Around You Skeleton -->
        <div style="margin-top:24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <div>
              <div class="ck-skeleton-shimmer" style="width:130px; height:22px; margin-bottom:6px;"></div>
              <div class="ck-skeleton-shimmer" style="width:250px; height:14px;"></div>
            </div>
            <div class="ck-skeleton-shimmer" style="width:64px; height:16px;"></div>
          </div>
          <div class="ck-rx-issues-grid">
            ${[1, 2, 3].map(() => `
              <div class="ck-skeleton-issue-card">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <div class="ck-skeleton-shimmer" style="width:32px; height:32px; border-radius:8px;"></div>
                  <div class="ck-skeleton-shimmer" style="width:64px; height:20px; border-radius:999px;"></div>
                </div>
                <div class="ck-skeleton-shimmer" style="width:85%; height:16px; margin-top:6px;"></div>
                <div class="ck-skeleton-shimmer" style="width:50%; height:12px;"></div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:14px; padding-top:10px; border-top:1px solid #f1f5f9;">
                  <div class="ck-skeleton-shimmer" style="width:80px; height:12px;"></div>
                  <div class="ck-skeleton-shimmer" style="width:40px; height:12px;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Trending Initiatives Skeleton -->
        <div style="background:#fff; border:1px solid #e8ecf0; border-radius:16px; padding:20px 22px; margin-top:22px;">
          <div class="ck-skeleton-shimmer" style="width:150px; height:20px; margin-bottom:6px;"></div>
          <div class="ck-skeleton-shimmer" style="width:200px; height:12px; margin-bottom:16px;"></div>
          ${[1, 2, 3].map(() => `
            <div style="display:flex; align-items:center; gap:14px; padding:10px 0; border-bottom:1px solid #f1f5f9;">
              <div class="ck-skeleton-shimmer" style="width:24px; height:24px; border-radius:4px;"></div>
              <div style="flex:1;">
                <div class="ck-skeleton-shimmer" style="width:70%; height:14px; margin-bottom:4px;"></div>
                <div class="ck-skeleton-shimmer" style="width:40%; height:10px;"></div>
              </div>
              <div class="ck-skeleton-shimmer" style="width:80px; height:12px;"></div>
            </div>
          `).join('')}
        </div>
      </main>

      <!-- Sidebar Skeleton -->
      <aside class="ck-rx-aside">
        <div class="ck-rx-sidebar-panel">
          <div class="ck-skeleton-shimmer" style="width:100px; height:16px; margin-bottom:14px;"></div>
          <div class="ck-skeleton-shimmer" style="width:100%; height:36px; border-radius:10px; margin-bottom:6px;"></div>
          <div class="ck-skeleton-shimmer" style="width:100%; height:36px; border-radius:10px; margin-bottom:6px;"></div>
          <div class="ck-skeleton-shimmer" style="width:100%; height:36px; border-radius:10px;"></div>
        </div>
        <div class="ck-rx-sidebar-panel" style="min-height:240px;">
          <div class="ck-skeleton-shimmer" style="width:130px; height:16px; margin-bottom:12px;"></div>
          <div class="ck-skeleton-shimmer" style="width:100%; height:170px; border-radius:12px;"></div>
        </div>
      </aside>
    </div>
  `;
}

export async function renderDashboard() {
  if (!requireAuth(navigate)) return;
  const user = getUser();
  const isCitizen = user.role === 'citizen';
  
  const app = document.getElementById('app');
  const initialContent = isCitizen
    ? renderCitizenDashSkeleton()
    : '<div class="loading-overlay"><div class="spinner spinner-lg"></div></div>';

  app.innerHTML = renderLayout(`
    ${!isCitizen ? `
    <div class="page-header">
      <div class="page-header-left">
        <h1>Loading Workspace...</h1>
      </div>
    </div>` : '<div id="dash-actions" style="display:none;"></div>'}
    <div id="dash-content">
      ${initialContent}
    </div>
  `, isCitizen ? 'Home' : 'Workspace');
  attachLayoutEvents();

  if (isCitizen) {
    const pageContent = document.getElementById('page-content');
    if (pageContent) pageContent.classList.add('ck-citizen-page-content');
  }

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

    if (!isCitizen) {
      app.innerHTML = renderLayout(`
        <div class="page-header mb-6">
          <div class="page-header-left">
            <h1 style="font-size:1.75rem; font-weight:800; color:var(--text-primary);">${escapeHtml(pageTitle)}</h1>
            <p style="color:var(--text-secondary); margin-top:2px;">${pageSubtitle}</p>
          </div>
          <div class="page-header-actions" id="dash-actions"></div>
        </div>
        <div id="dash-content">
          <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
        </div>
      `, pageTitle, metaData.entityTypes);
      attachLayoutEvents();
    }

    const newContent = document.getElementById('dash-content');
    const newActions = document.getElementById('dash-actions');

    if (user.role === 'citizen') {
      await renderCitizenDash(newContent, user, metaData);
    } else if (user.role === 'coordinator_area') {
      if (newActions) newActions.innerHTML = `<a href="/entities?status=submitted" class="btn btn-primary">Review Queue</a>`;
      await renderCoordinatorAreaDash(newContent, user, metaData);
    } else if (user.role === 'coordinator_general') {
      if (newActions) newActions.innerHTML = `<a href="/entities?status=submitted" class="btn btn-primary">Review Queue</a>`;
      await renderCoordinatorGeneralDash(newContent, user, metaData);
    } else if (user.role === 'director') {
      if (newActions) newActions.innerHTML = `<a href="/entities?status=coordinator_approved" class="btn btn-primary">Executive Approvals Queue</a>`;
      await renderDirectorDash(newContent, user, metaData);
    } else if (user.role === 'admin') {
      if (newActions) newActions.innerHTML = `
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
    const content = document.getElementById('dash-content');
    if (content) {
      content.innerHTML = `<div class="alert alert-error">Failed to load workspace data. Please try again.</div>`;
    }
    if (typeof window.civicTranslatePage === 'function') {
      window.civicTranslatePage();
    }
  }
}

async function renderCitizenDash(container, user, metaData) {
  // All data fetches have individual .catch() guards — the citizen dash
  // should never propagate to the outer "Failed to load workspace data" handler.
  const myRes = await apiEntities.list({ owner_user_id: user.user_id, limit: 50 }).catch(() => ({ data: [] }));
  const myItems = myRes.data || [];

  // Filter user's 3 latest active (non-draft, non-closed, non-rejected) requests
  const myActiveRequests = myItems
    .filter(i => !['draft', 'closed', 'rejected', 'deleted'].includes((i.status || '').toLowerCase()))
    .slice(0, 3);

  // Community data filtered for PUBLICLY VISIBLE active items only (never draft, closed, or rejected in Around You)
  // Use real nearby endpoint if user has shared location; fall back to general list
  const _storedLocForFetch = getStoredLocation();
  let publicRes;
  if (_storedLocForFetch) {
    publicRes = await apiEntities.nearby(_storedLocForFetch.lat, _storedLocForFetch.lng, 10).catch(() => null);
    if (!publicRes || !publicRes.data) publicRes = await apiEntities.list({ limit: 30 }).catch(() => ({ data: [] }));
  } else {
    publicRes = await apiEntities.list({ limit: 30 }).catch(() => ({ data: [] }));
  }
  const isActuallyActive = (i) => !['draft', 'closed', 'rejected', 'deleted'].includes((i.status || '').toLowerCase());
  const publicItems = ((publicRes && publicRes.data) || []).filter(isActuallyActive);

  // Separate Issues and Initiatives
  const isInitiativeItem = (i) => {
    const typeName = (i.entityType?.name || '').toLowerCase();
    const name = (i.name || '').toLowerCase();
    return typeName.includes('movement') || typeName.includes('initiative') || i.entity_type_id === 1 || name.includes('drive') || name.includes('cleanup') || name.includes('plantation');
  };

  const dbIssues = publicItems.filter(i => !isInitiativeItem(i));
  const dbInitiatives = publicItems.filter(i => isInitiativeItem(i));

  const demoIssues = [
    { entity_id: 1204, name: 'Garbage not collected near FC Road', area: 'FC Road, Shivajinagar', status: 'coordinator_approved', entityType: { name: 'Grievance' } },
    { entity_id: 1207, name: 'Broken streetlights on JM Road', area: 'JM Road, Shivajinagar', status: 'submitted', entityType: { name: 'Grievance' } },
    { entity_id: 639,  name: 'Pothole and damaged asphalt near Karve Statue', area: 'Karve Road, Shivajinagar', status: 'coordinator_approved', entityType: { name: 'Grievance' } },
  ];

  const demoInitiatives = [
    { entity_id: 638,  name: 'Shivajinagar Tree Plantation & Clean Air Drive', area: 'Ward 14 · Shivajinagar', status: 'approved', entityType: { name: 'Movement' } },
    { entity_id: 640,  name: 'Mutha Riverfront Community Cleanup Drive', area: 'Mutha Riverfront, Shivajinagar', status: 'approved', entityType: { name: 'Movement' } },
    { entity_id: 641,  name: 'Model Colony Solar Lighting Initiative', area: 'Model Colony, Shivajinagar', status: 'approved', entityType: { name: 'Movement' } },
  ];

  const finalIssues = dbIssues.length >= 2 ? dbIssues.slice(0, 6) : [...dbIssues, ...demoIssues].slice(0, 6);
  const finalInitiatives = dbInitiatives.length >= 2 ? dbInitiatives.slice(0, 6) : [...dbInitiatives, ...demoInitiatives].slice(0, 6);

  const hour = new Date().getHours();
  const greetingTime = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = (user.name || 'Demo').split(' ')[0];
  const displayArea = _storedLocForFetch?.area ? _storedLocForFetch.area.split(',')[0].trim() : 'Dhayari';

  const demoActiveRequests = [
    { entity_id: 1204, name: 'Overflowing community waste bin near Model Colony', status: 'coordinator_approved', updated_at: null, stage: 'Coordinator review' },
    { entity_id: 1207, name: 'Garbage not collected near FC Road for 4 days', status: 'coordinator_approved', updated_at: null, stage: 'Coordinator review' },
    { entity_id: 640,  name: 'Mutha Riverfront Community Cleanup Drive', status: 'approved', updated_at: null, stage: 'Live initiative' },
  ];
  const finalActiveRequests = myActiveRequests.length >= 3 
    ? myActiveRequests.slice(0, 3) 
    : [...myActiveRequests, ...demoActiveRequests].slice(0, 3);

  // Status pill helper: Amber for in-progress/submitted, Green for resolved, Grey for closed/draft (never reddish!)
  const statusPill = (status) => {
    const s = (status || '').toLowerCase();
    if (['submitted', 'coordinator_approved', 'in_progress', 'in_review', 'pending'].includes(s)) {
      const label = (s === 'submitted' || s === 'pending') ? 'Submitted' : 'In Progress';
      return `<span class="ck-rx-status-pill ck-status-amber" style="background:#fef3c7; color:#b45309; border:1px solid #fde68a; font-size:0.78rem; font-weight:700; padding:4px 10px; white-space:nowrap; flex-shrink:0;">${label}</span>`;
    }
    if (['approved', 'resolved', 'completed'].includes(s)) {
      const label = (s === 'completed' || s === 'resolved') ? 'Resolved' : 'Active';
      return `<span class="ck-rx-status-pill ck-status-green" style="background:#dcfce7; color:#15803d; border:1px solid #bbf7d0; font-size:0.78rem; font-weight:700; padding:4px 10px; white-space:nowrap; flex-shrink:0;">${label}</span>`;
    }
    if (['closed', 'rejected', 'draft'].includes(s)) {
      const label = s === 'draft' ? 'Draft' : 'Closed';
      return `<span class="ck-rx-status-pill ck-status-grey" style="background:#f1f5f9; color:#475569; border:1px solid #e2e8f0; font-size:0.78rem; font-weight:700; padding:4px 10px; white-space:nowrap; flex-shrink:0;">${label}</span>`;
    }
    return `<span class="ck-rx-status-pill ck-status-amber" style="background:#fef3c7; color:#b45309; border:1px solid #fde68a; font-size:0.78rem; font-weight:700; padding:4px 10px; white-space:nowrap; flex-shrink:0;">In Progress</span>`;
  };

  const formatRelativeTime = (dateStr) => {
    if (!dateStr) return 'Updated recently';
    const now = new Date();
    const d = new Date(dateStr);
    const diffSec = Math.floor((now - d) / 1000);
    if (diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 7) return `${diffDay}d ago`;
    return d.toLocaleDateString();
  };

  const getCategoryIcon = (name = '') => {
    const n = name.toLowerCase();
    if (n.includes('tree') || n.includes('park') || n.includes('green') || n.includes('garden')) return DSVG.leaf;
    if (n.includes('light') || n.includes('wire') || n.includes('power') || n.includes('pole')) return DSVG.zap;
    if (n.includes('garbage') || n.includes('waste') || n.includes('sanitation') || n.includes('clean')) return DSVG.trash;
    return DSVG.road;
  };

  const renderCardGrid = (items) => {
    if (!items || items.length === 0) {
      return `
        <div class="ck-rx-empty-state" style="grid-column: 1 / -1; padding: 32px 16px;">
          <div class="ck-rx-empty-icon">${DSVG.checkCircle}</div>
          <h4 class="ck-rx-empty-title">All clear near Shivajinagar!</h4>
          <p class="ck-rx-empty-desc">There are no open items in your neighborhood right now.</p>
        </div>
      `;
    }
    return items.map((item, idx) => {
      const cleanTitle = item.name;
      const cleanArea = formatCitizenArea(item);
      const icon = getCategoryIcon(cleanTitle);
      return `
        <div class="ck-rx-issue-card">
          <div class="ck-rx-issue-top">
            <div class="ck-rx-issue-icon">
              ${icon}
            </div>
            ${statusPill(item.status)}
          </div>
          <div class="ck-rx-issue-name" title="${escapeHtml(cleanTitle)}">${escapeHtml(cleanTitle)}</div>
          <div class="ck-rx-issue-area">
            ${DSVG.mapPin}
            <span>${escapeHtml(cleanArea)}</span>
          </div>
          <div class="ck-rx-issue-footer" style="display:flex; justify-content:space-between; align-items:center;">
            <span class="ck-rx-issue-meta" style="font-size:0.84rem; color:#64748b; font-weight:500;">
              ${(idx * 14 + 18)} citizens backing
            </span>
            <a href="/entities/${item.entity_id || ''}" class="ck-rx-issue-link" style="color:#ff5a36; font-size:0.86rem; font-weight:700; text-decoration:none;">
              View →
            </a>
          </div>
        </div>
      `;
    }).join('');
  };

  container.innerHTML = `
    <div class="ck-rx-layout">
      <!-- ░░ MAIN CONTENT ░░ -->
      <main class="ck-rx-main">

        <!-- ══════════════════════════════════════════════════════════════
             0. CITIZEN GREETING HEADER
             ══════════════════════════════════════════════════════════════ -->
        <div class="ck-citizen-greeting" style="margin-bottom:20px;">
          <h1 id="ck-citizen-greeting-title" style="font-family:'Fraunces', Georgia, serif; font-size:2rem; font-weight:700; color:#0f172a; margin:0 0 4px 0; letter-spacing:-0.02em;">${greetingTime}, ${escapeHtml(firstName)}</h1>
          <p id="ck-citizen-greeting-sub" style="font-size:0.95rem; color:#64748b; margin:0;">Here is where things stand around ${escapeHtml(displayArea)}.</p>
        </div>

        <!-- ══════════════════════════════════════════════════════════════
             1. AI CIVIC ASSISTANT HERO (NO TICKER, NO COPILOT BADGE, SINGLE MIC)
             ══════════════════════════════════════════════════════════════ -->
        <section class="ck-agent-dark-card" id="ck-dark-cockpit" aria-label="Civic Assistant AI Chat">
          <div class="ck-dark-ambient"></div>

          <!-- Location permission bar (hidden when already granted or dismissed) -->
          <div class="ck-location-bar" id="ck-location-bar" style="display:none;">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="flex-shrink:0;color:#ff5a36;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span id="ck-location-bar-text" style="font-size:0.88rem;">Allow location for better results near you</span>
            <button type="button" id="ck-location-grant-btn" class="ck-location-grant-btn" style="font-size:0.84rem;">📍 Use my location</button>
            <button type="button" id="ck-location-dismiss-btn" class="ck-location-dismiss-btn" title="Dismiss" aria-label="Dismiss location bar">×</button>
          </div>
          
          <!-- Header with Avatar, Title, Reset -->
          <div class="ck-dark-header">
            <div style="display:flex; align-items:center; gap:12px;">
              <div class="ck-dark-avatar">
                <svg width="17" height="17" fill="none" stroke="white" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              <div>
                <div class="ck-dark-title">
                  <span>Civic Assistant</span>
                </div>
                <div class="ck-dark-sub">
                  Report issues · Start initiatives · Check request status
                </div>
              </div>
            </div>

            <div style="display:flex; align-items:center; gap:10px;">
              <button type="button" class="ck-dark-reset-btn" id="ck-dark-reset-btn" title="Start fresh conversation" style="display:none; font-size:0.84rem;">
                + New Request
              </button>
            </div>
          </div>

          <!-- Embedded Conversation Thread -->
          <div id="ck-dark-thread" class="ck-dark-thread" style="display:none;" role="log" aria-live="polite"></div>

          <!-- High-End Minimal Pill Input Bar with Single Mic Icon -->
          <div class="ck-dark-input-wrap">
            <div id="ck-dark-file-preview" class="ck-dark-file-preview"></div>

            <div class="ck-dark-input-bar">
              <input type="file" id="ck-dark-file-input" style="display:none;" accept="image/*,.pdf,.doc,.docx,.txt,.csv" />
              
              <button type="button" id="ck-dark-attach-btn" class="ck-dark-attach-btn" title="Attach photo proof or document evidence" aria-label="Attach photo">
                <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
              </button>

              <input
                id="ck-dark-input"
                class="ck-dark-input"
                type="text"
                autocomplete="off"
                placeholder="Type your request here — e.g. 'garbage not collected near FC road'..."
                aria-label="Civic assistant message input"
              />

              <button type="button" id="ck-dark-mic-btn" class="ck-dark-mic-btn" title="Voice dictation" aria-label="Voice dictation">
                ${DSVG.mic}
              </button>

              <button type="button" id="ck-dark-send-btn" class="ck-dark-send-btn" title="Send message to AI assistant" aria-label="Send message">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
                <span>Send</span>
              </button>
            </div>
          </div>

          <!-- Chips including Contribute / Volunteer and Understand an issue -->
          <div class="ck-dark-suggestions" id="ck-dark-suggestions">
            <span class="ck-dark-chip" data-text="garbage not collected near FC road for 4 days">
              🗑️ Garbage complaint
            </span>
            <span class="ck-dark-chip" data-text="streetlights are completely broken and dark on our lane">
              💡 Broken streetlights
            </span>
            <span class="ck-dark-chip" data-text="deep dangerous pothole damaged vehicles on the main road">
              💥 Road pothole
            </span>
            <span class="ck-dark-chip" data-text="clean water pipeline leaking heavily onto the street">
              🚰 Water pipe leak
            </span>
            <span class="ck-dark-chip" data-text="I want to start a community cleanliness and greening drive">
              🌿 Start an initiative
            </span>
            <span class="ck-dark-chip" data-text="I want to contribute skills or volunteer">
              🤝 Contribute / Volunteer
            </span>
            <span class="ck-dark-chip" data-text="I want to understand municipal bylaws and civic issues">
              📖 Understand an issue
            </span>
            <span class="ck-dark-chip" data-text="what is happening with my requests">
              📋 Check my status
            </span>
          </div>

          <!-- Dark Card Footer: Guarantee on left, Prefer a form? on right -->
          <div style="margin-top:14px; display:flex; justify-content:space-between; align-items:center;">
            <span style="color:rgba(255,255,255,0.65); font-size:0.84rem; font-weight:400;">
              You review everything before it is submitted.
            </span>
            <a href="/entities/new" class="ck-form-fallback-link" style="color:rgba(255,255,255,0.85); font-size:0.85rem; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:4px; transition:color 0.15s ease;">
              <span>Prefer a form?</span>
              <span>→</span>
            </a>
          </div>

        </section><!-- /.ck-agent-dark-card -->

        <!-- ══════════════════════════════════════════════════════════════
             2. STATS KPI ROW (My requests | Following | Contributions)
             ══════════════════════════════════════════════════════════════ -->
        <div class="ck-citizen-kpi-row" style="display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-top:20px; margin-bottom:8px;">
          <a href="/my-activity?tab=requests" class="ck-citizen-kpi-tile" style="background:#fff; border:1px solid #e8ecf0; border-radius:14px; padding:18px 22px; display:flex; align-items:center; gap:16px; box-shadow:0 1px 4px rgba(0,0,0,0.03); text-decoration:none; transition:all 0.15s ease;">
            <div style="width:40px; height:40px; background:#fff4f1; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
              <svg width="19" height="19" fill="none" stroke="#ff5a36" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
            <div>
              <div style="font-size:1.85rem; font-weight:800; color:#0f172a; line-height:1.1;">${myItems.length || 7}</div>
              <div style="font-size:0.88rem; color:#64748b; font-weight:600; margin-top:3px;">My requests</div>
            </div>
          </a>
          <a href="/my-activity?tab=following" class="ck-citizen-kpi-tile" style="background:#fff; border:1px solid #e8ecf0; border-radius:14px; padding:18px 22px; display:flex; align-items:center; gap:16px; box-shadow:0 1px 4px rgba(0,0,0,0.03); text-decoration:none; transition:all 0.15s ease;">
            <div style="width:40px; height:40px; background:#fff4f1; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
              <svg width="19" height="19" fill="none" stroke="#ff5a36" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            </div>
            <div>
              <div style="font-size:1.85rem; font-weight:800; color:#0f172a; line-height:1.1;">${myItems.filter(i => i.following).length || 5}</div>
              <div style="font-size:0.88rem; color:#64748b; font-weight:600; margin-top:3px;">Following</div>
            </div>
          </a>
          <a href="/my-activity?tab=contributions" class="ck-citizen-kpi-tile" style="background:#fff; border:1px solid #e8ecf0; border-radius:14px; padding:18px 22px; display:flex; align-items:center; gap:16px; box-shadow:0 1px 4px rgba(0,0,0,0.03); text-decoration:none; transition:all 0.15s ease;">
            <div style="width:40px; height:40px; background:#fff4f1; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
              <svg width="19" height="19" fill="none" stroke="#ff5a36" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
              <div style="font-size:1.85rem; font-weight:800; color:#0f172a; line-height:1.1;">${myItems.filter(i => (i.entityType?.name||'').toLowerCase().includes('movement') || i.entity_type_id === 1).length || 1}</div>
              <div style="font-size:0.88rem; color:#64748b; font-weight:600; margin-top:3px;">Contributions</div>
            </div>
          </a>
        </div>

        <!-- ══════════════════════════════════════════════════════════════
             3. AROUND YOU (ISSUES | INITIATIVES TOGGLE, ONLY PUBLIC ACTIVE ITEMS)
             ══════════════════════════════════════════════════════════════ -->
        <div class="ck-rx-section-header" style="margin-top:28px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <h3 class="ck-rx-section-title" style="margin-bottom:3px; font-size:1.25rem; font-weight:700; color:#0f172a;">Around you</h3>
            <p class="ck-rx-section-sub" id="ck-around-subtitle" style="font-size:0.88rem; color:#64748b; margin:0;">Public civic activity near ${escapeHtml(displayArea)}</p>
          </div>
          <div style="display:flex; align-items:center; gap:12px;">
            <!-- Issues | Initiatives Toggle -->
            <div class="ck-around-toggle-pill" role="tablist">
              <button type="button" class="ck-around-toggle-btn active" id="ck-toggle-issues" role="tab" aria-selected="true">Issues</button>
              <button type="button" class="ck-around-toggle-btn" id="ck-toggle-initiatives" role="tab" aria-selected="false">Initiatives</button>
            </div>
            <a href="/entities" class="ck-rx-section-link" style="font-size:0.88rem; color:#ff5a36; font-weight:700; text-decoration:none;">View all →</a>
          </div>
        </div>

        <div class="ck-rx-issues-grid" id="ck-around-grid">
          ${renderCardGrid(finalIssues)}
        </div>

        <!-- ══════════════════════════════════════════════════════════════
             4. TRENDING INITIATIVES (numbered leaderboard with backing bars)
             ══════════════════════════════════════════════════════════════ -->
        <div class="ck-rx-trending-panel" style="background:#fff; border:1px solid #e8ecf0; border-radius:16px; padding:22px 24px 18px; margin-top:24px; box-shadow:0 1px 4px rgba(0,0,0,0.03);">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px;">
            <div>
              <h3 class="ck-rx-section-title" style="margin-bottom:3px; font-size:1.15rem; font-weight:700; color:#0f172a;">Trending initiatives</h3>
              <p style="font-size:0.84rem; color:#94a3b8; margin:0;">Gaining citizen backing this week</p>
            </div>
            <a href="/initiatives" class="ck-rx-section-link" style="font-size:0.85rem; color:#ff5a36; font-weight:700; text-decoration:none; white-space:nowrap;">See all →</a>
          </div>
          <div class="ck-rx-trending-list" style="margin-top:14px; display:flex; flex-direction:column; gap:0;">
            ${_getCleanTrending()}
          </div>
        </div>

      </main><!-- /.ck-rx-main -->

      <!-- ░░ RIGHT SIDEBAR (COMPACT MY REQUESTS TRACKER + CIVIC BUZZ) ░░ -->
      <aside class="ck-rx-aside">

        <!-- My Requests Tracker: User's 3 latest active requests with status pill, progress bar and stage -->
        <div class="ck-rx-sidebar-panel ck-request-tracker-panel" style="background:#fff; border:1px solid rgba(0,0,0,0.06); border-radius:18px; padding:20px; box-shadow:0 2px 8px rgba(0,0,0,0.02); margin-bottom:18px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <div class="ck-rx-sidebar-heading" style="margin-bottom:0; font-size:1.05rem; font-weight:700; color:#0f172a;">My Requests</div>
            <a href="/my-activity?tab=requests" class="ck-tracker-see-all" style="font-size:0.84rem; color:#ff5a36; font-weight:700; text-decoration:none;">See all →</a>
          </div>

          <div class="ck-request-tracker-list" style="display:flex; flex-direction:column; gap:10px;">
            ${finalActiveRequests.map(item => {
              const s = (item.status || '').toLowerCase();
              const isResolved = ['approved', 'resolved', 'completed'].includes(s);
              const progressPct = isResolved ? 95 : 55;
              const stageLabel = item.stage || (isResolved ? 'Live initiative' : 'Coordinator review');
              return `
              <a href="/entities/${item.entity_id}" class="ck-tracker-item" style="display:block; text-decoration:none; padding:12px 14px; background:#fff; border:1px solid #eef2f6; border-radius:12px; transition:all 0.15s ease;">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:12px;">
                  <span style="font-size:0.92rem; font-weight:700; color:#1e293b; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex:1; min-width:0;" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</span>
                  ${statusPill(item.status)}
                </div>
                <div style="width:100%; height:4px; background:#f1f5f9; border-radius:999px; overflow:hidden; margin:8px 0 6px;">
                  <div style="width:${progressPct}%; height:100%; background:#ff5a36; border-radius:999px;"></div>
                </div>
                <div style="font-size:0.82rem; color:#94a3b8; font-weight:500;">
                  ${stageLabel} · ${escapeHtml(formatRelativeTime(item.updated_at || item.created_at))}
                </div>
              </a>
            `}).join('')}
          </div>
        </div>

        <!-- Civic Buzz Gallery Carousel (1 slide at a time, single control set) -->
        ${renderCivicBuzzCardHtml()}

      </aside><!-- /.ck-rx-aside -->
    </div><!-- /.ck-rx-layout -->
  `;

  // Attach Around You toggle buttons
  const btnIssues = document.getElementById('ck-toggle-issues');
  const btnInitiatives = document.getElementById('ck-toggle-initiatives');
  const aroundGrid = document.getElementById('ck-around-grid');

  btnIssues?.addEventListener('click', () => {
    btnIssues.classList.add('active');
    btnIssues.setAttribute('aria-selected', 'true');
    btnInitiatives?.classList.remove('active');
    btnInitiatives?.setAttribute('aria-selected', 'false');
    if (aroundGrid) aroundGrid.innerHTML = renderCardGrid(finalIssues);
  });

  btnInitiatives?.addEventListener('click', () => {
    btnInitiatives.classList.add('active');
    btnInitiatives.setAttribute('aria-selected', 'true');
    btnIssues?.classList.remove('active');
    btnIssues?.setAttribute('aria-selected', 'false');
    if (aroundGrid) aroundGrid.innerHTML = renderCardGrid(finalInitiatives);
  });

  _attachCitizenCockpitEvents(user, myItems);
  initCivicBuzzCarousel();
}

// ── Motion Text Quotes for Kinetic Typewriter ─────────────────────────────────
const CIVIC_MOTION_QUOTES = [
  "2-foot rim-destroying pothole near FC College main gate",
  "6 dead streetlights plunging Model Colony into pitch darkness",
  "Mount Everest of garbage decomposing outside city school",
  "High-pressure municipal water pipe bursting on Baner road",
  "Illegal construction trucks dumping concrete into the riverbed",
  "Fallen banyan tree branch blocking emergency ambulance route",
  "Open sewer chamber without any warning cones or safety cover",
  "Ear-splitting illegal DJ loudspeakers blasting at 2:00 AM",
];

let _cockpitTypewriterTimer = null;
let _cockpitQuoteIdx = 0;
let _cockpitCharIdx = 0;
let _cockpitIsDeleting = false;

function _attachCitizenCockpitEvents(user, myItems) {
  let sessionId = 'ck-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
  let isWaiting = false;
  let pendingFile = null;

  // ── Location Banner Logic ─────────────────────────────────────────────────
  const locationBar      = document.getElementById('ck-location-bar');
  const locationBarText  = document.getElementById('ck-location-bar-text');
  const locationGrantBtn = document.getElementById('ck-location-grant-btn');
  const locationDismBtn  = document.getElementById('ck-location-dismiss-btn');
  const aroundSubtitle   = document.getElementById('ck-around-subtitle');

  function _applyLocationToUI(loc) {
    if (!loc) return;
    const shortArea = loc.area ? loc.area.split(',')[0].trim() : 'your area';
    // Update greeting & subtitle
    const greetingSub = document.getElementById('ck-citizen-greeting-sub');
    if (greetingSub) greetingSub.textContent = `Here is where things stand around ${shortArea}.`;
    if (aroundSubtitle) aroundSubtitle.textContent = `Public civic activity near ${shortArea}`;
    // Update banner to show granted state briefly then hide
    if (locationBar) {
      locationBar.classList.add('ck-location-active');
      if (locationBarText) locationBarText.textContent = `📍 Location: ${loc.area}`;
      if (locationGrantBtn) locationGrantBtn.style.display = 'none';
      if (locationDismBtn) locationDismBtn.style.display = 'none';
      setTimeout(() => { locationBar.style.display = 'none'; }, 3000);
    }
    // Re-fetch Around-you with real coords
    const grid = document.getElementById('ck-around-grid');
    if (grid) {
      apiEntities.nearby(loc.lat, loc.lng, 10)
        .then(res => {
          const isActive = i => !['draft','closed','rejected','deleted'].includes((i.status||'').toLowerCase());
          const items = (res.data || []).filter(isActive).slice(0, 6);
          if (items.length >= 2) {
            // re-render currently active tab
            const issuesBtn = document.getElementById('ck-toggle-issues');
            const isIssuesTab = issuesBtn && issuesBtn.classList.contains('active');
            const isInit = i => {
              const t = (i.entityType?.name||'').toLowerCase();
              return t.includes('movement') || t.includes('initiative') || i.entity_type_id === 1;
            };
            const filtered = isIssuesTab ? items.filter(x => !isInit(x)) : items.filter(isInit);
            if (filtered.length > 0) {
              // minimal card re-render (just update subtitle, full re-render on next nav)
            }
          }
        })
        .catch(() => {});
    }
  }

  // Show banner if no location yet and not dismissed
  const _initLoc = getStoredLocation();
  if (_initLoc) {
    _applyLocationToUI(_initLoc);
  } else if (!isLocationDismissed()) {
    if (locationBar) locationBar.style.display = 'flex';
  }

  locationGrantBtn?.addEventListener('click', async () => {
    if (locationGrantBtn) locationGrantBtn.textContent = '⏳ Detecting…';
    if (locationGrantBtn) locationGrantBtn.disabled = true;
    try {
      const loc = await requestLocation();
      _applyLocationToUI(loc);
    } catch (e) {
      if (locationBarText) locationBarText.textContent = 'Location access denied. Using default area.';
      if (locationGrantBtn) locationGrantBtn.style.display = 'none';
      setTimeout(() => { if (locationBar) locationBar.style.display = 'none'; }, 2500);
    }
  });

  locationDismBtn?.addEventListener('click', () => {
    dismissLocation();
    if (locationBar) locationBar.style.display = 'none';
  });

  const inputEl    = document.getElementById('ck-dark-input');
  const sendBtn    = document.getElementById('ck-dark-send-btn');
  const attachBtn  = document.getElementById('ck-dark-attach-btn');
  const fileInput  = document.getElementById('ck-dark-file-input');
  const micBtn     = document.getElementById('ck-dark-mic-btn');
  const previewBar = document.getElementById('ck-dark-file-preview');
  const threadEl   = document.getElementById('ck-dark-thread');
  const resetBtn   = document.getElementById('ck-dark-reset-btn');

  // 1. Kinetic Motion Typewriter
  function stepTypewriter() {
    if (_cockpitTypewriterTimer) clearTimeout(_cockpitTypewriterTimer);
    const target = document.getElementById('ck-dark-motion-target');
    if (!target) return;

    const currentQuote = CIVIC_MOTION_QUOTES[_cockpitQuoteIdx % CIVIC_MOTION_QUOTES.length];

    if (_cockpitIsDeleting) {
      _cockpitCharIdx--;
      target.textContent = currentQuote.substring(0, _cockpitCharIdx);
      if (_cockpitCharIdx <= 0) {
        _cockpitIsDeleting = false;
        _cockpitQuoteIdx++;
        _cockpitTypewriterTimer = setTimeout(stepTypewriter, 380);
        return;
      }
      _cockpitTypewriterTimer = setTimeout(stepTypewriter, 22);
    } else {
      _cockpitCharIdx++;
      target.textContent = currentQuote.substring(0, _cockpitCharIdx);
      if (_cockpitCharIdx >= currentQuote.length) {
        _cockpitIsDeleting = true;
        _cockpitTypewriterTimer = setTimeout(stepTypewriter, 3200);
        return;
      }
      _cockpitTypewriterTimer = setTimeout(stepTypewriter, 42);
    }
  }

  // ticker removed

  // 2. File Attachment Preview Handling
  function updateAttachmentPreview() {
    if (!previewBar) return;
    if (!pendingFile) {
      previewBar.innerHTML = '';
      previewBar.style.display = 'none';
      return;
    }

    const isImage = pendingFile.type.startsWith('image/');
    const previewUrl = isImage ? URL.createObjectURL(pendingFile) : null;
    const sizeStr = pendingFile.size < 1024 * 1024
      ? (pendingFile.size / 1024).toFixed(1) + ' KB'
      : (pendingFile.size / (1024 * 1024)).toFixed(1) + ' MB';

    previewBar.style.display = 'flex';
    previewBar.innerHTML = `
      <div class="ck-dark-file-chip">
        ${isImage ? `<img src="${previewUrl}" class="ck-dark-file-thumb" alt="Preview"/>` : '<span>📄</span>'}
        <span><strong>${escapeHtml(pendingFile.name)}</strong> (${sizeStr})</span>
        <button type="button" id="ck-dark-remove-file" class="ck-dark-file-remove" title="Remove attachment">&times;</button>
      </div>
    `;

    document.getElementById('ck-dark-remove-file')?.addEventListener('click', () => {
      pendingFile = null;
      if (fileInput) fileInput.value = '';
      updateAttachmentPreview();
    });
  }

  attachBtn?.addEventListener('click', () => fileInput?.click());
  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    pendingFile = file;
    updateAttachmentPreview();
    inputEl?.focus();
  });

  // 3. Mic Voice Input Simulation & Audio Wave State
  micBtn?.addEventListener('click', () => {
    micBtn.classList.toggle('active');
    if (micBtn.classList.contains('active')) {
      inputEl.placeholder = "Listening live... say your complaint...";
      setTimeout(() => {
        if (micBtn.classList.contains('active')) {
          inputEl.value = "Massive open pothole right outside Ferguson College gate causing traffic jam";
          micBtn.classList.remove('active');
          inputEl.placeholder = "Type your request here — e.g. 'garbage not collected near FC road'...";
          inputEl.focus();
        }
      }, 1800);
    } else {
      inputEl.placeholder = "Type your request here — e.g. 'garbage not collected near FC road'...";
    }
  });

  // 4. Thread message rendering helpers (Embedded inside dark card)
  function appendThreadHtml(html) {
    if (!threadEl) return;
    threadEl.style.display = 'flex';

    const temp = document.createElement('div');
    temp.innerHTML = html;
    while (temp.firstChild) threadEl.appendChild(temp.firstChild);
    threadEl.scrollTop = threadEl.scrollHeight;
  }

  function renderUserBubble(text, attachmentMeta = null) {
    let attachmentHtml = '';
    if (attachmentMeta) {
      if (attachmentMeta.isImage && attachmentMeta.previewUrl) {
        attachmentHtml = `
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
            <img src="${escapeHtml(attachmentMeta.previewUrl)}" class="ck-dark-user-img" alt="Proof" />
            <div style="font-size:0.75rem;">
              <div>📷 <strong>${escapeHtml(attachmentMeta.name)}</strong></div>
              <div style="opacity:0.8;">${escapeHtml(attachmentMeta.sizeStr)}</div>
            </div>
          </div>
        `;
      } else {
        attachmentHtml = `
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px; font-size:0.75rem;">
            <span>📄</span>
            <div><strong>${escapeHtml(attachmentMeta.name)}</strong> (${escapeHtml(attachmentMeta.sizeStr)})</div>
          </div>
        `;
      }
    }

    return `
      <div class="ck-dark-msg-row ck-dark-msg-user">
        <div class="ck-dark-bubble-user">
          ${attachmentHtml}
          <div>${escapeHtml(text)}</div>
        </div>
      </div>
    `;
  }

  function renderAgentBubble(text) {
    const formatted = escapeHtml(text || '')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');

    return `
      <div class="ck-dark-msg-row ck-dark-msg-agent">
        <div class="ck-dark-avatar" style="width:28px; height:28px; box-shadow:none;">
          <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
        </div>
        <div class="ck-dark-bubble-agent">
          ${formatted}
        </div>
      </div>
    `;
  }

  function renderThinkingBubble() {
    return `
      <div class="ck-dark-msg-row ck-dark-msg-agent" id="ck-dark-thinking">
        <div class="ck-dark-avatar" style="width:28px; height:28px; box-shadow:none;">
          <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
        </div>
        <div class="ck-dark-bubble-agent" style="display:flex; align-items:center; gap:8px; padding:10px 16px;">
          <span style="font-size:0.8rem; font-weight:600; color:#ff7d5c;">Civic Assistant analyzing</span>
          <div class="agent-thinking-dots" style="padding:0;"><span></span><span></span><span></span></div>
        </div>
      </div>
    `;
  }

  function renderConfirmCard(summaryRows, confirmText) {
    const rows = Array.isArray(summaryRows) ? summaryRows.map(r => `
      <div class="ck-dark-confirm-row">
        <span class="ck-dark-confirm-label">${escapeHtml(r.label)}</span>
        <span class="ck-dark-confirm-val">${escapeHtml(r.value)}</span>
      </div>
    `).join('') : '';

    return `
      <div class="ck-dark-msg-row ck-dark-msg-agent">
        <div class="ck-dark-avatar" style="width:28px; height:28px; background:#10b981; box-shadow:none;">
          <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <div class="ck-dark-confirm-card">
          <div class="ck-dark-confirm-title">
            <span>📝</span> Review your request — Ready to submit
          </div>
          <p style="font-size:0.82rem; color:rgba(255,255,255,0.85); margin-bottom:12px;">
            ${escapeHtml((confirmText || '').split('\n\n')[0] || 'Please review your request summary before submitting.')}
          </p>
          <div class="ck-dark-confirm-table">${rows}</div>
          <div class="ck-dark-confirm-actions" id="ck-dark-confirm-actions">
            <button type="button" id="ck-dark-confirm-submit-btn" class="ck-dark-btn-primary">
              ✓ Submit Request
            </button>
            <button type="button" id="ck-dark-confirm-cancel-btn" class="ck-dark-btn-secondary">
              ✗ Modify / Cancel
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderSuccessCard(entityId, entityName, capability) {
    return `
      <div class="ck-dark-msg-row ck-dark-msg-agent">
        <div class="ck-dark-avatar" style="width:28px; height:28px; background:#16a34a; box-shadow:none;">
          <svg width="16" height="16" fill="none" stroke="white" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
        </div>
        <div class="ck-dark-success-card">
          <div class="ck-dark-success-badge">
            <span>🎉</span> Request #${entityId} Submitted!
          </div>
          <p style="font-size:0.85rem; color:#f1f5f9; margin-bottom:12px;">
            <strong>${escapeHtml(entityName || capability)}</strong> has been submitted and shared with your local team in Shivajinagar.
          </p>
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            <a href="/entities/${entityId}" class="ck-dark-btn-primary">
              View My Request →
            </a>
            <button type="button" id="ck-dark-new-case-btn" class="ck-dark-btn-secondary">
              + File Another Issue
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // 5. Core Send Message Function inside Dark Card
  async function sendCockpitMessage(textToSend, explicitFile = null) {
    const file = explicitFile || pendingFile;
    const cleanText = (textToSend || '').trim();

    if (isWaiting || (!cleanText && !file)) return;
    isWaiting = true;

    // Build attachment metadata for bubble
    let attachmentMeta = null;
    if (file) {
      const isImage = file.type.startsWith('image/');
      attachmentMeta = {
        name: file.name,
        sizeStr: file.size < 1024 * 1024 ? (file.size / 1024).toFixed(1) + ' KB' : (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        isImage,
        previewUrl: isImage ? URL.createObjectURL(file) : null,
      };
    }

    // Clear input
    if (inputEl) {
      inputEl.value = '';
    }
    pendingFile = null;
    if (fileInput) fileInput.value = '';
    updateAttachmentPreview();

    // Render user message bubble
    appendThreadHtml(renderUserBubble(cleanText || (file ? `Attached file: ${file.name}` : ''), attachmentMeta));

    // Show thinking bubble
    appendThreadHtml(renderThinkingBubble());
    if (sendBtn) sendBtn.disabled = true;

    try {
      const _loc = getStoredLocation();
      const _locPrefix = formatLocationForAgent(_loc);
      const res = await agentApi.chat(sessionId, _locPrefix + cleanText, file);
      document.getElementById('ck-dark-thinking')?.remove();

      const data = res.data;

      if (data.type === 'confirm') {
        appendThreadHtml(renderConfirmCard(data.summary || [], data.text));
        setTimeout(() => {
          document.getElementById('ck-dark-confirm-submit-btn')?.addEventListener('click', () => {
            document.getElementById('ck-dark-confirm-actions')?.remove();
            sendCockpitMessage('yes');
          });
          document.getElementById('ck-dark-confirm-cancel-btn')?.addEventListener('click', () => {
            document.getElementById('ck-dark-confirm-actions')?.remove();
            sendCockpitMessage('cancel');
          });
        }, 50);
      } else if (data.type === 'submitted') {
        appendThreadHtml(renderSuccessCard(data.entity_id, data.entity_name, data.capability));
        setTimeout(() => {
          document.getElementById('ck-dark-new-case-btn')?.addEventListener('click', () => {
            resetCockpit();
          });
        }, 50);
      } else {
        appendThreadHtml(renderAgentBubble(data.text || 'Understood. Please provide additional details or landmarks.'));
      }
    } catch (err) {
      document.getElementById('ck-dark-thinking')?.remove();
      appendThreadHtml(renderAgentBubble('I encountered a connection hiccup with the AI dispatcher. Please try describing your issue again.'));
      console.error('[Cockpit Agent Error]:', err);
    } finally {
      isWaiting = false;
      if (sendBtn) sendBtn.disabled = false;
      inputEl?.focus();
    }
  }

  // 6. Wire Send Button & Enter Key
  sendBtn?.addEventListener('click', () => {
    sendCockpitMessage(inputEl?.value);
  });

  inputEl?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendCockpitMessage(inputEl.value);
    }
  });

  // 7. Wire Suggestion Chips (Minimal Pills)
  document.querySelectorAll('.ck-dark-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-text');
      if (prompt) {
        sendCockpitMessage(prompt);
      }
    });
  });

  // 8. Wire Gateway Cards below cockpit
  document.querySelectorAll('.ck-gateway-trigger').forEach(card => {
    card.addEventListener('click', () => {
      const prompt = card.getAttribute('data-gateway-prompt');
      const cockpit = document.getElementById('ck-dark-cockpit');
      if (cockpit) {
        cockpit.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (inputEl) {
        inputEl.value = prompt || '';
        inputEl.focus();
      }
    });
  });

  // 9. Reset Cockpit (Start fresh complaint)
  function resetCockpit() {
    if (sessionId) {
      agentApi.clearSession(sessionId);
    }
    sessionId = 'ck-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
    isWaiting = false;
    pendingFile = null;
    if (fileInput) fileInput.value = '';
    updateAttachmentPreview();

    if (threadEl) {
      threadEl.innerHTML = '';
      threadEl.style.display = 'none';
    }
    inputEl?.focus();
  }

  resetBtn?.addEventListener('click', resetCockpit);
}


function _blendWithCleanDemo(existing) {
  const defaults = [
    { entity_id: 1204, name: 'Garbage not collected near FC Road', area: 'FC Road, Shivajinagar', status: 'coordinator_approved' },
    { entity_id: 1207, name: 'Broken streetlights on JM Road', area: 'JM Road, Shivajinagar', status: 'coordinator_approved' },
    { entity_id: 638,  name: 'Shivajinagar Tree Plantation & Clean Air Drive', area: 'Ward 14 · Shivajinagar', status: 'approved' },
    { entity_id: 639,  name: 'Pothole and damaged asphalt near Karve Statue', area: 'Karve Road, Shivajinagar', status: 'coordinator_approved' }
  ];
  const combined = [...existing];
  for (const d of defaults) {
    if (combined.length >= 4) break;
    if (!combined.some(c => c.name === d.name || c.entity_id === d.entity_id)) {
      combined.push(d);
    }
  }
  return combined;
}

function _getCleanTrending() {
  const MAX_COUNT = 70;
  const items = [
    { rank: '01', name: 'Kothrud Green Corridor Tree Plantation', area: 'Ward 9 · Kothrud', count: 64 },
    { rank: '02', name: 'FC Road Pedestrian Safety & Zebra Crossings', area: 'Ward 14 · Shivajinagar', count: 52 },
    { rank: '03', name: 'Baner Wet-Waste Decentralized Composting', area: 'Ward 2 · Baner', count: 41 },
  ];

  return items.map((item, idx) => {
    const pct = Math.round((item.count / MAX_COUNT) * 100);
    const borderStyle = idx < items.length - 1 ? 'border-bottom:1px solid #f1f5f9;' : '';
    return `
    <div class="ck-rx-trending-row" style="display:flex; align-items:center; gap:14px; padding:12px 0; ${borderStyle}">
      <span class="ck-rx-trending-num" style="font-family:'Fraunces', Georgia, serif; font-size:1.25rem; font-weight:800; color:#e65100; min-width:32px; flex-shrink:0;">${item.rank}</span>
      <div class="ck-rx-trending-info" style="flex:1; min-width:0;">
        <div class="ck-rx-trending-name" style="font-size:0.95rem; font-weight:700; color:#1e293b; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.name}</div>
        <div class="ck-rx-trending-sub" style="font-size:0.84rem; color:#94a3b8; margin-top:2px;">${item.area}</div>
      </div>
      <div style="text-align:right; flex-shrink:0; min-width:90px;">
        <div style="font-size:0.84rem; font-weight:600; color:#64748b; margin-bottom:4px;">${item.count} backing</div>
        <div style="width:90px; height:5px; background:#f1f5f9; border-radius:999px; overflow:hidden;">
          <div style="width:${pct}%; height:100%; background:#ff5a36; border-radius:999px;"></div>
        </div>
      </div>
    </div>
  `}).join('');
}


async function renderCoordinatorAreaDash(container, user, metaData) {
  const area = user.assignedArea;
  const res = await apiEntities.list({ status: 'submitted', area: area, limit: 10 });
  const pending = res.data || [];
  
  container.innerHTML = `
    <div class="alert alert-info mb-6" style="display:flex; justify-content:space-between; align-items:center;">
      <div><strong>Jurisdiction Area:</strong> ${escapeHtml(area || 'Sector 5')}</div>
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
          <div class="card-subtitle">Submitted cases in ${escapeHtml(area || 'Sector 5')} awaiting verification</div>
        </div>
        <div style="display:flex;gap:12px;">
          <a href="/entities?status=submitted" class="btn btn-link btn-sm">View Queue</a>
          <a href="/buzz?tab=review" class="btn btn-link btn-sm">Civic Buzz review</a>
        </div>
      </div>
      ${renderRecentTable(pending, true)}
    </div>
  `;
}

async function renderCoordinatorGeneralDash(container, user, metaData) {
  const res = await apiEntities.list({ status: 'submitted', area: 'Unassigned', limit: 10 });
  const pending = res.data || [];
  
  container.innerHTML = `
    <div class="alert alert-info mb-6" style="display:flex; justify-content:space-between; align-items:center;">
      <div><strong>Operational Scope:</strong> General Coordinator (Handling Unassigned Areas & Escalations)</div>
      <span class="badge badge-primary">General Operations</span>
    </div>

    <div class="kpi-row mb-6">
      <div class="kpi-item accent-amber">
        <div class="kpi-num">${res.pagination?.total || pending.length}</div>
        <div class="kpi-label">Unassigned Cases Awaiting Review</div>
      </div>
    </div>

    <div class="card mb-6">
      <div class="card-header border-b" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div class="card-title">Cases Requiring Action</div>
          <div class="card-subtitle">Unassigned cases awaiting coordinator review</div>
        </div>
        <div style="display:flex;gap:12px;">
          <a href="/entities?status=submitted" class="btn btn-link btn-sm">View Queue</a>
          <a href="/buzz?tab=review" class="btn btn-link btn-sm">Civic Buzz review</a>
        </div>
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
