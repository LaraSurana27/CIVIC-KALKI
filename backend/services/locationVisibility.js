/**
 * CIVIC-KALKI — Location Visibility Service
 * Enforces location privacy rules across all API responses and AI prompts.
 *
 * Evaluation Order:
 * 1. EntityType.location_visibility === "public_when_approved" AND entity.status === "approved"
 *    -> Visible to EVERYONE (including anonymous). Computed at read time from current status.
 * 2. Otherwise (not final approved, deleted, or restricted type such as Grievance) -> Visible ONLY to:
 *    - Owner (entity.owner_user_id === requester.user_id)
 *    - Role admin or director (all areas)
 *    - Role coordinator_area whose assigned_area matches entity.area (case-insensitive, trimmed)
 *    - Role coordinator_general when entity.area is null, empty string, or 'Unassigned'
 * 3. Everyone else (anonymous, other citizens, other-area coordinators):
 *    -> Location (latitude, longitude, location) is completely removed from the response.
 */

const { ROLES } = require('../constants/roles');

/**
 * Checks if an area string represents the unassigned coordinator queue.
 */
function isUnassignedArea(area) {
  if (area === null || area === undefined) return true;
  const trimmed = String(area).trim().toLowerCase();
  return trimmed === '' || trimmed === 'unassigned';
}

/**
 * Pure evaluation function: can requester view entity location?
 */
function canViewLocation(entity, entityType, requester) {
  if (!entity) return false;

  const rawStatus = entity.status || '';
  const normalizedStatus = String(rawStatus).trim().toLowerCase();
  // Status check: MUST be final 'approved' (NOT 'coordinator_approved')
  const isFinalApproved = normalizedStatus === 'approved';

  const typeConfig = entityType || entity.entityType;
  const rawVis = typeConfig?.location_visibility;
  const visibility = rawVis ? String(rawVis).trim().toLowerCase() : 'hidden';

  // Rule 1: public_when_approved and final approved -> everyone can see
  if (visibility === 'public_when_approved' && isFinalApproved) {
    return true;
  }

  // Rule 2: Non-approved or restricted -> requires authorized authenticated user
  if (!requester || !requester.user_id) {
    return false;
  }

  const requesterUserId = Number(requester.user_id);
  const role = requester.role;

  // 2a. Owner
  if (entity.owner_user_id && Number(entity.owner_user_id) === requesterUserId) {
    return true;
  }

  // 2b. Admin or Director
  if (role === ROLES.ADMIN || role === ROLES.DIRECTOR) {
    return true;
  }

  // 2c. Area Coordinator: assigned area matches entity.area
  if (role === ROLES.COORDINATOR_AREA) {
    const assignedArea = requester.assignedArea || requester.assigned_area;
    if (assignedArea && entity.area) {
      if (String(assignedArea).trim().toLowerCase() === String(entity.area).trim().toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  // 2d. General Coordinator: entity.area is in the unassigned queue
  if (role === ROLES.COORDINATOR_GENERAL) {
    if (isUnassignedArea(entity.area)) {
      return true;
    }
    return false;
  }

  // 3. Everyone else
  return false;
}

/**
 * Applies visibility filtering to a single entity object.
 * Removes latitude, longitude, and location if requester cannot view.
 */
function applyLocationVisibility(entity, entityTypeOrRequester, maybeRequester) {
  if (!entity || typeof entity !== 'object') return entity;

  let entityType;
  let requester;

  if (maybeRequester !== undefined) {
    entityType = entityTypeOrRequester;
    requester = maybeRequester;
  } else {
    requester = entityTypeOrRequester;
    entityType = entity.entityType;
  }

  const allowed = canViewLocation(entity, entityType, requester);

  if (allowed) {
    return entity;
  }

  // Clone to avoid mutating original objects
  const sanitized = { ...entity };
  delete sanitized.latitude;
  delete sanitized.longitude;
  delete sanitized.location;

  return sanitized;
}

/**
 * Applies visibility filtering to an array of entity objects.
 */
function applyLocationVisibilityMany(entities, requester) {
  if (!Array.isArray(entities)) return entities;
  return entities.map((entity) => applyLocationVisibility(entity, entity.entityType, requester));
}

module.exports = {
  isUnassignedArea,
  canViewLocation,
  applyLocationVisibility,
  applyLocationVisibilityMany,
};
