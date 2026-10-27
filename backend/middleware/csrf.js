/**
 * CIVIC-KALKI — Lightweight CSRF Middleware
 * Protects state-changing HTTP methods (POST, PUT, PATCH, DELETE) when using cookie authentication.
 *
 * Rules:
 * 1. Require header 'X-Requested-With: ck-web' (custom header browsers cannot send cross-origin without CORS preflight).
 * 2. If 'Origin' header is present, verify against FRONTEND_ORIGIN allowlist (plus localhost/127.0.0.1 in non-prod).
 */

function getFrontendOrigins() {
  const envOrigins = (process.env.FRONTEND_ORIGIN || process.env.FRONTEND_URL || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  if (process.env.NODE_ENV !== 'production') {
    if (!envOrigins.includes('http://localhost:5173')) envOrigins.push('http://localhost:5173');
    if (!envOrigins.includes('http://127.0.0.1:5173')) envOrigins.push('http://127.0.0.1:5173');
  }

  return envOrigins;
}

function csrfProtection(req, res, next) {
  const method = req.method.toUpperCase();

  // Safe read-only methods do not require CSRF header
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return next();
  }

  // 1. Verify X-Requested-With header
  const requestedWith = req.headers['x-requested-with'];
  if (requestedWith !== 'ck-web') {
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Missing or invalid X-Requested-With header.',
    });
  }

  // 2. If Origin header is present, check against allowlist
  const origin = req.headers.origin;
  if (origin) {
    const allowed = getFrontendOrigins();
    if (!allowed.includes(origin)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden: Origin "${origin}" is not allowed.`,
      });
    }
  }

  return next();
}

module.exports = {
  csrfProtection,
  getFrontendOrigins,
};
