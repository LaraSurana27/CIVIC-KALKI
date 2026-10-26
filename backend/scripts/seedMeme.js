/**
 * CIVIC-KALKI — Seed: Civic Campaign EntityType + Form + Parameters + Workflow
 *
 * Run: node backend/scripts/seedMeme.js
 *
 * Creates (idempotent):
 *  - EntityType: "Civic Campaign"
 *  - FormMaster with sections for campaign metadata
 *  - ParameterMaster entries for all metadata fields
 *  - WorkflowMaster for: draft->pending_review->approved->published
 *    with coordinator_area/admin as moderators
 *
 * HARD RULE: Does NOT create any Entity (real or demo).
 * HARD RULE: Does NOT duplicate or touch existing issue entities.
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log('[SEED MEME] Starting Civic Campaign module seed...');

  // 1. Domain — reuse existing domain_id = 1
  const domain = await prisma.domain.findFirst();
  if (!domain) throw new Error('No domain found. Run main seed.js first.');

  // 2. EntityType: Civic Campaign (idempotent)
  let entityType = await prisma.entityType.findFirst({ where: { name: 'Civic Campaign' } });
  if (!entityType) {
    entityType = await prisma.entityType.create({
      data: {
        domain_id: domain.domain_id,
        name: 'Civic Campaign',
        description: 'Civic awareness meme campaign linked to a verified civic issue.',
      },
    });
    console.log(`[SEED MEME] Created EntityType "Civic Campaign" id=${entityType.entity_type_id}`);
  } else {
    console.log(`[SEED MEME] EntityType "Civic Campaign" already exists id=${entityType.entity_type_id}`);
  }

  // 3. FormMaster (idempotent)
  let form = await prisma.formMaster.findFirst({ where: { entity_type_id: entityType.entity_type_id } });
  if (!form) {
    form = await prisma.formMaster.create({
      data: {
        entity_type_id: entityType.entity_type_id,
        form_name: 'Civic Campaign Form',
        version: '1.0',
        status: 'active',
      },
    });
    console.log(`[SEED MEME] Created FormMaster id=${form.form_id}`);
  }

  // 4. ParameterCategory
  let cat = await prisma.parameterCategory.findFirst({ where: { category_name: 'General' } });
  if (!cat) {
    cat = await prisma.parameterCategory.create({ data: { category_name: 'General' } });
  }

  // 5. Section
  const existingSections = await prisma.sectionMaster.findMany({ where: { form_id: form.form_id } });
  let section;
  if (existingSections.length === 0) {
    section = await prisma.sectionMaster.create({
      data: { form_id: form.form_id, section_name: 'Campaign Details', display_order: 1 },
    });
  } else {
    section = existingSections[0];
  }

  // 6. Subsection
  const existingSubs = await prisma.subsectionMaster.findMany({ where: { section_id: section.section_id } });
  let subsection;
  if (existingSubs.length === 0) {
    subsection = await prisma.subsectionMaster.create({
      data: { section_id: section.section_id, subsection_name: 'Meme Content' },
    });
  } else {
    subsection = existingSubs[0];
  }

  // 7. ParameterMasters — all campaign metadata fields
  const PARAMS = [
    { field_key: 'linked_entity_id',       label: 'Linked Issue ID',         field_type: 'number', mandatory: true },
    { field_key: 'template_type',           label: 'Template Type',           field_type: 'text',   mandatory: true },
    { field_key: 'headline',               label: 'Meme Headline',           field_type: 'text',   mandatory: true },
    { field_key: 'caption',                label: 'Meme Caption',            field_type: 'textarea', mandatory: true },
    { field_key: 'caption_source',         label: 'Caption Source',          field_type: 'text',   mandatory: false },
    { field_key: 'original_ai_suggestion', label: 'Original AI Suggestion',  field_type: 'textarea', mandatory: false },
    { field_key: 'deterministic_result',   label: 'Deterministic Safety Result', field_type: 'textarea', mandatory: false },
    { field_key: 'ai_safety_result',       label: 'AI Safety Check Result',  field_type: 'textarea', mandatory: false },
    { field_key: 'attestation_accepted',   label: 'Photo Attestation Accepted', field_type: 'text', mandatory: true },
    { field_key: 'photo_file_id',          label: 'Photo File ID',           field_type: 'number', mandatory: false },
  ];

  for (let i = 0; i < PARAMS.length; i++) {
    const p = PARAMS[i];
    const existing = await prisma.parameterMaster.findFirst({
      where: { subsection_id: subsection.subsection_id, field_key: p.field_key },
    });
    if (!existing) {
      await prisma.parameterMaster.create({
        data: {
          subsection_id: subsection.subsection_id,
          category_id: cat.category_id,
          field_key: p.field_key,
          label: p.label,
          field_type: p.field_type,
          control_type: p.field_type === 'textarea' ? 'textarea' : 'input',
          display_order: i + 1,
          mandatory: p.mandatory || false,
        },
      });
      console.log(`[SEED MEME] Created parameter: ${p.field_key}`);
    }
  }

  // 8. WorkflowMaster transitions (idempotent)
  const TRANSITIONS = [
    { trigger: 'draft',          action: 'pending_review', stage: 'citizen' },
    { trigger: 'pending_review', action: 'approved',       stage: 'coordinator_area' },
    { trigger: 'pending_review', action: 'approved',       stage: 'coordinator_general' },
    { trigger: 'pending_review', action: 'approved',       stage: 'admin' },
    { trigger: 'pending_review', action: 'rejected',       stage: 'coordinator_area' },
    { trigger: 'pending_review', action: 'rejected',       stage: 'coordinator_general' },
    { trigger: 'pending_review', action: 'rejected',       stage: 'admin' },
    { trigger: 'approved',       action: 'published',      stage: 'coordinator_area' },
    { trigger: 'approved',       action: 'published',      stage: 'coordinator_general' },
    { trigger: 'approved',       action: 'published',      stage: 'admin' },
    { trigger: 'approved',       action: 'rejected',       stage: 'coordinator_area' },
    { trigger: 'approved',       action: 'rejected',       stage: 'admin' },
    { trigger: 'published',      action: 'under_review',   stage: 'coordinator_area' },
    { trigger: 'published',      action: 'under_review',   stage: 'admin' },
    { trigger: 'published',      action: 'rejected',       stage: 'coordinator_area' },
    { trigger: 'published',      action: 'rejected',       stage: 'admin' },
    { trigger: 'under_review',   action: 'approved',       stage: 'coordinator_area' },
    { trigger: 'under_review',   action: 'approved',       stage: 'admin' },
    { trigger: 'under_review',   action: 'rejected',       stage: 'coordinator_area' },
    { trigger: 'under_review',   action: 'rejected',       stage: 'admin' },
  ];

  for (const tr of TRANSITIONS) {
    const existing = await prisma.workflowMaster.findFirst({
      where: { entity_type_id: entityType.entity_type_id, trigger: tr.trigger, action: tr.action, stage: tr.stage },
    });
    if (!existing) {
      await prisma.workflowMaster.create({
        data: { entity_type_id: entityType.entity_type_id, ...tr },
      });
    }
  }

  // 9. SecurityRoles (RBAC entries on the form)
  const ROLES = [
    { role_name: 'citizen',             permission: 'create,read_own', scope: 'own' },
    { role_name: 'coordinator_area',    permission: 'read,moderate',   scope: 'area' },
    { role_name: 'coordinator_general', permission: 'read,moderate',   scope: 'all' },
    { role_name: 'admin',               permission: 'read,moderate,delete', scope: 'all' },
    { role_name: 'director',            permission: 'read,analytics',  scope: 'all' },
  ];
  for (const r of ROLES) {
    const existing = await prisma.securityRole.findFirst({ where: { form_id: form.form_id, role_name: r.role_name } });
    if (!existing) {
      await prisma.securityRole.create({ data: { form_id: form.form_id, ...r } });
    }
  }

  console.log('[SEED MEME] Done. Civic Campaign module seeded successfully.');
  console.log(`[SEED MEME] EntityType ID: ${entityType.entity_type_id}`);
  await prisma.$disconnect();
}

run().catch((err) => {
  console.error('[SEED MEME] Error:', err);
  process.exit(1);
});
