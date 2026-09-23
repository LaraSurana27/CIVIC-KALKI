import { requireAuth } from '../auth.js';
import { renderLayout, attachLayoutEvents } from '../components/layout.js';
import { entities as apiEntities, forms as apiForms, values as apiValues } from '../api.js';
import { toastError, toastSuccess } from '../components/toast.js';
import { navigate } from '../router.js';
import { getCapabilityPresentation } from '../utils/terminology.js';
import { JurisdictionSelector } from '../components/jurisdictionSelector.js';

const API_BASE = '/api';

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
  );
}

let formSchema = null;
let currentEntityTypeId = null;
let entityTypes = [];
let currentCapability = null;
/** @type {JurisdictionSelector|null} */
let _jurisdictionSelectorInstance = null;

const UNIVERSAL_PARAM_KEYS = new Set([
  'title',
  'name',
  'movement_title',
  'area',
  'jurisdiction',
  'jurisdiction_id',
  'location',
  'landmark',
  'reported_date',
  'reported_on',
  'contact_person',
  'contact_phone',
  'contact_email',
  'priority_level',
  'volunteer_coordinator',
]);

function isUniversalEntityParam(param) {
  const key = String(param.field_key || '').trim().toLowerCase();
  return UNIVERSAL_PARAM_KEYS.has(key);
}

export async function renderEntityNew(params = {}, searchParams = null) {
  if (!requireAuth(navigate)) return;
  
  try {
    const typesRes = await apiEntities.listTypes().catch(() => ({ data: [] }));
    entityTypes = typesRes.data || [];
  } catch (err) {
    entityTypes = [];
  }

  const urlParams = searchParams || new URLSearchParams(window.location.search);
  if (urlParams.has('entity_type_id')) {
    currentEntityTypeId = Number(urlParams.get('entity_type_id'));
  } else if (entityTypes.length > 0) {
    currentEntityTypeId = entityTypes[0].entity_type_id;
  }

  const selectedType = entityTypes.find(t => Number(t.entity_type_id) === Number(currentEntityTypeId));
  currentCapability = getCapabilityPresentation(selectedType);

  const app = document.getElementById('app');
  app.innerHTML = renderLayout(`
    <div class="page-header mb-6">
      <div class="page-header-left">
        <h1 id="page-capability-title">${escapeHtml(currentCapability.title)}</h1>
        <p id="page-capability-sub">Tell us what is happening and where.</p>
      </div>
    </div>
    
    <div class="card mb-6">
      <div class="card-body" style="padding:16px;">
        <div class="form-group" style="max-width: 450px; margin-bottom: 0;">
          <label class="form-label" for="entity-type-select">Target Civic Capability <span class="required">*</span></label>
          <select id="entity-type-select" class="form-control">
            <option value="">-- Select Capability --</option>
            ${entityTypes.map(t => {
              const pres = getCapabilityPresentation(t);
              return `<option value="${t.entity_type_id}" ${Number(currentEntityTypeId) === Number(t.entity_type_id) ? 'selected' : ''}>${escapeHtml(pres.title)}</option>`;
            }).join('')}
          </select>
        </div>
      </div>
    </div>
    
    <div id="dynamic-form-container"></div>
  `, currentCapability.title, entityTypes);
  attachLayoutEvents();

  const selectEl = document.getElementById('entity-type-select');
  selectEl.addEventListener('change', async (e) => {
    const val = e.target.value;
    if (!val) {
      document.getElementById('dynamic-form-container').innerHTML = '';
      formSchema = null;
      return;
    }
    
    currentEntityTypeId = Number(val);
    const sel = entityTypes.find(t => Number(t.entity_type_id) === Number(currentEntityTypeId));
    currentCapability = getCapabilityPresentation(sel);

    document.getElementById('page-capability-title').textContent = currentCapability.title;

    window.history.replaceState({}, '', `/entities/new?entity_type_id=${currentEntityTypeId}`);
    await loadForm(currentEntityTypeId);
  });

  if (currentEntityTypeId) {
    await loadForm(currentEntityTypeId);
  }
}

async function loadForm(entityTypeId) {
  // Destroy any existing jurisdiction selector to avoid stacking instances
  if (_jurisdictionSelectorInstance) {
    _jurisdictionSelectorInstance.destroy();
    _jurisdictionSelectorInstance = null;
  }

  const container = document.getElementById('dynamic-form-container');
  container.innerHTML = '<div class="loading-overlay"><div class="spinner spinner-lg"></div></div>';
  
  try {
    const res = await apiForms.schema(entityTypeId);
    formSchema = res.data;
    renderForm(container, formSchema);
    // Mount dynamic jurisdiction selector after form HTML is in DOM
    await _mountJurisdictionSelector();
  } catch (err) {
    console.error('Form schema load error:', err);
    toastError('Failed to load form schema');
    container.innerHTML = `<div class="alert alert-error">Unable to load form for selected capability. No form configuration exists.</div>`;
  }
}

async function _mountJurisdictionSelector() {
  const mount = document.getElementById('jurisdiction-selector-mount');
  if (!mount) return; // form not rendered
  _jurisdictionSelectorInstance = new JurisdictionSelector(mount, {
    required: true,
    labelPrefix: 'ent-jsel',
  });
  await _jurisdictionSelectorInstance.init();
}

// ── Field Renderer — handles all field types from metadata ──────────────────
function renderField(param) {
  const isMandatory = param.mandatory || param.is_mandatory;
  const required = isMandatory ? 'required' : '';
  const reqSpan = isMandatory ? '<span class="required">*</span>' : '';
  const nameAttr = `param_${param.parameter_id}`;
  const fieldType = (param.field_type || param.data_type || 'text').toLowerCase();
  const label = escapeHtml(param.label || param.field_key);

  // Check conditional dependency (e.g. volunteer fields depending on requires_volunteers === 'Yes')
  const dependsOn = param.options?.depends_on;
  let dependsAttr = '';
  let conditionalClass = '';
  let initialStyle = '';
  if (dependsOn && dependsOn.field_key) {
    dependsAttr = `data-depends-key="${escapeHtml(dependsOn.field_key)}" data-depends-val="${escapeHtml(dependsOn.value)}"`;
    conditionalClass = 'conditional-field';
    initialStyle = 'display:none;';
  }

  // Determine if this field should be full-width
  const isFullWidth = ['textarea', 'file'].includes(fieldType);
  const widthStyle = isFullWidth ? 'flex:1 1 100%; min-width:100%;' : 'flex:1 1 calc(50% - 8px); min-width:200px;';

  let fieldHtml = '';

  switch (fieldType) {
    case 'textarea':
      fieldHtml = `<textarea name="${nameAttr}" class="form-control" rows="3" ${required} placeholder="Enter ${label.toLowerCase()}..."></textarea>`;
      break;

    case 'number':
      fieldHtml = `<input type="number" name="${nameAttr}" class="form-control" ${required} placeholder="0">`;
      break;

    case 'date':
      fieldHtml = `<input type="date" name="${nameAttr}" class="form-control" ${required}>`;
      break;

    case 'email':
      fieldHtml = `<input type="email" name="${nameAttr}" class="form-control" ${required} placeholder="email@example.com">`;
      break;

    case 'phone':
      fieldHtml = `<input type="tel" name="${nameAttr}" class="form-control" ${required} placeholder="+91 XXXXX XXXXX">`;
      break;

    case 'checkbox':
      fieldHtml = `
        <div class="check-group mt-2">
          <input type="checkbox" name="${nameAttr}" id="${nameAttr}" value="true">
          <label for="${nameAttr}">Yes</label>
        </div>
      `;
      break;

    case 'select': {
      const opts = param.meta_options || (param.options ? (Array.isArray(param.options) ? param.options : param.options.choices) : null) || ['Option 1', 'Option 2'];
      const defaultVal = param.options && param.options.default ? param.options.default : '';
      fieldHtml = `<select name="${nameAttr}" class="form-control" ${required}>
        <option value="">-- Select --</option>
        ${opts.map(o => `<option value="${escapeHtml(o)}" ${o === defaultVal ? 'selected' : ''}>${escapeHtml(o)}</option>`).join('')}
      </select>`;
      break;
    }

    case 'file':
      fieldHtml = `
        <div class="file-upload-wrapper" id="file-wrap-${param.parameter_id}">
          <input type="file" name="${nameAttr}" id="file-${param.parameter_id}" 
            class="form-control file-input" 
            data-parameter-id="${param.parameter_id}"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp,.csv,.txt,.zip"
            ${required}>
          <div class="file-upload-info mt-1" style="font-size:0.75rem; color:var(--text-muted);">
            Max 10MB • PDF, Word, Excel, Images, CSV, ZIP
          </div>
          <div id="file-status-${param.parameter_id}" class="file-upload-status mt-1" style="display:none;"></div>
        </div>
      `;
      break;

    default: // text and any unknown
      fieldHtml = `<input type="text" name="${nameAttr}" class="form-control" ${required} placeholder="Enter ${label.toLowerCase()}...">`;
      break;
  }

  return `<div class="form-group ${conditionalClass}" ${dependsAttr} style="${initialStyle} ${widthStyle}">
    <label class="form-label">${label} ${reqSpan}</label>
    ${fieldHtml}
  </div>`;
}

function renderForm(container, schema) {
  if (!schema || !schema.sections || schema.sections.length === 0) {
    container.innerHTML = `<div class="alert alert-warning">This capability has no form fields configured yet.</div>`;
    return;
  }

  let html = `
    <div class="card">
      <div class="card-header border-b">
        <div class="card-title">${escapeHtml(currentCapability.title)}</div>
        <div class="card-subtitle">Complete all required parameter fields for your submission.</div>
      </div>
      
      <div id="form-validation-alert" class="alert alert-danger hidden m-4"></div>
      ${Array.isArray(schema.configuration_errors) && schema.configuration_errors.length > 0
        ? `<div class="alert alert-warning m-4">${escapeHtml(schema.configuration_errors.join(' '))}</div>`
        : ''}

      <form id="dynamic-form" style="padding:24px;">
  `;

  let titleRendered = false;
  let jurisdictionRendered = false;

  schema.sections.forEach((section, sIdx) => {
    const secName = (section.section_name || section.title || '').trim();
    const isFirstSection = sIdx === 0;
    const isWhereSection = secName.toLowerCase().includes('where') || secName.toLowerCase().includes('location');

    html += `
      <div class="form-section mb-6" data-section-name="${escapeHtml(secName)}">
        <div class="form-section-title">${escapeHtml(secName)}</div>
        ${section.description ? `<div class="form-section-subtitle">${escapeHtml(section.description)}</div>` : ''}
    `;

    // 1. Universal Title / Summary — Placed in Section 1 ("About the Initiative")
    if (isFirstSection && !titleRendered) {
      html += `
        <div class="form-row mt-4" style="display:flex; flex-wrap:wrap; gap:16px;">
          <div class="form-group" style="flex:1 1 100%; min-width:100%;">
            <label class="form-label" for="base_name">Title / Summary <span class="required">*</span></label>
            <input type="text" id="base_name" name="_base_name" class="form-control" required placeholder="Brief title summarizing the initiative">
          </div>
        </div>
      `;
      titleRendered = true;
    }

    // 2. Universal Jurisdiction & Location — Placed in Section 2 ("Where is it?")
    if (isWhereSection && !jurisdictionRendered) {
      html += `
        <div class="form-row mt-4" style="display:flex; flex-direction:column; gap:16px;">
          <div class="form-group" style="width:100%;">
            <label class="form-label">Jurisdiction <span class="required">*</span></label>
            <div id="jurisdiction-selector-mount"></div>
          </div>
          <div class="form-group" style="width:100%;">
            <label class="form-label" for="base_location">Specific Location / Address</label>
            <input type="text" id="base_location" name="_base_location" class="form-control" placeholder="Specific street address or building/area (optional)">
          </div>
        </div>
      `;
      jurisdictionRendered = true;
    }

    // Render parameters for this section
    (section.subsections || []).forEach(sub => {
      if (sub.subsection_name && sub.subsection_name !== 'Main') {
        html += `<div class="form-subsection mt-3"><div class="form-subsection-title">${escapeHtml(sub.subsection_name)}</div>`;
      }
      
      const sortedParams = [...(sub.parameters || [])].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      const validParams = sortedParams.filter(p => !isUniversalEntityParam(p) && String(p.field_key || '').trim() && String(p.label || '').trim());
      
      if (validParams.length > 0) {
        html += `<div class="form-row mt-3" style="display:flex; flex-wrap:wrap; gap:16px;">`;
        validParams.forEach(param => {
          html += renderField(param);
        });
        html += `</div>`;
      }
      
      if (sub.subsection_name && sub.subsection_name !== 'Main') html += `</div>`;
    });

    html += `</div>`;
  });

  // Fallback if schema had no "Where is it?" section in metadata
  if (!jurisdictionRendered) {
    html += `
      <div class="form-section mb-6" data-section-name="Where is it?">
        <div class="form-section-title">Where is it?</div>
        <div class="form-row mt-4" style="display:flex; flex-direction:column; gap:16px;">
          <div class="form-group" style="width:100%;">
            <label class="form-label">Jurisdiction <span class="required">*</span></label>
            <div id="jurisdiction-selector-mount"></div>
          </div>
          <div class="form-group" style="width:100%;">
            <label class="form-label" for="base_location">Specific Location / Address</label>
            <input type="text" id="base_location" name="_base_location" class="form-control" placeholder="Specific street address or building/area (optional)">
          </div>
        </div>
      </div>
    `;
  }

  html += `
        <div class="form-section mt-6" style="border-bottom:none; margin-bottom:0; padding-bottom:0;">
          <div class="flex items-center justify-between">
            <div class="text-sm text-muted">Submissions enter the workflow for review by jurisdiction coordinators.</div>
            <button type="submit" id="submit-form-btn" class="btn btn-primary btn-lg" style="box-shadow:var(--shadow-md); display:inline-flex; align-items:center; gap:8px;">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
              Submit Request
            </button>
          </div>
        </div>
      </form>
    </div>
  `;
  
  container.innerHTML = html;
  
  const formEl = document.getElementById('dynamic-form');
  formEl.addEventListener('submit', handleFormSubmit);
  attachConditionalHandlers(formEl, schema);
}

function attachConditionalHandlers(formEl, schema) {
  const allParams = [];
  (schema.sections || []).forEach(sec => {
    (sec.subsections || []).forEach(sub => {
      (sub.parameters || []).forEach(p => allParams.push(p));
    });
  });

  const conditionalEls = formEl.querySelectorAll('.conditional-field');
  if (conditionalEls.length === 0) return;

  function evaluateConditions() {
    conditionalEls.forEach(el => {
      const depKey = el.getAttribute('data-depends-key');
      const depVal = el.getAttribute('data-depends-val');
      if (!depKey) return;

      const controllingParam = allParams.find(p => p.field_key === depKey);
      if (!controllingParam) return;

      const controllingInput = formEl.querySelector(`[name="param_${controllingParam.parameter_id}"]`);
      if (!controllingInput) return;

      const currentVal = String(controllingInput.value || '').trim();
      const isMatch = currentVal.toLowerCase() === String(depVal).toLowerCase();

      if (isMatch) {
        el.style.display = '';
        el.querySelectorAll('input, select, textarea').forEach(inp => {
          inp.disabled = false;
        });
      } else {
        el.style.display = 'none';
        el.querySelectorAll('input, select, textarea').forEach(inp => {
          inp.disabled = true;
          inp.value = '';
        });
      }
    });
  }

  formEl.addEventListener('change', evaluateConditions);
  formEl.addEventListener('input', evaluateConditions);
  evaluateConditions();
}

async function handleFormSubmit(e) {
  e.preventDefault();
  const alertEl = document.getElementById('form-validation-alert');
  if (alertEl) {
    alertEl.classList.add('hidden');
    alertEl.textContent = '';
  }

  const btn = document.getElementById('submit-form-btn');
  btn.disabled = true;
  btn.innerHTML = '<div class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></div> Submitting...';
  
  try {
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    if (!data._base_name || !data._base_name.trim()) {
      const titleInput = document.getElementById('base_name');
      if (titleInput) titleInput.focus();
      throw new Error('Title / Summary is a required field.');
    }

    // Resolve jurisdiction from the dynamic selector
    const jselVal = _jurisdictionSelectorInstance ? _jurisdictionSelectorInstance.getValue() : null;
    if (!jselVal) {
      throw new Error('Please select a jurisdiction (at minimum a Country) before submitting.');
    }

    // Validate all active mandatory metadata parameters
    if (formSchema && formSchema.sections) {
      for (const sec of formSchema.sections) {
        for (const sub of sec.subsections || []) {
          for (const param of sub.parameters || []) {
            if (isUniversalEntityParam(param)) continue;
            if (param.mandatory || param.is_mandatory) {
              const inputEl = e.target.querySelector(`[name="param_${param.parameter_id}"]`);
              if (inputEl && !inputEl.disabled) {
                const val = inputEl.type === 'file'
                  ? (inputEl.files && inputEl.files.length > 0)
                  : String(inputEl.value || '').trim();
                if (!val) {
                  inputEl.focus();
                  throw new Error(`"${param.label || param.field_key}" is a required field.`);
                }
              }
            }
          }
        }
      }
    }

    // 1. Create generic Entity (status set to submitted for real workflow start)
    const entityPayload = {
      entity_type_id: currentEntityTypeId,
      name: data._base_name.trim(),
      jurisdiction_id: jselVal.jurisdiction_id,
      area: jselVal.display_path,
      location: data._base_location ? data._base_location.trim() : null,
      status: 'submitted',
    };
    
    const entityRes = await apiEntities.create(entityPayload);
    const entityId = entityRes.data.entity_id;
    
    // 2. Submit parameter values batch (excluding file params & disabled conditional params)
    const valuesPayload = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('param_')) {
        const paramId = Number(key.replace('param_', ''));
        const inputEl = e.target.querySelector(`[name="${key}"]`);
        if (inputEl && (inputEl.type === 'file' || inputEl.disabled)) continue;
        
        if (value !== undefined && value !== null && String(value).trim() !== '') {
          valuesPayload.push({
            parameter_id: paramId,
            value: String(value).trim(),
          });
        }
      }
    }
    
    if (valuesPayload.length > 0) {
      await apiValues.create(entityId, valuesPayload);
    }

    // 3. Upload files for file-type parameters
    const fileInputs = e.target.querySelectorAll('input[type="file"]');
    for (const fileInput of fileInputs) {
      if (fileInput.files && fileInput.files.length > 0) {
        const paramId = fileInput.getAttribute('data-parameter-id');
        if (!paramId) continue;

        const uploadData = new FormData();
        uploadData.append('entity_id', entityId);
        uploadData.append('parameter_id', paramId);
        for (const file of fileInput.files) {
          uploadData.append('files', file);
        }

        try {
          const token = localStorage.getItem('auth_token');
          await fetch(`${API_BASE}/files/upload`, {
            method: 'POST',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body: uploadData,
          });
        } catch (uploadErr) {
          console.warn('File upload warning:', uploadErr);
        }
      }
    }
    
    toastSuccess('Request submitted successfully!');
    renderSuccessScreen(entityId, data._base_name);
    
  } catch (err) {
    const msg = err.message || 'Failed to submit request';
    if (alertEl) {
      alertEl.textContent = msg;
      alertEl.classList.remove('hidden');
    }
    toastError(msg);
    btn.disabled = false;
    btn.innerHTML = '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-right:8px"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg> Submit Request';
  }
}

function renderSuccessScreen(entityId, title) {
  const container = document.getElementById('dynamic-form-container');
  const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  container.innerHTML = `
    <div class="card p-8 text-center" style="padding:48px 24px; text-align:center; max-width:640px; margin:0 auto;">
      <div style="width:64px; height:64px; border-radius:50%; background:var(--green-50); border:2px solid var(--green-100); color:var(--green-600); display:flex; align-items:center; justify-content:center; margin:0 auto 16px;">
        <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
      </div>

      <h2 style="font-size:1.5rem; font-weight:800; color:var(--text-primary); margin-bottom:6px;">
        Request Submitted
      </h2>
      <p style="font-size:0.95rem; color:var(--text-secondary); margin-bottom:24px;">
        Your request has been recorded and entered into the civic workflow for jurisdiction review.
      </p>

      <div style="background:var(--gray-50); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px; text-align:left; margin-bottom:32px;">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; font-size:0.875rem;">
          <div>
            <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Request ID</div>
            <div style="font-weight:700; color:var(--primary); font-family:var(--font-mono); margin-top:2px;">#PR-${String(entityId).padStart(5, '0')}</div>
          </div>
          <div>
            <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Status</div>
            <div style="margin-top:2px;"><span class="badge badge-submitted">Submitted</span></div>
          </div>
          <div style="grid-column: span 2;">
            <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Title</div>
            <div style="font-weight:600; color:var(--text-primary); margin-top:2px;">${escapeHtml(title)}</div>
          </div>
          <div>
            <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Submission Date</div>
            <div style="color:var(--text-secondary); margin-top:2px;">${todayStr}</div>
          </div>
        </div>
      </div>

      <div style="display:flex; gap:12px; justify-content:center;">
        <a href="/entities/${entityId}" class="btn btn-primary btn-lg" style="display:inline-flex; align-items:center; gap:8px;">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          View Request Details
        </a>
        <a href="/dashboard" class="btn btn-secondary btn-lg">Back to My Workspace</a>
      </div>
    </div>
  `;
}
