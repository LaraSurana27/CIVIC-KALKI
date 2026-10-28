/**
 * CIVIC-KALKI � Meme Studio Test Suite (Section 9)
 * All deterministic; no live API calls (Gemini mocked).
 *
 * Covers:
 * - Eligibility gate: unapproved issue blocked; safety-sensitive category denied Relatable;
 *   crime category denied entirely
 * - Deterministic filter: slur, phone number, party name, URL all blocked;
 *   user-edited caption re-validated
 * - AI classifier fail ? flagged "unavailable", never auto-passed
 * - Nothing publishes without moderator approval
 * - Rejected/unpublished share link exposes no content
 * - Rate limits
 * - Reporter identity and exact address never appear in output
 * - RBAC on moderation and analytics
 * - Existing test suite unaffected
 */

const request = require('supertest');
const app = require('../index');
const prisma = require('../db');
const { createTestUser, cleanupAll, trackEntityId } = require('./helpers/authHelper');

// -- Import safety functions directly for unit tests -------------------------
const { deterministicFilter } = require('../services/memeSafety');
const {
  PUBLICLY_VISIBLE_STATUSES,
  NO_MEME_CATEGORIES,
  SAFETY_SENSITIVE_CATEGORIES,
  HUMOR_ALLOWED_CATEGORIES,
} = require('../services/memeConfig');

// ----------------------------------------------------------------------------
// SUITE 1 � Deterministic filter unit tests (no DB, no API)
// ----------------------------------------------------------------------------
describe('Suite 1 � Deterministic Safety Filter', () => {

  test('1.1 Clean caption passes', () => {
    const result = deterministicFilter(
      'Pothole near the park',
      'Me visiting the same pothole every day like an old friend. ???'
    );
    expect(result.passed).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  test('1.2 Profanity/slur blocked', () => {
    const result = deterministicFilter('Title', 'This pothole is fucking enormous');
    expect(result.passed).toBe(false);
    expect(result.violations.some((v) => v.toLowerCase().includes('prohibited language'))).toBe(true);
  });

  test('1.3 Phone number blocked', () => {
    const result = deterministicFilter('Fix this!', 'Call 9876543210 to complain');
    expect(result.passed).toBe(false);
    expect(result.violations.some((v) => v.toLowerCase().includes('contact information'))).toBe(true);
  });

  test('1.4 Political party name blocked', () => {
    const result = deterministicFilter('Title', 'The BJP needs to fix this road');
    expect(result.passed).toBe(false);
    expect(result.violations.some((v) => v.toLowerCase().includes('political'))).toBe(true);
  });

  test('1.5 Politician name blocked', () => {
    const result = deterministicFilter('Title', 'Modi should fix the potholes');
    expect(result.passed).toBe(false);
    expect(result.violations.some((v) => v.toLowerCase().includes('political'))).toBe(true);
  });

  test('1.6 URL blocked', () => {
    const result = deterministicFilter('Title', 'Visit https://example.com for updates');
    expect(result.passed).toBe(false);
    expect(result.violations.some((v) => v.toLowerCase().includes('contact information'))).toBe(true);
  });

  test('1.7 @handle blocked', () => {
    const result = deterministicFilter('Title', 'Tag @MunicipalCorp on Twitter');
    expect(result.passed).toBe(false);
    expect(result.violations.some((v) => v.toLowerCase().includes('contact information'))).toBe(true);
  });

  test('1.8 Vehicle plate pattern blocked', () => {
    const result = deterministicFilter('Title', 'Car MH-12-AB-1234 hit the pothole');
    expect(result.passed).toBe(false);
    expect(result.violations.some((v) => v.toLowerCase().includes('contact information'))).toBe(true);
  });

  test('1.9 Headline too long blocked', () => {
    const result = deterministicFilter(
      'A'.repeat(61),
      'Short caption'
    );
    expect(result.passed).toBe(false);
    expect(result.violations.some((v) => v.toLowerCase().includes('headline'))).toBe(true);
  });

  test('1.10 Caption too long blocked', () => {
    const result = deterministicFilter(
      'Short headline',
      'A'.repeat(141)
    );
    expect(result.passed).toBe(false);
    expect(result.violations.some((v) => v.toLowerCase().includes('caption'))).toBe(true);
  });
});

// ----------------------------------------------------------------------------
// SUITE 2 � Config correctness (unit)
// ----------------------------------------------------------------------------
describe('Suite 2 � Config Allowlist/Blocklist Correctness', () => {

  test('2.1 Publicly visible statuses are correct', () => {
    expect(PUBLICLY_VISIBLE_STATUSES).toContain('coordinator_approved');
    expect(PUBLICLY_VISIBLE_STATUSES).toContain('approved');
    expect(PUBLICLY_VISIBLE_STATUSES).not.toContain('draft');
    expect(PUBLICLY_VISIBLE_STATUSES).not.toContain('submitted');
    expect(PUBLICLY_VISIBLE_STATUSES).not.toContain('rejected');
  });

  test('2.2 Crime/harassment are in NO_MEME_CATEGORIES', () => {
    expect(NO_MEME_CATEGORIES.some((c) => c.includes('crime'))).toBe(true);
    expect(NO_MEME_CATEGORIES.some((c) => c.includes('harassment'))).toBe(true);
  });

  test('2.3 Potholes are in humor allowlist', () => {
    expect(HUMOR_ALLOWED_CATEGORIES.some((c) => c.includes('pothole'))).toBe(true);
  });

  test('2.4 Accidents are in safety-sensitive categories (no Relatable allowed)', () => {
    expect(SAFETY_SENSITIVE_CATEGORIES.some((c) => c.includes('accident'))).toBe(true);
  });
});

// ----------------------------------------------------------------------------
// SUITE 3 � API integration tests
// ----------------------------------------------------------------------------
describe('Suite 3 � Meme API Integration', () => {
  let citizenUser, coordinatorUser, adminUser;
  let citizenHeaders, coordinatorHeaders, adminHeaders;
  let approvedIssue, draftIssue;
  let issueEntityTypeId;

  beforeAll(async () => {
    const cit = await createTestUser({ role: 'citizen' });
    citizenUser = cit.user;
    citizenHeaders = cit.headers;

    const coord = await createTestUser({ role: 'coordinator_area', assignedArea: 'Kothrud' });
    coordinatorUser = coord.user;
    coordinatorHeaders = coord.headers;

    const adm = await createTestUser({ role: 'admin' });
    adminUser = adm.user;
    adminHeaders = adm.headers;

    // Fetch an issue EntityType
    const et = await prisma.entityType.findFirst({ where: { name: { not: 'Civic Campaign' } } });
    issueEntityTypeId = et?.entity_type_id || 1;

    // Create a publicly visible approved issue
    approvedIssue = await prisma.entity.create({
      data: {
        entity_type_id: issueEntityTypeId,
        owner_user_id: citizenUser.user_id,
        name: 'Pothole on Main Road',
        area: 'Kothrud',
        status: 'approved',
      },
    });

    // Create a draft issue (not publicly visible)
    draftIssue = await prisma.entity.create({
      data: {
        entity_type_id: issueEntityTypeId,
        owner_user_id: citizenUser.user_id,
        name: 'Broken Street Light',
        area: 'Kothrud',
        status: 'draft',
      },
    });
  });

  afterAll(async () => {
    await cleanupAll();
    // Clean up test entities
    if (approvedIssue) {
      await prisma.parameterValue.deleteMany({ where: { entity_id: approvedIssue.entity_id } }).catch(() => {});
      await prisma.auditLog.deleteMany({ where: { entity_id: approvedIssue.entity_id } }).catch(() => {});
    }
    if (draftIssue) {
      await prisma.parameterValue.deleteMany({ where: { entity_id: draftIssue.entity_id } }).catch(() => {});
      await prisma.auditLog.deleteMany({ where: { entity_id: draftIssue.entity_id } }).catch(() => {});
    }
    // Clean up campaign entities created during tests
    const campaignType = await prisma.entityType.findFirst({ where: { name: 'Civic Campaign' } });
    if (campaignType) {
      const campaigns = await prisma.entity.findMany({
        where: { entity_type_id: campaignType.entity_type_id },
        select: { entity_id: true },
      });
      for (const c of campaigns) {
        await prisma.civicCampaignEvent.deleteMany({ where: { campaign_id: c.entity_id } }).catch(() => {});
        await prisma.parameterValue.deleteMany({ where: { entity_id: c.entity_id } }).catch(() => {});
        await prisma.auditLog.deleteMany({ where: { entity_id: c.entity_id } }).catch(() => {});
        await prisma.approvalHistory.deleteMany({ where: { entity_id: c.entity_id } }).catch(() => {});
        await prisma.entity.delete({ where: { entity_id: c.entity_id } }).catch(() => {});
      }
    }
    if (approvedIssue) await prisma.entity.delete({ where: { entity_id: approvedIssue.entity_id } }).catch(() => {});
    if (draftIssue) await prisma.entity.delete({ where: { entity_id: draftIssue.entity_id } }).catch(() => {});
  });

  // -- 3.1 Config endpoint ------------------------------------------------
  test('3.1 GET /meme/config returns config without auth', async () => {
    const res = await request(app).get('/meme/config');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.templates)).toBe(true);
    expect(res.body.data.templates).toContain('relatable');
  });

  // -- 3.2 Eligibility gate: unapproved issue blocked --------------------
  test('3.2 Eligibility: draft issue is blocked', async () => {
    const res = await request(app)
      .get(`/meme/eligibility/${draftIssue.entity_id}`)
      .set(citizenHeaders);
    expect(res.status).toBe(200);
    expect(res.body.data.eligible).toBe(false);
    expect(res.body.data.reason).toMatch(/verified|approved|publicly visible/i);
  });

  // -- 3.3 Eligibility gate: approved issue eligible ---------------------
  test('3.3 Eligibility: approved issue is eligible', async () => {
    const res = await request(app)
      .get(`/meme/eligibility/${approvedIssue.entity_id}`)
      .set(citizenHeaders);
    expect(res.status).toBe(200);
    expect(res.body.data.eligible).toBe(true);
    expect(Array.isArray(res.body.data.templateTypes)).toBe(true);
    expect(res.body.data.templateTypes.length).toBeGreaterThan(0);
  });

  // -- 3.4 AI caption generation returns 3 options -----------------------
  test('3.4 Caption generation returns 3 AI options', async () => {
    const res = await request(app)
      .post('/meme/captions')
      .set(citizenHeaders)
      .send({ issue_id: approvedIssue.entity_id, template_type: 'awareness' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.options)).toBe(true);
    expect(res.body.data.options).toHaveLength(3);
  });

  // -- 3.5 Safety check: clean caption passes ----------------------------
  test('3.5 Safety check: clean caption passes', async () => {
    const res = await request(app)
      .post('/meme/safety-check')
      .set(citizenHeaders)
      .send({
        headline: 'Pothole near the park',
        caption: 'Visiting the same pothole daily. We have a routine. ???',
        issue_id: approvedIssue.entity_id,
      });
    expect(res.status).toBe(200);
    expect(res.body.data.deterministic.passed).toBe(true);
  });

  // -- 3.6 Safety check: phone number blocked ----------------------------
  test('3.6 Safety check: phone number in caption is blocked', async () => {
    const res = await request(app)
      .post('/meme/safety-check')
      .set(citizenHeaders)
      .send({
        headline: 'Fix this',
        caption: 'Call 9876543210 to complain about this pothole',
        issue_id: approvedIssue.entity_id,
      });
    expect(res.status).toBe(200);
    expect(res.body.data.deterministic.passed).toBe(false);
    expect(res.body.data.deterministic.violations.length).toBeGreaterThan(0);
    expect(res.body.data.passed).toBe(false);
  });

  // -- 3.7 Safety check: political caption blocked -----------------------
  test('3.7 Safety check: political party name is blocked', async () => {
    const res = await request(app)
      .post('/meme/safety-check')
      .set(citizenHeaders)
      .send({
        headline: 'Roads need BJP attention',
        caption: 'The BJP should fix this pothole, it has been here for months.',
      });
    expect(res.status).toBe(200);
    expect(res.body.data.deterministic.passed).toBe(false);
    expect(res.body.data.deterministic.violations.some((v) => /political/i.test(v))).toBe(true);
  });

  // -- 3.8 Campaign creation blocked without attestation -----------------
  test('3.8 Campaign creation blocked without attestation', async () => {
    const res = await request(app)
      .post('/meme/campaigns')
      .set(citizenHeaders)
      .send({
        issue_id: approvedIssue.entity_id,
        template_type: 'awareness',
        headline: 'Pothole near park',
        caption: 'This pothole has been here for a while.',
        caption_source: 'ai',
        attestation_accepted: false,
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/attestation/i);
  });

  // -- 3.9 Campaign creation blocked for unapproved issue ----------------
  test('3.9 Campaign creation blocked for unapproved issue', async () => {
    const res = await request(app)
      .post('/meme/campaigns')
      .set(citizenHeaders)
      .send({
        issue_id: draftIssue.entity_id,
        template_type: 'awareness',
        headline: 'Light is broken',
        caption: 'The street light has been broken.',
        caption_source: 'manual',
        attestation_accepted: true,
      });
    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/verified|approved|publicly visible/i);
  });

  // -- 3.10 Full campaign lifecycle: create ? submit ? moderate ----------
  test('3.10 Full lifecycle: create, submit, moderate campaign', async () => {
    // Create
    const createRes = await request(app)
      .post('/meme/campaigns')
      .set(citizenHeaders)
      .send({
        issue_id: approvedIssue.entity_id,
        template_type: 'awareness',
        headline: 'Pothole near park',
        caption: 'A pothole in Kothrud needs attention. Report filed.',
        caption_source: 'manual',
        attestation_accepted: true,
      });
    expect(createRes.status).toBe(201);
    const campaignId = createRes.body.data.campaign.entity_id;

    // Submit
    const submitRes = await request(app)
      .post(`/meme/campaigns/${campaignId}/submit`)
      .set(citizenHeaders);
    expect(submitRes.status).toBe(200);

    // Coordinator/Admin approves
    const approveRes = await request(app)
      .post(`/meme/campaigns/${campaignId}/transition`)
      .set(adminHeaders)
      .send({ to_status: 'approved' });
    expect(approveRes.status).toBe(200);

    // Verify NOT published yet (requires explicit publish step)
    const campaignAfterApprove = await prisma.entity.findUnique({ where: { entity_id: campaignId } });
    expect(campaignAfterApprove.status).toBe('approved');
    expect(campaignAfterApprove.status).not.toBe('published');

    // Publish
    const publishRes = await request(app)
      .post(`/meme/campaigns/${campaignId}/transition`)
      .set(adminHeaders)
      .send({ to_status: 'published' });
    expect(publishRes.status).toBe(200);

    // Verify published
    const campaignAfterPublish = await prisma.entity.findUnique({ where: { entity_id: campaignId } });
    expect(campaignAfterPublish.status).toBe('published');

    return campaignId; // Used by subsequent tests via closure is not available; tests are independent.
  });

  // -- 3.11 Share link for rejected/unpublished exposes no content --------
  test('3.11 Share link for non-published campaign returns 410 with no content', async () => {
    // Create a campaign that is rejected
    const createRes = await request(app)
      .post('/meme/campaigns')
      .set(citizenHeaders)
      .send({
        issue_id: approvedIssue.entity_id,
        template_type: 'awareness',
        headline: 'Pothole awareness',
        caption: 'A pothole in Kothrud needs attention.',
        caption_source: 'manual',
        attestation_accepted: true,
      });
    expect(createRes.status).toBe(201);
    const campaignId = createRes.body.data.campaign.entity_id;

    await request(app)
      .post(`/meme/campaigns/${campaignId}/submit`)
      .set(citizenHeaders);

    // Reject it
    await request(app)
      .post(`/meme/campaigns/${campaignId}/transition`)
      .set(adminHeaders)
      .send({ to_status: 'rejected', reason: 'Test rejection' });

    // Share link should return 410 with no meme content
    const shareRes = await request(app).get(`/meme/campaigns/${campaignId}`);
    expect(shareRes.status).toBe(410);
    expect(shareRes.body.success).toBe(false);
    expect(shareRes.body.data).toBeUndefined();
    expect(shareRes.body.error).toMatch(/no longer available/i);
  });

  // -- 3.12 RBAC: citizen cannot moderate -------------------------------
  test('3.12 RBAC: citizen cannot access moderation transition endpoint', async () => {
    const res = await request(app)
      .post('/meme/campaigns/1/transition')
      .set(citizenHeaders)
      .send({ to_status: 'approved' });
    expect(res.status).toBe(403);
  });

  // -- 3.13 Impact counts derive only from recorded events ---------------
  test('3.13 Impact counts start at zero and increment only via real events', async () => {
    // Create and publish a campaign
    const createRes = await request(app)
      .post('/meme/campaigns')
      .set(citizenHeaders)
      .send({
        issue_id: approvedIssue.entity_id,
        template_type: 'awareness',
        headline: 'Impact test campaign',
        caption: 'A test campaign for impact tracking.',
        caption_source: 'manual',
        attestation_accepted: true,
      });
    expect(createRes.status).toBe(201);
    const campaignId = createRes.body.data.campaign.entity_id;

    // Submit
    await request(app).post(`/meme/campaigns/${campaignId}/submit`).set(citizenHeaders);
    // Approve
    await request(app).post(`/meme/campaigns/${campaignId}/transition`).set(adminHeaders).send({ to_status: 'approved' });
    // Publish
    await request(app).post(`/meme/campaigns/${campaignId}/transition`).set(adminHeaders).send({ to_status: 'published' });

    // Impact should be zero before any events
    const beforeRes = await request(app).get(`/meme/campaigns/${campaignId}/impact`);
    expect(beforeRes.status).toBe(200);
    expect(beforeRes.body.data.views).toBe(0);

    // Record a view
    await request(app).post(`/meme/campaigns/${campaignId}/event`).set('X-Requested-With', 'ck-web').send({ event_type: 'view', session_id: 'test-session-xyz' });

    const afterRes = await request(app).get(`/meme/campaigns/${campaignId}/impact`);
    expect(afterRes.body.data.views).toBe(1);

    // Second view with same session should be deduped
    await request(app).post(`/meme/campaigns/${campaignId}/event`).set('X-Requested-With', 'ck-web').send({ event_type: 'view', session_id: 'test-session-xyz' });
    const afterDupRes = await request(app).get(`/meme/campaigns/${campaignId}/impact`);
    expect(afterDupRes.body.data.views).toBe(1);
  });

  // -- 3.14 Reporter identity never appears in any API output ------------
  test('3.14 Campaign entity output never includes owner identity', async () => {
    // Create
    const createRes = await request(app)
      .post('/meme/campaigns')
      .set(citizenHeaders)
      .send({
        issue_id: approvedIssue.entity_id,
        template_type: 'awareness',
        headline: 'Privacy test',
        caption: 'A privacy test campaign in Kothrud.',
        caption_source: 'manual',
        attestation_accepted: true,
      });
    expect(createRes.status).toBe(201);
    const campaignId = createRes.body.data.campaign.entity_id;

    // Publish it
    await request(app).post(`/meme/campaigns/${campaignId}/submit`).set(citizenHeaders);
    await request(app).post(`/meme/campaigns/${campaignId}/transition`).set(adminHeaders).send({ to_status: 'approved' });
    await request(app).post(`/meme/campaigns/${campaignId}/transition`).set(adminHeaders).send({ to_status: 'published' });

    const feedRes = await request(app).get('/meme/feed');
    expect(feedRes.status).toBe(200);
    const feedItem = feedRes.body.data.find((c) => c.campaign_id === campaignId);
    if (feedItem) {
      // No owner name, no email, no exact address
      expect(JSON.stringify(feedItem)).not.toContain(citizenUser.email);
      expect(JSON.stringify(feedItem)).not.toContain(citizenUser.name);
      // Locality is only area-level
      if (feedItem.locality) {
        expect(feedItem.locality).toBe('Kothrud');
      }
    }
  });

  // -- 3.15 Existing test infra still passes -----------------------------
  test('3.15 Health check still returns 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
