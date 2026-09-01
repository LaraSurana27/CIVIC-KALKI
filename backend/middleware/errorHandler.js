/**
 * CIVIC-KALKI — Centralized Express Error Handler
 * All routes pass errors here via next(err).
 * Internal error details are logged server-side only —
 * clients receive a safe, generic message.
 */

/**
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} _next
 */
function errorHandler(err, req, res, _next) {
  // Log the full error server-side (never sent to client)
  console.error(`[ERROR] ${req.method} ${req.path} →`, err);

  // Use a status code attached to the error if provided, else 500
  const statusCode = typeof err.statusCode === 'number' ? err.statusCode : 500;

  // Safe message — stack trace is never exposed in responses
  const message =
    statusCode < 500
      ? err.message // client errors (4xx) are safe to surface
      : 'An unexpected server error occurred. Please try again later.';

  res.status(statusCode).json({ success: false, error: message });
}

module.exports = errorHandler;
