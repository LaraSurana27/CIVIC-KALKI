import { getUser, getRole, roleLabel, clearAuth, refreshUser } from '../auth.js';
import { auth as apiAuth } from '../api.js';
import { navigate } from '../router.js';
import { getCapabilityPresentation, capabilityIcon } from '../utils/terminology.js';
import { renderLanguageSelector, attachLanguageSelectorEvents } from './languageSelector.js';

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
      { path: '/dashboard', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      { path: '/nearby', label: 'Explore', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
      { path: '/entities?type=initiative', label: 'Initiatives', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
      { path: '/buzz', label: 'Civic Buzz', icon: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z' },
      { path: '/entities', label: 'My Activity', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
      { path: '/agent/chat?message=I+want+to+understand+a+civic+issue', label: 'Help & Learn', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
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
      { path: '/governance', label: 'Governance Intelligence', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
      { path: '/entities', label: 'All Operations', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
      { path: '/module-builder', label: 'Capability Builder', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
      { path: '/reports', label: 'Civic Reports', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    ];
    secondaryGroupTitle = 'ACTIVE CAPABILITIES';
  } else {
    // Admin
    primaryNav = [
      { path: '/dashboard', label: 'Civic OS Workspace', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      { path: '/governance', label: 'Governance Intelligence', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
      { path: '/modules', label: 'Modules & Capabilities', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
      { path: '/module-builder', label: 'No-Code Builder', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
      { path: '/entities', label: 'All Cases & Records', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
      { path: '/reports', label: 'Civic Reports', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
      { path: '/admin', label: 'User & Role Admin', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    ];
    secondaryGroupTitle = 'CAPABILITY METADATA';
  }

  const renderNavGroup = (items) => items.map(link => {
    let isActive = false;
    if (link.path.includes('?')) {
      const [p, q] = link.path.split('?');
      isActive = currentPath === p && currentSearch === ('?' + q);
    } else {
      isActive = currentPath === link.path && !currentSearch;
    }
    return `
    <li class="sidebar-nav-item">
      <a href="${link.path}" class="sidebar-nav-link ${isActive ? 'active' : ''}">
        <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${link.icon}"></path></svg>
        ${escapeHtml(link.label)}
      </a>
    </li>
  `;
  }).join('');

  // Dynamic Civic Capabilities list from EntityType metadata (hidden for citizens to keep UX clean and action-oriented)
  let capabilityNavHTML = '';
  if (role !== 'citizen' && Array.isArray(metaTypes) && metaTypes.length > 0) {
    capabilityNavHTML = metaTypes.map(t => {
      const pres = getCapabilityPresentation(t);
      const href = `/entities?entity_type_id=${t.entity_type_id}`;
      const isActive = currentSearch.includes(`entity_type_id=${t.entity_type_id}`);
      return `
        <li class="sidebar-nav-item">
          <a href="${href}" class="sidebar-nav-link ${isActive ? 'active' : ''}" style="font-size:14.5px; padding:7px 12px; display:flex; align-items:center;">
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

  const userRoleDisplay = role === 'coordinator_area' && user.assignedArea
    ? `${roleLabel(role)} • ${user.assignedArea}`
    : roleLabel(role);

  return `
    <div class="app-layout">
      <!-- Sidebar -->
      <aside class="sidebar" id="sidebar">
        <a href="/dashboard" class="sidebar-brand">
          <img src="/logo.png" alt="CivicKalki" class="sidebar-brand-img" />
        </a>

        ${role === 'citizen' ? `
          <div class="sidebar-new-request-wrap" style="padding: 10px 14px 4px 14px;">
            <button type="button" class="btn btn-primary ck-sidebar-new-btn" id="sidebar-new-request-btn" style="width:100%; justify-content:center; gap:8px; font-weight:700; font-size:0.95rem; border-radius:10px; background:#ff5a36; border-color:#ff5a36; box-shadow:0 2px 8px rgba(255,90,54,0.3); height:40px;">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
              <span>+ New request</span>
            </button>
          </div>
        ` : ''}
        
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
              <div class="user-role truncate" title="${escapeHtml(userRoleDisplay)}">${escapeHtml(userRoleDisplay)}</div>
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
            <div style="display:flex; align-items:center; gap:var(--space-2); font-size:0.95rem;">
              <a href="/dashboard" style="color:var(--text-muted); text-decoration:none;">Civic OS</a>
              <span style="color:var(--gray-300);">/</span>
              <span style="font-weight:600; color:var(--text-primary);">${escapeHtml(pageTitle)}</span>
            </div>
          </div>

          <div class="topbar-actions">
            <!-- Language Selector -->
            ${renderLanguageSelector({ idPrefix: 'topbar' })}

            <!-- User Dropdown Menu -->
            <div class="user-dropdown-container">
              <button class="user-trigger-btn" id="topbar-user-btn" type="button" aria-haspopup="true" aria-expanded="false">
                <div class="user-avatar" style="width:32px; height:32px; font-size:13px; font-weight:700;">${escapeHtml(user.name.charAt(0).toUpperCase())}</div>
                <div style="display:flex; flex-direction:column; align-items:flex-start; line-height:1.2;">
                  <span style="font-size:0.88rem; font-weight:600; color:var(--text-primary);">${escapeHtml(user.name.split(' ')[0])}</span>
                  <span style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.03em;">${escapeHtml(roleLabel(role))}</span>
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
  // Sync latest user profile (role, assignedArea) asynchronously
  refreshUser().catch(() => {});

  // Attach language selector listeners
  attachLanguageSelectorEvents('topbar');

  const newReqBtn = document.getElementById('sidebar-new-request-btn');
  if (newReqBtn) {
    newReqBtn.addEventListener('click', () => {
      if (window.location.pathname === '/dashboard') {
        const input = document.getElementById('ck-dark-input');
        const cockpit = document.getElementById('ck-dark-cockpit');
        if (cockpit) cockpit.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (input) input.focus();
      } else {
        navigate('/dashboard');
        setTimeout(() => {
          const input = document.getElementById('ck-dark-input');
          const cockpit = document.getElementById('ck-dark-cockpit');
          if (cockpit) cockpit.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (input) input.focus();
        }, 150);
      }
    });
  }

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
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await apiAuth.logout();
      } catch (err) {
        console.warn('Logout warning:', err);
      }
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
