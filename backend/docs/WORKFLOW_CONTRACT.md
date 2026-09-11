# CIVIC-KALKI Workflow and State-Transition Contract

**Version:** 0.1-draft  
**Status:** source-of-truth contract for the golden-path demo  
**Related API:** [API_CONTRACT.md](API_CONTRACT.md)

This contract defines the Movement workflow used in the demo. The same generic
transition mechanism must be reusable by future entity types, with their
permitted transitions stored/configured rather than hardcoded by entity name.

## Canonical states

| State | Meaning | Terminal? |
| --- | --- | --- |
| `draft` | A citizen-created submission that is not in the approval queue. | No |
| `submitted` | Submitted to the relevant Coordinator queue. | No |
| `coordinator_approved` | Area/general coordinator has verified the submission; awaiting Director review. | No |
| `approved` | Director gave final approval. The system must then evaluate configured rules. | No — system post-action follows |
| `rejected` | Rejected with a recorded reason. MVP terminal state. | Yes |
| `deleted` | Soft-deleted record. It is excluded from normal lists and cannot transition. | Yes |

## Permitted transitions

| Current state | Actor permitted to act | Next state | Required conditions | Required side effects |
| --- | --- | --- | --- | --- |
| `draft` | Owning `citizen` | `submitted` | Actor owns the entity; all mandatory form values are present. | Write audit entry. |
| `submitted` | `coordinator_area` | `coordinator_approved` | Entity area exactly equals actor `assignedArea`. | Write audit entry. |
| `submitted` | `coordinator_area` | `rejected` | Entity area exactly equals actor `assignedArea`; non-empty reason required. | Write audit entry. |
| `submitted` | `coordinator_general` | `coordinator_approved` | Entity area is `Unassigned`. | Write audit entry. |
| `submitted` | `coordinator_general` | `rejected` | Entity area is `Unassigned`; non-empty reason required. | Write audit entry. |
| `coordinator_approved` | `director` | `approved` | Entity is not deleted. | Write audit entry, then invoke rule engine. |
| `coordinator_approved` | `director` | `rejected` | Non-empty reason required. | Write audit entry. |
| `approved` | `system` | rule evaluation only | A final approval has committed successfully. | Run matching `EntityRelationshipRule` records; audit any auto-created entity. |

There is no direct `submitted` → `approved` transition in the demo. `admin` may
configure forms, roles, and rules, but does not bypass this approval sequence.

## Transition endpoint contract

The only normal way to change workflow status is:

```text
POST /entities/:id/transition
Authorization: Bearer <JWT>
```

Request body:

```json
{
  "to_status": "coordinator_approved",
  "reason": "Location and evidence verified."
}
```

`reason` is optional for approval transitions and required for rejection. The
server derives the actor and role from the JWT; the client never supplies an
actor ID or an arbitrary current state.

On success, the service must atomically:

1. Read the current entity state.
2. Validate this exact transition and the actor's ownership/area/role.
3. Update the entity status.
4. Write the audit/approval-history entry with actor, old status, new status,
   reason, and timestamp.

Only after that transaction commits, an `approved` transition invokes
`checkAndFireRules(entityId, "approved")`. Rule failures must be captured and
observable; they must not roll back a valid Director approval. The rule result
should be included in the API response when it completes during the request,
or be made retrievable through audit/status information.

## Access and visibility rules

| Actor | Can view | Can edit |
| --- | --- | --- |
| Citizen | Own entities only | Own `draft` entities and their values only |
| Area Coordinator | `submitted` entities in their exact assigned area | Those same entities through the permitted transition only |
| General Coordinator | `submitted` entities whose area is `Unassigned` | Those same entities through the permitted transition only |
| Director | `coordinator_approved` entities | Only the final approve/reject transition |
| Admin | All entities and configuration | Role/form/rule administration; no workflow bypass in MVP |

`area` must be a normalised, structured field, such as `"Sector 5"` or
`"Unassigned"`. It must not use the current free-text `location` field.

## Error behaviour

| Scenario | HTTP status | Example message |
| --- | --- | --- |
| No/invalid JWT | 401 | `Authentication is required.` |
| Wrong role, different area, or non-owner | 403 | `You are not allowed to perform this action.` |
| Transition is not listed above | 400 | `Cannot transition an entity from submitted to approved.` |
| Reject request has no meaningful reason | 400 | `A reason is required when rejecting an entity.` |
| Entity does not exist | 404 | `Entity with id 99 was not found.` |
| State changed by another action before commit | 409 | `Entity status changed; refresh and try again.` |
| Transition target is malformed/unknown | 400 | `to_status must be a supported workflow state.` |

## Rule-engine contract

The system event is exactly `approved` (lowercase). A matching rule requires:

```text
source_entity_type_id = approved entity's type
event                 = "approved"
auto_create           = true
```

For the demo, the configured rule is:

```text
Movement + approved → auto-create Grievance Centre
```

The auto-created entity inherits the source entity's area/location where the
schema supports it, records `system/rule-engine` as the actor in `AuditLog`,
and must be visible in the final demo as an independently retrievable entity.

## Scope boundaries

- Reopen/resubmit after rejection is out of the MVP; `rejected` is terminal.
- Delegation, reassignment, multi-Director approval, and deadline/escalation
  policies are out of the MVP.
- Existing `PUT /entities/:id` currently permits arbitrary `status` changes.
  It does **not** satisfy this contract and must be restricted when the
  transition endpoint is implemented.
- Implementing this contract requires schema support for entity ownership,
  structured area, and durable approval/audit history.
