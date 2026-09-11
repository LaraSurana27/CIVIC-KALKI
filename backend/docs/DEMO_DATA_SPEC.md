# CIVIC-KALKI Golden-Path Demo Data Specification

**Version:** 0.1-draft  
**Status:** approved-data contract to implement through a repeatable seed script  
**Related:** [ER diagram](ER_DIAGRAM.dbml), [API contract](API_CONTRACT.md), and [workflow contract](WORKFLOW_CONTRACT.md)

This specification defines the only shared demo dataset used to validate the
golden path. IDs below are stable seed identifiers where the database permits
explicit IDs; code must use names/keys rather than assume IDs in production.

## Areas

| Canonical value | Purpose |
| --- | --- |
| `Sector 5` | Assigned area for the Area Coordinator and the primary Movement. |
| `Sector 12` | Negative authorisation test: Sector 5 Coordinator must not act here. |
| `Unassigned` | General Coordinator queue. |

Area comparisons are exact canonical values, not fuzzy text matching. A future
schema migration must add structured `Entity.area`; until then this is a data
contract only, not an enforceable access-control implementation.

## Demo users

These are non-production accounts. The seed must bcrypt-hash password values;
never commit real credentials, JWTs, or password hashes. For local/demo use,
load the password from `DEMO_USER_PASSWORD` and use the same non-secret sample
value for all accounts unless the deployment owner chooses otherwise.

| Key | Name | Email | Role | `assignedArea` | Purpose |
| --- | --- | --- | --- | --- | --- |
| `citizen_asha` | Asha Kumar | `asha.citizen@demo.civickalki.test` | `citizen` | `null` | Creates the primary Movement. |
| `coord_sector5` | Ravi Sharma | `ravi.sector5@demo.civickalki.test` | `coordinator_area` | `Sector 5` | Approves the primary Movement. |
| `coord_general` | Neha Patel | `neha.general@demo.civickalki.test` | `coordinator_general` | `Unassigned` | Handles the general queue. |
| `director` | Meera Iyer | `meera.director@demo.civickalki.test` | `director` | `null` | Gives final approval and views AI suggestion. |
| `admin` | Arjun Nair | `arjun.admin@demo.civickalki.test` | `admin` | `null` | Configures/verifies data and exports the report. |

The user seed must be idempotent by email. API responses and reports must never
return `password_hash`.

## Core configuration records

### Domain and entity types

| Key | Suggested seed ID | Field values |
| --- | --- | --- |
| `civic_operations` | `1` | `Domain.domain_name = "Civic Operations"`; description: `"Golden-path demo domain"` |
| `movement` | `1` | `EntityType.domain_id = 1`; `name = "Movement"`; description: `"Citizen movement submission"` |
| `grievance_centre` | `2` | `EntityType.domain_id = 1`; `name = "Grievance Centre"`; description: `"Automatically created follow-up entity"` |

Names are case-sensitive configuration values for the demo. Rule matching uses
entity type IDs, not the displayed names.

### Parameter categories

| Key | Suggested seed ID | `category_name` |
| --- | --- | --- |
| `text` | `1` | `Text` |
| `location` | `2` | `Location` |
| `date` | `3` | `Date` |

## Movement registration form

The form configuration is for `Movement` and must be readable through
`GET /forms/:id/schema`. The existing schema lacks `field_key` and `label`; the
following values become seedable after the planned form-metadata migration.

| Hierarchy | Field key | Label | Control/type | Required | Validation/example |
| --- | --- | --- | --- | --- | --- |
| Form: `Movement Registration` | — | — | version `1.0`, status `active` | — | entity type `Movement` |
| Section: `Movement details` | — | — | display order `0` | — | — |
| Subsection: `Issue` | `title` | Movement title | `text` / `string` | Yes | 5–120 characters |
| Subsection: `Issue` | `description` | Description | `textarea` / `string` | Yes | 10–1,000 characters |
| Section: `Location` | — | — | display order `1` | — | — |
| Subsection: `Location details` | `area` | Area | `select` / `string` | Yes | `Sector 5`, `Sector 12`, or `Unassigned` |
| Subsection: `Location details` | `landmark` | Landmark | `text` / `string` | No | max 160 characters |
| Subsection: `Location details` | `reported_on` | Reported date | `date` / `date` | Yes | ISO `YYYY-MM-DD` |

The `area` input is the source of the entity's future structured `area` field;
the backend must copy/validate it when the Movement is submitted rather than
trusting a client-supplied area outside the form flow.

## Workflow and automation configuration

| Key | Source type | Event | Target type | `auto_create` | `auto_approve` | Expected outcome |
| --- | --- | --- | --- | --- | --- | --- |
| `movement_approved_creates_grievance_centre` | Movement | `approved` | Grievance Centre | `true` | `false` | Creates one pending Grievance Centre after Director approval. |

The record maps to `EntityRelationshipRule` using:

```text
source_entity_type_id = Movement
target_entity_type_id = Grievance Centre
event                 = "approved"
auto_create           = true
auto_approve          = false
```

The rule engine must create an `AuditLog` entry whose actor/user value is
`system/rule-engine`. The created Grievance Centre inherits the source area's
canonical value once `Entity.area` exists; before that migration, it may only
inherit the current `location` field.

## Required sample entities

These are created through the UI/API during the demo unless a test seed needs
them in advance.

| Key | Creator | Type | Area | Initial state | Purpose |
| --- | --- | --- | --- | --- | --- |
| `movement_sector5_primary` | `citizen_asha` | Movement | Sector 5 | `draft` | Main golden-path record. |
| `movement_sector12_negative` | Admin/test setup | Movement | Sector 12 | `submitted` | Verifies Sector 5 Coordinator gets `403`. |
| `movement_unassigned_general` | Admin/test setup | Movement | Unassigned | `submitted` | Verifies General Coordinator inbox scope. |

Primary Movement form values:

```json
{
  "title": "Repair the Sector 5 park streetlight",
  "description": "The streetlight beside the Sector 5 park entrance has been broken for three weeks.",
  "area": "Sector 5",
  "landmark": "Main park entrance",
  "reported_on": "2026-09-11"
}
```

## Acceptance sequence

1. Sign in as `citizen_asha`; submit `movement_sector5_primary`.
2. Confirm it is `submitted` and visible only in `coord_sector5`'s inbox.
3. Confirm `coord_sector5` receives `403` when attempting to act on
   `movement_sector12_negative`.
4. Confirm `coord_general` sees only `movement_unassigned_general` among these
   coordinator test records.
5. Sign in as `coord_sector5`; transition the primary Movement to
   `coordinator_approved`.
6. Sign in as `director`; transition it to `approved` and view an AI suggestion.
7. Confirm one pending Grievance Centre was created automatically and audit
   entries exist for both human approvals and the system auto-creation.
8. Sign in as `admin`; export a PDF or XLSX report containing the primary
   Movement and its auto-created Grievance Centre.

## Seed implementation requirements

- Add the eventual seed as `backend/prisma/seed.js` and invoke it through a
  documented Prisma seed command.
- It must be idempotent: rerunning it must not duplicate users, entity types,
  form definitions, rules, or static test entities.
- Seed creation must fail clearly if required migrations have not been applied.
- The seed must not create real production data or contain live secrets.
