import { requireAuth } from '../auth.js';
import { renderLayout, attachLayoutEvents } from '../components/layout.js';
import { entities as apiEntities, forms as apiForms, values as apiValues } from '../api.js';
import { toastError, toastSuccess } from '../components/toast.js';
import { navigate } from '../router.js';

let formSchema = null;
let currentEntityTypeId = null;

export async function renderEntityNew() {
  if (!requireAuth(navigate)) return;
  
  const app = document.getElementById('app');
  app.innerHTML = renderLayout(`
    <div class="page-header">
      <div class="page-header-left">
        <h1>Create New Case</h1>
        <p>Select a case type to begin filing your report or request.</p>
      </div>
    </div>
    
    <div class="card mb-6">
      <div class="card-body">
        <div class="form-group" style="max-width: 400px; margin-bottom: 0;">
          <label class="form-label">Case Type</label>
          <select id="entity-type-select" class="form-control">
            <option value="">-- Select Type --</option>
            <option value="1">Pothole Report</option>
            <option value="2">Streetlight Repair</option>
            <option value="3">Garbage Collection Issue</option>
            <option value="4">Water Supply Complaint</option>
          </select>
        </div>
      </div>
    </div>
    
    <div id="dynamic-form-container"></div>
  `, 'New Case');
  attachLayoutEvents();

  document.getElementById('entity-type-select').addEventListener('change', async (e) => {
    const val = e.target.value;
    if (!val) {
      document.getElementById('dynamic-form-container').innerHTML = '';
      formSchema = null;
      return;
    }
    
    currentEntityTypeId = Number(val);
    await loadForm(currentEntityTypeId);
  });
}

async function loadForm(entityTypeId) {
  const container = document.getElementById('dynamic-form-container');
  container.innerHTML = '<div class="loading-overlay"><div class="spinner spinner-lg"></div></div>';
  
  try {
    // For this prototype, we assume form ID == entity Type ID
    // In reality, we would query the form linked to the entityType
    const res = await apiForms.schema(entityTypeId);
    formSchema = res.data;
    
    renderForm(container, formSchema);
  } catch (err) {
    toastError('Failed to load form schema for this case type');
    container.innerHTML = `<div class="alert alert-error">Unable to load the specific form. It may not be configured yet.</div>`;
  }
}

function renderForm(container, schema) {
  if (!schema || !schema.sections) {
    container.innerHTML = `<div class="alert alert-warning">This form has no fields configured.</div>`;
    return;
  }

  let html = `
    <div class="card">
      <div class="card-header">
        <div class="card-title">${escapeHtml(schema.name)}</div>
        <div class="card-subtitle">Please fill out all required fields carefully.</div>
      </div>
      <form id="dynamic-form">
  `;
  
  // Basic Entity info (always required)
  html += `
    <div class="form-section">
      <div class="form-section-title">General Information</div>
      <div class="form-section-subtitle">Basic details about this case</div>
      
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Case Title <span class="required">*</span></label>
          <input type="text" id="base_name" name="_base_name" class="form-control" required placeholder="A brief title">
        </div>
        <div class="form-group">
          <label class="form-label">Area / Locality <span class="required">*</span></label>
          <select id="base_area" name="_base_area" class="form-control" required>
            <option value="">-- Select Area --</option>
            <option value="North District">North District</option>
            <option value="South District">South District</option>
            <option value="East District">East District</option>
            <option value="West District">West District</option>
            <option value="Central">Central</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Exact Location / Address</label>
        <input type="text" id="base_location" name="_base_location" class="form-control" placeholder="Street address or landmark">
      </div>
    </div>
  `;

  // Dynamic Form Sections
  schema.sections.forEach(section => {
    html += `
      <div class="form-section">
        <div class="form-section-title">${escapeHtml(section.title)}</div>
        ${section.description ? `<div class="form-section-subtitle">${escapeHtml(section.description)}</div>` : ''}
    `;
    
    section.subsections.forEach(sub => {
      if (sub.title) {
        html += `<div class="form-subsection"><div class="form-subsection-title">${escapeHtml(sub.title)}</div>`;
      }
      
      html += `<div class="form-row">`;
      
      sub.parameters.forEach(param => {
        const required = param.is_mandatory ? 'required' : '';
        const reqSpan = param.is_mandatory ? '<span class="required">*</span>' : '';
        const nameAttr = `param_${param.parameter_id}`;
        
        html += `<div class="form-group">
          <label class="form-label">${escapeHtml(param.label)} ${reqSpan}</label>`;
          
        if (param.data_type === 'text') {
          html += `<input type="text" name="${nameAttr}" class="form-control" ${required}>`;
        } else if (param.data_type === 'number') {
          html += `<input type="number" name="${nameAttr}" class="form-control" ${required}>`;
        } else if (param.data_type === 'date') {
          html += `<input type="date" name="${nameAttr}" class="form-control" ${required}>`;
        } else if (param.data_type === 'boolean') {
          html += `
            <div class="check-group mt-2">
              <input type="checkbox" name="${nameAttr}" id="${nameAttr}" value="true">
              <label for="${nameAttr}">Yes</label>
            </div>
          `;
        } else if (param.data_type === 'select') {
          // Assume meta options for now
          const options = param.meta_options || ['Option A', 'Option B']; 
          html += `<select name="${nameAttr}" class="form-control" ${required}>
            <option value="">-- Select --</option>
            ${options.map(o => `<option value="${escapeHtml(o)}">${escapeHtml(o)}</option>`).join('')}
          </select>`;
        }
        
        html += `</div>`;
      });
      
      html += `</div>`; // .form-row
      if (sub.title) html += `</div>`; // .form-subsection
    });
    
    html += `</div>`; // .form-section
  });

  html += `
        <div class="form-section" style="border-bottom:none; margin-bottom:0; padding-bottom:0;">
          <div class="flex items-center justify-between">
            <div class="text-sm text-muted">Your case will be saved as a Draft. You can submit it from the case details page.</div>
            <button type="submit" id="submit-form-btn" class="btn btn-primary btn-lg">Save Draft</button>
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
  const btn = document.getElementById('submit-form-btn');
  btn.disabled = true;
  btn.innerHTML = '<div class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></div> Saving...';
  
  try {
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // 1. Create base Entity
    const entityPayload = {
      entity_type_id: currentEntityTypeId,
      name: data._base_name,
      area: data._base_area,
      location: data._base_location || null,
      status: 'draft' // Always start as draft
    };
    
    const entityRes = await apiEntities.create(entityPayload);
    const entityId = entityRes.data.entity_id;
    
    // 2. Submit parameter values
    const valuesPayload = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('param_')) {
        const paramId = Number(key.replace('param_', ''));
        if (value.trim() !== '') {
          valuesPayload.push({
            parameter_id: paramId,
            value: value.trim()
          });
        }
      }
    }
    
    if (valuesPayload.length > 0) {
      await apiValues.create(entityId, valuesPayload);
    }
    
    toastSuccess('Case created successfully');
    navigate(`/entities/${entityId}`);
    
  } catch (err) {
    toastError(err.message || 'Failed to save case');
    btn.disabled = false;
    btn.innerHTML = 'Save Draft';
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
  );
}
