import { requireAuth } from '../auth.js';
import { renderLayout, attachLayoutEvents } from '../components/layout.js';
import { entities as apiEntities } from '../api.js';
import { toastError } from '../components/toast.js';
import { navigate } from '../router.js';
import { getCapabilityPresentation, capabilityIcon } from '../utils/terminology.js';

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
  );
}

export async function renderModules() {
  if (!requireAuth(navigate)) return;

  const app = document.getElementById('app');
  app.innerHTML = renderLayout(`
    <div class="page-header mb-6">
      <div class="page-header-left">
        <h1>Civic Capabilities</h1>
        <p>Explore all available civic operations, initiatives, and request modules.</p>
      </div>
    </div>
    <div id="modules-container">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `, 'Civic Capabilities');
  attachLayoutEvents();

  try {
    const typesRes = await apiEntities.listTypes().catch(() => ({ data: [] }));
    const entityTypes = typesRes.data || [];

    app.innerHTML = renderLayout(`
      <div class="page-header mb-6">
        <div class="page-header-left">
          <h1 style="font-size:1.75rem; font-weight:800; color:var(--text-primary);">Civic Capabilities</h1>
          <p style="color:var(--text-secondary); margin-top:2px;">
            Select a civic capability to initiate requests, grievances, community initiatives, or civic actions.
          </p>
        </div>
      </div>

      <div id="modules-container"></div>
    `, 'Civic Capabilities', entityTypes);
    attachLayoutEvents();

    renderCapabilityDirectory(document.getElementById('modules-container'), entityTypes);
  } catch (err) {
    toastError('Failed to load civic capabilities');
    document.getElementById('modules-container').innerHTML = `
      <div class="alert alert-error">Unable to load capabilities catalog. Please try again.</div>
    `;
  }
}

function renderCapabilityDirectory(container, entityTypes) {
  if (!entityTypes || entityTypes.length === 0) {
    container.innerHTML = `
      <div class="card p-8 text-center" style="padding:48px 24px; text-align:center;">
        <div style="display:flex; align-items:center; justify-content:center; width:56px; height:56px; border-radius:50%; background:var(--gray-100); color:var(--text-muted); margin:0 auto 12px;">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
        <h3 style="font-size:1.15rem; font-weight:600; margin-bottom:6px; color:var(--text-primary);">No capabilities configured</h3>
        <p style="font-size:0.875rem; color:var(--text-muted); max-width:400px; margin:0 auto;">
          Administrators can publish new civic capabilities using the No-Code Module Builder.
        </p>
      </div>
    `;
    return;
  }

  const cardsHTML = entityTypes.map(t => {
    const pres = getCapabilityPresentation(t);
    const count = t._count?.entities || 0;

    return `
      <div class="card capability-card" style="padding:24px; border-top:3px solid rgba(255, 90, 54, 0.45); display:flex; flex-direction:column; justify-content:space-between; box-shadow:var(--shadow-xs);">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
            <div style="display:flex; align-items:center; justify-content:center; width:48px; height:48px; border-radius:12px; background:rgba(255, 90, 54, 0.12); color:var(--primary);">
              ${capabilityIcon(pres.iconKey, 24)}
            </div>
            <span class="badge badge-secondary" style="font-size:11px;">${count} Active Cases</span>
          </div>

          <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--primary); margin-bottom:4px;">
            ${escapeHtml(pres.category)}
          </div>

          <h3 style="font-size:1.15rem; font-weight:700; color:var(--text-primary); margin-bottom:8px;">
            ${escapeHtml(pres.title)}
          </h3>

          <p style="font-size:0.875rem; color:var(--text-secondary); margin-bottom:20px; line-height:1.5;">
            ${escapeHtml(pres.description)}
          </p>
        </div>

        <div style="display:flex; gap:10px; padding-top:16px; border-top:1px solid var(--border);">
          <a href="/entities?entity_type_id=${t.entity_type_id}" class="btn btn-secondary" style="flex:1; text-align:center; font-size:0.85rem;">
            Explore Cases
          </a>
          <a href="/entities/new?entity_type_id=${t.entity_type_id}" class="btn btn-translucent-orange" style="flex:1; text-align:center; font-size:0.85rem;">
            ${escapeHtml(pres.actionLabel)} →
          </a>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap:24px;">
      ${cardsHTML}
    </div>
  `;
}
