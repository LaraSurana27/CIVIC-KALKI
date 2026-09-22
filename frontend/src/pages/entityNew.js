import { requireAuth } from '../auth.js';
import { renderLayout, attachLayoutEvents } from '../components/layout.js';
import { entities as apiEntities, forms as apiForms, values as apiValues } from '../api.js';
import { toastError, toastSuccess } from '../components/toast.js';
import { navigate } from '../router.js';
import { getCapabilityPresentation } from '../utils/terminology.js';
import { JurisdictionSelector } from '../components/jurisdictionSelector.js';

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

      <form id="dynamic-form" style="padding:24px;">
  `;
  
  // Section 1: General Request Identity
  html += `
    <div class="form-section mb-6">
      <div class="form-section-title">About the Request</div>
      <div class="form-section-subtitle">Basic identification fields for your submission</div>
      
      <div class="form-row mt-4">
        <div class="form-group" style="flex:1;">
          <label class="form-label" for="base_name">Title / Summary <span class="required">*</span></label>
          <input type="text" id="base_name" name="_base_name" class="form-control" required placeholder="Brief title summarizing the request or issue">
        </div>
      </div>
      <div class="form-group mt-3">
        <label class="form-label">Jurisdiction <span class="required">*</span></label>
        <div id="jurisdiction-selector-mount"></div>
      </div>
      <div class="form-group mt-3">
        <label class="form-label" for="base_location">Location Details / Street Address</label>
        <input type="text" id="base_location" name="_base_location" class="form-control" placeholder="Specific street address or landmark">
      </div>
    </div>
  `;

  // Section 2: Dynamic Form Sections from FormMaster
  schema.sections.forEach(section => {
    html += `
      <div class="form-section mb-6">
        <div class="form-section-title">${escapeHtml(section.section_name || section.title)}</div>
        ${section.description ? `<div class="form-section-subtitle">${escapeHtml(section.description)}</div>` : ''}
    `;
    
    (section.subsections || []).forEach(sub => {
      if (sub.subsection_name && sub.subsection_name !== 'Main') {
        html += `<div class="form-subsection mt-3"><div class="form-subsection-title">${escapeHtml(sub.subsection_name)}</div>`;
      }
      
      html += `<div class="form-row mt-3">`;
      
      (sub.parameters || []).forEach(param => {
        const isMandatory = param.mandatory || param.is_mandatory;
        const required = isMandatory ? 'required' : '';
        const reqSpan = isMandatory ? '<span class="required">*</span>' : '';
        const nameAttr = `param_${param.parameter_id}`;
        const fieldType = (param.field_type || param.data_type || 'text').toLowerCase();
        
        html += `<div class="form-group" style="flex:1; min-width:200px;">
          <label class="form-label">${escapeHtml(param.label || param.field_key)} ${reqSpan}</label>`;
          
        if (fieldType === 'textarea') {
          html += `<textarea name="${nameAttr}" class="form-control" rows="3" ${required}></textarea>`;
        } else if (fieldType === 'number') {
          html += `<input type="number" name="${nameAttr}" class="form-control" ${required}>`;
        } else if (fieldType === 'date') {
          html += `<input type="date" name="${nameAttr}" class="form-control" ${required}>`;
        } else if (fieldType === 'checkbox') {
          html += `
            <div class="check-group mt-2">
              <input type="checkbox" name="${nameAttr}" id="${nameAttr}" value="true">
              <label for="${nameAttr}">Yes</label>
            </div>
          `;
        } else if (fieldType === 'select') {
          const opts = param.meta_options || (param.options ? (Array.isArray(param.options) ? param.options : param.options.choices) : null) || ['Option 1', 'Option 2'];
          html += `<select name="${nameAttr}" class="form-control" ${required}>
            <option value="">-- Select Option --</option>
            ${opts.map(o => `<option value="${escapeHtml(o)}">${escapeHtml(o)}</option>`).join('')}
          </select>`;
        } else {
          html += `<input type="text" name="${nameAttr}" class="form-control" ${required}>`;
        }
        
        html += `</div>`;
      });
      
      html += `</div>`;
      if (sub.subsection_name && sub.subsection_name !== 'Main') html += `</div>`;
    });
    
    html += `</div>`;
  });

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
  document.getElementById('dynamic-form').addEventListener('submit', handleFormSubmit);
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
    
    if (!data._base_name) {
      throw new Error('Title is a required field.');
    }

    // Resolve jurisdiction from the dynamic selector
    const jselVal = _jurisdictionSelectorInstance ? _jurisdictionSelectorInstance.getValue() : null;
    if (!jselVal) {
      throw new Error('Please select a jurisdiction (at minimum a Country) before submitting.');
    }

    // 1. Create generic Entity (status set to submitted for real workflow start)
    // jurisdiction_id is canonical; area is synchronized from the display path leaf.
    const entityPayload = {
      entity_type_id: currentEntityTypeId,
      name: data._base_name.trim(),
      jurisdiction_id: jselVal.jurisdiction_id,
      area: jselVal.display_path,      // synchronized from jurisdiction selector
      location: data._base_location ? data._base_location.trim() : null,
      status: 'submitted',
    };
    
    const entityRes = await apiEntities.create(entityPayload);
    const entityId = entityRes.data.entity_id;
    
    // 2. Submit parameter values batch
    const valuesPayload = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('param_')) {
        const paramId = Number(key.replace('param_', ''));
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
