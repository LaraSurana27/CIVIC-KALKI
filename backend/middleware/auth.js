const jwt = require('jsonwebtoken');
const prisma = require('../db');

function createHttpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || typeof authHeader !== 'string') {
      return next(createHttpError('Authentication is required.', 401));
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return next(createHttpError('Authentication is required.', 401));
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'development-secret-change-me'
    );

    req.user = decoded;
    return next();
  } catch (error) {
    if (error && error.name === 'TokenExpiredError') {
      return next(createHttpError('Your session has expired. Please log in again.', 401));
    }
    return next(createHttpError('Authentication is required.', 401));
  }
}

function checkRole(allowedRoles) {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.user_id) {
        return next(createHttpError('Authentication is required.', 401));
      }

      const user = await prisma.user.findUnique({
        where: { user_id: Number(req.user.user_id) },
        select: { role: true },
      });

      if (!user) {
        return next(createHttpError('User account not found.', 401));
      }

      if (!allowedRoles.includes(user.role)) {
        return next(createHttpError('You do not have permission to perform this action.', 403));
      }

      req.user.role = user.role;
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = {
  verifyToken,
  checkRole,
  createHttpError,
};
