/* Seed script: creates domain, 7 entity types with rich multi-section forms,
   demo users, workflows, and outputs JWTs to seed-tokens.json

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

/**
 * Seed a module with MULTIPLE sections, each with their own subsections and parameters.
 * This replaces the flat single-section seedModule and correctly populates the
 * FormMaster → Section → Subsection → Parameter hierarchy.
 */
async function seedModuleMultiSection({
  domain_id,
  entityTypeName,
  entityTypeDescription,
  formName,
  sections,
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

  // 3. ParameterCategory
  let category = await prisma.parameterCategory.findFirst({
    where: { category_name: 'General' },
  });
  if (!category) {
    category = await prisma.parameterCategory.create({
      data: { category_name: 'General' },
    });
  }

  // 4. Clean existing sections for this form (idempotent re-runs)
  const existingSections = await prisma.sectionMaster.findMany({
    where: { form_id: formMaster.form_id },
    include: { subsections: { include: { parameters: true } } },
  });
  for (const sec of existingSections) {
    for (const sub of sec.subsections) {
      const paramIds = sub.parameters.map(p => p.parameter_id);
      if (paramIds.length > 0) {
        await prisma.fileRepository.deleteMany({ where: { parameter_id: { in: paramIds } } });
        await prisma.parameterValue.deleteMany({ where: { parameter_id: { in: paramIds } } });
        await prisma.parameterMaster.deleteMany({ where: { parameter_id: { in: paramIds } } });
      }
    }
    await prisma.subsectionMaster.deleteMany({ where: { section_id: sec.section_id } });
  }
  await prisma.sectionMaster.deleteMany({ where: { form_id: formMaster.form_id } });

  // 5. Create sections, subsections and parameters
  for (let sIdx = 0; sIdx < sections.length; sIdx++) {
    const sec = sections[sIdx];

    const sectionMaster = await prisma.sectionMaster.create({
      data: {
        form_id: formMaster.form_id,
        section_name: sec.name,
        display_order: sIdx + 1,
      },
    });

    const subsections = sec.subsections || [{ name: 'Main', parameters: sec.parameters || [] }];

    for (const sub of subsections) {
      const subsectionMaster = await prisma.subsectionMaster.create({
        data: {
          section_id: sectionMaster.section_id,
          subsection_name: sub.name,
        },
      });

      const params = sub.parameters || [];
      for (let pIdx = 0; pIdx < params.length; pIdx++) {
        const p = params[pIdx];
        await prisma.parameterMaster.create({
          data: {
            subsection_id: subsectionMaster.subsection_id,
            category_id: category.category_id,
            field_key: p.field_key,
            label: p.label,
            field_type: p.field_type,
            control_type: p.control_type,
            display_order: pIdx + 1,
            options: p.options || null,
            mandatory: p.mandatory || false,
            validation_rule: p.validation_rule || null,
          },
        });
      }
    }
  }

  // 6. WorkflowMaster rules
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

// ════════════════════════════════════════════════════════════════════════════
//  MODULE DEFINITIONS — Rich, Multi-Section, Multi-Parameter Forms
// ════════════════════════════════════════════════════════════════════════════

const MODULE_DEFINITIONS = [
  // ── 1. Movement (Civic Initiative) ──────────────────────────────────────
  {
    entityTypeName: 'Movement',
    entityTypeDescription: 'Citizen movement submission and tracking',
    formName: 'Civic Initiative Registration Form',
    sections: [
      {
        name: 'About the Initiative',
        subsections: [
          {
            name: 'Main',
            parameters: [
              { field_key: 'initiative_description', label: 'Initiative Description', field_type: 'textarea', control_type: 'textarea', mandatory: true, validation_rule: 'required' },
              { field_key: 'initiative_type', label: 'Initiative Category / Type', field_type: 'select', control_type: 'dropdown', mandatory: true, validation_rule: 'required', options: { choices: ['Cleanliness', 'Environmental', 'Women Safety', 'Education Awareness', 'Health & Sanitation', 'Infrastructure', 'Digital Literacy', 'Other'] } },
            ],
          },
        ],
      },
      {
        name: 'Where is it?',
        subsections: [
          {
            name: 'Main',
            parameters: [],
          },
        ],
      },
      {
        name: 'Initiative Details',
        subsections: [
          {
            name: 'Main',
            parameters: [
              { field_key: 'problem_need', label: 'Problem / Need', field_type: 'textarea', control_type: 'textarea', mandatory: true, validation_rule: 'required' },
              { field_key: 'proposed_solution', label: 'Proposed Solution / Action', field_type: 'textarea', control_type: 'textarea', mandatory: true, validation_rule: 'required' },
              { field_key: 'key_objectives', label: 'Key Objectives', field_type: 'textarea', control_type: 'textarea', mandatory: true, validation_rule: 'required' },
              { field_key: 'expected_outcome', label: 'Expected Outcome', field_type: 'textarea', control_type: 'textarea', mandatory: false },
              { field_key: 'target_beneficiaries', label: 'Target Beneficiaries', field_type: 'text', control_type: 'input', mandatory: false },
            ],
          },
        ],
      },
      {
        name: 'Planning',
        subsections: [
          {
            name: 'Main',
            parameters: [
              { field_key: 'proposed_start_date', label: 'Proposed Start Date', field_type: 'date', control_type: 'datepicker', mandatory: false },
              { field_key: 'expected_duration', label: 'Expected Duration', field_type: 'text', control_type: 'input', mandatory: false },
              { field_key: 'estimated_budget', label: 'Estimated Budget', field_type: 'number', control_type: 'input', mandatory: false },
              { field_key: 'citizen_urgency', label: 'Citizen-assessed Urgency', field_type: 'select', control_type: 'dropdown', mandatory: false, options: { choices: ['Low', 'Normal', 'High', 'Critical'], default: 'Normal' } },
            ],
          },
        ],
      },
      {
        name: 'Volunteer Requirements',
        subsections: [
          {
            name: 'Main',
            parameters: [
              { field_key: 'requires_volunteers', label: 'Requires Volunteers?', field_type: 'select', control_type: 'dropdown', mandatory: false, options: { choices: ['No', 'Yes'], default: 'No' } },
              { field_key: 'volunteer_count', label: 'Expected Volunteer Count', field_type: 'number', control_type: 'input', mandatory: false, options: { depends_on: { field_key: 'requires_volunteers', value: 'Yes' } } },
              { field_key: 'volunteer_skills', label: 'Volunteer Skills Required', field_type: 'text', control_type: 'input', mandatory: false, options: { depends_on: { field_key: 'requires_volunteers', value: 'Yes' } } },
            ],
          },
        ],
      },
      {
        name: 'Supporting Material',
        subsections: [
          {
            name: 'Main',
            parameters: [
              { field_key: 'supporting_documents', label: 'Supporting Documents', field_type: 'file', control_type: 'file', mandatory: false },
              { field_key: 'reference_images', label: 'Photos / Reference Images', field_type: 'file', control_type: 'file', mandatory: false },
            ],
          },
        ],
      },
    ],
  },

  // ── 2. Grievance (Civic Problem) ────────────────────────────────────────
  {
    entityTypeName: 'Grievance',
    entityTypeDescription: 'Automatically created or submitted grievance issue',
    formName: 'Grievance Submission Form',
    sections: [
      {
        name: 'Grievance Details',
        subsections: [
          {
            name: 'Complaint',
            parameters: [
              { field_key: 'complaint_details', label: 'Complaint Details', field_type: 'textarea', control_type: 'textarea', mandatory: true, validation_rule: 'required|min:20' },
              { field_key: 'category', label: 'Grievance Category', field_type: 'select', control_type: 'dropdown', options: { choices: ['Infrastructure', 'Sanitation', 'Safety', 'Utilities', 'Public Transport', 'Water Supply', 'Noise Pollution', 'Other'] }, mandatory: true, validation_rule: 'required' },
              { field_key: 'severity', label: 'Severity', field_type: 'select', control_type: 'dropdown', options: { choices: ['Minor', 'Moderate', 'Severe', 'Critical'], default: 'Moderate' }, mandatory: true, validation_rule: 'required' },
            ],
          },
          {
            name: 'Reference',
            parameters: [
              { field_key: 'reference_number', label: 'Reference Number', field_type: 'text', control_type: 'input', mandatory: false },
              { field_key: 'date_of_incident', label: 'Date of Incident', field_type: 'date', control_type: 'datepicker', mandatory: false },
            ],
          },
        ],
      },
      {
        name: 'Contact Information',
        subsections: [
          {
            name: 'Reporter',
            parameters: [
              { field_key: 'reporter_name', label: 'Reporter Name', field_type: 'text', control_type: 'input', mandatory: true, validation_rule: 'required' },
              { field_key: 'reporter_phone', label: 'Reporter Phone', field_type: 'phone', control_type: 'input', mandatory: false },
              { field_key: 'reporter_email', label: 'Reporter Email', field_type: 'email', control_type: 'input', mandatory: false },
            ],
          },
        ],
      },
      {
        name: 'Evidence',
        subsections: [
          {
            name: 'Attachments',
            parameters: [
              { field_key: 'photo_evidence', label: 'Photo Evidence', field_type: 'file', control_type: 'file', mandatory: false },
              { field_key: 'supporting_document', label: 'Supporting Document', field_type: 'file', control_type: 'file', mandatory: false },
            ],
          },
        ],
      },
    ],
  },

  // ── 3. Citizen Passport ─────────────────────────────────────────────────
  {
    entityTypeName: 'Citizen Passport',
    entityTypeDescription: "Tracks a citizen's profile, skills, and contribution history across movements",
    formName: 'Citizen Passport Form',
    sections: [
      {
        name: 'Profile Details',
        subsections: [
          {
            name: 'Personal Information',
            parameters: [
              { field_key: 'full_name', label: 'Full Name', field_type: 'text', control_type: 'input', mandatory: true, validation_rule: 'required|max:100' },
              { field_key: 'date_of_birth', label: 'Date of Birth', field_type: 'date', control_type: 'datepicker', mandatory: false },
              { field_key: 'gender', label: 'Gender', field_type: 'select', control_type: 'dropdown', options: { choices: ['Male', 'Female', 'Non-Binary', 'Prefer Not to Say'] }, mandatory: false },
              { field_key: 'profile_email', label: 'Email Address', field_type: 'email', control_type: 'input', mandatory: false },
              { field_key: 'profile_phone', label: 'Phone Number', field_type: 'phone', control_type: 'input', mandatory: false },
            ],
          },
        ],
      },
      {
        name: 'Skills & Expertise',
        subsections: [
          {
            name: 'Capabilities',
            parameters: [
              { field_key: 'skills', label: 'Key Skills', field_type: 'text', control_type: 'input', mandatory: false },
              { field_key: 'education_level', label: 'Education Level', field_type: 'select', control_type: 'dropdown', options: { choices: ['High School', 'Diploma', 'Undergraduate', 'Postgraduate', 'Doctorate', 'Other'] }, mandatory: false },
              { field_key: 'professional_background', label: 'Professional Background', field_type: 'textarea', control_type: 'textarea', mandatory: false },
            ],
          },
        ],
      },
      {
        name: 'Civic Contribution',
        subsections: [
          {
            name: 'Track Record',
            parameters: [
              { field_key: 'contribution_history', label: 'Contribution History', field_type: 'textarea', control_type: 'textarea', mandatory: false },
              { field_key: 'movements_joined', label: 'Movements Joined', field_type: 'number', control_type: 'input', mandatory: false },
              { field_key: 'volunteer_hours', label: 'Total Volunteer Hours', field_type: 'number', control_type: 'input', mandatory: false },
              { field_key: 'civic_score', label: 'Civic Score', field_type: 'number', control_type: 'input', mandatory: false },
            ],
          },
        ],
      },
      {
        name: 'Documents',
        subsections: [
          {
            name: 'Verification',
            parameters: [
              { field_key: 'id_proof', label: 'ID Proof Document', field_type: 'file', control_type: 'file', mandatory: false },
              { field_key: 'profile_photo', label: 'Profile Photo', field_type: 'file', control_type: 'file', mandatory: false },
            ],
          },
        ],
      },
    ],
  },

  // ── 4. Digital Civic Constitution (Civic Charter) ────────────────────────
  {
    entityTypeName: 'Digital Civic Constitution',
    entityTypeDescription: 'Establishes governance rules for a specific Movement',
    formName: 'Digital Civic Constitution Form',
    sections: [
      {
        name: 'Constitution Governance',
        subsections: [
          {
            name: 'Charter Identity',
            parameters: [
              { field_key: 'constitution_title', label: 'Constitution Title', field_type: 'text', control_type: 'input', mandatory: true, validation_rule: 'required|max:150' },
              { field_key: 'linked_movement_id', label: 'Linked Movement ID', field_type: 'text', control_type: 'input', mandatory: true, validation_rule: 'required' },
              { field_key: 'effective_date', label: 'Effective Date', field_type: 'date', control_type: 'datepicker', mandatory: false },
            ],
          },
          {
            name: 'Core Principles',
            parameters: [
              { field_key: 'core_values', label: 'Core Values', field_type: 'textarea', control_type: 'textarea', mandatory: true, validation_rule: 'required' },
              { field_key: 'vision_statement', label: 'Vision Statement', field_type: 'textarea', control_type: 'textarea', mandatory: false },
              { field_key: 'mission_statement', label: 'Mission Statement', field_type: 'textarea', control_type: 'textarea', mandatory: false },
            ],
          },
        ],
      },
      {
        name: 'Rights & Governance',
        subsections: [
          {
            name: 'Rules & Guidelines',
            parameters: [
              { field_key: 'rights_responsibilities', label: 'Rights & Responsibilities', field_type: 'textarea', control_type: 'textarea', mandatory: true, validation_rule: 'required' },
              { field_key: 'transparency_rules', label: 'Transparency Rules', field_type: 'textarea', control_type: 'textarea', mandatory: false },
              { field_key: 'participation_guidelines', label: 'Participation Guidelines', field_type: 'textarea', control_type: 'textarea', mandatory: false },
              { field_key: 'accountability_mechanisms', label: 'Accountability Mechanisms', field_type: 'textarea', control_type: 'textarea', mandatory: false },
            ],
          },
        ],
      },
      {
        name: 'Documents',
        subsections: [
          {
            name: 'Attachments',
            parameters: [
              { field_key: 'charter_document', label: 'Charter Document', field_type: 'file', control_type: 'file', mandatory: false },
            ],
          },
        ],
      },
    ],
  },

  // ── 5. Employment Exchange ──────────────────────────────────────────────
  {
    entityTypeName: 'Employment Exchange',
    entityTypeDescription: 'Job postings tied to movement-generated needs',
    formName: 'Employment Exchange Form',
    sections: [
      {
        name: 'Job Details',
        subsections: [
          {
            name: 'Position Information',
            parameters: [
              { field_key: 'job_title', label: 'Job Title', field_type: 'text', control_type: 'input', mandatory: true, validation_rule: 'required|max:100' },
              { field_key: 'description', label: 'Job Description', field_type: 'textarea', control_type: 'textarea', mandatory: true, validation_rule: 'required' },
              { field_key: 'job_category', label: 'Job Category', field_type: 'select', control_type: 'dropdown', options: { choices: ['Full-Time', 'Part-Time', 'Contract', 'Volunteer', 'Internship'] }, mandatory: true, validation_rule: 'required' },
              { field_key: 'salary_range', label: 'Salary / Stipend Range', field_type: 'text', control_type: 'input', mandatory: false },
            ],
          },
        ],
      },
      {
        name: 'Requirements',
        subsections: [
          {
            name: 'Qualifications',
            parameters: [
              { field_key: 'required_skills', label: 'Required Skills', field_type: 'textarea', control_type: 'textarea', mandatory: false },
              { field_key: 'experience_level', label: 'Experience Level', field_type: 'select', control_type: 'dropdown', options: { choices: ['Entry Level', 'Mid Level', 'Senior Level', 'Expert'] }, mandatory: false },
              { field_key: 'education_required', label: 'Education Required', field_type: 'text', control_type: 'input', mandatory: false },
              { field_key: 'age_criteria', label: 'Age Criteria', field_type: 'text', control_type: 'input', mandatory: false },
            ],
          },
        ],
      },
      {
        name: 'Posting Details',
        subsections: [
          {
            name: 'Organization',
            parameters: [
              { field_key: 'posted_by', label: 'Posted By (Organization)', field_type: 'text', control_type: 'input', mandatory: true, validation_rule: 'required' },
              { field_key: 'contact_email', label: 'Contact Email', field_type: 'email', control_type: 'input', mandatory: false },
              { field_key: 'contact_phone', label: 'Contact Phone', field_type: 'phone', control_type: 'input', mandatory: false },
              { field_key: 'application_deadline', label: 'Application Deadline', field_type: 'date', control_type: 'datepicker', mandatory: false },
              { field_key: 'posting_status', label: 'Posting Status', field_type: 'select', control_type: 'dropdown', options: { choices: ['Open', 'Closed', 'On Hold'], default: 'Open' }, mandatory: false },
            ],
          },
        ],
      },
      {
        name: 'Documents',
        subsections: [
          {
            name: 'Attachments',
            parameters: [
              { field_key: 'job_description_file', label: 'Detailed Job Description (PDF)', field_type: 'file', control_type: 'file', mandatory: false },
            ],
          },
        ],
      },
    ],
  },

  // ── 6. Volunteer Management ─────────────────────────────────────────────
  {
    entityTypeName: 'Volunteer Management',
    entityTypeDescription: 'Volunteer registry and task assignment for a movement',
    formName: 'Volunteer Management Form',
    sections: [
      {
        name: 'Volunteer Details',
        subsections: [
          {
            name: 'Personal Info',
            parameters: [
              { field_key: 'volunteer_name', label: 'Volunteer Name', field_type: 'text', control_type: 'input', mandatory: true, validation_rule: 'required|max:100' },
              { field_key: 'volunteer_email', label: 'Email', field_type: 'email', control_type: 'input', mandatory: false },
              { field_key: 'volunteer_phone', label: 'Phone', field_type: 'phone', control_type: 'input', mandatory: false },
              { field_key: 'date_of_birth', label: 'Date of Birth', field_type: 'date', control_type: 'datepicker', mandatory: false },
            ],
          },
        ],
      },
      {
        name: 'Assignment',
        subsections: [
          {
            name: 'Task Details',
            parameters: [
              { field_key: 'linked_movement_id', label: 'Linked Movement ID', field_type: 'text', control_type: 'input', mandatory: true, validation_rule: 'required' },
              { field_key: 'role_task_assigned', label: 'Role / Task Assigned', field_type: 'text', control_type: 'input', mandatory: false },
              { field_key: 'skills_offered', label: 'Skills Offered', field_type: 'textarea', control_type: 'textarea', mandatory: false },
              { field_key: 'availability', label: 'Availability', field_type: 'select', control_type: 'dropdown', options: { choices: ['Weekdays', 'Weekends', 'Full-Time', 'Evenings Only', 'Flexible'] }, mandatory: false },
              { field_key: 'hours_committed', label: 'Hours Committed Per Week', field_type: 'number', control_type: 'input', mandatory: false },
              { field_key: 'volunteer_status', label: 'Status', field_type: 'select', control_type: 'dropdown', options: { choices: ['Registered', 'Active', 'On Leave', 'Completed'], default: 'Registered' }, mandatory: false },
            ],
          },
        ],
      },
      {
        name: 'Documents',
        subsections: [
          {
            name: 'Attachments',
            parameters: [
              { field_key: 'id_verification', label: 'ID Verification Document', field_type: 'file', control_type: 'file', mandatory: false },
            ],
          },
        ],
      },
    ],
  },

  // ── 7. Legacy & Continuity ──────────────────────────────────────────────
  {
    entityTypeName: 'Legacy & Continuity',
    entityTypeDescription: 'Tracks what a movement becomes after it concludes',
    formName: 'Legacy & Continuity Form',
    sections: [
      {
        name: 'Legacy Overview',
        subsections: [
          {
            name: 'Transition Details',
            parameters: [
              { field_key: 'linked_movement_id', label: 'Linked Movement ID', field_type: 'text', control_type: 'input', mandatory: true, validation_rule: 'required' },
              { field_key: 'continuity_type', label: 'Continuity Type', field_type: 'select', control_type: 'dropdown', options: { choices: ['NGO', 'Startup', 'Research Center', 'Cooperative', 'Government Program', 'Community Center', 'Other'] }, mandatory: true, validation_rule: 'required' },
              { field_key: 'description', label: 'Description', field_type: 'textarea', control_type: 'textarea', mandatory: true, validation_rule: 'required' },
              { field_key: 'transition_date', label: 'Planned Transition Date', field_type: 'date', control_type: 'datepicker', mandatory: false },
            ],
          },
        ],
      },
      {
        name: 'Impact & Sustainability',
        subsections: [
          {
            name: 'Outcomes',
            parameters: [
              { field_key: 'impact_summary', label: 'Impact Summary', field_type: 'textarea', control_type: 'textarea', mandatory: false },
              { field_key: 'people_impacted', label: 'People Impacted', field_type: 'number', control_type: 'input', mandatory: false },
              { field_key: 'sustainability_plan', label: 'Sustainability Plan', field_type: 'textarea', control_type: 'textarea', mandatory: false },
              { field_key: 'funding_source', label: 'Funding Source', field_type: 'text', control_type: 'input', mandatory: false },
              { field_key: 'legacy_status', label: 'Status', field_type: 'select', control_type: 'dropdown', options: { choices: ['Proposed', 'In Progress', 'Established', 'Archived'], default: 'Proposed' }, mandatory: false },
            ],
          },
        ],
      },
      {
        name: 'Documents',
        subsections: [
          {
            name: 'Attachments',
            parameters: [
              { field_key: 'transition_plan_doc', label: 'Transition Plan Document', field_type: 'file', control_type: 'file', mandatory: false },
              { field_key: 'impact_report', label: 'Impact Report', field_type: 'file', control_type: 'file', mandatory: false },
            ],
          },
        ],
      },
    ],
  },
];

// ════════════════════════════════════════════════════════════════════════════
//  MAIN
// ════════════════════════════════════════════════════════════════════════════

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

    // ── 1. Seed All 7 Modules ──
    for (const mod of MODULE_DEFINITIONS) {
      const seeded = await seedModuleMultiSection({ ...mod, domain_id: domain.domain_id });
      console.log(`Seeded module: "${mod.entityTypeName}" → Form ID: ${seeded.formMaster.form_id}`);
    }

    // ── 2. Seed EntityRelationshipRule (Movement approved → Auto-creates Grievance) ──
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
        console.log('Seeded EntityRelationshipRule: Movement (approved) → Grievance');
      }
    }

    // ── 3. Seed ReportMaster Definitions ──
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

    // ── 4. Seed Users & Tokens ──
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

    // ── 5. Create sample demo entity ──
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
