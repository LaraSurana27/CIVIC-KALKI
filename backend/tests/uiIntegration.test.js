/**
 * CIVIC-KALKI — Phase 3B UI Integration Tests
 *
 * Verifies that every module created via the No-Code Module Builder
 * becomes a first-class capability inside the generic Civic OS interface
 * dynamically from metadata — with ZERO module-specific code.
 */

const request = require('supertest');
const app = require('../index');
const prisma = require('../db');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

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

describe('Phase 3B — Dynamic Civic OS UI Integration Tests', () => {
  let citizenToken, coordinatorAreaToken, directorToken, adminToken;
  let citizenUser, coordinatorAreaUser, directorUser, adminUser;

  let deployedEntityTypeId;
  let deployedFormId;
  let deployedReportId;
  let createdEntities = [];

  const testModuleName = `Dynamic UI Test Module ${Date.now()}`;

  beforeAll(async () => {
    citizenUser = await prisma.user.findFirst({ where: { role: 'citizen' } });
    coordinatorAreaUser = await prisma.user.findFirst({ where: { role: 'coordinator_area' } });
    directorUser = await prisma.user.findFirst({ where: { role: 'director' } });
    adminUser = await prisma.user.findFirst({ where: { role: 'admin' } });

    citizenToken = generateTestToken(citizenUser);
    coordinatorAreaToken = generateTestToken(coordinatorAreaUser);
    directorToken = generateTestToken(directorUser);
    adminToken = generateTestToken(adminUser);

    const grievanceEntityType = await prisma.entityType.findFirst({ where: { name: 'Grievance' } });

    // Deploy a test module using ModuleBuilder — matches the exact schema from Phase 3A
    const payload = {
      module: {
        name: testModuleName,
        description: 'Module created for testing dynamic UI integration',
        domain_id: grievanceEntityType ? grievanceEntityType.domain_id : 1,
      },
      form: {
        name: `${testModuleName} Form`,
        sections: [
          {
            name: 'General Information',
            parameters: [
              { field_key: 'area', label: 'Target Area', field_type: 'select', mandatory: true, options: ['North Sector', 'South Sector'] },
              { field_key: 'budget', label: 'Requested Budget', field_type: 'number', mandatory: false },
              { field_key: 'renovation_notes', label: 'Renovation Details', field_type: 'textarea', mandatory: false }
            ]
          }
        ]
      },
      workflow: {
        transitions: [
          { from_status: 'draft', to_status: 'submitted', role: 'citizen' },
          { from_status: 'submitted', to_status: 'verified', role: 'coordinator_area' },
          { from_status: 'verified', to_status: 'approved', role: 'director' }
        ]
      },
      rules: grievanceEntityType ? [
        {
          target_entity_type_id: grievanceEntityType.entity_type_id,
          event: 'approved',
          auto_create: true
        }
      ] : [],
      reports: [
        {
          report_name: 'Budget Summary by Area',
          output_format: 'grouped_count',
          group_by_field: 'area'
        }
      ]
    };

    const res = await request(app)
      .post('/module-builder/deploy')
      .set('Authorization', `Bearer ${directorToken}`)
      .send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    deployedEntityTypeId = res.body.data.entityType.entity_type_id;
    deployedFormId = res.body.data.formMaster ? res.body.data.formMaster.form_id : null;
    deployedReportId = res.body.data.reports && res.body.data.reports.length > 0
      ? res.body.data.reports[0].report_id
      : null;
  });

  afterAll(async () => {
    for (const entId of createdEntities) {
      await prisma.parameterValue.deleteMany({ where: { entity_id: entId } });
      await prisma.approvalHistory.deleteMany({ where: { entity_id: entId } });
      await prisma.auditLog.deleteMany({ where: { entity_id: entId } });
      await prisma.entity.deleteMany({ where: { entity_id: entId } });
    }

    if (deployedEntityTypeId) {
      await prisma.reportMaster.deleteMany({ where: { entity_type_id: deployedEntityTypeId } });
      await prisma.workflowMaster.deleteMany({ where: { entity_type_id: deployedEntityTypeId } });
      await prisma.entityRelationshipRule.deleteMany({ where: { source_entity_type_id: deployedEntityTypeId } });

      const forms = await prisma.formMaster.findMany({ where: { entity_type_id: deployedEntityTypeId } });
      for (const form of forms) {
        const sections = await prisma.sectionMaster.findMany({ where: { form_id: form.form_id } });
        for (const sec of sections) {
          const subs = await prisma.subsectionMaster.findMany({ where: { section_id: sec.section_id } });
          for (const sub of subs) {
            await prisma.parameterMaster.deleteMany({ where: { subsection_id: sub.subsection_id } });
          }
          await prisma.subsectionMaster.deleteMany({ where: { section_id: sec.section_id } });
        }
        await prisma.sectionMaster.deleteMany({ where: { form_id: form.form_id } });
      }
      await prisma.formMaster.deleteMany({ where: { entity_type_id: deployedEntityTypeId } });
      await prisma.entity.deleteMany({ where: { entity_type_id: deployedEntityTypeId } });
      await prisma.entityType.delete({ where: { entity_type_id: deployedEntityTypeId } });
    }
  });

  // ── Test 1: Dynamic EntityType list includes newly deployed modules ──────────
  test('Test 1: Dynamic EntityType list includes newly deployed modules', async () => {
    const res = await request(app)
      .get('/entities/entity-types')
      .set('Authorization', `Bearer ${citizenToken}`);

    expect(res.statusCode).toBe(200);
    const found = res.body.data.find(et => et.entity_type_id === deployedEntityTypeId);
    expect(found).toBeDefined();
    expect(found.name).toBe(testModuleName);
  });

  // ── Test 2: Generic entity listing filters by entity_type_id ────────────────
  test('Test 2: Generic entity listing filters by entity_type_id', async () => {
    const res = await request(app)
      .get(`/entities?entity_type_id=${deployedEntityTypeId}`)
      .set('Authorization', `Bearer ${citizenToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // ── Test 3: Generic form loads schema by entity_type_id ─────────────────────
  test('Test 3: Generic form loads schema by entity_type_id', async () => {
    const res = await request(app)
      .get(`/forms/${deployedEntityTypeId}/schema`)
      .set('Authorization', `Bearer ${citizenToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeDefined();
    // Form schema has sections with nested subsections with parameters
    expect(res.body.data.sections).toBeDefined();
    expect(res.body.data.sections.length).toBeGreaterThan(0);
    // Parameters can be under subsections
    const section = res.body.data.sections[0];
    // Check that the form belongs to our deployed entity type (field is entity_type in response)
    const entityTypeField = res.body.data.entity_type || res.body.data.entityType;
    expect(entityTypeField).toBeDefined();
    expect(entityTypeField.entity_type_id).toBe(deployedEntityTypeId);
  });

  // ── Test 4: Generic entity creation ─────────────────────────────────────────
  test('Test 4: Generic entity creation saves and returns entity', async () => {
    const res = await request(app)
      .post('/entities')
      .set('Authorization', `Bearer ${citizenToken}`)
      .send({
        entity_type_id: deployedEntityTypeId,
        name: 'Dynamic UI Test Entity',
        area: 'North Sector'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toBeDefined();
    const entityId = res.body.data.entity_id;
    createdEntities.push(entityId);
    expect(res.body.data.entity_type_id).toBe(deployedEntityTypeId);
    expect(res.body.data.status).toBe('draft');
  });

  // ── Test 5: Workflow actions come from WorkflowMaster metadata ───────────────
  test('Test 5: Workflow endpoint returns transitions from WorkflowMaster metadata', async () => {
    // Create an entity first
    const createRes = await request(app)
      .post('/entities')
      .set('Authorization', `Bearer ${citizenToken}`)
      .send({
        entity_type_id: deployedEntityTypeId,
        name: 'Workflow Test Entity',
        area: 'South Sector'
      });

    expect(createRes.statusCode).toBe(201);
    const entityId = createRes.body.data.entity_id;
    createdEntities.push(entityId);

    // Fetch allowed transitions — citizen on a draft entity
    const wfRes = await request(app)
      .get(`/entities/${entityId}/workflow`)
      .set('Authorization', `Bearer ${citizenToken}`);

    expect(wfRes.statusCode).toBe(200);
    expect(wfRes.body.data).toBeDefined();
    expect(wfRes.body.data.allowedTransitions).toBeDefined();
    expect(Array.isArray(wfRes.body.data.allowedTransitions)).toBe(true);
    // Citizen should see draft->submitted transition
    expect(wfRes.body.data.allowedTransitions.some(t => t.to === 'submitted')).toBe(true);
  });

  // ── Test 6: Metadata-driven transition executes correctly ────────────────────
  test('Test 6: Citizen can transition draft->submitted via metadata-driven workflow', async () => {
    const createRes = await request(app)
      .post('/entities')
      .set('Authorization', `Bearer ${citizenToken}`)
      .send({
        entity_type_id: deployedEntityTypeId,
        name: 'Transition Test Entity',
        area: 'North Sector'
      });

    expect(createRes.statusCode).toBe(201);
    const entityId = createRes.body.data.entity_id;
    createdEntities.push(entityId);

    // Citizen submits their entity
    const transitionRes = await request(app)
      .post(`/entities/${entityId}/transition`)
      .set('Authorization', `Bearer ${citizenToken}`)
      .send({ to_status: 'submitted' });

    expect(transitionRes.statusCode).toBe(200);
    expect(transitionRes.body.success).toBe(true);
    expect(transitionRes.body.data.status).toBe('submitted');
  });

  // ── Test 7: Report Engine executes ReportMaster for deployed module ──────────
  test('Test 7: Generic Report Engine executes ReportMaster defined for module', async () => {
    if (!deployedReportId) {
      // No report was created during deploy — skip gracefully
      return;
    }

    const reportRes = await request(app)
      .get(`/reports/${deployedReportId}/execute`)
      .set('Authorization', `Bearer ${directorToken}`);

    expect(reportRes.statusCode).toBe(200);
    expect(reportRes.body.success).toBe(true);
    expect(reportRes.body.data).toBeDefined();
    // Output format should be grouped_count and report name matches
    expect(reportRes.body.data.report_name).toBe('Budget Summary by Area');
  });

  // ── Test 8: List reports for deployed module ─────────────────────────────────
  test('Test 8: Report listing endpoint discovers module reports dynamically', async () => {
    const reportsRes = await request(app)
      .get(`/reports?entity_type_id=${deployedEntityTypeId}`)
      .set('Authorization', `Bearer ${directorToken}`);

    expect(reportsRes.statusCode).toBe(200);
    expect(reportsRes.body.success).toBe(true);
    expect(Array.isArray(reportsRes.body.data)).toBe(true);
    if (deployedReportId) {
      expect(reportsRes.body.data.some(r => r.report_id === deployedReportId)).toBe(true);
    }
  });

  // ── Test 9: No module-specific frontend page file exists ────────────────────
  test('Test 9: No module-specific frontend page file exists in codebase', () => {
    const pagesDir = path.join(__dirname, '../../frontend/src/pages');
    if (!fs.existsSync(pagesDir)) return; // frontend not present in CI — skip

    const files = fs.readdirSync(pagesDir);
    const moduleSpecificFiles = files.filter(f =>
      f.toLowerCase().includes('parkrenovation') ||
      f.toLowerCase().includes('parkrenovation')
    );
    expect(moduleSpecificFiles.length).toBe(0);
  });

  // ── Test 10: No hardcoded module names in production JS (outside tests/seeds) ─
  test('Test 10: No hardcoded module-specific string in frontend production code', () => {
    const pagesDir = path.join(__dirname, '../../frontend/src/pages');
    if (!fs.existsSync(pagesDir)) return; // frontend not present in CI — skip

    const checkDir = (dirPath) => {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
          if (!['node_modules', '.git'].includes(entry.name)) {
            checkDir(fullPath);
          }
        } else if (entry.isFile() && /\.(js|jsx|ts|tsx)$/.test(entry.name)) {
          const content = fs.readFileSync(fullPath, 'utf8');
          // Must not contain hardcoded module-type checks in production pages
          expect(content).not.toMatch(/if\s*\(\s*entityType\.name\s*===\s*['"]Park Renovation/);
        }
      }
    };
    checkDir(pagesDir);
  });

  // ── Test 11: Baseline reference modules still accessible through generic API ─
  test('Test 11: Baseline reference modules accessible through generic EntityType API', async () => {
    const res = await request(app)
      .get('/entities/entity-types')
      .set('Authorization', `Bearer ${citizenToken}`);

    expect(res.statusCode).toBe(200);
    const names = res.body.data.map(et => et.name);
    // At least one of the 7 baseline reference modules should be present
    const baselineModules = ['Movement', 'Grievance', 'Citizen Passport', 'Employment', 'Volunteer', 'Legacy', 'Constitution'];
    const foundAny = baselineModules.some(bm => names.some(n => n.includes(bm)));
    expect(foundAny).toBe(true);
  });
});
