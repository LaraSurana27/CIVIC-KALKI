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

describe('Phase 2 — Generic Report Engine Tests (ReportMaster)', () => {
  let citizenToken, coordinatorAreaToken, directorToken;
  let citizenUser, coordinatorAreaUser, directorUser;
  let grievanceEntityType;
  let seededReportId;
  let parkEntityType;
  let parkReportId;
  let createdEntities = [];

  beforeAll(async () => {
    // 1. Fetch seed users
    citizenUser = await prisma.user.findFirst({ where: { role: 'citizen' } });
    coordinatorAreaUser = await prisma.user.findFirst({ where: { role: 'coordinator_area' } });
    directorUser = await prisma.user.findFirst({ where: { role: 'director' } });

    citizenToken = generateTestToken(citizenUser);
    coordinatorAreaToken = generateTestToken(coordinatorAreaUser);
    directorToken = generateTestToken(directorUser);

    // 2. Fetch Grievance EntityType
    grievanceEntityType = await prisma.entityType.findFirst({ where: { name: 'Grievance' } });

    // 3. Find or seed a Grievance report
    let grievanceReport = await prisma.reportMaster.findFirst({
      where: { report_name: 'Grievances by Area' },
    });
    if (!grievanceReport && grievanceEntityType) {
      grievanceReport = await prisma.reportMaster.create({
        data: {
          entity_type_id: grievanceEntityType.entity_type_id,
          report_name: 'Grievances by Area',
          output_format: 'grouped_count',
          filters: JSON.stringify({ groupBy: 'area', metric: 'COUNT', public_stats: true }),
        },
      });
    }
    seededReportId = grievanceReport.report_id;
  });

  afterAll(async () => {
    // Clean up created entities
    for (const entId of createdEntities) {
      await prisma.parameterValue.deleteMany({ where: { entity_id: entId } });
      await prisma.approvalHistory.deleteMany({ where: { entity_id: entId } });
      await prisma.auditLog.deleteMany({ where: { entity_id: entId } });
      await prisma.entity.deleteMany({ where: { entity_id: entId } });
    }

    if (parkEntityType) {
      await prisma.reportMaster.deleteMany({ where: { entity_type_id: parkEntityType.entity_type_id } });
      await prisma.entityType.delete({ where: { entity_type_id: parkEntityType.entity_type_id } });
    }
  });

  // ── Test 1: Report definition can be retrieved ──
  test('Test 1: Report definition can be retrieved by list and ID', async () => {
    const resList = await request(app)
      .get('/reports')
      .set('Authorization', `Bearer ${directorToken}`);
    expect(resList.status).toBe(200);
    expect(resList.body.success).toBe(true);
    expect(Array.isArray(resList.body.data)).toBe(true);
    expect(resList.body.data.length).toBeGreaterThan(0);

    const resSingle = await request(app)
      .get(`/reports/${seededReportId}`)
      .set('Authorization', `Bearer ${directorToken}`);
    expect(resSingle.status).toBe(200);
    expect(resSingle.body.success).toBe(true);
    expect(resSingle.body.data.report_id).toBe(seededReportId);
    expect(resSingle.body.data.report_name).toBe('Grievances by Area');
  });

  // ── Test 2: Valid report executes successfully ──
  test('Test 2: Valid report executes successfully and returns structured JSON', async () => {
    const resExec = await request(app)
      .get(`/reports/${seededReportId}/execute`)
      .set('Authorization', `Bearer ${directorToken}`);
    expect(resExec.status).toBe(200);
    expect(resExec.body.success).toBe(true);
    expect(resExec.body.data).toHaveProperty('reportId', seededReportId);
    expect(resExec.body.data).toHaveProperty('columns');
    expect(resExec.body.data).toHaveProperty('rows');
    expect(resExec.body.data).toHaveProperty('totalCount');
  });

  // ── Test 3: Count report produces correct count ──
  test('Test 3: Count report produces correct count summary', async () => {
    // Seed 2 temp entities for Grievance
    const e1 = await prisma.entity.create({
      data: { entity_type_id: grievanceEntityType.entity_type_id, name: 'Count Test 1', area: 'Sector 5', status: 'submitted' },
    });
    const e2 = await prisma.entity.create({
      data: { entity_type_id: grievanceEntityType.entity_type_id, name: 'Count Test 2', area: 'Sector 5', status: 'submitted' },
    });
    createdEntities.push(e1.entity_id, e2.entity_id);

    // Create a count report definition
    const countReport = await prisma.reportMaster.create({
      data: {
        entity_type_id: grievanceEntityType.entity_type_id,
        report_name: `Total Grievances Count ${Date.now()}`,
        output_format: 'count',
        filters: JSON.stringify({ metric: 'COUNT', public_stats: true }),
      },
    });

    const resExec = await request(app)
      .get(`/reports/${countReport.report_id}/execute`)
      .set('Authorization', `Bearer ${directorToken}`);
    expect(resExec.status).toBe(200);
    expect(resExec.body.data.outputFormat).toBe('count');
    expect(resExec.body.data.rows[0].total_count).toBeGreaterThanOrEqual(2);

    await prisma.reportMaster.delete({ where: { report_id: countReport.report_id } });
  });

  // ── Test 4: Grouped report produces correct grouping ──
  test('Test 4: Grouped report produces correct grouping by area', async () => {
    const e1 = await prisma.entity.create({
      data: { entity_type_id: grievanceEntityType.entity_type_id, name: 'Group Test North 1', area: 'TestArea_North', status: 'submitted' },
    });
    const e2 = await prisma.entity.create({
      data: { entity_type_id: grievanceEntityType.entity_type_id, name: 'Group Test North 2', area: 'TestArea_North', status: 'submitted' },
    });
    const e3 = await prisma.entity.create({
      data: { entity_type_id: grievanceEntityType.entity_type_id, name: 'Group Test South 1', area: 'TestArea_South', status: 'submitted' },
    });
    createdEntities.push(e1.entity_id, e2.entity_id, e3.entity_id);

    const resExec = await request(app)
      .get(`/reports/${seededReportId}/execute`)
      .set('Authorization', `Bearer ${directorToken}`);
    expect(resExec.status).toBe(200);

    const rows = resExec.body.data.rows;
    const northRow = rows.find((r) => r.area === 'TestArea_North');
    const southRow = rows.find((r) => r.area === 'TestArea_South');

    expect(northRow).toBeDefined();
    expect(northRow.count).toBe(2);
    expect(southRow).toBeDefined();
    expect(southRow.count).toBe(1);
  });

  // ── Test 5: Numeric aggregation works where applicable (SUM, AVG, MIN, MAX) ──
  test('Test 5: Numeric aggregations (SUM, AVG, MIN, MAX) compute accurately', async () => {
    // Create parameter master for budget
    let budgetParam = await prisma.parameterMaster.findFirst({ where: { field_key: 'test_budget' } });
    if (!budgetParam) {
      const sub = await prisma.subsectionMaster.findFirst();
      const cat = await prisma.parameterCategory.findFirst();
      budgetParam = await prisma.parameterMaster.create({
        data: {
          subsection_id: sub.subsection_id,
          category_id: cat.category_id,
          field_key: 'test_budget',
          label: 'Test Budget',
          field_type: 'number',
        },
      });
    }

    const entA = await prisma.entity.create({
      data: { entity_type_id: grievanceEntityType.entity_type_id, name: 'Budget Ent A', area: 'AggArea', status: 'submitted' },
    });
    const entB = await prisma.entity.create({
      data: { entity_type_id: grievanceEntityType.entity_type_id, name: 'Budget Ent B', area: 'AggArea', status: 'submitted' },
    });
    createdEntities.push(entA.entity_id, entB.entity_id);

    await prisma.parameterValue.createMany({
      data: [
        { entity_id: entA.entity_id, parameter_id: budgetParam.parameter_id, value: '100' },
        { entity_id: entB.entity_id, parameter_id: budgetParam.parameter_id, value: '300' },
      ],
    });

    const sumReport = await prisma.reportMaster.create({
      data: {
        entity_type_id: grievanceEntityType.entity_type_id,
        report_name: `Budget Sum ${Date.now()}`,
        output_format: 'grouped_count',
        filters: JSON.stringify({ groupBy: 'area', metric: 'SUM', metricField: 'test_budget', public_stats: true }),
      },
    });

    const resSum = await request(app)
      .get(`/reports/${sumReport.report_id}/execute`)
      .set('Authorization', `Bearer ${directorToken}`);

    expect(resSum.status).toBe(200);
    const aggRow = resSum.body.data.rows.find((r) => r.area === 'AggArea');
    expect(aggRow).toBeDefined();
    expect(aggRow.sum).toBe(400);

    await prisma.parameterValue.deleteMany({ where: { parameter_id: budgetParam.parameter_id } });
    await prisma.reportMaster.delete({ where: { report_id: sumReport.report_id } });
    await prisma.parameterMaster.delete({ where: { parameter_id: budgetParam.parameter_id } });
  });

  // ── Test 6: Valid filters work ──
  test('Test 6: Override filters (e.g. status override) filter query results correctly', async () => {
    const activeEnt = await prisma.entity.create({
      data: { entity_type_id: grievanceEntityType.entity_type_id, name: 'Active Grievance', area: 'FiltArea', status: 'submitted' },
    });
    const approvedEnt = await prisma.entity.create({
      data: { entity_type_id: grievanceEntityType.entity_type_id, name: 'Approved Grievance', area: 'FiltArea', status: 'approved' },
    });
    createdEntities.push(activeEnt.entity_id, approvedEnt.entity_id);

    const resFiltered = await request(app)
      .post(`/reports/${seededReportId}/execute`)
      .set('Authorization', `Bearer ${directorToken}`)
      .send({ status: 'approved' });

    expect(resFiltered.status).toBe(200);
    const filtRow = resFiltered.body.data.rows.find((r) => r.area === 'FiltArea');
    expect(filtRow).toBeDefined();
    expect(filtRow.count).toBe(1); // Only approvedEnt
  });

  // ── Test 7: Invalid filter/field is rejected ──
  test('Test 7: Unsupported aggregation or invalid request parameters are rejected', async () => {
    const invalidReport = await prisma.reportMaster.create({
      data: {
        entity_type_id: grievanceEntityType.entity_type_id,
        report_name: `Invalid Metric Report ${Date.now()}`,
        output_format: 'grouped_count',
        filters: JSON.stringify({ groupBy: 'area', metric: 'INVALID_METRIC' }),
      },
    });

    const res = await request(app)
      .get(`/reports/${invalidReport.report_id}/execute`)
      .set('Authorization', `Bearer ${directorToken}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Unsupported aggregation metric');

    await prisma.reportMaster.delete({ where: { report_id: invalidReport.report_id } });
  });

  // ── Test 8: Unauthorized user cannot access restricted report data ──
  test('Test 8: Unauthenticated access is rejected with 401', async () => {
    const resUnauth = await request(app).get(`/reports/${seededReportId}/execute`);
    expect(resUnauth.status).toBe(401);
  });

  // ── Test 9: Area-scoped user receives only permitted data where applicable ──
  test('Test 9: Area-scoped coordinator receives only data for their assigned area', async () => {
    // coordinatorAreaUser is assigned to 'Sector 5'
    const entSec5 = await prisma.entity.create({
      data: { entity_type_id: grievanceEntityType.entity_type_id, name: 'Sec5 Ent', area: 'Sector 5', status: 'submitted' },
    });
    const entSecX = await prisma.entity.create({
      data: { entity_type_id: grievanceEntityType.entity_type_id, name: 'SecX Ent', area: 'Sector X', status: 'submitted' },
    });
    createdEntities.push(entSec5.entity_id, entSecX.entity_id);

    const resCoord = await request(app)
      .get(`/reports/${seededReportId}/execute`)
      .set('Authorization', `Bearer ${coordinatorAreaToken}`);

    expect(resCoord.status).toBe(200);
    const rows = resCoord.body.data.rows;

    // Must include Sector 5, but NOT Sector X or any other area
    expect(rows.some((r) => r.area === 'Sector 5')).toBe(true);
    expect(rows.some((r) => r.area === 'Sector X')).toBe(false);
  });

  // ── Test 10: MANDATORY ARCHITECTURAL PROOF — Brand-new Park Renovation Request module report ──
  test('Test 10 (MANDATORY ARCHITECTURAL TEST): Brand-new Park Renovation Request module generates report purely via metadata', async () => {
    // 1. Create new EntityType metadata
    parkEntityType = await prisma.entityType.create({
      data: {
        domain_id: 1,
        name: `Park Renovation Request ${Date.now()}`,
        description: 'Dynamic non-coded civic module for Park Renovations',
      },
    });

    // 2. Create ReportMaster definition for Park Renovation Request
    const parkReport = await prisma.reportMaster.create({
      data: {
        entity_type_id: parkEntityType.entity_type_id,
        report_name: 'Park Renovation Requests by Area',
        output_format: 'grouped_count',
        filters: JSON.stringify({ groupBy: 'area', metric: 'COUNT', public_stats: true }),
      },
    });
    parkReportId = parkReport.report_id;

    // 3. Create test entities without any custom backend tables/code:
    // Pune North (2), Pune South (1), Pune Central (1)
    const p1 = await prisma.entity.create({
      data: { entity_type_id: parkEntityType.entity_type_id, name: 'Park A', area: 'Pune North', status: 'submitted' },
    });
    const p2 = await prisma.entity.create({
      data: { entity_type_id: parkEntityType.entity_type_id, name: 'Park B', area: 'Pune North', status: 'submitted' },
    });
    const p3 = await prisma.entity.create({
      data: { entity_type_id: parkEntityType.entity_type_id, name: 'Park C', area: 'Pune South', status: 'submitted' },
    });
    const p4 = await prisma.entity.create({
      data: { entity_type_id: parkEntityType.entity_type_id, name: 'Park D', area: 'Pune Central', status: 'submitted' },
    });
    createdEntities.push(p1.entity_id, p2.entity_id, p3.entity_id, p4.entity_id);

    // 4. Execute report via generic Report Engine endpoint
    const resPark = await request(app)
      .get(`/reports/${parkReportId}/execute`)
      .set('Authorization', `Bearer ${directorToken}`);

    expect(resPark.status).toBe(200);
    expect(resPark.body.success).toBe(true);

    const rows = resPark.body.data.rows;
    const north = rows.find((r) => r.area === 'Pune North');
    const south = rows.find((r) => r.area === 'Pune South');
    const central = rows.find((r) => r.area === 'Pune Central');

    expect(north).toBeDefined();
    expect(north.count).toBe(2);
    expect(south).toBeDefined();
    expect(south.count).toBe(1);
    expect(central).toBeDefined();
    expect(central.count).toBe(1);
  });
});
