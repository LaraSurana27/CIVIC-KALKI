import { requireAuth, getUser } from '../auth.js';
import { renderLayout, attachLayoutEvents } from '../components/layout.js';
import { entities as apiEntities, values as apiValues } from '../api.js';
import { toastError, toastSuccess } from '../components/toast.js';
import { showModal, closeModal } from '../components/modal.js';
import { navigate } from '../router.js';

export async function renderEntityDetail({ id }) {
  if (!requireAuth(navigate)) return;
  const user = getUser();
  
  const app = document.getElementById('app');
  app.innerHTML = renderLayout(`
    <div class="page-header mb-4">
      <div class="page-header-left">
        <div class="topbar-breadcrumb mb-2"><a href="/entities" class="text-link">Entities</a> / #${id}</div>
        <h1 id="header-title">Loading...</h1>
      </div>
    </div>
    
    <div id="detail-content">
      <div class="loading-overlay"><div class="spinner spinner-lg"></div></div>
    </div>
  `, `Entity #${id}`);
  attachLayoutEvents();

  try {
    // Parallel fetch: entity info, parameter values, and audit logs
    const [entityRes, valuesRes, auditRes] = await Promise.all([
      apiEntities.get(id),
      apiValues.list(id).catch(() => ({ data: [] })), // Graceful fallback if empty
      apiEntities.audit(id).catch(() => ({ data: { auditLogs: [], approvalHistory: [] } }))
    ]);
    
    const entity = entityRes.data;
    const values = valuesRes.data || [];
    const audit = auditRes.data || { auditLogs: [], approvalHistory: [] };
    
    document.getElementById('header-title').textContent = entity.name;
    
    renderContent(document.getElementById('detail-content'), entity, values, audit, user);
  } catch (err) {
    toastError('Failed to load entity details');
    document.getElementById('detail-content').innerHTML = `<div class="alert alert-error">Failed to load entity #${id}. It may not exist.</div>`;
  }
}

function renderContent(container, entity, values, audit, user) {
  // Workflow step diagram
  const steps = ['draft', 'submitted', 'coordinator_approved', 'approved'];
  const currentIndex = steps.indexOf(entity.status) !== -1 ? steps.indexOf(entity.status) : -1;
  const isRejected = entity.status === 'rejected';
  
  let workflowHTML = '<div class="workflow-steps">';
  steps.forEach((step, idx) => {
    const isDone = idx < currentIndex || (idx === currentIndex && !isRejected && entity.status === 'approved');
    const isCurrent = idx === currentIndex && entity.status !== 'approved';
    const classStr = isRejected && idx === currentIndex ? 'rejected' : (isDone ? 'done' : (isCurrent ? 'current' : ''));
    
    workflowHTML += `
      <div class="workflow-step">
        <div class="workflow-step-node">
          <div class="workflow-step-circle ${classStr}">${idx + 1}</div>
          <div class="workflow-step-label mt-1">${formatStepName(step)}</div>
        </div>
        ${idx < steps.length - 1 ? `<div class="workflow-step-connector ${isDone ? 'done' : ''}"></div>` : ''}
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

  // Available Actions based on role and status
  const actionsHTML = getAvailableActions(entity, user);

  // Tab Content for Information / Audit
  const valuesRows = values.map(v => `
    <tr>
      <td class="param-key">${escapeHtml(v.parameterMaster?.field_key || `Param #${v.parameter_id}`)}</td>
      <td class="param-val">${escapeHtml(v.value || '—')}</td>
    </tr>
  `).join('');
  
  const valuesHTML = values.length > 0 
    ? `<table class="param-table"><tbody>${valuesRows}</tbody></table>`
    : `<div class="text-muted">No information provided.</div>`;

  const timelineHTML = audit.auditLogs.map(log => `
    <div class="timeline-item">
      <div class="timeline-icon ${log.new_status || 'default'}"></div>
      <div class="timeline-body">
        <div class="timeline-meta">
          <span class="timeline-actor">${escapeHtml(log.user || 'System')}</span>
          <span class="timeline-time">${new Date(log.datetime).toLocaleString()}</span>
        </div>
        <div class="timeline-desc">
          ${log.action === 'status_transition' 
            ? `Changed status from <b>${log.old_status}</b> to <b>${log.new_status}</b>`
            : `Performed action: <b>${log.action}</b>`}
        </div>
        ${log.reason ? `<div class="timeline-reason">"${escapeHtml(log.reason)}"</div>` : ''}
      </div>
    </div>
  `).join('');
  
  const auditHTML = audit.auditLogs.length > 0
    ? `<div class="timeline">${timelineHTML}</div>`
    : `<div class="text-muted">No audit history available.</div>`;

  container.innerHTML = `
    <div class="entity-detail-layout">
      <div class="main-column">
        <div class="entity-header">
          <div class="entity-header-top">
            <div>
              <div class="entity-meta-item mb-2">
                <span class="entity-id">ID: ${entity.entity_id}</span>
                <span class="badge badge-${entity.status} ml-2"><span class="badge-dot badge-dot-${entity.status}"></span>${entity.status}</span>
              </div>
              <h2 class="mb-2">${escapeHtml(entity.name)}</h2>
              <div class="entity-header-meta">
                <span class="entity-meta-item"><b>Type:</b> ${escapeHtml(entity.entityType?.name || 'Unknown')}</span>
                <span class="entity-meta-item"><b>Area:</b> ${escapeHtml(entity.area || 'Unassigned')}</span>
                <span class="entity-meta-item"><b>Location:</b> ${escapeHtml(entity.location || '—')}</span>
              </div>
            </div>
          </div>
          ${workflowHTML}
        </div>
        
        <div class="card mb-6">
          <div class="tab-bar">
            <button class="tab-btn active" id="tab-info">Information</button>
            <button class="tab-btn" id="tab-audit">Audit History</button>
          </div>
          <div class="card-body" id="tab-content">
            ${valuesHTML}
          </div>
        </div>
      </div>
      
      <div class="side-column">
        <div class="workflow-card">
          <div class="workflow-card-header">
            <h3 class="card-title">Workflow Panel</h3>
          </div>
          <div class="workflow-card-body">
            <div class="workflow-status">
              <div>
                <div class="workflow-status-label">Current Status</div>
                <div class="font-semibold text-lg mt-1">${formatStepName(entity.status)}</div>
              </div>
            </div>
            <div class="divider mt-4 mb-4"></div>
            <div class="workflow-actions">
              ${actionsHTML}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Setup Tabs
  const tabInfo = document.getElementById('tab-info');
  const tabAudit = document.getElementById('tab-audit');
  const tabContent = document.getElementById('tab-content');
  
  tabInfo.addEventListener('click', () => {
    tabInfo.classList.add('active'); tabAudit.classList.remove('active');
    tabContent.innerHTML = valuesHTML;
  });
  
  tabAudit.addEventListener('click', () => {
    tabAudit.classList.add('active'); tabInfo.classList.remove('active');
    tabContent.innerHTML = auditHTML;
  });

  // Attach Workflow Action Listeners
  attachActionListeners(entity.entity_id);
}

function formatStepName(status) {
  if (!status) return 'Unknown';
  return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function getAvailableActions(entity, user) {
  const cStatus = entity.status;
  const role = user.role;
  const area = user.assignedArea;
  const isOwner = user.user_id === entity.owner_user_id;

  let actions = [];

  if (role === 'citizen') {
    if (cStatus === 'draft' && isOwner) {
      actions.push({ id: 'btn-submit', label: 'Submit Case', class: 'btn-primary', to: 'submitted' });
    }
  } 
  else if (role === 'coordinator_area') {
    if (cStatus === 'submitted' && entity.area === area) {
      actions.push({ id: 'btn-approve', label: 'Approve (Coordinator)', class: 'btn-success', to: 'coordinator_approved' });
      actions.push({ id: 'btn-reject', label: 'Reject', class: 'btn-danger', to: 'rejected', needsReason: true });
    }
  }
  else if (role === 'coordinator_general') {
    if (cStatus === 'submitted' && (entity.area === 'Unassigned' || !entity.area)) {
      actions.push({ id: 'btn-approve', label: 'Approve (Coordinator)', class: 'btn-success', to: 'coordinator_approved' });
      actions.push({ id: 'btn-reject', label: 'Reject', class: 'btn-danger', to: 'rejected', needsReason: true });
    }
  }
  else if (role === 'director' || role === 'admin') {
    if (cStatus === 'coordinator_approved') {
      actions.push({ id: 'btn-approve', label: 'Final Approve', class: 'btn-success', to: 'approved' });
      actions.push({ id: 'btn-reject', label: 'Reject', class: 'btn-danger', to: 'rejected', needsReason: true });
    }
    // Admin can always fire rules manually for testing
    if (role === 'admin') {
      actions.push({ id: 'btn-fire-rules', label: 'Trigger Rule Engine', class: 'btn-secondary mt-4', isRule: true });
    }
  }

  if (actions.length === 0) {
    return `<div class="text-muted text-sm text-center py-2">No actions available for your role at this stage.</div>`;
  }

  return actions.map(a => `
    <button id="${a.id}" class="btn ${a.class} btn-full" 
      data-to="${a.to || ''}" data-reason="${a.needsReason ? 'true' : 'false'}" data-rule="${a.isRule ? 'true' : 'false'}">
      ${a.label}
    </button>
  `).join('');
}

function attachActionListeners(entityId) {
  // Common action handler
  const handleAction = (btn) => {
    const toStatus = btn.getAttribute('data-to');
    const needsReason = btn.getAttribute('data-reason') === 'true';
    const isRule = btn.getAttribute('data-rule') === 'true';

    if (isRule) {
      handleFireRules(entityId);
      return;
    }

    if (needsReason) {
      showModal({
        title: 'Provide Reason',
        content: `
          <div class="form-group">
            <label class="form-label">Reason for rejection <span class="required">*</span></label>
            <textarea id="action-reason" class="form-control" placeholder="Please explain why this case is being rejected..." required></textarea>
          </div>
        `,
        footer: `
          <button class="btn btn-ghost" onclick="document.getElementById('modal-close-btn').click()">Cancel</button>
          <button class="btn btn-danger" id="confirm-action-btn">Confirm Rejection</button>
        `,
        onClose: () => {}
      });

      document.getElementById('confirm-action-btn').addEventListener('click', async () => {
        const reason = document.getElementById('action-reason').value.trim();
        if (!reason) {
          toastError('Reason is required');
          return;
        }
        closeModal();
        executeTransition(entityId, toStatus, reason);
      });
    } else {
      executeTransition(entityId, toStatus, null);
    }
  };

  const actionButtons = document.querySelectorAll('.workflow-actions .btn');
  actionButtons.forEach(btn => {
    btn.addEventListener('click', () => handleAction(btn));
  });
}

async function executeTransition(entityId, toStatus, reason) {
  try {
    const res = await apiEntities.transition(entityId, toStatus, reason);
    toastSuccess(res.message || 'Status updated successfully');
    
    if (res.ruleResult && res.ruleResult.rulesFired > 0) {
      toastSuccess(`Rule Engine fired! Auto-created ${res.ruleResult.rulesFired} related entities.`);
    }
    
    // Reload page to show new state
    setTimeout(() => {
      renderEntityDetail({ id: entityId });
    }, 1000);
  } catch (err) {
    toastError(err.message || 'Failed to update status');
  }
}

async function handleFireRules(entityId) {
  try {
    const res = await apiEntities.fireRules(entityId, 'approved');
    toastSuccess(`Rule Engine triggered manually. Rules fired: ${res.data.rulesFired}`);
  } catch (err) {
    toastError(err.message || 'Failed to trigger rule engine');
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
  );
}
