/**
 * CIVIC-KALKI — Jurisdiction Engine Router
 * Metadata-driven, globally scalable hierarchical jurisdiction system.
 * Supports arbitrary depth (Country -> State -> City -> Ward -> ...).
 */

const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const prisma = require('../db');
const { Country, State, City } = require('country-state-city');

function createError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

function parsePositiveInt(value, fieldName) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw createError(`"${fieldName}" must be a positive integer. Received: ${value}`, 400);
  }
  return parsed;
}

/**
 * Recursively build ancestor path for a jurisdiction node
 */
async function buildAncestorPath(jurisdictionId) {
  const path = [];
  let currentId = jurisdictionId;

  while (currentId) {
    const node = await prisma.jurisdictionMaster.findUnique({
      where: { jurisdiction_id: currentId },
      select: {
        jurisdiction_id: true,
        name: true,
        type: true,
        code: true,
        parent_id: true,
        status: true,
      },
    });

    if (!node) break;
    path.unshift({
      jurisdiction_id: node.jurisdiction_id,
      name: node.name,
      type: node.type,
      code: node.code,
    });

    currentId = node.parent_id;
  }

  return path;
}

/**
 * Check if targetId is an ancestor of potentialChildId (prevents cycles)
 */
async function isAncestorOf(targetId, potentialChildId) {
  let curr = potentialChildId;
  while (curr) {
    if (curr === targetId) return true;
    const parent = await prisma.jurisdictionMaster.findUnique({
      where: { jurisdiction_id: curr },
      select: { parent_id: true },
    });
    curr = parent ? parent.parent_id : null;
  }
  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /jurisdictions
// List jurisdictions by parent_id, type, or query.
// Default parent_id is root (parent_id is null).
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const { parent_id, type, search, tree } = req.query;

    const where = {
      status: 'active',
    };

    if (type) {
      where.type = String(type).trim().toLowerCase();
    }

    if (search) {
      where.name = { contains: String(search).trim(), mode: 'insensitive' };
    }

    // Handle parent_id filtering
    if (parent_id === 'root' || parent_id === 'null' || parent_id === undefined) {
      where.parent_id = null;
    } else if (parent_id === 'all') {
      // Don't filter by parent_id
    } else {
      where.parent_id = parsePositiveInt(parent_id, 'parent_id');
    }

    if (tree === 'true') {
      // Fetch full active tree starting from roots
      const fullTree = await prisma.jurisdictionMaster.findMany({
        where: { parent_id: null, status: 'active' },
        include: {
          children: {
            where: { status: 'active' },
            include: {
              children: {
                where: { status: 'active' },
                include: {
                  children: {
                    where: { status: 'active' },
                    orderBy: { name: 'asc' },
                  },
                },
                orderBy: { name: 'asc' },
              },
            },
            orderBy: { name: 'asc' },
          },
        },
        orderBy: { name: 'asc' },
      });
      return res.status(200).json({ success: true, data: fullTree });
    }

    let items = await prisma.jurisdictionMaster.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { children: true, entities: true },
        },
      },
    });

    // Dynamic on-demand GIS population:
    // If no children exist in DB yet for this parent, resolve them from country-state-city
    if (items.length === 0 && where.parent_id) {
      try {
        const parentNode = await prisma.jurisdictionMaster.findUnique({
          where: { jurisdiction_id: where.parent_id },
        });

        if (parentNode) {
          if (parentNode.type === 'country') {
            const rawCode = parentNode.code || 'IN';
            const countryCode = rawCode === 'IND' ? 'IN' : rawCode;
            const states = State.getStatesOfCountry(countryCode);
            if (states && states.length > 0) {
              const rowsToInsert = states.map((s) => ({
                name: s.name,
                type: 'state',
                parent_id: parentNode.jurisdiction_id,
                code: s.isoCode || s.name.slice(0, 10).toUpperCase(),
                status: 'active',
              }));
              await prisma.jurisdictionMaster.createMany({
                data: rowsToInsert,
                skipDuplicates: true,
              });
            }
          } else if (parentNode.type === 'state') {
            const parentCountry = await prisma.jurisdictionMaster.findUnique({
              where: { jurisdiction_id: parentNode.parent_id },
            });
            const rawCountryCode = parentCountry?.code || 'IN';
            const countryCode = rawCountryCode === 'IND' ? 'IN' : rawCountryCode;
            const stateCode = parentNode.code;
            const cities = City.getCitiesOfState(countryCode, stateCode);
            if (cities && cities.length > 0) {
              const rowsToInsert = cities.map((c) => ({
                name: c.name,
                type: 'city',
                parent_id: parentNode.jurisdiction_id,
                code: (c.name || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 20).toUpperCase() || 'CITY',
                status: 'active',
              }));
              await prisma.jurisdictionMaster.createMany({
                data: rowsToInsert,
                skipDuplicates: true,
              });
            } else {
              // Standard regional divisions if specific city points aren't listed
              const standardDistricts = [
                `${parentNode.name} Central`,
                `${parentNode.name} North`,
                `${parentNode.name} South`,
                `${parentNode.name} East`,
                `${parentNode.name} West`,
              ];
              const rowsToInsert = standardDistricts.map((dName, idx) => ({
                name: dName,
                type: 'city',
                parent_id: parentNode.jurisdiction_id,
                code: `DIST-${idx + 1}`,
                status: 'active',
              }));
              await prisma.jurisdictionMaster.createMany({
                data: rowsToInsert,
                skipDuplicates: true,
              });
            }
          } else if (parentNode.type === 'city') {
            // Local municipal wards / sectors for granular GIS reporting
            const standardWards = [
              'Ward 1 - Downtown / Central Zone',
              'Ward 2 - North District',
              'Ward 3 - South District',
              'Ward 4 - East District',
              'Ward 5 - West District',
            ];
            const rowsToInsert = standardWards.map((wName, idx) => ({
              name: wName,
              type: 'ward',
              parent_id: parentNode.jurisdiction_id,
              code: `W-${idx + 1}`,
              status: 'active',
            }));
            await prisma.jurisdictionMaster.createMany({
              data: rowsToInsert,
              skipDuplicates: true,
            });
          }

          // Re-fetch items now that children are dynamically persisted
          items = await prisma.jurisdictionMaster.findMany({
            where,
            orderBy: { name: 'asc' },
            include: {
              _count: {
                select: { children: true, entities: true },
              },
            },
          });
        }
      } catch (err) {
        console.warn('[JurisdictionRouter] Dynamic GIS sync warning:', err.message);
      }
    }

    return res.status(200).json({ success: true, data: items });
  } catch (err) {
    return next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /jurisdictions/:id
// Get single jurisdiction with full ancestor path
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const id = parsePositiveInt(req.params.id, 'id');

    const node = await prisma.jurisdictionMaster.findUnique({
      where: { jurisdiction_id: id },
      include: {
        children: {
          where: { status: 'active' },
          orderBy: { name: 'asc' },
        },
        _count: {
          select: { entities: true, children: true },
        },
      },
    });

    if (!node) {
      return next(createError(`Jurisdiction with id ${id} not found.`, 404));
    }

    const path = await buildAncestorPath(id);
    const formatted_path = path.map(p => p.name).join(' › ');

    return res.status(200).json({
      success: true,
      data: {
        ...node,
        path,
        formatted_path,
      },
    });
  } catch (err) {
    return next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /jurisdictions (Admin-only)
// Create a new jurisdiction node with parent/type hierarchy and sibling checks.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', verifyToken, checkRole('admin'), async (req, res, next) => {
  try {
    const { name, type, parent_id, code } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return next(createError('"name" is required and must be a non-empty string.', 400));
    }

    if (!type || typeof type !== 'string' || type.trim() === '') {
      return next(createError('"type" is required and must be a non-empty string (e.g. country, state, city, ward).', 400));
    }

    const trimmedName = name.trim();
    const normalizedType = type.trim().toLowerCase();

    let parsedParentId = null;
    if (parent_id !== undefined && parent_id !== null && parent_id !== '') {
      parsedParentId = parsePositiveInt(parent_id, 'parent_id');

      const parentNode = await prisma.jurisdictionMaster.findUnique({
        where: { jurisdiction_id: parsedParentId },
      });

      if (!parentNode) {
        return next(createError(`Parent jurisdiction with id ${parsedParentId} does not exist.`, 400));
      }

      if (parentNode.status !== 'active') {
        return next(createError(`Parent jurisdiction "${parentNode.name}" is inactive. Cannot add child to inactive parent.`, 400));
      }

      // Hierarchy validation
      if (normalizedType === 'country') {
        return next(createError('A "country" jurisdiction cannot have a parent.', 400));
      }
      if (normalizedType === 'state' && parentNode.type !== 'country') {
        return next(createError('A "state" jurisdiction must have a "country" parent.', 400));
      }
      if (normalizedType === 'city' && parentNode.type !== 'state') {
        return next(createError('A "city" jurisdiction must have a "state" parent.', 400));
      }
      if (normalizedType === 'ward' && parentNode.type !== 'city') {
        return next(createError('A "ward" jurisdiction must have a "city" parent.', 400));
      }
    } else {
      if (normalizedType !== 'country') {
        return next(createError(`A "${normalizedType}" jurisdiction must specify a valid "parent_id".`, 400));
      }
    }

    // Check duplicate siblings (case-insensitive check for same name under same parent)
    const existingSibling = await prisma.jurisdictionMaster.findFirst({
      where: {
        parent_id: parsedParentId,
        name: { equals: trimmedName, mode: 'insensitive' },
      },
    });

    if (existingSibling) {
      if (existingSibling.status === 'inactive') {
        // Re-activate existing inactive sibling
        const reactivated = await prisma.jurisdictionMaster.update({
          where: { jurisdiction_id: existingSibling.jurisdiction_id },
          data: { status: 'active', code: code ? String(code).trim() : existingSibling.code },
        });
        return res.status(200).json({ success: true, data: reactivated, message: 'Re-activated existing jurisdiction.' });
      }
      return next(createError(`A sibling jurisdiction named "${trimmedName}" already exists under this parent.`, 409));
    }

    const created = await prisma.jurisdictionMaster.create({
      data: {
        name: trimmedName,
        type: normalizedType,
        parent_id: parsedParentId,
        code: code ? String(code).trim().toUpperCase() : null,
        status: 'active',
      },
    });

    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    return next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /jurisdictions/:id (Admin-only)
// Update details or toggle status.
// ─────────────────────────────────────────────────────────────────────────────
router.put('/:id', verifyToken, checkRole('admin'), async (req, res, next) => {
  try {
    const id = parsePositiveInt(req.params.id, 'id');
    const { name, code, status, parent_id } = req.body;

    const existing = await prisma.jurisdictionMaster.findUnique({
      where: { jurisdiction_id: id },
    });

    if (!existing) {
      return next(createError(`Jurisdiction with id ${id} not found.`, 404));
    }

    const updateData = {};
    if (name !== undefined) {
      if (!name || typeof name !== 'string' || name.trim() === '') {
        return next(createError('"name" must be a non-empty string.', 400));
      }
      updateData.name = name.trim();
    }

    if (code !== undefined) {
      updateData.code = code ? String(code).trim().toUpperCase() : null;
    }

    if (status !== undefined) {
      if (!['active', 'inactive'].includes(status)) {
        return next(createError('status must be either "active" or "inactive".', 400));
      }
      updateData.status = status;
    }

    if (parent_id !== undefined) {
      if (parent_id === null || parent_id === '') {
        if (existing.type !== 'country') {
          return next(createError(`"${existing.type}" cannot be moved to root without a parent.`, 400));
        }
        updateData.parent_id = null;
      } else {
        const pId = parsePositiveInt(parent_id, 'parent_id');
        if (pId === id) {
          return next(createError('A jurisdiction cannot be its own parent.', 400));
        }
        const cycle = await isAncestorOf(id, pId);
        if (cycle) {
          return next(createError('Cannot set a descendant as the parent (cyclic hierarchy prevented).', 400));
        }
        updateData.parent_id = pId;
      }
    }

    const updated = await prisma.jurisdictionMaster.update({
      where: { jurisdiction_id: id },
      data: updateData,
    });

    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    return next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /jurisdictions/:id (Admin-only)
// Non-destructive deactivation: prefers inactive status over deletion.
// ─────────────────────────────────────────────────────────────────────────────
router.delete('/:id', verifyToken, checkRole('admin'), async (req, res, next) => {
  try {
    const id = parsePositiveInt(req.params.id, 'id');

    const node = await prisma.jurisdictionMaster.findUnique({
      where: { jurisdiction_id: id },
      include: {
        _count: {
          select: { entities: true, children: true },
        },
      },
    });

    if (!node) {
      return next(createError(`Jurisdiction with id ${id} not found.`, 404));
    }

    // Non-destructive deactivation
    const deactivated = await prisma.jurisdictionMaster.update({
      where: { jurisdiction_id: id },
      data: { status: 'inactive' },
    });

    return res.status(200).json({
      success: true,
      message: `Jurisdiction "${node.name}" has been deactivated non-destructively.`,
      data: deactivated,
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
