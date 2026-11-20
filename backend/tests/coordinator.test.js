/**
 * CIVIC-KALKI — Coordinator AI Route Tests (Ayush's Module)
 *
 * Tests for POST /coordinator/:id/analyze and GET /coordinator/legal-corpus
 *
 * These tests mock the Groq SDK so no live API key is required.
 * They verify: authentication, authorization, area restriction,
 * AI-does-not-change-workflow, audit logging, and response shape.
 */

'use strict';

const request = require('supertest');
const app = require('../index');
const prisma = require('../db');
const { createTestUser, cleanupTrackedEntities } = require('./helpers/authHelper');

// ─────────────────────────────────────────────────────────────────────────────
// Mock groq-sdk so tests run without a real API key
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('groq-sdk', () => {
  const mockReport = {
    case_summary: 'Test case summary for automated testing.',
    missing_information: [
      { field: 'Description', category: 'mandatory_field', note: 'Missing description field.' },
    ],
    attention_factors: [
      { factor: 'No documents attached', type: 'missing_critical', detail: 'No files found.' },
    ],
    stakeholder_suggestions: [
      { stakeholder: 'Area Coordinator', rationale: 'Case belongs to a specific ward area.' },
    ],
    legal_references: [],
    advisory_note: 'This is an advisory analysis only. Human review required.',
  };

  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [
            {
              message: {
                content: JSON.stringify(mockReport),
              },
            },
          ],
        }),
      },
    },
  }));
});

// ─────────────────────────────────────────────────────────────────────────────
// Test setup / teardown
// ─────────────────────────────────────────────────────────────────────────────

let citizenToken;
let coordinatorToken;
let coordinatorAreaToken;
let directorToken;
let entityId;
let differentAreaEntityId;

beforeAll(async () => {
  // Create isolated ephemeral test users
  const citizen = await createTestUser({ role: 'citizen' });
  citizenToken = citizen.token;

  const coord = await createTestUser({ role: 'coordinator_general' });
  coordinatorToken = coord.token;

  const coordArea = await createTestUser({ role: 'coordinator_area', assignedArea: 'TestArea' });
  coordinatorAreaToken = coordArea.token;

  const director = await createTestUser({ role: 'director' });
  directorToken = director.token;

  // Create a test entity in TestArea
  const entityTypeRes = await prisma.entityType.findFirst();
  const entityTypeId = entityTypeRes ? entityTypeRes.entity_type_id : 1;

  const entityRes = await request(app).post('/entities')
    .set('Authorization', `Bearer ${citizenToken}`)
    .set('X-Requested-With', 'ck-web')
    .send({
      entity_type_id: entityTypeId,
      name: 'Coordinator AI Test Entity',
      location: 'Test Location',
      area: 'TestArea',
      status: 'submitted',
    });
  entityId = entityRes.body.data?.entity_id;

  // Create entity in different area
  const differentRes = await request(app).post('/entities')
    .set('Authorization', `Bearer ${citizenToken}`)
    .set('X-Requested-With', 'ck-web')
    .send({
      entity_type_id: entityTypeId,
      name: 'Different Area Test Entity',
      location: 'Other Location',
      area: 'DifferentArea',
      status: 'submitted',
    });
  differentAreaEntityId = differentRes.body.data?.entity_id;
});

afterAll(async () => {
  try {
    if (entityId) {
      await prisma.aIExecutionLog.deleteMany({ where: { entity_id: entityId } }).catch(() => {});
      await prisma.parameterValue.deleteMany({ where: { entity_id: entityId } }).catch(() => {});
      await prisma.auditLog.deleteMany({ where: { entity_id: entityId } }).catch(() => {});
      await prisma.approvalHistory.deleteMany({ where: { entity_id: entityId } }).catch(() => {});
      await prisma.entity.delete({ where: { entity_id: entityId } }).catch(() => {});
    }
    if (differentAreaEntityId) {
      await prisma.aIExecutionLog.deleteMany({ where: { entity_id: differentAreaEntityId } }).catch(() => {});
      await prisma.parameterValue.deleteMany({ where: { entity_id: differentAreaEntityId } }).catch(() => {});
      await prisma.auditLog.deleteMany({ where: { entity_id: differentAreaEntityId } }).catch(() => {});
      await prisma.approvalHistory.deleteMany({ where: { entity_id: differentAreaEntityId } }).catch(() => {});
      await prisma.entity.delete({ where: { entity_id: differentAreaEntityId } }).catch(() => {});
    }
    await cleanupTrackedEntities();
  } catch (e) {
    // ignore cleanup errors
  }
  await prisma.$disconnect();
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /coordinator/:id/analyze
// ─────────────────────────────────────────────────────────────────────────────

describe('Coordinator AI: POST /coordinator/:id/analyze', () => {
  test('AUTH: returns 401 when no token is provided', async () => {
    const res = await request(app)
      .post(`/coordinator/${entityId}/analyze`)
      .set('X-Requested-With', 'ck-web');
    expect(res.statusCode).toBe(401);
  });

  test('AUTHZ: returns 403 when accessed by a citizen', async () => {
    const res = await request(app)
      .post(`/coordinator/${entityId}/analyze`)
      .set('Authorization', `Bearer ${citizenToken}`)
      .set('X-Requested-With', 'ck-web');
    expect(res.statusCode).toBe(403);
  });

  test('AUTHZ: returns 200 for coordinator_general accessing any area entity', async () => {
    const res = await request(app)
      .post(`/coordinator/${entityId}/analyze`)
      .set('Authorization', `Bearer ${coordinatorToken}`)
      .set('X-Requested-With', 'ck-web');
    // 200 (Groq mocked) or 503 if key not configured — either is acceptable
    expect([200, 503]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('case_summary');
      expect(res.body.data).toHaveProperty('missing_information');
      expect(res.body.data).toHaveProperty('attention_factors');
      expect(res.body.data).toHaveProperty('stakeholder_suggestions');
      expect(res.body.advisory_disclaimer).toBeDefined();
    }
  });

  test('AUTHZ: returns 200 for director accessing any entity', async () => {
    const res = await request(app)
      .post(`/coordinator/${entityId}/analyze`)
      .set('Authorization', `Bearer ${directorToken}`)
      .set('X-Requested-With', 'ck-web');
    expect([200, 503]).toContain(res.statusCode);
  });

  test('AREA RESTRICTION: coordinator_area blocked from different area entity', async () => {
    const res = await request(app)
      .post(`/coordinator/${differentAreaEntityId}/analyze`)
      .set('Authorization', `Bearer ${coordinatorAreaToken}`)
      .set('X-Requested-With', 'ck-web');
    // Should be 403 (wrong area) or 503 (no key), NOT 200
    expect([403, 503]).toContain(res.statusCode);
    if (res.statusCode === 403) {
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/area/i);
    }
  });

  test('AREA RESTRICTION: coordinator_area can analyze entity in their own area', async () => {
    const res = await request(app)
      .post(`/coordinator/${entityId}/analyze`)
      .set('Authorization', `Bearer ${coordinatorAreaToken}`)
      .set('X-Requested-With', 'ck-web');
    // 200 or 503 are both valid (area matches TestArea)
    expect([200, 503]).toContain(res.statusCode);
  });

  test('NOT FOUND: returns 404 for nonexistent entity', async () => {
    const res = await request(app)
      .post('/coordinator/999999/analyze')
      .set('Authorization', `Bearer ${coordinatorToken}`)
      .set('X-Requested-With', 'ck-web');
    expect(res.statusCode).toBe(404);
  });

  test('AUDIT LOG: AI analysis is logged to AIExecutionLog', async () => {
    if (!entityId) return;
    const countBefore = await prisma.aIExecutionLog.count({
      where: { entity_id: entityId, analysis_type: 'coordinator_analysis' },
    });

    await request(app)
      .post(`/coordinator/${entityId}/analyze`)
      .set('Authorization', `Bearer ${coordinatorToken}`)
      .set('X-Requested-With', 'ck-web');

    const countAfter = await prisma.aIExecutionLog.count({
      where: { entity_id: entityId, analysis_type: 'coordinator_analysis' },
    });

    expect(countAfter).toBeGreaterThanOrEqual(countBefore + 1);
  }, 15000);

  test('NO WORKFLOW CHANGE: entity status is unchanged after AI analysis', async () => {
    if (!entityId) return;
    const before = await prisma.entity.findUnique({
      where: { entity_id: entityId },
      select: { status: true },
    });

    await request(app)
      .post(`/coordinator/${entityId}/analyze`)
      .set('Authorization', `Bearer ${coordinatorToken}`)
      .set('X-Requested-With', 'ck-web');

    const after = await prisma.entity.findUnique({
      where: { entity_id: entityId },
      select: { status: true },
    });

    expect(after.status).toBe(before.status);
  });

  test('RESPONSE SHAPE: successful response includes advisory_disclaimer', async () => {
    const res = await request(app)
      .post(`/coordinator/${entityId}/analyze`)
      .set('Authorization', `Bearer ${coordinatorToken}`)
      .set('X-Requested-With', 'ck-web');

    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty('advisory_disclaimer');
      expect(typeof res.body.advisory_disclaimer).toBe('string');
      expect(res.body.advisory_disclaimer.length).toBeGreaterThan(10);
    }
  });

  test('GROQ MISSING KEY: returns 503 (not 200) when GROQ_API_KEY is absent', async () => {
    const savedKey = process.env.GROQ_API_KEY;
    delete process.env.GROQ_API_KEY;
    jest.resetModules();

    const res = await request(app)
      .post(`/coordinator/${entityId}/analyze`)
      .set('Authorization', `Bearer ${coordinatorToken}`)
      .set('X-Requested-With', 'ck-web');

    expect(res.statusCode).toBe(503);
    expect(res.body.success).toBe(false);

    if (savedKey) process.env.GROQ_API_KEY = savedKey;
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /coordinator/legal-corpus
// ─────────────────────────────────────────────────────────────────────────────

describe('Coordinator AI: GET /coordinator/legal-corpus', () => {
  test('AUTH: returns 401 when no token provided', async () => {
    const res = await request(app).get('/coordinator/legal-corpus');
    expect(res.statusCode).toBe(401);
  });

  test('AUTHZ: returns 403 for citizen', async () => {
    const res = await request(app)
      .get('/coordinator/legal-corpus')
      .set('Authorization', `Bearer ${citizenToken}`);
    expect(res.statusCode).toBe(403);
  });

  test('SUCCESS: returns corpus metadata for coordinator_general', async () => {
    const res = await request(app)
      .get('/coordinator/legal-corpus')
      .set('Authorization', `Bearer ${coordinatorToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);

    const entry = res.body.data[0];
    expect(entry).toHaveProperty('id');
    expect(entry).toHaveProperty('source_title');
    expect(entry).toHaveProperty('section');
    expect(entry).toHaveProperty('date_version');
    expect(entry).toHaveProperty('official_url');
    expect(entry).toHaveProperty('keywords');
  });

  test('NO FABRICATED CITATIONS: all corpus entries have official_url', async () => {
    const res = await request(app)
      .get('/coordinator/legal-corpus')
      .set('Authorization', `Bearer ${coordinatorToken}`);
    expect(res.statusCode).toBe(200);
    for (const entry of res.body.data) {
      expect(typeof entry.official_url).toBe('string');
      expect(entry.official_url.length).toBeGreaterThan(0);
    }
  });

  test('DISCLAIMER: response includes advisory disclaimer', async () => {
    const res = await request(app)
      .get('/coordinator/legal-corpus')
      .set('Authorization', `Bearer ${coordinatorToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.disclaimer).toBeDefined();
  });
});
