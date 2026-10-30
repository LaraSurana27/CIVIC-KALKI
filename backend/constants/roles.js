/**
 * CIVIC-KALKI — User Roles Constants
 * Single source of truth for the 5 role strings.
 */

const ROLES = Object.freeze({
  CITIZEN: 'citizen',
  COORDINATOR_AREA: 'coordinator_area',
  COORDINATOR_GENERAL: 'coordinator_general',
  DIRECTOR: 'director',
  ADMIN: 'admin',
});

const ALL_ROLES = Object.freeze(Object.values(ROLES));

module.exports = {
  ROLES,
  ALL_ROLES,
  VALID_ROLES: ALL_ROLES,
};
