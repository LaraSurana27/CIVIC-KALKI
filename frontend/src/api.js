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
  login:  (email, password)          => request('POST', '/auth/login',  { email, password }),
  signup: (name, email, password)    => request('POST', '/auth/signup', { name, email, password }),
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
  get:        (id)              => request('GET',    `/entities/${id}`),
  create:     (body)            => request('POST',   '/entities', body),
  update:     (id, body)        => request('PUT',    `/entities/${id}`, body),
  softDelete: (id)              => request('DELETE', `/entities/${id}`),
  transition: (id, to_status, reason) => request('POST', `/entities/${id}/transition`, { to_status, reason }),
  fireRules:  (id, eventType)   => request('POST',   `/entities/${id}/fire-rules`, { eventType }),
  audit:      (id)              => request('GET',    `/entities/${id}/audit`),
};

// ── Parameter Values ─────────────────────────────────────────────────────
export const values = {
  list:   (entityId)        => request('GET',  `/entities/${entityId}/values`),
  create: (entityId, vals)  => request('POST', `/entities/${entityId}/values`, { values: vals }),
  upsert: (entityId, vals)  => request('PUT',  `/entities/${entityId}/values`, { values: vals }),
};

// ── Forms ─────────────────────────────────────────────────────────────────
export const forms = {
  schema:           (formId)               => request('GET',  `/forms/${formId}/schema`),
  create:           (body)                 => request('POST', '/forms', body),
  addSection:       (formId, body)         => request('POST', `/forms/${formId}/sections`, body),
  addSubsection:    (sectionId, body)      => request('POST', `/sections/${sectionId}/subsections`, body),
  addParameter:     (subsectionId, body)   => request('POST', `/subsections/${subsectionId}/parameters`, body),
};

// ── Health ────────────────────────────────────────────────────────────────
export const health = () => request('GET', '/health');
