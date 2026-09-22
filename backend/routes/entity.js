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
const { verifyToken, checkRole } = require('../middleware/auth');
const { checkAndFireRules } = require('../services/ruleEngine');
const { generateIntelligenceReport } = require('../services/aiSuggestion');
const { executeWorkflowTransition, getWorkflowMasterRules, validateWorkflowTransition } = require('../services/workflowEngine');
const prisma = require('../db');

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

// ── GET /entities/entity-types — list all EntityTypes ────────────────────────
router.get('/entity-types', async (req, res, next) => {
  try {
    const types = await prisma.entityType.findMany({
      orderBy: { entity_type_id: 'asc' },
    });
    return res.status(200).json({ success: true, data: types });
  } catch (err) {
    return next(err);
  }
});

// ── POST /entities/entity-types — create a new EntityType ─────────────────────
router.post('/entity-types', async (req, res, next) => {
  try {
    const { name, description, domain_id } = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return next(createError('"name" is required and must be a non-empty string.', 400));
    }
    const existing = await prisma.entityType.findFirst({
      where: { name: { equals: name.trim(), mode: 'insensitive' } },
    });
    if (existing) {
      return next(createError(`EntityType with name "${name.trim()}" already exists.`, 400));
    }
    let targetDomainId = domain_id ? Number(domain_id) : 1;
    let domain = await prisma.domain.findUnique({ where: { domain_id: targetDomainId } });
    if (!domain) {
      domain = await prisma.domain.findFirst();
      targetDomainId = domain ? domain.domain_id : 1;
    }
    const entityType = await prisma.entityType.create({
      data: {
        domain_id: targetDomainId,
        name: name.trim(),
        description: description ? String(description).trim() : null,
      },
    });
    return res.status(201).json({ success: true, data: entityType });
  } catch (err) {
    return next(err);
  }
});

// ── POST /entities/rules — create relationship rule ──────────────────────────
router.post('/rules', async (req, res, next) => {
  try {
    const { source_entity_type_id, target_entity_type_id, event, auto_create, auto_approve } = req.body;
    if (!source_entity_type_id || !target_entity_type_id) {
      return next(createError('"source_entity_type_id" and "target_entity_type_id" are required.', 400));
    }
    const rule = await prisma.entityRelationshipRule.create({
      data: {
        source_entity_type_id: Number(source_entity_type_id),
        target_entity_type_id: Number(target_entity_type_id),
        event: event ? String(event).trim() : 'approved',
        auto_create: auto_create !== undefined ? Boolean(auto_create) : true,
        auto_approve: auto_approve !== undefined ? Boolean(auto_approve) : false,
      },
    });
    return res.status(201).json({ success: true, data: rule });
  } catch (err) {
    return next(err);
  }
});

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
    const { entity_type_id, name, location, area, jurisdiction_id, status } = req.body;

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

    // ── Jurisdiction validation and canonical area synchronization ───────────
    let parsedJurisdictionId = null;
    let resolvedArea = area !== undefined && area !== null ? String(area).trim() || null : null;

    if (jurisdiction_id !== undefined && jurisdiction_id !== null && jurisdiction_id !== '') {
      parsedJurisdictionId = parsePositiveInt(jurisdiction_id, 'jurisdiction_id');
      const jurisdictionNode = await prisma.jurisdictionMaster.findUnique({
        where: { jurisdiction_id: parsedJurisdictionId },
      });

      if (!jurisdictionNode) {
        return next(createError(`jurisdiction_id ${parsedJurisdictionId} does not exist.`, 400));
      }
      if (jurisdictionNode.status !== 'active') {
        return next(createError(`jurisdiction_id ${parsedJurisdictionId} is inactive.`, 400));
      }

      // Canonical synchronization: area is synchronized from leaf jurisdiction
      resolvedArea = jurisdictionNode.name;
    }

    // ── Create entity; ownership always comes from the authenticated user ───
    const entity = await prisma.entity.create({
      data: {
        entity_type_id: parsedTypeId,
        owner_user_id: req.user.user_id,
        jurisdiction_id: parsedJurisdictionId,
        name: name.trim(),
        location: location ? String(location).trim() : null,
        area: resolvedArea,
        status: status ? String(status).trim() : 'draft',
      },
      include: {
        entityType: {
          select: { entity_type_id: true, name: true },
        },
        jurisdiction: true,
      },
    });

    return res.status(201).json({ success: true, data: entity });
  } catch (err) {
    return next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /entities
// List entities with optional filtering, keyword search, and pagination.
// Query params:
//   ?entity_type_id=  ?status=  ?area=  ?owner_user_id=  ?name=
//   ?page=  ?limit=  (defaults: page=1, limit=20)
//   ?sort=  (updated_desc | id_asc, default: updated_desc)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    // ── Pagination ────────────────────────────────────────────────────────────
    const page = req.query.page ? parsePositiveInt(req.query.page, 'page') : 1;
    const limit = req.query.limit
      ? parsePositiveInt(req.query.limit, 'limit')
      : 20;
    const skip = (page - 1) * limit;

    // ── Filters ───────────────────────────────────────────────────────────────
    const where = {};

    if (req.query.entity_type_id !== undefined) {
      where.entity_type_id = parsePositiveInt(
        req.query.entity_type_id,
        'entity_type_id'
      );
    }

    if (req.query.status !== undefined && req.query.status !== '') {
      where.status = String(req.query.status).trim();
    }

    if (req.query.area !== undefined && req.query.area !== '') {
      where.area = String(req.query.area).trim();
    }

    if (req.query.owner_user_id !== undefined) {
      where.owner_user_id = parsePositiveInt(req.query.owner_user_id, 'owner_user_id');
    }

    // Keyword search on name (case-insensitive contains)
    if (req.query.name !== undefined && req.query.name !== '') {
      where.name = { contains: String(req.query.name).trim(), mode: 'insensitive' };
    }

    // ── Sort ──────────────────────────────────────────────────────────────────
    const orderBy = req.query.sort === 'id_asc'
      ? { entity_id: 'asc' }
      : { entity_id: 'desc' };

    // ── Query ─────────────────────────────────────────────────────────────────
    const [total, entities] = await Promise.all([
      prisma.entity.count({ where }),
      prisma.entity.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          entityType: {
            select: { entity_type_id: true, name: true },
          },
          owner: {
            select: { user_id: true, name: true, email: true },
          },
          jurisdiction: true,
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
// Fetch a single entity by entity_id, including entity_type and jurisdiction info.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const entityId = parsePositiveInt(req.params.id, 'id');

    const entity = await prisma.entity.findUnique({
      where: { entity_id: entityId },
      include: {
        entityType: true,
        owner: {
          select: { user_id: true, name: true, email: true },
        },
        jurisdiction: {
          include: {
            parent: {
              include: {
                parent: {
                  include: {
                    parent: true,
                  },
                },
              },
            },
          },
        },
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
    const { entity_type_id, name, location, area, jurisdiction_id, status } = req.body;

    // ── At least one field required ───────────────────────────────────────────
    if (
      entity_type_id === undefined &&
      name === undefined &&
      location === undefined &&
      area === undefined &&
      jurisdiction_id === undefined &&
      status === undefined
    ) {
      return next(
        createError(
          'Request body must include at least one field to update: entity_type_id, name, location, area, or jurisdiction_id.',
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

    if (jurisdiction_id !== undefined) {
      if (jurisdiction_id === null || jurisdiction_id === '') {
        updateData.jurisdiction_id = null;
      } else {
        const parsedJId = parsePositiveInt(jurisdiction_id, 'jurisdiction_id');
        const jNode = await prisma.jurisdictionMaster.findUnique({
          where: { jurisdiction_id: parsedJId },
        });
        if (!jNode) {
          return next(createError(`jurisdiction_id ${parsedJId} does not exist.`, 400));
        }
        if (jNode.status !== 'active') {
          return next(createError(`jurisdiction_id ${parsedJId} is inactive.`, 400));
        }
        updateData.jurisdiction_id = parsedJId;
        // Synchronize area from leaf jurisdiction
        updateData.area = jNode.name;
      }
    }

    // ── Perform update ────────────────────────────────────────────────────────
    const updated = await prisma.entity.update({
      where: { entity_id: entityId },
      data: updateData,
      include: {
        entityType: {
          select: { entity_type_id: true, name: true },
        },
        jurisdiction: true,
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
// ─────────────────────────────────────────────────────────────────────────────
// GET /entities/:id/workflow
// Returns applicable WorkflowMaster rules and allowed transitions for current user.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:id/workflow', verifyToken, async (req, res, next) => {
  try {
    const entityId = parsePositiveInt(req.params.id, 'id');
    const entity = await prisma.entity.findUnique({
      where: { entity_id: entityId },
      include: { entityType: true },
    });

    if (!entity) {
      return next(createError(`Entity with id ${entityId} was not found.`, 404));
    }

    const rules = await getWorkflowMasterRules(entity.entity_type_id);
    const actorAssignedArea = req.user.assignedArea || null;

    const allowed = [];
    for (const rule of rules) {
      const v = await validateWorkflowTransition({
        entity,
        targetStatus: rule.action,
        actorRole: req.user.role,
        actorUserId: req.user.user_id,
        actorAssignedArea,
      });
      if (v.allowed) {
        allowed.push({
          from: rule.trigger,
          to: rule.action,
          role: rule.stage,
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        currentStatus: entity.status || 'draft',
        entityTypeId: entity.entity_type_id,
        isMetadataDriven: rules.length > 0,
        configuredRulesCount: rules.length,
        allowedTransitions: allowed,
      },
    });
  } catch (err) {
    return next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /entities/:id/transition
// Protected metadata-driven workflow step: executes state transition.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/:id/transition', verifyToken, checkRole(['citizen', 'coordinator_area', 'coordinator_general', 'director', 'admin']), async (req, res, next) => {
  try {
    const entityId = parsePositiveInt(req.params.id, 'id');
    const { to_status, reason } = req.body;

    if (!to_status || typeof to_status !== 'string' || to_status.trim() === '') {
      return next(createError('"to_status" is required and must be a non-empty string.', 400));
    }

    const normalizedToStatus = to_status.trim().toLowerCase();
    if (normalizedToStatus === 'rejected' && (!reason || typeof reason !== 'string' || reason.trim() === '')) {
      return next(createError('A reason is required when rejecting an entity.', 400));
    }

    const result = await executeWorkflowTransition({
      entityId,
      toStatus: normalizedToStatus,
      reason,
      user: req.user,
    });

    return res.status(200).json({
      success: true,
      data: result.updatedEntity,
      ruleResult: result.ruleResult,
      workflowSource: result.workflowSource,
      message: `Entity ${entityId} transitioned from "${result.previousStatus}" to "${result.newStatus}".`,
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

// ─────────────────────────────────────────────────────────────────────────────
// GET /entities/:id/audit
// Fetch audit log for a single entity.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:id/audit', async (req, res, next) => {
  try {
    const entityId = parsePositiveInt(req.params.id, 'id');

    const entity = await prisma.entity.findUnique({ where: { entity_id: entityId } });
    if (!entity) {
      return next(createError(`Entity with id ${entityId} was not found.`, 404));
    }

    const [auditLogs, approvalHistory] = await Promise.all([
      prisma.auditLog.findMany({
        where: { entity_id: entityId },
        orderBy: { datetime: 'desc' },
        include: {
          actorUser: { select: { user_id: true, name: true, email: true, role: true } },
        },
      }),
      prisma.approvalHistory.findMany({
        where: { entity_id: entityId },
        orderBy: { created_date: 'desc' },
        include: {
          actorUser: { select: { user_id: true, name: true, email: true, role: true } },
        },
      }),
    ]);

    return res.status(200).json({ success: true, data: { auditLogs, approvalHistory } });
  } catch (err) {
    return next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /entities/:id/lineage
// Fetch complete ecosystem lineage graph for an entity.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:id/lineage', async (req, res, next) => {
  try {
    const entityId = parsePositiveInt(req.params.id, 'id');

    const entity = await prisma.entity.findUnique({
      where: { entity_id: entityId },
      include: { entityType: true, owner: { select: { user_id: true, name: true, role: true } } },
    });

    if (!entity) {
      return next(createError(`Entity with id ${entityId} was not found.`, 404));
    }

    // 1. Configured Rules for this entity's entityType
    const activeRules = await prisma.entityRelationshipRule.findMany({
      where: { source_entity_type_id: entity.entity_type_id },
      include: { targetEntityType: { select: { entity_type_id: true, name: true } } },
    });

    // 2. Child entities created BY this entity via Rule Engine
    const childAuditLogs = await prisma.auditLog.findMany({
      where: {
        reason: { contains: `source entity #${entityId}` },
        action: 'auto_created',
      },
      include: {
        entity: {
          include: { entityType: { select: { entity_type_id: true, name: true } } },
        },
      },
      orderBy: { datetime: 'asc' },
    });

    // 3. Parent entity if this entity was auto-created from a source entity
    const selfAuditLog = await prisma.auditLog.findFirst({
      where: {
        entity_id: entityId,
        action: 'auto_created',
      },
    });

    let parentEntity = null;
    if (selfAuditLog && selfAuditLog.reason) {
      const match = selfAuditLog.reason.match(/source entity #(\d+)/);
      if (match && match[1]) {
        const parentId = Number(match[1]);
        parentEntity = await prisma.entity.findUnique({
          where: { entity_id: parentId },
          include: { entityType: { select: { entity_type_id: true, name: true } } },
        });
      }
    }

    // 4. ParameterValue references (e.g. linked_movement_id)
    const linkedParams = await prisma.parameterValue.findMany({
      where: { value: String(entityId) },
      include: {
        entity: {
          include: { entityType: { select: { entity_type_id: true, name: true } } },
        },
        parameterMaster: { select: { parameter_id: true, label: true, field_key: true } },
      },
    });

    const children = childAuditLogs.map((log) => ({
      entity_id: log.entity.entity_id,
      name: log.entity.name,
      entity_type_id: log.entity.entity_type_id,
      type_name: log.entity.entityType?.name || 'Unknown',
      status: log.entity.status,
      created_at: log.datetime,
      reason: log.reason,
    }));

    linkedParams.forEach((lp) => {
      if (lp.entity_id !== entityId && !children.some((c) => c.entity_id === lp.entity_id)) {
        children.push({
          entity_id: lp.entity.entity_id,
          name: lp.entity.name,
          entity_type_id: lp.entity.entity_type_id,
          type_name: lp.entity.entityType?.name || 'Unknown',
          status: lp.entity.status,
          created_at: lp.created_date,
          reason: `Linked via parameter ${lp.parameterMaster?.label || lp.parameterMaster?.field_key}`,
        });
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        current: entity,
        parent: parentEntity,
        children,
        rules: activeRules,
      },
    });
  } catch (err) {
    return next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /entities/:id/ai-analysis
// Generate Gemini AI Decision Intelligence Report for Director/Admin review.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/:id/ai-analysis', verifyToken, checkRole(['director', 'admin']), async (req, res, next) => {
  try {
    const entityId = parsePositiveInt(req.params.id, 'id');
    const { report, logId } = await generateIntelligenceReport(entityId, req.user.user_id);
    return res.status(200).json({
      success: true,
      data: report,
      log_id: logId,
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
