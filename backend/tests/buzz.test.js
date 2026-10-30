/**
 * CIVIC-KALKI â€” Civic Buzz Feature Test Suite
 *
 * Covers:
 * 1. Models & CRUD: buzz_posts, buzz_votes, buzz_follows, buzz_comments, buzz_events, buzz_reports
 * 2. GET /buzz (published, pagination, vote count, follow state, linked status)
 * 3. POST /buzz (draft & published with safety check)
 * 4. PATCH /buzz/:id (edit/publish with author restriction)
 * 5. POST /buzz/:id/vote (toggle)
 * 6. POST /buzz/:id/follow (toggle)
 * 7. POST /buzz/:id/comments (with safety check) & GET /buzz/:id/comments
 * 8. POST /buzz/:id/event (anonymous & logged in)
 * 9. GET /buzz/:id/stats (views, click_issue, share, join derived only from buzz_events)
 * 10. POST /buzz/captions (Gemini caption generation)
 * 11. Safety validation: offensive text, personal data rejected with friendly reason
 * 12. POST /buzz/:id/report: auto-hiding upon 3 different user reports
 */

'use strict';

const request = require('supertest');

// Mock @google/generative-ai
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn(() => ({
      generateContent: jest.fn(async (prompt) => {
        if (global.__civicBuzzGeminiFail) {
          throw new Error('Gemini service connection error');
        }

        const isSafety = prompt.includes('safety classifier');
        if (isSafety) {
          if (global.__civicBuzzSimulateUnsafe) {
            return {
              response: {
                text: () => JSON.stringify({
                  safe: false,
                  reason: 'Contains inappropriate or misleading civic content.',
                }),
              },
            };
          }
          return {
            response: {
              text: () => JSON.stringify({ safe: true }),
            },
          };
        }

        // Captions generation
        return {
          response: {
            text: () => JSON.stringify({
              captions: [
                { caption: 'Notice the pothole on Baner road before your tires do.', cta_text: 'Support Road Repair' },
                { caption: 'Baner road pothole: Still here, still deep.', cta_text: 'Report to Ward Office' },
                { caption: 'Every commute deserves safe roads.', cta_text: 'Join Civic Initiative' },
              ],
              uses_only_provided_facts: true,
            }),
          },
        };
      }),
    })),
  })),
}));

const app = require('../index');
const prisma = require('../db');
const { createTestUser, cleanupTrackedEntities } = require('./helpers/authHelper');

describe('Civic Buzz Feature Suite', () => {
  let citizen1, citizen2, citizen3, citizen4, adminUser;
  let testEntity;
  let createdPostIds = [];

  beforeAll(async () => {
    citizen1  = await createTestUser({ role: 'citizen' });
    citizen2  = await createTestUser({ role: 'citizen' });
    citizen3  = await createTestUser({ role: 'citizen' });
    citizen4  = await createTestUser({ role: 'citizen' });
    adminUser = await createTestUser({ role: 'admin' });

    // Create an entity to link buzz posts to
    const entityType = await prisma.entityType.findFirst();
    testEntity = await prisma.entity.create({
      data: {
        name: 'FC Road Pothole Hazard',
        area: 'Ward 14 Shivajinagar',
        status: 'submitted',
        entity_type_id: entityType.entity_type_id,
        owner_user_id: citizen1.user.user_id,
      },
    });
  });

  afterAll(async () => {
    // Delete created posts (cascades to votes, follows, comments, events, reports)
    if (createdPostIds.length > 0) {
      await prisma.buzzPost.deleteMany({ where: { id: { in: createdPostIds } } });
    }
    if (testEntity) {
      await prisma.entity.deleteMany({ where: { entity_id: testEntity.entity_id } });
    }
    await cleanupTrackedEntities();
    await prisma.$disconnect();
  });

  beforeEach(() => {
    global.__civicBuzzGeminiFail = false;
    global.__civicBuzzSimulateUnsafe = false;
  });

  // â”€â”€â”€ 1. POST /buzz (Create Draft & Published) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  describe('POST /buzz', () => {
    it('creates a draft buzz post successfully', async () => {
      const res = await request(app)
        .post('/buzz')
        .set(citizen1.headers)
        .send({
          linked_type: 'issue',
          linked_id: testEntity.entity_id,
          template: 'meme',
          style: 'funny',
          caption: 'When the road turns into an obstacle course on FC Road.',
          cta_text: 'Fix FC Road',
          status: 'draft',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.status).toBe('draft');
      createdPostIds.push(res.body.data.id);
    });

    it('creates a published buzz post (passes safety check)', async () => {
      const res = await request(app)
        .post('/buzz')
        .set(citizen1.headers)
        .send({
          linked_type: 'issue',
          linked_id: testEntity.entity_id,
          template: 'awareness',
          style: 'informative',
          caption: 'Open pothole on FC road requires municipal patch before monsoon.',
          cta_text: 'Support Ticket',
          status: 'published',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('published');
      createdPostIds.push(res.body.data.id);
    });

    it('rejects publishing when safety check fails', async () => {
      global.__civicBuzzSimulateUnsafe = true;
      const res = await request(app)
        .post('/buzz')
        .set(citizen1.headers)
        .send({
          linked_type: 'issue',
          linked_id: testEntity.entity_id,
          template: 'meme',
          style: 'funny',
          caption: 'Unsafe text targeting people.',
          status: 'published',
        });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.safety_failed).toBe(true);
      expect(res.body.message).toContain('Contains inappropriate or misleading');
    });

    it('validates required fields (linked_type, linked_id, caption)', async () => {
      const res = await request(app)
        .post('/buzz')
        .set(citizen1.headers)
        .send({
          linked_type: 'invalid_type',
          linked_id: testEntity.entity_id,
          caption: 'Test',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // â”€â”€â”€ 2. GET /buzz (Listing & Pagination) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  describe('GET /buzz', () => {
    it('returns published posts with vote counts, follow states, and linked issue status', async () => {
      const res = await request(app)
        .get('/buzz')
        .set(citizen1.headers);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);

      const found = res.body.data.find(p => p.linked_id === testEntity.entity_id);
      expect(found).toBeDefined();
      expect(found.linked_status).toBe('submitted');
      expect(typeof found.vote_count).toBe('number');
      expect(typeof found.follow_count).toBe('number');
      expect(typeof found.has_voted).toBe('boolean');
      expect(typeof found.is_following).toBe('boolean');
    });

    it('supports pagination query parameters', async () => {
      const res = await request(app)
        .get('/buzz?page=1&limit=2');

      expect(res.status).toBe(200);
      expect(res.body.meta.page).toBe(1);
      expect(res.body.meta.limit).toBe(2);
      expect(res.body.data.length).toBeLessThanOrEqual(2);
    });
  });

  // â”€â”€â”€ 3. PATCH /buzz/:id (Edit & Publish) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  describe('PATCH /buzz/:id', () => {
    let draftPostId;

    beforeAll(async () => {
      const post = await prisma.buzzPost.create({
        data: {
          author_id: citizen1.user.user_id,
          linked_type: 'issue',
          linked_id: testEntity.entity_id,
          template: 'meme',
          style: 'funny',
          caption: 'Draft caption before editing.',
          status: 'draft',
        },
      });
      draftPostId = post.id;
      createdPostIds.push(draftPostId);
    });

    it('allows author to edit caption and publish the post', async () => {
      const res = await request(app)
        .patch(`/buzz/${draftPostId}`)
        .set(citizen1.headers)
        .send({
          caption: 'Updated polished caption about the pothole.',
          status: 'published',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('published');
    });

    it('forbids non-authors from editing', async () => {
      const res = await request(app)
        .patch(`/buzz/${draftPostId}`)
        .set(citizen2.headers)
        .send({ caption: 'Hacked caption.' });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  // â”€â”€â”€ 4. POST /buzz/:id/vote (Toggle) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  describe('POST /buzz/:id/vote', () => {
    let publishedPostId;

    beforeAll(async () => {
      const post = await prisma.buzzPost.create({
        data: {
          author_id: citizen1.user.user_id,
          linked_type: 'issue',
          linked_id: testEntity.entity_id,
          template: 'meme',
          style: 'funny',
          caption: 'Vote testing post.',
          status: 'published',
        },
      });
      publishedPostId = post.id;
      createdPostIds.push(publishedPostId);
    });

    it('toggles vote on and off for a post', async () => {
      // 1st click: vote ON
      const res1 = await request(app)
        .post(`/buzz/${publishedPostId}/vote`)
        .set(citizen2.headers);

      expect(res1.status).toBe(200);
      expect(res1.body.voted).toBe(true);
      expect(res1.body.vote_count).toBe(1);

      // 2nd click: vote OFF
      const res2 = await request(app)
        .post(`/buzz/${publishedPostId}/vote`)
        .set(citizen2.headers);

      expect(res2.status).toBe(200);
      expect(res2.body.voted).toBe(false);
      expect(res2.body.vote_count).toBe(0);
    });
  });

  // â”€â”€â”€ 5. POST /buzz/:id/follow (Toggle) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  describe('POST /buzz/:id/follow', () => {
    let publishedPostId;

    beforeAll(async () => {
      const post = await prisma.buzzPost.create({
        data: {
          author_id: citizen1.user.user_id,
          linked_type: 'issue',
          linked_id: testEntity.entity_id,
          template: 'meme',
          style: 'funny',
          caption: 'Follow testing post.',
          status: 'published',
        },
      });
      publishedPostId = post.id;
      createdPostIds.push(publishedPostId);
    });

    it('toggles follow state on and off', async () => {
      const res1 = await request(app)
        .post(`/buzz/${publishedPostId}/follow`)
        .set(citizen2.headers);

      expect(res1.status).toBe(200);
      expect(res1.body.following).toBe(true);
      expect(res1.body.follow_count).toBe(1);

      const res2 = await request(app)
        .post(`/buzz/${publishedPostId}/follow`)
        .set(citizen2.headers);

      expect(res2.status).toBe(200);
      expect(res2.body.following).toBe(false);
      expect(res2.body.follow_count).toBe(0);
    });
  });

  // â”€â”€â”€ 6. POST & GET /buzz/:id/comments â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  describe('Comments API', () => {
    let publishedPostId;

    beforeAll(async () => {
      const post = await prisma.buzzPost.create({
        data: {
          author_id: citizen1.user.user_id,
          linked_type: 'issue',
          linked_id: testEntity.entity_id,
          template: 'meme',
          style: 'funny',
          caption: 'Comment testing post.',
          status: 'published',
        },
      });
      publishedPostId = post.id;
      createdPostIds.push(publishedPostId);
    });

    it('creates a comment and retrieves it', async () => {
      const postRes = await request(app)
        .post(`/buzz/${publishedPostId}/comments`)
        .set(citizen2.headers)
        .send({ text: 'Saw this yesterday, it is indeed dangerous.' });

      expect(postRes.status).toBe(201);
      expect(postRes.body.success).toBe(true);

      const getRes = await request(app)
        .get(`/buzz/${publishedPostId}/comments`);

      expect(getRes.status).toBe(200);
      expect(getRes.body.data.length).toBeGreaterThanOrEqual(1);
      expect(getRes.body.data[0].text).toBe('Saw this yesterday, it is indeed dangerous.');
      expect(getRes.body.data[0].author_name).toBeDefined();
    });

    it('rejects unsafe comments', async () => {
      global.__civicBuzzSimulateUnsafe = true;
      const res = await request(app)
        .post(`/buzz/${publishedPostId}/comments`)
        .set(citizen2.headers)
        .send({ text: 'Inappropriate offensive text.' });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.safety_failed).toBe(true);
    });
  });

  // â”€â”€â”€ 7. POST /buzz/:id/event & GET /buzz/:id/stats â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  describe('Analytics & Stats', () => {
    let publishedPostId;

    beforeAll(async () => {
      const post = await prisma.buzzPost.create({
        data: {
          author_id: citizen1.user.user_id,
          linked_type: 'issue',
          linked_id: testEntity.entity_id,
          template: 'meme',
          style: 'funny',
          caption: 'Stats testing post.',
          status: 'published',
        },
      });
      publishedPostId = post.id;
      createdPostIds.push(publishedPostId);
    });

    it('records analytics events (view, click_issue, share, join)', async () => {
      await request(app).post(`/buzz/${publishedPostId}/event`).set('X-Requested-With', 'ck-web').send({ type: 'view' });
      await request(app).post(`/buzz/${publishedPostId}/event`).set('X-Requested-With', 'ck-web').send({ type: 'view' });
      await request(app).post(`/buzz/${publishedPostId}/event`).set('X-Requested-With', 'ck-web').send({ type: 'click_issue' });
      await request(app).post(`/buzz/${publishedPostId}/event`).set('X-Requested-With', 'ck-web').send({ type: 'share' });
      await request(app).post(`/buzz/${publishedPostId}/event`).set('X-Requested-With', 'ck-web').send({ type: 'join' });

      // Allow async fire-and-forget to insert
      await new Promise(r => setTimeout(r, 100));

      const statsRes = await request(app)
        .get(`/buzz/${publishedPostId}/stats`)
        .set(citizen1.headers);

      expect(statsRes.status).toBe(200);
      expect(statsRes.body.success).toBe(true);
      expect(statsRes.body.data.views).toBe(2);
      expect(statsRes.body.data.issue_link_clicks).toBe(1);
      expect(statsRes.body.data.shares).toBe(1);
      expect(statsRes.body.data.joins).toBe(1);
    });

    it('forbids unauthorized users from viewing stats', async () => {
      const res = await request(app)
        .get(`/buzz/${publishedPostId}/stats`)
        .set(citizen2.headers);

      expect(res.status).toBe(403);
    });
  });

  // â”€â”€â”€ 8. POST /buzz/captions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  describe('POST /buzz/captions', () => {
    it('returns 3 captions with call to action', async () => {
      const res = await request(app)
        .post('/buzz/captions')
        .set(citizen1.headers)
        .send({
          linked_type: 'issue',
          linked_id: testEntity.entity_id,
          style: 'funny',
          template: 'meme',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.captions)).toBe(true);
      expect(res.body.captions.length).toBe(3);
      expect(res.body.captions[0].caption).toBeDefined();
      expect(res.body.captions[0].cta_text).toBeDefined();
    });
  });

  // â”€â”€â”€ 9. POST /buzz/:id/report (Auto-hide on 3 reports) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  describe('POST /buzz/:id/report', () => {
    let reportPostId;

    beforeAll(async () => {
      const post = await prisma.buzzPost.create({
        data: {
          author_id: citizen1.user.user_id,
          linked_type: 'issue',
          linked_id: testEntity.entity_id,
          template: 'meme',
          style: 'funny',
          caption: 'Reportable post.',
          status: 'published',
        },
      });
      reportPostId = post.id;
      createdPostIds.push(reportPostId);
    });

    it('prevents self-reporting', async () => {
      const res = await request(app)
        .post(`/buzz/${reportPostId}/report`)
        .set(citizen1.headers)
        .send({ reason: 'Self reporting test' });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('cannot report your own post');
    });

    it('auto-hides post after 3 unique user reports', async () => {
      // Report 1 by citizen2
      const r1 = await request(app)
        .post(`/buzz/${reportPostId}/report`)
        .set(citizen2.headers)
        .send({ reason: 'Inappropriate content' });
      expect(r1.status).toBe(200);

      // Verify still published
      let postCheck = await prisma.buzzPost.findUnique({ where: { id: reportPostId } });
      expect(postCheck.status).toBe('published');

      // Report 2 by citizen3
      const r2 = await request(app)
        .post(`/buzz/${reportPostId}/report`)
        .set(citizen3.headers)
        .send({ reason: 'Misleading claim' });
      expect(r2.status).toBe(200);

      postCheck = await prisma.buzzPost.findUnique({ where: { id: reportPostId } });
      expect(postCheck.status).toBe('published');

      // Report 3 by citizen4 -> triggers auto-hide
      const r3 = await request(app)
        .post(`/buzz/${reportPostId}/report`)
        .set(citizen4.headers)
        .send({ reason: 'Offensive language' });
      expect(r3.status).toBe(200);
      expect(r3.body.message).toContain('hidden');

      postCheck = await prisma.buzzPost.findUnique({ where: { id: reportPostId } });
      expect(postCheck.status).toBe('hidden');
    });
  });

  describe('GET /buzz/:id and Image Upload', () => {
    let singlePostId;

    beforeAll(async () => {
      const post = await prisma.buzzPost.create({
        data: {
          author_id: citizen1.user.user_id,
          linked_type: 'issue',
          linked_id: testEntity.entity_id,
          template: 'meme',
          style: 'funny',
          caption: 'Single post test caption.',
          status: 'published',
        },
      });
      singlePostId = post.id;
      createdPostIds.push(singlePostId);
    });

    it('retrieves a single buzz post by id', async () => {
      const res = await request(app).get(`/buzz/${singlePostId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(singlePostId);
      expect(res.body.data.caption).toBe('Single post test caption.');
      expect(res.body.data.linked_title).toBe('FC Road Pothole Hazard');
    });

    it('returns 404 for non-existent post', async () => {
      const res = await request(app).get('/buzz/9999999');
      expect(res.status).toBe(404);
    });

    it('uploads a rendered card image as base64', async () => {
      // 1x1 transparent PNG data URL
      const samplePng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAA=';
      const res = await request(app)
        .post('/buzz/upload-image')
        .set(citizen1.headers)
        .send({ image_data: samplePng });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.image_url).toMatch(/^\/uploads\/buzz-card-/);
    });

    it('filters drafts for authenticated user', async () => {
      const draftPost = await prisma.buzzPost.create({
        data: {
          author_id: citizen1.user.user_id,
          linked_type: 'issue',
          linked_id: testEntity.entity_id,
          template: 'awareness',
          style: 'informative',
          caption: 'Draft post for test.',
          status: 'draft',
        },
      });
      createdPostIds.push(draftPost.id);

      const res = await request(app)
        .get('/buzz?status=draft')
        .set(citizen1.headers);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const myDraft = res.body.data.find(d => d.id === draftPost.id);
      expect(myDraft).toBeDefined();
      expect(myDraft.status).toBe('draft');
    });
  });
});
