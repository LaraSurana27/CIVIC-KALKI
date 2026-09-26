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

    // ── 6. Seed Donation Governance Intelligence module ──
    await seedGovernanceModule(domain.domain_id);

    await prisma.$disconnect();
  } catch (err) {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  }
})();

// ════════════════════════════════════════════════════════════════════════════
//  GOVERNANCE INTELLIGENCE — Donation Transaction module seed
//  All metadata-driven: EntityType / FormMaster / WorkflowMaster / ReportMaster
//  / DashboardMaster / 18 seed entities. No donation-specific code.
// ════════════════════════════════════════════════════════════════════════════

async function seedGovernanceModule(domainId) {
  console.log('\n── Seeding Governance Intelligence module ──');

  // ── Step 1: EntityType ──────────────────────────────────────────────────
  let donationType = await prisma.entityType.findFirst({
    where: { name: 'Donation Transaction' },
  });
  if (!donationType) {
    donationType = await prisma.entityType.create({
      data: {
        domain_id: domainId,
        name: 'Donation Transaction',
        description:
          'Illustrative governance simulation — contribution transaction tracking. ' +
          'All data is synthetic and does not represent any real individual or institution.',
      },
    });
    console.log(`  Created EntityType: ${donationType.name} (id=${donationType.entity_type_id})`);
  }

  const etId = donationType.entity_type_id;

  // ── Step 2: FormMaster + Sections + Subsections + Parameters ───────────
  let form = await prisma.formMaster.findFirst({ where: { entity_type_id: etId } });
  if (!form) {
    form = await prisma.formMaster.create({
      data: { entity_type_id: etId, form_name: 'Donation Transaction Form', version: '1.0', status: 'active' },
    });
  }

  // Look up the default ParameterCategory (id=1, created by earlier seed modules)
  let cat = await prisma.parameterCategory.findFirst();
  if (!cat) {
    cat = await prisma.parameterCategory.create({ data: { category_name: 'General' } });
  }
  const catId = cat.category_id;

  // Helper: upsert section → subsection → parameters
  const SECTIONS = [
    {
      name: 'Transaction Record',
      order: 1,
      subsection: 'Transaction Details',
      params: [
        { key: 'donor_reference',   label: 'Donor Reference Code',  type: 'text',   ctrl: 'input',     order: 1, mandatory: true  },
        { key: 'amount',            label: 'Transaction Amount',     type: 'number', ctrl: 'input',     order: 2, mandatory: true  },
        { key: 'transaction_date',  label: 'Date of Transaction',    type: 'date',   ctrl: 'datepicker',order: 3, mandatory: true  },
        {
          key: 'payment_method',    label: 'Payment Method',         type: 'select', ctrl: 'dropdown',  order: 4,
          options: { choices: ['Cash', 'Cheque', 'NEFT', 'RTGS', 'DD', 'UPI'] },
        },
      ],
    },
    {
      name: 'Verification & Reconciliation',
      order: 2,
      subsection: 'Verification Details',
      params: [
        { key: 'receipt_reference',      label: 'Official Receipt Reference', type: 'text',   ctrl: 'input',    order: 1 },
        {
          key: 'verification_status',    label: 'Verification Status',        type: 'select', ctrl: 'dropdown', order: 2,
          // "Pending" = default / not yet verified; "Verified" = human-confirmed; "Failed" = process failure; "Disputed" = contested
          options: { choices: ['Pending', 'Verified', 'Failed', 'Disputed'], default: 'Pending' },
        },
        { key: 'bank_reference',         label: 'Bank Reference / UTR',       type: 'text',   ctrl: 'input',    order: 3 },
        {
          key: 'reconciliation_status',  label: 'Reconciliation Status',      type: 'select', ctrl: 'dropdown', order: 4,
          // ALL values used by state-sync rules are present here:
          // "Unresolved" → expected at recorded/verified stages
          // "Reconciled" → expected at reconciled/audited/closed stages
          // "Closed"     → valid final sub-state at closed stage
          // "Exception"  → anomaly sub-state (does not match any workflow stage)
          options: { choices: ['Unresolved', 'Reconciled', 'Exception', 'Closed'], default: 'Unresolved' },
        },
      ],
    },
  ];

  const paramIds = {}; // field_key → parameter_id
  for (const sec of SECTIONS) {
    let section = await prisma.sectionMaster.findFirst({ where: { form_id: form.form_id, section_name: sec.name } });
    if (!section) {
      section = await prisma.sectionMaster.create({
        data: { form_id: form.form_id, section_name: sec.name, display_order: sec.order },
      });
    }
    let subsec = await prisma.subsectionMaster.findFirst({ where: { section_id: section.section_id, subsection_name: sec.subsection } });
    if (!subsec) {
      subsec = await prisma.subsectionMaster.create({
        data: { section_id: section.section_id, subsection_name: sec.subsection },
      });
    }
    for (const p of sec.params) {
      let param = await prisma.parameterMaster.findFirst({ where: { subsection_id: subsec.subsection_id, field_key: p.key } });
      if (!param) {
        param = await prisma.parameterMaster.create({
          data: {
            subsection_id: subsec.subsection_id,
            category_id: catId,
            field_key: p.key,
            label: p.label,
            field_type: p.type,
            control_type: p.ctrl,
            display_order: p.order || 0,
            options: p.options || null,
            mandatory: p.mandatory || false,
          },
        });
      }
      paramIds[p.key] = param.parameter_id;
    }
  }
  console.log('  Form + parameters seeded.');

  // ── Step 3: WorkflowMaster (8 transitions, custom stages) ──────────────
  // Entity.status is authoritative. Stages: recorded → verified → reconciled → audited → closed
  const workflows = [
    { trigger: 'recorded',    action: 'verified',    stage: 'coordinator_area'    },
    { trigger: 'recorded',    action: 'verified',    stage: 'coordinator_general' },
    { trigger: 'verified',    action: 'reconciled',  stage: 'director'            },
    { trigger: 'verified',    action: 'reconciled',  stage: 'admin'               },
    { trigger: 'reconciled',  action: 'audited',     stage: 'director'            },
    { trigger: 'reconciled',  action: 'audited',     stage: 'admin'               },
    { trigger: 'audited',     action: 'closed',      stage: 'director'            },
    { trigger: 'audited',     action: 'closed',      stage: 'admin'               },
  ];
  for (const wf of workflows) {
    const existing = await prisma.workflowMaster.findFirst({
      where: { entity_type_id: etId, trigger: wf.trigger, action: wf.action, stage: wf.stage },
    });
    if (!existing) {
      await prisma.workflowMaster.create({ data: { entity_type_id: etId, ...wf } });
    }
  }
  console.log('  WorkflowMaster (8 transitions) seeded.');

  // ── Step 4: ReportMaster — 3 display reports + 1 governance config ──────
  const reports = [
    {
      name: 'Transactions by Verification Status',
      output_format: 'grouped_count',
      filters: JSON.stringify({ groupBy: 'verification_status', metric: 'COUNT', fieldKey: 'verification_status', public_stats: false }),
    },
    {
      name: 'Unreconciled Transactions',
      output_format: 'table',
      filters: JSON.stringify({ where: { reconciliation_status: 'Unresolved' }, fieldKey: 'reconciliation_status', public_stats: false }),
    },
    {
      name: 'Audit Exceptions Summary',
      output_format: 'grouped_count',
      filters: JSON.stringify({ groupBy: 'status', metric: 'COUNT', public_stats: false }),
    },
    {
      // Governance exception rule config — read by governanceIntelligence.js at runtime
      name: 'Governance Exception Config',
      output_format: 'config',
      filters: JSON.stringify({
        exception_rules: [
          {
            rule_id: 'VERIFICATION_STALE_7_DAYS',
            label: 'Stale Verification',
            field_key: 'verification_status',
            expected_value: 'Pending',
            threshold_days: 7,
            severity: 'High',
            requires_human_review: true,
          },
          {
            rule_id: 'RECONCILIATION_UNRESOLVED',
            label: 'Unresolved Reconciliation',
            field_key: 'reconciliation_status',
            expected_value: 'Unresolved',
            not_in_stages: ['recorded', 'verified'],
            threshold_days: null,
            severity: 'Medium',
            requires_human_review: true,
          },
          {
            rule_id: 'WORKFLOW_STALE_NO_ACTIVITY',
            label: 'No Workflow Activity',
            field_key: null,
            expected_value: null,
            threshold_days: null,
            severity: 'Medium',
            requires_human_review: true,
          },
          {
            rule_id: 'VERIFICATION_FAILED',
            label: 'Verification Failure',
            field_key: 'verification_status',
            expected_value: 'Failed',
            threshold_days: null,
            severity: 'High',
            requires_human_review: true,
          },
          {
            rule_id: 'STATE_PARAMETER_MISMATCH',
            label: 'State–Parameter Mismatch',
            field_key: null,
            expected_value: null,
            threshold_days: null,
            severity: 'High',
            requires_human_review: true,
          },
          {
            rule_id: 'HUMAN_TRANSITION_NO_ACTOR',
            label: 'Anonymous Human Transition',
            field_key: null,
            expected_value: null,
            threshold_days: null,
            severity: 'Medium',
            requires_human_review: true,
          },
        ],
        // State sync rules: Entity.status is authoritative, these define expected ParameterValues per stage
        state_sync_rules: {
          recorded:    { verification_status: ['Pending', 'Failed', 'Disputed'] },
          verified:    { verification_status: ['Verified'], reconciliation_status: ['Unresolved', 'Reconciled'] },
          reconciled:  { verification_status: ['Verified'], reconciliation_status: ['Reconciled'] },
          audited:     { verification_status: ['Verified'], reconciliation_status: ['Reconciled'] },
          closed:      { verification_status: ['Verified'], reconciliation_status: ['Reconciled', 'Closed'] },
        },
        workflow_stages: ['recorded', 'verified', 'reconciled', 'audited', 'closed'],
        // System actions that legitimately have actor_user_id=null
        system_action_patterns: ['auto_created', 'system_init', 'seed_created', 'seed'],
      }),
    },
  ];
  for (const r of reports) {
    const existing = await prisma.reportMaster.findFirst({ where: { entity_type_id: etId, report_name: r.name } });
    if (!existing) {
      await prisma.reportMaster.create({ data: { entity_type_id: etId, report_name: r.name, output_format: r.output_format, filters: r.filters } });
    }
  }
  console.log('  ReportMaster (4: 3 display + 1 config) seeded.');

  // ── Step 5: DashboardMaster — stakeholder config ────────────────────────
  const existingStakeholderCfg = await prisma.dashboardMaster.findFirst({
    where: { entity_type_id: etId, widget_name: 'governance_stakeholder_config' },
  });
  if (!existingStakeholderCfg) {
    await prisma.dashboardMaster.create({
      data: {
        entity_type_id: etId,
        widget_name: 'governance_stakeholder_config',
        metric: 'config',
        display_type: 'config',
        filter: JSON.stringify({
          stakeholders: [
            {
              stakeholder: 'Receiving Institution [Simulation]',
              interest: 'Accurate recording and acknowledgment of received contributions',
              concern: 'Verification failures and reconciliation gaps create accountability exposure',
              relevant_process: 'Verification stage (recorded → verified)',
            },
            {
              stakeholder: 'Oversight Authority [Simulation]',
              interest: 'Audit trail completeness and process integrity',
              concern: 'Transactions remaining in recorded status beyond expected timeframe signal process weakness',
              relevant_process: 'Full pipeline audit (recorded → closed)',
            },
            {
              stakeholder: 'Fund Manager [Simulation]',
              interest: 'Bank reconciliation accuracy and exception resolution',
              concern: 'Unresolved reconciliation in post-verification stages indicates control gap',
              relevant_process: 'Reconciliation stage (verified → reconciled)',
            },
          ],
        }),
      },
    });
  }
  console.log('  DashboardMaster stakeholder config seeded.');

  // ── Step 6: Seed 18 simulation entities ─────────────────────────────────
  // Check idempotency: skip if entities already exist
  const existingCount = await prisma.entity.count({ where: { entity_type_id: etId } });
  if (existingCount >= 18) {
    console.log(`  Entities already seeded (${existingCount} found). Skipping entity seed.`);
    return;
  }

  const now = new Date();
  const daysAgo = (n) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000);

  // Seed data plan — designed to exercise all 6 exception rules
  // Entity.status = authoritative workflow state
  // verification_status, reconciliation_status = synchronized ParameterValues
  const SEED_ENTITIES = [
    // ── Status: recorded ── (4 entities)
    {
      name: 'DON-SIM-001 [Simulation]', status: 'recorded', area: 'Zone A',
      params: { donor_reference: 'REF-001-SIM', amount: '50000', transaction_date: '2024-01-10', payment_method: 'NEFT', receipt_reference: 'REC-001', verification_status: 'Pending', bank_reference: '', reconciliation_status: 'Unresolved' },
      // VERIFICATION_STALE_7_DAYS: Pending for 15 days
      auditDateOffset: 15, action: 'seed_created',
    },
    {
      name: 'DON-SIM-002 [Simulation]', status: 'recorded', area: 'Zone B',
      params: { donor_reference: 'REF-002-SIM', amount: '75000', transaction_date: '2024-01-12', payment_method: 'Cheque', receipt_reference: 'REC-002', verification_status: 'Pending', bank_reference: '', reconciliation_status: 'Unresolved' },
      // VERIFICATION_STALE_7_DAYS: Pending for 12 days
      auditDateOffset: 12, action: 'seed_created',
    },
    {
      name: 'DON-SIM-003 [Simulation]', status: 'recorded', area: 'Zone A',
      params: { donor_reference: 'REF-003-SIM', amount: '30000', transaction_date: '2024-01-14', payment_method: 'Cash', receipt_reference: 'REC-003', verification_status: 'Failed', bank_reference: '', reconciliation_status: 'Unresolved' },
      // VERIFICATION_FAILED: verification_status = Failed
      auditDateOffset: 5, action: 'seed_created',
    },
    {
      name: 'DON-SIM-004 [Simulation]', status: 'recorded', area: 'Zone C',
      params: { donor_reference: 'REF-004-SIM', amount: '20000', transaction_date: '2024-01-20', payment_method: 'UPI', receipt_reference: '', verification_status: 'Pending', bank_reference: '', reconciliation_status: 'Unresolved' },
      // WORKFLOW_STALE_NO_ACTIVITY: no status_transition audit entries (only seed_created)
      auditDateOffset: 2, action: 'seed_created', noTransitions: true,
    },

    // ── Status: verified ── (4 entities, normal at this stage)
    {
      name: 'DON-SIM-005 [Simulation]', status: 'verified', area: 'Zone B',
      params: { donor_reference: 'REF-005-SIM', amount: '100000', transaction_date: '2024-01-05', payment_method: 'RTGS', receipt_reference: 'REC-005', verification_status: 'Verified', bank_reference: 'UTR-005-SIM', reconciliation_status: 'Unresolved' },
      auditDateOffset: 20, action: 'status_transition', hasTransition: true,
    },
    {
      name: 'DON-SIM-006 [Simulation]', status: 'verified', area: 'Zone A',
      params: { donor_reference: 'REF-006-SIM', amount: '45000', transaction_date: '2024-01-06', payment_method: 'NEFT', receipt_reference: 'REC-006', verification_status: 'Verified', bank_reference: 'UTR-006-SIM', reconciliation_status: 'Unresolved' },
      auditDateOffset: 18, action: 'status_transition', hasTransition: true,
    },
    {
      name: 'DON-SIM-007 [Simulation]', status: 'verified', area: 'Zone C',
      params: { donor_reference: 'REF-007-SIM', amount: '60000', transaction_date: '2024-01-08', payment_method: 'DD', receipt_reference: 'REC-007', verification_status: 'Verified', bank_reference: 'UTR-007-SIM', reconciliation_status: 'Reconciled' },
      auditDateOffset: 16, action: 'status_transition', hasTransition: true,
    },
    {
      name: 'DON-SIM-008 [Simulation]', status: 'verified', area: 'Zone B',
      params: { donor_reference: 'REF-008-SIM', amount: '35000', transaction_date: '2024-01-09', payment_method: 'Cheque', receipt_reference: 'REC-008', verification_status: 'Verified', bank_reference: 'UTR-008-SIM', reconciliation_status: 'Unresolved' },
      auditDateOffset: 14, action: 'status_transition', hasTransition: true,
    },

    // ── Status: reconciled ── (4 entities)
    {
      name: 'DON-SIM-009 [Simulation]', status: 'reconciled', area: 'Zone A',
      params: { donor_reference: 'REF-009-SIM', amount: '90000', transaction_date: '2024-01-03', payment_method: 'RTGS', receipt_reference: 'REC-009', verification_status: 'Verified', bank_reference: 'UTR-009-SIM', reconciliation_status: 'Reconciled' },
      auditDateOffset: 25, action: 'status_transition', hasTransition: true,
    },
    {
      name: 'DON-SIM-010 [Simulation]', status: 'reconciled', area: 'Zone B',
      params: { donor_reference: 'REF-010-SIM', amount: '55000', transaction_date: '2024-01-04', payment_method: 'NEFT', receipt_reference: 'REC-010', verification_status: 'Verified', bank_reference: 'UTR-010-SIM', reconciliation_status: 'Unresolved' },
      // STATE_PARAMETER_MISMATCH: status=reconciled but reconciliation_status=Unresolved
      auditDateOffset: 22, action: 'status_transition', hasTransition: true,
    },
    {
      name: 'DON-SIM-011 [Simulation]', status: 'reconciled', area: 'Zone C',
      params: { donor_reference: 'REF-011-SIM', amount: '40000', transaction_date: '2024-01-04', payment_method: 'UPI', receipt_reference: 'REC-011', verification_status: 'Verified', bank_reference: 'UTR-011-SIM', reconciliation_status: 'Reconciled' },
      auditDateOffset: 20, action: 'status_transition', hasTransition: true,
    },
    {
      name: 'DON-SIM-012 [Simulation]', status: 'reconciled', area: 'Zone A',
      params: { donor_reference: 'REF-012-SIM', amount: '80000', transaction_date: '2024-01-02', payment_method: 'DD', receipt_reference: 'REC-012', verification_status: 'Verified', bank_reference: 'UTR-012-SIM', reconciliation_status: 'Reconciled' },
      auditDateOffset: 28, action: 'status_transition', hasTransition: true,
    },

    // ── Status: audited ── (3 entities, all normal)
    {
      name: 'DON-SIM-013 [Simulation]', status: 'audited', area: 'Zone B',
      params: { donor_reference: 'REF-013-SIM', amount: '120000', transaction_date: '2023-12-28', payment_method: 'RTGS', receipt_reference: 'REC-013', verification_status: 'Verified', bank_reference: 'UTR-013-SIM', reconciliation_status: 'Reconciled' },
      auditDateOffset: 32, action: 'status_transition', hasTransition: true,
    },
    {
      name: 'DON-SIM-014 [Simulation]', status: 'audited', area: 'Zone A',
      params: { donor_reference: 'REF-014-SIM', amount: '65000', transaction_date: '2023-12-30', payment_method: 'NEFT', receipt_reference: 'REC-014', verification_status: 'Verified', bank_reference: 'UTR-014-SIM', reconciliation_status: 'Reconciled' },
      auditDateOffset: 30, action: 'status_transition', hasTransition: true,
    },
    {
      name: 'DON-SIM-015 [Simulation]', status: 'audited', area: 'Zone C',
      params: { donor_reference: 'REF-015-SIM', amount: '95000', transaction_date: '2023-12-29', payment_method: 'Cheque', receipt_reference: 'REC-015', verification_status: 'Verified', bank_reference: 'UTR-015-SIM', reconciliation_status: 'Reconciled' },
      auditDateOffset: 31, action: 'status_transition', hasTransition: true,
    },

    // ── Status: closed ── (3 entities)
    {
      name: 'DON-SIM-016 [Simulation]', status: 'closed', area: 'Zone A',
      params: { donor_reference: 'REF-016-SIM', amount: '200000', transaction_date: '2023-12-01', payment_method: 'RTGS', receipt_reference: 'REC-016', verification_status: 'Verified', bank_reference: 'UTR-016-SIM', reconciliation_status: 'Closed' },
      auditDateOffset: 55, action: 'status_transition', hasTransition: true,
    },
    {
      name: 'DON-SIM-017 [Simulation]', status: 'closed', area: 'Zone B',
      params: { donor_reference: 'REF-017-SIM', amount: '150000', transaction_date: '2023-12-05', payment_method: 'NEFT', receipt_reference: 'REC-017', verification_status: 'Verified', bank_reference: 'UTR-017-SIM', reconciliation_status: 'Reconciled' },
      auditDateOffset: 50, action: 'status_transition', hasTransition: true,
    },
    {
      name: 'DON-SIM-018 [Simulation]', status: 'closed', area: 'Zone C',
      params: { donor_reference: 'REF-018-SIM', amount: '175000', transaction_date: '2023-12-10', payment_method: 'DD', receipt_reference: 'REC-018', verification_status: 'Verified', bank_reference: 'UTR-018-SIM', reconciliation_status: 'Closed' },
      auditDateOffset: 45, action: 'status_transition', hasTransition: true,
    },
  ];

  for (const seed of SEED_ENTITIES) {
    const existing = await prisma.entity.findFirst({ where: { entity_type_id: etId, name: seed.name } });
    if (existing) continue;

    const entity = await prisma.entity.create({
      data: { entity_type_id: etId, name: seed.name, status: seed.status, area: seed.area || null },
    });

    // Seed ParameterValues
    for (const [fk, val] of Object.entries(seed.params)) {
      const pid = paramIds[fk];
      if (!pid || val === null || val === undefined) continue;
      await prisma.parameterValue.upsert({
        where: { entity_id_parameter_id: { entity_id: entity.entity_id, parameter_id: pid } },
        update: { value: String(val) },
        create: { entity_id: entity.entity_id, parameter_id: pid, value: String(val) },
      });
    }

    // Seed initial AuditLog (backdated to simulate age)
    const entryDate = daysAgo(seed.auditDateOffset || 0);
    await prisma.auditLog.create({
      data: {
        entity_id: entity.entity_id,
        actor_user_id: null,
        action: 'seed_created',
        user: 'system/seed',
        new_status: 'recorded',
        datetime: entryDate,
        reason: `Governance simulation seed: ${seed.name}`,
      },
    });

    // For entities that have had transitions, add status_transition log entries
    if (seed.hasTransition && seed.status !== 'recorded') {
      const stages = ['recorded', 'verified', 'reconciled', 'audited', 'closed'];
      const targetIdx = stages.indexOf(seed.status);
      for (let i = 0; i < targetIdx; i++) {
        const transDate = daysAgo(seed.auditDateOffset - (i + 1) * 4);
        await prisma.auditLog.create({
          data: {
            entity_id: entity.entity_id,
            actor_user_id: null,
            action: 'status_transition',
            user: 'system/seed',
            old_status: stages[i],
            new_status: stages[i + 1],
            datetime: transDate,
            reason: `Governance simulation: transition to ${stages[i + 1]}`,
          },
        });
      }
    }
  }

  console.log(`  Seeded 18 Donation Transaction entities (simulation).`);
  console.log('  Exceptions built-in: STALE×2, FAILED×1, NO_ACTIVITY×1, MISMATCH×1 = 5 deterministic exceptions');
  console.log('── Governance Intelligence module seeding complete.\n');
}

