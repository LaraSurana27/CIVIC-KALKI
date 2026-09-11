const request = require('supertest');
const app = require('../index');

describe('Integration: Auth + Workflow', () => {
  let citizenToken;
  let coordToken;
  let directorToken;
  let entityId;

  test('signup users and get tokens', async () => {
    const emailBase = `itest-${Date.now()}`;
    const res1 = await request(app).post('/auth/signup').send({ name: 'IT Citizen', email: `${emailBase}.citizen@example.com`, password: 'Password123' });
    expect(res1.statusCode).toBe(201);
    citizenToken = res1.body.data.token;

    const res2 = await request(app).post('/auth/signup').send({ name: 'IT Coord', email: `${emailBase}.coord@example.com`, password: 'Password123' });
    expect(res2.statusCode).toBe(201);
    coordToken = res2.body.data.token;

    const res3 = await request(app).post('/auth/signup').send({ name: 'IT Director', email: `${emailBase}.director@example.com`, password: 'Password123' });
    expect(res3.statusCode).toBe(201);
    directorToken = res3.body.data.token;
  }, 20000);

  test('admin promotes coord to coordinator_area and director to director', async () => {
    // Create an admin user via seed or directly promote one user using DB if available.
    // For tests we will upsert an admin by calling seed endpoint via prisma, but here assume admin exists from seed.
    const seedTokens = require('../seed-tokens.json');
    const admin = seedTokens['demo.admin@example.com'];
    expect(admin).toBeDefined();

    // Promote the second created user to coordinator_area
    const coordEmail = Object.keys(seedTokens).find(k => k.includes('coord.area')) || `${Date.now()}.coord`; // fallback
    const coordUser = seedTokens['demo.coord.area@example.com'];
    const promote = await request(app).post(`/admin/users/${coordUser.user_id}/role`).set('Authorization', `Bearer ${admin.token}`).send({ role: 'coordinator_area', assignedArea: 'Sector 5' });
    expect(promote.statusCode).toBe(200);

    const directorUser = seedTokens['demo.director@example.com'];
    const promoteDir = await request(app).post(`/admin/users/${directorUser.user_id}/role`).set('Authorization', `Bearer ${admin.token}`).send({ role: 'director' });
    expect(promoteDir.statusCode).toBe(200);
  }, 20000);

  test('full workflow: citizen->submitted->coordinator_approved->approved', async () => {
    // Create entity as citizen
    const create = await request(app).post('/entities').set('Authorization', `Bearer ${citizenToken}`).send({ entity_type_id: 1, name: 'ITest Entity', location: 'Bengaluru', area: 'Sector 5', status: 'draft' });
    expect(create.statusCode).toBe(201);
    entityId = create.body.data.entity_id;

    // citizen -> submitted
    const submit = await request(app).post(`/entities/${entityId}/transition`).set('Authorization', `Bearer ${citizenToken}`).send({ to_status: 'submitted' });
    expect(submit.statusCode).toBe(200);

    // coordinator_area -> coordinator_approved
    // Use demo coordinator from seed for role and credentials
    const seedTokens = require('../seed-tokens.json');
    const coord = seedTokens['demo.coord.area@example.com'];
    expect(coord).toBeDefined();
    const coordRes = await request(app).post(`/entities/${entityId}/transition`).set('Authorization', `Bearer ${coord.token}`).send({ to_status: 'coordinator_approved' });
    expect(coordRes.statusCode).toBe(200);

    // director -> approved
    const director = seedTokens['demo.director@example.com'];
    const dirRes = await request(app).post(`/entities/${entityId}/transition`).set('Authorization', `Bearer ${director.token}`).send({ to_status: 'approved' });
    expect(dirRes.statusCode).toBe(200);
    expect(dirRes.body).toHaveProperty('ruleResult');
  }, 40000);

  test('negative: area mismatch coordinator cannot approve', async () => {
    // Create entity in different area
    const create = await request(app).post('/entities').set('Authorization', `Bearer ${citizenToken}`).send({ entity_type_id: 1, name: 'ITest Entity 2', location: 'Bengaluru', area: 'Sector X', status: 'draft' });
    expect(create.statusCode).toBe(201);
    const id2 = create.body.data.entity_id;

    // submit
    await request(app).post(`/entities/${id2}/transition`).set('Authorization', `Bearer ${citizenToken}`).send({ to_status: 'submitted' });

    const seedTokens = require('../seed-tokens.json');
    const coord = seedTokens['demo.coord.area@example.com'];
    // coord assigned to Sector 5 should not be able to approve Sector X
    const resp = await request(app).post(`/entities/${id2}/transition`).set('Authorization', `Bearer ${coord.token}`).send({ to_status: 'coordinator_approved' });
    expect(resp.statusCode).toBe(400);
  }, 30000);
});
