/**
 * CIVIC-KALKI — Metadata Loader & Validator Service (Phase 6)
 *
 * Loads, validates, and seeds declarative JSON metadata definitions into
 * the database idempotently.
 *
 * Capabilities:
 * - Structural & referential integrity checks (field keys, authorities, states)
 * - Schema validation
 * - Idempotent upsert by stable keys
 * - Dry-run mode (--dry-run)
 */

const fs = require('fs');
const path = require('path');
const prisma = require('../db');

/**
 * Validate a metadata definition object for structural and referential integrity.
 */
function validateMetadataDefinition(metadata) {
  const errors = [];

  // 1. Basic Structure
  if (!metadata.domain || !metadata.domain.name) {
    errors.push('Missing required "domain.name".');
  }
  if (!metadata.entity_type || !metadata.entity_type.name) {
    errors.push('Missing required "entity_type.name".');
  }
  if (!metadata.form || !metadata.form.name || !Array.isArray(metadata.form.sections)) {
    errors.push('Missing required "form.name" or "form.sections" array.');
  }

  // 2. Form & Parameter Referential Integrity
  const allParamKeys = new Set();
  const sections = metadata.form?.sections || [];

  if (sections.length === 0) {
    errors.push('Form must contain at least one section (no orphan form).');
  }

  sections.forEach((sec, sIdx) => {
    if (!sec.name) errors.push(`Section #${sIdx + 1} has no name.`);
    const subsections = Array.isArray(sec.subsections) ? sec.subsections : [];
    if (subsections.length === 0) {
      errors.push(`Section "${sec.name || sIdx + 1}" has no subsections.`);
    }

    subsections.forEach((sub, subIdx) => {
      const params = Array.isArray(sub.parameters) ? sub.parameters : [];
      params.forEach((p, pIdx) => {
        if (!p.field_key) {
          errors.push(`Parameter #${pIdx + 1} in subsection "${sub.name || subIdx}" has no field_key.`);
        } else {
          if (allParamKeys.has(p.field_key)) {
            errors.push(`Duplicate parameter field_key "${p.field_key}".`);
          }
          allParamKeys.add(p.field_key);
        }
        if (!p.label) {
          errors.push(`Parameter "${p.field_key || pIdx}" has no label.`);
        }
      });
    });
  });

  // 3. Workflow State Machine Referential Integrity
  const wf = metadata.workflow || {};
  const states = Array.isArray(wf.states) ? wf.states : [];
  const stateKeys = new Set(states.map((s) => s.key?.toLowerCase()));

  if (states.length < 2) {
    errors.push('Workflow must define at least two states.');
  }

  if (wf.initial_state && !stateKeys.has(wf.initial_state.toLowerCase())) {
    errors.push(`Workflow initial_state "${wf.initial_state}" is not defined in workflow.states.`);
  }

  const transitions = Array.isArray(wf.transitions) ? wf.transitions : [];
  transitions.forEach((tr, tIdx) => {
    const from = (tr.from || '').toLowerCase();
    const to = (tr.to || '').toLowerCase();

    if (!stateKeys.has(from)) {
      errors.push(`Transition #${tIdx + 1} references undefined source state "${tr.from}".`);
    }
    if (!stateKeys.has(to)) {
      errors.push(`Transition #${tIdx + 1} references undefined target state "${tr.to}".`);
    }
    if (!tr.allowed_roles || !Array.isArray(tr.allowed_roles) || tr.allowed_roles.length === 0) {
      errors.push(`Transition "${from}" -> "${to}" must specify at least one allowed role.`);
    }
  });

  // 4. Authority Routing Rules Referential Integrity
  const routingRules = metadata.rules?.authority_routing || [];
  const sharedAuthoritiesPath = path.join(__dirname, '..', 'metadata', '_shared', 'authorities.json');
  let validAuthorities = new Set();

  if (fs.existsSync(sharedAuthoritiesPath)) {
    try {
      const authData = JSON.parse(fs.readFileSync(sharedAuthoritiesPath, 'utf8'));
      validAuthorities = new Set((authData.authorities || []).map((a) => a.key));
    } catch (_e) {}
  }

  routingRules.forEach((rule, rIdx) => {
    if (!rule.authority_key) {
      errors.push(`Authority rule #${rIdx + 1} missing "authority_key".`);
    } else if (validAuthorities.size > 0 && !validAuthorities.has(rule.authority_key)) {
      errors.push(`Authority rule #${rIdx + 1} references unknown authority "${rule.authority_key}".`);
    }

    if (Array.isArray(rule.matched_input_fields)) {
      for (const field of rule.matched_input_fields) {
        if (!allParamKeys.has(field) && !['area', 'location', 'name'].includes(field)) {
          errors.push(`Authority rule "${rule.id || rIdx}" references non-existent parameter "${field}".`);
        }
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Load all metadata definition files from backend/metadata/.
 */
function loadAllMetadataFiles() {
  const metadataDir = path.join(__dirname, '..', 'metadata');
  if (!fs.existsSync(metadataDir)) return [];

  const files = fs
    .readdirSync(metadataDir)
    .filter((f) => f.endsWith('.json') && !f.startsWith('_'));

  return files.map((file) => {
    const fullPath = path.join(metadataDir, file);
    const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    return {
      file,
      path: fullPath,
      content,
    };
  });
}

/**
 * Seed or update metadata records idempotently in the database.
 *
 * @param {object} options
 * @param {boolean} [options.dryRun=false] - Perform checks without writing to DB
 * @returns {Promise<{ success: boolean, results: object[], dryRun: boolean }>}
 */
async function seedMetadata({ dryRun = false } = {}) {
  const fileItems = loadAllMetadataFiles();
  const results = [];

  for (const item of fileItems) {
    const { file, content } = item;
    const validation = validateMetadataDefinition(content);

    if (!validation.valid) {
      throw new Error(`Metadata file "${file}" failed validation:\n - ${validation.errors.join('\n - ')}`);
    }

    const domainName = content.domain.name.trim();
    const entityTypeName = content.entity_type.name.trim();

    if (dryRun) {
      results.push({
        file,
        entityType: entityTypeName,
        domain: domainName,
        sectionsCount: content.form.sections.length,
        transitionsCount: content.workflow.transitions.length,
        rulesCount: (content.rules?.authority_routing || []).length,
        reportsCount: (content.reports || []).length,
        status: 'VALIDATED_DRY_RUN',
      });
      continue;
    }

    // ── Commit to database ──────────────────────────────────────────────────
    const seeded = await prisma.$transaction(async (tx) => {
      // 1. Domain
      let domain = await tx.domain.findFirst({
        where: { domain_name: domainName },
      });
      if (!domain) {
        domain = await tx.domain.create({
          data: {
            domain_name: domainName,
            description: content.domain.description || null,
          },
        });
      }

      // 2. EntityType
      let entityType = await tx.entityType.findFirst({
        where: { name: entityTypeName },
      });
      if (entityType) {
        entityType = await tx.entityType.update({
          where: { entity_type_id: entityType.entity_type_id },
          data: {
            domain_id: domain.domain_id,
            description: content.entity_type.description || null,
          },
        });
      } else {
        entityType = await tx.entityType.create({
          data: {
            domain_id: domain.domain_id,
            name: entityTypeName,
            description: content.entity_type.description || null,
          },
        });
      }

      // 3. FormMaster
      let formMaster = await tx.formMaster.findFirst({
        where: { entity_type_id: entityType.entity_type_id },
      });
      if (formMaster) {
        formMaster = await tx.formMaster.update({
          where: { form_id: formMaster.form_id },
          data: {
            form_name: content.form.name,
            version: content.entity_type.version || '1.0',
            status: 'active',
          },
        });
      } else {
        formMaster = await tx.formMaster.create({
          data: {
            entity_type_id: entityType.entity_type_id,
            form_name: content.form.name,
            version: content.entity_type.version || '1.0',
            status: 'active',
          },
        });
      }

      // 4. ParameterCategory
      let category = await tx.parameterCategory.findFirst({
        where: { category_name: 'General' },
      });
      if (!category) {
        category = await tx.parameterCategory.create({
          data: { category_name: 'General' },
        });
      }

      // 5. Clean existing sections and parameters for this form idempotently
      const existingSections = await tx.sectionMaster.findMany({
        where: { form_id: formMaster.form_id },
        include: { subsections: { include: { parameters: true } } },
      });
      for (const sec of existingSections) {
        for (const sub of sec.subsections) {
          const paramIds = sub.parameters.map((p) => p.parameter_id);
          if (paramIds.length > 0) {
            // Note: do not delete parameter values for existing submitted entities!
            // Instead, update existing ParameterMaster or delete unused ones
          }
        }
      }

      // 6. Upsert Sections, Subsections & Parameters
      let totalParams = 0;
      for (let sIdx = 0; sIdx < content.form.sections.length; sIdx++) {
        const sec = content.form.sections[sIdx];
        let sectionMaster = await tx.sectionMaster.findFirst({
          where: { form_id: formMaster.form_id, section_name: sec.name },
        });
        if (!sectionMaster) {
          sectionMaster = await tx.sectionMaster.create({
            data: {
              form_id: formMaster.form_id,
              section_name: sec.name,
              display_order: sec.display_order || sIdx + 1,
            },
          });
        }

        const subsections = sec.subsections || [{ name: 'Main', parameters: [] }];
        for (const sub of subsections) {
          let subsectionMaster = await tx.subsectionMaster.findFirst({
            where: { section_id: sectionMaster.section_id, subsection_name: sub.name },
          });
          if (!subsectionMaster) {
            subsectionMaster = await tx.subsectionMaster.create({
              data: {
                section_id: sectionMaster.section_id,
                subsection_name: sub.name,
              },
            });
          }

          const params = sub.parameters || [];
          for (let pIdx = 0; pIdx < params.length; pIdx++) {
            const p = params[pIdx];
            totalParams++;

            const optionsPayload = p.options || {};
            if (p.help_text) optionsPayload.help_text = p.help_text;
            if (p.visibility_rule) optionsPayload.visibility_rule = p.visibility_rule;

            const existingParam = await tx.parameterMaster.findFirst({
              where: {
                subsection_id: subsectionMaster.subsection_id,
                field_key: p.field_key,
              },
            });

            if (existingParam) {
              await tx.parameterMaster.update({
                where: { parameter_id: existingParam.parameter_id },
                data: {
                  label: p.label,
                  field_type: p.field_type,
                  control_type: p.control_type || 'input',
                  display_order: pIdx + 1,
                  mandatory: Boolean(p.mandatory),
                  options: Object.keys(optionsPayload).length > 0 ? optionsPayload : null,
                  validation_rule: p.validation_rule || null,
                },
              });
            } else {
              await tx.parameterMaster.create({
                data: {
                  subsection_id: subsectionMaster.subsection_id,
                  category_id: category.category_id,
                  field_key: p.field_key,
                  label: p.label,
                  field_type: p.field_type,
                  control_type: p.control_type || 'input',
                  display_order: pIdx + 1,
                  mandatory: Boolean(p.mandatory),
                  options: Object.keys(optionsPayload).length > 0 ? optionsPayload : null,
                  validation_rule: p.validation_rule || null,
                },
              });
            }
          }
        }
      }

      // 7. Upsert WorkflowMaster transitions
      let totalWorkflows = 0;
      for (const tr of content.workflow.transitions) {
        totalWorkflows++;
        const roles = Array.isArray(tr.allowed_roles) ? tr.allowed_roles.join(',') : tr.allowed_roles;
        const from = tr.from.toLowerCase();
        const to = tr.to.toLowerCase();

        const existingWf = await tx.workflowMaster.findFirst({
          where: {
            entity_type_id: entityType.entity_type_id,
            trigger: from,
            action: to,
          },
        });

        if (existingWf) {
          await tx.workflowMaster.update({
            where: { workflow_id: existingWf.workflow_id },
            data: { stage: roles },
          });
        } else {
          await tx.workflowMaster.create({
            data: {
              entity_type_id: entityType.entity_type_id,
              trigger: from,
              action: to,
              stage: roles,
            },
          });
        }
      }

      // 8. Upsert ReportMaster
      let totalReports = 0;
      const reports = content.reports || [];
      for (const rep of reports) {
        totalReports++;
        const filtersStr = typeof rep.filters === 'object' ? JSON.stringify(rep.filters) : String(rep.filters || '{}');
        const existingRep = await tx.reportMaster.findFirst({
          where: {
            entity_type_id: entityType.entity_type_id,
            report_name: rep.name,
          },
        });

        if (existingRep) {
          await tx.reportMaster.update({
            where: { report_id: existingRep.report_id },
            data: {
              filters: filtersStr,
              output_format: rep.output_format || 'grouped_count',
            },
          });
        } else {
          await tx.reportMaster.create({
            data: {
              entity_type_id: entityType.entity_type_id,
              report_name: rep.name,
              filters: filtersStr,
              output_format: rep.output_format || 'grouped_count',
            },
          });
        }
      }

      return {
        file,
        entityType: entityTypeName,
        domain: domainName,
        formId: formMaster.form_id,
        parametersCount: totalParams,
        workflowsCount: totalWorkflows,
        reportsCount: totalReports,
        status: 'SEEDED_SUCCESSFULLY',
      };
    }, { maxWait: 15000, timeout: 30000 });

    results.push(seeded);
  }

  return {
    success: true,
    dryRun,
    results,
  };
}

module.exports = {
  validateMetadataDefinition,
  loadAllMetadataFiles,
  seedMetadata,
};
