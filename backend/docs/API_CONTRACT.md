# CIVIC-KALKI API Contract

**Version:** 0.1-draft  
**Status:** source-of-truth contract for the golden-path demo  
**Reviewed against code:** 2026-09-11

Implemented routes and future contractual routes are deliberately separated.
Anything marked **contracted** is agreed API behaviour to build, not a claim
that the route or its access checks already exist.

## Conventions

- Local base URL: `http://localhost:3000`
- JSON request/response bodies use `Content-Type: application/json`.
- IDs are positive integers.
- Protected routes require `Authorization: Bearer <JWT>`.
- Successful data response: `{ "success": true, "data": ... }`.
- Error response: `{ "success": false, "error": "human-readable message" }`.

| Status | Meaning | Error response example |
| --- | --- | --- |
| 400 | Invalid request or workflow transition | `{ "success": false, "error": "\"entity_type_id\" is required." }` |
| 401 | Missing, invalid, or expired JWT | `{ "success": false, "error": "Authentication is required." }` |
| 403 | User lacks the permitted role, ownership, or area | `{ "success": false, "error": "You are not allowed to perform this action." }` |
| 404 | Resource does not exist | `{ "success": false, "error": "Entity with id 99 was not found." }` |
| 409 | Duplicate/conflicting approval action | `{ "success": false, "error": "An approval for this stage has already been recorded." }` |
| 500 | Unexpected server failure | `{ "success": false, "error": "An unexpected server error occurred. Please try again later." }` |

## Role contract

| Role | Authorised actions |
| --- | --- |
| `citizen` | Create submissions; read/update only their own drafts; read status of their own submissions. |
| `coordinator_area` | Read and act only on submissions in `assignedArea`. |
| `coordinator_general` | Read and act only on unassigned submissions. |
| `director` | Perform final approval/rejection; view authorised AI suggestions and reports. |
| `admin` | Configure forms, assign roles/areas, inspect all entities, and generate reports. |
| `system` | Internal rule-engine actor only; not a login role. |

`Entity.location` is currently free text. It must not be used for access
control; a structured entity-area field is required before this role contract
can be enforced.

## Implemented endpoints

These endpoints are public in the current server. The listed role is the target
access policy to apply when authentication is implemented.

| Method | Path | Target role/access | Request body | Response |
| --- | --- | --- | --- | --- |
| GET | `/health` | Public | — | `200 { success, message }` |
| POST | `/entities` | Citizen, Admin | `entity_type_id`, `name`, `location?`, `status?` | `201 { success, data: Entity }` |
| GET | `/entities` | Scoped by caller role | query: `entity_type_id?`, `page?`, `limit?` | `200 { success, data, pagination }` |
| GET | `/entities/:id` | Owner/authorised reviewer/Admin | — | `200 { success, data: Entity }` |
| PUT | `/entities/:id` | Owner for draft; Admin metadata | one or more entity fields | `200 { success, data: Entity }` |
| DELETE | `/entities/:id` | Owner for draft; Admin | — | `200 { success, message, data }` |
| POST | `/entities/:id/fire-rules` | Admin/system test utility | `eventType` | `200 { success, data: RuleResult }` |
| POST | `/entities/:id/values` | Owner for draft; Admin | `values[]` | `201 { success, data: ParameterValue[] }` |
| GET | `/entities/:id/values` | Owner/authorised reviewer/Admin | — | `200 { success, data: ParameterValue[] }` |
| PUT | `/entities/:id/values` | Owner for draft; Admin | `values[]` | `200 { success, data: ParameterValue[] }` |
| POST | `/forms` | Admin | `entity_type_id`, `form_name`, `version?`, `status?` | `201 { success, data: Form }` |
| POST | `/forms/:formId/sections` | Admin | `section_name`, `display_order?` | `201 { success, data: Section }` |
| POST | `/sections/:sectionId/subsections` | Admin | `subsection_name` | `201 { success, data: Subsection }` |
| POST | `/subsections/:subsectionId/parameters` | Admin | `category_id`, field metadata | `201 { success, data: Parameter }` |
| GET | `/forms/:formId/schema` | Authenticated | — | `200 { success, data: FormSchema }` |

### Entity examples

`POST /entities`

```json
{
  "entity_type_id": 1,
  "name": "Sector 5 streetlight movement",
  "location": "Sector 5",
  "status": "draft"
}
```

`entity_type_id` and non-empty `name` are required. `status` defaults to
`draft`. A valid `entity_type_id` must exist.

```json
{
  "success": true,
  "data": {
    "entity_id": 42,
    "entity_type_id": 1,
    "name": "Sector 5 streetlight movement",
    "location": "Sector 5",
    "status": "draft",
    "entityType": { "entity_type_id": 1, "name": "Movement" }
  }
}
```

`GET /entities?entity_type_id=1&page=1&limit=20` returns:

```json
{
  "success": true,
  "data": [],
  "pagination": { "total": 0, "page": 1, "limit": 20, "totalPages": 0 }
}
```

`PUT /entities/:id` accepts one or more of `entity_type_id`, `name`,
`location`, and `status`. It currently invokes matching rules asynchronously
when `status` changes. Normal approval workflow will use the contracted
transition endpoint instead. `DELETE /entities/:id` is a soft delete that sets
`status` to `deleted` and preserves related rows.

### Form and parameter examples

`POST /forms`

```json
{
  "entity_type_id": 1,
  "form_name": "Movement registration",
  "version": "1.0",
  "status": "draft"
}
```

`POST /forms/:formId/sections`

```json
{ "section_name": "Location", "display_order": 0 }
```

`POST /sections/:sectionId/subsections`

```json
{ "subsection_name": "Street details" }
```

`POST /subsections/:subsectionId/parameters`

```json
{
  "category_id": 1,
  "field_type": "string",
  "control_type": "text",
  "mandatory": true,
  "validation_rule": "minLength:10"
}
```

`GET /forms/:formId/schema` returns nested form → sections → subsections →
parameters, with the parameter field/control/mandatory/validation metadata.

### Parameter-value example

`POST /entities/:id/values` and `PUT /entities/:id/values` accept:

```json
{
  "values": [
    { "parameter_id": 1, "value": "Streetlight broken for three weeks" },
    { "parameter_id": 2, "value": "Sector 5" }
  ]
}
```

The `values` array must contain 1–200 items. Every parameter must exist and
mandatory values cannot be empty. POST is atomic creation; PUT atomically
updates-or-creates values. `GET /entities/:id/values` returns an empty array
when a valid entity has no values.

`POST /entities/:id/fire-rules` accepts `{ "eventType": "approved" }` and
returns a `RuleResult` with `rulesFired`, `createdEntities`, `chainDepth`, and
`warnings`. It is retained only for administrator test setup after auth is
implemented.

## Contracted endpoints: required for the golden path

### Authentication

| Method | Path | Access | Request | Success response |
| --- | --- | --- | --- | --- |
| POST | `/auth/signup` | Public | `name`, `email`, `password` | `201 { success, data: { user, token } }` |
| POST | `/auth/login` | Public | `email`, `password` | `200 { success, data: { user, token } }` |

Signup always assigns `role: "citizen"`; role assignment in the signup body is
rejected. Login returns `401` for invalid credentials without revealing whether
an email exists. JWT claims are `user_id`, `name`, `role`, `assigned_area`,
`iat`, and `exp`, with a 24-hour expiry.

### Approval workflow

| Method | Path | Access | Request | Success response |
| --- | --- | --- | --- | --- |
| GET | `/approvals/inbox` | Coordinator, Director, Admin | query: `page?`, `limit?`, `status?` | scoped paginated entities |
| POST | `/entities/:id/transition` | depends on transition | `to_status`, `reason?` | updated entity and audit record |

Example request:

```json
{ "to_status": "coordinator_approved", "reason": "Location and evidence verified." }
```

The server gets the actor from the JWT, validates the current→next state,
enforces area scope, writes an audit record, then fires matching rules. Invalid
transitions return `400`; duplicate/conflicting actions return `409`.

### Administration, AI, and reports

| Method | Path | Access | Request | Success response |
| --- | --- | --- | --- | --- |
| POST | `/admin/users/:id/role` | Admin | `role`, `assignedArea?` | user without `password_hash` |
| POST | `/entities/:id/ai-suggestion` | Director, Admin | — | priority, suggestion, reasoning |
| GET | `/reports/entities?format=pdf` | Director, Admin | `format=pdf\|xlsx` | authorised file download |

Role assignment example:

```json
{ "role": "coordinator_area", "assignedArea": "Sector 5" }
```

AI must minimise/redact personal data before calling the provider, log the
execution, and never change entity status. Reports must enforce the caller's
authorised scope.

## Required schema gate

Before implementing contracted protected routes, approve migrations for entity
ownership, structured entity area, auditable approval history, and
`AIExecutionLog`. Update this contract in the same change set as any intentional
API-breaking change.
