/**
 * CIVIC-KALKI — Module Builder Routes (Phase 3A)
 *
 * REST endpoints for validating and atomically deploying full module metadata definitions.
 */

const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const {
  validateModuleDefinition,
  deployModule,
} = require('../services/moduleBuilderService');

// ── POST /module-builder/validate — Dry-run validation ──────────────────────
router.post('/validate', verifyToken, async (req, res, next) => {
  try {
    const result = validateModuleDefinition(req.body || {});
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return next(err);
  }
});

// ── POST /module-builder/deploy — Atomic transactional deployment ────────────
router.post('/deploy', verifyToken, checkRole(['admin', 'director']), async (req, res, next) => {
  try {
    const result = await deployModule(req.body || {});
    return res.status(201).json({
      success: true,
      message: `Module "${result.entityType.name}" deployed successfully via metadata.`,
      data: result,
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
