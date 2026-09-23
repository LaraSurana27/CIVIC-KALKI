// ── Auth state management ──────────────────────────────────────────────────
// Stores JWT + user profile in localStorage, provides reactive getters.

const STORAGE_KEY = 'ck_auth';

export function getAuth() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAuth(data) {
  // data: { token, user }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearAuth() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function getToken() {
  return getAuth()?.token || null;
}

export function getUser() {
  return getAuth()?.user || null;
}

export function getRole() {
  return getUser()?.role || null;
}

export function isAuthenticated() {
  const token = getToken();
  if (!token) return false;
  try {
    // Decode JWT payload (no crypto verify — server does that)
    const [, payload] = token.split('.');
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function requireAuth(navigate) {
  if (!isAuthenticated()) {
    navigate('/login');
    return false;
  }
  return true;
}

export function requireRole(allowedRoles, navigate) {
  if (!requireAuth(navigate)) return false;
  const role = getRole();
  if (!allowedRoles.includes(role)) {
    navigate('/dashboard');
    return false;
  }
  return true;
}

// Role display helpers
const ROLE_LABELS = {
  citizen: 'Citizen',
  coordinator_area: 'Area Coordinator',
  coordinator_general: 'General Coordinator',
  director: 'Director',
  admin: 'Administrator',
};
export function roleLabel(role) {
  return ROLE_LABELS[role] || role;
}

export const ROLES = ['citizen', 'coordinator_area', 'coordinator_general', 'director', 'admin'];

export async function refreshUser() {
  const auth = getAuth();
  if (!auth?.token) return null;
  try {
    const res = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success && json.data) {
      setAuth({ ...auth, user: json.data });
      return json.data;
    }
  } catch (err) {
    console.warn('[auth] refreshUser failed:', err);
  }
  return auth.user || null;
}
