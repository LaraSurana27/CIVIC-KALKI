import { requireAuth } from '../auth.js';
import { renderLayout, attachLayoutEvents } from '../components/layout.js';
import { entities as apiEntities } from '../api.js';
import { toastError } from '../components/toast.js';

let currentParams = { page: 1, limit: 20 };

export async function renderEntities(params = {}) {
  if (!requireAuth(navigate)) return;
  
  // Merge URL params
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('status')) currentParams.status = urlParams.get('status');
  if (urlParams.has('page')) currentParams.page = Number(urlParams.get('page'));
  
  const app = document.getElementById('app');
  app.innerHTML = renderLayout(`
    <div class="page-header">
      <div class="page-header-left">
        <h1>Entities</h1>
        <p>Browse and manage all cases and records in the system.</p>
      </div>
      <div class="page-header-actions">
        <a href="/entities/new" class="btn btn-primary">Create Entity</a>
      </div>
    </div>
    
    <div class="card mb-6">
      <div class="filters-bar">
        <select id="filter-status" class="form-control filter-select">
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="submitted">Submitted</option>
          <option value="coordinator_approved">Coordinator Approved</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button id="btn-filter" class="btn btn-secondary">Apply Filters</button>
      </div>
    </div>
    
    <div id="entities-content">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `, 'Entities');
  attachLayoutEvents();

  // Set initial filter UI state
  if (currentParams.status) {
    document.getElementById('filter-status').value = currentParams.status;
  }

  document.getElementById('btn-filter').addEventListener('click', () => {
    const status = document.getElementById('filter-status').value;
    if (status) {
      currentParams.status = status;
      // Update URL without reload
      window.history.pushState({}, '', `/entities?status=${status}`);
    } else {
      delete currentParams.status;
      window.history.pushState({}, '', `/entities`);
    }
    currentParams.page = 1;
    loadEntities();
  });

  await loadEntities();
}

async function loadEntities() {
  const content = document.getElementById('entities-content');
  content.innerHTML = '<div class="loading-overlay"><div class="spinner spinner-lg"></div></div>';
  
  try {
    const res = await apiEntities.list(currentParams);
    renderTable(content, res.data, res.pagination);
  } catch (err) {
    toastError('Failed to load entities');
    content.innerHTML = `<div class="alert alert-error">Failed to load data. Please try again.</div>`;
  }
}

function renderTable(container, items, pagination) {
  if (items.length === 0) {
    container.innerHTML = `<div class="table-container"><div class="table-empty">No entities found matching the criteria.</div></div>`;
    return;
  }
  
  const rows = items.map(item => `
    <tr>
      <td><a href="/entities/${item.entity_id}" class="text-link font-medium">#${item.entity_id}</a></td>
      <td>${escapeHtml(item.name)}</td>
      <td>${escapeHtml(item.entityType?.name || 'Unknown')}</td>
      <td>${escapeHtml(item.owner?.name || 'System')}</td>
      <td>${escapeHtml(item.area || '—')}</td>
      <td><span class="badge badge-${item.status}"><span class="badge-dot badge-dot-${item.status}"></span>${item.status}</span></td>
      <td><a href="/entities/${item.entity_id}" class="btn btn-secondary btn-sm">View</a></td>
    </tr>
  `).join('');
  
  let paginationHTML = '';
  if (pagination.totalPages > 1) {
    paginationHTML = `
      <div class="pagination">
        <div class="pagination-info">Page ${pagination.page} of ${pagination.totalPages}</div>
        <div class="btn-group">
          <button class="page-btn" ${pagination.page === 1 ? 'disabled' : ''} onclick="window.goToPage(${pagination.page - 1})">&larr;</button>
          <button class="page-btn" ${pagination.page === pagination.totalPages ? 'disabled' : ''} onclick="window.goToPage(${pagination.page + 1})">&rarr;</button>
        </div>
      </div>
    `;
  }
  
  container.innerHTML = `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Owner</th>
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
    ${paginationHTML}
  `;
}

window.goToPage = (page) => {
  currentParams.page = page;
  loadEntities();
};

import { navigate } from '../router.js';
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
  );
}
