/**
 * CIVIC-KALKI — Rule Engine Service
 * Core "no-code" auto-creation mechanism.
 *
 * When a defined event happens on an entity (e.g. status → "approved"),
 * this engine checks EntityRelationshipRule and automatically creates
 * any linked target entities — with zero hardcoded per-module logic.
 *
 * Supports recursive chaining: if a newly auto-created entity itself
 * has status "approved" (via auto_approve), the engine checks for
 * further rules, up to MAX_CHAIN_DEPTH to prevent infinite loops.
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// ── Constants ─────────────────────────────────────────────────────────────────
const MAX_CHAIN_DEPTH = 3;

/**
 * Check EntityRelationshipRule table for matching rules and fire them.
 *
 * @param {number}  entityId   The entity that just had something happen.
 * @param {string}  eventType  What happened (e.g. "approved", "created").
 * @param {number}  [depth=0]  Current chain depth (internal — callers omit this).
 * @returns {Promise<{ rulesFired: number, createdEntities: object[], chainDepth: number, warnings: string[] }>}
 */
async function checkAndFireRules(entityId, eventType, depth = 0) {
  const result = {
    rulesFired: 0,
    createdEntities: [],
    chainDepth: depth,
    warnings: [],
  };

  // ── Guard: chain depth limit ──────────────────────────────────────────────
  if (depth >= MAX_CHAIN_DEPTH) {
    const msg = `Rule engine chain depth limit (${MAX_CHAIN_DEPTH}) reached for entity ${entityId}, event "${eventType}". Stopping to prevent infinite loop.`;
    console.warn(`[RULE ENGINE WARNING] ${msg}`);
    result.warnings.push(msg);
    return result;
  }

  // ── 1. Fetch the source entity ────────────────────────────────────────────
  const sourceEntity = await prisma.entity.findUnique({
    where: { entity_id: entityId },
    include: {
      entityType: true,
    },
  });

  if (!sourceEntity) {
    throw Object.assign(
      new Error(`Rule engine: entity with id ${entityId} was not found.`),
      { statusCode: 404 }
    );
  }

  // ── 2. Find matching rules ────────────────────────────────────────────────
  const matchingRules = await prisma.entityRelationshipRule.findMany({
    where: {
      source_entity_type_id: sourceEntity.entity_type_id,
      event: eventType,
    },
    include: {
      targetEntityType: true,   // need the name to build default entity name
    },
  });

  if (matchingRules.length === 0) {
    return result; // No rules matched — this is normal, not an error
  }

  // ── 3. Fire each matching rule ────────────────────────────────────────────
  for (const rule of matchingRules) {
    if (!rule.auto_create) {
      // Rule exists but auto_create is false — skip it, just log
      console.log(
        `[RULE ENGINE] Rule ${rule.rule_id} matched but auto_create is false — skipping.`
      );
      continue;
    }

    const targetTypeName = rule.targetEntityType.name;
    const newEntityName = `${sourceEntity.name} - ${targetTypeName}`;
    const newStatus = rule.auto_approve ? 'approved' : 'pending';

    // ── Atomic: create entity + audit log in one transaction ──────────────
    const { newEntity, auditEntry } = await prisma.$transaction(async (tx) => {
      const created = await tx.entity.create({
        data: {
          entity_type_id: rule.target_entity_type_id,
          name: newEntityName,
          location: sourceEntity.location, // inherit location from source
          status: newStatus,
        },
        include: {
          entityType: {
            select: { entity_type_id: true, name: true },
          },
        },
      });

      const audit = await tx.auditLog.create({
        data: {
          entity_id: created.entity_id,
          action: 'auto_created',
          user: 'system/rule-engine',
          reason: [
            `Rule ${rule.rule_id} fired:`,
            `source entity #${sourceEntity.entity_id} (${sourceEntity.name})`,
            `event "${eventType}"`,
            `→ auto-created ${targetTypeName} entity #${created.entity_id}`,
            rule.auto_approve ? '(auto-approved)' : '(status: pending)',
          ].join(' | '),
        },
      });

      return { newEntity: created, auditEntry: audit };
    });

    console.log(
      `[RULE ENGINE] Rule ${rule.rule_id}: auto-created entity #${newEntity.entity_id} ` +
      `"${newEntity.name}" (type: ${targetTypeName}, status: ${newEntity.status})`
    );

    result.rulesFired += 1;
    result.createdEntities.push({
      entity_id: newEntity.entity_id,
      name: newEntity.name,
      entity_type_id: newEntity.entity_type_id,
      status: newEntity.status,
      entityType: newEntity.entityType,
      triggered_by_rule_id: rule.rule_id,
      audit_id: auditEntry.audit_id,
    });

    // ── 4. Recursive chaining: if auto-approved, check for further rules ──
    if (rule.auto_approve) {
      console.log(
        `[RULE ENGINE] Entity #${newEntity.entity_id} was auto-approved — ` +
        `checking for chained rules (depth ${depth + 1})…`
      );

      const chainResult = await checkAndFireRules(
        newEntity.entity_id,
        'approved',
        depth + 1
      );

      // Merge chain results into the top-level result
      result.rulesFired += chainResult.rulesFired;
      result.createdEntities.push(...chainResult.createdEntities);
      result.warnings.push(...chainResult.warnings);
    }
  }

  return result;
}

module.exports = { checkAndFireRules };
