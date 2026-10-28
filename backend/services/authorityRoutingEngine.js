/**
 * CIVIC-KALKI — Authority Routing & Review Reconciliation Engine
 *
 * Implements data-driven authority requirements and review task lifecycle:
 * - Evaluates declarative rules against entity parameters
 * - Dynamically determines which authorities must review an application
 * - Reconciles review tasks: creates new tasks, voids obsolete unreviewed tasks,
 *   and preserves completed reviews when inputs remain unchanged
 * - Records "WHY REQUIRED" audit trails (rule ID + matched inputs snapshot)
 *
 * Strict constraint: ZERO hardcoded departmental logic (no `if (authority === "police")`).
 */

const fs = require('fs');
const path = require('path');
const prisma = require('../db');
const { evaluateRule } = require('./ruleEvaluator');

/**
 * Load entity type metadata configuration file.
 */
function loadEntityTypeMetadata(entityTypeName) {
  const metadataDir = path.join(__dirname, '..', 'metadata');
  if (!fs.existsSync(metadataDir)) return null;

  const files = fs.readdirSync(metadataDir).filter((f) => f.endsWith('.json') && !f.startsWith('_'));
  for (const file of files) {
    try {
      const content = JSON.parse(fs.readFileSync(path.join(metadataDir, file), 'utf8'));
      if (
        content.entity_type?.name?.toLowerCase() === entityTypeName.toLowerCase() ||
        content.entity_type?.key?.toLowerCase() === entityTypeName.toLowerCase()
      ) {
        return content;
      }
    } catch (_e) {}
  }
  return null;
}

/**
 * Load shared authorities definition catalogue.
 */
function loadAuthoritiesCatalogue() {
  const p = path.join(__dirname, '..', 'metadata', '_shared', 'authorities.json');
  if (fs.existsSync(p)) {
    try {
      const data = JSON.parse(fs.readFileSync(p, 'utf8'));
      return data.authorities || [];
    } catch (_e) {}
  }
  return [];
}

/**
 * Extract a flat key-value dictionary of parameter values for an entity.
 */
async function getEntityParameterMap(entityId) {
  const pvs = await prisma.parameterValue.findMany({
    where: { entity_id: Number(entityId) },
    include: {
      parameterMaster: {
        select: { field_key: true, label: true, field_type: true },
      },
    },
  });

  const map = {};
  for (const pv of pvs) {
    const key = pv.parameterMaster?.field_key || pv.parameterMaster?.label;
    if (key) {
      map[key] = pv.value;
    }
  }
  return map;
}

/**
 * Evaluate requirement rules for an entity and reconcile review tasks.
 *
 * @param {number} entityId - The entity being evaluated
 * @returns {Promise<{ requiredAuthorities: object[], tasksCreated: number, tasksVoided: number, unchangedCount: number }>}
 */
async function evaluateAndReconcileReviewTasks(entityId) {
  const entity = await prisma.entity.findUnique({
    where: { entity_id: Number(entityId) },
    include: { entityType: true },
  });

  if (!entity) {
    throw new Error(`Entity #${entityId} not found.`);
  }

  const metadata = loadEntityTypeMetadata(entity.entityType.name);
  if (!metadata || !metadata.rules?.authority_routing) {
    return { requiredAuthorities: [], tasksCreated: 0, tasksVoided: 0, unchangedCount: 0 };
  }

  const paramMap = await getEntityParameterMap(entityId);
  const routingRules = metadata.rules.authority_routing;
  const authoritiesCatalogue = loadAuthoritiesCatalogue();

  const requiredMap = new Map();

  for (const rule of routingRules) {
    const isMatched = evaluateRule(rule.condition, paramMap);
    if (isMatched) {
      const matchedInputs = {};
      if (Array.isArray(rule.matched_input_fields)) {
        for (const f of rule.matched_input_fields) {
          matchedInputs[f] = paramMap[f] !== undefined ? paramMap[f] : null;
        }
      }

      const authInfo = authoritiesCatalogue.find((a) => a.key === rule.authority_key) || {
        key: rule.authority_key,
        name: rule.authority_key,
        default_sla_hours: 48,
      };

      requiredMap.set(rule.authority_key, {
        authority_key: rule.authority_key,
        rule_id: rule.id,
        description: rule.description,
        matched_inputs: matchedInputs,
        sla_hours: authInfo.default_sla_hours || 48,
      });
    }
  }

  // Fetch current review tasks for this entity
  const existingTasks = await prisma.entityReviewTask.findMany({
    where: { entity_id: Number(entityId) },
  });

  let tasksCreated = 0;
  let tasksVoided = 0;
  let unchangedCount = 0;

  await prisma.$transaction(async (tx) => {
    // 1. Process required authorities: create new or retain existing
    for (const [authKey, reqInfo] of requiredMap.entries()) {
      const existing = existingTasks.find((t) => t.authority_key === authKey);

      if (!existing) {
        // Calculate due date based on SLA
        const dueDate = new Date();
        dueDate.setHours(dueDate.getHours() + (reqInfo.sla_hours || 48));

        await tx.entityReviewTask.create({
          data: {
            entity_id: Number(entityId),
            authority_key: authKey,
            status: 'pending',
            required_reason: `${reqInfo.rule_id}: ${reqInfo.description}`,
            matched_inputs: reqInfo.matched_inputs,
            due_date: dueDate,
          },
        });
        tasksCreated++;
      } else if (existing.status === 'voided') {
        // Re-activate previously voided task if now required again
        await tx.entityReviewTask.update({
          where: { task_id: existing.task_id },
          data: {
            status: 'pending',
            required_reason: `${reqInfo.rule_id}: ${reqInfo.description}`,
            matched_inputs: reqInfo.matched_inputs,
          },
        });
        tasksCreated++;
      } else {
        // Task already active or completed
        unchangedCount++;
      }
    }

    // 2. Process existing tasks that are NO LONGER required: void pending ones
    for (const existing of existingTasks) {
      if (!requiredMap.has(existing.authority_key) && existing.status === 'pending') {
        await tx.entityReviewTask.update({
          where: { task_id: existing.task_id },
          data: {
            status: 'voided',
            decision_reason: 'Task voided: authority requirement rule conditions no longer met after application edit.',
          },
        });
        tasksVoided++;
      }
    }
  });

  return {
    requiredAuthorities: Array.from(requiredMap.values()),
    tasksCreated,
    tasksVoided,
    unchangedCount,
  };
}

/**
 * Retrieve the audit trail of WHY each authority was required for an entity.
 */
async function getWhyRequiredAudit(entityId) {
  const tasks = await prisma.entityReviewTask.findMany({
    where: { entity_id: Number(entityId) },
    include: {
      reviewerUser: { select: { user_id: true, name: true, role: true } },
    },
    orderBy: { task_id: 'asc' },
  });

  const catalogue = loadAuthoritiesCatalogue();

  return tasks.map((task) => {
    const authMeta = catalogue.find((a) => a.key === task.authority_key);
    return {
      taskId: task.task_id,
      authorityKey: task.authority_key,
      authorityName: authMeta?.name || task.authority_key,
      jurisdiction: authMeta?.jurisdiction || 'Municipal',
      status: task.status,
      requiredReason: task.required_reason,
      matchedInputs: task.matched_inputs,
      decisionReason: task.decision_reason,
      reviewer: task.reviewerUser?.name || null,
      dueDate: task.due_date,
      completedAt: task.completed_at,
    };
  });
}

/**
 * Record an authority reviewer's determination.
 */
async function submitAuthorityReview({
  taskId,
  decision, // 'approved' | 'request_changes' | 'rejected'
  reason,
  reviewerUserId,
}) {
  const task = await prisma.entityReviewTask.findUnique({
    where: { task_id: Number(taskId) },
  });

  if (!task) throw new Error(`Review task #${taskId} not found.`);
  if (task.status === 'voided') throw new Error(`Review task #${taskId} is voided and cannot be reviewed.`);

  const validDecisions = ['approved', 'request_changes', 'rejected'];
  if (!validDecisions.includes(decision)) {
    throw new Error(`Decision must be one of: ${validDecisions.join(', ')}.`);
  }

  const updated = await prisma.entityReviewTask.update({
    where: { task_id: Number(taskId) },
    data: {
      status: decision,
      decision_reason: reason ? String(reason).trim() : null,
      reviewer_user_id: reviewerUserId ? Number(reviewerUserId) : null,
      completed_at: new Date(),
    },
  });

  return updated;
}

module.exports = {
  loadEntityTypeMetadata,
  loadAuthoritiesCatalogue,
  getEntityParameterMap,
  evaluateAndReconcileReviewTasks,
  getWhyRequiredAudit,
  submitAuthorityReview,
};
