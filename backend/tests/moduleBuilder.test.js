const request = require('supertest');
const app = require('../index');
const prisma = require('../db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-change-me';

function generateTestToken(user) {
  return jwt.sign(
    {
      user_id: user.user_id,
      name: user.name,
      role: user.role,
      assigned_area: user.assignedArea || null,
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

describe('Phase 3A — No-Code Module Builder Metadata Generation Tests', () => {
  let citizenToken, coordinatorAreaToken, directorToken, adminToken;
  let citizenUser, coordinatorAreaUser, directorUser, adminUser;
  let grievanceEntityType;

  let deployedEntityTypeId;
  let deployedFormId;
  let deployedReportId;
  let createdEntities = [];

  const uniqueModuleName = `Park Renovation Request ${Date.now()}`;

  beforeAll(async () => {
    // 1. Fetch seed users
    citizenUser = await prisma.user.findFirst({ where: { role: 'citizen' } });
    coordinatorAreaUser = await prisma.user.findFirst({ where: { role: 'coordinator_area' } });
    directorUser = await prisma.user.findFirst({ where: { role: 'director' } });
    adminUser = await prisma.user.findFirst({ where: { role: 'admin' } });

    citizenToken = generateTestToken(citizenUser);
    coordinatorAreaToken = generateTestToken(coordinatorAreaUser);
    directorToken = generateTestToken(directorUser);
    adminToken = generateTestToken(adminUser);

    // 2. Fetch Grievance EntityType for automation rule testing
    grievanceEntityType = await prisma.entityType.findFirst({ where: { name: 'Grievance' } });
  });

  afterAll(async () => {
    // Clean up created entities
    for (const entId of createdEntities) {
      await prisma.parameterValue.deleteMany({ where: { entity_id: entId } });
      await prisma.approvalHistory.deleteMany({ where: { entity_id: entId } });
      await prisma.auditLog.deleteMany({ where: { entity_id: entId } });
      await prisma.entity.deleteMany({ where: { entity_id: entId } });
    }

    if (deployedEntityTypeId) {
      await prisma.reportMaster.deleteMany({ where: { entity_type_id: deployedEntityTypeId } });
      await prisma.workflowMaster.deleteMany({ where: { entity_type_id: deployedEntityTypeId } });
      await prisma.entityRelationshipRule.deleteMany({ where: { source_entity_type_id: deployedEntityTypeId } });

      const forms = await prisma.formMaster.findMany({ where: { entity_type_id: deployedEntityTypeId } });
      for (const f of forms) {
        const sections = await prisma.sectionMaster.findMany({ where: { form_id: f.form_id } });
        for (const s of sections) {
          const subs = await prisma.subsectionMaster.findMany({ where: { section_id: s.section_id } });
          for (const sub of subs) {
            await prisma.parameterMaster.deleteMany({ where: { subsection_id: sub.subsection_id } });
          }
          await prisma.subsectionMaster.deleteMany({ where: { section_id: s.section_id } });
        }
        await prisma.sectionMaster.deleteMany({ where: { form_id: f.form_id } });
      }
      await prisma.formMaster.deleteMany({ where: { entity_type_id: deployedEntityTypeId } });
      await prisma.entity.deleteMany({ where: { entity_type_id: deployedEntityTypeId } });
      await prisma.entityType.delete({ where: { entity_type_id: deployedEntityTypeId } });
    }
  });

  // ── Test 1 — Module metadata deployment ──
  test('Test 1: Module metadata deployment creates EntityType record', async () => {
    const payload = {
      module: {
        name: uniqueModuleName,
        description: 'End-to-end civic park renovation module',
        domain_id: 1,
      },
      form: {
        name: `${uniqueModuleName} Form`,
        sections: [
          {
            name: 'Request Details',
            parameters: [
              { field_key: 'area', label: 'Area', field_type: 'select', mandatory: true, options: ['Pune North', 'Pune South', 'Pune Central', 'Sector 5'] },
              { field_key: 'budget', label: 'Budget', field_type: 'number', mandatory: false },
              { field_key: 'renovation_notes', label: 'Notes', field_type: 'textarea', mandatory: false },
            ],
          },
        ],
      },
      workflow: {
        transitions: [
          { from_status: 'draft', to_status: 'submitted', role: 'citizen' },
          { from_status: 'submitted', to_status: 'verified', role: 'coordinator_area' },
          { from_status: 'verified', to_status: 'approved', role: 'director' },
        ],
      },
      rules: [
        {
          target_entity_type_id: grievanceEntityType.entity_type_id,
          event: 'approved',
          auto_create: true,
          auto_approve: false,
        },
      ],
      reports: [
        {
          report_name: `${uniqueModuleName} by Area`,
          output_format: 'grouped_count',
          filters: {
            groupBy: 'area',
            metric: 'COUNT',
            public_stats: true,
          },
        },
      ],
    };

    const res = await request(app)
      .post('/module-builder/deploy')
      .set('Authorization', `Bearer ${directorToken}`)
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('entityType');

    deployedEntityTypeId = res.body.data.entityType.entity_type_id;
    deployedFormId = res.body.data.formMaster.form_id;

    // Verify EntityType in database
    const savedType = await prisma.entityType.findUnique({ where: { entity_type_id: deployedEntityTypeId } });
    expect(savedType).not.toBeNull();
    expect(savedType.name).toBe(uniqueModuleName);
  });

  // ── Test 2 — Form metadata ──
  test('Test 2: FormMaster, SectionMaster, SubsectionMaster, and ParameterMaster are correctly created', async () => {
    const form = await prisma.formMaster.findFirst({
      where: { entity_type_id: deployedEntityTypeId },
      include: {
        sections: {
          include: {
            subsections: {
              include: {
                parameters: true,
              },
            },
          },
        },
      },
    });

    expect(form).not.toBeNull();
    expect(form.sections.length).toBe(1);
    expect(form.sections[0].section_name).toBe('Request Details');

    const params = form.sections[0].subsections[0].parameters;
    expect(params.length).toBe(3);

    const areaParam = params.find(p => p.field_key === 'area');
    const budgetParam = params.find(p => p.field_key === 'budget');
    expect(areaParam).toBeDefined();
    expect(areaParam.mandatory).toBe(true);
    expect(budgetParam).toBeDefined();
    expect(budgetParam.field_type).toBe('number');
  });

  // ── Test 3 — Workflow metadata ──
  test('Test 3: Configured transitions exist in WorkflowMaster', async () => {
    const transitions = await prisma.workflowMaster.findMany({
      where: { entity_type_id: deployedEntityTypeId },
      orderBy: { workflow_id: 'asc' },
    });

    expect(transitions.length).toBe(3);
    expect(transitions[0]).toMatchObject({ trigger: 'draft', action: 'submitted', stage: 'citizen' });
    expect(transitions[1]).toMatchObject({ trigger: 'submitted', action: 'verified', stage: 'coordinator_area' });
    expect(transitions[2]).toMatchObject({ trigger: 'verified', action: 'approved', stage: 'director' });
  });

  // ── Test 4 — Rule metadata ──
  test('Test 4: Configured relationship automation rule exists in EntityRelationshipRule', async () => {
    const rules = await prisma.entityRelationshipRule.findMany({
      where: { source_entity_type_id: deployedEntityTypeId },
    });

    expect(rules.length).toBe(1);
    expect(rules[0].target_entity_type_id).toBe(grievanceEntityType.entity_type_id);
    expect(rules[0].event).toBe('approved');
    expect(rules[0].auto_create).toBe(true);
  });

  // ── Test 5 — Report metadata ──
  test('Test 5: Configured report exists in ReportMaster', async () => {
    const report = await prisma.reportMaster.findFirst({
      where: { entity_type_id: deployedEntityTypeId },
    });

    expect(report).not.toBeNull();
    expect(report.report_name).toBe(`${uniqueModuleName} by Area`);
    expect(report.output_format).toBe('grouped_count');

    const config = JSON.parse(report.filters);
    expect(config.groupBy).toBe('area');
    expect(config.metric).toBe('COUNT');
    deployedReportId = report.report_id;
  });

  // ── Test 6 — No module-specific tables ──
  test('Test 6: Deployment did not create any module-specific database table or schema model', async () => {
    // Check that all entities live strictly inside the generic Entity model
    const genericCount = await prisma.entity.count({
      where: { entity_type_id: deployedEntityTypeId },
    });
    expect(genericCount).toBe(0);

    // Verify Prisma client has no custom model named ParkRenovation or similar
    expect(prisma.parkRenovation).toBeUndefined();
    expect(prisma.parkRenovationRequest).toBeUndefined();
    expect(prisma.park_renovation).toBeUndefined();
  });

  // ── Test 7 — Generic form execution ──
  let testEntityId;
  test('Test 7: Entity creation and dynamic parameter storage via generic Form Engine', async () => {
    // Create an entity of the new module type
    const createRes = await request(app)
      .post('/entities')
      .set('Authorization', `Bearer ${citizenToken}`)
      .send({
        entity_type_id: deployedEntityTypeId,
        name: 'Shivaji Park Renovation',
        area: 'Sector 5',
        status: 'draft',
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.success).toBe(true);
    testEntityId = createRes.body.data.entity_id;
    createdEntities.push(testEntityId);

    // Store dynamic parameter values using generic parameterValue routes
    const form = await prisma.formMaster.findFirst({
      where: { entity_type_id: deployedEntityTypeId },
      include: { sections: { include: { subsections: { include: { parameters: true } } } } },
    });
    const budgetParam = form.sections[0].subsections[0].parameters.find(p => p.field_key === 'budget');

    const valRes = await request(app)
      .put(`/entities/${testEntityId}/values`)
      .set('Authorization', `Bearer ${citizenToken}`)
      .send({
        values: [
          { parameter_id: budgetParam.parameter_id, value: '50000' },
        ],
      });

    expect(valRes.status).toBe(200);

    // Retrieve entity parameter values via generic parameterValue engine
    const getRes = await request(app)
      .get(`/entities/${testEntityId}/values`)
      .set('Authorization', `Bearer ${citizenToken}`);

    expect(getRes.status).toBe(200);
    expect(Array.isArray(getRes.body.data)).toBe(true);
    const pv = getRes.body.data.find(p => p.parameter_id === budgetParam.parameter_id);
    expect(pv).toBeDefined();
    expect(pv.value).toBe('50000');
  });

  // ── Test 8 — Generic workflow execution ──
  test('Test 8: Generic Workflow Engine transitions entity using generated WorkflowMaster metadata', async () => {
    // Step 1: Citizen transitions draft -> submitted
    const step1 = await request(app)
      .post(`/entities/${testEntityId}/transition`)
      .set('Authorization', `Bearer ${citizenToken}`)
      .send({ to_status: 'submitted' });
    expect(step1.status).toBe(200);
    expect(step1.body.data.status).toBe('submitted');

    // Step 2: Area Coordinator transitions submitted -> verified (Sector 5 matches coordinatorAreaUser.assignedArea)
    const step2 = await request(app)
      .post(`/entities/${testEntityId}/transition`)
      .set('Authorization', `Bearer ${coordinatorAreaToken}`)
      .send({ to_status: 'verified' });
    expect(step2.status).toBe(200);
    expect(step2.body.data.status).toBe('verified');
  });

  // ── Test 9 — Generic rule execution ──
  test('Test 9: Generic Rule Engine fires on final approval, auto-creating target Grievance', async () => {
    // Step 3: Director transitions verified -> approved
    const step3 = await request(app)
      .post(`/entities/${testEntityId}/transition`)
      .set('Authorization', `Bearer ${directorToken}`)
      .send({ to_status: 'approved' });

    expect(step3.status).toBe(200);
    expect(step3.body.data.status).toBe('approved');
    expect(step3.body.ruleResult).toBeDefined();

    // Verify child Grievance was auto-created in database
    const spawnedGrievance = await prisma.entity.findFirst({
      where: {
        entity_type_id: grievanceEntityType.entity_type_id,
        name: { contains: 'Shivaji Park Renovation' },
      },
    });

    expect(spawnedGrievance).not.toBeNull();
    createdEntities.push(spawnedGrievance.entity_id);
  });

  // ── Test 10 — Generic report execution ──
  test('Test 10: Generic Report Engine executes generated report and returns correct aggregated metrics', async () => {
    // Add additional entities in different areas for report proof
    const entPuneNorth1 = await prisma.entity.create({
      data: { entity_type_id: deployedEntityTypeId, name: 'North Park 1', area: 'Pune North', status: 'approved' },
    });
    const entPuneNorth2 = await prisma.entity.create({
      data: { entity_type_id: deployedEntityTypeId, name: 'North Park 2', area: 'Pune North', status: 'approved' },
    });
    const entPuneSouth = await prisma.entity.create({
      data: { entity_type_id: deployedEntityTypeId, name: 'South Park', area: 'Pune South', status: 'approved' },
    });
    createdEntities.push(entPuneNorth1.entity_id, entPuneNorth2.entity_id, entPuneSouth.entity_id);

    // Execute report via generic /reports/:id/execute
    const repRes = await request(app)
      .get(`/reports/${deployedReportId}/execute`)
      .set('Authorization', `Bearer ${directorToken}`);

    expect(repRes.status).toBe(200);
    expect(repRes.body.success).toBe(true);

    const rows = repRes.body.data.rows;
    const northRow = rows.find(r => r.area === 'Pune North');
    const southRow = rows.find(r => r.area === 'Pune South');
    const sec5Row = rows.find(r => r.area === 'Sector 5');

    expect(northRow).toBeDefined();
    expect(northRow.count).toBe(2);
    expect(southRow).toBeDefined();
    expect(southRow.count).toBe(1);
    expect(sec5Row).toBeDefined();
    expect(sec5Row.count).toBe(1);
  });

  // ── Test 11 — Duplicate deployment protection ──
  test('Test 11: Attempting to deploy duplicate module name is rejected with 400', async () => {
    const dupPayload = {
      module: {
        name: uniqueModuleName, // duplicate!
      },
      form: {
        sections: [{ name: 'Sec', parameters: [{ label: 'F1', field_type: 'text' }] }],
      },
    };

    const res = await request(app)
      .post('/module-builder/deploy')
      .set('Authorization', `Bearer ${directorToken}`)
      .send(dupPayload);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('already exists');
  });

  // ── Test 12 — Transaction failure & atomic rollback ──
  test('Test 12: Invalid metadata configuration triggers rollback without partial metadata creation', async () => {
    const invalidModuleName = `Failing Module ${Date.now()}`;
    const invalidPayload = {
      module: {
        name: invalidModuleName,
      },
      form: {
        sections: [
          {
            name: 'Good Section',
            parameters: [
              { label: 'Field 1', field_type: 'text' },
            ],
          },
        ],
      },
      workflow: {
        // Invalid transition: missing target
        transitions: [
          { from_status: 'draft', to_status: '', role: 'citizen' },
        ],
      },
    };

    const res = await request(app)
      .post('/module-builder/deploy')
      .set('Authorization', `Bearer ${directorToken}`)
      .send(invalidPayload);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);

    // Verify nothing was committed to database (no orphan EntityType, FormMaster, etc.)
    const orphanType = await prisma.entityType.findFirst({ where: { name: invalidModuleName } });
    expect(orphanType).toBeNull();
  });

  // ── Test 13 — Unauthorized builder access ──
  test('Test 13: Ordinary citizen or unauthenticated request cannot deploy modules', async () => {
    const payload = {
      module: { name: 'Hacker Module' },
      form: { sections: [{ name: 'S1', parameters: [{ label: 'P1', field_type: 'text' }] }] },
    };

    // 1. Unauthenticated -> 401
    const resUnauth = await request(app)
      .post('/module-builder/deploy')
      .send(payload);
    expect(resUnauth.status).toBe(401);

    // 2. Citizen role -> 403
    const resCitizen = await request(app)
      .post('/module-builder/deploy')
      .set('Authorization', `Bearer ${citizenToken}`)
      .send(payload);
    expect(resCitizen.status).toBe(403);
  });
});
