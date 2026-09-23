const request = require('supertest');
const app = require('../index');
const prisma = require('../db');
const seedTokens = require('../seed-tokens.json');

describe('AI Decision Layer: POST /entities/:id/ai-analysis', () => {
  let entityId;
  let citizenToken;
  let directorToken;
  let adminToken;

  beforeAll(async () => {
    // Obtain tokens from seedTokens
    adminToken = seedTokens['demo.admin@example.com']?.token;
    directorToken = seedTokens['demo.director@example.com']?.token;

    // Create a citizen user and get token
    const email = `aitest-${Date.now()}@example.com`;
    const signupRes = await request(app)
      .post('/auth/signup')
      .send({ name: 'AI Citizen Test', email, password: 'Password123' });
    citizenToken = signupRes.body.data.token;

    // Create a test entity
    const createRes = await request(app)
      .post('/entities')
      .set('Authorization', `Bearer ${citizenToken}`)
      .send({
        entity_type_id: 1,
        name: 'AI Test Civic Movement',
        location: 'Sector 5 Civic Center',
        area: 'Sector 5',
        status: 'coordinator_approved',
      });
    entityId = createRes.body.data.entity_id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('Security: returns 401 Unauthorized when no token is provided', async () => {
    const res = await request(app).post(`/entities/${entityId}/ai-analysis`);
    expect(res.statusCode).toBe(401);
  });

  test('Security: returns 403 Forbidden when accessed by a Citizen', async () => {
    const res = await request(app)
      .post(`/entities/${entityId}/ai-analysis`)
      .set('Authorization', `Bearer ${citizenToken}`);
    expect(res.statusCode).toBe(403);
  });

  test('Audit & Execution: logs execution to AIExecutionLog table for Director/Admin', async () => {
    const countBefore = await prisma.aIExecutionLog.count({ where: { entity_id: entityId } });

    const res = await request(app)
      .post(`/entities/${entityId}/ai-analysis`)
      .set('Authorization', `Bearer ${adminToken}`);

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

  afterAll(async () => {
    try {
      const aiEnts = await prisma.entity.findMany({
        where: { name: { startsWith: 'AI Test' } },
        select: { entity_id: true },
      });
      const ids = aiEnts.map((e) => e.entity_id);
      if (ids.length > 0) {
        await prisma.aIExecutionLog.deleteMany({ where: { entity_id: { in: ids } } });
        await prisma.parameterValue.deleteMany({ where: { entity_id: { in: ids } } });
        await prisma.auditLog.deleteMany({ where: { entity_id: { in: ids } } });
        await prisma.approvalHistory.deleteMany({ where: { entity_id: { in: ids } } });
        await prisma.entity.deleteMany({ where: { entity_id: { in: ids } } });
      }
      await prisma.user.deleteMany({ where: { email: 'ai.citizen@example.com' } });
    } catch (e) {
      // ignore
    }
  });
});
