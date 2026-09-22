import { requireAuth } from '../auth.js';
import { renderLayout, attachLayoutEvents } from '../components/layout.js';
import { entities as apiEntities } from '../api.js';
import { toastError } from '../components/toast.js';
import { navigate } from '../router.js';
import { getCapabilityPresentation, formatStatusLabel } from '../utils/terminology.js';

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
  );
}

let currentParams = { page: 1, limit: 20 };
let entityTypes = [];

export async function renderEntities(params = {}, searchParams = null) {
  if (!requireAuth(navigate)) return;
  
  // Parse URL search params
  const urlParams = searchParams || new URLSearchParams(window.location.search);
  if (urlParams.has('status')) currentParams.status = urlParams.get('status');
  else delete currentParams.status;

  if (urlParams.has('entity_type_id')) currentParams.entity_type_id = urlParams.get('entity_type_id');
  else delete currentParams.entity_type_id;

  if (urlParams.has('name')) currentParams.name = urlParams.get('name');
  else delete currentParams.name;

  if (urlParams.has('page')) currentParams.page = Number(urlParams.get('page'));
  else currentParams.page = 1;
  
  // Load EntityTypes list dynamically
  try {
    const typesRes = await apiEntities.listTypes().catch(() => ({ data: [] }));
    entityTypes = typesRes.data || [];
  } catch (err) {
    entityTypes = [];
  }

  const selectedType = entityTypes.find(t => String(t.entity_type_id) === String(currentParams.entity_type_id));
  const capability = getCapabilityPresentation(selectedType);

  const pageTitleText = selectedType ? `${capability.title} Cases` : 'All Cases & Requests';
  const pageSubtitleText = selectedType
    ? `Browsing cases for capability "${capability.title}".`
    : 'Browse, search, and track all civic cases and requests across your workspace.';

  const app = document.getElementById('app');
  app.innerHTML = renderLayout(`
    <div class="page-header mb-6">
      <div class="page-header-left">
        <h1 id="entities-header-title">${escapeHtml(pageTitleText)}</h1>
        <p id="entities-header-subtitle">${escapeHtml(pageSubtitleText)}</p>
      </div>
      <div class="page-header-actions">
        <a href="/entities/new${currentParams.entity_type_id ? `?entity_type_id=${currentParams.entity_type_id}` : ''}" class="btn btn-primary" style="display:inline-flex; align-items:center; gap:6px;">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          Start Civic Action
        </a>
      </div>
    </div>
    
    <div class="card mb-6" style="padding: 16px 20px;">
      <div class="filters-bar" style="display:flex; gap:12px; align-items:center; flex-wrap:wrap; width:100%;">
        <!-- Search Box -->
        <div style="flex: 2; min-width: 240px; position: relative;">
          <span style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); display: flex; align-items: center; color: var(--text-muted); pointer-events: none;">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </span>
          <input type="text" id="filter-search" class="form-control" style="padding-left: 38px; height: 42px; width: 100%; border-radius: var(--radius-md);" placeholder="Search cases by title or location..." value="${escapeHtml(currentParams.name || '')}">
        </div>

        <!-- Dynamic Module Filter -->
        <div style="flex: 1.3; min-width: 210px;">
          <select id="filter-type" class="form-control" style="height: 42px; width: 100%; max-width: none; border-radius: var(--radius-md);">
            <option value="">All Capabilities</option>
            ${entityTypes.map(t => {
              const pres = getCapabilityPresentation(t);
              return `<option value="${t.entity_type_id}" ${String(currentParams.entity_type_id) === String(t.entity_type_id) ? 'selected' : ''}>${escapeHtml(pres.title)}</option>`;
            }).join('')}
          </select>
        </div>

        <!-- Status Filter -->
        <div style="flex: 1.2; min-width: 200px;">
          <select id="filter-status" class="form-control" style="height: 42px; width: 100%; max-width: none; border-radius: var(--radius-md);">
            <option value="">All Statuses</option>
            <option value="draft" ${currentParams.status === 'draft' ? 'selected' : ''}>Draft</option>
            <option value="submitted" ${currentParams.status === 'submitted' ? 'selected' : ''}>Submitted</option>
            <option value="coordinator_approved" ${currentParams.status === 'coordinator_approved' ? 'selected' : ''}>Verified (Pending Approval)</option>
            <option value="approved" ${currentParams.status === 'approved' ? 'selected' : ''}>Approved & Active</option>
            <option value="rejected" ${currentParams.status === 'rejected' ? 'selected' : ''}>Rejected</option>
            <option value="closed" ${currentParams.status === 'closed' ? 'selected' : ''}>Closed</option>
          </select>
        </div>

        <!-- Filter Action Buttons -->
        <div style="display: flex; gap: 8px; align-items: center; flex-shrink: 0;">
          <button id="btn-filter" class="btn btn-primary" style="height: 42px; padding: 0 18px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
            Apply Filters
          </button>
          ${(currentParams.status || currentParams.entity_type_id || currentParams.name) ? `
            <button id="btn-clear-filter" class="btn btn-secondary" style="height: 42px; padding: 0 14px; display: inline-flex; align-items: center; gap: 6px;">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              Reset
            </button>
          ` : ''}
        </div>
      </div>
    </div>
    
    <div id="entities-content">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `, pageTitleText, entityTypes);
  attachLayoutEvents();

  const applyFilters = () => {
    const status = document.getElementById('filter-status').value;
    const typeId = document.getElementById('filter-type').value;
    const searchVal = document.getElementById('filter-search').value.trim();

    const search = new URLSearchParams();
    if (status) search.set('status', status);
    if (typeId) search.set('entity_type_id', typeId);
    if (searchVal) search.set('name', searchVal);

    navigate(`/entities${search.toString() ? '?' + search.toString() : ''}`);
  };

  document.getElementById('btn-filter').addEventListener('click', applyFilters);
  document.getElementById('filter-search').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') applyFilters();
  });

  const clearBtn = document.getElementById('btn-clear-filter');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      navigate('/entities');
    });
  }

  await loadEntities();
}

async function loadEntities() {
  const content = document.getElementById('entities-content');
  if (!content) return;

  try {
    const res = await apiEntities.list(currentParams);
    const { data, pagination } = res;

    if (!data || data.length === 0) {
      content.innerHTML = `
        <div class="card p-8 text-center" style="padding:48px 24px; text-align:center;">
          <div style="display:inline-flex; align-items:center; justify-content:center; width:52px; height:52px; border-radius:50%; background:var(--gray-100); color:var(--text-muted); margin:0 auto 12px;">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
          <h3 style="font-size:1.15rem; font-weight:600; margin-bottom:6px; color:var(--text-primary);">No cases found</h3>
          <p style="font-size:0.875rem; color:var(--text-muted); max-width:400px; margin:0 auto 20px;">
            No civic cases match your filter. Try adjusting your query or starting a new civic action.
          </p>
          <div style="display:flex; gap:12px; justify-content:center;">
            <a href="/entities" class="btn btn-secondary">Clear Filters</a>
            <a href="/entities/new${currentParams.entity_type_id ? `?entity_type_id=${currentParams.entity_type_id}` : ''}" class="btn btn-primary" style="display:inline-flex; align-items:center; gap:6px;">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Start Civic Action
            </a>
          </div>
        </div>
      `;
      return;
    }

    const rows = data.map(item => {
      const pres = getCapabilityPresentation(item.entityType);
      return `
        <tr>
          <td><a href="/entities/${item.entity_id}" class="text-link font-medium">#PR-${String(item.entity_id).padStart(5, '0')}</a></td>
          <td>
            <a href="/entities/${item.entity_id}" style="color:var(--text-primary); text-decoration:none; font-weight:600;">
              ${escapeHtml(item.name)}
            </a>
          </td>
          <td><span class="badge badge-secondary">${escapeHtml(pres.shortTitle)}</span></td>
          <td>${escapeHtml(item.owner?.name || 'System')}</td>
          <td>${escapeHtml(item.area || '—')}</td>
          <td><span class="badge badge-${item.status}">${formatStatusLabel(item.status)}</span></td>
          <td>
            <a href="/entities/${item.entity_id}" class="btn btn-secondary btn-sm">Review Case →</a>
          </td>
        </tr>
      `;
    }).join('');

    const totalPages = Math.ceil(pagination.total / pagination.limit);
    let paginationHTML = '';
    if (totalPages > 1) {
      paginationHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; padding:0 8px;">
          <div style="font-size:0.85rem; color:var(--text-muted);">
            Showing page ${pagination.page} of ${totalPages} (${pagination.total} total cases)
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-secondary btn-sm" id="btn-prev" ${pagination.page <= 1 ? 'disabled' : ''}>← Previous</button>
            <button class="btn btn-secondary btn-sm" id="btn-next" ${pagination.page >= totalPages ? 'disabled' : ''}>Next →</button>
          </div>
        </div>
      `;
    }

    content.innerHTML = `
      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Title</th>
                <th>Capability Type</th>
                <th>Submitted By</th>
                <th>Area / Jurisdiction</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      </div>
      ${paginationHTML}
    `;

    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const search = new URLSearchParams(window.location.search);
        search.set('page', String(currentParams.page - 1));
        navigate(`/entities?${search.toString()}`);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const search = new URLSearchParams(window.location.search);
        search.set('page', String(currentParams.page + 1));
        navigate(`/entities?${search.toString()}`);
      });
    }

  } catch (err) {
    toastError('Failed to load cases');
    content.innerHTML = `<div class="alert alert-error">Error loading cases. Please try again.</div>`;
  }
}
