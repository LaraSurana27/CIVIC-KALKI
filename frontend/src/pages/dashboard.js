import { requireAuth, getUser } from '../auth.js';
import { renderLayout, attachLayoutEvents } from '../components/layout.js';
import { entities as apiEntities, forms as apiForms } from '../api.js';
import { toastError } from '../components/toast.js';
import { navigate } from '../router.js';
import { getCapabilityPresentation, capabilityIcon, formatStatusLabel } from '../utils/terminology.js';

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
  );
}

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

    // Set page header title based on role
    let pageTitle = 'My Civic Workspace';
    if (user.role === 'coordinator_area' || user.role === 'coordinator_general') {
      pageTitle = 'Civic Operations Workspace';
    } else if (user.role === 'director') {
      pageTitle = 'Executive Governance Workspace';
    } else if (user.role === 'admin') {
      pageTitle = 'Civic OS Administration';
    }

    app.innerHTML = renderLayout(`
      <div class="page-header mb-6">
        <div class="page-header-left">
          <h1 style="font-size:1.75rem; font-weight:800; color:var(--text-primary);">${escapeHtml(pageTitle)}</h1>
          <p style="color:var(--text-secondary); margin-top:2px;">
            Good day, <strong>${escapeHtml(user.name)}</strong>. Here is what is happening in your civic workspace.
          </p>
        </div>
        <div class="page-header-actions" id="dash-actions"></div>
      </div>
      
      <div id="dash-content">
        <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
      </div>
    `, pageTitle, metaData.entityTypes);
    attachLayoutEvents();

    const newContent = document.getElementById('dash-content');
    const newActions = document.getElementById('dash-actions');

    if (user.role === 'citizen') {
      newActions.innerHTML = `
        <a href="/modules" class="btn btn-primary btn-lg" style="box-shadow:var(--shadow-md); display:inline-flex; align-items:center; gap:8px;">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          Start Civic Action
        </a>
      `;
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
  const res = await apiEntities.list({ owner_user_id: user.user_id, limit: 20 });
  const items = res.data || [];
  
  const drafts = items.filter(i => i.status === 'draft').length;
  const active = items.filter(i => ['submitted', 'coordinator_approved', 'in_review'].includes(i.status)).length;
  const completed = items.filter(i => ['approved', 'closed', 'rejected'].includes(i.status)).length;
  
  const kpis = `
    <div class="kpi-row mb-6">
      <div class="kpi-item accent-amber">
        <div class="kpi-num">${active}</div>
        <div class="kpi-label">Active Requests</div>
      </div>
      <div class="kpi-item accent-blue">
        <div class="kpi-num">${drafts}</div>
        <div class="kpi-label">Draft Cases</div>
      </div>
      <div class="kpi-item accent-green">
        <div class="kpi-num">${completed}</div>
        <div class="kpi-label">Completed</div>
      </div>
    </div>
  `;

  // Civic Capabilities Grid
  const types = metaData.entityTypes || [];
  const capabilityCards = types.map(t => {
    const pres = getCapabilityPresentation(t);
    return `
      <div class="card capability-card" style="padding:16px; border-top:3px solid rgba(255, 90, 54, 0.45); display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="display:inline-flex; align-items:center; justify-content:center; width:38px; height:38px; border-radius:10px; background:rgba(255, 90, 54, 0.12); color:var(--primary); margin-bottom:10px;">
            ${capabilityIcon(pres.iconKey, 20)}
          </div>
          <div style="font-weight:700; font-size:0.95rem; color:var(--text-primary); margin-bottom:4px;">${escapeHtml(pres.title)}</div>
          <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:12px; line-height:1.4;">
            ${escapeHtml(pres.description)}
          </p>
        </div>
        <a href="/entities/new?entity_type_id=${t.entity_type_id}" class="btn btn-translucent-orange btn-sm" style="text-align:center;">
          ${escapeHtml(pres.actionLabel)} →
        </a>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    ${kpis}

    <!-- Recent Submissions & Activity -->
    <div class="card mb-6">
      <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div class="card-title">My Recent Activity</div>
          <div class="card-subtitle">Track status progress for your submitted civic actions</div>
        </div>
        <a href="/entities" class="btn btn-link btn-sm">View All My Requests</a>
      </div>
      ${renderRecentTable(items.slice(0, 5))}
    </div>

    <!-- Available Civic Capabilities -->
    <div class="mb-6">
      <div style="font-weight:700; font-size:1.1rem; color:var(--text-primary); margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
        <span>Civic Capabilities</span>
        <a href="/modules" style="font-size:0.85rem; color:var(--primary); text-decoration:none;">View All Capabilities →</a>
      </div>
      <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap:16px;">
        ${capabilityCards || '<div class="text-muted p-4">No civic capabilities currently published.</div>'}
      </div>
    </div>
  `;
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
