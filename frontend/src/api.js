// ── Centralized API layer ──────────────────────────────────────────────────
// All network calls go through here. Uses the Vite proxy: /api → localhost:3000

import { getToken, clearAuth } from './auth.js';

const BASE = '/api';

async function request(method, path, body = null, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const config = {
    method,
    headers,
    ...options,
  };
  if (body !== null) config.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, config);

  // If 401 from server, clear stale session
  if (res.status === 401) {
    clearAuth();
    window.dispatchEvent(new CustomEvent('auth:expired'));
  }

  const data = await res.json().catch(() => ({ success: false, error: 'Invalid server response' }));

  if (!res.ok) {
    const err = new Error(data.error || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

// ── Auth ─────────────────────────────────────────────────────────────────
export const auth = {
  login:          (email, password)             => request('POST', '/auth/login',           { email, password }),
  signup:         (name, email, password)       => request('POST', '/auth/signup',          { name, email, password }),
  changePassword: (current_password, new_password) => request('POST', '/auth/change-password', { current_password, new_password }),
  me:             ()                            => request('GET',  '/auth/me'),
};

// ── Admin ─────────────────────────────────────────────────────────────────
export const admin = {
  listUsers: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request('GET', `/admin/users${q ? '?' + q : ''}`);
  },
  getUser:   (id)          => request('GET', `/admin/users/${id}`),
  setRole:   (id, role, assignedArea) => request('POST', `/admin/users/${id}/role`, { role, assignedArea }),
};

// ── Entities ──────────────────────────────────────────────────────────────
export const entities = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request('GET', `/entities${q ? '?' + q : ''}`);
  },
  listTypes:  ()                => request('GET',    '/entities/entity-types'),
  createType: (body)            => request('POST',   '/entities/entity-types', body),
  createRule: (body)            => request('POST',   '/entities/rules', body),
  get:        (id)              => request('GET',    `/entities/${id}`),
  create:     (body)            => request('POST',   '/entities', body),
  update:     (id, body)        => request('PUT',    `/entities/${id}`, body),
  softDelete: (id)              => request('DELETE', `/entities/${id}`),
  transition: (id, to_status, reason) => request('POST', `/entities/${id}/transition`, { to_status, reason }),
  fireRules:  (id, eventType)   => request('POST',   `/entities/${id}/fire-rules`, { eventType }),
  aiAnalysis: (id)              => request('POST',   `/entities/${id}/ai-analysis`),
  audit:      (id)              => request('GET',    `/entities/${id}/audit`),
  getLineage: (id)              => request('GET',    `/entities/${id}/lineage`),
  workflow:   (id)              => request('GET',    `/entities/${id}/workflow`),
};

// ── Parameter Values ─────────────────────────────────────────────────────
export const values = {
  list:   (entityId)        => request('GET',  `/entities/${entityId}/values`),
  create: (entityId, vals)  => request('POST', `/entities/${entityId}/values`, { values: vals }),
  upsert: (entityId, vals)  => request('PUT',  `/entities/${entityId}/values`, { values: vals }),
};

// ── Forms ─────────────────────────────────────────────────────────────────
export const forms = {
  getMetadata:      ()                     => request('GET',  '/forms/metadata'),
  schema:           (formId)               => request('GET',  `/forms/${formId}/schema`),
  create:           (body)                 => request('POST', '/forms', body),
  addSection:       (formId, body)         => request('POST', `/forms/${formId}/sections`, body),
  addSubsection:    (sectionId, body)      => request('POST', `/sections/${sectionId}/subsections`, body),
  addParameter:     (subsectionId, body)   => request('POST', `/subsections/${subsectionId}/parameters`, body),
};

// ── Reports ───────────────────────────────────────────────────────────────
export const reports = {
  list:    (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request('GET', `/reports${q ? '?' + q : ''}`);
  },
  get:     (id)          => request('GET', `/reports/${id}`),
  create:  (body)        => request('POST', '/reports', body),
  execute: (id, params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request('GET', `/reports/${id}/execute${q ? '?' + q : ''}`);
  },
};

// ── Module Builder ────────────────────────────────────────────────────────
export const moduleBuilder = {
  validate: (body) => request('POST', '/module-builder/validate', body),
  deploy:   (body) => request('POST', '/module-builder/deploy', body),
};

// ── Jurisdictions ─────────────────────────────────────────────────────────
export const jurisdictions = {
  /** List children of a parent (or roots if parent_id omitted) */
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request('GET', `/jurisdictions${q ? '?' + q : ''}`);
  },
  /** Full active tree (Country → … → Ward) */
  tree: () => request('GET', '/jurisdictions?tree=true'),
  /** Single node with ancestor path */
  get: (id) => request('GET', `/jurisdictions/${id}`),
  /** Admin-only create */
  create: (body) => request('POST', '/jurisdictions', body),
  /** Admin-only update */
  update: (id, body) => request('PUT', `/jurisdictions/${id}`, body),
  /** Admin-only non-destructive deactivation */
  deactivate: (id) => request('DELETE', `/jurisdictions/${id}`),
};

// ── Files ─────────────────────────────────────────────────────────────────
export const files = {
  /** Upload files for an entity parameter (multipart) */
  upload: async (entityId, parameterId, fileList) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('entity_id', entityId);
    formData.append('parameter_id', parameterId);
    for (const file of fileList) {
      formData.append('files', file);
    }
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${BASE}/files/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });
    const data = await res.json().catch(() => ({ success: false, error: 'Invalid response' }));
    if (!res.ok) {
      const err = new Error(data.error || `HTTP ${res.status}`);
      err.status = res.status;
      throw err;
    }
    return data;
  },
  /** List all files for an entity */
  listByEntity: (entityId) => request('GET', `/files/entity/${entityId}`),
  /** Get download URL for a file */
  download: (fileId) => `${BASE}/files/${fileId}`,
};

// ── Governance Intelligence ───────────────────────────────────────────────
export const governance = {
  getConfig: () => request('GET', '/governance/config'),
  analyze: (entityTypeId) => request('POST', '/governance/analyze', entityTypeId ? { entity_type_id: entityTypeId } : {}),
};

// ── Health ────────────────────────────────────────────────────────────────
export const health = () => request('GET', '/health');


