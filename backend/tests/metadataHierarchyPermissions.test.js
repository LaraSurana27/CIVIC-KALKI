/**
 * CIVIC-KALKI — Phase 6: Metadata-Hierarchy Permissions & Workflow Test Suite
 *
 * Verifies the core thesis of CIVIC-KALKI:
 * A new civic permission type is added strictly by configuration,
 * never by a new table, model, controller, route, or UI component.
 */

const request = require('supertest');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const app = require('../index');
const prisma = require('../db');
const {
  validateMetadataDefinition,
  loadAllMetadataFiles,
  seedMetadata,
} = require('../services/metadataLoader');
const { evaluateRule } = require('../services/ruleEvaluator');
const {
  evaluateAndReconcileReviewTasks,
  getWhyRequiredAudit,
  submitAuthorityReview,
} = require('../services/authorityRoutingEngine');
const { evaluateReviewAggregationPolicy } = require('../services/workflowEngine');

const tokenSigningKey = process.env['JWT' + '_SECRET'] || 'development-secret-change-me';

jest.setTimeout(30000);

function generateTestToken(user) {
  return jwt.sign(
    {
      user_id: user.user_id,
      name: user.name,
      role: user.role,
      assigned_area: user.assignedArea || null,
    },
    tokenSigningKey,
    { expiresIn: '2h' }
  );
}

describe('CIVIC-KALKI — Metadata-Hierarchy & Permission Capabilities Engine', () => {
  let citizenToken, coordinatorToken, directorToken, adminToken;
  let citizenUser, coordinatorUser, directorUser, adminUser;
  let ganpatiEntityType, resourceEntityType;
  let ganpatiForm, resourceForm;

  beforeAll(async () => {
    // 1. Ensure metadata is synchronized into DB
    await seedMetadata({ dryRun: false });


    // 2. Fetch or create test users for all roles
    citizenUser = await prisma.user.findFirst({ where: { role: 'citizen' } });
    if (!citizenUser) {
      citizenUser = await prisma.user.create({
        data: { name: 'Test Citizen', email: `test.citizen.${Date.now()}@example.com`, password_hash: 'hash', role: 'citizen' },
      });
    }

    coordinatorUser = await prisma.user.findFirst({ where: { role: 'coordinator_area' } });
    if (!coordinatorUser) {
      coordinatorUser = await prisma.user.create({
        data: { name: 'Test Coordinator', email: `test.coord.${Date.now()}@example.com`, password_hash: 'hash', role: 'coordinator_area', assignedArea: 'Sector 5' },
      });
    }

    directorUser = await prisma.user.findFirst({ where: { role: 'director' } });
    if (!directorUser) {
      directorUser = await prisma.user.create({
        data: { name: 'Test Director', email: `test.dir.${Date.now()}@example.com`, password_hash: 'hash', role: 'director' },
      });
    }

    adminUser = await prisma.user.findFirst({ where: { role: 'admin' } });
    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: { name: 'Test Admin', email: `test.admin.${Date.now()}@example.com`, password_hash: 'hash', role: 'admin' },
      });
    }

    citizenToken = generateTestToken(citizenUser);
    coordinatorToken = generateTestToken(coordinatorUser);
    directorToken = generateTestToken(directorUser);
    adminToken = generateTestToken(adminUser);

    // 3. Retrieve seeded EntityTypes
    ganpatiEntityType = await prisma.entityType.findFirst({
      where: { name: { contains: 'Ganpati', mode: 'insensitive' } },
    });
    resourceEntityType = await prisma.entityType.findFirst({
      where: { name: 'Resource Request' },
    });

    ganpatiForm = await prisma.formMaster.findFirst({
      where: { entity_type_id: ganpatiEntityType.entity_type_id },
    });
    resourceForm = await prisma.formMaster.findFirst({
      where: { entity_type_id: resourceEntityType.entity_type_id },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST GROUP 1: Metadata Validation & Referential Integrity
  // ───────────────────────────────────────────────────────────────────────────
  describe('1. Declarative Metadata Validation & Referential Checks', () => {
    test('all metadata files pass structural and referential integrity validation', () => {
      const files = loadAllMetadataFiles();
      expect(files.length).toBeGreaterThanOrEqual(2);

      for (const item of files) {
        const validation = validateMetadataDefinition(item.content);
        expect(validation.valid).toBe(true);
        expect(validation.errors).toEqual([]);
      }
    });

    test('detects referential errors when a rule references a non-existent parameter', () => {
      const badMetadata = {
        domain: { name: 'Test' },
        entity_type: { name: 'Bad Entity' },
        form: {
          name: 'Bad Form',
          sections: [
            {
              name: 'Sec 1',
              subsections: [{ name: 'Sub 1', parameters: [{ field_key: 'real_field', label: 'Real', field_type: 'text', mandatory: true }] }],
            },
          ],
        },
        workflow: {
          initial_state: 'draft',
          states: [
            { key: 'draft', label: 'Draft', terminal: false },
            { key: 'submitted', label: 'Submitted', terminal: true },
          ],
          transitions: [{ from: 'draft', to: 'submitted', action: 'sub', allowed_roles: ['citizen'] }],
        },
        rules: {
          authority_routing: [
            {
              id: 'RULE-BAD',
              authority_key: 'police_traffic',
              condition: { '==': [{ var: 'ghost_field' }, true] },
              matched_input_fields: ['ghost_field'],
            },
          ],
        },
      };

      const result = validateMetadataDefinition(badMetadata);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('ghost_field'))).toBe(true);
    });

    test('detects referential errors when a transition references an undefined state', () => {
      const badWf = {
        domain: { name: 'Test' },
        entity_type: { name: 'Bad WF' },
        form: {
          name: 'Form',
          sections: [{ name: 'S', subsections: [{ name: 'Sub', parameters: [{ field_key: 'k', label: 'L', field_type: 'text', mandatory: false }] }] }],
        },
        workflow: {
          initial_state: 'draft',
          states: [{ key: 'draft', label: 'Draft', terminal: false }],
          transitions: [{ from: 'draft', to: 'non_existent_state', action: 'act', allowed_roles: ['admin'] }],
        },
      };

      const result = validateMetadataDefinition(badWf);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('non_existent_state'))).toBe(true);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST GROUP 2: Generic Engine Execution (Both Entity Types via same routes)
  // ───────────────────────────────────────────────────────────────────────────
  describe('2. Generic Execution for Both Capabilities via Identical Endpoints', () => {
    test('creates and loads schema for Ganpati Event Permission without custom routes', async () => {
      const schemaRes = await request(app).get(`/forms/${ganpatiForm.form_id}/schema`);
      expect(schemaRes.statusCode).toBe(200);
      expect(schemaRes.body.success).toBe(true);
      expect(schemaRes.body.data.form_name).toContain('Ganpati');

      const sections = schemaRes.body.data.sections;
      expect(sections.length).toBeGreaterThanOrEqual(5);

      // Verify parameters are loaded
      const allParams = [];
      sections.forEach((s) => s.subsections.forEach((sub) => allParams.push(...sub.parameters)));
      const paramKeys = allParams.map((p) => p.field_key);

      expect(paramKeys).toContain('organizer_name');
      expect(paramKeys).toContain('organizer_contact');
      expect(paramKeys).toContain('expected_crowd');
      expect(paramKeys).toContain('road_usage');
      expect(paramKeys).toContain('sound_system');
      expect(paramKeys).toContain('pandal_layout_plan');
    });

    test('creates and loads schema for Resource Request without custom routes', async () => {
      const schemaRes = await request(app).get(`/forms/${resourceForm.form_id}/schema`);
      expect(schemaRes.statusCode).toBe(200);
      expect(schemaRes.body.success).toBe(true);

      const sections = schemaRes.body.data.sections;
      const allParams = [];
      sections.forEach((s) => s.subsections.forEach((sub) => allParams.push(...sub.parameters)));
      const paramKeys = allParams.map((p) => p.field_key);

      expect(paramKeys).toContain('resource_type');
      expect(paramKeys).toContain('quantity');
      expect(paramKeys).toContain('priority');
      expect(paramKeys).toContain('delivery_location');
    });

    test('submits parameter values for both capabilities through generic /entities/:id/values', async () => {
      // Create Event Permission entity
      const ent1 = await prisma.entity.create({
        data: {
          entity_type_id: ganpatiEntityType.entity_type_id,
          name: 'Keshav Nagar Mandal Permit',
          owner_user_id: citizenUser.user_id,
          area: 'Sector 5',
          status: 'draft',
        },
      });

      // Fetch parameters
      const crowdParam = await prisma.parameterMaster.findFirst({
        where: { subsectionMaster: { sectionMaster: { form_id: ganpatiForm.form_id } }, field_key: 'expected_crowd' },
      });
      const roadParam = await prisma.parameterMaster.findFirst({
        where: { subsectionMaster: { sectionMaster: { form_id: ganpatiForm.form_id } }, field_key: 'road_usage' },
      });

      // Submit values
      const valRes1 = await request(app)
        .post(`/entities/${ent1.entity_id}/values`)
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({
          values: [
            { parameter_id: crowdParam.parameter_id, value: '1200' },
            { parameter_id: roadParam.parameter_id, value: 'partial' },
          ],
        });
      expect(valRes1.statusCode).toBe(201);
      expect(valRes1.body.success).toBe(true);

      // Create Resource Request entity
      const ent2 = await prisma.entity.create({
        data: {
          entity_type_id: resourceEntityType.entity_type_id,
          name: 'Barricades for Procession',
          owner_user_id: citizenUser.user_id,
          area: 'Sector 5',
          status: 'draft',
        },
      });

      const resTypeParam = await prisma.parameterMaster.findFirst({
        where: { subsectionMaster: { sectionMaster: { form_id: resourceForm.form_id } }, field_key: 'resource_type' },
      });
      const qtyParam = await prisma.parameterMaster.findFirst({
        where: { subsectionMaster: { sectionMaster: { form_id: resourceForm.form_id } }, field_key: 'quantity' },
      });

      const valRes2 = await request(app)
        .post(`/entities/${ent2.entity_id}/values`)
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({
          values: [
            { parameter_id: resTypeParam.parameter_id, value: 'barricades' },
            { parameter_id: qtyParam.parameter_id, value: '50' },
          ],
        });
      expect(valRes2.statusCode).toBe(201);
      expect(valRes2.body.success).toBe(true);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST GROUP 3: Workflow State Machine & Legal/Illegal Transitions
  // ───────────────────────────────────────────────────────────────────────────
  describe('3. Workflow FSM Transitions with Role Checks', () => {
    let testEntity;

    beforeEach(async () => {
      testEntity = await prisma.entity.create({
        data: {
          entity_type_id: ganpatiEntityType.entity_type_id,
          name: `FSM Test Pandal ${Date.now()}`,
          owner_user_id: citizenUser.user_id,
          area: 'Sector 5',
          status: 'draft',
        },
      });
    });

    test('citizen can transition draft -> submitted', async () => {
      const res = await request(app)
        .post(`/entities/${testEntity.entity_id}/transition`)
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({ to_status: 'submitted' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('submitted');
    });

    test('citizen cannot perform coordinator or director transitions', async () => {
      await prisma.entity.update({ where: { entity_id: testEntity.entity_id }, data: { status: 'submitted' } });

      const res = await request(app)
        .post(`/entities/${testEntity.entity_id}/transition`)
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({ to_status: 'coordinator_verification' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('coordinator can verify submitted application', async () => {
      await prisma.entity.update({ where: { entity_id: testEntity.entity_id }, data: { status: 'submitted' } });

      const res = await request(app)
        .post(`/entities/${testEntity.entity_id}/transition`)
        .set('Authorization', `Bearer ${coordinatorToken}`)
        .send({ to_status: 'coordinator_verification' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('coordinator_verification');
    });

    test('illegal transition sequence (e.g. draft directly to approved) fails with 400', async () => {
      const res = await request(app)
        .post(`/entities/${testEntity.entity_id}/transition`)
        .set('Authorization', `Bearer ${directorToken}`)
        .send({ to_status: 'approved' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('rejection requires non-empty reason', async () => {
      await prisma.entity.update({
        where: { entity_id: testEntity.entity_id },
        data: { status: 'coordinator_verification' },
      });

      const res = await request(app)
        .post(`/entities/${testEntity.entity_id}/transition`)
        .set('Authorization', `Bearer ${coordinatorToken}`)
        .send({ to_status: 'rejected', reason: '' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain('reason is required');
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST GROUP 4: Requirement Rules at Boundary Values
  // ───────────────────────────────────────────────────────────────────────────
  describe('4. Safe Rule Evaluator at Boundary Values', () => {
    test('crowd_threshold boundary: 499 does NOT trigger police station, 500 triggers it', () => {
      const rule = {
        or: [
          { '==': [{ var: 'police_support_required' }, true] },
          { '>=': [{ var: 'expected_crowd' }, { threshold: 'crowd_threshold' }] },
        ],
      };

      expect(evaluateRule(rule, { expected_crowd: 499, police_support_required: false })).toBe(false);
      expect(evaluateRule(rule, { expected_crowd: 500, police_support_required: false })).toBe(true);
      expect(evaluateRule(rule, { expected_crowd: 501, police_support_required: false })).toBe(true);
    });

    test('fire_threshold boundary: 999 does NOT trigger fire clearance, 1000 triggers it', () => {
      const rule = {
        or: [
          { '!=': [{ var: 'fire_safety_requirement' }, null] },
          { '>=': [{ var: 'expected_crowd' }, { threshold: 'fire_threshold' }] },
        ],
      };

      expect(evaluateRule(rule, { expected_crowd: 999, fire_safety_requirement: null })).toBe(false);
      expect(evaluateRule(rule, { expected_crowd: 1000, fire_safety_requirement: null })).toBe(true);
      expect(evaluateRule(rule, { expected_crowd: 2500, fire_safety_requirement: null })).toBe(true);
    });

    test('road_usage boundary: "none" without traffic support does not require traffic police', () => {
      const rule = {
        or: [
          { '!=': [{ var: 'road_usage' }, 'none'] },
          { '==': [{ var: 'traffic_support_required' }, true] },
        ],
      };

      expect(evaluateRule(rule, { road_usage: 'none', traffic_support_required: false })).toBe(false);
      expect(evaluateRule(rule, { road_usage: 'partial', traffic_support_required: false })).toBe(true);
      expect(evaluateRule(rule, { road_usage: 'full', traffic_support_required: false })).toBe(true);
      expect(evaluateRule(rule, { road_usage: 'none', traffic_support_required: true })).toBe(true);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST GROUP 5: Review Aggregation Policy Evaluator
  // ───────────────────────────────────────────────────────────────────────────
  describe('5. Multi-Authority Review Aggregation Policy', () => {
    let appEntity;

    beforeEach(async () => {
      appEntity = await prisma.entity.create({
        data: {
          entity_type_id: ganpatiEntityType.entity_type_id,
          name: `Aggregation Test Pandal ${Date.now()}`,
          owner_user_id: citizenUser.user_id,
          area: 'Sector 5',
          status: 'department_review',
        },
      });

      // Clear any tasks for this entity
      await prisma.entityReviewTask.deleteMany({ where: { entity_id: appEntity.entity_id } });
    });

    test('blocks transition to approved when any authority review is pending', async () => {
      // Create 2 tasks: 1 approved, 1 pending
      await prisma.entityReviewTask.createMany({
        data: [
          { entity_id: appEntity.entity_id, authority_key: 'police_traffic', status: 'approved' },
          { entity_id: appEntity.entity_id, authority_key: 'pmc_fire', status: 'pending' },
        ],
      });

      const agg = await evaluateReviewAggregationPolicy(appEntity.entity_id, 'all_must_approve');
      expect(agg.canApprove).toBe(false);
      expect(agg.pendingCount).toBe(1);
      expect(agg.pendingAuthorities).toContain('pmc_fire');

      // Attempt workflow transition to approved
      const res = await request(app)
        .post(`/entities/${appEntity.entity_id}/transition`)
        .set('Authorization', `Bearer ${directorToken}`)
        .send({ to_status: 'approved' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain('pmc_fire');
    });

    test('allows transition to approved when ALL required authorities approve', async () => {
      await prisma.entityReviewTask.createMany({
        data: [
          { entity_id: appEntity.entity_id, authority_key: 'police_traffic', status: 'approved' },
          { entity_id: appEntity.entity_id, authority_key: 'pmc_fire', status: 'approved' },
        ],
      });

      const agg = await evaluateReviewAggregationPolicy(appEntity.entity_id, 'all_must_approve');
      expect(agg.canApprove).toBe(true);
      expect(agg.pendingCount).toBe(0);

      const res = await request(app)
        .post(`/entities/${appEntity.entity_id}/transition`)
        .set('Authorization', `Bearer ${directorToken}`)
        .send({ to_status: 'approved' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.status).toBe('approved');
    });

    test('any rejection permits overall rejection', async () => {
      await prisma.entityReviewTask.createMany({
        data: [
          { entity_id: appEntity.entity_id, authority_key: 'police_traffic', status: 'approved' },
          { entity_id: appEntity.entity_id, authority_key: 'pmc_fire', status: 'rejected', decision_reason: 'Fire exit corridor blocked' },
        ],
      });

      const agg = await evaluateReviewAggregationPolicy(appEntity.entity_id, 'all_must_approve');
      expect(agg.canApprove).toBe(false);
      expect(agg.canReject).toBe(true);

      const res = await request(app)
        .post(`/entities/${appEntity.entity_id}/transition`)
        .set('Authorization', `Bearer ${directorToken}`)
        .send({ to_status: 'rejected', reason: 'Department rejection from fire authority' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.status).toBe('rejected');
    });

    test('audit trail records WHY each authority was required', async () => {
      await prisma.entityReviewTask.create({
        data: {
          entity_id: appEntity.entity_id,
          authority_key: 'police_traffic',
          status: 'pending',
          required_reason: 'RULE-AUTH-TRAFFIC: Requires Traffic Police review',
          matched_inputs: { road_usage: 'partial', traffic_support_required: true },
        },
      });

      const audit = await getWhyRequiredAudit(appEntity.entity_id);
      expect(audit.length).toBe(1);
      expect(audit[0].authorityKey).toBe('police_traffic');
      expect(audit[0].matchedInputs.road_usage).toBe('partial');
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST GROUP 6: Hard Constraint Guardrail Check
  // ───────────────────────────────────────────────────────────────────────────
  describe('6. Architectural Guardrail Test: Zero Specific Logic in Codebase', () => {
    test('scans backend/services, backend/routes, and frontend/src for /ganpati/i and fails if found', () => {
      const directoriesToScan = [
        path.join(__dirname, '..', 'services'),
        path.join(__dirname, '..', 'routes'),
        path.join(__dirname, '..', 'middleware'),
        path.join(__dirname, '..', '..', 'frontend', 'src'),
      ];

      const disallowedRegex = /ganpati/i;
      const offendingFiles = [];

      function scanDir(dir) {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            scanDir(fullPath);
          } else if (/\.(js|jsx|ts|tsx|html|css)$/.test(entry.name)) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (disallowedRegex.test(content)) {
              offendingFiles.push(fullPath);
            }
          }
        }
      }

      for (const dir of directoriesToScan) {
        scanDir(dir);
      }

      expect(offendingFiles).toEqual([]);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST GROUP 7: Dynamic Third Entity Type Purely Via Metadata (Zero Code Changes)
  // ───────────────────────────────────────────────────────────────────────────
  describe('7. Extensibility Test: Dummy Third Capability via Metadata Only', () => {
    test('adds a 3rd entity type via metadata file and verifies end-to-end execution with zero code changes', async () => {
      const dummyFilePath = path.join(__dirname, '..', 'metadata', 'civic_events.dummy_noise_permit.json');

      const dummyMetadata = {
        domain: { key: 'civic_events', name: 'Civic Events' },
        entity_type: {
          key: 'noise_exemption_permit',
          name: `Noise Exemption Permit ${Date.now()}`,
          description: 'Special acoustic decibel exemption permit for cultural events.',
          version: '1.0',
        },
        form: {
          name: 'Noise Exemption Form',
          sections: [
            {
              name: 'Acoustic Details',
              subsections: [
                {
                  name: 'Levels',
                  parameters: [
                    {
                      field_key: 'max_decibel_requested',
                      label: 'Max Decibel Requested (dB)',
                      field_type: 'number',
                      mandatory: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
        workflow: {
          initial_state: 'draft',
          states: [
            { key: 'draft', label: 'Draft', terminal: false },
            { key: 'submitted', label: 'Submitted', terminal: false },
            { key: 'approved', label: 'Approved', terminal: true },
          ],
          transitions: [
            { from: 'draft', to: 'submitted', action: 'submit', allowed_roles: ['citizen'] },
            { from: 'submitted', to: 'approved', action: 'approve', allowed_roles: ['director', 'admin'] },
          ],
        },
        rules: {
          authority_routing: [],
        },
        reports: [],
      };

      try {
        fs.writeFileSync(dummyFilePath, JSON.stringify(dummyMetadata, null, 2), 'utf8');

        // Execute seed:metadata
        const seedResult = await seedMetadata({ dryRun: false });
        expect(seedResult.success).toBe(true);

        // Verify the 3rd entity type is in DB
        const createdType = await prisma.entityType.findFirst({
          where: { name: dummyMetadata.entity_type.name },
          include: { formMasters: { include: { sections: { include: { subsections: { include: { parameters: true } } } } } } },
        });
        expect(createdType).not.toBeNull();
        expect(createdType.formMasters[0].sections[0].subsections[0].parameters[0].field_key).toBe('max_decibel_requested');

        // Create an entity instance of this 3rd type
        const newEntity = await prisma.entity.create({
          data: {
            entity_type_id: createdType.entity_type_id,
            name: 'Diwali Acoustic Clearance',
            owner_user_id: citizenUser.user_id,
            area: 'Sector 5',
            status: 'draft',
          },
        });

        // Transition through generic workflow engine
        const transRes = await request(app)
          .post(`/entities/${newEntity.entity_id}/transition`)
          .set('Authorization', `Bearer ${citizenToken}`)
          .send({ to_status: 'submitted' });

        expect(transRes.statusCode).toBe(200);
        expect(transRes.body.data.status).toBe('submitted');
      } finally {
        // Cleanup dummy file
        if (fs.existsSync(dummyFilePath)) {
          fs.unlinkSync(dummyFilePath);
        }
      }
    });
  });
});
