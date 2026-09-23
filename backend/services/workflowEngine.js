/**
 * CIVIC-KALKI — Generic Workflow Engine Service
 *
 * Provides metadata-driven workflow evaluation and transition execution
 * using the WorkflowMaster table (entity_type_id, trigger, action, stage).
 *
 * Mapping:
 * - trigger: starting state (e.g. "draft", "submitted", "coordinator_approved")
 * - action: target state (e.g. "submitted", "coordinator_approved", "approved", "rejected")
 * - stage: allowed role (e.g. "citizen", "coordinator_area", "coordinator_general", "director", "admin")
 */

const prisma = require('../db');
const { checkAndFireRules } = require('./ruleEngine');

function createHttpError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

/**
 * Fetch configured WorkflowMaster transition rules for an EntityType.
 */
async function getWorkflowMasterRules(entityTypeId) {
  return prisma.workflowMaster.findMany({
    where: { entity_type_id: Number(entityTypeId) },
    orderBy: { workflow_id: 'asc' },
  });
}

/**
 * Check if a workflow transition is permitted by metadata or fallback rules.
 */
async function validateWorkflowTransition({
  entity,
  targetStatus,
  actorRole,
  actorUserId,
  actorAssignedArea,
}) {
  const currentStatus = String(entity.status || 'draft').trim().toLowerCase();
  const normalizedTarget = String(targetStatus).trim().toLowerCase();

  if (currentStatus === 'deleted') {
    return { allowed: false, reason: 'Deleted entities cannot transition states.' };
  }

  if (currentStatus === 'approved' || currentStatus === 'rejected') {
    return { allowed: false, reason: `Entity is in terminal state "${currentStatus}".` };
  }

  // Fetch WorkflowMaster rules for entity's EntityType
  const workflowRules = await getWorkflowMasterRules(entity.entity_type_id);

  if (workflowRules.length > 0) {
    // ── Metadata-Driven Workflow Validation ─────────────────────────────────
    const matchingRule = workflowRules.find((r) => {
      const trig = String(r.trigger || '').trim().toLowerCase();
      const act = String(r.action || '').trim().toLowerCase();
      const stg = String(r.stage || '').trim().toLowerCase();
      
      const triggerMatches = trig === currentStatus;
      const actionMatches = act === normalizedTarget;
      const roleMatches = stg === actorRole.toLowerCase() || stg.split(',').map(s => s.trim()).includes(actorRole.toLowerCase());

      return triggerMatches && actionMatches && roleMatches;
    });

    if (!matchingRule) {
      return {
        allowed: false,
        reason: `WorkflowMaster metadata does not permit role "${actorRole}" to transition from "${currentStatus}" to "${normalizedTarget}".`,
        source: 'metadata',
      };
    }

    // Role-specific ownership and area constraints
    if (actorRole === 'citizen') {
      if (entity.owner_user_id && Number(actorUserId) !== Number(entity.owner_user_id)) {
        return { allowed: false, reason: 'Only the entity owner can perform this citizen transition.', source: 'metadata' };
      }
    } else if (actorRole === 'coordinator_area') {
      const entityArea = String(entity.area || '').trim();
      const assignedArea = String(actorAssignedArea || '').trim();
      if (!entityArea || entityArea !== assignedArea) {
        return { allowed: false, reason: `Area Coordinator assigned to "${assignedArea}" cannot review entity in area "${entityArea || 'Unassigned'}".`, source: 'metadata' };
      }
    } else if (actorRole === 'coordinator_general') {
      const entityArea = String(entity.area || '').trim();
      if (entityArea && entityArea !== 'Unassigned') {
        return { allowed: false, reason: 'General Coordinator can only handle entities in unassigned areas.', source: 'metadata' };
      }
    }

    return { allowed: true, rule: matchingRule, source: 'metadata' };

  } else {
    // ── Fallback: Legacy Standard Workflow Validation ────────────────────────
    console.warn(`[WORKFLOW ENGINE FALLBACK] No WorkflowMaster rules found for entity_type_id ${entity.entity_type_id}. Using standard fallback lifecycle.`);

    let allowed = false;

    if (actorRole === 'citizen' && currentStatus === 'draft' && normalizedTarget === 'submitted') {
      allowed = Number(actorUserId) === Number(entity.owner_user_id);
    } else if (actorRole === 'coordinator_area' && currentStatus === 'submitted') {
      const entityArea = String(entity.area || '').trim();
      const assignedArea = String(actorAssignedArea || '').trim();
      if (['coordinator_approved', 'rejected'].includes(normalizedTarget)) {
        allowed = entityArea === assignedArea;
      }
    } else if (actorRole === 'coordinator_general' && currentStatus === 'submitted') {
      const entityArea = String(entity.area || '').trim();
      if (['coordinator_approved', 'rejected'].includes(normalizedTarget)) {
        allowed = !entityArea || entityArea === 'Unassigned';
      }
    } else if (['director', 'admin'].includes(actorRole) && currentStatus === 'coordinator_approved') {
      if (['approved', 'rejected'].includes(normalizedTarget)) {
        allowed = true;
      }
    }

    return {
      allowed,
      reason: allowed ? null : `Fallback workflow does not allow role "${actorRole}" to transition from "${currentStatus}" to "${normalizedTarget}".`,
      source: 'fallback',
    };
  }
}

/**
 * Execute a valid status transition for an entity.
 */
async function executeWorkflowTransition({
  entityId,
  toStatus,
  reason,
  user,
}) {
  const parsedId = Number(entityId);

  const entity = await prisma.entity.findUnique({
    where: { entity_id: parsedId },
    include: { entityType: true },
  });

  if (!entity) {
    throw createHttpError(`Entity with id ${parsedId} was not found.`, 404);
  }

  const normalizedToStatus = String(toStatus).trim().toLowerCase();

  // Fetch actor assigned area and role from DB if user_id is provided
  let actorAssignedArea = user.assignedArea || user.assigned_area || null;
  let actorRole = user.role;
  if (user.user_id) {
    const dbUser = await prisma.user.findUnique({
      where: { user_id: Number(user.user_id) },
      select: { assignedArea: true, role: true },
    });
    if (dbUser) {
      actorAssignedArea = dbUser.assignedArea || null;
      if (dbUser.role) actorRole = dbUser.role;
    }
  }

  const validation = await validateWorkflowTransition({
    entity,
    targetStatus: normalizedToStatus,
    actorRole,
    actorUserId: user.user_id,
    actorAssignedArea,
  });

  if (!validation.allowed) {
    throw createHttpError(validation.reason || `Cannot transition entity from ${entity.status} to ${normalizedToStatus}.`, 400);
  }

  const previousStatus = entity.status || 'draft';

  // Perform atomic update + audit log + approval history
  const { updatedEntity } = await prisma.$transaction(async (tx) => {
    const updated = await tx.entity.update({
      where: { entity_id: parsedId },
      data: { status: normalizedToStatus },
    });

    await tx.auditLog.create({
      data: {
        entity_id: parsedId,
        actor_user_id: user.user_id,
        action: 'status_transition',
        user: user.name,
        old_status: previousStatus,
        new_status: normalizedToStatus,
        reason: reason ? String(reason).trim() : null,
      },
    });

    await tx.approvalHistory.create({
      data: {
        entity_id: parsedId,
        actor_user_id: user.user_id,
        from_status: previousStatus,
        to_status: normalizedToStatus,
        reason: reason ? String(reason).trim() : null,
      },
    });

    return { updatedEntity: updated };
  });

  // Trigger cascading Rule Engine if state is approved
  let ruleResult = null;
  if (normalizedToStatus === 'approved') {
    try {
      ruleResult = await checkAndFireRules(parsedId, 'approved');
    } catch (ruleErr) {
      console.error(`[RULE ENGINE ERROR] Failed to process rules for entity #${parsedId}:`, ruleErr);
    }
  }

  return {
    updatedEntity,
    previousStatus,
    newStatus: normalizedToStatus,
    workflowSource: validation.source,
    ruleResult,
  };
}

module.exports = {
  getWorkflowMasterRules,
  validateWorkflowTransition,
  executeWorkflowTransition,
};
