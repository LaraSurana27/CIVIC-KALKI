const request = require('supertest');
const app = require('../index');
const prisma = require('../db');
const seedTokens = require('../seed-tokens.json');

describe('Governance Intelligence Layer', () => {
  let citizenToken;
  let directorToken;
  let adminToken;
  let entityTypeId;

  beforeAll(async () => {
    adminToken = seedTokens['demo.admin@example.com']?.token;
    directorToken = seedTokens['demo.director@example.com']?.token;
    citizenToken = seedTokens['demo.citizen@example.com']?.token;

    const donationType = await prisma.entityType.findFirst({
      where: { name: 'Donation Transaction' },
    });
    if (donationType) {
      entityTypeId = donationType.entity_type_id;
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Security & Access Control', () => {
    test('GET /governance/config: returns 401 when no token is provided', async () => {
      const res = await request(app).get('/governance/config');
      expect(res.statusCode).toBe(401);
    });

    test('GET /governance/config: returns 403 when accessed by a Citizen', async () => {
      const res = await request(app)
        .get('/governance/config')
        .set('Authorization', `Bearer ${citizenToken}`);
      expect(res.statusCode).toBe(403);
    });

    test('GET /governance/config: returns 200 with module config for Director', async () => {
      const res = await request(app)
        .get('/governance/config')
        .set('Authorization', `Bearer ${directorToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.entity_type_name).toBe('Donation Transaction');
      expect(res.body.data.entity_type_id).toBeDefined();
    });

    test('POST /governance/analyze: returns 401 when no token is provided', async () => {
      const res = await request(app).post('/governance/analyze');
      expect(res.statusCode).toBe(401);
    });

    test('POST /governance/analyze: returns 403 when accessed by a Citizen', async () => {
      const res = await request(app)
        .post('/governance/analyze')
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({ entity_type_id: entityTypeId });
      expect(res.statusCode).toBe(403);
    });
  });

  describe('Deterministic Engine & AI Decision Execution', () => {
    test('POST /governance/analyze: executes analysis and returns full schema for Director/Admin', async () => {
      const res = await request(app)
        .post('/governance/analyze')
        .set('Authorization', `Bearer ${directorToken}`)
        .send({ entity_type_id: entityTypeId });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      const data = res.body.data;

      // Analysis mode strict labeling
      expect(['AI_ASSISTED', 'DETERMINISTIC_ONLY']).toContain(data.analysis_mode);
      expect(data.entity_type_name).toBe('Donation Transaction');

      // Summary metrics
      expect(data.summary_metrics).toBeDefined();
      expect(data.summary_metrics.total_transactions).toBeGreaterThanOrEqual(18);
      expect(typeof data.summary_metrics.verified_count).toBe('number');
      expect(typeof data.summary_metrics.failed_verification_count).toBe('number');
      expect(typeof data.summary_metrics.unresolved_reconciliation_count).toBe('number');
      expect(data.summary_metrics.total_exception_count).toBeGreaterThan(0);

      // Process health pipeline
      expect(data.process_health).toBeDefined();
      expect(Array.isArray(data.process_health.pipeline)).toBe(true);
      const stages = data.process_health.pipeline.map((p) => p.stage);
      expect(stages).toEqual(expect.arrayContaining(['recorded', 'verified', 'reconciled', 'audited', 'closed']));

      // Deterministic exceptions - check schema
      expect(Array.isArray(data.exceptions)).toBe(true);
      expect(data.exceptions.length).toBeGreaterThan(0);
      for (const exc of data.exceptions) {
        expect(exc).toHaveProperty('observation');
        expect(exc).toHaveProperty('evidence');
        expect(exc).toHaveProperty('trigger_rule');
        expect(exc).toHaveProperty('possible_cause');
        expect(exc).toHaveProperty('recommendation');
        expect(exc).toHaveProperty('requires_human_review');
        expect(exc.analysis_mode).toBe('DETERMINISTIC');

        // Simulation language check: no accusations or guilt
        const text = (exc.observation + ' ' + exc.possible_cause).toLowerCase();
        expect(text).not.toMatch(/fraud|embezzle|corrupt|criminal|guilty|stolen/);
      }

      // Stakeholder intelligence
      expect(Array.isArray(data.stakeholder_intelligence)).toBe(true);
      expect(data.stakeholder_intelligence.length).toBeGreaterThan(0);
      for (const st of data.stakeholder_intelligence) {
        expect(st).toHaveProperty('stakeholder');
        expect(st).toHaveProperty('interest');
        expect(st).toHaveProperty('concern');
        expect(st).toHaveProperty('relevant_process');
        expect(st).toHaveProperty('evidence');
        expect(st.analysis_mode).toBe('DETERMINISTIC');
      }

      // AI Summary (if present, must have analysis_mode = 'AI')
      if (data.ai_summary) {
        expect(data.ai_summary.analysis_mode).toBe('AI');
        expect(data.ai_summary).toHaveProperty('process_health_narrative');
        expect(data.ai_summary).toHaveProperty('risk_narrative');
        expect(Array.isArray(data.ai_summary.recommendations)).toBe(true);
      }

      // Verify AIExecutionLog entry with entity_id: null and analysis_type: 'governance'
      if (data.log_id) {
        const log = await prisma.aIExecutionLog.findUnique({
          where: { ai_execution_log_id: data.log_id },
        });
        expect(log).toBeDefined();
        expect(log.entity_id).toBeNull();
        expect(log.analysis_type).toBe('governance');
      }
    }, 45000);
  });
});
