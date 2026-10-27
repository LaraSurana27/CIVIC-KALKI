// ── Auth state management ──────────────────────────────────────────────────
// Cookie-based session: the ck_session httpOnly cookie is managed entirely by
// the server. This module caches the user profile in memory only — no token is
// ever stored in sessionStorage or localStorage.

let _user = null;      // in-memory user profile cache
let _expiresAt = null; // ISO string from /auth/me
let _expiryTimer = null;
let _loadingPromise = null;

// ── Internal: call /auth/me and populate in-memory cache ──────────────────
async function _fetchMe() {
  try {
    const res = await fetch('/api/auth/me', {
      credentials: 'include',
      headers: { 'X-Requested-With': 'ck-web' },
    });
    if (!res.ok) {
      _user = null;
      _expiresAt = null;
      return null;
    }
    const json = await res.json();
    if (json.success && json.data) {
      _user = json.data.user || null;
      _expiresAt = json.data.expires_at || null;
      _scheduleExpiry();
      return _user;
    }
    _user = null;
    _expiresAt = null;
    return null;
  } catch {
    _user = null;
    _expiresAt = null;
    return null;
  }
}

// ── Internal: schedule auto-logout at token expiry ────────────────────────
function _scheduleExpiry() {
  if (_expiryTimer) clearTimeout(_expiryTimer);
  if (!_expiresAt) return;
  const msLeft = new Date(_expiresAt).getTime() - Date.now();
  if (msLeft > 0) {
    _expiryTimer = setTimeout(() => {
      // Session has expired — clear in-memory state
      _user = null;
      _expiresAt = null;
      _expiryTimer = null;
    }, msLeft);
  }
}

// ── init: loads session on app startup — call once from main.js ───────────
export async function initAuth() {
  if (_loadingPromise) return _loadingPromise;
  _loadingPromise = _fetchMe().finally(() => { _loadingPromise = null; });
  return _loadingPromise;
}

// ── getUser: returns in-memory cached user (null if anonymous) ─────────────
export function getUser() {
  return _user;
}

// ── getRole: returns role string or null ─────────────────────────────────
export function getRole() {
  return _user?.role || null;
}

// ── isAuthenticated: true if there is a valid in-memory user ─────────────
export function isAuthenticated() {
  if (!_user) return false;
  if (!_expiresAt) return true; // assume valid if no expiry info
  return new Date(_expiresAt).getTime() > Date.now();
}

// ── setUserFromResponse: call after login/signup to hydrate cache ─────────
// `data` is the { user, expires_at } object returned by the server.
export function setUserFromResponse(data) {
  if (!data) return;
  _user = data.user || null;
  _expiresAt = data.expires_at || null;
  _scheduleExpiry();
}

// ── clearAuth: clears in-memory cache (call after logout) ────────────────
export function clearAuth() {
  _user = null;
  _expiresAt = null;
  if (_expiryTimer) {
    clearTimeout(_expiryTimer);
    _expiryTimer = null;
  }
}

// ── refreshUser: re-fetches /auth/me and updates in-memory cache ──────────
export async function refreshUser() {
  return _fetchMe();
}

// ── requireAuth: redirect to /login if not authenticated ─────────────────
export function requireAuth(navigate) {
  if (!isAuthenticated()) {
    navigate('/login');
    return false;
  }
  return true;
}

// ── requireRole: redirect to /dashboard if role not allowed ──────────────
export function requireRole(allowedRoles, navigate) {
  if (!requireAuth(navigate)) return false;
  const role = getRole();
  if (!allowedRoles.includes(role)) {
    navigate('/dashboard');
    return false;
  }
  return true;
}

// ── Role display helpers ──────────────────────────────────────────────────
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

// ── Backwards-compat stubs — kept so existing callers don't break ─────────
// setAuth and getAuth are no-ops: the server owns the cookie.
export function setAuth() {}
export function getAuth() { return _user ? { user: _user } : null; }
export function getToken() { return null; } // token is httpOnly — never accessible
