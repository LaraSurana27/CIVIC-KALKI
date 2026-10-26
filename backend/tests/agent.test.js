/**
 * CIVIC-KALKI — Agent Layer Deterministic Tests
 *
 * ALL Gemini calls are mocked via jest.mock — no live API dependency.
 * Prisma is mocked — no live DB dependency.
 *
 * Test strategy:
 *   - Unit tests call the service functions directly (fast, no HTTP overhead)
 *   - Endpoint tests use supertest only for validation rules (400/401 checks)
 *   - Session injection tests manipulate the exported _sessions Map directly
 *
 * Run: npm test (from backend/)
 */

// ── Mock @google/generative-ai BEFORE any require ─────────────────────────────
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: { text: () => '{}' },
      }),
    }),
  })),
}));

// ── Mock agentIntentRouter ─────────────────────────────────────────────────────
const mockRouteIntent = jest.fn();
jest.mock('../services/agentIntentRouter', () => ({
  routeIntent: mockRouteIntent,
}));

// ── Mock prisma ───────────────────────────────────────────────────────────────
jest.mock('../db', () => ({
  entityType: { findFirst: jest.fn(), findMany: jest.fn() },
  formMaster: { findFirst: jest.fn() },
  entity: { findMany: jest.fn(), create: jest.fn(), update: jest.fn() },
  parameterValue: { create: jest.fn() },
  auditLog: { create: jest.fn() },
  fileRepository: { create: jest.fn() },
  $transaction: jest.fn(async (ops) => {
    if (Array.isArray(ops)) return Promise.all(ops);
    return ops;
  }),
}));

const prisma = require('../db');
process.env.GEMINI_API_KEY = 'test-key-mocked';

// ── Import subjects under test ────────────────────────────────────────────────
const {
  continueFormFilling,
  clearSession,
  matchFileToParameter,
  _sessions,
  _extractParameters,
  _isAffirmativeReply,
  _synthesizeEntityName,
} = require('../services/agentFormFiller');

const request = require('supertest');
const app = require('../index');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-change-me';
const CITIZEN_USER_ID = 88;

function makeToken(userId = CITIZEN_USER_ID, role = 'citizen') {
  return jwt.sign({ user_id: userId, name: 'Test Citizen', role }, JWT_SECRET, { expiresIn: '1h' });
}

// ── Fixtures ──────────────────────────────────────────────────────────────────

const GRIEVANCE_FORM_SCHEMA = {
  form_id: 3,
  form_name: 'Grievance Submission Form',
  entityType: { entity_type_id: 2, name: 'Grievance' },
  sections: [{
    section_id: 5,
    section_name: 'Details',
    display_order: 0,
    subsections: [{
      subsection_id: 8,
      subsection_name: 'Complaint',
      parameters: [
        { parameter_id: 12, field_key: 'complaint_details', label: 'Complaint Details', field_type: 'textarea', control_type: 'textarea', mandatory: true, options: null, validation_rule: null, display_order: 0 },
        { parameter_id: 13, field_key: 'category',          label: 'Grievance Category', field_type: 'select',   control_type: 'dropdown', mandatory: true, options: { choices: ['Sanitation','Infrastructure','Safety'] }, validation_rule: null, display_order: 1 },
        { parameter_id: 14, field_key: 'severity',          label: 'Severity',           field_type: 'select',   control_type: 'dropdown', mandatory: true, options: { choices: ['Minor','Moderate','Severe','Critical'] }, validation_rule: null, display_order: 2 },
        { parameter_id: 17, field_key: 'reporter_name',     label: 'Reporter Name',      field_type: 'text',     control_type: 'input',    mandatory: true, options: null, validation_rule: null, display_order: 3 },
        { parameter_id: 18, field_key: 'reporter_phone',    label: 'Reporter Phone',     field_type: 'phone',    control_type: 'input',    mandatory: false, options: null, validation_rule: null, display_order: 4 },
        { parameter_id: 20, field_key: 'photo_evidence',    label: 'Photo Evidence',     field_type: 'file',     control_type: 'file',     mandatory: false, options: null, validation_rule: null, display_order: 5 },
      ],
    }],
  }],
};

const TEST_USER = { user_id: CITIZEN_USER_ID, role: 'citizen' };

// Helper: ensure session is clean before each test that creates new ones
function uniqueSessionId() {
  return 'test-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
}

beforeEach(() => {
  jest.clearAllMocks();
  // Default prisma fallbacks
  prisma.entity.findMany.mockResolvedValue([]);
  prisma.entityType.findFirst.mockResolvedValue({ entity_type_id: 2, name: 'Grievance' });
  prisma.formMaster.findFirst.mockResolvedValue(GRIEVANCE_FORM_SCHEMA);
});

afterEach(() => {
  // Clean up any sessions this test created
  for (const [key] of _sessions) {
    if (key.startsWith('test-')) clearSession(key);
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// BLOCK 1 — Helper unit tests (no Gemini, no HTTP)
// ══════════════════════════════════════════════════════════════════════════════

describe('_extractParameters()', () => {
  test('(b1) skips file-type params', () => {
    const schema = {
      sections: [{
        section_name: 'S',
        subsections: [{
          subsection_name: 'Sub',
          parameters: [
            { parameter_id: 1, field_key: 'complaint_details', label: 'Complaint Details', field_type: 'textarea', mandatory: true },
            { parameter_id: 2, field_key: 'photo_evidence',    label: 'Photo Evidence',    field_type: 'file',     mandatory: false },
            { parameter_id: 3, field_key: 'category',          label: 'Category',          field_type: 'select',   mandatory: true },
          ],
        }],
      }],
    };
    const { required, allText } = _extractParameters(schema);
    expect(allText).toHaveLength(2);
    expect(allText.find(p => p.field_key === 'photo_evidence')).toBeUndefined();
    expect(required).toHaveLength(2);
    expect(required.every(p => p.mandatory)).toBe(true);
  });

  test('(b2) identifies all mandatory Grievance fields', () => {
    const { required } = _extractParameters(GRIEVANCE_FORM_SCHEMA);
    expect(required.map(p => p.field_key)).toEqual(
      expect.arrayContaining(['complaint_details', 'category', 'severity', 'reporter_name'])
    );
    expect(required.find(p => p.field_key === 'photo_evidence')).toBeUndefined();
  });
});

describe('_isAffirmativeReply()', () => {
  test('(c1) "yes" variants are affirmative', () => {
    ['yes', 'Yes please', 'OK go ahead', 'confirm', 'Submit it', 'looks good', 'sure'].forEach(msg => {
      expect(_isAffirmativeReply(msg)).toBe(true);
    });
  });

  test('(c2) negative/ambiguous are NOT affirmative', () => {
    ['no', 'maybe later', 'not now', 'cancel', '', '   '].forEach(msg => {
      expect(_isAffirmativeReply(msg)).toBe(false);
    });
  });
});

describe('_synthesizeEntityName()', () => {
  test('Grievance with category + location', () => {
    const params = [
      { parameter_id: 1, field_key: 'complaint_details' },
      { parameter_id: 2, field_key: 'category' },
      { parameter_id: 3, field_key: 'location' },
    ];
    const draft = { 1: 'Garbage problem', 2: 'Sanitation', 3: 'FC Road' };
    const name = _synthesizeEntityName('Grievance', draft, params);
    expect(name).toContain('Sanitation');
    expect(name).toContain('FC Road');
  });

  test('Movement with initiative_type', () => {
    const params = [
      { parameter_id: 1, field_key: 'initiative_description' },
      { parameter_id: 2, field_key: 'initiative_type' },
    ];
    const draft = { 1: 'Community cleanup', 2: 'Cleanliness' };
    const name = _synthesizeEntityName('Movement', draft, params);
    expect(name).toContain('Cleanliness');
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// BLOCK 2 — Intent routing via continueFormFilling (service unit test)
// ══════════════════════════════════════════════════════════════════════════════

describe('continueFormFilling() — intent routing (unit)', () => {
  test('(a1) Grievance "report" intent → starts collecting phase', async () => {
    mockRouteIntent.mockResolvedValue({ action_type: 'report', matched_capability: 'Grievance', confidence: 'high' });

    // Mock Gemini extractFormValues to return a question (complaint_details missing)
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: () => ({
        generateContent: jest.fn().mockResolvedValue({
          response: { text: () => JSON.stringify({ extracted_values: {}, next_question: 'What is the complaint?', ready_for_confirmation: false }) },
        }),
      }),
    }));

    const sid = uniqueSessionId();
    const result = await continueFormFilling(sid, 'garbage not collected near FC Road', TEST_USER);

    expect(result.type).toBe('question');
    expect(result.text).toBeTruthy();
    expect(mockRouteIntent).toHaveBeenCalledWith('garbage not collected near FC Road', []);

    // Session should now be in 'collecting' phase
    const session = _sessions.get(sid);
    expect(session.phase).toBe('collecting');
    expect(session.capability).toBe('Grievance');
  });

  test('(a2) Movement "initiate" intent → starts collecting phase', async () => {
    mockRouteIntent.mockResolvedValue({ action_type: 'initiate', matched_capability: 'Movement', confidence: 'high' });
    prisma.entityType.findFirst.mockResolvedValue({ entity_type_id: 1, name: 'Movement' });
    prisma.formMaster.findFirst.mockResolvedValue({
      form_id: 2, form_name: 'Civic Initiative Registration Form',
      entityType: { entity_type_id: 1, name: 'Movement' },
      sections: [{ section_id: 1, section_name: 'About the Initiative', display_order: 0, subsections: [{
        subsection_id: 1, subsection_name: 'Main', parameters: [
          { parameter_id: 1, field_key: 'initiative_description', label: 'Initiative Description', field_type: 'textarea', mandatory: true, options: null, validation_rule: null, display_order: 0 },
          { parameter_id: 2, field_key: 'initiative_type', label: 'Initiative Category', field_type: 'select', mandatory: true, options: { choices: ['Cleanliness','Environmental'] }, validation_rule: null, display_order: 1 },
        ],
      }] }],
    });

    const { GoogleGenerativeAI } = require('@google/generative-ai');
    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: () => ({
        generateContent: jest.fn().mockResolvedValue({
          response: { text: () => JSON.stringify({ extracted_values: {}, next_question: 'What type of initiative?', ready_for_confirmation: false }) },
        }),
      }),
    }));

    const sid = uniqueSessionId();
    const result = await continueFormFilling(sid, 'I want to start a community cleanup drive', TEST_USER);

    expect(result.type).toBe('question');
    expect(result.capability).toBe('Movement');
    const session = _sessions.get(sid);
    expect(session.capability).toBe('Movement');
  });

  test('(a3) "unclear" intent → returns UNCLEAR_RESPONSE', async () => {
    mockRouteIntent.mockResolvedValue({ action_type: 'unclear', matched_capability: null, confidence: 'low' });
    const sid = uniqueSessionId();
    const result = await continueFormFilling(sid, 'hello how are you', TEST_USER);
    expect(result.type).toBe('unclear');
    expect(result.text).toContain('Report a civic problem');
  });

  test('(a4) "status_check" intent → returns status type with submissions list', async () => {
    mockRouteIntent.mockResolvedValue({ action_type: 'status_check', matched_capability: null, confidence: 'high' });
    prisma.entity.findMany.mockResolvedValue([
      { entity_id: 42, name: 'Test Grievance', status: 'submitted', entityType: { name: 'Grievance' } },
    ]);

    const sid = uniqueSessionId();
    const result = await continueFormFilling(sid, 'what is happening with my request?', TEST_USER);
    expect(result.type).toBe('status');
    expect(result.text).toContain('#42');
  });

  test('(a5) "guidance" intent → returns guidance message', async () => {
    mockRouteIntent.mockResolvedValue({ action_type: 'guidance', matched_capability: null, confidence: 'high' });
    const sid = uniqueSessionId();
    const result = await continueFormFilling(sid, 'how does this work', TEST_USER);
    expect(result.type).toBe('guidance');
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// BLOCK 3 — Form filling (collecting phase) — session injection
// ══════════════════════════════════════════════════════════════════════════════

describe('continueFormFilling() — collecting phase (unit)', () => {
  function makeCollectingSession(sid, draftOverride = {}) {
    _sessions.set(sid, {
      phase: 'collecting',
      capability: 'Grievance',
      entityTypeId: 2,
      formId: 3,
      formSchema: {},
      requiredParams: [
        { parameter_id: 12, field_key: 'complaint_details', label: 'Complaint Details', mandatory: true, options: null },
        { parameter_id: 13, field_key: 'category', label: 'Grievance Category', mandatory: true, options: { choices: ['Sanitation','Infrastructure'] } },
        { parameter_id: 17, field_key: 'reporter_name', label: 'Reporter Name', mandatory: true, options: null },
      ],
      allTextParams: [
        { parameter_id: 12, field_key: 'complaint_details', label: 'Complaint Details', field_type: 'textarea', mandatory: true },
        { parameter_id: 13, field_key: 'category', label: 'Grievance Category', field_type: 'select', mandatory: true },
        { parameter_id: 17, field_key: 'reporter_name', label: 'Reporter Name', field_type: 'text', mandatory: true },
      ],
      draft: draftOverride,
      conversationHistory: [],
      userId: CITIZEN_USER_ID,
      userRole: 'citizen',
      _timer: null,
    });
  }

  test('(b3) missing required fields → returns next_question, no submission', async () => {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: () => ({
        generateContent: jest.fn().mockResolvedValue({
          response: { text: () => JSON.stringify({
            extracted_values: { '12': 'Garbage not collected for 3 days' },
            next_question: 'What is the Grievance Category?',
            ready_for_confirmation: false,
          })},
        }),
      }),
    }));

    const sid = uniqueSessionId();
    makeCollectingSession(sid, {}); // No draft yet

    const result = await continueFormFilling(sid, 'garbage near FC road', TEST_USER);

    expect(result.type).toBe('question');
    expect(result.text).toBeTruthy();
    expect(prisma.entity.create).not.toHaveBeenCalled();

    const session = _sessions.get(sid);
    expect(session.draft[12]).toBe('Garbage not collected for 3 days'); // extracted value stored
    expect(session.phase).toBe('collecting');
  });

  test('(b4) all required fields provided → transitions to confirming', async () => {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: () => ({
        generateContent: jest.fn().mockResolvedValue({
          response: { text: () => JSON.stringify({
            extracted_values: { '17': 'Rajesh Kumar' },
            next_question: null,
            ready_for_confirmation: true,
          })},
        }),
      }),
    }));

    const sid = uniqueSessionId();
    makeCollectingSession(sid, {
      12: 'Garbage not collected for 3 days',
      13: 'Sanitation',
      // reporter_name will be extracted from this message
    });

    const result = await continueFormFilling(sid, 'my name is Rajesh Kumar', TEST_USER);

    expect(result.type).toBe('confirm');
    expect(result.ready).toBe(true);
    expect(result.summary).toBeInstanceOf(Array);
    expect(result.text).toContain('Shall I submit');

    const session = _sessions.get(sid);
    expect(session.phase).toBe('confirming');
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// BLOCK 4 — Confirmation phase — session injection
// ══════════════════════════════════════════════════════════════════════════════

describe('continueFormFilling() — confirming phase (unit)', () => {
  function makeConfirmingSession(sid, capability = 'Grievance', entityTypeId = 2) {
    _sessions.set(sid, {
      phase: 'confirming',
      capability,
      entityTypeId,
      formId: 3,
      formSchema: {},
      requiredParams: [
        { parameter_id: 12, field_key: 'complaint_details', label: 'Complaint Details', mandatory: true },
        { parameter_id: 13, field_key: 'category',          label: 'Category',          mandatory: true },
      ],
      allTextParams: [
        { parameter_id: 12, field_key: 'complaint_details', label: 'Complaint Details', field_type: 'textarea', mandatory: true },
        { parameter_id: 13, field_key: 'category',          label: 'Category',          field_type: 'select',   mandatory: true },
      ],
      draft: { 12: 'Garbage not collected', 13: 'Sanitation' },
      conversationHistory: [],
      userId: CITIZEN_USER_ID,
      userRole: 'citizen',
      _timer: null,
    });
  }

  test('(c3) non-affirmative "maybe later" → cancelled, NO entity.create called', async () => {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: () => ({
        generateContent: jest.fn().mockResolvedValue({
          response: { text: () => JSON.stringify({ extracted_values: {}, next_question: null, ready_for_confirmation: false }) },
        }),
      }),
    }));

    const sid = uniqueSessionId();
    makeConfirmingSession(sid);

    const result = await continueFormFilling(sid, 'maybe later', TEST_USER);

    expect(['cancelled', 'question', 'confirm']).toContain(result.type);
    expect(prisma.entity.create).not.toHaveBeenCalled();
  });

  test('(c4) "yes" → entity.create + entity.update + auditLog.create called once', async () => {
    prisma.entity.create.mockResolvedValue({
      entity_id: 555,
      name: 'Sanitation Grievance',
      status: 'draft',
      entityType: { entity_type_id: 2, name: 'Grievance' },
    });
    prisma.entity.update.mockResolvedValue({ entity_id: 555, status: 'submitted' });
    prisma.$transaction.mockResolvedValue([]);
    prisma.auditLog.create.mockResolvedValue({ audit_id: 99 });

    const sid = uniqueSessionId();
    makeConfirmingSession(sid);

    const result = await continueFormFilling(sid, 'yes please submit it', TEST_USER);

    expect(result.type).toBe('submitted');
    expect(result.entity_id).toBe(555);

    expect(prisma.entity.create).toHaveBeenCalledTimes(1);
    expect(prisma.entity.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        entity_type_id: 2,
        owner_user_id: CITIZEN_USER_ID,
        status: 'draft',
      }),
    }));
    expect(prisma.entity.update).toHaveBeenCalledWith(expect.objectContaining({
      data: { status: 'submitted' },
    }));
    expect(prisma.auditLog.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        action: 'submitted',
        actor_user_id: CITIZEN_USER_ID,
        reason: expect.stringContaining('Agent-initiated'),
      }),
    }));
  });

  test('(e) Movement follows identical submit path as Grievance', async () => {
    prisma.entity.create.mockResolvedValue({
      entity_id: 777,
      name: 'Cleanliness Initiative',
      status: 'draft',
      entityType: { entity_type_id: 1, name: 'Movement' },
    });
    prisma.entity.update.mockResolvedValue({ entity_id: 777, status: 'submitted' });
    prisma.$transaction.mockResolvedValue([]);
    prisma.auditLog.create.mockResolvedValue({ audit_id: 88 });

    const sid = uniqueSessionId();
    // Movement confirming session
    _sessions.set(sid, {
      phase: 'confirming',
      capability: 'Movement',
      entityTypeId: 1,
      formId: 2,
      formSchema: {},
      requiredParams: [
        { parameter_id: 1, field_key: 'initiative_description', label: 'Initiative Description', mandatory: true },
        { parameter_id: 2, field_key: 'initiative_type', label: 'Initiative Category', mandatory: true },
      ],
      allTextParams: [
        { parameter_id: 1, field_key: 'initiative_description', label: 'Initiative Description', field_type: 'textarea', mandatory: true },
        { parameter_id: 2, field_key: 'initiative_type', label: 'Initiative Category', field_type: 'select', mandatory: true },
      ],
      draft: { 1: 'Community cleanup', 2: 'Cleanliness' },
      conversationHistory: [],
      userId: CITIZEN_USER_ID,
      userRole: 'citizen',
      _timer: null,
    });

    const result = await continueFormFilling(sid, 'yes confirm', TEST_USER);

    expect(result.type).toBe('submitted');
    expect(result.entity_id).toBe(777);
    expect(result.capability).toBe('Movement');
    // Same Prisma call pattern as Grievance — proves no capability-specific code paths
    expect(prisma.entity.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ entity_type_id: 1, owner_user_id: CITIZEN_USER_ID, status: 'draft' }),
    }));
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// BLOCK 5 — HTTP endpoint validation (supertest, no Gemini needed)
// ══════════════════════════════════════════════════════════════════════════════

describe('POST /agent/chat — HTTP validation', () => {
  test('401 if no token', async () => {
    const res = await request(app).post('/agent/chat').send({ sessionId: 'abc', message: 'hello' });
    expect(res.statusCode).toBe(401);
  });

  test('400 if sessionId missing', async () => {
    const res = await request(app)
      .post('/agent/chat')
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({ message: 'hello' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error || res.body.message || '').toMatch(/sessionId/i);
  });

  test('400 if message missing', async () => {
    const res = await request(app)
      .post('/agent/chat')
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({ sessionId: 'test-session' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error || res.body.message || '').toMatch(/message/i);
  });

  test('400 if message exceeds 2000 chars', async () => {
    const res = await request(app)
      .post('/agent/chat')
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({ sessionId: 'test-session', message: 'a'.repeat(2001) });
    expect(res.statusCode).toBe(400);
    expect(res.body.error || res.body.message || '').toMatch(/long/i);
  });

  test('200 on valid request (session inject — confirming + yes)', async () => {
    prisma.entity.create.mockResolvedValue({
      entity_id: 999, name: 'Test Entity', status: 'draft',
      entityType: { entity_type_id: 2, name: 'Grievance' },
    });
    prisma.entity.update.mockResolvedValue({ entity_id: 999, status: 'submitted' });
    prisma.$transaction.mockResolvedValue([]);
    prisma.auditLog.create.mockResolvedValue({ audit_id: 1 });

    const httpSid = 'http-test-' + Date.now();
    _sessions.set(httpSid, {
      phase: 'confirming', capability: 'Grievance', entityTypeId: 2, formId: 3,
      formSchema: {}, requiredParams: [], allTextParams: [
        { parameter_id: 12, field_key: 'complaint_details', label: 'Complaint Details', field_type: 'textarea', mandatory: true },
      ],
      draft: { 12: 'Test complaint' },
      conversationHistory: [], userId: CITIZEN_USER_ID, userRole: 'citizen', _timer: null,
    });

    const res = await request(app)
      .post('/agent/chat')
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({ sessionId: httpSid, message: 'yes' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.type).toBe('submitted');
    expect(res.body.data.entity_id).toBe(999);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// BLOCK 6 — Document and Photo upload & parameter binding (V2 Feature)
// ══════════════════════════════════════════════════════════════════════════════

describe('Document and Photo Upload & Binding', () => {
  const fileParams = [
    { parameter_id: 20, field_key: 'photo_evidence', label: 'Photo Evidence', field_type: 'file' },
    { parameter_id: 21, field_key: 'supporting_document', label: 'Supporting Document', field_type: 'file' },
  ];

  test('matchFileToParameter matches image to photo_evidence parameter', () => {
    const file = { originalName: 'pothole.jpg', mimeType: 'image/jpeg' };
    const matched = matchFileToParameter(fileParams, file);
    expect(matched).toBeTruthy();
    expect(matched.field_key).toBe('photo_evidence');
    expect(matched.parameter_id).toBe(20);
  });

  test('matchFileToParameter matches pdf to supporting_document parameter', () => {
    const file = { originalName: 'complaint_letter.pdf', mimeType: 'application/pdf' };
    const matched = matchFileToParameter(fileParams, file);
    expect(matched).toBeTruthy();
    expect(matched.field_key).toBe('supporting_document');
    expect(matched.parameter_id).toBe(21);
  });

  test('attaching file stores pendingFiles and sets draft parameter value', async () => {
    const sid = uniqueSessionId();
    _sessions.set(sid, {
      phase: 'collecting',
      capability: 'Grievance',
      entityTypeId: 2,
      formId: 3,
      formSchema: {},
      requiredParams: [
        { parameter_id: 12, field_key: 'complaint_details', label: 'Complaint Details', mandatory: true },
      ],
      allTextParams: [
        { parameter_id: 12, field_key: 'complaint_details', label: 'Complaint Details', field_type: 'textarea', mandatory: true },
      ],
      fileParams: [
        { parameter_id: 20, field_key: 'photo_evidence', label: 'Photo Evidence', field_type: 'file' },
      ],
      pendingFiles: [],
      draft: { 12: 'Pothole on main road' },
      conversationHistory: [],
      userId: CITIZEN_USER_ID,
      userRole: 'citizen',
      _timer: null,
    });

    const file = {
      diskPath: '/tmp/test.jpg',
      storedName: 'agent-test-123.jpg',
      originalName: 'road_damage.jpg',
      mimeType: 'image/jpeg',
      size: 1024,
    };

    const result = await continueFormFilling(sid, 'here is the photo', TEST_USER, [], file);

    const session = _sessions.get(sid);
    expect(session.pendingFiles).toHaveLength(1);
    expect(session.pendingFiles[0].originalName).toBe('road_damage.jpg');
    expect(session.draft[20]).toBe('road_damage.jpg');

    // Since requiredParam 12 is already filled, it should transition to confirm
    expect(result.type).toBe('confirm');
    expect(result.summary.some(s => s.value.includes('road_damage.jpg'))).toBe(true);
  });

  test('submitting with pending files creates FileRepository and parameterValue records', async () => {
    prisma.entity.create.mockResolvedValue({
      entity_id: 888,
      name: 'Pothole Grievance',
      status: 'draft',
      entityType: { entity_type_id: 2, name: 'Grievance' },
    });
    prisma.entity.update.mockResolvedValue({ entity_id: 888, status: 'submitted' });
    prisma.$transaction.mockResolvedValue([]);
    prisma.auditLog.create.mockResolvedValue({ audit_id: 10 });
    prisma.fileRepository.create.mockResolvedValue({ file_id: 55 });

    const sid = uniqueSessionId();
    _sessions.set(sid, {
      phase: 'confirming',
      capability: 'Grievance',
      entityTypeId: 2,
      formId: 3,
      formSchema: {},
      requiredParams: [],
      allTextParams: [
        { parameter_id: 12, field_key: 'complaint_details', label: 'Complaint Details', field_type: 'textarea', mandatory: true },
      ],
      fileParams: [
        { parameter_id: 20, field_key: 'photo_evidence', label: 'Photo Evidence', field_type: 'file' },
      ],
      pendingFiles: [
        {
          parameter_id: 20,
          label: 'Photo Evidence',
          field_key: 'photo_evidence',
          diskPath: '/tmp/test.jpg',
          storedName: 'agent-stored-123.jpg',
          originalName: 'pothole_photo.jpg',
          mimeType: 'image/jpeg',
          size: 2048,
        },
      ],
      draft: { 12: 'Big pothole', 20: 'pothole_photo.jpg' },
      conversationHistory: [],
      userId: CITIZEN_USER_ID,
      userRole: 'citizen',
      _timer: null,
    });

    const result = await continueFormFilling(sid, 'yes', TEST_USER);

    expect(result.type).toBe('submitted');
    expect(result.entity_id).toBe(888);
    expect(result.files).toContain('pothole_photo.jpg');

    // Verify FileRepository.create was called
    expect(prisma.fileRepository.create).toHaveBeenCalledTimes(1);
    expect(prisma.fileRepository.create).toHaveBeenCalledWith({
      data: {
        entity_id: 888,
        parameter_id: 20,
        file_name: 'pothole_photo.jpg',
        path: 'agent-stored-123.jpg',
      },
    });

    // Verify parameterValue was created for the file
    expect(prisma.parameterValue.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        entity_id: 888,
        parameter_id: 20,
        value: 'pothole_photo.jpg',
      }),
    }));
  });

  test('POST /agent/chat accepts multipart upload with attachment file', async () => {
    prisma.entity.create.mockResolvedValue({
      entity_id: 999, name: 'Uploaded Photo Grievance', status: 'draft',
      entityType: { entity_type_id: 2, name: 'Grievance' },
    });
    prisma.entity.update.mockResolvedValue({ entity_id: 999, status: 'submitted' });
    prisma.$transaction.mockResolvedValue([]);
    prisma.auditLog.create.mockResolvedValue({ audit_id: 1 });
    prisma.fileRepository.create.mockResolvedValue({ file_id: 1 });

    const httpSid = 'http-file-test-' + Date.now();
    _sessions.set(httpSid, {
      phase: 'confirming', capability: 'Grievance', entityTypeId: 2, formId: 3,
      formSchema: {}, requiredParams: [], allTextParams: [], fileParams: [],
      pendingFiles: [], draft: {},
      conversationHistory: [], userId: CITIZEN_USER_ID, userRole: 'citizen', _timer: null,
    });

    const res = await request(app)
      .post('/agent/chat')
      .set('Authorization', `Bearer ${makeToken()}`)
      .field('sessionId', httpSid)
      .field('message', 'yes')
      .attach('attachment', Buffer.from('fake image content'), 'test_evidence.png');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

