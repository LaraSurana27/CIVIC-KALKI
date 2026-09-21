import { requireAuth, getUser, roleLabel } from '../auth.js';
import { renderLayout, attachLayoutEvents } from '../components/layout.js';
import { navigate } from '../router.js';

export function renderProfile() {
  if (!requireAuth(navigate)) return;
  const user = getUser();
  
  const app = document.getElementById('app');
  app.innerHTML = renderLayout(`
    <div class="page-header">
      <div class="page-header-left">
        <h1>My Profile</h1>
        <p>View your account information and preferences.</p>
      </div>
    </div>
    
    <div class="card" style="max-width: 600px;">
      <div class="card-header">
        <div class="card-title">Personal Information</div>
      </div>
      <div class="card-body p-6">
        <div class="flex items-center gap-6 mb-8">
          <div style="width:80px;height:80px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;">
            ${user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 class="text-2xl">${escapeHtml(user.name)}</h2>
            <p class="text-muted">${escapeHtml(user.email)}</p>
          </div>
        </div>
        
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">User ID</label>
            <div class="text-lg font-mono text-muted">#${user.user_id}</div>
          </div>
          <div class="form-group">
            <label class="form-label">System Role</label>
            <div><span class="badge badge-role-${user.role}">${roleLabel(user.role)}</span></div>
          </div>
        </div>
        
        ${user.role === 'coordinator_area' ? `
          <div class="form-group mt-4">
            <label class="form-label">Assigned Area</label>
            <div class="text-lg font-medium">${escapeHtml(user.assignedArea || 'Not assigned')}</div>
          </div>
        ` : ''}
        
      </div>
    </div>
  `, 'Profile');
  attachLayoutEvents();
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
  );
}
