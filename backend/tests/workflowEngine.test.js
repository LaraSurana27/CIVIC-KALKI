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

describe('Phase 1 — Metadata-Driven Workflow Engine Tests', () => {
  let citizenToken, coordinatorAreaToken, directorToken;
  let citizenUser, coordinatorAreaUser, directorUser;
  let movementEntityType;
  let customEntityType;

  beforeAll(async () => {
    // 1. Fetch seed users
    citizenUser = await prisma.user.findFirst({ where: { role: 'citizen' } });
    coordinatorAreaUser = await prisma.user.findFirst({ where: { role: 'coordinator_area' } });
    directorUser = await prisma.user.findFirst({ where: { role: 'director' } });

    citizenToken = generateTestToken(citizenUser);
    coordinatorAreaToken = generateTestToken(coordinatorAreaUser);
    directorToken = generateTestToken(directorUser);

    // 2. Fetch Movement EntityType
    movementEntityType = await prisma.entityType.findFirst({ where: { name: 'Movement' } });

    // 3. Create a brand-new custom EntityType with custom non-standard workflow stages
    // Workflow: draft -> submitted -> verified -> approved
    customEntityType = await prisma.entityType.create({
      data: {
        domain_id: 1,
        name: `Park Renovation Request ${Date.now()}`,
        description: 'Custom metadata-driven module test',
      },
    });

    // Seed custom WorkflowMaster transitions for the custom EntityType
    await prisma.workflowMaster.createMany({
      data: [
        { entity_type_id: customEntityType.entity_type_id, trigger: 'draft', action: 'submitted', stage: 'citizen' },
        { entity_type_id: customEntityType.entity_type_id, trigger: 'submitted', action: 'verified', stage: 'coordinator_area' },
        { entity_type_id: customEntityType.entity_type_id, trigger: 'verified', action: 'approved', stage: 'director' },
      ],
    });
  });

  afterAll(async () => {
    // Clean up custom entity type and associated workflow rules
    if (customEntityType) {
      await prisma.workflowMaster.deleteMany({ where: { entity_type_id: customEntityType.entity_type_id } });
      await prisma.entity.deleteMany({ where: { entity_type_id: customEntityType.entity_type_id } });
      await prisma.entityType.delete({ where: { entity_type_id: customEntityType.entity_type_id } });
    }
  });

  // ── Test 1: Valid metadata transition (draft -> submitted by citizen) ──
  test('Test 1: Valid metadata transition (draft -> submitted) succeeds for owner citizen', async () => {
    const entity = await prisma.entity.create({
      data: {
        entity_type_id: movementEntityType.entity_type_id,
        owner_user_id: citizenUser.user_id,
        name: 'Test Movement 1',
        status: 'draft',
      },
    });

    const res = await request(app)
      .post(`/entities/${entity.entity_id}/transition`)
      .set('Authorization', `Bearer ${citizenToken}`)
      .send({ to_status: 'submitted' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('submitted');

    // Clean up
    await prisma.approvalHistory.deleteMany({ where: { entity_id: entity.entity_id } });
    await prisma.auditLog.deleteMany({ where: { entity_id: entity.entity_id } });
    await prisma.entity.delete({ where: { entity_id: entity.entity_id } });
  });

  // ── Test 2: Invalid transition prohibited by metadata ──
  test('Test 2: Invalid transition (draft -> approved) fails via WorkflowMaster', async () => {
    const entity = await prisma.entity.create({
      data: {
        entity_type_id: movementEntityType.entity_type_id,
        owner_user_id: citizenUser.user_id,
        name: 'Test Movement 2',
        status: 'draft',
      },
    });

    const res = await request(app)
      .post(`/entities/${entity.entity_id}/transition`)
      .set('Authorization', `Bearer ${citizenToken}`)
      .send({ to_status: 'approved' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);

    // Clean up
    await prisma.approvalHistory.deleteMany({ where: { entity_id: entity.entity_id } });
    await prisma.auditLog.deleteMany({ where: { entity_id: entity.entity_id } });
    await prisma.entity.delete({ where: { entity_id: entity.entity_id } });
  });

  // ── Test 3: Unauthorized role transition fails ──
  test('Test 3: Citizen attempting director-only transition fails', async () => {
    const entity = await prisma.entity.create({
      data: {
        entity_type_id: movementEntityType.entity_type_id,
        owner_user_id: citizenUser.user_id,
        name: 'Test Movement 3',
        status: 'coordinator_approved',
      },
    });

    const res = await request(app)
      .post(`/entities/${entity.entity_id}/transition`)
      .set('Authorization', `Bearer ${citizenToken}`)
      .send({ to_status: 'approved' });

    expect(res.status).toBe(400);

    // Clean up
    await prisma.approvalHistory.deleteMany({ where: { entity_id: entity.entity_id } });
    await prisma.auditLog.deleteMany({ where: { entity_id: entity.entity_id } });
    await prisma.entity.delete({ where: { entity_id: entity.entity_id } });
  });

  // ── Test 4 & 18: Brand-new Custom Module Workflow (draft -> submitted -> verified -> approved) ──
  test('Test 4 & 18: Custom EntityType uses custom non-standard WorkflowMaster metadata', async () => {
    // Create custom entity
    const customEntity = await prisma.entity.create({
      data: {
        entity_type_id: customEntityType.entity_type_id,
        owner_user_id: citizenUser.user_id,
        name: 'Park Renovation Case #1',
        area: 'Sector 5',
        status: 'draft',
      },
    });

    // Step 1: Citizen submits (draft -> submitted)
    const step1 = await request(app)
      .post(`/entities/${customEntity.entity_id}/transition`)
      .set('Authorization', `Bearer ${citizenToken}`)
      .send({ to_status: 'submitted' });
    expect(step1.status).toBe(200);
    expect(step1.body.data.status).toBe('submitted');

    // Step 2: Coordinator verifies (submitted -> verified)
    const step2 = await request(app)
      .post(`/entities/${customEntity.entity_id}/transition`)
      .set('Authorization', `Bearer ${coordinatorAreaToken}`)
      .send({ to_status: 'verified' });
    expect(step2.status).toBe(200);
    expect(step2.body.data.status).toBe('verified');

    // Step 3: Director approves (verified -> approved)
    const step3 = await request(app)
      .post(`/entities/${customEntity.entity_id}/transition`)
      .set('Authorization', `Bearer ${directorToken}`)
      .send({ to_status: 'approved' });
    expect(step3.status).toBe(200);
    expect(step3.body.data.status).toBe('approved');

    // Clean up
    await prisma.approvalHistory.deleteMany({ where: { entity_id: customEntity.entity_id } });
    await prisma.auditLog.deleteMany({ where: { entity_id: customEntity.entity_id } });
    await prisma.entity.delete({ where: { entity_id: customEntity.entity_id } });
  });

  // ── Test 5: Approval history creation ──
  test('Test 5: Successful workflow transition creates ApprovalHistory record', async () => {
    const entity = await prisma.entity.create({
      data: {
        entity_type_id: movementEntityType.entity_type_id,
        owner_user_id: citizenUser.user_id,
        name: 'Approval History Test Entity',
        status: 'draft',
      },
    });

    await request(app)
      .post(`/entities/${entity.entity_id}/transition`)
      .set('Authorization', `Bearer ${citizenToken}`)
      .send({ to_status: 'submitted' });

    const history = await prisma.approvalHistory.findFirst({
      where: { entity_id: entity.entity_id },
    });

    expect(history).not.toBeNull();
    expect(history.from_status).toBe('draft');
    expect(history.to_status).toBe('submitted');

    // Clean up
    await prisma.approvalHistory.deleteMany({ where: { entity_id: entity.entity_id } });
    await prisma.auditLog.deleteMany({ where: { entity_id: entity.entity_id } });
    await prisma.entity.delete({ where: { entity_id: entity.entity_id } });
  });

  // ── Test 6: Audit log creation ──
  test('Test 6: Successful workflow transition creates AuditLog record', async () => {
    const entity = await prisma.entity.create({
      data: {
        entity_type_id: movementEntityType.entity_type_id,
        owner_user_id: citizenUser.user_id,
        name: 'Audit Log Test Entity',
        status: 'draft',
      },
    });

    await request(app)
      .post(`/entities/${entity.entity_id}/transition`)
      .set('Authorization', `Bearer ${citizenToken}`)
      .send({ to_status: 'submitted' });

    const audit = await prisma.auditLog.findFirst({
      where: { entity_id: entity.entity_id, action: 'status_transition' },
    });

    expect(audit).not.toBeNull();
    expect(audit.old_status).toBe('draft');
    expect(audit.new_status).toBe('submitted');

    // Clean up
    await prisma.approvalHistory.deleteMany({ where: { entity_id: entity.entity_id } });
    await prisma.auditLog.deleteMany({ where: { entity_id: entity.entity_id } });
    await prisma.entity.delete({ where: { entity_id: entity.entity_id } });
  });

  // ── Test 7: Rule Engine compatibility ──
  test('Test 7: Final approval triggers existing relationship rules', async () => {
    const entity = await prisma.entity.create({
      data: {
        entity_type_id: movementEntityType.entity_type_id,
        owner_user_id: citizenUser.user_id,
        name: 'Rule Trigger Test Movement',
        status: 'coordinator_approved',
      },
    });

    const res = await request(app)
      .post(`/entities/${entity.entity_id}/transition`)
      .set('Authorization', `Bearer ${directorToken}`)
      .send({ to_status: 'approved' });

    expect(res.status).toBe(200);
    expect(res.body.ruleResult).toBeDefined();

    // Clean up child entities created by rule engine
    const childEntities = await prisma.entity.findMany({
      where: { name: { contains: 'Rule Trigger Test Movement' } },
    });
    for (const child of childEntities) {
      if (child.entity_id !== entity.entity_id) {
        await prisma.parameterValue.deleteMany({ where: { entity_id: child.entity_id } });
        await prisma.approvalHistory.deleteMany({ where: { entity_id: child.entity_id } });
        await prisma.auditLog.deleteMany({ where: { entity_id: child.entity_id } });
        await prisma.entity.delete({ where: { entity_id: child.entity_id } });
      }
    }

    await prisma.approvalHistory.deleteMany({ where: { entity_id: entity.entity_id } });
    await prisma.auditLog.deleteMany({ where: { entity_id: entity.entity_id } });
    await prisma.entity.delete({ where: { entity_id: entity.entity_id } });
  });

  // ── Test 8: GET /entities/:id/workflow API endpoint ──
  test('Test 8: GET /entities/:id/workflow returns metadata transitions', async () => {
    const entity = await prisma.entity.create({
      data: {
        entity_type_id: movementEntityType.entity_type_id,
        owner_user_id: citizenUser.user_id,
        name: 'Workflow Endpoint Test',
        status: 'draft',
      },
    });

    const res = await request(app)
      .get(`/entities/${entity.entity_id}/workflow`)
      .set('Authorization', `Bearer ${citizenToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isMetadataDriven).toBe(true);
    expect(Array.isArray(res.body.data.allowedTransitions)).toBe(true);

    // Clean up
    await prisma.entity.delete({ where: { entity_id: entity.entity_id } });
  });
});
