const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { verifyToken, checkRole } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

function createHttpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function parseUserId(value) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw createHttpError('User id must be a positive integer.', 400);
  }
  return parsed;
}

// ─── GET /admin/users — list all users (admin only) ────────────────────────
router.get('/users', verifyToken, checkRole(['admin']), async (req, res, next) => {
  try {
    const page = req.query.page ? Math.max(1, Number(req.query.page)) : 1;
    const limit = req.query.limit ? Math.min(100, Math.max(1, Number(req.query.limit))) : 20;
    const skip = (page - 1) * limit;

    const where = {};
    if (req.query.role) where.role = req.query.role;
    if (req.query.search) {
      where.OR = [
        { name: { contains: req.query.search, mode: 'insensitive' } },
        { email: { contains: req.query.search, mode: 'insensitive' } },
      ];
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_date: 'desc' },
        select: {
          user_id: true,
          name: true,
          email: true,
          role: true,
          assignedArea: true,
          created_date: true,
          updated_date: true,
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return next(error);
  }
});

// ─── GET /admin/users/:id — fetch a single user (admin only) ───────────────
router.get('/users/:id', verifyToken, checkRole(['admin']), async (req, res, next) => {
  try {
    const userId = parseUserId(req.params.id);
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
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

    if (!user) {
      return next(createHttpError(`User with id ${userId} was not found.`, 404));
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return next(error);
  }
});

// ─── POST /admin/users/:id/role — update role (admin only) ─────────────────
router.post('/users/:id/role', verifyToken, checkRole(['admin']), async (req, res, next) => {
  try {
    const userId = parseUserId(req.params.id);
    const { role, assignedArea } = req.body;
    const validRoles = ['citizen', 'coordinator_area', 'coordinator_general', 'director', 'admin'];

    if (!role || typeof role !== 'string' || !validRoles.includes(role)) {
      return next(createHttpError('Role is required and must be one of: citizen, coordinator_area, coordinator_general, director, admin.', 400));
    }

    const current = await prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (!current) {
      return next(createHttpError(`User with id ${userId} was not found.`, 404));
    }

    let nextAssignedArea = null;
    if (role === 'citizen') {
      nextAssignedArea = null;
    } else if (role === 'coordinator_area') {
      if (!assignedArea || typeof assignedArea !== 'string' || assignedArea.trim() === '') {
        return next(createHttpError('assignedArea is required for coordinator_area role.', 400));
      }
      nextAssignedArea = assignedArea.trim();
    } else if (role === 'coordinator_general') {
      nextAssignedArea = 'Unassigned';
    } else if (role === 'director' || role === 'admin') {
      nextAssignedArea = null;
    }

    const updatedUser = await prisma.user.update({
      where: { user_id: userId },
      data: {
        role,
        assignedArea: nextAssignedArea,
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        user_id: updatedUser.user_id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        assignedArea: updatedUser.assignedArea,
        created_date: updatedUser.created_date,
        updated_date: updatedUser.updated_date,
      },
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
