import { requireAuth, getUser } from '../auth.js';
import { renderLayout, attachLayoutEvents } from '../components/layout.js';
import { entities as apiEntities } from '../api.js';
import { showLoader } from '../components/loader.js';
import { toastError } from '../components/toast.js';

export async function renderDashboard() {
  if (!requireAuth(navigate)) return;
  const user = getUser();
  
  const app = document.getElementById('app');
  app.innerHTML = renderLayout(`
    <div class="page-header">
      <div class="page-header-left">
        <h1>Dashboard</h1>
        <p>Welcome back, ${escapeHtml(user.name)}</p>
      </div>
      <div class="page-header-actions" id="dash-actions"></div>
    </div>
    
    <div id="dash-content">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `, 'Dashboard');
  attachLayoutEvents();

  const content = document.getElementById('dash-content');
  const actions = document.getElementById('dash-actions');

  try {
    if (user.role === 'citizen') {
      actions.innerHTML = `<a href="/entities/new" class="btn btn-primary">Create New Case</a>`;
      await renderCitizenDash(content, user);
    } else if (user.role === 'coordinator_area') {
      await renderCoordinatorAreaDash(content, user);
    } else if (user.role === 'coordinator_general') {
      await renderCoordinatorGeneralDash(content, user);
    } else if (user.role === 'director') {
      await renderDirectorDash(content, user);
    } else if (user.role === 'admin') {
      await renderAdminDash(content, user);
    }
  } catch (err) {
    toastError('Failed to load dashboard data');
    content.innerHTML = `<div class="alert alert-error">Failed to load data. Please try again.</div>`;
  }
}

async function renderCitizenDash(container, user) {
  const res = await apiEntities.list({ owner_user_id: user.user_id, limit: 10 });
  const items = res.data;
  
  const drafts = items.filter(i => i.status === 'draft').length;
  const active = items.filter(i => ['submitted', 'coordinator_approved'].includes(i.status)).length;
  const resolved = items.filter(i => ['approved', 'rejected'].includes(i.status)).length;
  
  const kpis = `
    <div class="kpi-row">
      <div class="kpi-item accent-amber">
        <div class="kpi-num">${active}</div>
        <div class="kpi-label">Active Cases</div>
      </div>
      <div class="kpi-item accent-blue">
        <div class="kpi-num">${drafts}</div>
        <div class="kpi-label">Drafts</div>
      </div>
      <div class="kpi-item accent-green">
        <div class="kpi-num">${resolved}</div>
        <div class="kpi-label">Resolved</div>
      </div>
    </div>
  `;

  container.innerHTML = kpis + `
    <div class="card">
      <div class="card-header">
        <div class="card-title">My Recent Submissions</div>
        <a href="/entities" class="btn btn-link btn-sm">View All</a>
      </div>
      ${renderTable(items.slice(0, 5))}
    </div>
  `;
}

async function renderCoordinatorAreaDash(container, user) {
  const area = user.assignedArea;
  // Fetch pending submissions for this area
  const res = await apiEntities.list({ status: 'submitted', area: area, limit: 10 });
  const pending = res.data;
  
  container.innerHTML = `
    <div class="alert alert-info">
      <div><strong>Assigned Area:</strong> ${escapeHtml(area)}</div>
    </div>
    <div class="kpi-row">
      <div class="kpi-item accent-amber">
        <div class="kpi-num">${res.pagination.total}</div>
        <div class="kpi-label">Pending Review</div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <div class="card-title">Action Required: Submitted Cases</div>
        <a href="/entities?status=submitted" class="btn btn-link btn-sm">View Queue</a>
      </div>
      ${renderTable(pending, true)}
    </div>
  `;
}

async function renderCoordinatorGeneralDash(container, user) {
  // Fetch unassigned submissions
  const res = await apiEntities.list({ status: 'submitted', area: 'Unassigned', limit: 10 });
  const pending = res.data;
  
  container.innerHTML = `
    <div class="alert alert-info">
      <div><strong>Role:</strong> General Coordinator (Handling Unassigned Areas)</div>
    </div>
    <div class="kpi-row">
      <div class="kpi-item accent-amber">
        <div class="kpi-num">${res.pagination.total}</div>
        <div class="kpi-label">Unassigned Pending</div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <div class="card-title">Action Required: Unassigned Cases</div>
        <a href="/entities?status=submitted" class="btn btn-link btn-sm">View Queue</a>
      </div>
      ${renderTable(pending, true)}
    </div>
  `;
}

async function renderDirectorDash(container, user) {
  // Director reviews coordinator_approved cases
  const res = await apiEntities.list({ status: 'coordinator_approved', limit: 10 });
  const pending = res.data;
  
  container.innerHTML = `
    <div class="kpi-row">
      <div class="kpi-item accent-amber">
        <div class="kpi-num">${res.pagination.total}</div>
        <div class="kpi-label">Awaiting Final Approval</div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <div class="card-title">Action Required: Coordinator Approved Cases</div>
        <a href="/entities?status=coordinator_approved" class="btn btn-link btn-sm">View Queue</a>
      </div>
      ${renderTable(pending, true)}
    </div>
  `;
}

async function renderAdminDash(container, user) {
  // Overall system stats
  const [total, draft, submitted, approved] = await Promise.all([
    apiEntities.list({ limit: 1 }),
    apiEntities.list({ status: 'draft', limit: 1 }),
    apiEntities.list({ status: 'submitted', limit: 1 }),
    apiEntities.list({ status: 'approved', limit: 1 }),
  ]);
  
  container.innerHTML = `
    <div class="kpi-row">
      <div class="kpi-item accent-blue">
        <div class="kpi-num">${total.pagination.total}</div>
        <div class="kpi-label">Total Entities</div>
      </div>
      <div class="kpi-item accent-amber">
        <div class="kpi-num">${submitted.pagination.total}</div>
        <div class="kpi-label">In Workflow</div>
      </div>
      <div class="kpi-item accent-green">
        <div class="kpi-num">${approved.pagination.total}</div>
        <div class="kpi-label">Approved</div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <div class="card-title">System Management</div>
      </div>
      <div class="card-body">
        <p class="mb-4 text-muted">Use the side navigation to manage users and view all entities across the system.</p>
        <div class="flex gap-3">
          <a href="/admin" class="btn btn-primary">Manage Users</a>
          <a href="/entities" class="btn btn-secondary">View All Entities</a>
        </div>
      </div>
    </div>
  `;
}

function renderTable(items, showOwner = false) {
  if (items.length === 0) {
    return `<div class="table-empty">No items to display</div>`;
  }
  
  const rows = items.map(item => `
    <tr>
      <td><a href="/entities/${item.entity_id}" class="text-link font-medium">#${item.entity_id}</a></td>
      <td>${escapeHtml(item.name)}</td>
      <td>${escapeHtml(item.entityType?.name || 'Unknown')}</td>
      ${showOwner ? `<td>${escapeHtml(item.owner?.name || 'System')}</td>` : ''}
      <td>${escapeHtml(item.area || '—')}</td>
      <td><span class="badge badge-${item.status}"><span class="badge-dot badge-dot-${item.status}"></span>${item.status}</span></td>
      <td><a href="/entities/${item.entity_id}" class="btn btn-secondary btn-sm">View</a></td>
    </tr>
  `).join('');
  
  return `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            ${showOwner ? '<th>Submitter</th>' : ''}
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

// Reuse escapeHtml to prevent reference error (navigate not exported here, we import it from router)
import { navigate } from '../router.js';
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
  );
}
