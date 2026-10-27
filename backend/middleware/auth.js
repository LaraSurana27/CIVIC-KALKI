/**
 * CIVIC-KALKI — Auth Middleware Facade
 * Re-exports from checkRole.js for backwards compatibility.
 */

const {
  verifyToken,
  optionalAuth,
  checkRole,
  parseCookies,
  createHttpError,
  getJwtSecret,
} = require('./checkRole');

module.exports = {
  verifyToken,
  optionalAuth,
  checkRole,
  parseCookies,
  createHttpError,
  getJwtSecret,
};
