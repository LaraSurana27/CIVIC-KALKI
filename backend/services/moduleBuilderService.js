/**
 * CIVIC-KALKI — Module Builder Service (Phase 3A)
 *
 * Provides transactional, atomic metadata generation for new civic modules:
 * - EntityType
 * - FormMaster, SectionMaster, SubsectionMaster, ParameterMaster
 * - WorkflowMaster transitions
 * - EntityRelationshipRule automation rules
 * - ReportMaster reporting configurations
 *
 * Zero module-specific tables or code generated. All modules execute through
 * the generic Entity, Form, Workflow, Rule, and Report engines.
 */

const prisma = require('../db');

function createHttpError(message, statusCode = 400) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

const ALLOWED_ROLES = ['citizen', 'coordinator_area', 'coordinator_general', 'director', 'admin'];
const ALLOWED_METRICS = ['COUNT', 'SUM', 'AVG', 'MIN', 'MAX'];
const ALLOWED_FIELD_TYPES = ['text', 'textarea', 'number', 'date', 'select', 'checkbox'];

/**
 * Validate a declarative module definition before deployment.
 */
function validateModuleDefinition(payload) {
  const errors = [];

  // 1. Module Basics Validation
  const moduleData = payload.module || {};
  if (!moduleData.name || typeof moduleData.name !== 'string' || !moduleData.name.trim()) {
    errors.push('Module name is required and must be a non-empty string.');
  }

  // 2. Form & Parameters Validation
  const formData = payload.form || {};
  const sections = Array.isArray(formData.sections) ? formData.sections : [];
  if (sections.length === 0) {
    errors.push('Form must contain at least one section.');
  }

  const allParams = [];
  sections.forEach((sec, sIdx) => {
    if (!sec.name || !sec.name.trim()) {
      errors.push(`Section #${sIdx + 1} must have a valid title.`);
    }
    const params = Array.isArray(sec.parameters) ? sec.parameters : [];
    if (params.length === 0) {
      errors.push(`Section "${sec.name || sIdx + 1}" must have at least one field parameter.`);
    }
    params.forEach((p, pIdx) => {
      if (!p.label || !p.label.trim()) {
        errors.push(`Field #${pIdx + 1} in section "${sec.name || sIdx + 1}" must have a label.`);
      }
      if (p.field_type && !ALLOWED_FIELD_TYPES.includes(p.field_type)) {
        errors.push(`Invalid field_type "${p.field_type}" for field "${p.label}".`);
      }
      allParams.push(p);
    });
  });

  // 3. Workflow Validation
  const workflowData = payload.workflow || {};
  const transitions = Array.isArray(workflowData.transitions) ? workflowData.transitions : [];
  if (transitions.length > 0) {
    const seenTransitions = new Set();
    transitions.forEach((tr, tIdx) => {
      const from = (tr.from_status || tr.trigger || '').trim().toLowerCase();
      const to = (tr.to_status || tr.action || '').trim().toLowerCase();
      const role = (tr.role || tr.stage || '').trim().toLowerCase();

      if (!from) errors.push(`Workflow transition #${tIdx + 1} is missing a source (from_status/trigger).`);
      if (!to) errors.push(`Workflow transition #${tIdx + 1} is missing a target (to_status/action).`);
      if (!role) {
        errors.push(`Workflow transition #${tIdx + 1} is missing an allowed role (stage).`);
      } else if (!ALLOWED_ROLES.includes(role)) {
        errors.push(`Role "${role}" in transition #${tIdx + 1} is not permitted. Must be one of: ${ALLOWED_ROLES.join(', ')}.`);
      }

      const key = `${from}->${to}:${role}`;
      if (seenTransitions.has(key)) {
        errors.push(`Duplicate workflow transition "${from}" -> "${to}" for role "${role}".`);
      }
      seenTransitions.add(key);
    });
  }

  // 4. Automation Rules Validation
  const rules = Array.isArray(payload.rules) ? payload.rules : [];
  rules.forEach((rule, rIdx) => {
    if (!rule.target_entity_type_id) {
      errors.push(`Rule #${rIdx + 1} is missing "target_entity_type_id".`);
    }
    if (rule.event && !['approved', 'submitted', 'created'].includes(rule.event)) {
      errors.push(`Rule #${rIdx + 1} event "${rule.event}" is invalid. Supported events: approved, submitted, created.`);
    }
  });

  // 5. Reports Validation
  const reports = Array.isArray(payload.reports) ? payload.reports : [];
  reports.forEach((rep, repIdx) => {
    if (!rep.report_name || !rep.report_name.trim()) {
      errors.push(`Report #${repIdx + 1} must have a valid "report_name".`);
    }
    const filters = rep.filters || {};
    const metric = String(filters.metric || 'COUNT').toUpperCase();
    if (!ALLOWED_METRICS.includes(metric)) {
      errors.push(`Report #${repIdx + 1} metric "${metric}" is invalid. Allowed: ${ALLOWED_METRICS.join(', ')}.`);
    }

    // If numeric aggregation is chosen, verify metricField is numeric if defined in form
    if (['SUM', 'AVG', 'MIN', 'MAX'].includes(metric) && filters.metricField) {
      const targetParam = allParams.find((p) => {
        const k = (p.field_key || '').toLowerCase();
        const l = (p.label || '').toLowerCase();
        return k === filters.metricField.toLowerCase() || l === filters.metricField.toLowerCase();
      });
      if (targetParam && targetParam.field_type !== 'number') {
        errors.push(`Cannot compute numeric metric "${metric}" on non-number field "${filters.metricField}" (type: ${targetParam.field_type}).`);
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Atomically deploy a complete module definition inside a Prisma transaction.
 */
async function deployModule(payload) {
  // 1. Validate payload
  const validation = validateModuleDefinition(payload);
  if (!validation.valid) {
    throw createHttpError(`Module definition validation failed: ${validation.errors.join(' ')}`, 400);
  }

  const moduleData = payload.module;
  const formData = payload.form || {};
  const workflowData = payload.workflow || {};
  const rules = Array.isArray(payload.rules) ? payload.rules : [];
  const reports = Array.isArray(payload.reports) ? payload.reports : [];

  const trimmedName = moduleData.name.trim();

  // 2. Duplicate protection / idempotency check (pre-flight)
  const existingType = await prisma.entityType.findFirst({
    where: { name: { equals: trimmedName, mode: 'insensitive' } },
  });
  if (existingType) {
    throw createHttpError(`EntityType with name "${trimmedName}" already exists.`, 400);
  }

  // 3. Resolve Domain
  let domainId = moduleData.domain_id || moduleData.domainId;
  let targetDomain = domainId ? await prisma.domain.findUnique({ where: { domain_id: Number(domainId) } }) : null;
  if (!targetDomain) {
    targetDomain = await prisma.domain.findFirst();
    if (!targetDomain) {
      targetDomain = await prisma.domain.create({
        data: { domain_name: 'Civic Operations', description: 'General Civic Operations Domain' },
      });
    }
  }

  // 4. Resolve ParameterCategory
  let category = await prisma.parameterCategory.findFirst({ where: { category_name: 'General' } });
  if (!category) {
    category = await prisma.parameterCategory.create({
      data: { category_name: 'General' },
    });
  }

  // 5. Execute Atomic Transaction
  return await prisma.$transaction(async (tx) => {
    // A. Create EntityType
    const entityType = await tx.entityType.create({
      data: {
        domain_id: targetDomain.domain_id,
        name: trimmedName,
        description: moduleData.description ? String(moduleData.description).trim() : null,
      },
    });

    // B. Create FormMaster
    const formTitle = formData.name ? formData.name.trim() : `${trimmedName} Form`;
    const formMaster = await tx.formMaster.create({
      data: {
        entity_type_id: entityType.entity_type_id,
        form_name: formTitle,
        version: '1.0',
        status: 'active',
      },
    });

    // C. Create Sections, Subsections & Parameters
    const sections = Array.isArray(formData.sections) ? formData.sections : [];
    const createdParams = [];

    for (let sIdx = 0; sIdx < sections.length; sIdx++) {
      const sec = sections[sIdx];
      const sectionMaster = await tx.sectionMaster.create({
        data: {
          form_id: formMaster.form_id,
          section_name: sec.name.trim(),
          display_order: sIdx + 1,
        },
      });

      const subsectionMaster = await tx.subsectionMaster.create({
        data: {
          section_id: sectionMaster.section_id,
          subsection_name: sec.subsection_name ? sec.subsection_name.trim() : 'Main',
        },
      });

      const params = Array.isArray(sec.parameters) ? sec.parameters : [];
      for (let pIdx = 0; pIdx < params.length; pIdx++) {
        const p = params[pIdx];
        const fieldKey = (p.field_key || p.label.toLowerCase().replace(/[^a-z0-9]/g, '_') || `field_${pIdx}`).trim();

        let controlType = p.control_type || 'input';
        if (p.field_type === 'textarea') controlType = 'textarea';
        else if (p.field_type === 'date') controlType = 'datepicker';
        else if (p.field_type === 'select') controlType = 'dropdown';

        const opts = (p.field_type === 'select' && p.options && p.options.length)
          ? (typeof p.options === 'object' && !Array.isArray(p.options) ? p.options : { choices: p.options })
          : null;

        const createdParam = await tx.parameterMaster.create({
          data: {
            subsection_id: subsectionMaster.subsection_id,
            category_id: category.category_id,
            field_key: fieldKey,
            label: p.label.trim(),
            field_type: p.field_type || 'text',
            control_type: controlType,
            display_order: pIdx + 1,
            mandatory: Boolean(p.mandatory),
            options: opts,
            validation_rule: p.mandatory ? 'required' : null,
          },
        });
        createdParams.push(createdParam);
      }
    }

    // D. Create WorkflowMaster transitions
    const transitions = Array.isArray(workflowData.transitions) ? workflowData.transitions : [];
    const createdWorkflows = [];

    if (transitions.length > 0) {
      for (const tr of transitions) {
        const from = (tr.from_status || tr.trigger).trim().toLowerCase();
        const to = (tr.to_status || tr.action).trim().toLowerCase();
        const role = (tr.role || tr.stage).trim().toLowerCase();

        const wfRow = await tx.workflowMaster.create({
          data: {
            entity_type_id: entityType.entity_type_id,
            trigger: from,
            action: to,
            stage: role,
          },
        });
        createdWorkflows.push(wfRow);
      }
    } else {
      // Default baseline standard workflow if none provided
      const defaultTransitions = [
        { trigger: 'draft', action: 'submitted', stage: 'citizen' },
        { trigger: 'submitted', action: 'coordinator_approved', stage: 'coordinator_area' },
        { trigger: 'submitted', action: 'rejected', stage: 'coordinator_area' },
        { trigger: 'coordinator_approved', action: 'approved', stage: 'director' },
        { trigger: 'coordinator_approved', action: 'rejected', stage: 'director' },
      ];
      for (const dt of defaultTransitions) {
        const wfRow = await tx.workflowMaster.create({
          data: {
            entity_type_id: entityType.entity_type_id,
            trigger: dt.trigger,
            action: dt.action,
            stage: dt.stage,
          },
        });
        createdWorkflows.push(wfRow);
      }
    }

    // E. Create EntityRelationshipRule rows
    const createdRules = [];
    for (const rule of rules) {
      const targetTypeId = Number(rule.target_entity_type_id);
      const ruleRow = await tx.entityRelationshipRule.create({
        data: {
          source_entity_type_id: entityType.entity_type_id,
          target_entity_type_id: targetTypeId,
          event: rule.event ? String(rule.event).trim() : 'approved',
          auto_create: rule.auto_create !== undefined ? Boolean(rule.auto_create) : true,
          auto_approve: rule.auto_approve !== undefined ? Boolean(rule.auto_approve) : false,
        },
      });
      createdRules.push(ruleRow);
    }

    // F. Create ReportMaster rows
    const createdReports = [];
    for (const rep of reports) {
      const filtersStr = typeof rep.filters === 'object'
        ? JSON.stringify(rep.filters)
        : (rep.filters ? String(rep.filters) : JSON.stringify({ groupBy: 'status', metric: 'COUNT', public_stats: true }));

      const reportRow = await tx.reportMaster.create({
        data: {
          entity_type_id: entityType.entity_type_id,
          report_name: rep.report_name.trim(),
          filters: filtersStr,
          output_format: rep.output_format ? String(rep.output_format).trim() : 'grouped_count',
        },
      });
      createdReports.push(reportRow);
    }

    return {
      entityType,
      formMaster,
      parameterCount: createdParams.length,
      workflowCount: createdWorkflows.length,
      ruleCount: createdRules.length,
      reportCount: createdReports.length,
    };
  });
}

module.exports = {
  validateModuleDefinition,
  deployModule,
};
