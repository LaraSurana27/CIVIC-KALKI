/**
 * CIVIC-KALKI — Governance Intelligence Route
 * POST /governance/analyze  — Director / Admin only
 * GET  /governance/config   — Returns entity_type_id for the Donation Transaction governance module
 */

const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { verifyToken, checkRole } = require('../middleware/auth');
const { generateGovernanceIntelligence } = require('../services/governanceIntelligence');

function createError(message, status = 400) {
  const err = new Error(message);
  err.statusCode = status;
  return err;
}

// ── GET /governance/config ──────────────────────────────────────────────────
// Returns the entity_type_id for the Donation Transaction governance module
// Used by the frontend to know which entity_type_id to analyze
router.get('/config', verifyToken, checkRole(['director', 'admin']), async (req, res, next) => {
  try {
    const donationType = await prisma.entityType.findFirst({
      where: { name: 'Donation Transaction' },
    });
    if (!donationType) {
      return res.status(404).json({
        success: false,
        message: 'Governance module not found. Run seed.js to initialize the Donation Transaction module.',
      });
    }
    return res.json({
      success: true,
      data: {
        entity_type_id: donationType.entity_type_id,
        entity_type_name: donationType.name,
        description: donationType.description,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ── POST /governance/analyze ────────────────────────────────────────────────
// Runs the full governance intelligence analysis for a given entity_type_id.
// Restricted to Director and Admin roles only.
router.post('/analyze', verifyToken, checkRole(['director', 'admin']), async (req, res, next) => {
  try {
    // Accept entity_type_id from body or default to the Donation Transaction type
    let { entity_type_id } = req.body;

    if (!entity_type_id) {
      const donationType = await prisma.entityType.findFirst({ where: { name: 'Donation Transaction' } });
      if (!donationType) {
        return next(createError('Governance module not initialized. Run seed.js first.', 404));
      }
      entity_type_id = donationType.entity_type_id;
    }

    const entityTypeId = Number(entity_type_id);
    if (isNaN(entityTypeId) || entityTypeId <= 0) {
      return next(createError('Invalid entity_type_id provided.', 400));
    }

    // Verify the entity type exists
    const entityType = await prisma.entityType.findUnique({ where: { entity_type_id: entityTypeId } });
    if (!entityType) {
      return next(createError(`EntityType with id ${entityTypeId} not found.`, 404));
    }

    const requestedByUserId = req.user?.user_id || null;
    const result = await generateGovernanceIntelligence(entityTypeId, requestedByUserId);

    return res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
