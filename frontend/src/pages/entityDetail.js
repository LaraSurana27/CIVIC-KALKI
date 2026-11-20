import { requireAuth, getUser } from '../auth.js';
import { renderLayout, attachLayoutEvents } from '../components/layout.js';
import { entities as apiEntities, values as apiValues, reports as apiReports, coordinatorAI } from '../api.js';
import { toastError, toastSuccess } from '../components/toast.js';
import { showModal, closeModal } from '../components/modal.js';
import { navigate } from '../router.js';
import { getCapabilityPresentation, formatStatusLabel } from '../utils/terminology.js';
import { renderReadOnlyMapHTML, initReadOnlyMaps } from '../components/ReadOnlyMap.js';

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
  );
}

export async function renderEntityDetail({ id }) {
  // Defensive guard: 'new' must never be handled as an entity detail case ID
  const cleanId = String(id || '').split('?')[0].split('#')[0];
  if (!cleanId || cleanId === 'new') {
    navigate('/entities/new' + (window.location.search || ''));
    return;
  }

  if (!requireAuth(navigate)) return;
  const user = getUser();
  
  const app = document.getElementById('app');
  app.innerHTML = renderLayout(`
    <div class="page-header mb-4" style="display:flex; justify-content:space-between; align-items:flex-start;">
      <div class="page-header-left">
        <div class="topbar-breadcrumb mb-2"><a href="/entities" class="text-link">My Requests</a> / Case #${cleanId}</div>
        <h1 id="header-title">Loading Case...</h1>
      </div>
      <div id="header-extra-actions" style="display:flex; gap:10px;"></div>
    </div>
    
    <div id="detail-content">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `, `Case #${cleanId}`);
  attachLayoutEvents();

  try {
    const [entityRes, valuesRes, auditRes, lineageRes, wfRes] = await Promise.all([
      apiEntities.get(cleanId),
      apiValues.list(cleanId).catch(() => ({ data: [] })),
      apiEntities.audit(cleanId).catch(() => ({ data: { auditLogs: [], approvalHistory: [] } })),
      apiEntities.getLineage(cleanId).catch(() => ({ data: { current: null, parent: null, children: [], rules: [] } })),
      apiEntities.workflow(cleanId).catch(() => ({ data: { allowedTransitions: [] } })),
    ]);
    
    const entity = entityRes.data;
    const values = valuesRes.data || [];
    const audit = auditRes.data || { auditLogs: [], approvalHistory: [] };
    const lineage = lineageRes.data || { current: null, parent: null, children: [], rules: [] };
    const workflowMeta = wfRes.data || { allowedTransitions: [] };

    let moduleReports = [];
    try {
      const repRes = await apiReports.list({ entity_type_id: entity.entity_type_id });
      moduleReports = repRes.data || [];
    } catch (err) {
      moduleReports = [];
    }
    
    document.getElementById('header-title').textContent = entity.name;
    const memeEligibleStatuses = ['approved', 'coordinator_approved', 'verified', 'in_progress', 'resolved', 'closed'];
    const isMemeEligible = memeEligibleStatuses.includes(String(entity.status || '').toLowerCase()) && entity.entityType?.name !== 'Civic Campaign';
    if (isMemeEligible) {
      const extraActions = document.getElementById('header-extra-actions');
      if (extraActions) {
        extraActions.innerHTML = `
          <a href="/meme/studio/${entity.entity_id}" class="btn btn-secondary" style="display:inline-flex; align-items:center; gap:6px; font-weight:700; border-color:#f59e0b; color:#d97706; background:#fffbeb;">
            <span style="display:inline-flex; align-items:center; vertical-align:middle; margin-right:4px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></span> Create Civic Meme
          </a>
        `;
      }
    }
    renderContent(document.getElementById('detail-content'), entity, values, audit, lineage, workflowMeta, moduleReports, user);
  } catch (err) {
    console.error('Failed to load case detail:', err);
    toastError('Failed to load case details');
    document.getElementById('detail-content').innerHTML = `<div class="alert alert-error">Failed to load case #${cleanId}. It may not exist.</div>`;
  }
}

function renderContent(container, entity, values, audit, lineage, workflowMeta, moduleReports, user) {
  const capability = getCapabilityPresentation(entity.entityType);

  // BUG FIX #4: Derive workflow steps dynamically from WorkflowMaster rules.
  // Previously hardcoded to ['draft','submitted','coordinator_approved','approved'],
  // which showed incorrect progress for custom entity type workflows.
  const STANDARD_STEPS = ['draft', 'submitted', 'coordinator_approved', 'approved'];
  const TERMINAL_STATES = new Set(['approved', 'rejected', 'deleted', 'closed', 'published', 'reconciled', 'audited']);

  function buildProgressSteps(currentStatus, allowedTransitions) {
    // If WorkflowMaster returned transitions, reconstruct the path by tracing from draft→...→terminal
    if (allowedTransitions && allowedTransitions.length > 0) {
      // Build a unique ordered list by following transition chains from known start states
      const seenFrom = new Set(allowedTransitions.map(t => t.from));
      const seenTo = new Set(allowedTransitions.map(t => t.to));
      // Start states: statuses that appear as 'from' but not as a 'to' from another status
      const starters = [...seenFrom].filter(s => !seenTo.has(s));
      const start = starters[0] || 'draft';
      const chain = [start];
      let cur = start;
      for (let i = 0; i < 10; i++) {
        const next = allowedTransitions.find(t => t.from === cur && !TERMINAL_STATES.has(t.to));
        if (!next) {
          // Try to find a terminal state
          const terminal = allowedTransitions.find(t => t.from === cur && TERMINAL_STATES.has(t.to));
          if (terminal && !chain.includes(terminal.to)) chain.push(terminal.to);
          break;
        }
        if (!chain.includes(next.to)) chain.push(next.to);
        cur = next.to;
      }
      if (chain.length >= 3) return chain;
    }
    // Fallback: standard 4-step flow
    return STANDARD_STEPS;
  }

  const steps = buildProgressSteps(entity.status, workflowMeta.allowedTransitions || []);
  const isRejected = entity.status === 'rejected';
  const currentIndex = steps.indexOf(entity.status);

  let workflowHTML = '<div class="workflow-steps mt-4 mb-2">';
  steps.forEach((step, idx) => {
    const isDone = currentIndex !== -1
      ? (idx < currentIndex || (idx === currentIndex && TERMINAL_STATES.has(entity.status) && !isRejected))
      : false;
    const isCurrent = idx === currentIndex && !isRejected && !TERMINAL_STATES.has(entity.status);
    const isCurrentTerminal = idx === currentIndex && TERMINAL_STATES.has(entity.status) && !isRejected;
    const classStr = isRejected && idx === currentIndex
      ? 'rejected'
      : (isDone || isCurrentTerminal ? 'done' : (isCurrent ? 'current' : ''));

    workflowHTML += `
      <div class="workflow-step">
        <div class="workflow-step-node">
          <div class="workflow-step-circle ${classStr}">${idx + 1}</div>
          <div class="workflow-step-label mt-1">${formatStepName(step)}</div>
        </div>
        ${idx < steps.length - 1 ? `<div class="workflow-step-connector ${isDone || isCurrentTerminal ? 'done' : ''}"></div>` : ''}
      </div>
    `;
  });
  if (isRejected) {
    workflowHTML += `
      <div class="workflow-step">
        <div class="workflow-step-connector"></div>
        <div class="workflow-step-node">
          <div class="workflow-step-circle rejected">!</div>
          <div class="workflow-step-label mt-1 text-red-600">Rejected</div>
        </div>
      </div>
    `;
  }
  workflowHTML += '</div>';

  const actionsHTML = renderDynamicActions(entity, workflowMeta.allowedTransitions || [], user);

  // Enhanced Coordinator AI Analysis Panel (Ayush's Module)
  // Uses Groq-powered analysis via POST /coordinator/:id/analyze
  const isStaffOrAdmin = user && ['coordinator_area', 'coordinator_general', 'director', 'admin'].includes(user.role);
  let aiCardHTML = '';
  if (isStaffOrAdmin && entity.status !== 'deleted') {
    aiCardHTML = `
      <div class="card mb-6" id="ai-report-card" style="border: 1px solid var(--primary-border); background: #f0f7ff;">
        <div class="card-header" style="background: linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 100%); display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem; border-bottom: none; border-radius: 8px 8px 0 0;">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="display:flex; align-items:center; color:#7dd3fc;">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </span>
            <div>
              <h3 style="color:#f0f9ff; margin:0; font-size:1rem; font-weight:700;">Coordinator Advisory AI</h3>
              <span style="font-size: 11px; color:#93c5fd;">Powered by Groq · Advisory Analysis Only · Human Decision Required</span>
            </div>
          </div>
          <span style="background:#1e40af; color:#bfdbfe; font-size:11px; font-weight:700; padding:3px 10px; border-radius:20px; border:1px solid #3b82f6;">Groq AI</span>
        </div>
        <div class="card-body" id="ai-report-body" style="padding: 1.25rem;">
          <div style="text-align:center; padding: 1.5rem 0;">
            <p style="color:var(--text-secondary); margin-bottom:1.25rem; font-size:14px; max-width:600px; margin-left:auto; margin-right:auto; line-height:1.6;">
              Generate a structured advisory analysis of this case including: case summary, missing information detection, attention factors, stakeholder suggestions, and relevant constitutional/legal references.
            </p>
            <div style="display:inline-flex; gap:10px; flex-wrap:wrap; justify-content:center;">
              <button id="btn-generate-ai" class="btn btn-primary" style="padding:10px 22px; font-weight:700; box-shadow:var(--shadow-sm); display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg,#1e3a5f,#2d6a9f);">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                Run Coordinator Analysis (Groq)
              </button>
            </div>
            <div style="margin-top:14px; padding:8px 14px; background:#fff7ed; border:1px solid #fed7aa; border-radius:6px; font-size:11.5px; color:#9a3412; display:inline-block; max-width:480px;">
              <strong>Advisory Notice:</strong> AI analysis is for reference only. All official decisions require authorized human review. AI may not approve, reject, or change case status.
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Automation Visibility Box (Rule Engine auto-created child entities)
  let automationBoxHTML = '';
  if (lineage.children && lineage.children.length > 0) {
    automationBoxHTML = `
      <div class="card mb-6" style="border-top:4px solid var(--green-600); background:#f0fdf4; border-color:#bbf7d0;">
        <div class="card-body" style="padding:16px;">
          <div style="display:flex; align-items:flex-start; gap:12px;">
            <div style="display:flex; align-items:center; padding-top:2px; color:#16a34a;">
              <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <div style="flex:1;">
              <h4 style="font-size:1rem; font-weight:700; color:#166534; margin-bottom:4px;">
                Civic Automation Executed
              </h4>
              <p style="font-size:0.875rem; color:#15803d; margin-bottom:12px;">
                This case approval automatically triggered <strong>${lineage.children.length} related civic record(s)</strong> via configured metadata automation rules.
              </p>
              <div style="display:flex; flex-direction:column; gap:8px;">
                ${lineage.children.map(ch => `
                  <div style="padding:10px 14px; background:#ffffff; border:1px solid #a7f3d0; border-radius:6px; font-size:0.875rem; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <strong style="color:var(--text-primary);">#PR-${String(ch.entity_id).padStart(5, '0')} ${escapeHtml(ch.name)}</strong>
                      <span class="badge badge-secondary ml-2">${escapeHtml(ch.type_name)}</span>
                    </div>
                    <a href="/entities/${ch.entity_id}" class="btn btn-secondary btn-sm" style="font-size:12px;">View Related Record →</a>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Dynamic Parameter Values Table
  const valuesRows = values.map(v => `
    <tr>
      <td class="param-key" style="font-weight:600; width:35%; font-size:0.875rem;">${escapeHtml(v.parameterMaster?.label || v.parameterMaster?.field_key || `Parameter #${v.parameter_id}`)}</td>
      <td class="param-val" style="font-size:0.875rem;">${escapeHtml(v.value || '—')}</td>
    </tr>
  `).join('');
  
  const valuesHTML = values.length > 0 
    ? `<div class="table-container"><table class="table"><tbody>${valuesRows}</tbody></table></div>`
    : `<div class="text-muted p-4">No custom parameter values submitted for this case.</div>`;

  // Activity & Accountability Timeline (Combining AuditLog + ApprovalHistory)
  const auditLogs = audit.auditLogs || [];
  const approvals = audit.approvalHistory || [];
  
  const timelineHTML = auditLogs.map(log => `
    <div class="timeline-item mb-3" style="padding:12px; border-left:3px solid var(--primary); background:var(--gray-50); border-radius:4px;">
      <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--text-muted);">
        <span><strong>${escapeHtml(log.user || 'System')}</strong> (${escapeHtml(log.role || 'User')})</span>
        <span>${new Date(log.datetime).toLocaleString()}</span>
      </div>
      <div style="font-size:0.875rem; color:var(--text-primary); margin-top:4px; font-weight:500;">
        ${log.action === 'status_transition' 
          ? `Status Transition: <strong>${formatStatusLabel(log.old_status)}</strong> → <strong>${formatStatusLabel(log.new_status)}</strong>`
          : `Action Executed: <strong>${log.action}</strong>`}
      </div>
      ${log.reason ? `<div style="font-size:0.8rem; color:var(--text-secondary); font-style:italic; margin-top:4px; background:#fff; padding:6px; border-radius:4px; border:1px solid var(--border);">"${escapeHtml(log.reason)}"</div>` : ''}
    </div>
  `).join('');
  
  const auditHTML = auditLogs.length > 0
    ? `<div>${timelineHTML}</div>`
    : `<div class="text-muted p-4">No audit logs recorded yet for this case.</div>`;

  // Module Reports Shortcuts section
  let reportsShortcutHTML = '';
  if (moduleReports.length > 0) {
    reportsShortcutHTML = `
      <div class="card mb-6" style="border-top:3px solid var(--green-600);">
        <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
          <div class="card-title" style="display:flex; align-items:center; gap:8px;">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            Civic Reports
          </div>
          <span class="badge badge-success">${moduleReports.length} Reports</span>
        </div>
        <div class="card-body" style="padding:16px;">
          <div style="display:flex; flex-wrap:wrap; gap:10px;">
            ${moduleReports.map(r => `
              <button type="button" class="btn btn-secondary btn-sm execute-rep-btn" data-repid="${r.report_id}" style="display:inline-flex; align-items:center; gap:6px;">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Execute "${escapeHtml(r.report_name)}"
              </button>
            `).join('')}
          </div>
          <div id="report-result-output" class="mt-4" style="display:none;"></div>
        </div>
      </div>
    `;
  }

  // Civic Lineage View
  let lineageHTML = '';
  if (lineage.parent || (lineage.children && lineage.children.length > 0)) {
    lineageHTML = `
      <div class="card mb-6" style="border-top:3px solid var(--primary);">
        <div class="card-header">
          <div class="card-title" style="display:flex; align-items:center; gap:8px;">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
            Civic Lineage
          </div>
          <div class="card-subtitle">Connected parent and auto-created child civic activities</div>
        </div>
        <div class="card-body" style="padding:16px;">
          ${lineage.parent ? `
            <div style="margin-bottom:12px; padding:12px; background:var(--primary-light); border:1px solid var(--primary-border); border-radius:6px; font-size:13px;">
              <div style="font-size:0.75rem; color:var(--primary); font-weight:700; text-transform:uppercase; margin-bottom:2px;">Parent Case</div>
              <a href="/entities/${lineage.parent.entity_id}" class="text-link font-medium">#PR-${String(lineage.parent.entity_id).padStart(5, '0')} ${escapeHtml(lineage.parent.name)} (${escapeHtml(lineage.parent.entityType?.name || 'Capability')})</a>
            </div>
          ` : ''}
          ${lineage.children && lineage.children.length > 0 ? `
            <div style="font-size:13px; font-weight:600; color:var(--text-primary); margin-bottom:8px;">Linked Child Activities:</div>
            <div style="display:flex; flex-direction:column; gap:8px;">
              ${lineage.children.map(ch => `
                <div style="padding:10px; background:var(--surface); border:1px solid var(--border); border-radius:6px; font-size:13px; display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <a href="/entities/${ch.entity_id}" class="text-link font-medium">#PR-${String(ch.entity_id).padStart(5, '0')} ${escapeHtml(ch.name)}</a>
                    <span class="badge badge-secondary ml-2">${escapeHtml(ch.type_name)}</span>
                  </div>
                  <span class="badge badge-${ch.status}">${formatStatusLabel(ch.status)}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <!-- Top Case Summary Card -->
    <div class="card mb-6">
      <div class="card-body" style="padding: 1.5rem;">
        <div class="flex justify-between items-start flex-wrap gap-4 mb-2">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="badge badge-primary font-semibold">${escapeHtml(capability.title)}</span>
              <span class="badge badge-${entity.status}">${formatStatusLabel(entity.status)}</span>
            </div>
            <h2 style="font-size:1.5rem; font-weight:800; color:var(--text-primary); margin:4px 0;">${escapeHtml(entity.name)}</h2>
            <div style="font-size:13px; color:var(--text-muted);">
              Submitted by <strong>${escapeHtml(entity.owner?.name || 'System')}</strong> • Jurisdiction Area: <strong>${escapeHtml(entity.area || '—')}</strong> • Location: <strong>${escapeHtml(entity.location || '—')}</strong>
            </div>
          </div>
        </div>
        ${workflowHTML}
      </div>
    </div>

    ${automationBoxHTML}
    ${aiCardHTML}
    ${renderReadOnlyMapHTML(entity)}
    ${reportsShortcutHTML}
    ${lineageHTML}

    <!-- Main Detail & Actions Layout -->
    <div class="entity-detail-layout" style="display:grid; grid-template-columns: 2fr 1fr; gap: 20px;">
      <div>
        <div class="card">
          <div class="card-header border-b">
            <div class="tabs">
              <button class="tab-btn active" id="tab-info">Case Details & Parameters</button>
              <button class="tab-btn" id="tab-audit">Activity & Accountability Log</button>
            </div>
          </div>
          <div class="card-body" id="tab-content">
            ${valuesHTML}
          </div>
        </div>
      </div>

      <div>
        <!-- Dynamic Workflow Actions Box -->
        <div class="card" style="border-top: 4px solid var(--primary);">
          <div class="card-header">
            <div class="card-title" style="display:flex; align-items:center; gap:8px;">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            Available Actions
          </div>
            <div class="card-subtitle">Role-permitted workflow actions</div>
          </div>
          <div class="card-body" style="padding:16px;">
            <div class="workflow-actions flex-col gap-2">
              ${actionsHTML}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach Tab Listeners
  const tabInfo = document.getElementById('tab-info');
  const tabAudit = document.getElementById('tab-audit');
  const tabContent = document.getElementById('tab-content');
  
  if (tabInfo && tabAudit && tabContent) {
    tabInfo.addEventListener('click', () => {
      tabInfo.classList.add('active'); tabAudit.classList.remove('active');
      tabContent.innerHTML = valuesHTML;
    });
    
    tabAudit.addEventListener('click', () => {
      tabAudit.classList.add('active'); tabInfo.classList.remove('active');
      tabContent.innerHTML = auditHTML;
    });
  }

  // Attach AI Analysis Listener
  const btnGenerate = document.getElementById('btn-generate-ai');
  if (btnGenerate) {
    btnGenerate.addEventListener('click', () => handleGenerateAIReport(entity, values));
  }

  // Attach Report Execution Listeners
  const repBtns = document.querySelectorAll('.execute-rep-btn');
  repBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const repId = btn.getAttribute('data-repid');
      handleExecuteReport(repId);
    });
  });

  // Attach Dynamic Action Button Listeners
  attachActionListeners(entity.entity_id);

  // Initialize ReadOnlyMap if coordinates are present in entity response
  initReadOnlyMaps();

  // Trigger full localization for dynamic entity fields and tabs
  if (typeof window.civicTranslatePage === 'function') {
    window.civicTranslatePage();
  }
}

function renderDynamicActions(entity, allowedTransitions, user) {
  const actions = [];
  const currentStatus = String(entity.status || 'draft').trim().toLowerCase();
  const seenTargets = new Set();

  if (Array.isArray(allowedTransitions) && allowedTransitions.length > 0) {
    allowedTransitions.forEach((tr) => {
      const target = tr.action || tr.to || tr.to_status;
      if (!target || seenTargets.has(target)) return;
      seenTargets.add(target);

      const isReject = target === 'rejected';
      const label = formatActionLabel(currentStatus, target);
      const btnClass = isReject ? 'btn-danger' : 'btn-primary';

      actions.push(`
        <button class="btn ${btnClass} btn-full wf-action-btn mt-2" 
          data-to="${escapeHtml(target)}" 
          data-label="${escapeHtml(label)}"
          data-reason="${isReject ? 'true' : 'false'}">
          ${escapeHtml(label)}
        </button>
      `);
    });
  }

  if (user && user.role === 'admin') {
    actions.push(`
      <button class="btn btn-secondary btn-full mt-3" id="btn-fire-rules" data-rule="true" style="display:inline-flex; align-items:center; gap:8px; justify-content:center;">
        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        Execute Automation Rules
      </button>
    `);
  }

  if (actions.length === 0) {
    if (user && user.role === 'coordinator_area') {
      const userArea = user.assignedArea || user.assigned_area;
      const entityArea = entity.area;
      if (userArea && entityArea && userArea.toLowerCase() !== entityArea.toLowerCase()) {
        return `
          <div style="padding:14px; background:#fff7ed; border:1px solid #fed7aa; border-radius:8px; font-size:13px; color:#9a3412; line-height:1.4;">
            <div style="font-weight:700; color:#c2410c; margin-bottom:6px; display:flex; align-items:center; gap:6px;">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              Jurisdiction Boundary Constraint
            </div>
            Your coordinator account is assigned to <strong>"${escapeHtml(userArea)}"</strong>, but this case belongs to <strong>"${escapeHtml(entityArea)}"</strong>.
            <div style="margin-top:8px; font-size:12px; color:#7c2d12;">
              Area Coordinators are strictly authorized to verify cases within their own jurisdiction. Only a Coordinator assigned to <strong>${escapeHtml(entityArea)}</strong> (or a General Coordinator) can verify this case.
            </div>
          </div>
        `;
      }
    }
    return `<div class="text-muted text-sm text-center py-2">No workflow actions currently permitted for your role (${escapeHtml(user?.role || 'user')}) at status "${escapeHtml(formatStatusLabel(currentStatus))}".</div>`;
  }

  return actions.join('');
}

function formatActionLabel(from, to) {
  const normTo = String(to || '').toLowerCase();
  const normFrom = String(from || '').toLowerCase();

  if (normFrom === 'draft' && normTo === 'submitted') return 'Submit Request';
  if (normFrom === 'submitted' && (normTo === 'coordinator_approved' || normTo === 'verified')) {
    return 'Verify & Recommend Approval';
  }
  if (normFrom === 'coordinator_approved' && normTo === 'approved') return 'Executive Approval (Director)';
  if (normFrom === 'verified' && normTo === 'approved') return 'Executive Approval (Director)';
  if (normTo === 'rejected') return 'Reject Request';
  return `Transition to ${to}`;
}

function formatStepName(step) {
  if (step === 'draft') return 'Draft';
  if (step === 'submitted') return 'Submitted';
  if (step === 'coordinator_approved') return 'Coord Approved';
  if (step === 'verified') return 'Verified';
  if (step === 'approved') return 'Approved';
  if (step === 'rejected') return 'Rejected';
  return step;
}

function attachActionListeners(entityId) {
  const handleAction = (btn) => {
    const toStatus = btn.getAttribute('data-to');
    const label = btn.getAttribute('data-label') || `Transition to ${toStatus}`;
    const needsReason = btn.getAttribute('data-reason') === 'true';
    const isRule = btn.getAttribute('data-rule') === 'true';

    if (isRule) {
      handleFireRules(entityId);
      return;
    }

    if (needsReason) {
      showModal({
        title: 'Provide Reason for Rejection',
        content: `
          <div class="form-group mb-4">
            <label class="form-label" for="action-reason">Reason for Rejection <span class="required">*</span></label>
            <textarea id="action-reason" class="form-control" rows="3" placeholder="Please state rationale for rejecting this case..." required></textarea>
          </div>
        `,
        footer: `
          <button class="btn btn-ghost" id="cancel-modal-btn">Cancel</button>
          <button class="btn btn-danger" id="confirm-action-btn">Confirm Rejection</button>
        `,
        onClose: () => {}
      });

      document.getElementById('cancel-modal-btn').addEventListener('click', closeModal);
      document.getElementById('confirm-action-btn').addEventListener('click', async () => {
        const reason = document.getElementById('action-reason').value.trim();
        if (!reason) {
          toastError('Reason is required for rejection');
          return;
        }
        closeModal();
        executeTransition(entityId, toStatus, reason);
      });
    } else {
      showModal({
        title: `Confirm Action: ${label}`,
        content: `
          <p style="font-size:0.9rem; color:var(--text-secondary);">
            Are you sure you want to execute <strong>${escapeHtml(label)}</strong> for case #${entityId}?
          </p>
        `,
        footer: `
          <button class="btn btn-ghost" id="cancel-modal-btn">Cancel</button>
          <button class="btn btn-primary" id="confirm-action-btn">Confirm Transition</button>
        `,
        onClose: () => {}
      });

      document.getElementById('cancel-modal-btn').addEventListener('click', closeModal);
      document.getElementById('confirm-action-btn').addEventListener('click', async () => {
        closeModal();
        executeTransition(entityId, toStatus, null);
      });
    }
  };

  const actionButtons = document.querySelectorAll('.wf-action-btn, #btn-fire-rules');
  actionButtons.forEach(btn => {
    btn.addEventListener('click', () => handleAction(btn));
  });
}

async function executeTransition(entityId, toStatus, reason) {
  try {
    const res = await apiEntities.transition(entityId, toStatus, reason);
    toastSuccess(res.message || `Status updated to ${toStatus}`);
    renderEntityDetail({ id: entityId });
  } catch (err) {
    toastError(err.message || 'Transition failed');
  }
}

async function handleFireRules(entityId) {
  try {
    const res = await apiEntities.fireRules(entityId, 'approved');
    toastSuccess(`Rule Engine executed! ${res.data?.createdEntities?.length || 0} entity created.`);
    renderEntityDetail({ id: entityId });
  } catch (err) {
    toastError(err.message || 'Rule trigger failed');
  }
}

async function handleExecuteReport(reportId) {
  const out = document.getElementById('report-result-output');
  if (!out) return;

  out.style.display = 'block';
  out.innerHTML = '<div class="spinner spinner-sm"></div> Running report...';

  try {
    const res = await apiReports.execute(reportId);
    const data = res.data;
    
    let rowsHTML = (data.rows || []).map(r => `
      <tr>
        <td>${escapeHtml(r[data.groupBy] || r.area || 'Total')}</td>
        <td style="font-weight:bold;">${r[data.metric?.toLowerCase()] || r.count || r.total_count || 0}</td>
      </tr>
    `).join('');

    out.innerHTML = `
      <div style="background:var(--green-50); border:1px solid var(--green-100); border-radius:6px; padding:12px; font-size:13px;">
        <div style="font-weight:bold; color:var(--green-700); margin-bottom:6px; display:flex; align-items:center; gap:6px;">
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10"/></svg>
          Execution Result: "${escapeHtml(data.reportName)}"
        </div>
        <table class="table-sm" style="width:100%; font-size:12px;">
          <thead><tr><th>${escapeHtml(data.groupBy || 'Group')}</th><th>${escapeHtml(data.metric)}</th></tr></thead>
          <tbody>${rowsHTML}</tbody>
        </table>
      </div>
    `;
  } catch (err) {
    out.innerHTML = `<div class="alert alert-error">Report execution failed: ${escapeHtml(err.message)}</div>`;
  }
}

async function handleGenerateAIReport(entity, values = []) {
  const entityId = entity.entity_id;
  const reportBody = document.getElementById('ai-report-body');
  if (!reportBody) return;

  reportBody.innerHTML = `
    <div style="text-align:center; padding: 2rem 1rem;">
      <div class="spinner spinner-lg mb-3" style="border-top-color:#2d6a9f; margin:0 auto 12px auto;"></div>
      <div style="font-weight:700; color:#1e3a5f; font-size:15px;">Running Coordinator Advisory Analysis...</div>
      <div style="color:var(--text-muted); font-size:13px; margin-top:4px;">Analyzing case data via Groq AI. This may take a few seconds.</div>
    </div>
  `;

  try {
    const res = await coordinatorAI.analyze(entityId);
    toastSuccess('Coordinator Analysis generated successfully!');
    reportBody.innerHTML = renderCoordinatorReport(res.data, res.similar_cases, res.legal_context_meta, res.advisory_disclaimer);
  } catch (err) {
    const isKeyMissing = String(err.message || '').includes('GROQ_API_KEY') || (err.status === 503);
    if (isKeyMissing) {
      // Graceful degradation: show the existing legacy preview when Groq is not configured
      toastSuccess('Generated preview analysis from case parameters (Groq not configured)');
      const previewReport = buildCivicIntelligencePreview(entity, values);
      reportBody.innerHTML = renderLegacyPreviewReport(previewReport);
    } else {
      toastError(err.message || 'Could not generate coordinator analysis');
      reportBody.innerHTML = `<div class="alert alert-error">Coordinator AI Analysis failed: ${escapeHtml(err.message)}</div>`;
    }
  }
}

function buildCivicIntelligencePreview(entity, values = []) {
  const paramMap = {};
  if (Array.isArray(values)) {
    for (const v of values) {
      const key = v.parameterMaster?.field_key || `param_${v.parameter_id}`;
      paramMap[key] = v.value;
    }
  }

  const problemNeed = paramMap['problem_need'] || paramMap['description'] || entity.name || 'Civic improvement proposal';
  const proposedSolution = paramMap['proposed_solution'] || 'Community coordination and departmental municipal intervention';
  const urgency = paramMap['urgency'] || 'Normal';
  const areaName = entity.area || 'Ward / Area Jurisdiction';

  return {
    problem_summary: `The initiative "${entity.name}" in ${areaName} highlights a local priority: "${problemNeed}". The citizen proposes "${proposedSolution}".`,
    root_cause_analysis: [
      `Localized civic and infrastructure upkeep requirement in ${areaName}.`,
      `Gap between standard municipal routine maintenance and citizen-level expectations.`,
      `Absence of structured community-departmental participatory coordination.`
    ],
    stakeholder_analysis: [
      { group: `Residents & Citizens of ${areaName}`, interest: "Timely resolution, cleaner living environment, and reliable public amenities." },
      { group: "Area Coordinator & Field Inspectors", interest: "On-site verification of scope, resource estimation, and jurisdiction validation." },
      { group: "Competent Department (Works / Sanitation)", interest: "Feasibility check, alignment with ward budget, and task execution." }
    ],
    risk_register: [
      { risk: `Delays in site inspection may exacerbate citizen grievances in ${areaName}`, severity: urgency === 'Urgent' || urgency === 'Critical' ? 'High' : 'Medium' },
      { risk: "Potential overlap with scheduled municipal ward maintenance works", severity: "Low" },
      { risk: "Incomplete initial citizen documentation requiring field verification", severity: "Low" }
    ],
    recommendation: [
      `Area Coordinator should verify the physical site in ${areaName} and confirm exact requirements.`,
      "Coordinate with the relevant zonal engineering / sanitation unit to assess resource requirements.",
      "If verified, transition case status to 'coordinator_approved' to forward for Executive Director sanction."
    ],
    notice: "Live GEMINI_API_KEY is not configured in backend/.env. This structured decision analysis was synthesized by the CIVIC-KALKI Governance Intelligence Engine using case parameters."
  };
}

function renderReportSections(report) {
  const recommendations = Array.isArray(report.recommendation)
    ? report.recommendation
    : (Array.isArray(report.actionable_recommendations) ? report.actionable_recommendations : [report.recommendation || report.actionable_recommendations || 'Proceed with field verification.']);

  const rootCauses = Array.isArray(report.root_cause_analysis)
    ? report.root_cause_analysis
    : [report.root_cause_analysis || 'No root cause factors recorded.'];

  const stakeholders = Array.isArray(report.stakeholder_analysis)
    ? report.stakeholder_analysis
    : [];

  const risks = Array.isArray(report.risk_register)
    ? report.risk_register
    : [];

  return `
    <div style="font-size:13px; color:var(--text-primary); line-height:1.5;">
      ${report.notice ? `
        <div style="margin-bottom:12px; padding:10px 12px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:6px; font-size:12px; color:#1e40af; display:flex; align-items:center; gap:8px;">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <div><strong>Notice:</strong> ${escapeHtml(report.notice)}</div>
        </div>
      ` : ''}

      <div style="margin-bottom:12px; padding:12px; background:#fff; border-radius:6px; border:1px solid var(--border);">
        <strong style="color:var(--primary); font-size:14px; display:block; margin-bottom:6px;">1. Observations & Problem Scope</strong>
        <p style="margin:0; color:var(--text-secondary);">${escapeHtml(report.problem_summary)}</p>
      </div>
      
      <div style="margin-bottom:12px; padding:12px; background:#fff; border-radius:6px; border:1px solid var(--border);">
        <strong style="color:var(--primary); font-size:14px; display:block; margin-bottom:6px;">2. Patterns & Root Cause Analysis</strong>
        <ul style="margin:0; padding-left:18px; color:var(--text-secondary);">
          ${rootCauses.map(rc => `<li style="margin-bottom:4px;">${escapeHtml(rc)}</li>`).join('')}
        </ul>
      </div>

      ${stakeholders.length > 0 ? `
        <div style="margin-bottom:12px; padding:12px; background:#fff; border-radius:6px; border:1px solid var(--border);">
          <strong style="color:var(--primary); font-size:14px; display:block; margin-bottom:6px;">3. Stakeholder Impact Analysis</strong>
          <div style="display:flex; flex-direction:column; gap:6px;">
            ${stakeholders.map(st => `
              <div style="font-size:12px; background:var(--surface); padding:6px 10px; border-radius:4px; border:1px solid var(--border);">
                <strong style="color:var(--text-primary);">${escapeHtml(st.group || 'Stakeholder')}:</strong>
                <span style="color:var(--text-secondary); margin-left:4px;">${escapeHtml(st.interest || '')}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${risks.length > 0 ? `
        <div style="margin-bottom:12px; padding:12px; background:#fff; border-radius:6px; border:1px solid var(--border);">
          <strong style="color:var(--primary); font-size:14px; display:block; margin-bottom:6px;">4. Risk Register & Feasibility</strong>
          <div style="display:flex; flex-direction:column; gap:6px;">
            ${risks.map(rk => {
              const sev = String(rk.severity || 'Medium').toLowerCase();
              const badgeStyle = sev === 'high' 
                ? 'background:#fee2e2; color:#b91c1c; border:1px solid #fca5a5;'
                : (sev === 'low' ? 'background:#dcfce7; color:#15803d; border:1px solid #86efac;' : 'background:#fef3c7; color:#b45309; border:1px solid #fcd34d;');
              return `
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; background:var(--surface); padding:6px 10px; border-radius:4px; border:1px solid var(--border);">
                  <span style="color:var(--text-primary);">${escapeHtml(rk.risk || '')}</span>
                  <span style="padding:2px 8px; border-radius:12px; font-weight:700; font-size:11px; ${badgeStyle}">${escapeHtml(rk.severity || 'Medium')}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}

      <div style="margin-bottom:12px; padding:12px; background:#fff; border-radius:6px; border:1px solid var(--border);">
        <strong style="color:var(--primary); font-size:14px; display:block; margin-bottom:6px;">5. Recommendations for Coordinator / Executive Action</strong>
        <ul style="margin:0; padding-left:18px; color:var(--text-secondary);">
          ${recommendations.map(rc => `<li style="margin-bottom:4px;">${escapeHtml(rc)}</li>`).join('')}
        </ul>
      </div>

      <div style="padding:10px 12px; background:var(--yellow-50); border:1px solid var(--yellow-100); border-radius:6px; font-size:12px; color:var(--yellow-700); display:flex; align-items:center; gap:8px;">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="flex-shrink:0;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        <span><strong>Civic Intelligence Protocol:</strong> This automated advisory report is generated to assist municipal coordinators and directors. Ground evidence and field verification must precede final sanction.</span>
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// Coordinator Advisory AI Report Renderer (Ayush's Module)
// Renders the structured Groq analysis with all 6 sections.
// ─────────────────────────────────────────────────────────────────────────────

function renderCoordinatorReport(report, similarCases = [], legalContextMeta = null, disclaimer = '') {
  if (!report) {
    return `<div class="alert alert-error">Analysis data was empty or invalid.</div>`;
  }

  const missingInfo = Array.isArray(report.missing_information) ? report.missing_information : [];
  const attentionFactors = Array.isArray(report.attention_factors) ? report.attention_factors : [];
  const stakeholders = Array.isArray(report.stakeholder_suggestions) ? report.stakeholder_suggestions : [];
  const legalRefs = Array.isArray(report.legal_references) ? report.legal_references : [];

  const categoryBadge = (cat) => {
    if (!cat) return '';
    const styles = {
      mandatory_field: 'background:#fee2e2;color:#b91c1c;border:1px solid #fca5a5;',
      potentially_useful: 'background:#fef3c7;color:#b45309;border:1px solid #fcd34d;',
      clarification_needed: 'background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;',
    };
    const style = styles[cat] || 'background:#f3f4f6;color:#374151;border:1px solid #d1d5db;';
    return `<span style="padding:2px 8px;border-radius:12px;font-size:10px;font-weight:700;${style}">${escapeHtml(cat.replace(/_/g,' '))}</span>`;
  };

  const attentionTypeBadge = (type) => {
    const colors = {
      time_sensitivity: '#dc2626',
      safety: '#7c3aed',
      missing_critical: '#b45309',
      coordination: '#0369a1',
      historical_pattern: '#065f46',
      other: '#374151',
    };
    const color = colors[type] || '#374151';
    return `<span style="font-size:10px;font-weight:700;color:${color};text-transform:uppercase;letter-spacing:0.05em;">${escapeHtml((type||'').replace(/_/g,' '))}</span>`;
  };

  const severityIcon = (type) => {
    if (type === 'time_sensitivity' || type === 'safety') return '<svg width="10" height="10" viewBox="0 0 10 10" style="vertical-align:middle; margin-right:3px;"><circle cx="5" cy="5" r="4.5" fill="#ef4444"/></svg>';
    if (type === 'missing_critical' || type === 'coordination') return '<svg width="10" height="10" viewBox="0 0 10 10" style="vertical-align:middle; margin-right:3px;"><circle cx="5" cy="5" r="4.5" fill="#f59e0b"/></svg>';
    return '<svg width="10" height="10" viewBox="0 0 10 10" style="vertical-align:middle; margin-right:3px;"><circle cx="5" cy="5" r="4.5" fill="#3b82f6"/></svg>';
  };

  return `
    <div style="font-size:13px;color:var(--text-primary);line-height:1.6;">

      <!-- Advisory Disclaimer Banner -->
      <div style="margin-bottom:14px;padding:10px 14px;background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;font-size:12px;color:#9a3412;display:flex;align-items:flex-start;gap:8px;">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="flex-shrink:0;margin-top:1px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        <div><strong>Advisory Analysis Only:</strong> ${escapeHtml(disclaimer || 'This AI analysis must be reviewed by an authorized officer. It does not constitute an official decision or workflow action.')}</div>
      </div>

      <!-- A: Case Summary -->
      <div style="margin-bottom:12px;padding:14px;background:#fff;border-radius:8px;border:1px solid var(--border);border-left:4px solid #2d6a9f;">
        <strong style="color:#1e3a5f;font-size:13px;display:flex;align-items:center;gap:6px;margin-bottom:6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> A. Case Summary</strong>
        <p style="margin:0;color:var(--text-secondary);">${escapeHtml(report.case_summary || 'No summary generated.')}</p>
      </div>

      <!-- B: Missing Information -->
      <div style="margin-bottom:12px;padding:14px;background:#fff;border-radius:8px;border:1px solid var(--border);border-left:4px solid #dc2626;">
        <strong style="color:#1e3a5f;font-size:13px;display:flex;align-items:center;gap:6px;margin-bottom:8px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> B. Missing / Incomplete Information</strong>
        ${missingInfo.length > 0 ? `
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${missingInfo.map(m => `
              <div style="padding:8px 12px;background:#fafafa;border:1px solid #e5e7eb;border-radius:6px;display:flex;justify-content:space-between;align-items:flex-start;gap:10px;">
                <div>
                  <div style="font-weight:600;color:var(--text-primary);margin-bottom:2px;">${escapeHtml(m.field || 'Unknown field')}</div>
                  <div style="font-size:12px;color:var(--text-secondary);">${escapeHtml(m.note || '')}</div>
                </div>
                ${categoryBadge(m.category)}
              </div>
            `).join('')}
          </div>
        ` : `<div style="color:var(--text-muted);font-size:13px;">No missing mandatory fields detected from configured parameters.</div>`}
        <div style="margin-top:10px;font-size:11px;color:#6b7280;font-style:italic;">
          Note: "mandatory_field" indicates a configured required field. "potentially_useful" and "clarification_needed" are AI advisory suggestions only — not system-enforced requirements.
        </div>
      </div>

      <!-- C: Attention Factors -->
      <div style="margin-bottom:12px;padding:14px;background:#fff;border-radius:8px;border:1px solid var(--border);border-left:4px solid #7c3aed;">
        <strong style="color:#1e3a5f;font-size:13px;display:flex;align-items:center;gap:6px;margin-bottom:8px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> C. Attention Factors</strong>
        ${attentionFactors.length > 0 ? `
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${attentionFactors.map(af => `
              <div style="padding:10px 12px;background:#fafafa;border:1px solid #e5e7eb;border-radius:6px;">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                  <span>${severityIcon(af.type)}</span>
                  ${attentionTypeBadge(af.type)}
                  <span style="font-weight:600;color:var(--text-primary);">${escapeHtml(af.factor || '')}</span>
                </div>
                <div style="font-size:12px;color:var(--text-secondary);padding-left:24px;">${escapeHtml(af.detail || '')}</div>
              </div>
            `).join('')}
          </div>
        ` : `<div style="color:var(--text-muted);font-size:13px;">No significant attention factors identified from available case data.</div>`}
        <div style="margin-top:10px;font-size:11px;color:#6b7280;font-style:italic;">
          AI-suggested priority signals only. The coordinator is responsible for all official prioritization decisions.
        </div>
      </div>

      <!-- D: Stakeholder Suggestions -->
      <div style="margin-bottom:12px;padding:14px;background:#fff;border-radius:8px;border:1px solid var(--border);border-left:4px solid #059669;">
        <strong style="color:#1e3a5f;font-size:13px;display:flex;align-items:center;gap:6px;margin-bottom:8px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg> D. Suggested Stakeholders / Routing</strong>
        ${stakeholders.length > 0 ? `
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${stakeholders.map(sh => `
              <div style="padding:8px 12px;background:#fafafa;border:1px solid #e5e7eb;border-radius:6px;">
                <div style="font-weight:600;color:var(--text-primary);margin-bottom:2px;">${escapeHtml(sh.stakeholder || '')}</div>
                <div style="font-size:12px;color:var(--text-secondary);">${escapeHtml(sh.rationale || '')}</div>
              </div>
            `).join('')}
          </div>
        ` : `<div style="color:var(--text-muted);font-size:13px;">No specific stakeholder suggestions identified from available case data.</div>`}
        <div style="margin-top:10px;font-size:11px;color:#6b7280;font-style:italic;">
          These are advisory suggestions only. The AI cannot and does not change case ownership, jurisdiction, or routing. All routing decisions are made by authorized officers.
        </div>
      </div>

      <!-- E: Similar Cases -->
      ${similarCases && similarCases.length > 0 ? `
        <div style="margin-bottom:12px;padding:14px;background:#fff;border-radius:8px;border:1px solid var(--border);border-left:4px solid #0369a1;">
          <strong style="color:#1e3a5f;font-size:13px;display:flex;align-items:center;gap:6px;margin-bottom:8px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> E. Similar Historical Cases</strong>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${similarCases.map(sc => `
              <div style="padding:8px 12px;background:#fafafa;border:1px solid #e5e7eb;border-radius:6px;display:flex;justify-content:space-between;align-items:center;">
                <div>
                  <a href="/entities/${sc.entity_id}" style="font-weight:600;color:#1d4ed8;text-decoration:none;">#${String(sc.entity_id).padStart(5,'0')} ${escapeHtml(sc.name || '')}</a>
                  <span style="font-size:11px;color:var(--text-muted);margin-left:6px;">${escapeHtml(sc.type_name || '')} · ${escapeHtml(sc.area || 'N/A')}</span>
                </div>
                <span style="font-size:11px;padding:2px 8px;border-radius:12px;background:#e5e7eb;color:#374151;font-weight:600;">${escapeHtml(sc.status || '')}</span>
              </div>
            `).join('')}
          </div>
          <div style="margin-top:8px;font-size:11px;color:#6b7280;font-style:italic;">
            Only cases accessible to your role and area are shown. Similarity is based on entity type and area — verify relevance independently.
          </div>
        </div>
      ` : ''}

      <!-- Legal References (only if retrieved) -->
      ${legalRefs.length > 0 ? `
        <div style="margin-bottom:12px;padding:14px;background:#f8faff;border-radius:8px;border:1px solid #c7d7f5;border-left:4px solid #1d4ed8;">
          <strong style="color:#1e3a5f;font-size:13px;display:flex;align-items:center;gap:6px;margin-bottom:8px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/><path d="M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h18"/></svg> F. Constitutional / Legal References</strong>
          <div style="margin-bottom:8px;padding:8px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;font-size:11px;color:#1e40af;">
            <strong>IMPORTANT:</strong> These references are retrieved from a verified corpus of official government sources. They are advisory only and must not be treated as legal opinions. Verify against current official documents before relying on any reference.
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${legalRefs.map(lr => `
              <div style="padding:10px 12px;background:#fff;border:1px solid #e0e7ff;border-radius:6px;">
                <div style="font-weight:700;color:#1e40af;margin-bottom:4px;">${escapeHtml(lr.reference || '')}</div>
                <div style="font-size:12px;color:#374151;margin-bottom:4px;">${escapeHtml(lr.relevance || '')}</div>
                <div style="font-size:11px;color:#6b7280;font-style:italic;">Source: ${escapeHtml(lr.source || '')}</div>
              </div>
            `).join('')}
          </div>
          ${legalContextMeta ? `
            <div style="margin-top:8px;font-size:11px;color:#4b5563;">
              ${legalContextMeta.passages_retrieved} passage(s) retrieved from: ${(legalContextMeta.sources || []).map(s => escapeHtml(s)).join(', ')}.
              Verify at <a href="https://www.legislative.gov.in/documents" target="_blank" rel="noopener" style="color:#1d4ed8;">legislative.gov.in</a>.
            </div>
          ` : ''}
        </div>
      ` : ''}

      <!-- Advisory Footer -->
      ${report.advisory_note ? `
        <div style="margin-bottom:12px;padding:12px 14px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;font-size:13px;color:#0369a1;">
          <strong>Advisory Note:</strong> ${escapeHtml(report.advisory_note)}
        </div>
      ` : ''}

      <!-- Final Protocol Notice -->
      <div style="padding:10px 14px;background:var(--yellow-50,#fefce8);border:1px solid var(--yellow-100,#fef08a);border-radius:8px;font-size:12px;color:#713f12;display:flex;align-items:flex-start;gap:8px;">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="flex-shrink:0;margin-top:1px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        <span><strong>Coordinator AI Protocol:</strong> This report was generated by CIVIC-KALKI's Coordinator Advisory AI (Groq). It is strictly advisory. Field verification, independent judgment, and official workflow actions remain the sole responsibility of authorized human officers. AI may not and does not approve, reject, escalate, or change any case status.</span>
      </div>
    </div>
  `;
}

function renderLegacyPreviewReport(report) {
  return renderReportSections(report);
}
