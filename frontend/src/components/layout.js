import { getUser, getRole, roleLabel, clearAuth } from '../auth.js';
import { navigate } from '../router.js';

export function renderLayout(contentHTML, pageTitle = '') {
  const user = getUser();
  const role = getRole();
  
  if (!user) {
    // Should not reach here if route is protected, but fallback
    return contentHTML;
  }

  // Define nav links based on role
  const links = [];
  links.push({ path: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Dashboard' });
  links.push({ path: '/entities', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', label: 'Entities' });
  
  if (role === 'admin') {
    links.push({ path: '/admin', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', label: 'Users & Admin' });
  }

  const currentPath = window.location.pathname;
  
  const navHTML = links.map(link => `
    <li class="sidebar-nav-item">
      <a href="${link.path}" class="sidebar-nav-link ${currentPath.startsWith(link.path) ? 'active' : ''}">
        <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${link.icon}"></path></svg>
        ${link.label}
      </a>
    </li>
  `).join('');

  return `
    <div class="app-layout">
      <!-- Sidebar -->
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-brand">
          <div class="brand-icon">CK</div>
          <div>
            <div class="brand-text">CIVIC KALKI</div>
            <div class="brand-sub">Operations Platform</div>
          </div>
        </div>
        
        <div class="sidebar-section">
          <div class="sidebar-section-label">Menu</div>
          <ul class="sidebar-nav">
            ${navHTML}
          </ul>
        </div>
        
        <div class="sidebar-footer">
          <div class="sidebar-user" id="user-menu-btn">
            <div class="user-avatar">${user.name.charAt(0).toUpperCase()}</div>
            <div style="flex:1; overflow:hidden;">
              <div class="user-name truncate">${escapeHtml(user.name)}</div>
              <div class="user-role truncate">${escapeHtml(roleLabel(role))}</div>
            </div>
            <div class="user-logout" title="Log out">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <header class="topbar">
          <button id="mobile-menu-btn" class="btn btn-ghost" style="padding:4px; display:none;">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
          <div class="topbar-title">${escapeHtml(pageTitle)}</div>
          <div class="topbar-actions">
            <!-- Future: Global Search, Notifications -->
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
  const logoutBtn = document.querySelector('.user-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      clearAuth();
      navigate('/login');
    });
  }

  const userMenuBtn = document.getElementById('user-menu-btn');
  if (userMenuBtn) {
    userMenuBtn.addEventListener('click', () => {
      navigate('/profile');
    });
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
  );
}
