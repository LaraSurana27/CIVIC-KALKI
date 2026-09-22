import { requireAuth } from '../auth.js';
import { renderLayout, attachLayoutEvents } from '../components/layout.js';
import { reports as apiReports, entities as apiEntities } from '../api.js';
import { toastError } from '../components/toast.js';
import { navigate } from '../router.js';
import { getCapabilityPresentation } from '../utils/terminology.js';

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
  );
}

let reportList = [];
let entityTypes = [];

export async function renderReports() {
  if (!requireAuth(navigate)) return;
  
  const app = document.getElementById('app');
  app.innerHTML = renderLayout(`
    <div class="page-header mb-6">
      <div class="page-header-left">
        <h1>Civic Reports</h1>
        <p>Analytical summaries and metric aggregations of municipal activity.</p>
      </div>
    </div>
    <div id="reports-container">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `, 'Civic Reports');
  attachLayoutEvents();

  try {
    const [reportsRes, typesRes] = await Promise.all([
      apiReports.list().catch(() => ({ data: [] })),
      apiEntities.listTypes().catch(() => ({ data: [] }))
    ]);
    
    reportList = reportsRes.data || [];
    entityTypes = typesRes.data || [];

    app.innerHTML = renderLayout(`
      <div class="page-header mb-6">
        <div class="page-header-left">
          <h1 style="font-size:1.75rem; font-weight:800; color:var(--text-primary);">Civic Reports</h1>
          <p style="color:var(--text-secondary); margin-top:2px;">
            Execute analytical query reports configured via ReportMaster metadata.
          </p>
        </div>
      </div>
      
      <div id="reports-container"></div>
    `, 'Civic Reports', entityTypes);
    attachLayoutEvents();

    renderReportBrowser(document.getElementById('reports-container'));
  } catch (err) {
    toastError('Failed to load reports catalog');
    document.getElementById('reports-container').innerHTML = `
      <div class="alert alert-error">Unable to load reports. Please try again later.</div>
    `;
  }
}

function renderReportBrowser(container) {
  if (!reportList || reportList.length === 0) {
    container.innerHTML = `
      <div class="card p-8 text-center" style="padding:48px 24px; text-align:center;">
        <div style="display:inline-flex; align-items:center; justify-content:center; width:52px; height:52px; border-radius:50%; background:var(--gray-100); color:var(--text-muted); margin:0 auto 12px;">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
        </div>
        <h3 style="font-size:1.15rem; font-weight:600; margin-bottom:6px; color:var(--text-primary);">No configured civic reports available</h3>
        <p style="font-size:0.875rem; color:var(--text-muted); max-width:400px; margin:0 auto;">
          Reports can be defined via ReportMaster metadata configurations in the Capability Builder.
        </p>
      </div>
    `;
    return;
  }

  const cardsHTML = reportList.map(r => {
    const pres = getCapabilityPresentation(r.entityType);
    return `
      <div class="report-card">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
            <span class="badge badge-primary" style="font-size:11px;">${escapeHtml(pres.shortTitle)}</span>
            <span class="badge badge-secondary" style="font-size:10px;">${escapeHtml(r.metric_type || 'COUNT')}</span>
          </div>
          <div class="report-card-title">${escapeHtml(r.report_name)}</div>
          <div class="report-card-desc">
            Aggregates <strong>${escapeHtml(pres.shortTitle)}</strong> records grouped by <strong>${escapeHtml(r.group_by_field || 'area / status')}</strong>.
          </div>
        </div>
        
        <div>
          <div class="report-card-meta mb-3">
            <span>Group By: ${escapeHtml(r.group_by_field || 'area')}</span>
            <span>•</span>
            <span>Metric: ${escapeHtml(r.metric_type || 'COUNT')}</span>
          </div>
          <button class="btn btn-primary btn-full execute-report-btn" data-repid="${r.report_id}" style="display:inline-flex; align-items:center; justify-content:center; gap:6px;">
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Run Report
          </button>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="reports-grid mb-8">
      ${cardsHTML}
    </div>

    <!-- Execution Result Output Panel -->
    <div class="card" id="report-execution-panel" style="display:none;">
      <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
        <div class="card-title" id="execution-title">Report Results</div>
        <button class="btn btn-ghost btn-sm" id="btn-close-result">Close Panel</button>
      </div>
      <div class="card-body p-6" id="execution-body"></div>
    </div>
  `;

  const execBtns = container.querySelectorAll('.execute-report-btn');
  execBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-repid');
      runReport(id);
    });
  });

  const closeBtn = document.getElementById('btn-close-result');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      document.getElementById('report-execution-panel').style.display = 'none';
    });
  }
}

async function runReport(reportId) {
  const panel = document.getElementById('report-execution-panel');
  const titleEl = document.getElementById('execution-title');
  const bodyEl = document.getElementById('execution-body');

  if (!panel || !bodyEl) return;

  panel.style.display = 'block';
  panel.scrollIntoView({ behavior: 'smooth' });
  bodyEl.innerHTML = '<div class="loading-overlay" style="padding:24px;"><div class="spinner spinner-lg"></div></div>';

  try {
    const res = await apiReports.execute(reportId);
    const data = res.data;

    titleEl.textContent = `Report Results: ${data.reportName || 'Execution'}`;

    const rows = data.rows || [];
    if (rows.length === 0) {
      bodyEl.innerHTML = `<div class="text-muted text-center p-4">Report executed successfully, but returned 0 data rows.</div>`;
      return;
    }

    const tableRows = rows.map(r => `
      <tr>
        <td style="font-weight:600;">${escapeHtml(r[data.groupBy] || r.area || r.status || 'Total')}</td>
        <td style="font-weight:700; color:var(--primary);">${r[data.metric?.toLowerCase()] || r.count || r.total_count || 0}</td>
      </tr>
    `).join('');

    bodyEl.innerHTML = `
      <div style="margin-bottom:16px; font-size:0.875rem; color:var(--text-secondary);">
        Metric: <strong>${escapeHtml(data.metric)}</strong> | Grouped By: <strong>${escapeHtml(data.groupBy)}</strong> | Total Groups: <strong>${rows.length}</strong>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>${escapeHtml(data.groupBy || 'Group')}</th>
              <th>Aggregation Metric (${escapeHtml(data.metric)})</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    toastError(err.message || 'Report execution failed');
    bodyEl.innerHTML = `<div class="alert alert-error">Execution Error: ${escapeHtml(err.message)}</div>`;
  }
}
