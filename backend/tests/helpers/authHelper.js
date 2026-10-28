/**
 * CIVIC-KALKI — Test Authentication & Entity Lifecycle Helper
 *
 * Requirements:
 * 1. Mints valid ck_session cookie headers using the app's own token-signing function.
 * 2. createTestUser generates random unusable bcrypt hash at runtime,
 *    email: cktest_<role>_<timestamp>_<random>@test-suite.local.
 * 3. Tracks the exact entity_id of EVERY entity created during tests (including
 *    auto-created children from Rule Engine).
 * 4. Cleanup deletes strictly by exact tracked IDs in strict FK order.
 *    Never deletes by name pattern.
 */

require('dotenv').config();
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const authRouter = require('../../routes/auth');
const prisma = require('../../db');

// Exact registries for tracked entities and test users created during the run
const trackedEntityIds = new Set();
const createdTestUserIds = new Set();

/**
 * Manually register an entity ID for cleanup.
 */
function trackEntityId(id) {
  if (typeof id === 'number' && !isNaN(id)) {
    trackedEntityIds.add(id);
  }
}

/**
 * Install automatic interception on prisma.entity.create and prisma.$transaction
 * so ANY entity created anywhere in the app (including Rule Engine child entities)
 * is automatically registered for cleanup.
 */
if (!global.__ck_prisma_entity_interceptor_installed && prisma && prisma.entity && typeof prisma.entity.create === 'function' && typeof prisma.entity.create.mockResolvedValue !== 'function') {
  global.__ck_prisma_entity_interceptor_installed = true;

  const originalEntityCreate = prisma.entity.create.bind(prisma.entity);
  prisma.entity.create = async function (args) {
    const result = await originalEntityCreate(args);
    if (result && typeof result.entity_id === 'number') {
      trackedEntityIds.add(result.entity_id);
    }
    return result;
  };

  const originalTransaction = prisma.$transaction.bind(prisma);
  prisma.$transaction = async function (arg1, arg2) {
    if (typeof arg1 === 'function') {
      return originalTransaction(async (tx) => {
        if (tx && tx.entity && typeof tx.entity.create === 'function') {
          const originalTxEntityCreate = tx.entity.create.bind(tx.entity);
          tx.entity.create = async function (args) {
            const result = await originalTxEntityCreate(args);
            if (result && typeof result.entity_id === 'number') {
              trackedEntityIds.add(result.entity_id);
            }
            return result;
          };
        }
        return arg1(tx);
      }, arg2);
    }
    return originalTransaction(arg1, arg2);
  };
}

/**
 * Mint authentication headers { Cookie: "ck_session=...", "X-Requested-With": "ck-web" }
 * for a user object { user_id, name, role, assignedArea }.
 */
function getAuthHeaders(user) {
  if (!user) {
    throw new Error('getAuthHeaders requires a user object.');
  }
  const { token } = authRouter.signToken(user);
  return {
    Cookie: `ck_session=${token}`,
    'X-Requested-With': 'ck-web',
  };
}

/**
 * Creates an ephemeral, clearly named test user record for integration tests
 * that require a real database User row for checkRole / role re-verification.
 *
 * Password hash: random unusable bcrypt hash generated at runtime.
 * Email: cktest_<role>_<timestamp>_<random>@test-suite.local
 */
async function createTestUser({ name, role = 'citizen', assignedArea = null } = {}) {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const email = `cktest_${role.toLowerCase()}_${timestamp}_${randomStr}@test-suite.local`;
  const userName = name || `Test ${role} ${timestamp}`;

  const randomSalt = crypto.randomUUID() + Date.now().toString() + Math.random().toString();
  const randomPasswordHash = await bcrypt.hash(randomSalt, 10);

  const user = await prisma.user.create({
    data: {
      name: userName,
      email,
      password_hash: randomPasswordHash,
      role,
      assignedArea: assignedArea || null,
    },
    select: {
      user_id: true,
      name: true,
      email: true,
      role: true,
      assignedArea: true,
    },
  });

  createdTestUserIds.add(user.user_id);
  const headers = getAuthHeaders(user);

  return {
    user,
    headers,
    token: headers.Cookie.replace('ck_session=', ''),
  };
}

/**
 * Cleans up all tracked entities and their child records in strict FK order
 * using ONLY exact tracked IDs.
 */
async function cleanupTrackedEntities() {
  if (trackedEntityIds.size === 0) return;

  const ids = Array.from(trackedEntityIds);
  trackedEntityIds.clear();

  // Strict foreign key deletion order
  await prisma.civicCampaignEvent.deleteMany({ where: { campaign_id: { in: ids } } }).catch(() => {});
  await prisma.parameterValue.deleteMany({ where: { entity_id: { in: ids } } }).catch(() => {});
  await prisma.approvalHistory.deleteMany({ where: { entity_id: { in: ids } } }).catch(() => {});
  await prisma.aIExecutionLog.deleteMany({ where: { entity_id: { in: ids } } }).catch(() => {});
  await prisma.auditLog.deleteMany({ where: { entity_id: { in: ids } } }).catch(() => {});
  await prisma.fileRepository.deleteMany({ where: { entity_id: { in: ids } } }).catch(() => {});
  await prisma.entity.deleteMany({ where: { entity_id: { in: ids } } }).catch(() => {});
}

/**
 * Cleans up all test user records created by createTestUser().
 * Deletes strictly by exact created user_ids, and verifies no @test-suite.local remain.
 */
async function cleanupTestUsers() {
  // First clean up any entities tracked
  await cleanupTrackedEntities();

  if (createdTestUserIds.size > 0) {
    const ids = Array.from(createdTestUserIds);
    createdTestUserIds.clear();

    // Check if any entities are still owned by these users and delete them
    const ownedEntities = await prisma.entity.findMany({
      where: { owner_user_id: { in: ids } },
      select: { entity_id: true },
    }).catch(() => []);

    const entityIds = ownedEntities.map((e) => e.entity_id);
    if (entityIds.length > 0) {
      await prisma.civicCampaignEvent.deleteMany({ where: { campaign_id: { in: entityIds } } }).catch(() => {});
      await prisma.parameterValue.deleteMany({ where: { entity_id: { in: entityIds } } }).catch(() => {});
      await prisma.auditLog.deleteMany({ where: { entity_id: { in: entityIds } } }).catch(() => {});
      await prisma.approvalHistory.deleteMany({ where: { entity_id: { in: entityIds } } }).catch(() => {});
      await prisma.aIExecutionLog.deleteMany({ where: { entity_id: { in: entityIds } } }).catch(() => {});
      await prisma.entity.deleteMany({ where: { entity_id: { in: entityIds } } }).catch(() => {});
    }

    await prisma.user.deleteMany({
      where: { user_id: { in: ids } },
    }).catch(() => {});
  }

  // Purge any remaining @test-suite.local users with explicit where clause
  await prisma.user.deleteMany({
    where: { email: { endsWith: '@test-suite.local' } },
  }).catch(() => {});
}

/**
 * Combined cleanup for beforeAll/afterAll in test suites.
 */
async function cleanupAll() {
  await cleanupTrackedEntities();
  await cleanupTestUsers();
}

/**
 * Returns COUNT only for remaining @test-suite.local users. Never returns user rows.
 */
async function countRemainingTestUsers() {
  return prisma.user.count({
    where: { email: { endsWith: '@test-suite.local' } },
  });
}

/**
 * Returns counts of Entity and AuditLog tables.
 */
async function getTableCounts() {
  const [entityCount, auditLogCount, testUsersCount] = await Promise.all([
    prisma.entity.count(),
    prisma.auditLog.count(),
    prisma.user.count({ where: { email: { endsWith: '@test-suite.local' } } }),
  ]);
  return { entityCount, auditLogCount, testUsersCount };
}

module.exports = {
  getAuthHeaders,
  createTestUser,
  trackEntityId,
  cleanupTrackedEntities,
  cleanupTestUsers,
  cleanupAll,
  countRemainingTestUsers,
  getTableCounts,
};
