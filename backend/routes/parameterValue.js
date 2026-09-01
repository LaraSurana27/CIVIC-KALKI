/**
 * CIVIC-KALKI — ParameterValue Storage Engine
 * Saves, retrieves, and upserts actual form-field data against an entity.
 *
 * All routes are mounted under /entities/:id/values by index.js,
 * so the router uses mergeParams: true to access :id.
 *
 * Routes:
 *   POST   /entities/:id/values   — create parameter values (atomic batch)
 *   GET    /entities/:id/values   — fetch all values for an entity
 *   PUT    /entities/:id/values   — upsert parameter values (atomic batch)
 */

const express = require('express');
const router = express.Router({ mergeParams: true });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// ── Constants ─────────────────────────────────────────────────────────────────
const MAX_VALUES_PER_REQUEST = 200;

// ── Helper: create an HTTP-aware error ────────────────────────────────────────
function createError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

// ── Helper: parse a positive integer from a raw value ─────────────────────────
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

// ── Helper: validate and normalise the values array ───────────────────────────
/**
 * @param {any[]} values   Raw body values array
 * @param {Map<number, { parameter_id: number, mandatory: boolean }>} paramMap
 *        Map of existing ParameterMaster rows keyed by parameter_id.
 * @returns {{ parsed: { parameter_id: number, value: string|null }[], errors: string[] }}
 */
function validateValues(values, paramMap) {
  const errors = [];
  const parsed = [];

  for (let i = 0; i < values.length; i++) {
    const entry = values[i];

    // ── parameter_id must be present and a valid integer ───────────────────
    if (entry.parameter_id === undefined || entry.parameter_id === null) {
      errors.push(`values[${i}]: "parameter_id" is required.`);
      continue;
    }

    let paramId;
    try {
      paramId = parsePositiveInt(entry.parameter_id, `values[${i}].parameter_id`);
    } catch (_e) {
      errors.push(`values[${i}]: "parameter_id" must be a positive integer. Received: ${entry.parameter_id}`);
      continue;
    }

    // ── parameter_id must exist in ParameterMaster ────────────────────────
    const paramInfo = paramMap.get(paramId);
    if (!paramInfo) {
      errors.push(`values[${i}]: parameter_id ${paramId} does not exist in ParameterMaster.`);
      continue;
    }

    // ── value presence check (mandatory vs optional) ──────────────────────
    const rawValue = entry.value;

    if (rawValue === undefined || rawValue === null) {
      if (paramInfo.mandatory) {
        errors.push(
          `values[${i}]: "value" is required for mandatory parameter_id ${paramId}.`
        );
        continue;
      }
      // Optional parameter — null is allowed
      parsed.push({ parameter_id: paramId, value: null });
      continue;
    }

    // ── Trim string values ────────────────────────────────────────────────
    const trimmed = typeof rawValue === 'string' ? rawValue.trim() : String(rawValue).trim();

    if (trimmed === '' && paramInfo.mandatory) {
      errors.push(
        `values[${i}]: "value" cannot be empty for mandatory parameter_id ${paramId}.`
      );
      continue;
    }

    parsed.push({ parameter_id: paramId, value: trimmed === '' ? null : trimmed });
  }

  return { parsed, errors };
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /entities/:id/values
// Atomically create parameter values for an entity.
// Body: { "values": [ { "parameter_id": 1, "value": "Delhi" }, … ] }
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', async (req, res, next) => {
  try {
    const entityId = parsePositiveInt(req.params.id, 'id');

    // ── Entity existence check ─────────────────────────────────────────────
    const entity = await prisma.entity.findUnique({
      where: { entity_id: entityId },
    });
    if (!entity) {
      return next(createError(`Entity with id ${entityId} was not found.`, 404));
    }

    // ── Body structure validation ──────────────────────────────────────────
    const { values } = req.body;
    if (!Array.isArray(values) || values.length === 0) {
      return next(
        createError('"values" must be a non-empty array.', 400)
      );
    }
    if (values.length > MAX_VALUES_PER_REQUEST) {
      return next(
        createError(
          `Payload too large: received ${values.length} entries. Maximum allowed is ${MAX_VALUES_PER_REQUEST}.`,
          400
        )
      );
    }

    // ── Gather all referenced parameter_ids and fetch from DB in one call ─
    const requestedIds = [
      ...new Set(
        values
          .map((v) => Number(v.parameter_id))
          .filter((n) => Number.isInteger(n) && n > 0)
      ),
    ];

    const paramRows = await prisma.parameterMaster.findMany({
      where: { parameter_id: { in: requestedIds } },
      select: { parameter_id: true, mandatory: true },
    });

    const paramMap = new Map(paramRows.map((p) => [p.parameter_id, p]));

    // ── Validate every value entry ─────────────────────────────────────────
    const { parsed, errors } = validateValues(values, paramMap);
    if (errors.length > 0) {
      return next(createError(errors.join(' | '), 400));
    }

    // ── Atomic batch insert via Prisma transaction ─────────────────────────
    const created = await prisma.$transaction(
      parsed.map((item) =>
        prisma.parameterValue.create({
          data: {
            entity_id: entityId,
            parameter_id: item.parameter_id,
            value: item.value,
            // created_date defaults to now() via schema
          },
          include: {
            parameterMaster: {
              select: {
                parameter_id: true,
                field_type: true,
                control_type: true,
                mandatory: true,
              },
            },
          },
        })
      )
    );

    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    return next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /entities/:id/values
// Retrieve all ParameterValue rows for a given entity, with ParameterMaster
// info included so the frontend knows how to render each value.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const entityId = parsePositiveInt(req.params.id, 'id');

    // ── Entity existence check ─────────────────────────────────────────────
    const entity = await prisma.entity.findUnique({
      where: { entity_id: entityId },
    });
    if (!entity) {
      return next(createError(`Entity with id ${entityId} was not found.`, 404));
    }

    // ── Fetch values ───────────────────────────────────────────────────────
    const parameterValues = await prisma.parameterValue.findMany({
      where: { entity_id: entityId },
      orderBy: { parameter_id: 'asc' },
      include: {
        parameterMaster: {
          select: {
            parameter_id: true,
            field_type: true,
            control_type: true,
            mandatory: true,
            validation_rule: true,
          },
        },
      },
    });

    return res.status(200).json({ success: true, data: parameterValues });
  } catch (err) {
    return next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /entities/:id/values
// Atomic upsert — if a ParameterValue row already exists for this
// (entity_id, parameter_id) pair, update it; otherwise create it.
//
// Because the ParameterValue table has no unique constraint on
// (entity_id, parameter_id), we use a manual find-or-create inside
// a sequential Prisma transaction to guarantee atomicity.
// ─────────────────────────────────────────────────────────────────────────────
router.put('/', async (req, res, next) => {
  try {
    const entityId = parsePositiveInt(req.params.id, 'id');

    // ── Entity existence check ─────────────────────────────────────────────
    const entity = await prisma.entity.findUnique({
      where: { entity_id: entityId },
    });
    if (!entity) {
      return next(createError(`Entity with id ${entityId} was not found.`, 404));
    }

    // ── Body structure validation ──────────────────────────────────────────
    const { values } = req.body;
    if (!Array.isArray(values) || values.length === 0) {
      return next(
        createError('"values" must be a non-empty array.', 400)
      );
    }
    if (values.length > MAX_VALUES_PER_REQUEST) {
      return next(
        createError(
          `Payload too large: received ${values.length} entries. Maximum allowed is ${MAX_VALUES_PER_REQUEST}.`,
          400
        )
      );
    }

    // ── Gather referenced parameter_ids and validate ──────────────────────
    const requestedIds = [
      ...new Set(
        values
          .map((v) => Number(v.parameter_id))
          .filter((n) => Number.isInteger(n) && n > 0)
      ),
    ];

    const paramRows = await prisma.parameterMaster.findMany({
      where: { parameter_id: { in: requestedIds } },
      select: { parameter_id: true, mandatory: true },
    });

    const paramMap = new Map(paramRows.map((p) => [p.parameter_id, p]));

    const { parsed, errors } = validateValues(values, paramMap);
    if (errors.length > 0) {
      return next(createError(errors.join(' | '), 400));
    }

    // ── Atomic upsert via interactive transaction ─────────────────────────
    const results = await prisma.$transaction(async (tx) => {
      const upserted = [];

      for (const item of parsed) {
        // Check if a value row already exists for this (entity, parameter)
        const existing = await tx.parameterValue.findFirst({
          where: {
            entity_id: entityId,
            parameter_id: item.parameter_id,
          },
        });

        let row;
        if (existing) {
          // Update the existing row
          row = await tx.parameterValue.update({
            where: { value_id: existing.value_id },
            data: { value: item.value },
            include: {
              parameterMaster: {
                select: {
                  parameter_id: true,
                  field_type: true,
                  control_type: true,
                  mandatory: true,
                },
              },
            },
          });
        } else {
          // Create a new row
          row = await tx.parameterValue.create({
            data: {
              entity_id: entityId,
              parameter_id: item.parameter_id,
              value: item.value,
            },
            include: {
              parameterMaster: {
                select: {
                  parameter_id: true,
                  field_type: true,
                  control_type: true,
                  mandatory: true,
                },
              },
            },
          });
        }

        upserted.push(row);
      }

      return upserted;
    });

    return res.status(200).json({ success: true, data: results });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
