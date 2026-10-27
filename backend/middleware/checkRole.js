/**
 * CIVIC-KALKI — Auth & Role Middleware
 * Exports: verifyToken, optionalAuth, checkRole, createHttpError, parseCookies
 *
 * Implements httpOnly cookie session authentication (ck_session) with pinned HS256 algorithm.
 */

const jwt = require('jsonwebtoken');
const prisma = require('../db');

function createHttpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

/**
 * Parses raw cookie header string into an object map.
 * No external dependencies.
 */
function parseCookies(cookieHeader) {
  const list = {};
  if (!cookieHeader || typeof cookieHeader !== 'string') return list;

  const pairs = cookieHeader.split(';');
  for (const pair of pairs) {
    const idx = pair.indexOf('=');
    if (idx < 0) continue;
    const key = pair.substring(0, idx).trim();
    const val = pair.substring(idx + 1).trim();
    if (key) {
      try {
        list[key] = decodeURIComponent(val);
      } catch {
        list[key] = val;
      }
    }
  }
  return list;
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be set and at least 32 characters long.');
  }
  return secret;
}

/**
 * Strict verification middleware: requires valid ck_session cookie.
 * Rejects missing/expired/invalid cookies with 401.
 */
async function verifyToken(req, res, next) {
  try {
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies.ck_session;

    if (!token) {
      return next(createHttpError('Authentication is required.', 401));
    }

    const secret = getJwtSecret();
    let decoded;
    try {
      decoded = jwt.verify(token, secret, { algorithms: ['HS256'] });
    } catch (err) {
      if (err && err.name === 'TokenExpiredError') {
        return next(createHttpError('Your session has expired. Please log in again.', 401));
      }
      return next(createHttpError('Authentication is required.', 401));
    }

    // Attach decoded user
    req.user = decoded;

    // Refresh role and assignedArea directly from database to prevent stale claims
    if (decoded && decoded.user_id) {
      const dbUser = await prisma.user.findUnique({
        where: { user_id: Number(decoded.user_id) },
        select: { user_id: true, name: true, role: true, assignedArea: true },
      });
      if (dbUser) {
        req.user.role = dbUser.role;
        req.user.assignedArea = dbUser.assignedArea || null;
        req.user.assigned_area = dbUser.assignedArea || null;
      }
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

/**
 * Optional authentication middleware:
 * - If no cookie present: proceeds as anonymous (req.user remains undefined).
 * - If cookie IS present but invalid/expired: returns 401 immediately (never silently downgrade).
 * - If cookie is valid: loads fresh user/role/assignedArea from DB and sets req.user.
 */
async function optionalAuth(req, res, next) {
  try {
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies.ck_session;

    if (!token) {
      // Anonymous request
      req.user = undefined;
      return next();
    }

    const secret = getJwtSecret();
    let decoded;
    try {
      decoded = jwt.verify(token, secret, { algorithms: ['HS256'] });
    } catch (err) {
      if (err && err.name === 'TokenExpiredError') {
        return next(createHttpError('Your session has expired. Please log in again.', 401));
      }
      return next(createHttpError('Authentication is required.', 401));
    }

    req.user = decoded;

    if (decoded && decoded.user_id) {
      const dbUser = await prisma.user.findUnique({
        where: { user_id: Number(decoded.user_id) },
        select: { user_id: true, name: true, role: true, assignedArea: true },
      });
      if (dbUser) {
        req.user.role = dbUser.role;
        req.user.assignedArea = dbUser.assignedArea || null;
        req.user.assigned_area = dbUser.assignedArea || null;
      }
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

/**
 * Role authorization guard.
 * Requires verifyToken to have run first (or checks req.user).
 */
function checkRole(allowedRoles) {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.user_id) {
        return next(createHttpError('Authentication is required.', 401));
      }

      const user = await prisma.user.findUnique({
        where: { user_id: Number(req.user.user_id) },
        select: { role: true, assignedArea: true },
      });

      if (!user) {
        return next(createHttpError('User account not found.', 401));
      }

      if (!allowedRoles.includes(user.role)) {
        return next(createHttpError('You do not have permission to perform this action.', 403));
      }

      req.user.role = user.role;
      req.user.assignedArea = user.assignedArea;
      req.user.assigned_area = user.assignedArea;
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = {
  verifyToken,
  optionalAuth,
  checkRole,
  parseCookies,
  createHttpError,
  getJwtSecret,
};
