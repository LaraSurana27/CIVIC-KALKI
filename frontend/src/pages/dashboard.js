import { requireAuth, getUser } from '../auth.js';
import { renderLayout, attachLayoutEvents } from '../components/layout.js';
import { entities as apiEntities, forms as apiForms } from '../api.js';
import { toastError } from '../components/toast.js';
import { navigate } from '../router.js';
import { getCapabilityPresentation, capabilityIcon, formatStatusLabel } from '../utils/terminology.js';
import { renderAgentChatBar, attachAgentChatBarEvents } from '../components/AgentChatBar.js';

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

async function renderCitizenDash(container, user, metaData) {
  const myRes = await apiEntities.list({ owner_user_id: user.user_id, limit: 50 }).catch(() => ({ data: [] }));
  const myItems = myRes.data || [];

  const drafts    = myItems.filter(i => i.status === 'draft').length;
  const active    = myItems.filter(i => ['submitted', 'coordinator_approved', 'in_review'].includes(i.status)).length;
  const completed = myItems.filter(i => ['approved', 'closed', 'rejected'].includes(i.status)).length;
  const following = myItems.filter(i => i.isFollowing).length || 5;

  // Real community data or clean fallback
  const publicRes = await apiEntities.list({ limit: 6 }).catch(() => ({ data: [] }));
  let publicItems = publicRes.data || [];
  let nearbyItems = publicItems.length >= 3 ? publicItems : _blendWithCleanDemo(publicItems);

  // Status pill helper (clean & minimal)
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
    return `<span class="ck-rx-status-pill" style="background:${s.bg}; color:${s.color};">${s.label}</span>`;
  };

  const getCategoryIcon = (name = '') => {
    const n = name.toLowerCase();
    if (n.includes('tree') || n.includes('park') || n.includes('green') || n.includes('garden')) return DSVG.leaf;
    if (n.includes('light') || n.includes('wire') || n.includes('power') || n.includes('pole')) return DSVG.zap;
    if (n.includes('garbage') || n.includes('waste') || n.includes('sanitation') || n.includes('clean')) return DSVG.trash;
    return DSVG.road;
  };

  // Nearby items rendered in clean, structured cards
  const nearbyCards = nearbyItems.map((item, idx) => {
    const icon = getCategoryIcon(item.name);
    return `
      <div class="ck-rx-issue-card">
        <div class="ck-rx-issue-top">
          <div class="ck-rx-issue-icon">
            ${icon}
          </div>
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

  // Trending list
  const trendingList = _getCleanTrending();

  container.innerHTML = `
    <!-- ░░ REVENUEX-STYLE MINIMALIST EDITORIAL DASHBOARD ░░ -->
    <div class="ck-rx-layout">
      <!-- ░░ MAIN CONTENT ░░ -->
      <main class="ck-rx-main">

        <!-- 1. Sleek Search & AI Command Bar (RevenueX Style) -->
        <div class="ck-rx-search-wrap">
          <div class="ck-rx-search-bar">
            <span class="ck-rx-search-icon">${DSVG.search}</span>
            <input
              id="ck-hero-input"
              type="text"
              autocomplete="off"
              placeholder="Search data, reports, or ask Kalki AI..."
              class="ck-rx-search-input"
              aria-label="Search data, reports, or ask Kalki AI"
            />
            <button class="ck-rx-mic-btn" id="ck-hero-mic-btn" title="Voice input">
              ${DSVG.mic}
            </button>
            <button class="ck-rx-send-btn" id="ck-hero-send-btn" title="Submit">
              ${DSVG.send}
            </button>
            <div class="ck-rx-kbd-badge">⌘ + Space</div>
          </div>
        </div>

        <!-- 2. Performance / Civic Overview Heading -->
        <div class="ck-rx-overview-head">
          <h1 class="ck-rx-overview-title">Civic Overview</h1>
          <p class="ck-rx-overview-sub">Your reports, ward resolutions, and initiatives — all in one place</p>
        </div>

        <!-- 3. Featured Silk Banner in Brand Orange Hue (Direct RevenueX Homage) -->
        <div class="ck-rx-featured-card">
          <div class="ck-rx-featured-silk"></div>
          <div class="ck-rx-featured-content">
            <div class="ck-rx-featured-badge">
              <span class="ck-rx-badge-dot"></span>
              <span class="ck-rx-badge-icon">${DSVG.sparkle}</span>
              <span>Kalki AI · Live data</span>
            </div>
            
            <h2 class="ck-rx-featured-heading">Explore your neighborhood</h2>
            <p class="ck-rx-featured-sub">Dive into trends, active resolutions, and community insights</p>

            <!-- Clean, professional quick action chips -->
            <div class="ck-rx-chips-row">
              <button class="ck-rx-chip" data-text="Report an overflowing garbage dump">Overflowing garbage</button>
              <button class="ck-rx-chip" data-text="Report broken streetlights on my road">Broken streetlight</button>
              <button class="ck-rx-chip" data-text="Start a community park cleanup drive">Park cleanup</button>
              <button class="ck-rx-chip" data-text="Who is my ward coordinator?">Who is my coordinator?</button>
            </div>
          </div>
        </div>

        <!-- 4. Core Gateways (Clean Minimalist Cards) -->
        <div class="ck-rx-actions-grid">
          <a href="/agent/chat?message=I+want+to+report+a+problem" class="ck-rx-action-card">
            <div class="ck-rx-action-icon-box">
              ${DSVG.alertTriangle}
            </div>
            <div class="ck-rx-action-info">
              <div class="ck-rx-action-title">Report a Problem</div>
              <div class="ck-rx-action-desc">Potholes, waste dumping, dark roads, or water leaks.</div>
            </div>
            <span class="ck-rx-action-arrow">${DSVG.arrowRight}</span>
          </a>

          <a href="/agent/chat?message=I+want+to+start+an+initiative" class="ck-rx-action-card">
            <div class="ck-rx-action-icon-box">
              ${DSVG.lightbulb}
            </div>
            <div class="ck-rx-action-info">
              <div class="ck-rx-action-title">Start an Initiative</div>
              <div class="ck-rx-action-desc">Rally your neighbors for cleanups, greening & safety.</div>
            </div>
            <span class="ck-rx-action-arrow">${DSVG.arrowRight}</span>
          </a>

          <a href="/agent/chat?message=I+want+to+contribute+or+volunteer" class="ck-rx-action-card">
            <div class="ck-rx-action-icon-box">
              ${DSVG.users}
            </div>
            <div class="ck-rx-action-info">
              <div class="ck-rx-action-title">I want to Contribute</div>
              <div class="ck-rx-action-desc">Share professional skills, sponsor tools, or volunteer.</div>
            </div>
            <span class="ck-rx-action-arrow">${DSVG.arrowRight}</span>
          </a>

          <a href="/agent/chat?message=I+want+to+understand+a+civic+issue" class="ck-rx-action-card">
            <div class="ck-rx-action-icon-box">
              ${DSVG.bookOpen}
            </div>
            <div class="ck-rx-action-info">
              <div class="ck-rx-action-title">Understand an Issue</div>
              <div class="ck-rx-action-desc">Look up municipal bylaws, ward budget allocations & rights.</div>
            </div>
            <span class="ck-rx-action-arrow">${DSVG.arrowRight}</span>
          </a>
        </div>

        <!-- 5. What's Happening Around You (RevenueX Table / Grid Style) -->
        <div class="ck-rx-section-header">
          <div>
            <h3 class="ck-rx-section-title">Community Activity</h3>
            <p class="ck-rx-section-sub">Active civic operations and reported cases in your ward</p>
          </div>
          <a href="/entities" class="ck-rx-section-link">View all ${DSVG.chevronRight}</a>
        </div>

        <div class="ck-rx-issues-grid">
          ${nearbyCards}
        </div>

        <!-- 6. Trending in your city -->
        <div class="ck-rx-section-header" style="margin-top:36px;">
          <div>
            <h3 class="ck-rx-section-title">Trending in Your City</h3>
            <p class="ck-rx-section-sub">Top initiatives gaining citizen backing this week</p>
          </div>
          <a href="/entities" class="ck-rx-section-link">See all ${DSVG.chevronRight}</a>
        </div>

        <div class="ck-rx-trending-list">
          ${trendingList}
        </div>

      </main><!-- /.ck-rx-main -->

      <!-- ░░ RIGHT SIDEBAR (MINIMALIST REVENUEX STYLE) ░░ -->
      <aside class="ck-rx-aside">

        <!-- Inboxes / Quick Actions -->
        <div class="ck-rx-sidebar-panel">
          <div class="ck-rx-sidebar-heading">My Inboxes</div>
          
          <a href="/entities" class="ck-rx-inbox-item">
            <div class="ck-rx-inbox-icon">
              ${DSVG.clipboard}
            </div>
            <span class="ck-rx-inbox-label">My Requests</span>
            <span class="ck-rx-inbox-badge">${active + drafts}</span>
            <span class="ck-rx-inbox-chevron">${DSVG.chevronRight}</span>
          </a>

          <a href="/entities?following=1" class="ck-rx-inbox-item">
            <div class="ck-rx-inbox-icon">
              ${DSVG.heart}
            </div>
            <span class="ck-rx-inbox-label">Following</span>
            <span class="ck-rx-inbox-badge">${following}</span>
            <span class="ck-rx-inbox-chevron">${DSVG.chevronRight}</span>
          </a>

          <a href="/entities?status=approved" class="ck-rx-inbox-item">
            <div class="ck-rx-inbox-icon">
              ${DSVG.checkCircle}
            </div>
            <span class="ck-rx-inbox-label">Contributions</span>
            <span class="ck-rx-inbox-badge">${completed}</span>
            <span class="ck-rx-inbox-chevron">${DSVG.chevronRight}</span>
          </a>
        </div>

        <!-- Civic Spotlight (Clean, No Cringe Memes) -->
        <div class="ck-rx-sidebar-panel">
          <div class="ck-rx-sidebar-heading">Civic Spotlight</div>
          <div class="ck-rx-spotlight-card">
            <div class="ck-rx-spotlight-tag">Featured Movement</div>
            <div class="ck-rx-spotlight-title">FC Road Pedestrian Safety & Crossing</div>
            <div class="ck-rx-spotlight-desc">Citizens organized 120 verified signatures to install a raised crosswalk near Fergusson College.</div>
            <div class="ck-rx-spotlight-stats">
              <span>${DSVG.usersSm} 42 supporters</span>
              <span>·</span>
              <span>Ward 14</span>
            </div>
            <a href="/entities" class="btn btn-primary btn-sm" style="width:100%; text-align:center; margin-top:8px;">
              Support Initiative
            </a>
          </div>
        </div>

        <!-- Activity Overview -->
        <div class="ck-rx-sidebar-panel">
          <div class="ck-rx-sidebar-heading">Activity Snapshot</div>
          <div class="ck-rx-stat-row">
            <div class="ck-rx-stat-col">
              <span class="ck-rx-stat-num">${active}</span>
              <span class="ck-rx-stat-label">Active</span>
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
          <a href="/entities" class="btn btn-secondary btn-sm" style="width:100%; text-align:center; margin-top:12px;">
            View Full Records ${DSVG.chevronRight}
          </a>
        </div>

      </aside><!-- /.ck-rx-aside -->
    </div><!-- /.ck-rx-layout -->
  `;

  _attachEvents();
}

function _attachEvents() {
  const input   = document.getElementById('ck-hero-input');
  const sendBtn = document.getElementById('ck-hero-send-btn');
  const micBtn  = document.getElementById('ck-hero-mic-btn');
  if (!input || !sendBtn) return;

  document.querySelectorAll('.ck-rx-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.getAttribute('data-text');
      if (text) {
        input.value = text;
        input.focus();
      }
    });
  });

  if (micBtn) {
    micBtn.addEventListener('click', () => {
      micBtn.classList.toggle('active');
      if (micBtn.classList.contains('active')) {
        input.placeholder = "Listening... describe your issue";
        setTimeout(() => {
          if (micBtn.classList.contains('active')) {
            input.value = "Pothole on Main Road near Bus Stop 4";
            micBtn.classList.remove('active');
            input.placeholder = "Search data, reports, or ask Kalki AI...";
          }
        }, 2000);
      } else {
        input.placeholder = "Search data, reports, or ask Kalki AI...";
      }
    });
  }

  function handleSend() {
    const message = input.value.trim();
    if (!message) return;
    const sessionId = 'ck-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
    window.navigate
      ? window.navigate(`/agent/chat?sessionId=${encodeURIComponent(sessionId)}&message=${encodeURIComponent(message)}`)
      : (window.location.href = `/agent/chat?sessionId=${encodeURIComponent(sessionId)}&message=${encodeURIComponent(message)}`);
  }

  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });
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
        <div class="ck-rx-trending-name">${item.name}</div>
        <div class="ck-rx-trending-sub">${item.area} · ${item.count} citizens backing</div>
      </div>
      <a href="/entities" class="ck-rx-trending-arrow">
        ${DSVG.chevronRight}
      </a>
    </div>
  `).join('');
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
        <a href="/entities?status=submitted" class="btn btn-link btn-sm">View Queue</a>
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
