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
const { verifyToken, checkRole, createHttpError } = require('../middleware/auth');
const { checkAndFireRules } = require('../services/ruleEngine');

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

function isAllowedWorkflowTransition({
  currentStatus,
  targetStatus,
  actorRole,
  actorUserId,
  ownerUserId,
  actorAssignedArea,
  entityArea,
}) {
  const current = String(currentStatus || 'draft').trim().toLowerCase();
  const next = String(targetStatus).trim().toLowerCase();

  if (current === 'deleted') return false;
  if (!['draft', 'submitted', 'coordinator_approved', 'approved', 'rejected'].includes(current)) {
    return false;
  }

  if (current === 'approved' || current === 'rejected') return false;

  if (actorRole === 'citizen') {
    if (current === 'draft' && next === 'submitted') {
      return Number(actorUserId) === Number(ownerUserId);
    }
    return false;
  }

  if (actorRole === 'coordinator_area') {
    if (current === 'submitted') {
      if (next === 'coordinator_approved') {
        return String(entityArea || '').trim() === String(actorAssignedArea || '').trim();
      }
      if (next === 'rejected') {
        return String(entityArea || '').trim() === String(actorAssignedArea || '').trim();
      }
    }
    return false;
  }

  if (actorRole === 'coordinator_general') {
    if (current === 'submitted') {
      const normalizedArea = String(entityArea || '').trim();
      if (next === 'coordinator_approved') {
        return normalizedArea === 'Unassigned' || normalizedArea === '';
      }
      if (next === 'rejected') {
        return normalizedArea === 'Unassigned' || normalizedArea === '';
      }
    }
    return false;
  }

  if (actorRole === 'director') {
    if (current === 'coordinator_approved' && (next === 'approved' || next === 'rejected')) {
      return true;
    }
    return false;
  }

  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /entities
// Create a new entity (generic — entity_type_id determines "which type")
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', verifyToken, async (req, res, next) => {
  try {
    const { entity_type_id, name, location, area, status } = req.body;

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

    // ── Create entity; ownership always comes from the authenticated user ───
    const entity = await prisma.entity.create({
      data: {
        entity_type_id: parsedTypeId,
        owner_user_id: req.user.user_id,
        name: name.trim(),
        location: location ? String(location).trim() : null,
        area: area !== undefined && area !== null ? String(area).trim() || null : null,
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
    const { entity_type_id, name, location, area, status } = req.body;

    // ── At least one field required ───────────────────────────────────────────
    if (
      entity_type_id === undefined &&
      name === undefined &&
      location === undefined &&
      area === undefined &&
      status === undefined
    ) {
      return next(
        createError(
          'Request body must include at least one field to update: entity_type_id, name, location, or area.',
          400
        )
      );
    }

    if (status !== undefined) {
      return next(
        createError('Status updates must go through POST /entities/:id/transition.', 400)
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

    if (area !== undefined) {
      updateData.area = area === null ? null : String(area).trim();
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

    // ── Fire rule engine (non-blocking) if status was changed ────────────────
    // Entity update succeeds regardless of rule engine outcome.
    if (status !== undefined && typeof status === 'string' && status.trim() !== '') {
      const eventType = status.trim().toLowerCase();
      checkAndFireRules(entityId, eventType)
        .then((ruleResult) => {
          if (ruleResult.rulesFired > 0) {
            console.log(
              `[RULE ENGINE] ${ruleResult.rulesFired} rule(s) fired for entity #${entityId}, event "${eventType}". ` +
              `Created: ${ruleResult.createdEntities.map((e) => `#${e.entity_id}`).join(', ')}`
            );
          }
        })
        .catch((ruleErr) => {
          // Log the error server-side but never fail the update response
          console.error(
            `[RULE ENGINE ERROR] Failed to process rules for entity #${entityId}, event "${eventType}":`,
            ruleErr
          );
        });
    }

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

// ─────────────────────────────────────────────────────────────────────────────
// POST /entities/:id/transition
// Protected workflow step: the actor is taken from the JWT and the audit log is
// written in the same request.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/:id/transition', verifyToken, checkRole(['citizen', 'coordinator_area', 'coordinator_general', 'director', 'admin']), async (req, res, next) => {
  try {
    const entityId = parsePositiveInt(req.params.id, 'id');
    const { to_status, reason } = req.body;

    if (!to_status || typeof to_status !== 'string' || to_status.trim() === '') {
      return next(createError('"to_status" is required and must be a non-empty string.', 400));
    }

    const normalizedToStatus = to_status.trim();
    if (!['draft', 'submitted', 'coordinator_approved', 'approved', 'rejected', 'deleted'].includes(normalizedToStatus)) {
      return next(createError('to_status must be a supported workflow state.', 400));
    }

    if (normalizedToStatus === 'rejected' && (!reason || typeof reason !== 'string' || reason.trim() === '')) {
      return next(createError('A reason is required when rejecting an entity.', 400));
    }

    const existingEntity = await prisma.entity.findUnique({
      where: { entity_id: entityId },
    });

    if (!existingEntity) {
      return next(createError(`Entity with id ${entityId} was not found.`, 404));
    }

    const currentStatus = (existingEntity.status || 'draft').trim().toLowerCase();
    const actorRole = req.user.role;
    const actorAssignedArea = await prisma.user.findUnique({
      where: { user_id: Number(req.user.user_id) },
      select: { assignedArea: true },
    }).then((user) => user?.assignedArea || null);

    const isAllowed = isAllowedWorkflowTransition({
      currentStatus,
      targetStatus: normalizedToStatus,
      actorRole,
      actorUserId: req.user.user_id,
      ownerUserId: existingEntity.owner_user_id,
      actorAssignedArea,
      entityArea: existingEntity.area,
    });

    if (!isAllowed) {
      return next(createError(`Cannot transition an entity from ${currentStatus} to ${normalizedToStatus}.`, 400));
    }

    const previousStatus = existingEntity.status || 'draft';

    const updatedEntity = await prisma.entity.update({
      where: { entity_id: entityId },
      data: {
        status: normalizedToStatus,
      },
    });

    await prisma.auditLog.create({
      data: {
        entity_id: entityId,
        actor_user_id: req.user.user_id,
        action: 'status_transition',
        user: req.user.name,
        old_status: previousStatus,
        new_status: normalizedToStatus,
        reason: reason ? String(reason).trim() : null,
      },
    });

    await prisma.approvalHistory.create({
      data: {
        entity_id: entityId,
        actor_user_id: req.user.user_id,
        from_status: previousStatus,
        to_status: normalizedToStatus,
        reason: reason ? String(reason).trim() : null,
      },
    });

    let ruleResult = null;
    if (normalizedToStatus === 'approved') {
      try {
        ruleResult = await checkAndFireRules(entityId, 'approved');
      } catch (ruleErr) {
        console.error(`[RULE ENGINE ERROR] Failed to process approval for entity #${entityId}:`, ruleErr);
      }
    }

    return res.status(200).json({
      success: true,
      data: updatedEntity,
      ruleResult,
      message: `Entity ${entityId} transitioned from "${previousStatus}" to "${normalizedToStatus}".`,
    });
  } catch (err) {
    return next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /entities/:id/fire-rules
// Direct / standalone trigger for the rule engine — useful for testing.
// Body: { "eventType": "approved" }
// ─────────────────────────────────────────────────────────────────────────────
router.post('/:id/fire-rules', verifyToken, checkRole(['admin', 'director']), async (req, res, next) => {
  try {
    const entityId = parsePositiveInt(req.params.id, 'id');
    const { eventType } = req.body;

    if (!eventType || typeof eventType !== 'string' || eventType.trim() === '') {
      return next(
        createError('"eventType" is required and must be a non-empty string.', 400)
      );
    }

    const ruleResult = await checkAndFireRules(entityId, eventType.trim().toLowerCase());

    return res.status(200).json({ success: true, data: ruleResult });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
