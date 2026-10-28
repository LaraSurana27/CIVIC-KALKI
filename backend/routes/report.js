/**
 * CIVIC-KALKI — Report Master API Routes
 *
 * Provides REST endpoints for discovering, creating, and executing dynamic
 * ReportMaster queries.
 */

const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const {
  getReportDefinitions,
  getReportDefinitionById,
  executeReport,
} = require('../services/reportEngine');
const prisma = require('../db');

function createError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

function parsePositiveInt(val, name) {
  const num = Number(val);
  if (!Number.isInteger(num) || num <= 0) {
    throw createError(`"${name}" must be a positive integer.`, 400);
  }
  return num;
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /reports — List report definitions
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const entityTypeId = req.query.entity_type_id ? parsePositiveInt(req.query.entity_type_id, 'entity_type_id') : null;
    const reports = await getReportDefinitions(entityTypeId);
    return res.status(200).json({ success: true, data: reports });
  } catch (err) {
    return next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /reports — Create a new ReportMaster definition
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', verifyToken, checkRole(['admin', 'director']), async (req, res, next) => {
  try {
    const { entity_type_id, report_name, filters, output_format } = req.body;

    if (!entity_type_id) {
      return next(createError('"entity_type_id" is required.', 400));
    }
    if (!report_name || typeof report_name !== 'string' || report_name.trim() === '') {
      return next(createError('"report_name" is required and must be a non-empty string.', 400));
    }

    const parsedTypeId = parsePositiveInt(entity_type_id, 'entity_type_id');
    const entityType = await prisma.entityType.findUnique({ where: { entity_type_id: parsedTypeId } });
    if (!entityType) {
      return next(createError(`entity_type_id ${parsedTypeId} does not exist.`, 400));
    }

    const filtersStr = typeof filters === 'object' ? JSON.stringify(filters) : (filters ? String(filters) : null);

    const report = await prisma.reportMaster.create({
      data: {
        entity_type_id: parsedTypeId,
        report_name: report_name.trim(),
        filters: filtersStr,
        output_format: output_format ? String(output_format).trim() : 'grouped_count',
      },
      include: {
        entityType: { select: { entity_type_id: true, name: true } },
      },
    });

    return res.status(201).json({ success: true, data: report });
  } catch (err) {
    return next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /reports/:id — Get report definition by ID
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:id', verifyToken, async (req, res, next) => {
  try {
    const reportId = parsePositiveInt(req.params.id, 'id');
    const report = await getReportDefinitionById(reportId);
    return res.status(200).json({ success: true, data: report });
  } catch (err) {
    return next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /reports/:id/execute & POST /reports/:id/execute — Execute report query
// ─────────────────────────────────────────────────────────────────────────────
const handleExecute = async (req, res, next) => {
  try {
    const reportId = parsePositiveInt(req.params.id, 'id');
    const overrideFilters = { ...req.query, ...(req.body || {}) };

    const result = await executeReport({
      reportId,
      user: req.user,
      overrideFilters,
    });

    const requestedFormat = (req.query.format || req.query.export || '').toLowerCase();
    if (requestedFormat === 'csv') {
      const columns = result.columns || [];
      const header = columns.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',');
      const lines = (result.rows || []).map((r) => {
        return columns
          .map((c) => {
            const val = r[c] !== undefined && r[c] !== null ? String(r[c]) : '';
            return `"${val.replace(/"/g, '""')}"`;
          })
          .join(',');
      });
      const csvContent = [header, ...lines].join('\n');
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${result.reportName.replace(/[^a-z0-9]/gi, '_')}.csv"`);
      return res.status(200).send(csvContent);
    }

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return next(err);
  }
};

router.get('/:id/execute', verifyToken, handleExecute);
router.post('/:id/execute', verifyToken, handleExecute);

module.exports = router;
