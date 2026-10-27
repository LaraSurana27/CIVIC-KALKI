/**
 * CIVIC-KALKI — Location & Auth Backend Tests
 *
 * Tests cookie-based authentication (ck_session), CSRF protection,
 * rate limiting, location visibility hierarchy, coordinate validation,
 * and the /entities/nearby endpoint.
 *
 * NOTE: These tests are self-contained. They use supertest's cookie-jar
 * support and do NOT rely on Authorization: Bearer headers.
 *
 * Requires JWT_SECRET to be at least 32 chars in the test environment.
 * Tests run in-process against the Express app, so no separate server needed.
 */

'use strict';

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../index');

// ── Helpers ────────────────────────────────────────────────────────────────────

const TAG = `loc-auth-${Date.now()}`;

function makeEmail(suffix) {
  return `${TAG}-${suffix}@example.com`;
}

function getJwtSecret() {
  return process.env.JWT_SECRET;
}

/**
 * Sign a JWT with our secret and return it as a Set-Cookie header value
 * so we can inject it into requests without going through the login flow.
 */
function makeSessionCookie(payload, expiresIn = '1h') {
  const secret = getJwtSecret();
  const token = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn });
  return `ck_session=${token}; Path=/; HttpOnly`;
}

/**
 * Perform a POST to /auth/signup and return { statusCode, cookie, body }
 */
async function signup(name, email, password) {
  const res = await request(app)
    .post('/auth/signup')
    .set('X-Requested-With', 'ck-web')
    .set('Origin', 'http://localhost:5173')
    .send({ name, email, password });
  const cookie = (res.headers['set-cookie'] || []).find((c) => c.startsWith('ck_session='));
  return { statusCode: res.statusCode, cookie, body: res.body };
}

// ── Test state ────────────────────────────────────────────────────────────────

let citizenCookie;
let adminCookie;
let prisma;

beforeAll(async () => {
  // Lazy-require prisma so we can clean up after ourselves
  prisma = require('../db');

  // Sign up a citizen
  const c = await signup('Test Citizen', makeEmail('citizen'), 'Password123!');
  expect(c.statusCode).toBe(201);
  citizenCookie = c.cookie;

  // Create an admin user via direct JWT (for endpoints that need admin)
  // We seed one if it doesn't exist.
  const adminEmail = makeEmail('admin');
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  let adminUser;
  if (!existing) {
    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash('AdminPass123!', 12);
    adminUser = await prisma.user.create({
      data: { name: 'Test Admin', email: adminEmail, password_hash: hash, role: 'admin' },
    });
  } else {
    adminUser = existing;
  }

  adminCookie = makeSessionCookie({
    user_id: adminUser.user_id,
    name: adminUser.name,
    role: 'admin',
    assignedArea: null,
  });
}, 30000);

afterAll(async () => {
  // Clean up test entities and users
  try {
    await prisma.entity.deleteMany({ where: { name: { startsWith: TAG } } });
    await prisma.user.deleteMany({ where: { email: { contains: TAG } } });
  } catch (_) {
    // Best-effort cleanup
  }
  await prisma.$disconnect();
}, 15000);

// ═════════════════════════════════════════════════════════════════════════════
// 1. COOKIE AUTHENTICATION
// ═════════════════════════════════════════════════════════════════════════════

describe('Cookie Auth — ck_session', () => {
  test('POST /auth/signup sets ck_session httpOnly cookie', async () => {
    const email = makeEmail('signup-test');
    const res = await request(app)
      .post('/auth/signup')
      .set('X-Requested-With', 'ck-web')
      .set('Origin', 'http://localhost:5173')
      .send({ name: 'Cookie Test', email, password: 'Password123!' });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    // Token must NOT be in response body
    expect(res.body.data).not.toHaveProperty('token');
    // Cookie must be set
    const cookies = res.headers['set-cookie'] || [];
    const ckCookie = cookies.find((c) => c.startsWith('ck_session='));
    expect(ckCookie).toBeDefined();
    expect(ckCookie).toMatch(/HttpOnly/i);
    expect(ckCookie).toMatch(/SameSite=Lax/i);
    // expires_at must be present in body
    expect(res.body.data).toHaveProperty('expires_at');
    expect(res.body.data).toHaveProperty('user');
  }, 15000);

  test('POST /auth/login sets ck_session cookie on success', async () => {
    const email = makeEmail('login-set-cookie');
    await signup('Login Cookie', email, 'Password123!');

    const res = await request(app)
      .post('/auth/login')
      .set('X-Requested-With', 'ck-web')
      .set('Origin', 'http://localhost:5173')
      .send({ email, password: 'Password123!' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    const cookies = res.headers['set-cookie'] || [];
    expect(cookies.some((c) => c.startsWith('ck_session='))).toBe(true);
  }, 15000);

  test('POST /auth/logout clears ck_session cookie', async () => {
    const res = await request(app)
      .post('/auth/logout')
      .set('Cookie', citizenCookie)
      .set('X-Requested-With', 'ck-web')
      .set('Origin', 'http://localhost:5173');

    expect(res.statusCode).toBe(200);
    const cookies = res.headers['set-cookie'] || [];
    // The cookie should be cleared (expires in the past or Max-Age=0)
    const cleared = cookies.find((c) => c.startsWith('ck_session='));
    // Either the value is empty, or Max-Age=0, or expires in the past
    if (cleared) {
      const isCleared = cleared.includes('Max-Age=0') ||
        cleared.includes('expires=Thu, 01 Jan 1970') ||
        cleared.match(/ck_session=;/) ||
        cleared.match(/ck_session=\s*;/);
      expect(isCleared).toBeTruthy();
    }
  }, 10000);

  test('GET /auth/me with valid cookie returns user + expires_at', async () => {
    const res = await request(app)
      .get('/auth/me')
      .set('Cookie', citizenCookie)
      .set('X-Requested-With', 'ck-web');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('user');
    expect(res.body.data).toHaveProperty('expires_at');
  }, 10000);

  test('GET /auth/me without cookie returns 401', async () => {
    const res = await request(app)
      .get('/auth/me')
      .set('X-Requested-With', 'ck-web');

    expect(res.statusCode).toBe(401);
  }, 10000);

  test('GET /auth/me with tampered cookie returns 401', async () => {
    const res = await request(app)
      .get('/auth/me')
      .set('Cookie', 'ck_session=this.is.not.valid')
      .set('X-Requested-With', 'ck-web');

    expect(res.statusCode).toBe(401);
  }, 10000);

  test('Expired token returns 401', async () => {
    const expiredCookie = makeSessionCookie({ user_id: 9999, role: 'citizen' }, '-1s');
    const res = await request(app)
      .get('/auth/me')
      .set('Cookie', expiredCookie)
      .set('X-Requested-With', 'ck-web');

    expect(res.statusCode).toBe(401);
  }, 10000);
});

// ═════════════════════════════════════════════════════════════════════════════
// 2. CSRF PROTECTION
// ═════════════════════════════════════════════════════════════════════════════

describe('CSRF Protection', () => {
  test('POST from a non-allowed origin is blocked by CORS (not 200)', async () => {
    const res = await request(app)
      .post('/auth/login')
      .set('Origin', 'https://evil.example.com')
      // NOTE: no X-Requested-With header
      .send({ email: 'anyone@example.com', password: 'Password123' });

    // CORS middleware throws without a statusCode → errorHandler emits 500.
    // Either way, the request must NOT succeed (not 200 / 201).
    expect(res.statusCode).not.toBe(200);
    expect(res.statusCode).not.toBe(201);
    // Must be a 4xx or 5xx
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  }, 10000);

  test('POST with correct X-Requested-With and allowed origin passes CSRF', async () => {
    const res = await request(app)
      .post('/auth/login')
      .set('X-Requested-With', 'ck-web')
      .set('Origin', 'http://localhost:5173')
      .send({ email: makeEmail('nonexistent'), password: 'wrongpass1' });

    // Should fail with 401 (wrong creds) — not 403 CSRF
    expect([401, 429]).toContain(res.statusCode);
  }, 10000);

  test('GET requests are not blocked by CSRF', async () => {
    const res = await request(app)
      .get('/health');

    expect(res.statusCode).toBe(200);
  }, 5000);
});

// ═════════════════════════════════════════════════════════════════════════════
// 3. RATE LIMITING
// ═════════════════════════════════════════════════════════════════════════════

describe('Login Rate Limiting', () => {
  test('5 failed logins then 429 on 6th attempt', async () => {
    const email = makeEmail('rate-limit-test');
    // Sign up so the email exists
    await signup('Rate Limit User', email, 'CorrectPass1!');

    // Send 5 failed attempts
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post('/auth/login')
        .set('X-Requested-With', 'ck-web')
        .set('Origin', 'http://localhost:5173')
        .send({ email, password: 'WrongPassword1!' });
    }

    // 6th attempt should be rate-limited
    const res = await request(app)
      .post('/auth/login')
      .set('X-Requested-With', 'ck-web')
      .set('Origin', 'http://localhost:5173')
      .send({ email, password: 'WrongPassword1!' });

    expect(res.statusCode).toBe(429);
  }, 30000);
});

// ═════════════════════════════════════════════════════════════════════════════
// 4. COORDINATE VALIDATION
// ═════════════════════════════════════════════════════════════════════════════

describe('Coordinate Validation on POST /entities', () => {
  test('latitude without longitude returns 400', async () => {
    const res = await request(app)
      .post('/entities')
      .set('Cookie', citizenCookie)
      .set('X-Requested-With', 'ck-web')
      .send({ entity_type_id: 1, name: `${TAG} coord-test`, latitude: 28.6139 });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/longitude/i);
  }, 15000);

  test('latitude out of range returns 400', async () => {
    const res = await request(app)
      .post('/entities')
      .set('Cookie', citizenCookie)
      .set('X-Requested-With', 'ck-web')
      .send({ entity_type_id: 1, name: `${TAG} coord-test-lat`, latitude: 95, longitude: 77 });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/latitude/i);
  }, 15000);

  test('longitude out of range returns 400', async () => {
    const res = await request(app)
      .post('/entities')
      .set('Cookie', citizenCookie)
      .set('X-Requested-With', 'ck-web')
      .send({ entity_type_id: 1, name: `${TAG} coord-test-lng`, latitude: 28.6, longitude: 200 });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/longitude/i);
  }, 15000);

  test('valid coordinates accepted on POST /entities', async () => {
    const res = await request(app)
      .post('/entities')
      .set('Cookie', citizenCookie)
      .set('X-Requested-With', 'ck-web')
      .send({ entity_type_id: 1, name: `${TAG} valid-coords`, latitude: 28.6139, longitude: 77.2090 });

    // Either 201 or 400 due to entity_type_id=1 not necessarily existing in test DB
    // We just assert it's not a coordinate error
    if (res.statusCode === 400) {
      expect(res.body.error).not.toMatch(/latitude|longitude/i);
    } else {
      expect(res.statusCode).toBe(201);
      expect(res.body.data).toHaveProperty('entity_id');
    }
  }, 15000);
});

// ═════════════════════════════════════════════════════════════════════════════
// 5. LOCATION VISIBILITY HIERARCHY
// ═════════════════════════════════════════════════════════════════════════════

describe('Location Visibility — canViewLocation unit tests', () => {
  const { canViewLocation } = require('../services/locationVisibility');

  const restrictedType = { location_visibility: 'restricted' };
  const publicType = { location_visibility: 'public_when_approved' };

  const draftEntity = {
    entity_id: 1,
    status: 'draft',
    area: 'Sector 5',
    owner_user_id: 10,
    entityType: restrictedType,
  };

  const approvedEntity = {
    entity_id: 2,
    status: 'Approved', // mixed case — normalised to lowercase inside
    area: 'Sector 5',
    owner_user_id: 10,
    entityType: publicType,
  };

  const unassignedEntity = {
    entity_id: 3,
    status: 'draft',
    area: null,
    owner_user_id: 20,
    entityType: restrictedType,
  };

  // Anonymous
  test('Anonymous cannot view restricted draft entity', () => {
    expect(canViewLocation(draftEntity, restrictedType, undefined)).toBe(false);
  });

  test('Anonymous cannot view not-yet-approved public entity', () => {
    const notYetApproved = { ...approvedEntity, status: 'coordinator_approved' };
    expect(canViewLocation(notYetApproved, publicType, undefined)).toBe(false);
  });

  test('Anonymous CAN view fully approved public entity', () => {
    expect(canViewLocation(approvedEntity, publicType, undefined)).toBe(true);
  });

  // "coordinator_approved" is NOT the final approved state
  test('"coordinator_approved" is not final — should not expose to anonymous', () => {
    const coordApproved = { ...approvedEntity, status: 'coordinator_approved' };
    expect(canViewLocation(coordApproved, publicType, undefined)).toBe(false);
  });

  // Owner
  test('Owner CAN view their own restricted draft entity', () => {
    const owner = { user_id: 10, role: 'citizen', assignedArea: null };
    expect(canViewLocation(draftEntity, restrictedType, owner)).toBe(true);
  });

  test('Non-owner citizen CANNOT view restricted entity', () => {
    const other = { user_id: 99, role: 'citizen', assignedArea: null };
    expect(canViewLocation(draftEntity, restrictedType, other)).toBe(false);
  });

  // Admin / Director
  test('Admin CAN view any entity', () => {
    const admin = { user_id: 1, role: 'admin', assignedArea: null };
    expect(canViewLocation(draftEntity, restrictedType, admin)).toBe(true);
  });

  test('Director CAN view any entity', () => {
    const director = { user_id: 2, role: 'director', assignedArea: null };
    expect(canViewLocation(draftEntity, restrictedType, director)).toBe(true);
  });

  // Area coordinator
  test('coordinator_area with matching area CAN view entity', () => {
    const coord = { user_id: 3, role: 'coordinator_area', assignedArea: 'Sector 5' };
    expect(canViewLocation(draftEntity, restrictedType, coord)).toBe(true);
  });

  test('coordinator_area with different area CANNOT view entity', () => {
    const coord = { user_id: 3, role: 'coordinator_area', assignedArea: 'Sector X' };
    expect(canViewLocation(draftEntity, restrictedType, coord)).toBe(false);
  });

  // General coordinator
  test('coordinator_general CAN view entity with null area', () => {
    const coord = { user_id: 4, role: 'coordinator_general', assignedArea: 'Unassigned' };
    expect(canViewLocation(unassignedEntity, restrictedType, coord)).toBe(true);
  });

  test('coordinator_general CANNOT view entity with assigned area', () => {
    const coord = { user_id: 4, role: 'coordinator_general', assignedArea: 'Unassigned' };
    expect(canViewLocation(draftEntity, restrictedType, coord)).toBe(false);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 6. applyLocationVisibility integration
// ═════════════════════════════════════════════════════════════════════════════

describe('applyLocationVisibility — response sanitization', () => {
  const { applyLocationVisibility } = require('../services/locationVisibility');

  const entity = {
    entity_id: 5,
    name: 'Test Entity',
    status: 'draft',
    area: 'Sector 5',
    owner_user_id: 42,
    latitude: 28.61,
    longitude: 77.21,
    location: 'New Delhi',
    entityType: { location_visibility: 'restricted' },
  };

  test('Unauthorized requester gets entity with lat/lng/location stripped', () => {
    const result = applyLocationVisibility(entity, undefined);
    expect(result).not.toHaveProperty('latitude');
    expect(result).not.toHaveProperty('longitude');
    expect(result).not.toHaveProperty('location');
    expect(result.name).toBe('Test Entity');
  });

  test('Owner gets entity with lat/lng/location intact', () => {
    const owner = { user_id: 42, role: 'citizen' };
    const result = applyLocationVisibility(entity, owner);
    expect(result.latitude).toBe(28.61);
    expect(result.longitude).toBe(77.21);
    expect(result.location).toBe('New Delhi');
  });

  test('Admin gets entity with lat/lng/location intact', () => {
    const admin = { user_id: 1, role: 'admin' };
    const result = applyLocationVisibility(entity, admin);
    expect(result.latitude).toBe(28.61);
  });

  test('Original entity object is not mutated when stripping', () => {
    const original = { ...entity };
    applyLocationVisibility(entity, undefined);
    expect(entity.latitude).toBe(28.61); // must not mutate
    expect(entity.longitude).toBe(77.21);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 7. GET /entities/nearby
// ═════════════════════════════════════════════════════════════════════════════

describe('GET /entities/nearby', () => {
  test('Missing lat/lng returns 400', async () => {
    const res = await request(app)
      .get('/entities/nearby')
      .set('X-Requested-With', 'ck-web');

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/lat.*lng|lng.*lat/i);
  }, 10000);

  test('Invalid lat returns 400', async () => {
    const res = await request(app)
      .get('/entities/nearby?lat=999&lng=77')
      .set('X-Requested-With', 'ck-web');

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/lat/i);
  }, 10000);

  test('Invalid lng returns 400', async () => {
    const res = await request(app)
      .get('/entities/nearby?lat=28&lng=999')
      .set('X-Requested-With', 'ck-web');

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/lng/i);
  }, 10000);

  test('radius_km capped at 50', async () => {
    const res = await request(app)
      .get('/entities/nearby?lat=28.6&lng=77.2&radius_km=200')
      .set('X-Requested-With', 'ck-web');

    // Should succeed (capped internally, not rejected)
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  }, 15000);

  test('Negative radius_km returns 400', async () => {
    const res = await request(app)
      .get('/entities/nearby?lat=28.6&lng=77.2&radius_km=-5')
      .set('X-Requested-With', 'ck-web');

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/radius/i);
  }, 10000);

  test('Valid request returns array with distance_km and maps_url', async () => {
    const res = await request(app)
      .get('/entities/nearby?lat=0&lng=0&radius_km=10')
      .set('X-Requested-With', 'ck-web');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    // If any results, validate shape
    if (res.body.data.length > 0) {
      const first = res.body.data[0];
      expect(first).toHaveProperty('entity_id');
      expect(first).toHaveProperty('distance_km');
      expect(first).toHaveProperty('maps_url');
      expect(first.maps_url).toMatch(/google\.com\/maps/);
    }
  }, 15000);
});

// ═════════════════════════════════════════════════════════════════════════════
// 8. isUnassignedArea helper
// ═════════════════════════════════════════════════════════════════════════════

describe('isUnassignedArea', () => {
  const { isUnassignedArea } = require('../services/locationVisibility');

  test('null is unassigned', () => expect(isUnassignedArea(null)).toBe(true));
  test('undefined is unassigned', () => expect(isUnassignedArea(undefined)).toBe(true));
  test('empty string is unassigned', () => expect(isUnassignedArea('')).toBe(true));
  test('"Unassigned" is unassigned', () => expect(isUnassignedArea('Unassigned')).toBe(true));
  test('"unassigned" (lowercase) is unassigned', () => expect(isUnassignedArea('unassigned')).toBe(true));
  test('"  Unassigned  " (padded) is unassigned', () => expect(isUnassignedArea('  Unassigned  ')).toBe(true));
  test('"Sector 5" is NOT unassigned', () => expect(isUnassignedArea('Sector 5')).toBe(false));
  test('"Delhi" is NOT unassigned', () => expect(isUnassignedArea('Delhi')).toBe(false));
});

// ═════════════════════════════════════════════════════════════════════════════
// 9. Signup role ignoring & CheckRole 401 vs 403
// ═════════════════════════════════════════════════════════════════════════════

describe('Auth role assignment & checkRole 401 vs 403', () => {
  test('POST /auth/signup ignores a passed role (always defaults to citizen)', async () => {
    const email = makeEmail('hacker-role');
    const res = await request(app)
      .post('/auth/signup')
      .set('X-Requested-With', 'ck-web')
      .set('Origin', 'http://localhost:5173')
      .send({ name: 'Role Spoofer', email, password: 'Password123!', role: 'admin' });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe('citizen'); // role MUST be citizen

    // Verify in database as well
    const dbUser = await prisma.user.findUnique({ where: { email } });
    expect(dbUser.role).toBe('citizen');
  });

  test('Protected admin endpoint returns 401 when no session cookie is provided', async () => {
    const res = await request(app)
      .get('/admin/users')
      .set('X-Requested-With', 'ck-web');

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('Protected admin endpoint returns 403 when citizen session cookie is provided', async () => {
    const res = await request(app)
      .get('/admin/users')
      .set('Cookie', citizenCookie)
      .set('X-Requested-With', 'ck-web');

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  test('JWT with wrong algorithm (e.g. none) is rejected with 401', async () => {
    // Construct unsigned / algorithm 'none' token
    const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({ user_id: 999, role: 'admin' })).toString('base64url');
    const token = `${header}.${payload}.`;

    const res = await request(app)
      .get('/auth/me')
      .set('Cookie', `ck_session=${token}`)
      .set('X-Requested-With', 'ck-web');

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 10. Comprehensive Location Visibility Matrix (canViewLocation combinations)
// ═════════════════════════════════════════════════════════════════════════════

describe('Location Visibility Comprehensive Matrix', () => {
  const { canViewLocation } = require('../services/locationVisibility');

  const publicType = { location_visibility: 'public_when_approved' };
  const restrictedType = { location_visibility: 'restricted' };
  const unknownType = { location_visibility: 'other_custom' };

  const roles = {
    anonymous: undefined,
    owner: { user_id: 10, role: 'citizen', assignedArea: null },
    otherCitizen: { user_id: 99, role: 'citizen', assignedArea: null },
    admin: { user_id: 1, role: 'admin', assignedArea: null },
    director: { user_id: 2, role: 'director', assignedArea: null },
    coordMatching: { user_id: 3, role: 'coordinator_area', assignedArea: 'North Zone' },
    coordOther: { user_id: 4, role: 'coordinator_area', assignedArea: 'South Zone' },
    coordGeneralUnassigned: { user_id: 5, role: 'coordinator_general', assignedArea: 'Unassigned' },
  };

  const makeEntity = (status, area = 'North Zone', ownerId = 10) => ({
    entity_id: 100,
    status,
    area,
    owner_user_id: ownerId,
    latitude: 28.6139,
    longitude: 77.2090,
  });

  describe('Entity with public_when_approved type', () => {
    test('status=approved: visible to everyone (including anonymous and other citizens)', () => {
      const e = makeEntity('approved');
      expect(canViewLocation(e, publicType, roles.anonymous)).toBe(true);
      expect(canViewLocation(e, publicType, roles.otherCitizen)).toBe(true);
      expect(canViewLocation(e, publicType, roles.owner)).toBe(true);
      expect(canViewLocation(e, publicType, roles.coordOther)).toBe(true);
    });

    test('status=pending/submitted: hidden from anonymous & other citizens, visible to owner, admin, director & matching coord', () => {
      const e = makeEntity('submitted');
      expect(canViewLocation(e, publicType, roles.anonymous)).toBe(false);
      expect(canViewLocation(e, publicType, roles.otherCitizen)).toBe(false);
      expect(canViewLocation(e, publicType, roles.owner)).toBe(true);
      expect(canViewLocation(e, publicType, roles.admin)).toBe(true);
      expect(canViewLocation(e, publicType, roles.director)).toBe(true);
      expect(canViewLocation(e, publicType, roles.coordMatching)).toBe(true);
      expect(canViewLocation(e, publicType, roles.coordOther)).toBe(false);
    });

    test('status=rejected: hidden from anonymous & other citizens, visible to owner & admin', () => {
      const e = makeEntity('rejected');
      expect(canViewLocation(e, publicType, roles.anonymous)).toBe(false);
      expect(canViewLocation(e, publicType, roles.otherCitizen)).toBe(false);
      expect(canViewLocation(e, publicType, roles.owner)).toBe(true);
      expect(canViewLocation(e, publicType, roles.admin)).toBe(true);
    });

    test('status=deleted: hidden from anonymous & other citizens; visible to owner, admin & director', () => {
      const e = makeEntity('deleted');
      expect(canViewLocation(e, publicType, roles.anonymous)).toBe(false);
      expect(canViewLocation(e, publicType, roles.otherCitizen)).toBe(false);
      expect(canViewLocation(e, publicType, roles.owner)).toBe(true);
      expect(canViewLocation(e, publicType, roles.admin)).toBe(true);
      expect(canViewLocation(e, publicType, roles.director)).toBe(true);
    });
  });

  describe('Entity with restricted type (e.g. Grievance)', () => {
    test('Even when status=approved, location NEVER appears for anonymous or other citizens', () => {
      const e = makeEntity('approved');
      expect(canViewLocation(e, restrictedType, roles.anonymous)).toBe(false);
      expect(canViewLocation(e, restrictedType, roles.otherCitizen)).toBe(false);
      // But owner and officials still have access
      expect(canViewLocation(e, restrictedType, roles.owner)).toBe(true);
      expect(canViewLocation(e, restrictedType, roles.admin)).toBe(true);
      expect(canViewLocation(e, restrictedType, roles.director)).toBe(true);
      expect(canViewLocation(e, restrictedType, roles.coordMatching)).toBe(true);
    });
  });

  describe('Entity with unknown or null type', () => {
    test('defaults to restricted behavior: hidden from anonymous even if status=approved', () => {
      const e = makeEntity('approved');
      expect(canViewLocation(e, unknownType, roles.anonymous)).toBe(false);
      expect(canViewLocation(e, null, roles.anonymous)).toBe(false);
    });
  });
});

