import { requireRole } from '../auth.js';
import { renderLayout, attachLayoutEvents } from '../components/layout.js';
import { entities as apiEntities, forms as apiForms, moduleBuilder as apiModuleBuilder } from '../api.js';
import { toastError, toastSuccess } from '../components/toast.js';
import { navigate } from '../router.js';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

let state = {
  step: 1, // 1: Basics, 2: Form & Fields, 3: Workflow, 4: Rules, 5: Reports, 6: Review, 7: Success
  basics: {
    name: '',
    description: '',
    icon: '📋',
    domain_id: 1,
  },
  form: {
    name: '',
    sections: [
      {
        id: 'sec_1',
        name: 'General Information',
        parameters: [
          {
            id: 'param_1',
            label: 'Title',
            field_key: 'title',
            field_type: 'text',
            mandatory: true,
            options: [],
          },
          {
            id: 'param_2',
            label: 'Area',
            field_key: 'area',
            field_type: 'select',
            mandatory: true,
            options: ['Sector 5', 'Sector 12', 'Pune North', 'Pune South', 'Pune Central'],
          },
        ],
      },
    ],
  },
  workflow: {
    transitions: [
      { from: 'draft', to: 'submitted', role: 'citizen' },
      { from: 'submitted', to: 'coordinator_approved', role: 'coordinator_area' },
      { from: 'submitted', to: 'rejected', role: 'coordinator_area' },
      { from: 'coordinator_approved', to: 'approved', role: 'director' },
      { from: 'coordinator_approved', to: 'rejected', role: 'director' },
    ],
  },
  rule: {
    enabled: false,
    target_entity_type_id: '',
    event: 'approved',
  },
  report: {
    enabled: true,
    name: '',
    groupBy: 'area',
    metric: 'COUNT',
    metricField: '',
    publicStats: true,
  },
  existingTypes: [],
  domains: [],
  isSubmitting: false,
};

export async function renderModuleBuilder() {
  if (!requireRole(['admin', 'director'], navigate)) return;

  try {
    const [typesRes, formsMetaRes] = await Promise.all([
      apiEntities.listTypes().catch(() => ({ data: [] })),
      apiForms.getMetadata().catch(() => ({ data: { domains: [] } })),
    ]);
    state.existingTypes = typesRes.data || [];
    state.domains = formsMetaRes.data?.domains || [];
  } catch (err) {
    console.warn('Could not load metadata for module builder:', err);
  }

  renderWizard();
}

function renderWizard() {
  const app = document.getElementById('app');

  let stepHTML = '';
  if (state.step === 1) stepHTML = renderStep1();
  else if (state.step === 2) stepHTML = renderStep2();
  else if (state.step === 3) stepHTML = renderStep3();
  else if (state.step === 4) stepHTML = renderStep4();
  else if (state.step === 5) stepHTML = renderStep5();
  else if (state.step === 6) stepHTML = renderStep6();
  else if (state.step === 7) stepHTML = renderStepSuccess();

  const steps = [
    { num: 1, label: 'Basics' },
    { num: 2, label: 'Form & Fields' },
    { num: 3, label: 'Workflow' },
    { num: 4, label: 'Rules' },
    { num: 5, label: 'Reports' },
    { num: 6, label: 'Review' },
  ];

  const stepperHTML = steps.map((s, idx) => `
    <div style="display:flex; align-items:center; gap:0.4rem; color:${state.step >= s.num ? 'var(--primary)' : 'var(--gray-400)'}; font-weight:${state.step === s.num ? 'bold' : 'normal'}; font-size:13px;">
      <span style="width:24px; height:24px; border-radius:50%; background:${state.step >= s.num ? 'var(--primary)' : '#e5e7eb'}; color:${state.step >= s.num ? '#fff' : '#4b5563'}; display:flex; align-items:center; justify-content:center; font-size:12px;">${s.num}</span>
      ${s.label}
    </div>
    ${idx < steps.length - 1 ? `<div style="flex:1; height:2px; background:${state.step > s.num ? 'var(--primary)' : '#e5e7eb'}; margin:0 4px;"></div>` : ''}
  `).join('');

  app.innerHTML = renderLayout(`
    <div class="page-header">
      <div class="page-header-left">
        <h1>No-Code Module Builder</h1>
        <p>Design and deploy brand-new civic governance capabilities purely through metadata.</p>
      </div>
    </div>

    <!-- Stepper Navigation -->
    <div class="card mb-6" style="padding: 0.8rem 1.2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; overflow-x:auto;">
        ${stepperHTML}
      </div>
    </div>

    ${stepHTML}
  `, 'Module Builder');

  attachLayoutEvents();
  attachWizardEvents();
}

// ── STEP 1: Module Basics ───────────────────────────────────────────────────
function renderStep1() {
  const domainOptions = (state.domains && state.domains.length > 0)
    ? state.domains.map(d => `<option value="${d.domain_id}" ${state.basics.domain_id == d.domain_id ? 'selected' : ''}>${escapeHtml(d.domain_name)}</option>`).join('')
    : '<option value="1">Civic Operations</option>';

  return `
    <div class="card" style="max-width: 700px; margin: 0 auto;">
      <div class="card-header">
        <div class="card-title">Step 1: Module Basics</div>
        <div class="card-subtitle">Define the name, domain, and description for your new civic capability.</div>
      </div>
      <div class="card-body">
        <form id="step1-form">
          <div class="form-group">
            <label class="form-label">Module / Entity Type Name <span class="required">*</span></label>
            <input type="text" id="module-name" class="form-control" placeholder="e.g. Park Renovation Request, Public Grievance" value="${escapeHtml(state.basics.name)}" required>
            <div class="form-hint">Must be unique across the platform.</div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea id="module-desc" class="form-control" rows="3" placeholder="Briefly describe what this module governs...">${escapeHtml(state.basics.description)}</textarea>
          </div>

          <div class="form-row">
            <div class="form-group" style="flex:1;">
              <label class="form-label">Civic Domain</label>
              <select id="module-domain" class="form-control" onchange="state.basics.domain_id = Number(this.value)">
                ${domainOptions}
              </select>
            </div>
            <div class="form-group" style="flex:1;">
              <label class="form-label">Icon Identifier</label>
              <select id="module-icon" class="form-control">
                <option value="📋" ${state.basics.icon === '📋' ? 'selected' : ''}>📋 Form / Registration</option>
                <option value="📢" ${state.basics.icon === '📢' ? 'selected' : ''}>📢 Notice / Alert</option>
                <option value="🛡️" ${state.basics.icon === '🛡️' ? 'selected' : ''}>🛡️ Governance / Policy</option>
                <option value="💼" ${state.basics.icon === '💼' ? 'selected' : ''}>💼 Employment / Exchange</option>
                <option value="🤝" ${state.basics.icon === '🤝' ? 'selected' : ''}>🤝 Volunteer / Community</option>
                <option value="🌳" ${state.basics.icon === '🌳' ? 'selected' : ''}>🌳 Parks / Environment</option>
                <option value="🏗️" ${state.basics.icon === '🏗️' ? 'selected' : ''}>🏗️ Infrastructure</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button type="submit" class="btn btn-primary">Next: Form & Fields →</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// ── STEP 2: Form & Parameters ───────────────────────────────────────────────
function renderStep2() {
  const formName = state.form.name || (state.basics.name ? `${state.basics.name} Form` : 'Module Registration Form');

  const sectionsHTML = state.form.sections.map((sec, sIdx) => {
    const paramsHTML = sec.parameters.map((param, pIdx) => {
      const isSelect = param.field_type === 'select';
      return `
        <div style="background:var(--gray-50, #f9fafb); border:1px solid var(--gray-200, #e5e7eb); border-radius:8px; padding:12px; margin-bottom:10px; position:relative;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-weight:600; font-size:13px; color:var(--gray-700);">Field #${pIdx + 1} (${escapeHtml(param.field_key || 'field')})</span>
            <button type="button" class="btn btn-ghost btn-sm text-error" onclick="window.removeParam(${sIdx}, ${pIdx})" style="padding:2px 6px;">✕ Remove</button>
          </div>
          <div class="form-row">
            <div class="form-group" style="flex:2;">
              <label class="form-label" style="font-size:12px;">Field Label <span class="required">*</span></label>
              <input type="text" class="form-control" value="${escapeHtml(param.label)}" onchange="window.updateParam(${sIdx}, ${pIdx}, 'label', this.value)" placeholder="e.g. Budget, Location" required>
            </div>
            <div class="form-group" style="flex:1.5;">
              <label class="form-label" style="font-size:12px;">Data Type</label>
              <select class="form-control" onchange="window.updateParam(${sIdx}, ${pIdx}, 'field_type', this.value)">
                <option value="text" ${param.field_type === 'text' ? 'selected' : ''}>Text Input</option>
                <option value="textarea" ${param.field_type === 'textarea' ? 'selected' : ''}>Long Text (Textarea)</option>
                <option value="number" ${param.field_type === 'number' ? 'selected' : ''}>Number (Metric)</option>
                <option value="date" ${param.field_type === 'date' ? 'selected' : ''}>Date</option>
                <option value="select" ${param.field_type === 'select' ? 'selected' : ''}>Dropdown Select</option>
              </select>
            </div>
            <div class="form-group" style="flex:1; display:flex; align-items:flex-end; padding-bottom:8px;">
              <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-size:13px;">
                <input type="checkbox" ${param.mandatory ? 'checked' : ''} onchange="window.updateParam(${sIdx}, ${pIdx}, 'mandatory', this.checked)">
                Required?
              </label>
            </div>
          </div>

          ${isSelect ? `
            <div style="margin-top:8px; padding-top:8px; border-top:1px dashed var(--gray-200);">
              <label class="form-label" style="font-size:12px;">Dropdown Choices (comma-separated)</label>
              <input type="text" class="form-control" value="${escapeHtml((param.options || []).join(', '))}" onchange="window.updateParamOptions(${sIdx}, ${pIdx}, this.value)" placeholder="Choice 1, Choice 2, Choice 3">
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    return `
      <div class="card mb-4" style="border:1px solid var(--gray-300);">
        <div class="card-header" style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc;">
          <input type="text" class="form-control" style="font-weight:bold; max-width:300px;" value="${escapeHtml(sec.name)}" onchange="window.updateSectionName(${sIdx}, this.value)">
          <button type="button" class="btn btn-ghost btn-sm text-error" onclick="window.removeSection(${sIdx})">Delete Section</button>
        </div>
        <div class="card-body">
          ${paramsHTML}
          <button type="button" class="btn btn-secondary btn-sm mt-2" onclick="window.addParam(${sIdx})">+ Add Field</button>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div style="display:grid; grid-template-columns: 1.2fr 0.8fr; gap: 20px;">
      <div>
        <div class="card mb-4">
          <div class="card-header">
            <div class="card-title">Step 2: Form & Field Configuration</div>
            <div class="card-subtitle">Define parameters and form sections for "${escapeHtml(state.basics.name)}".</div>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label class="form-label">Form Title</label>
              <input type="text" id="form-name-input" class="form-control" value="${escapeHtml(formName)}" onchange="state.form.name = this.value">
            </div>
          </div>
        </div>

        ${sectionsHTML}

        <div class="mb-6">
          <button type="button" class="btn btn-secondary" onclick="window.addSection()">+ Add Section</button>
        </div>

        <div class="flex justify-between mt-6">
          <button type="button" class="btn btn-ghost" onclick="state.step=1; renderWizard();">← Back</button>
          <button type="button" class="btn btn-primary" onclick="window.validateAndGoStep3()">Next: Workflow →</button>
        </div>
      </div>

      <!-- Right Column: Live Interactive Preview -->
      <div>
        <div class="card" style="position:sticky; top:20px; border-top: 4px solid var(--primary);">
          <div class="card-header flex justify-between align-center">
            <div class="card-title" style="display:flex; align-items:center; gap:8px;">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
              Live Form Preview
            </div>
            <span class="badge badge-role-citizen">Generic FormEngine</span>
          </div>
          <div class="card-body" style="max-height:80vh; overflow-y:auto;">
            ${renderLivePreview()}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderLivePreview() {
  const title = state.form.name || (state.basics.name ? `${state.basics.name} Form` : 'Untitled Form');
  let html = `<div style="font-weight:bold; font-size:1.1rem; margin-bottom:12px; color:var(--gray-900);">${escapeHtml(title)}</div>`;

  state.form.sections.forEach(sec => {
    html += `
      <div style="margin-bottom:16px; border-bottom:1px solid #e2e8f0; padding-bottom:8px;">
        <div style="font-weight:600; font-size:14px; color:var(--primary); margin-bottom:8px;">${escapeHtml(sec.name)}</div>
    `;

    sec.parameters.forEach(param => {
      const req = param.mandatory ? '<span style="color:red">*</span>' : '';
      html += `<div style="margin-bottom:10px;">
        <label style="display:block; font-size:12px; font-weight:500; margin-bottom:4px;">${escapeHtml(param.label || 'Unlabelled')} ${req}</label>`;

      if (param.field_type === 'textarea') {
        html += `<textarea class="form-control" rows="2" disabled placeholder="Text response..."></textarea>`;
      } else if (param.field_type === 'number') {
        html += `<input type="number" class="form-control" disabled placeholder="0">`;
      } else if (param.field_type === 'date') {
        html += `<input type="date" class="form-control" disabled>`;
      } else if (param.field_type === 'select') {
        const opts = (param.options && param.options.length) ? param.options : ['Option 1', 'Option 2'];
        html += `<select class="form-control" disabled>
          ${opts.map(o => `<option>${escapeHtml(o)}</option>`).join('')}
        </select>`;
      } else {
        html += `<input type="text" class="form-control" disabled placeholder="Text response...">`;
      }
      html += `</div>`;
    });
    html += `</div>`;
  });
  return html;
}

// ── STEP 3: Workflow Configuration ──────────────────────────────────────────
function renderStep3() {
  const roleOptions = [
    { value: 'citizen', label: 'Citizen (Owner)' },
    { value: 'coordinator_area', label: 'Area Coordinator' },
    { value: 'coordinator_general', label: 'General Coordinator' },
    { value: 'director', label: 'Director' },
    { value: 'admin', label: 'Administrator' },
  ];

  const transitionsHTML = state.workflow.transitions.map((tr, idx) => `
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px; margin-bottom:10px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span style="font-weight:600; font-size:13px; color:#1e293b;">Transition #${idx + 1}</span>
        <button type="button" class="btn btn-ghost btn-sm text-error" onclick="window.removeTransition(${idx})">✕ Remove</button>
      </div>
      <div class="form-row">
        <div class="form-group" style="flex:1;">
          <label class="form-label" style="font-size:12px;">From Status</label>
          <input type="text" class="form-control" value="${escapeHtml(tr.from)}" onchange="window.updateTransition(${idx}, 'from', this.value)" placeholder="e.g. draft, submitted" required>
        </div>
        <div style="display:flex; align-items:center; padding-top:16px; font-weight:bold; color:#64748b;">→</div>
        <div class="form-group" style="flex:1;">
          <label class="form-label" style="font-size:12px;">To Status</label>
          <input type="text" class="form-control" value="${escapeHtml(tr.to)}" onchange="window.updateTransition(${idx}, 'to', this.value)" placeholder="e.g. submitted, approved" required>
        </div>
        <div class="form-group" style="flex:1.2;">
          <label class="form-label" style="font-size:12px;">Allowed Role</label>
          <select class="form-control" onchange="window.updateTransition(${idx}, 'role', this.value)">
            ${roleOptions.map(r => `<option value="${r.value}" ${tr.role === r.value ? 'selected' : ''}>${r.label}</option>`).join('')}
          </select>
        </div>
      </div>
    </div>
  `).join('');

  return `
    <div class="card" style="max-width: 750px; margin: 0 auto;">
      <div class="card-header">
        <div class="card-title">Step 3: Workflow & State Transitions</div>
        <div class="card-subtitle">Configure the state machine and permitted actor roles for "${escapeHtml(state.basics.name)}".</div>
      </div>
      <div class="card-body">
        <p style="font-size:13px; color:#64748b; margin-bottom:16px;">
          Define which roles can transition entities of this module from one state to another. These will be generated into <code>WorkflowMaster</code>.
        </p>

        ${transitionsHTML}

        <button type="button" class="btn btn-secondary btn-sm mb-6" onclick="window.addTransition()">+ Add Transition</button>

        <div class="flex justify-between mt-6">
          <button type="button" class="btn btn-ghost" onclick="state.step=2; renderWizard();">← Back</button>
          <button type="button" class="btn btn-primary" onclick="window.validateAndGoStep4()">Next: Rules →</button>
        </div>
      </div>
    </div>
  `;
}

// ── STEP 4: Automation Rules ────────────────────────────────────────────────
function renderStep4() {
  const options = state.existingTypes.map(t => `<option value="${t.entity_type_id}" ${state.rule.target_entity_type_id == t.entity_type_id ? 'selected' : ''}>${escapeHtml(t.name)}</option>`).join('');

  return `
    <div class="card" style="max-width: 700px; margin: 0 auto;">
      <div class="card-header">
        <div class="card-title">Step 4: Relationship Rules (Optional)</div>
        <div class="card-subtitle">Configure cascading auto-creation when entities are approved or submitted.</div>
      </div>
      <div class="card-body">
        <div class="form-group">
          <label class="form-label" style="font-size:15px; font-weight:600;">Enable Auto-Creation Rule?</label>
          <div style="display:flex; gap:16px; margin-top:8px;">
            <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
              <input type="radio" name="rule-enable" value="false" ${!state.rule.enabled ? 'checked' : ''} onchange="state.rule.enabled = false; renderWizard();">
              No rule (Standalone module)
            </label>
            <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
              <input type="radio" name="rule-enable" value="true" ${state.rule.enabled ? 'checked' : ''} onchange="state.rule.enabled = true; renderWizard();">
              Yes, auto-create linked entity
            </label>
          </div>
        </div>

        ${state.rule.enabled ? `
          <div style="background:#f0f9ff; border:1px solid #bae6fd; border-radius:8px; padding:16px; margin-top:16px;">
            <div class="form-group">
              <label class="form-label">When an event occurs on "${escapeHtml(state.basics.name)}":</label>
              <select id="rule-event" class="form-control" onchange="state.rule.event = this.value">
                <option value="approved" ${state.rule.event === 'approved' ? 'selected' : ''}>On Approval (Director approves)</option>
                <option value="submitted" ${state.rule.event === 'submitted' ? 'selected' : ''}>On Submission (Citizen submits)</option>
              </select>
            </div>
            
            <div class="form-group mb-0">
              <label class="form-label">Automatically spawn target EntityType:</label>
              <select id="rule-target" class="form-control" onchange="state.rule.target_entity_type_id = this.value">
                <option value="">-- Select Target Module --</option>
                ${options}
              </select>
            </div>
          </div>
        ` : ''}

        <div class="flex justify-between mt-6">
          <button type="button" class="btn btn-ghost" onclick="state.step=3; renderWizard();">← Back</button>
          <button type="button" class="btn btn-primary" onclick="state.step=5; renderWizard();">Next: Reports →</button>
        </div>
      </div>
    </div>
  `;
}

// ── STEP 5: Report Configuration ────────────────────────────────────────────
function renderStep5() {
  const allParams = [];
  state.form.sections.forEach(s => s.parameters.forEach(p => allParams.push(p)));

  const defaultRepName = state.report.name || (state.basics.name ? `${state.basics.name}s by Area` : 'Module Report');
  const numParams = allParams.filter(p => p.field_type === 'number');

  const groupByOptions = [
    '<option value="area">area (Native Area)</option>',
    '<option value="status">status (Workflow Status)</option>',
    ...allParams.map(p => `<option value="${escapeHtml(p.field_key || p.label)}" ${state.report.groupBy === (p.field_key || p.label) ? 'selected' : ''}>${escapeHtml(p.label)} (${p.field_type})</option>`),
  ].join('');

  const metricFieldOptions = numParams.map(p => `
    <option value="${escapeHtml(p.field_key || p.label)}" ${state.report.metricField === (p.field_key || p.label) ? 'selected' : ''}>${escapeHtml(p.label)}</option>
  `).join('');

  return `
    <div class="card" style="max-width: 700px; margin: 0 auto;">
      <div class="card-header">
        <div class="card-title">Step 5: Reporting Definition</div>
        <div class="card-subtitle">Configure dynamic analytical reporting for "${escapeHtml(state.basics.name)}" via ReportMaster.</div>
      </div>
      <div class="card-body">
        <div class="form-group">
          <label style="display:flex; align-items:center; gap:8px; font-weight:600; cursor:pointer;">
            <input type="checkbox" ${state.report.enabled ? 'checked' : ''} onchange="state.report.enabled = this.checked; renderWizard();">
            Generate Default Analytical Report
          </label>
        </div>

        ${state.report.enabled ? `
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:16px;">
            <div class="form-group">
              <label class="form-label">Report Name <span class="required">*</span></label>
              <input type="text" class="form-control" value="${escapeHtml(defaultRepName)}" onchange="state.report.name = this.value" placeholder="e.g. Park Requests by Area">
            </div>

            <div class="form-row">
              <div class="form-group" style="flex:1;">
                <label class="form-label">Group By Field</label>
                <select class="form-control" onchange="state.report.groupBy = this.value">
                  ${groupByOptions}
                </select>
              </div>

              <div class="form-group" style="flex:1;">
                <label class="form-label">Aggregation Metric</label>
                <select class="form-control" onchange="state.report.metric = this.value; renderWizard();">
                  <option value="COUNT" ${state.report.metric === 'COUNT' ? 'selected' : ''}>COUNT (Entity Count)</option>
                  <option value="SUM" ${state.report.metric === 'SUM' ? 'selected' : ''}>SUM (Sum of Numeric Field)</option>
                  <option value="AVG" ${state.report.metric === 'AVG' ? 'selected' : ''}>AVG (Average)</option>
                  <option value="MIN" ${state.report.metric === 'MIN' ? 'selected' : ''}>MIN (Minimum)</option>
                  <option value="MAX" ${state.report.metric === 'MAX' ? 'selected' : ''}>MAX (Maximum)</option>
                </select>
              </div>
            </div>

            ${state.report.metric !== 'COUNT' ? `
              <div class="form-group">
                <label class="form-label">Metric Field (Numeric Field to Aggregate) <span class="required">*</span></label>
                <select class="form-control" onchange="state.report.metricField = this.value">
                  <option value="">-- Select Numeric Field --</option>
                  ${metricFieldOptions}
                </select>
                ${numParams.length === 0 ? '<div class="form-hint text-error">Warning: No numeric fields defined in form. Please add a number field in Step 2 to use SUM/AVG.</div>' : ''}
              </div>
            ` : ''}

            <div class="form-group mb-0">
              <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-size:13px;">
                <input type="checkbox" ${state.report.publicStats ? 'checked' : ''} onchange="state.report.publicStats = this.checked">
                Public Statistics? (Allows citizens to view aggregated summary without row-level access)
              </label>
            </div>
          </div>
        ` : ''}

        <div class="flex justify-between mt-6">
          <button type="button" class="btn btn-ghost" onclick="state.step=4; renderWizard();">← Back</button>
          <button type="button" class="btn btn-primary" onclick="state.step=6; renderWizard();">Next: Review & Deploy →</button>
        </div>
      </div>
    </div>
  `;
}

// ── STEP 6: Review & Deploy ─────────────────────────────────────────────────
function renderStep6() {
  const formTitle = state.form.name || `${state.basics.name} Form`;
  const paramCount = state.form.sections.reduce((acc, s) => acc + s.parameters.length, 0);
  const repName = state.report.name || `${state.basics.name}s by Area`;

  return `
    <div class="card" style="max-width: 750px; margin: 0 auto;">
      <div class="card-header">
        <div class="card-title">Step 6: Review & Deploy Module</div>
        <div class="card-subtitle">Review the complete declarative metadata definition before atomic deployment.</div>
      </div>
      <div class="card-body">
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:16px; margin-bottom:20px;">
          <!-- Module & Form Header -->
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
            <span style="font-size:2.2rem;">${state.basics.icon}</span>
            <div>
              <div style="font-weight:bold; font-size:1.2rem; color:#0f172a;">${escapeHtml(state.basics.name)}</div>
              <div style="color:#64748b; font-size:13px;">${escapeHtml(state.basics.description || 'Civic Operating System Module')}</div>
            </div>
          </div>
          
          <div style="border-top:1px solid #cbd5e1; padding-top:12px; font-size:13px; display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div>
              <div style="font-weight:600; color:#1e293b; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                Form Definition
              </div>
              <div>Title: <strong>${escapeHtml(formTitle)}</strong></div>
              <div>Sections: <strong>${state.form.sections.length}</strong></div>
              <div>Total Parameters: <strong>${paramCount}</strong></div>
            </div>
            <div>
              <div style="font-weight:600; color:#1e293b; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                Workflow (${state.workflow.transitions.length} transitions)
              </div>
              ${state.workflow.transitions.map(t => `<div style="font-size:12px;">• <code>${escapeHtml(t.from)}</code> → <code>${escapeHtml(t.to)}</code> (${escapeHtml(t.role)})</div>`).join('')}
            </div>
          </div>

          <div style="border-top:1px solid #cbd5e1; margin-top:12px; padding-top:12px; font-size:13px; display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div>
              <div style="font-weight:600; color:#1e293b; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                Automation Rule
              </div>
              <div>${state.rule.enabled && state.rule.target_entity_type_id ? `Auto-create Target #${state.rule.target_entity_type_id} on ${state.rule.event}` : 'None'}</div>
            </div>
            <div>
              <div style="font-weight:600; color:#1e293b; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                Reporting
              </div>
              <div>${state.report.enabled ? `${escapeHtml(repName)} (${state.report.metric} by ${state.report.groupBy})` : 'None'}</div>
            </div>
          </div>
        </div>

        <div class="flex justify-between">
          <button type="button" class="btn btn-ghost" onclick="state.step=5; renderWizard();" ${state.isSubmitting ? 'disabled' : ''}>← Back</button>
          <button type="button" class="btn btn-primary btn-lg" id="create-module-btn" onclick="window.submitModuleCreation()" style="display:inline-flex; align-items:center; gap:8px;">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            Deploy Module via Metadata
          </button>
        </div>
      </div>
    </div>
  `;
}

// ── SUCCESS SCREEN ──────────────────────────────────────────────────────────
function renderStepSuccess() {
  return `
    <div class="card" style="max-width: 650px; margin: 0 auto; text-align: center; padding: 40px 20px;">
      <div style="display:inline-flex; align-items:center; justify-content:center; width:64px; height:64px; border-radius:50%; background:#dcfce7; color:#16a34a; margin:0 auto 16px;">
        <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
      </div>
      <h2 style="font-size: 1.8rem; color: var(--gray-900); margin-bottom: 10px;">Module Successfully Deployed!</h2>
      <p style="color: var(--gray-600); margin-bottom: 24px;">
        <strong>"${escapeHtml(state.basics.name)}"</strong> has been generated atomically with complete Form, Workflow, Rule, and Report metadata.
      </p>

      <div style="display: flex; justify-content: center; gap: 12px;">
        <button class="btn btn-secondary btn-lg" onclick="state.step=1; state.basics.name=''; renderWizard();">Create Another Module</button>
        <button class="btn btn-primary btn-lg" onclick="navigate('/entities/new')">Test New Module Form →</button>
      </div>
    </div>
  `;
}

function attachWizardEvents() {
  const step1Form = document.getElementById('step1-form');
  if (step1Form) {
    step1Form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('module-name').value.trim();
      const desc = document.getElementById('module-desc').value.trim();
      const icon = document.getElementById('module-icon').value;

      if (!name) {
        toastError('Module name is required');
        return;
      }

      const exists = state.existingTypes.some(t => t.name.toLowerCase() === name.toLowerCase());
      if (exists) {
        toastError(`Module "${name}" already exists. Please choose a different name.`);
        return;
      }

      state.basics.name = name;
      state.basics.description = desc;
      state.basics.icon = icon;
      state.step = 2;
      renderWizard();
    });
  }
}

// Global actions for field and workflow management
window.addSection = () => {
  const newIdx = state.form.sections.length + 1;
  state.form.sections.push({
    id: `sec_${Date.now()}`,
    name: `Section ${newIdx}`,
    parameters: [
      {
        id: `param_${Date.now()}`,
        label: 'New Field',
        field_key: `field_${Date.now()}`,
        field_type: 'text',
        mandatory: false,
        options: [],
      },
    ],
  });
  renderWizard();
};

window.removeSection = (sIdx) => {
  if (state.form.sections.length <= 1) {
    toastError('Form must have at least one section');
    return;
  }
  state.form.sections.splice(sIdx, 1);
  renderWizard();
};

window.updateSectionName = (sIdx, name) => {
  state.form.sections[sIdx].name = name;
  renderWizard();
};

window.addParam = (sIdx) => {
  const pCount = state.form.sections[sIdx].parameters.length + 1;
  state.form.sections[sIdx].parameters.push({
    id: `param_${Date.now()}`,
    label: `Field ${pCount}`,
    field_key: `field_${Date.now()}`,
    field_type: 'text',
    mandatory: false,
    options: [],
  });
  renderWizard();
};

window.removeParam = (sIdx, pIdx) => {
  state.form.sections[sIdx].parameters.splice(pIdx, 1);
  renderWizard();
};

window.updateParam = (sIdx, pIdx, key, val) => {
  const param = state.form.sections[sIdx].parameters[pIdx];
  param[key] = val;
  if (key === 'label') {
    param.field_key = val.toLowerCase().replace(/[^a-z0-9]/g, '_');
  }
  renderWizard();
};

window.updateParamOptions = (sIdx, pIdx, strVal) => {
  const opts = strVal.split(',').map(s => s.trim()).filter(Boolean);
  state.form.sections[sIdx].parameters[pIdx].options = opts;
  renderWizard();
};

window.validateAndGoStep3 = () => {
  for (const sec of state.form.sections) {
    if (!sec.name.trim()) {
      toastError('All sections must have a title');
      return;
    }
    for (const p of sec.parameters) {
      if (!p.label.trim()) {
        toastError('All fields must have a label');
        return;
      }
    }
  }
  state.step = 3;
  renderWizard();
};

window.addTransition = () => {
  state.workflow.transitions.push({
    from: 'draft',
    to: 'submitted',
    role: 'citizen',
  });
  renderWizard();
};

window.removeTransition = (idx) => {
  if (state.workflow.transitions.length <= 1) {
    toastError('Workflow must have at least one transition');
    return;
  }
  state.workflow.transitions.splice(idx, 1);
  renderWizard();
};

window.updateTransition = (idx, key, val) => {
  state.workflow.transitions[idx][key] = val;
  renderWizard();
};

window.validateAndGoStep4 = () => {
  for (let i = 0; i < state.workflow.transitions.length; i++) {
    const tr = state.workflow.transitions[i];
    if (!tr.from.trim() || !tr.to.trim()) {
      toastError(`Transition #${i + 1} must have both from and to states.`);
      return;
    }
  }
  state.step = 4;
  renderWizard();
};

// Atomic deployment via moduleBuilder.deploy
window.submitModuleCreation = async () => {
  const btn = document.getElementById('create-module-btn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Deploying Metadata Atomically...';
  }
  state.isSubmitting = true;

  try {
    const formTitle = state.form.name || `${state.basics.name} Form`;
    const repName = state.report.name || `${state.basics.name}s by Area`;

    const payload = {
      module: {
        name: state.basics.name,
        description: state.basics.description,
        domain_id: state.basics.domain_id || 1,
      },
      form: {
        name: formTitle,
        sections: state.form.sections.map(s => ({
          name: s.name,
          parameters: s.parameters.map(p => ({
            field_key: p.field_key,
            label: p.label,
            field_type: p.field_type,
            mandatory: Boolean(p.mandatory),
            options: p.options,
          })),
        })),
      },
      workflow: {
        transitions: state.workflow.transitions.map(t => ({
          from_status: t.from,
          to_status: t.to,
          role: t.role,
        })),
      },
      rules: (state.rule.enabled && state.rule.target_entity_type_id)
        ? [{
            target_entity_type_id: Number(state.rule.target_entity_type_id),
            event: state.rule.event || 'approved',
            auto_create: true,
            auto_approve: false,
          }]
        : [],
      reports: state.report.enabled
        ? [{
            report_name: repName,
            output_format: 'grouped_count',
            filters: {
              groupBy: state.report.groupBy || 'area',
              metric: state.report.metric || 'COUNT',
              metricField: state.report.metricField || undefined,
              public_stats: state.report.publicStats,
            },
          }]
        : [],
    };

    const res = await apiModuleBuilder.deploy(payload);
    toastSuccess(res.message || `Module "${state.basics.name}" deployed successfully!`);

    state.isSubmitting = false;
    state.step = 7; // Success screen
    renderWizard();

  } catch (err) {
    toastError(err.message || 'Failed to deploy module');
    state.isSubmitting = false;
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-right:6px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Deploy Module via Metadata';
    }
  }
};
