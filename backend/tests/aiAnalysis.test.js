const request = require('supertest');
const app = require('../index');
const prisma = require('../db');
const { createTestUser, cleanupAll, trackEntityId } = require('./helpers/authHelper');

describe('AI Decision Layer: POST /entities/:id/ai-analysis', () => {
  let entityId;
  let citizenHeaders;
  let directorHeaders;
  let adminHeaders;

  beforeAll(async () => {
    const admin = await createTestUser({ role: 'admin' });
    adminHeaders = admin.headers;

    const director = await createTestUser({ role: 'director' });
    directorHeaders = director.headers;

    const citizen = await createTestUser({ role: 'citizen' });
    citizenHeaders = citizen.headers;

    // Create a test entity
    const createRes = await request(app)
      .post('/entities')
      .set(citizenHeaders)
      .send({
        entity_type_id: 1,
        name: 'AI Test Civic Movement',
        location: 'Sector 5 Civic Center',
        area: 'Sector 5',
        status: 'coordinator_approved',
      });
    entityId = createRes.body.data.entity_id;
    trackEntityId(entityId);
  });

  afterAll(async () => {
    await cleanupAll();
    await prisma.$disconnect();
  });

  test('Security: returns 401 Unauthorized when no token is provided', async () => {
    const res = await request(app)
      .post(`/entities/${entityId}/ai-analysis`)
      .set('X-Requested-With', 'ck-web');
    expect(res.statusCode).toBe(401);
  });

  test('Security: returns 403 Forbidden when accessed by a Citizen', async () => {
    const res = await request(app)
      .post(`/entities/${entityId}/ai-analysis`)
      .set(citizenHeaders);
    expect(res.statusCode).toBe(403);
  });

  test('Audit & Execution: logs execution to AIExecutionLog table for Director/Admin', async () => {
    const countBefore = await prisma.aIExecutionLog.count({ where: { entity_id: entityId } });

    const res = await request(app)
      .post(`/entities/${entityId}/ai-analysis`)
      .set(adminHeaders);

    // Check that a DB row was created in AIExecutionLog
    const countAfter = await prisma.aIExecutionLog.count({ where: { entity_id: entityId } });
    expect(countAfter).toBe(countBefore + 1);

    const latestLog = await prisma.aIExecutionLog.findFirst({
      where: { entity_id: entityId },
      orderBy: { ai_execution_log_id: 'desc' },
    });

    expect(latestLog).toBeDefined();
    expect(latestLog.entity_id).toBe(entityId);
    expect(latestLog.provider).toBe('gemini');
    expect(latestLog.prompt).toContain('AI Test Civic Movement');

    // Response behavior: if GEMINI_API_KEY is configured and valid, res.status is 200 and returns valid 5-field schema.
    // If GEMINI_API_KEY is missing/unconfigured in test env, endpoint returns 500 cleanly with log recorded (status='failed').
    if (res.statusCode === 200) {
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('problem_summary');
      expect(res.body.data).toHaveProperty('root_cause_analysis');
      expect(res.body.data).toHaveProperty('stakeholder_analysis');
      expect(res.body.data).toHaveProperty('risk_register');
      expect(res.body.data).toHaveProperty('recommendation');
      expect(latestLog.status).toBe('completed');
    } else {
      expect(res.statusCode).toBeGreaterThanOrEqual(400);
      expect(res.body.success).toBe(false);
      expect(latestLog.status).toBe('failed');
    }
  }, 30000);
});
