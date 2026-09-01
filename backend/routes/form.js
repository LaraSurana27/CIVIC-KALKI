/**
 * CIVIC-KALKI — Generic Form Engine
 * Provides routes for building and retrieving form schemas dynamically.
 * Any entity type can have forms; forms have sections → subsections → parameters.
 *
 * Routes:
 *   POST   /forms                                    — Create a FormMaster
 *   POST   /forms/:formId/sections                   — Add a section to a form
 *   POST   /sections/:sectionId/subsections          — Add a subsection to a section
 *   POST   /subsections/:subsectionId/parameters     — Add a parameter to a subsection
 *   GET    /forms/:formId/schema                     — Full nested structure (single query)
 */

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// ── Helper: create an HTTP-aware error ────────────────────────────────────────
function createError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

// ── Helper: parse a positive integer, throw 400 on failure ───────────────────
// Used for IDs (formId, sectionId, subsectionId, category_id) — never 0.
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

// ── Helper: parse a non-negative integer (0 is valid), throw 400 on failure ──
// Used for display_order — 0 is a legitimate first-position value.
function parseNonNegativeInt(value, fieldName) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw createError(
      `"${fieldName}" must be a non-negative integer (0 or greater). Received: ${value}`,
      400
    );
  }
  return parsed;
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /forms
// Create a new FormMaster record.
// Body: { entity_type_id, form_name, version?, status? }
// ─────────────────────────────────────────────────────────────────────────────
router.post('/forms', async (req, res, next) => {
  try {
    const { entity_type_id, form_name, version, status } = req.body;

    // ── Validation ────────────────────────────────────────────────────────────
    if (entity_type_id === undefined || entity_type_id === null) {
      return next(createError('"entity_type_id" is required.', 400));
    }
    if (!form_name || typeof form_name !== 'string' || form_name.trim() === '') {
      return next(createError('"form_name" is required and must be a non-empty string.', 400));
    }

    const parsedTypeId = parsePositiveInt(entity_type_id, 'entity_type_id');

    // ── FK check: entity_type must exist ─────────────────────────────────────
    const entityType = await prisma.entityType.findUnique({
      where: { entity_type_id: parsedTypeId },
    });
    if (!entityType) {
      return next(
        createError(`entity_type_id ${parsedTypeId} does not exist.`, 400)
      );
    }

    const form = await prisma.formMaster.create({
      data: {
        entity_type_id: parsedTypeId,
        form_name: form_name.trim(),
        version: version ? String(version).trim() : null,
        status: status ? String(status).trim() : 'draft',
      },
    });

    return res.status(201).json({ success: true, data: form });
  } catch (err) {
    return next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /forms/:formId/sections
// Add a SectionMaster to a form.
// Body: { section_name, display_order? }
// ─────────────────────────────────────────────────────────────────────────────
router.post('/forms/:formId/sections', async (req, res, next) => {
  try {
    const formId = parsePositiveInt(req.params.formId, 'formId');
    const { section_name, display_order } = req.body;

    if (!section_name || typeof section_name !== 'string' || section_name.trim() === '') {
      return next(createError('"section_name" is required and must be a non-empty string.', 400));
    }

    // ── FK check: form must exist ─────────────────────────────────────────────
    const form = await prisma.formMaster.findUnique({
      where: { form_id: formId },
    });
    if (!form) {
      return next(createError(`Form with id ${formId} was not found.`, 404));
    }

    const parsedOrder =
      display_order !== undefined
        ? parseNonNegativeInt(display_order, 'display_order')
        : 0;

    const section = await prisma.sectionMaster.create({
      data: {
        form_id: formId,
        section_name: section_name.trim(),
        display_order: parsedOrder,
      },
    });

    return res.status(201).json({ success: true, data: section });
  } catch (err) {
    return next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /sections/:sectionId/subsections
// Add a SubsectionMaster to a section.
// Body: { subsection_name }
// ─────────────────────────────────────────────────────────────────────────────
router.post('/sections/:sectionId/subsections', async (req, res, next) => {
  try {
    const sectionId = parsePositiveInt(req.params.sectionId, 'sectionId');
    const { subsection_name } = req.body;

    if (!subsection_name || typeof subsection_name !== 'string' || subsection_name.trim() === '') {
      return next(createError('"subsection_name" is required and must be a non-empty string.', 400));
    }

    // ── FK check: section must exist ──────────────────────────────────────────
    const section = await prisma.sectionMaster.findUnique({
      where: { section_id: sectionId },
    });
    if (!section) {
      return next(createError(`Section with id ${sectionId} was not found.`, 404));
    }

    const subsection = await prisma.subsectionMaster.create({
      data: {
        section_id: sectionId,
        subsection_name: subsection_name.trim(),
      },
    });

    return res.status(201).json({ success: true, data: subsection });
  } catch (err) {
    return next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /subsections/:subsectionId/parameters
// Add a ParameterMaster to a subsection.
// Body: { category_id, field_type?, control_type?, mandatory?, validation_rule? }
// ─────────────────────────────────────────────────────────────────────────────
router.post('/subsections/:subsectionId/parameters', async (req, res, next) => {
  try {
    const subsectionId = parsePositiveInt(req.params.subsectionId, 'subsectionId');
    const { category_id, field_type, control_type, mandatory, validation_rule } = req.body;

    if (category_id === undefined || category_id === null) {
      return next(createError('"category_id" is required.', 400));
    }

    const parsedCategoryId = parsePositiveInt(category_id, 'category_id');

    // ── FK checks: subsection and category must both exist ────────────────────
    const [subsection, category] = await Promise.all([
      prisma.subsectionMaster.findUnique({ where: { subsection_id: subsectionId } }),
      prisma.parameterCategory.findUnique({ where: { category_id: parsedCategoryId } }),
    ]);

    if (!subsection) {
      return next(createError(`Subsection with id ${subsectionId} was not found.`, 404));
    }
    if (!category) {
      return next(
        createError(`category_id ${parsedCategoryId} does not exist. Create the parameter category first.`, 400)
      );
    }

    // ── mandatory defaults to false if omitted or not a boolean ───────────────
    const isMandatory =
      mandatory !== undefined ? Boolean(mandatory) : false;

    const parameter = await prisma.parameterMaster.create({
      data: {
        subsection_id: subsectionId,
        category_id: parsedCategoryId,
        field_type: field_type ? String(field_type).trim() : null,
        control_type: control_type ? String(control_type).trim() : null,
        mandatory: isMandatory,
        validation_rule: validation_rule ? String(validation_rule).trim() : null,
      },
    });

    return res.status(201).json({ success: true, data: parameter });
  } catch (err) {
    return next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /forms/:formId/schema
// Returns the full nested structure in a single Prisma query (no N+1).
// form → sections (ordered by display_order asc) → subsections → parameters
// ─────────────────────────────────────────────────────────────────────────────
router.get('/forms/:formId/schema', async (req, res, next) => {
  try {
    const formId = parsePositiveInt(req.params.formId, 'formId');

    const form = await prisma.formMaster.findUnique({
      where: { form_id: formId },
      include: {
        entityType: {
          select: { entity_type_id: true, name: true },
        },
        sections: {
          orderBy: { display_order: 'asc' },
          include: {
            subsections: {
              include: {
                parameters: {
                  select: {
                    parameter_id: true,
                    field_type: true,
                    control_type: true,
                    mandatory: true,
                    validation_rule: true,
                    category_id: true,
                    parameterCategory: {
                      select: { category_id: true, category_name: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!form) {
      return next(createError(`Form with id ${formId} was not found.`, 404));
    }

    // ── Shape the response to be clean and frontend-ready ─────────────────────
    const schema = {
      form_id: form.form_id,
      form_name: form.form_name,
      version: form.version,
      status: form.status,
      entity_type: form.entityType,
      sections: form.sections.map((sec) => ({
        section_id: sec.section_id,
        section_name: sec.section_name,
        display_order: sec.display_order,
        subsections: sec.subsections.map((sub) => ({
          subsection_id: sub.subsection_id,
          subsection_name: sub.subsection_name,
          parameters: sub.parameters.map((p) => ({
            parameter_id: p.parameter_id,
            field_type: p.field_type,
            control_type: p.control_type,
            mandatory: p.mandatory,
            validation_rule: p.validation_rule,
            category: p.parameterCategory,
          })),
        })),
      })),
    };

    return res.status(200).json({ success: true, data: schema });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
