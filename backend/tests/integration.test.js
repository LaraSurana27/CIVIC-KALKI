const request = require('supertest');
const app = require('../index');
const prisma = require('../db');
const { createTestUser, getAuthHeaders, cleanupAll, trackEntityId } = require('./helpers/authHelper');

describe('Integration: Auth + Workflow', () => {
  let citizenHeaders;
  let coordHeaders;
  let directorHeaders;
  let adminHeaders;
  let coordUserId;
  let directorUserId;
  let entityId;
  let id2;

  beforeAll(async () => {
    // Ephemeral admin test user
    const admin = await createTestUser({ role: 'admin' });
    adminHeaders = admin.headers;
  });

  afterAll(async () => {
    await cleanupAll();
    await prisma.$disconnect();
  });

  let coordEmail, directorEmail;

  test('signup users and get tokens', async () => {
    const res1 = await request(app)
      .post('/auth/signup')
      .set('X-Requested-With', 'ck-web')
      .send({ name: 'IT Citizen', email: `cktest_it_cit_${Date.now()}@test-suite.local`, password: 'Password123' });
    expect(res1.statusCode).toBe(201);
    const cookie1 = (res1.headers['set-cookie'] || []).find((c) => c.startsWith('ck_session='));
    citizenHeaders = { Cookie: cookie1.split(';')[0], 'X-Requested-With': 'ck-web' };

    coordEmail = `cktest_it_coord_${Date.now()}@test-suite.local`;
    const res2 = await request(app)
      .post('/auth/signup')
      .set('X-Requested-With', 'ck-web')
      .send({ name: 'IT Coord', email: coordEmail, password: 'Password123' });
    expect(res2.statusCode).toBe(201);
    const cookie2 = (res2.headers['set-cookie'] || []).find((c) => c.startsWith('ck_session='));
    coordHeaders = { Cookie: cookie2.split(';')[0], 'X-Requested-With': 'ck-web' };
    coordUserId = res2.body.data.user.user_id;

    directorEmail = `cktest_it_dir_${Date.now()}@test-suite.local`;
    const res3 = await request(app)
      .post('/auth/signup')
      .set('X-Requested-With', 'ck-web')
      .send({ name: 'IT Director', email: directorEmail, password: 'Password123' });
    expect(res3.statusCode).toBe(201);
    const cookie3 = (res3.headers['set-cookie'] || []).find((c) => c.startsWith('ck_session='));
    directorHeaders = { Cookie: cookie3.split(';')[0], 'X-Requested-With': 'ck-web' };
    directorUserId = res3.body.data.user.user_id;
  }, 20000);

  test('admin promotes coord to coordinator_area and director to director', async () => {
    // Promote the created user to coordinator_area
    const promote = await request(app)
      .post(`/admin/users/${coordUserId}/role`)
      .set(adminHeaders)
      .send({ role: 'coordinator_area', assignedArea: 'Sector 5' });
    expect(promote.statusCode).toBe(200);

    const promoteDir = await request(app)
      .post(`/admin/users/${directorUserId}/role`)
      .set(adminHeaders)
      .send({ role: 'director' });
    expect(promoteDir.statusCode).toBe(200);

    // Refresh cookies with the newly assigned roles
    const loginCoord = await request(app)
      .post('/auth/login')
      .set('X-Requested-With', 'ck-web')
      .send({ email: coordEmail, password: 'Password123' });
    expect(loginCoord.statusCode).toBe(200);
    const cCoord = (loginCoord.headers['set-cookie'] || []).find((c) => c.startsWith('ck_session='));
    coordHeaders = { Cookie: cCoord.split(';')[0], 'X-Requested-With': 'ck-web' };

    const loginDir = await request(app)
      .post('/auth/login')
      .set('X-Requested-With', 'ck-web')
      .send({ email: directorEmail, password: 'Password123' });
    expect(loginDir.statusCode).toBe(200);
    const cDir = (loginDir.headers['set-cookie'] || []).find((c) => c.startsWith('ck_session='));
    directorHeaders = { Cookie: cDir.split(';')[0], 'X-Requested-With': 'ck-web' };
  }, 20000);

  test('full workflow: citizen->submitted->coordinator_approved->approved', async () => {
    // Create entity as citizen
    const create = await request(app)
      .post('/entities')
      .set(citizenHeaders)
      .send({ entity_type_id: 1, name: 'ITest Entity', location: 'Bengaluru', area: 'Sector 5', status: 'draft' });
    expect(create.statusCode).toBe(201);
    entityId = create.body.data.entity_id;
    trackEntityId(entityId);

    // citizen -> submitted
    const submit = await request(app)
      .post(`/entities/${entityId}/transition`)
      .set(citizenHeaders)
      .send({ to_status: 'submitted' });
    expect(submit.statusCode).toBe(200);

    // coordinator_area -> coordinator_approved
    const coordRes = await request(app)
      .post(`/entities/${entityId}/transition`)
      .set(coordHeaders)
      .send({ to_status: 'coordinator_approved' });
    expect(coordRes.statusCode).toBe(200);

    // director -> approved
    const dirRes = await request(app)
      .post(`/entities/${entityId}/transition`)
      .set(directorHeaders)
      .send({ to_status: 'approved' });
    expect(dirRes.statusCode).toBe(200);
    expect(dirRes.body).toHaveProperty('ruleResult');
  }, 40000);

  test('negative: area mismatch coordinator cannot approve', async () => {
    // Create entity in different area
    const create = await request(app)
      .post('/entities')
      .set(citizenHeaders)
      .send({ entity_type_id: 1, name: 'ITest Entity 2', location: 'Bengaluru', area: 'Sector X', status: 'draft' });
    expect(create.statusCode).toBe(201);
    id2 = create.body.data.entity_id;
    trackEntityId(id2);

    // submit
    await request(app)
      .post(`/entities/${id2}/transition`)
      .set(citizenHeaders)
      .send({ to_status: 'submitted' });

    // coord assigned to Sector 5 should not be able to approve Sector X
    const resp = await request(app)
      .post(`/entities/${id2}/transition`)
      .set(coordHeaders)
      .send({ to_status: 'coordinator_approved' });
    expect(resp.statusCode).toBe(400);
  }, 30000);
});
