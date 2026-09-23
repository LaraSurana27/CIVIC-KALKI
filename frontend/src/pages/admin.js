import { requireRole } from '../auth.js';
import { renderLayout, attachLayoutEvents } from '../components/layout.js';
import { admin as apiAdmin, jurisdictions as apiJurisdictions } from '../api.js';
import { toastError, toastSuccess } from '../components/toast.js';
import { showModal, closeModal } from '../components/modal.js';
import { navigate } from '../router.js';

let users = [];
let cachedJurisdictions = null;

let currentSearchQuery = '';

export async function renderAdmin() {
  if (!requireRole(['admin'], navigate)) return;
  
  const app = document.getElementById('app');
  app.innerHTML = renderLayout(`
    <div class="page-header mb-6">
      <div class="page-header-left">
        <h1>User Management</h1>
        <p>Manage system users, search accounts, assign roles, and allocate areas to coordinators.</p>
      </div>
    </div>
    
    <!-- User Search Filter Bar -->
    <div class="card mb-6" style="padding: 14px 18px;">
      <div style="position: relative; display: flex; align-items: center;">
        <span style="position: absolute; left: 14px; display: flex; align-items: center; color: var(--text-muted); pointer-events: none;">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </span>
        <input type="text" id="user-search-input" class="form-control" style="padding-left: 42px; height: 42px; width: 100%; border-radius: var(--radius-md);" placeholder="Search users by email (e.g. demo.coord.area@example.com), name, or assigned area..." value="${escapeHtml(currentSearchQuery)}">
        ${currentSearchQuery ? `<button id="clear-search-btn" class="btn btn-ghost btn-sm" style="position:absolute; right:10px; padding:4px 8px; font-size:12px;">Clear</button>` : ''}
      </div>
    </div>

    <div id="admin-content">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `, 'Admin');
  attachLayoutEvents();
  attachSearchEvents();

  await loadUsers();
}

let searchDebounce = null;

function attachSearchEvents() {
  const searchInput = document.getElementById('user-search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    currentSearchQuery = e.target.value.trim();
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      loadUsers(currentSearchQuery);
    }, 200);
  });

  const clearBtn = document.getElementById('clear-search-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      currentSearchQuery = '';
      searchInput.value = '';
      clearBtn.remove();
      loadUsers('');
    });
  }
}

async function loadUsers(search = currentSearchQuery) {
  const content = document.getElementById('admin-content');
  if (!content) return;
  
  try {
    const params = { limit: 100 };
    if (search) params.search = search;
    const res = await apiAdmin.listUsers(params);
    users = res.data;
    renderTable(content, users);
  } catch (err) {
    toastError('Failed to load users');
    content.innerHTML = `<div class="alert alert-error">Failed to load users data.</div>`;
  }
}

function renderTable(container, userList = users) {
  if (userList.length === 0) {
    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="card-title">System Users & Regional Allocations (${userList.length})</div>
        </div>
        <div class="table-empty py-6 text-center text-muted">
          No users found matching "${escapeHtml(currentSearchQuery)}".
        </div>
      </div>
    `;
    return;
  }
  
  const rows = userList.map(u => `
    <tr>
      <td>${u.user_id}</td>
      <td class="font-medium">${escapeHtml(u.name)}</td>
      <td class="text-muted">${escapeHtml(u.email)}</td>
      <td><span class="badge badge-role-${u.role}">${formatRole(u.role)}</span></td>
      <td>${u.assignedArea ? `<span class="badge badge-primary font-semibold" style="font-size:12px;">${escapeHtml(u.assignedArea)}</span>` : '<span class="text-muted">—</span>'}</td>
      <td><button class="btn btn-secondary btn-sm" onclick="window.editUserRole(${u.user_id})">Change Role / Area</button></td>
    </tr>
  `).join('');
  
  container.innerHTML = `
    <div class="card">
      <div class="card-header flex justify-between items-center">
        <div class="card-title">System Users & Regional Allocations (${userList.length})</div>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Assigned Area / Ward</th>
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

async function loadJurisdictionsList() {
  if (cachedJurisdictions && cachedJurisdictions.length > 0) return cachedJurisdictions;
  try {
    const res = await apiJurisdictions.tree();
    if (res.data && Array.isArray(res.data)) {
      cachedJurisdictions = flattenJurisdictions(res.data);
    }
  } catch (err) {
    console.warn('Failed to load jurisdiction tree for admin, falling back to flat list', err);
    try {
      const flatRes = await apiJurisdictions.list({ parent_id: 'all' });
      cachedJurisdictions = (flatRes.data || []).map(j => ({
        jurisdiction_id: j.jurisdiction_id,
        name: j.name,
        type: j.type,
        fullPath: j.name,
      }));
    } catch (e) {
      cachedJurisdictions = [];
    }
  }
  return cachedJurisdictions || [];
}

function flattenJurisdictions(nodes, parentPath = '') {
  let list = [];
  for (const node of nodes) {
    const currentPath = parentPath ? `${parentPath} › ${node.name}` : node.name;
    list.push({
      jurisdiction_id: node.jurisdiction_id,
      name: node.name,
      type: node.type,
      fullPath: currentPath,
    });
    if (node.children && node.children.length > 0) {
      list = list.concat(flattenJurisdictions(node.children, currentPath));
    }
  }
  return list;
}

window.editUserRole = async (userId) => {
  const user = users.find(u => u.user_id === userId);
  if (!user) return;
  
  const jurisdictions = await loadJurisdictionsList();
  
  const wards = jurisdictions.filter(j => j.type === 'ward');
  const cities = jurisdictions.filter(j => j.type === 'city');
  const others = jurisdictions.filter(j => j.type !== 'ward' && j.type !== 'city');

  let currentAreaKnown = false;
  let optionsHTML = '';

  if (wards.length > 0) {
    optionsHTML += `<optgroup label="Wards / Local Areas (Recommended)">`;
    wards.forEach(w => {
      const isSel = user.assignedArea === w.name;
      if (isSel) currentAreaKnown = true;
      optionsHTML += `<option value="${escapeHtml(w.name)}" ${isSel ? 'selected' : ''}>${escapeHtml(w.fullPath)}</option>`;
    });
    optionsHTML += `</optgroup>`;
  }

  if (cities.length > 0) {
    optionsHTML += `<optgroup label="Cities / Districts">`;
    cities.forEach(c => {
      const isSel = user.assignedArea === c.name;
      if (isSel) currentAreaKnown = true;
      optionsHTML += `<option value="${escapeHtml(c.name)}" ${isSel ? 'selected' : ''}>${escapeHtml(c.fullPath)}</option>`;
    });
    optionsHTML += `</optgroup>`;
  }

  if (others.length > 0) {
    optionsHTML += `<optgroup label="States / Regions">`;
    others.forEach(o => {
      const isSel = user.assignedArea === o.name;
      if (isSel) currentAreaKnown = true;
      optionsHTML += `<option value="${escapeHtml(o.name)}" ${isSel ? 'selected' : ''}>${escapeHtml(o.fullPath)}</option>`;
    });
    optionsHTML += `</optgroup>`;
  }

  if (user.assignedArea && !currentAreaKnown && user.assignedArea !== 'Unassigned') {
    optionsHTML = `<option value="${escapeHtml(user.assignedArea)}" selected>${escapeHtml(user.assignedArea)} (Currently Assigned)</option>` + optionsHTML;
  }

  showModal({
    title: `User Role & Area Allocation: ${user.name}`,
    content: `
      <form id="role-form">
        <div class="form-group">
          <label class="form-label font-semibold">User Role</label>
          <select id="new-role" class="form-control">
            <option value="citizen" ${user.role === 'citizen' ? 'selected' : ''}>Citizen</option>
            <option value="coordinator_area" ${user.role === 'coordinator_area' ? 'selected' : ''}>Area Coordinator</option>
            <option value="coordinator_general" ${user.role === 'coordinator_general' ? 'selected' : ''}>General Coordinator</option>
            <option value="director" ${user.role === 'director' ? 'selected' : ''}>Director</option>
            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
          </select>
        </div>
        <div class="form-group" id="area-group" style="${user.role === 'coordinator_area' ? '' : 'display:none;'}">
          <label class="form-label font-semibold">Allocated Region / Ward <span class="required">*</span></label>
          <select id="new-area" class="form-control">
            <option value="">-- Select Allocated Area / Jurisdiction --</option>
            ${optionsHTML}
            <option value="__custom__">➕ Other / Custom Area Name...</option>
          </select>
          <div id="custom-area-wrapper" style="display:none; margin-top:8px;">
            <input type="text" id="custom-area-input" class="form-control" placeholder="Type custom jurisdiction or ward name (e.g. Kothrud, Sector 5)..." />
          </div>
          <div class="form-hint" style="margin-top:6px;">
            Area Coordinators only have workflow authority to review and approve cases located in their allocated jurisdiction.
          </div>
        </div>
      </form>
    `,
    footer: `
      <button class="btn btn-ghost" onclick="document.getElementById('modal-close-btn').click()">Cancel</button>
      <button class="btn btn-primary" id="save-role-btn">Save Allocation</button>
    `,
    onClose: () => {}
  });
  
  const roleSelect = document.getElementById('new-role');
  const areaGroup = document.getElementById('area-group');
  const areaSelect = document.getElementById('new-area');
  const customWrapper = document.getElementById('custom-area-wrapper');
  const customInput = document.getElementById('custom-area-input');

  roleSelect.addEventListener('change', (e) => {
    const isArea = e.target.value === 'coordinator_area';
    areaGroup.style.display = isArea ? 'block' : 'none';
  });

  areaSelect.addEventListener('change', (e) => {
    if (e.target.value === '__custom__') {
      customWrapper.style.display = 'block';
      customInput.focus();
    } else {
      customWrapper.style.display = 'none';
    }
  });
  
  document.getElementById('save-role-btn').addEventListener('click', async () => {
    const role = roleSelect.value;
    let area = areaSelect.value;
    
    if (role === 'coordinator_area') {
      if (area === '__custom__') {
        area = customInput.value.trim();
      }
      if (!area) {
        toastError('Please select or enter an allocated area for the coordinator');
        return;
      }
    }
    
    const btn = document.getElementById('save-role-btn');
    btn.disabled = true;
    btn.textContent = 'Saving...';
    
    try {
      await apiAdmin.setRole(userId, role, role === 'coordinator_area' ? area : null);
      toastSuccess(`Updated role & area allocation for ${user.name}`);
      closeModal();
      loadUsers();
    } catch (err) {
      toastError(err.message || 'Failed to update role');
      btn.disabled = false;
      btn.textContent = 'Save Allocation';
    }
  });
};

function formatRole(role) {
  if (!role) return 'Unknown';
  return role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
  );
}
