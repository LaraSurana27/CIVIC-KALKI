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
