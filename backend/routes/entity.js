/**
 * CIVIC-KALKI — Generic Entity Engine
 * Provides CRUD endpoints that work for ANY entity type.
 * Entity type identity is carried only by entity_type_id — same
 * endpoints serve Movements, Grievances, or any future type.
 *
 * Routes:
 *   POST   /entities
 *   GET    /entities
 *   GET    /entities/:id
 *   PUT    /entities/:id
 *   DELETE /entities/:id  (soft-delete: sets status = 'deleted')
 */

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// ── Helper: create an HTTP-aware error ────────────────────────────────────────
function createError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

// ── Helper: parse a positive integer from a raw value ────────────────────────
function parsePositiveInt(value, fieldName) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw createError(
      `"${fieldName}" must be a positive integer. Received: ${value}`,
      400
    );
  }
  return parsed;
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /entities
// Create a new entity (generic — entity_type_id determines "which type")
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', async (req, res, next) => {
  try {
    const { entity_type_id, name, location, status } = req.body;

    // ── Input validation ─────────────────────────────────────────────────────
    if (entity_type_id === undefined || entity_type_id === null) {
      return next(createError('"entity_type_id" is required.', 400));
    }
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return next(createError('"name" is required and must be a non-empty string.', 400));
    }

    const parsedTypeId = parsePositiveInt(entity_type_id, 'entity_type_id');

    // ── FK existence check — does entity_type_id exist? ──────────────────────
    const entityType = await prisma.entityType.findUnique({
      where: { entity_type_id: parsedTypeId },
    });
    if (!entityType) {
      return next(
        createError(
          `entity_type_id ${parsedTypeId} does not exist. Create the entity type first.`,
          400
        )
      );
    }

    // ── Create entity ─────────────────────────────────────────────────────────
    const entity = await prisma.entity.create({
      data: {
        entity_type_id: parsedTypeId,
        name: name.trim(),
        location: location ? String(location).trim() : null,
        status: status ? String(status).trim() : 'draft',
      },
      include: {
        entityType: {
          select: { entity_type_id: true, name: true },
        },
      },
    });

    return res.status(201).json({ success: true, data: entity });
  } catch (err) {
    return next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /entities
// List entities with optional filtering and pagination.
// Query params: ?entity_type_id=  ?page=  ?limit=  (defaults: page=1, limit=20)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    // ── Pagination ────────────────────────────────────────────────────────────
    const page = req.query.page ? parsePositiveInt(req.query.page, 'page') : 1;
    const limit = req.query.limit
      ? parsePositiveInt(req.query.limit, 'limit')
      : 20;
    const skip = (page - 1) * limit;

    // ── Optional filter ───────────────────────────────────────────────────────
    const where = {};
    if (req.query.entity_type_id !== undefined) {
      where.entity_type_id = parsePositiveInt(
        req.query.entity_type_id,
        'entity_type_id'
      );
    }

    // ── Query ─────────────────────────────────────────────────────────────────
    const [total, entities] = await Promise.all([
      prisma.entity.count({ where }),
      prisma.entity.findMany({
        where,
        skip,
        take: limit,
        orderBy: { entity_id: 'asc' },
        include: {
          entityType: {
            select: { entity_type_id: true, name: true },
          },
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: entities,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /entities/:id
// Fetch a single entity by entity_id, including entity_type info.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const entityId = parsePositiveInt(req.params.id, 'id');

    const entity = await prisma.entity.findUnique({
      where: { entity_id: entityId },
      include: {
        entityType: true,
      },
    });

    if (!entity) {
      return next(
        createError(`Entity with id ${entityId} was not found.`, 404)
      );
    }

    return res.status(200).json({ success: true, data: entity });
  } catch (err) {
    return next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /entities/:id
// Partial update — only fields present in body are updated.
// ─────────────────────────────────────────────────────────────────────────────
router.put('/:id', async (req, res, next) => {
  try {
    const entityId = parsePositiveInt(req.params.id, 'id');
    const { entity_type_id, name, location, status } = req.body;

    // ── At least one field required ───────────────────────────────────────────
    if (
      entity_type_id === undefined &&
      name === undefined &&
      location === undefined &&
      status === undefined
    ) {
      return next(
        createError(
          'Request body must include at least one field to update: entity_type_id, name, location, or status.',
          400
        )
      );
    }

    // ── Check entity exists ───────────────────────────────────────────────────
    const existing = await prisma.entity.findUnique({
      where: { entity_id: entityId },
    });
    if (!existing) {
      return next(
        createError(`Entity with id ${entityId} was not found.`, 404)
      );
    }

    // ── Build update payload (only provided fields) ───────────────────────────
    const updateData = {};

    if (entity_type_id !== undefined) {
      const parsedTypeId = parsePositiveInt(entity_type_id, 'entity_type_id');
      // FK check
      const entityType = await prisma.entityType.findUnique({
        where: { entity_type_id: parsedTypeId },
      });
      if (!entityType) {
        return next(
          createError(
            `entity_type_id ${parsedTypeId} does not exist.`,
            400
          )
        );
      }
      updateData.entity_type_id = parsedTypeId;
    }

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        return next(createError('"name" must be a non-empty string.', 400));
      }
      updateData.name = name.trim();
    }

    if (location !== undefined) {
      updateData.location = location === null ? null : String(location).trim();
    }

    if (status !== undefined) {
      updateData.status = status === null ? null : String(status).trim();
    }

    // ── Perform update ────────────────────────────────────────────────────────
    const updated = await prisma.entity.update({
      where: { entity_id: entityId },
      data: updateData,
      include: {
        entityType: {
          select: { entity_type_id: true, name: true },
        },
      },
    });

    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    return next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /entities/:id  — SOFT DELETE
// Sets entity.status = 'deleted'. No rows are physically removed.
// Children (parameter_value, file_repository, audit_log) are untouched.
// ─────────────────────────────────────────────────────────────────────────────
router.delete('/:id', async (req, res, next) => {
  try {
    const entityId = parsePositiveInt(req.params.id, 'id');

    // ── Check entity exists ───────────────────────────────────────────────────
    const existing = await prisma.entity.findUnique({
      where: { entity_id: entityId },
    });
    if (!existing) {
      return next(
        createError(`Entity with id ${entityId} was not found.`, 404)
      );
    }

    // ── Guard: already soft-deleted ───────────────────────────────────────────
    if (existing.status === 'deleted') {
      return res.status(200).json({
        success: true,
        message: `Entity ${entityId} is already marked as deleted.`,
      });
    }

    // ── Soft delete ───────────────────────────────────────────────────────────
    const softDeleted = await prisma.entity.update({
      where: { entity_id: entityId },
      data: { status: 'deleted' },
    });

    return res.status(200).json({
      success: true,
      message: `Entity ${entityId} has been soft-deleted (status set to 'deleted'). Related records are preserved.`,
      data: { entity_id: softDeleted.entity_id, status: softDeleted.status },
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
