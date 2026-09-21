import { requireRole } from '../auth.js';
import { renderLayout, attachLayoutEvents } from '../components/layout.js';
import { admin as apiAdmin } from '../api.js';
import { toastError, toastSuccess } from '../components/toast.js';
import { showModal, closeModal } from '../components/modal.js';
import { navigate } from '../router.js';

let users = [];

export async function renderAdmin() {
  if (!requireRole(['admin'], navigate)) return;
  
  const app = document.getElementById('app');
  app.innerHTML = renderLayout(`
    <div class="page-header">
      <div class="page-header-left">
        <h1>User Management</h1>
        <p>Manage system users, assign roles, and allocate areas to coordinators.</p>
      </div>
    </div>
    
    <div id="admin-content">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `, 'Admin');
  attachLayoutEvents();

  await loadUsers();
}

async function loadUsers() {
  const content = document.getElementById('admin-content');
  
  try {
    const res = await apiAdmin.listUsers({ limit: 50 });
    users = res.data;
    renderTable(content);
  } catch (err) {
    toastError('Failed to load users');
    content.innerHTML = `<div class="alert alert-error">Failed to load users data.</div>`;
  }
}

function renderTable(container) {
  if (users.length === 0) {
    container.innerHTML = `<div class="card"><div class="table-empty">No users found in the system.</div></div>`;
    return;
  }
  
  const rows = users.map(u => `
    <tr>
      <td>${u.user_id}</td>
      <td class="font-medium">${escapeHtml(u.name)}</td>
      <td class="text-muted">${escapeHtml(u.email)}</td>
      <td><span class="badge badge-role-${u.role}">${formatRole(u.role)}</span></td>
      <td>${escapeHtml(u.assignedArea || '—')}</td>
      <td><button class="btn btn-secondary btn-sm" onclick="window.editUserRole(${u.user_id})">Change Role</button></td>
    </tr>
  `).join('');
  
  container.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div class="card-title">System Users</div>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Assigned Area</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.editUserRole = (userId) => {
  const user = users.find(u => u.user_id === userId);
  if (!user) return;
  
  showModal({
    title: `Change Role: ${user.name}`,
    content: `
      <form id="role-form">
        <div class="form-group">
          <label class="form-label">Role</label>
          <select id="new-role" class="form-control">
            <option value="citizen" ${user.role === 'citizen' ? 'selected' : ''}>Citizen</option>
            <option value="coordinator_area" ${user.role === 'coordinator_area' ? 'selected' : ''}>Area Coordinator</option>
            <option value="coordinator_general" ${user.role === 'coordinator_general' ? 'selected' : ''}>General Coordinator</option>
            <option value="director" ${user.role === 'director' ? 'selected' : ''}>Director</option>
            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
          </select>
        </div>
        <div class="form-group" id="area-group" style="${user.role === 'coordinator_area' ? '' : 'display:none;'}">
          <label class="form-label">Assigned Area <span class="required">*</span></label>
          <select id="new-area" class="form-control">
            <option value="">-- Select Area --</option>
            <option value="North District" ${user.assignedArea === 'North District' ? 'selected' : ''}>North District</option>
            <option value="South District" ${user.assignedArea === 'South District' ? 'selected' : ''}>South District</option>
            <option value="East District" ${user.assignedArea === 'East District' ? 'selected' : ''}>East District</option>
            <option value="West District" ${user.assignedArea === 'West District' ? 'selected' : ''}>West District</option>
            <option value="Central" ${user.assignedArea === 'Central' ? 'selected' : ''}>Central</option>
          </select>
          <div class="form-hint">Required for Area Coordinators</div>
        </div>
      </form>
    `,
    footer: `
      <button class="btn btn-ghost" onclick="document.getElementById('modal-close-btn').click()">Cancel</button>
      <button class="btn btn-primary" id="save-role-btn">Save Changes</button>
    `,
    onClose: () => {}
  });
  
  document.getElementById('new-role').addEventListener('change', (e) => {
    const isArea = e.target.value === 'coordinator_area';
    document.getElementById('area-group').style.display = isArea ? 'block' : 'none';
  });
  
  document.getElementById('save-role-btn').addEventListener('click', async () => {
    const role = document.getElementById('new-role').value;
    const area = document.getElementById('new-area').value;
    
    if (role === 'coordinator_area' && !area) {
      toastError('Please select an assigned area');
      return;
    }
    
    const btn = document.getElementById('save-role-btn');
    btn.disabled = true;
    btn.textContent = 'Saving...';
    
    try {
      await apiAdmin.setRole(userId, role, role === 'coordinator_area' ? area : null);
      toastSuccess('User role updated');
      closeModal();
      loadUsers();
    } catch (err) {
      toastError(err.message || 'Failed to update role');
      btn.disabled = false;
      btn.textContent = 'Save Changes';
    }
  });
};

function formatRole(role) {
  if (!role) return 'Unknown';
  return role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
  );
}
