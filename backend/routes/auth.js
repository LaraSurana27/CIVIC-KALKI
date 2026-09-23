const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

function createHttpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function signToken(user) {
  return jwt.sign(
    {
      user_id: user.user_id,
      name: user.name,
      role: user.role,
      assignedArea: user.assignedArea || null,
      assigned_area: user.assignedArea || null,
    },
    process.env.JWT_SECRET || 'development-secret-change-me',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    }
  );
}

router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return next(createHttpError('"name" is required and must be a non-empty string.', 400));
    }

    if (!email || typeof email !== 'string' || email.trim() === '') {
      return next(createHttpError('"email" is required and must be a non-empty string.', 400));
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

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password_hash: passwordHash,
        role: 'citizen',
      },
    });

    const token = signToken(user);

    const safeUser = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      assignedArea: user.assignedArea,
      created_date: user.created_date,
      updated_date: user.updated_date,
    };

    return res.status(201).json({
      success: true,
      data: {
        user: safeUser,
        token,
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== 'string' || email.trim() === '') {
      return next(createHttpError('"email" is required and must be a non-empty string.', 400));
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return next(createHttpError('"password" is required and must be at least 8 characters long.', 400));
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return next(createHttpError('Invalid email or password.', 401));
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return next(createHttpError('Invalid email or password.', 401));
    }

    const token = signToken(user);

    const safeUser = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      assignedArea: user.assignedArea,
      created_date: user.created_date,
      updated_date: user.updated_date,
    };

    return res.status(200).json({
      success: true,
      data: {
        user: safeUser,
        token,
      },
    });
  } catch (error) {
    return next(error);
  }
});


// ── POST /auth/change-password ────────────────────────────────────────────────
// Requires authentication. Verifies current password before updating.
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
// Returns the current authenticated user's safe profile info.
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
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
