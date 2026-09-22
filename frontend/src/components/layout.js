import { getUser, getRole, roleLabel, clearAuth } from '../auth.js';
import { navigate } from '../router.js';
import { getCapabilityPresentation, capabilityIcon } from '../utils/terminology.js';

export function renderLayout(contentHTML, pageTitle = '', metaTypes = []) {
  const user = getUser();
  const role = getRole();

  if (!user) {
    return contentHTML;
  }

  const currentPath = window.location.pathname;
  const currentSearch = window.location.search;

  // Build role-specific navigation links
  let primaryNav = [];
  let secondaryGroupTitle = 'CIVIC CAPABILITIES';

  if (role === 'citizen') {
    primaryNav = [
      { path: '/dashboard', label: 'My Workspace', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      { path: '/entities', label: 'My Requests', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
      { path: '/modules', label: 'Civic Capabilities', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
      { path: '/reports', label: 'Community Reports', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    ];
  } else if (role === 'coordinator_area' || role === 'coordinator_general') {
    primaryNav = [
      { path: '/dashboard', label: 'Operations Workspace', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      { path: '/entities', label: 'Cases Queue', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
      { path: '/reports', label: 'Civic Reports', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    ];
    secondaryGroupTitle = 'ACTIVE CAPABILITIES';
  } else if (role === 'director') {
    primaryNav = [
      { path: '/dashboard', label: 'Governance Workspace', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      { path: '/entities', label: 'All Operations', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
      { path: '/module-builder', label: 'Capability Builder', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
      { path: '/reports', label: 'Civic Reports', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    ];
    secondaryGroupTitle = 'ACTIVE CAPABILITIES';
  } else {
    // Admin
    primaryNav = [
      { path: '/dashboard', label: 'Civic OS Workspace', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      { path: '/modules', label: 'Modules & Capabilities', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
      { path: '/module-builder', label: 'No-Code Builder', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
      { path: '/entities', label: 'All Cases & Records', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
      { path: '/reports', label: 'Civic Reports', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
      { path: '/admin', label: 'User & Role Admin', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    ];
    secondaryGroupTitle = 'CAPABILITY METADATA';
  }

  const renderNavGroup = (items) => items.map(link => `
    <li class="sidebar-nav-item">
      <a href="${link.path}" class="sidebar-nav-link ${currentPath === link.path && !currentSearch ? 'active' : ''}">
        <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${link.icon}"></path></svg>
        ${escapeHtml(link.label)}
      </a>
    </li>
  `).join('');

  // Dynamic Civic Capabilities list from EntityType metadata
  let capabilityNavHTML = '';
  if (Array.isArray(metaTypes) && metaTypes.length > 0) {
    capabilityNavHTML = metaTypes.map(t => {
      const pres = getCapabilityPresentation(t);
      const href = `/entities?entity_type_id=${t.entity_type_id}`;
      const isActive = currentSearch.includes(`entity_type_id=${t.entity_type_id}`);
      return `
        <li class="sidebar-nav-item">
          <a href="${href}" class="sidebar-nav-link ${isActive ? 'active' : ''}" style="font-size:13px; padding:6px 12px; display:flex; align-items:center;">
            <span class="sidebar-cap-icon" style="display:inline-flex; align-items:center; justify-content:center; width:18px; height:18px; margin-right:8px; flex-shrink:0; opacity:0.85;">
              ${capabilityIcon(pres.iconKey, 16)}
            </span>
            <span class="truncate" style="flex:1;">${escapeHtml(pres.shortTitle)}</span>
            ${t._count?.entities !== undefined ? `<span style="font-size:10px; background:rgba(255,255,255,0.18); padding:1px 6px; border-radius:10px;">${t._count.entities}</span>` : ''}
          </a>
        </li>
      `;
    }).join('');
  }

  return `
    <div class="app-layout">
      <!-- Sidebar -->
      <aside class="sidebar" id="sidebar">
        <a href="/dashboard" class="sidebar-brand">
          <img src="/logo.png" alt="CivicKalki" class="sidebar-brand-img" />
        </a>
        
        <div class="sidebar-section">
          <div class="sidebar-group-title">NAVIGATION</div>
          <ul class="sidebar-nav">
            ${renderNavGroup(primaryNav)}
          </ul>
        </div>

        ${capabilityNavHTML ? `
          <div class="sidebar-section mt-4">
            <div class="sidebar-group-title">${secondaryGroupTitle}</div>
            <ul class="sidebar-nav">
              ${capabilityNavHTML}
            </ul>
          </div>
        ` : ''}
        
        <div class="sidebar-footer">
          <div class="sidebar-user" id="sidebar-user-card" style="cursor:pointer;">
            <div class="user-avatar">${escapeHtml(user.name.charAt(0).toUpperCase())}</div>
            <div style="flex:1; overflow:hidden;">
              <div class="user-name truncate">${escapeHtml(user.name)}</div>
              <div class="user-role truncate">${escapeHtml(roleLabel(role))}</div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <header class="topbar">
          <div style="display:flex; align-items:center; gap:var(--space-3);">
            <button id="mobile-menu-btn" class="btn btn-ghost" style="padding:6px; display:none;" aria-label="Toggle sidebar menu">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <div style="display:flex; align-items:center; gap:var(--space-2); font-size:0.875rem;">
              <a href="/dashboard" style="color:var(--text-muted); text-decoration:none;">Civic OS</a>
              <span style="color:var(--gray-300);">/</span>
              <span style="font-weight:600; color:var(--text-primary);">${escapeHtml(pageTitle)}</span>
            </div>
          </div>

          <div class="topbar-actions">
            <!-- User Dropdown Menu -->
            <div class="user-dropdown-container">
              <button class="user-trigger-btn" id="topbar-user-btn" type="button" aria-haspopup="true" aria-expanded="false">
                <div class="user-avatar" style="width:32px; height:32px; font-size:13px; font-weight:700;">${escapeHtml(user.name.charAt(0).toUpperCase())}</div>
                <div style="display:flex; flex-direction:column; align-items:flex-start; line-height:1.2;">
                  <span style="font-size:0.8125rem; font-weight:600; color:var(--text-primary);">${escapeHtml(user.name.split(' ')[0])}</span>
                  <span style="font-size:0.6875rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.03em;">${escapeHtml(roleLabel(role))}</span>
                </div>
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:var(--text-muted); flex-shrink:0;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </button>

              <div class="user-dropdown-menu" id="user-dropdown-menu">
                <div class="user-dropdown-header">
                  <div class="user-dropdown-name">${escapeHtml(user.name)}</div>
                  <div class="user-dropdown-role">${escapeHtml(roleLabel(role))}</div>
                </div>
                <a href="/profile" class="user-dropdown-item">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  Profile & Security
                </a>
                <a href="/reports" class="user-dropdown-item">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  Reports
                </a>
                <button type="button" class="user-dropdown-item danger" id="dropdown-logout-btn">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <div class="page-content" id="page-content">
          ${contentHTML}
        </div>
      </main>
    </div>
  `;
}

export function attachLayoutEvents() {
  const topbarUserBtn = document.getElementById('topbar-user-btn');
  const userDropdownMenu = document.getElementById('user-dropdown-menu');

  if (topbarUserBtn && userDropdownMenu) {
    topbarUserBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdownMenu.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!userDropdownMenu.contains(e.target) && !topbarUserBtn.contains(e.target)) {
        userDropdownMenu.classList.remove('show');
      }
    });
  }

  const logoutBtn = document.getElementById('dropdown-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      clearAuth();
      navigate('/login');
    });
  }

  const sidebarUserCard = document.getElementById('sidebar-user-card');
  if (sidebarUserCard) {
    sidebarUserCard.addEventListener('click', () => {
      navigate('/profile');
    });
  }

  const mobileBtn = document.getElementById('mobile-menu-btn');
  const sidebar = document.getElementById('sidebar');
  if (mobileBtn && sidebar) {
    mobileBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
  );
}
