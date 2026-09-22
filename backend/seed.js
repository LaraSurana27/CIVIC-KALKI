/* Seed script: creates domain, 7 entity types/forms, demo users, and outputs JWTs to seed-tokens.json

Run: node seed.js
*/

require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function upsertUser({ name, email, password, role, assignedArea = null }) {
  const password_hash = await bcrypt.hash(password, 12);
  const u = await prisma.user.upsert({
    where: { email },
    update: { name, password_hash, role, assignedArea },
    create: { name, email, password_hash, role, assignedArea },
  });
  return u;
}

function signTokenFor(user) {
  return jwt.sign(
    {
      user_id: user.user_id,
      name: user.name,
      role: user.role,
      assigned_area: user.assignedArea || null,
    },
    process.env.JWT_SECRET || 'development-secret-change-me',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
}

async function seedModule({
  domain_id,
  entityTypeName,
  entityTypeDescription,
  formName,
  sectionName,
  subsectionName,
  parameters,
}) {
  // 1. EntityType
  let entityType = await prisma.entityType.findFirst({
    where: { name: entityTypeName },
  });
  if (entityType) {
    entityType = await prisma.entityType.update({
      where: { entity_type_id: entityType.entity_type_id },
      data: { domain_id, description: entityTypeDescription },
    });
  } else {
    entityType = await prisma.entityType.create({
      data: { domain_id, name: entityTypeName, description: entityTypeDescription },
    });
  }

  // 2. FormMaster
  let formMaster = await prisma.formMaster.findFirst({
    where: { entity_type_id: entityType.entity_type_id },
  });
  if (formMaster) {
    formMaster = await prisma.formMaster.update({
      where: { form_id: formMaster.form_id },
      data: { form_name: formName, version: '1.0', status: 'active' },
    });
  } else {
    formMaster = await prisma.formMaster.create({
      data: {
        entity_type_id: entityType.entity_type_id,
        form_name: formName,
        version: '1.0',
        status: 'active',
      },
    });
  }

  // 3. SectionMaster
  let section = await prisma.sectionMaster.findFirst({
    where: { form_id: formMaster.form_id, section_name: sectionName },
  });
  if (section) {
    section = await prisma.sectionMaster.update({
      where: { section_id: section.section_id },
      data: { display_order: 1 },
    });
  } else {
    section = await prisma.sectionMaster.create({
      data: {
        form_id: formMaster.form_id,
        section_name: sectionName,
        display_order: 1,
      },
    });
  }

  // 4. SubsectionMaster
  let subsection = await prisma.subsectionMaster.findFirst({
    where: { section_id: section.section_id, subsection_name: subsectionName },
  });
  if (!subsection) {
    subsection = await prisma.subsectionMaster.create({
      data: {
        section_id: section.section_id,
        subsection_name: subsectionName,
      },
    });
  }

  // 5. ParameterCategory
  let category = await prisma.parameterCategory.findFirst({
    where: { category_name: 'General' },
  });
  if (!category) {
    category = await prisma.parameterCategory.create({
      data: { category_name: 'General' },
    });
  }

  // 6. Parameters
  for (let i = 0; i < parameters.length; i++) {
    const p = parameters[i];
    await prisma.parameterMaster.upsert({
      where: {
        subsection_id_field_key: {
          subsection_id: subsection.subsection_id,
          field_key: p.field_key,
        },
      },
      update: {
        label: p.label,
        field_type: p.field_type,
        control_type: p.control_type,
        display_order: i + 1,
        options: p.options || null,
        mandatory: p.mandatory,
        validation_rule: p.validation_rule || null,
        category_id: category.category_id,
      },
      create: {
        subsection_id: subsection.subsection_id,
        category_id: category.category_id,
        field_key: p.field_key,
        label: p.label,
        field_type: p.field_type,
        control_type: p.control_type,
        display_order: i + 1,
        options: p.options || null,
        mandatory: p.mandatory,
        validation_rule: p.validation_rule || null,
      },
    });
  }

  // 7. WorkflowMaster rules
  const defaultTransitions = [
    { trigger: 'draft', action: 'submitted', stage: 'citizen' },
    { trigger: 'submitted', action: 'coordinator_approved', stage: 'coordinator_area' },
    { trigger: 'submitted', action: 'coordinator_approved', stage: 'coordinator_general' },
    { trigger: 'submitted', action: 'rejected', stage: 'coordinator_area' },
    { trigger: 'submitted', action: 'rejected', stage: 'coordinator_general' },
    { trigger: 'coordinator_approved', action: 'approved', stage: 'director' },
    { trigger: 'coordinator_approved', action: 'approved', stage: 'admin' },
    { trigger: 'coordinator_approved', action: 'rejected', stage: 'director' },
    { trigger: 'coordinator_approved', action: 'rejected', stage: 'admin' },
  ];

  for (const tr of defaultTransitions) {
    const existingWf = await prisma.workflowMaster.findFirst({
      where: {
        entity_type_id: entityType.entity_type_id,
        trigger: tr.trigger,
        action: tr.action,
        stage: tr.stage,
      },
    });
    if (!existingWf) {
      await prisma.workflowMaster.create({
        data: {
          entity_type_id: entityType.entity_type_id,
          trigger: tr.trigger,
          action: tr.action,
          stage: tr.stage,
        },
      });
    }
  }

  return { entityType, formMaster };
}

(async () => {
  try {
    // ── 0. Ensure Domain exists ──
    let domain = await prisma.domain.findFirst({ where: { domain_name: 'Civic Operations' } });
    if (!domain) {
      domain = await prisma.domain.findFirst();
    }
    if (!domain) {
      domain = await prisma.domain.create({
        data: { domain_name: 'Civic Operations', description: 'Civic governance domain' },
      });
    }

    // ── 1. Seed All 7 Modules (EntityTypes, FormMasters, Sections, Subsections, Parameters) ──
    const modulesToSeed = [
      {
        entityTypeName: 'Movement',
        entityTypeDescription: 'Citizen movement submission and tracking',
        formName: 'Movement Registration Form',
        sectionName: 'Basic Information',
        subsectionName: 'Identity',
        parameters: [
          { field_key: 'title', label: 'Movement Title', field_type: 'text', control_type: 'input', mandatory: true, validation_rule: 'required|max:100' },
          { field_key: 'description', label: 'Description', field_type: 'textarea', control_type: 'textarea', mandatory: true, validation_rule: 'required' },
          { field_key: 'area', label: 'Area', field_type: 'select', control_type: 'dropdown', options: { choices: ['Sector 5', 'Sector 12', 'Unassigned'] }, mandatory: true, validation_rule: 'required' },
          { field_key: 'landmark', label: 'Landmark', field_type: 'text', control_type: 'input', mandatory: false, validation_rule: 'max:160' },
          { field_key: 'reported_on', label: 'Reported Date', field_type: 'date', control_type: 'datepicker', mandatory: true, validation_rule: 'required|date' },
        ],
      },
      {
        entityTypeName: 'Grievance',
        entityTypeDescription: 'Automatically created or submitted grievance issue',
        formName: 'Grievance Submission Form',
        sectionName: 'Grievance Details',
        subsectionName: 'Complaint',
        parameters: [
          { field_key: 'complaint_details', label: 'Complaint Details', field_type: 'textarea', control_type: 'textarea', mandatory: true, validation_rule: 'required|min:20' },
          { field_key: 'category', label: 'Grievance Category', field_type: 'select', control_type: 'dropdown', options: { choices: ['Infrastructure', 'Sanitation', 'Safety', 'Utilities', 'Other'] }, mandatory: true, validation_rule: 'required' },
          { field_key: 'reference_number', label: 'Reference Number', field_type: 'text', control_type: 'input', mandatory: false, validation_rule: null },
        ],
      },
      {
        entityTypeName: 'Citizen Passport',
        entityTypeDescription: "Tracks a citizen's profile, skills, and contribution history across movements",
        formName: 'Citizen Passport Form',
        sectionName: 'Profile Details',
        subsectionName: 'Profile Information',
        parameters: [
          { field_key: 'full_name', label: 'Full Name', field_type: 'text', control_type: 'input', mandatory: true, validation_rule: 'required|max:100' },
          { field_key: 'skills', label: 'Skills', field_type: 'text', control_type: 'input', mandatory: false, validation_rule: null },
          { field_key: 'contribution_history', label: 'Contribution History', field_type: 'textarea', control_type: 'textarea', mandatory: false, validation_rule: null },
          { field_key: 'movements_joined', label: 'Movements Joined', field_type: 'number', control_type: 'input', mandatory: false, validation_rule: null },
          { field_key: 'volunteer_hours', label: 'Volunteer Hours', field_type: 'number', control_type: 'input', mandatory: false, validation_rule: null },
        ],
      },
      {
        entityTypeName: 'Digital Civic Constitution',
        entityTypeDescription: 'Establishes governance rules for a specific Movement',
        formName: 'Digital Civic Constitution Form',
        sectionName: 'Constitution Governance',
        subsectionName: 'Rules & Guidelines',
        parameters: [
          { field_key: 'constitution_title', label: 'Constitution Title', field_type: 'text', control_type: 'input', mandatory: true, validation_rule: 'required|max:150' },
          { field_key: 'core_values', label: 'Core Values', field_type: 'textarea', control_type: 'textarea', mandatory: true, validation_rule: 'required' },
          { field_key: 'rights_responsibilities', label: 'Rights & Responsibilities', field_type: 'textarea', control_type: 'textarea', mandatory: true, validation_rule: 'required' },
          { field_key: 'transparency_rules', label: 'Transparency Rules', field_type: 'textarea', control_type: 'textarea', mandatory: false, validation_rule: null },
          { field_key: 'participation_guidelines', label: 'Participation Guidelines', field_type: 'textarea', control_type: 'textarea', mandatory: false, validation_rule: null },
          { field_key: 'linked_movement_id', label: 'Linked Movement ID', field_type: 'text', control_type: 'input', mandatory: true, validation_rule: 'required' },
        ],
      },
      {
        entityTypeName: 'Employment Exchange',
        entityTypeDescription: 'Job postings tied to movement-generated needs',
        formName: 'Employment Exchange Form',
        sectionName: 'Job Details',
        subsectionName: 'Posting Information',
        parameters: [
          { field_key: 'job_title', label: 'Job Title', field_type: 'text', control_type: 'input', mandatory: true, validation_rule: 'required|max:100' },
          { field_key: 'description', label: 'Description', field_type: 'textarea', control_type: 'textarea', mandatory: true, validation_rule: 'required' },
          { field_key: 'required_skills', label: 'Required Skills', field_type: 'text', control_type: 'input', mandatory: false, validation_rule: null },
          { field_key: 'location', label: 'Location', field_type: 'text', control_type: 'input', mandatory: true, validation_rule: 'required' },
          { field_key: 'posted_by', label: 'Posted By', field_type: 'text', control_type: 'input', mandatory: true, validation_rule: 'required' },
          { field_key: 'status', label: 'Status', field_type: 'select', control_type: 'dropdown', options: { choices: ['Open', 'Closed'], default: 'Open' }, mandatory: false, validation_rule: null },
        ],
      },
      {
        entityTypeName: 'Volunteer Management',
        entityTypeDescription: 'Volunteer registry and task assignment for a movement',
        formName: 'Volunteer Management Form',
        sectionName: 'Volunteer Details',
        subsectionName: 'Assignment Information',
        parameters: [
          { field_key: 'volunteer_name', label: 'Volunteer Name', field_type: 'text', control_type: 'input', mandatory: true, validation_rule: 'required|max:100' },
          { field_key: 'linked_movement_id', label: 'Linked Movement ID', field_type: 'text', control_type: 'input', mandatory: true, validation_rule: 'required' },
          { field_key: 'role_task_assigned', label: 'Role/Task Assigned', field_type: 'text', control_type: 'input', mandatory: false, validation_rule: null },
          { field_key: 'availability', label: 'Availability', field_type: 'text', control_type: 'input', mandatory: false, validation_rule: null },
          { field_key: 'status', label: 'Status', field_type: 'select', control_type: 'dropdown', options: { choices: ['Registered', 'Active', 'Completed'], default: 'Registered' }, mandatory: false, validation_rule: null },
        ],
      },
      {
        entityTypeName: 'Legacy & Continuity',
        entityTypeDescription: 'Tracks what a movement becomes after it concludes',
        formName: 'Legacy & Continuity Form',
        sectionName: 'Continuity Planning',
        subsectionName: 'Legacy Overview',
        parameters: [
          { field_key: 'linked_movement_id', label: 'Linked Movement ID', field_type: 'text', control_type: 'input', mandatory: true, validation_rule: 'required' },
          { field_key: 'continuity_type', label: 'Continuity Type', field_type: 'select', control_type: 'dropdown', options: { choices: ['NGO', 'Startup', 'Research Center', 'Other'] }, mandatory: true, validation_rule: 'required' },
          { field_key: 'description', label: 'Description', field_type: 'textarea', control_type: 'textarea', mandatory: true, validation_rule: 'required' },
          { field_key: 'status', label: 'Status', field_type: 'select', control_type: 'dropdown', options: { choices: ['Proposed', 'In Progress', 'Established'], default: 'Proposed' }, mandatory: false, validation_rule: null },
        ],
      },
    ];

    for (const mod of modulesToSeed) {
      const seeded = await seedModule({ ...mod, domain_id: domain.domain_id });
      console.log(`Seeded module: "${mod.entityTypeName}" -> Form ID: ${seeded.formMaster.form_id}`);
    }

    // ── 2. Seed EntityRelationshipRule (Movement approved -> Auto-creates Grievance) ──
    const movementType = await prisma.entityType.findFirst({ where: { name: 'Movement' } });
    const grievanceType = await prisma.entityType.findFirst({ where: { name: 'Grievance' } });
    if (movementType && grievanceType) {
      const existingRule = await prisma.entityRelationshipRule.findFirst({
        where: {
          source_entity_type_id: movementType.entity_type_id,
          target_entity_type_id: grievanceType.entity_type_id,
          event: 'approved',
        },
      });
      if (!existingRule) {
        await prisma.entityRelationshipRule.create({
          data: {
            source_entity_type_id: movementType.entity_type_id,
            target_entity_type_id: grievanceType.entity_type_id,
            event: 'approved',
            auto_create: true,
            auto_approve: false,
          },
        });
        console.log('Seeded EntityRelationshipRule: Movement (approved) -> Grievance');
      }
    }

    // ── 3. Seed ReportMaster Definitions for Reference Modules ──
    const employmentType = await prisma.entityType.findFirst({ where: { name: 'Employment Exchange' } });

    const sampleReports = [
      {
        entityType: movementType,
        name: 'Movement Status Summary',
        output_format: 'grouped_count',
        filters: JSON.stringify({ groupBy: 'status', metric: 'COUNT', public_stats: true }),
      },
      {
        entityType: grievanceType,
        name: 'Grievances by Area',
        output_format: 'grouped_count',
        filters: JSON.stringify({ groupBy: 'area', metric: 'COUNT', public_stats: true }),
      },
      {
        entityType: employmentType,
        name: 'Applications by Status',
        output_format: 'grouped_count',
        filters: JSON.stringify({ groupBy: 'status', metric: 'COUNT', public_stats: true }),
      },
    ];

    for (const r of sampleReports) {
      if (r.entityType) {
        const existingRpt = await prisma.reportMaster.findFirst({
          where: { entity_type_id: r.entityType.entity_type_id, report_name: r.name },
        });
        if (!existingRpt) {
          await prisma.reportMaster.create({
            data: {
              entity_type_id: r.entityType.entity_type_id,
              report_name: r.name,
              output_format: r.output_format,
              filters: r.filters,
            },
          });
          console.log(`Seeded ReportMaster: "${r.name}" for ${r.entityType.name}`);
        }
      }
    }

    // ── 3. Seed Users & Tokens ──
    const users = [
      { name: 'Demo Citizen', email: 'demo.citizen@example.com', password: 'Password123', role: 'citizen' },
      { name: 'Demo Coordinator Area', email: 'demo.coord.area@example.com', password: 'Password123', role: 'coordinator_area', assignedArea: 'Sector 5' },
      { name: 'Demo Coordinator General', email: 'demo.coord.general@example.com', password: 'Password123', role: 'coordinator_general' },
      { name: 'Demo Director', email: 'demo.director@example.com', password: 'Password123', role: 'director' },
      { name: 'Demo Admin', email: 'demo.admin@example.com', password: 'Password123', role: 'admin' },
    ];

    const created = {};
    for (const u of users) {
      const user = await upsertUser(u);
      created[u.email] = {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
        assignedArea: user.assignedArea || null,
        token: signTokenFor(user),
      };
    }

    fs.writeFileSync('seed-tokens.json', JSON.stringify(created, null, 2));
    console.log('Seed complete. Tokens written to seed-tokens.json');

    // ── 4. Create sample demo entity ──
    const citizen = await prisma.user.findUnique({ where: { email: 'demo.citizen@example.com' } });
    if (citizen && movementType) {
      const existingEntity = await prisma.entity.findFirst({
        where: { name: 'Seeded Movement', owner_user_id: citizen.user_id },
      });
      if (!existingEntity) {
        const entity = await prisma.entity.create({
          data: {
            entity_type_id: movementType.entity_type_id,
            owner_user_id: citizen.user_id,
            name: 'Seeded Movement',
            location: 'Bengaluru',
            area: 'Sector 5',
            status: 'draft',
          },
        });
        console.log('Created demo entity id=', entity.entity_id);
      }
    }

    await prisma.$disconnect();
  } catch (err) {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  }
})();
