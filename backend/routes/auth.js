const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../db');
const { verifyToken, createHttpError, getJwtSecret } = require('../middleware/checkRole');

const router = express.Router();

// ── In-Memory Login Rate Limiter (Max 5 attempts / 15 mins per email+IP) ─────
const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

// Dummy hash for constant-time comparisons when email is not found
const DUMMY_HASH = '$2b$12$e8pA2vI0Y6jDkW5b2G6G7.fMhN9K0S2p8E6jDkW5b2G6G7.fMhN9K';

function getRateLimitKey(email, req) {
  const ip = req.ip || req.socket?.remoteAddress || 'unknown';
  return `${String(email).trim().toLowerCase()}_${ip}`;
}

function checkRateLimit(key) {
  const now = Date.now();
  const entry = loginAttempts.get(key);
  if (!entry) return false;
  if (now - entry.firstAttempt > LOGIN_WINDOW_MS) {
    loginAttempts.delete(key);
    return false;
  }
  return entry.count >= MAX_LOGIN_ATTEMPTS;
}

function recordFailedLogin(key) {
  const now = Date.now();
  const entry = loginAttempts.get(key);
  if (!entry || now - entry.firstAttempt > LOGIN_WINDOW_MS) {
    loginAttempts.set(key, { count: 1, firstAttempt: now });
  } else {
    entry.count += 1;
  }
}

function clearRateLimit(key) {
  loginAttempts.delete(key);
}

function getJwtLifetimeMs() {
  const raw = process.env.JWT_EXPIRES_IN || '24h';
  const match = String(raw).trim().match(/^(\d+)([smhd])?$/i);
  if (!match) return 24 * 60 * 60 * 1000;
  const num = parseInt(match[1], 10);
  const unit = (match[2] || 's').toLowerCase();
  switch (unit) {
    case 's': return num * 1000;
    case 'm': return num * 60 * 1000;
    case 'h': return num * 60 * 60 * 1000;
    case 'd': return num * 24 * 60 * 60 * 1000;
    default: return 24 * 60 * 60 * 1000;
  }
}

function getCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: getJwtLifetimeMs(),
  };
}

function signToken(user) {
  const secret = getJwtSecret();
  const lifetimeMs = getJwtLifetimeMs();
  const token = jwt.sign(
    {
      user_id: user.user_id,
      name: user.name,
      role: user.role,
      assigned_area: user.assignedArea || null,
      assignedArea: user.assignedArea || null,
    },
    secret,
    {
      algorithm: 'HS256',
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    }
  );
  const expires_at = new Date(Date.now() + lifetimeMs).toISOString();
  return { token, expires_at };
}

// ── POST /auth/signup ─────────────────────────────────────────────────────────
router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return next(createHttpError('"name" is required and must be a non-empty string.', 400));
    }

    if (!email || typeof email !== 'string' || email.trim() === '') {
      return next(createHttpError('"email" is required and must be a non-empty string.', 400));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return next(createHttpError('Invalid email format.', 400));
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return next(createHttpError('"password" is required and must be at least 8 characters long.', 400));
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return next(createHttpError('An account with this email already exists.', 409));
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Always create as citizen, ignoring any sent role or assignedArea
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password_hash: passwordHash,
        role: 'citizen',
        assignedArea: null,
      },
    });

    const { token, expires_at } = signToken(user);
    res.cookie('ck_session', token, getCookieOptions());

    const safeUser = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      assigned_area: user.assignedArea,
      assignedArea: user.assignedArea,
    };

    return res.status(201).json({
      success: true,
      data: {
        user: safeUser,
        expires_at,
      },
    });
  } catch (error) {
    return next(error);
  }
});

// ── POST /auth/login ──────────────────────────────────────────────────────────
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== 'string' || email.trim() === '') {
      return next(createHttpError('Invalid email or password.', 401));
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return next(createHttpError('Invalid email or password.', 401));
    }

    const normalizedEmail = email.trim().toLowerCase();
    const rateLimitKey = getRateLimitKey(normalizedEmail, req);

    if (checkRateLimit(rateLimitKey)) {
      return res.status(429).json({
        success: false,
        error: 'Too many failed login attempts. Please try again in 15 minutes.',
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      // Dummy compare to avoid timing side-channels
      await bcrypt.compare(password, DUMMY_HASH);
      recordFailedLogin(rateLimitKey);
      return next(createHttpError('Invalid email or password.', 401));
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      recordFailedLogin(rateLimitKey);
      return next(createHttpError('Invalid email or password.', 401));
    }

    // Success — clear any failed attempts
    clearRateLimit(rateLimitKey);

    const { token, expires_at } = signToken(user);
    res.cookie('ck_session', token, getCookieOptions());

    const safeUser = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      assigned_area: user.assignedArea,
      assignedArea: user.assignedArea,
    };

    return res.status(200).json({
      success: true,
      data: {
        user: safeUser,
        expires_at,
      },
    });
  } catch (error) {
    return next(error);
  }
});

// ── POST /auth/logout ─────────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  res.clearCookie('ck_session', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
});

// ── POST /auth/change-password ────────────────────────────────────────────────
router.post('/change-password', verifyToken, async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || typeof current_password !== 'string') {
      return next(createHttpError('"current_password" is required.', 400));
    }
    if (!new_password || typeof new_password !== 'string' || new_password.length < 8) {
      return next(createHttpError('"new_password" must be at least 8 characters long.', 400));
    }

    const user = await prisma.user.findUnique({
      where: { user_id: req.user.user_id },
    });

    if (!user) {
      return next(createHttpError('User not found.', 404));
    }

    const valid = await bcrypt.compare(current_password, user.password_hash);
    if (!valid) {
      return next(createHttpError('Current password is incorrect.', 401));
    }

    const newHash = await bcrypt.hash(new_password, 12);

    await prisma.user.update({
      where: { user_id: req.user.user_id },
      data: { password_hash: newHash },
    });

    return res.status(200).json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    return next(error);
  }
});

// ── GET /auth/me ──────────────────────────────────────────────────────────────
router.get('/me', verifyToken, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { user_id: req.user.user_id },
      select: {
        user_id: true,
        name: true,
        email: true,
        role: true,
        assignedArea: true,
        created_date: true,
        updated_date: true,
      },
    });

    if (!user) return next(createHttpError('User not found.', 404));

    const expires_at = req.user.exp
      ? new Date(req.user.exp * 1000).toISOString()
      : new Date(Date.now() + getJwtLifetimeMs()).toISOString();

    return res.status(200).json({
      success: true,
      data: {
        user: {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
          assigned_area: user.assignedArea,
          assignedArea: user.assignedArea,
          created_date: user.created_date,
          updated_date: user.updated_date,
        },
        expires_at,
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.signToken = signToken;
router.getCookieOptions = getCookieOptions;
router.getJwtLifetimeMs = getJwtLifetimeMs;

module.exports = router;
