# Phase 0 — CIVIC-KALKI Metadata Architecture Audit

**Author:** Platform / Core Architecture Team  
**Branch:** `feat/civic-metadata-permissions`  
**Date:** October 2026  
**Context:** Verification of existing CIVIC-KALKI codebase against the 10-level metadata-hierarchy architecture (Domain → Category → Entity Type → Entity Instance → Form → Sections → Parameters → Workflow → Rules → Reports).

---

## 1. Executive Summary

The core architectural claim of CIVIC-KALKI is that **new civic capabilities and permission types are added purely by configuration, never by introducing a module-specific table, model, controller, route, or UI component**.

This audit inspects the entire repository to determine:
1. How each level of the metadata hierarchy is currently represented in the PostgreSQL / Prisma database schema.
2. How forms, sections, subsections, and parameters are stored, validated, and served to the client.
3. Whether workflows, business rules, and analytical reports are currently metadata-driven.
4. How database seeding, automated testing, CI/CD, and Git hooks are structured.
5. The exact gaps and minimal generic extensions required to support multi-authority civic permissions (e.g., Ganpati Event Permission, Resource Request) with parallel department reviews, SLA timers, dynamic requirement rules, and aggregated decisions.

---

## 2. Hierarchy Level Audit

| Hierarchy Level | Existing Database Table / Column | Status | Operational Notes |
| :--- | :--- | :--- | :--- |
| **Domain** | `Domain` (`domain_id`, `domain_name`, `description`) | **Present** | Groups broad municipal areas (e.g. "Civic Operations", "Civic Events"). |
| **Sub-Domain / Category** | Embedded in `Domain.domain_name` or `EntityType.description` | **Partial** | No separate intermediate table; `Domain` directly parents `EntityType[]`. |
| **Entity Type** | `EntityType` (`entity_type_id`, `domain_id`, `name`, `description`) | **Present** | Carries the capability identity. Zero schema changes needed for new types. |
| **Entity Instance** | `Entity` (`entity_id`, `entity_type_id`, `owner_user_id`, `jurisdiction_id`, `name`, `location`, `area`, `status`) | **Present** | Stores instance lifecycle, ownership, and jurisdictional attachment. |
| **Form** | `FormMaster` (`form_id`, `entity_type_id`, `form_name`, `version`, `status`) | **Present** | 1:N with `EntityType`. Represents a versioned data collection schema. |
| **Sections** | `SectionMaster` (`section_id`, `form_id`, `section_name`, `display_order`) | **Present** | Ordered visual and logical grouping of fields. |
| **Subsections** | `SubsectionMaster` (`subsection_id`, `section_id`, `subsection_name`) | **Present** | Nested grouping inside sections. |
| **Parameter Category** | `ParameterCategory` (`category_id`, `category_name`) | **Present** | Categorizes parameter types (e.g., General, Location, Sound, Logistics). |
| **Parameters** | `ParameterMaster` (`parameter_id`, `subsection_id`, `category_id`, `field_key`, `label`, `field_type`, `control_type`, `display_order`, `options`, `mandatory`, `validation_rule`) | **Present** | Field definition metadata. Supports JSON `options` for flexible attributes. |
| **Parameter Values** | `ParameterValue` (`value_id`, `parameter_id`, `entity_id`, `value`, `created_date`) | **Present** | EAV-style storage. Has `@@unique([entity_id, parameter_id])`. |
| **File Storage** | `FileRepository` (`file_id`, `entity_id`, `parameter_id`, `file_name`, `path`) | **Present** | Links uploaded documents to specific `entity_id` and `parameter_id`. |
| **Workflow Transitions** | `WorkflowMaster` (`workflow_id`, `entity_type_id`, `trigger`, `action`, `stage`) | **Present** | Basic finite state machine (trigger = from_status, action = to_status, stage = role). |
| **Workflow State Machine Extended** | Guard rules, side effects, terminal flags, per-state SLA | **MISSING** | `WorkflowMaster` only stores `(trigger, action, stage)`. Guard conditions and SLA configs are not yet in the schema. |
| **Authorities / Review Bodies** | Records of reviewing authorities (key, name, jurisdiction, review_scope) | **MISSING** | No dedicated `Authority` table or structured config in DB. `ApprovalMatrix` exists but lacks authority keys & scopes. |
| **Authority Review Tasks** | Parallel reviews for multi-department approvals (`entity_id`, `authority_key`, `status`, `decision`, `reason`, `why_required`) | **MISSING** | No entity-to-authority task tracking table exists in the current schema. |
| **Automation Rules** | `EntityRelationshipRule` (`rule_id`, `source_entity_type_id`, `target_entity_type_id`, `event`, `auto_create`, `auto_approve`) | **Present** | Fires inter-entity creation cascades (e.g. Movement approved → create Grievance). |
| **Field/Routing Rules** | Dynamic rule evaluator for visibility, validation, and authority routing | **MISSING** | Logic was previously hardcoded or absent; no generic json-logic evaluator in `services/`. |
| **Reports** | `ReportMaster` (`report_id`, `entity_type_id`, `report_name`, `filters`, `output_format`) | **Present** | Metadata-driven reporting engine (`services/reportEngine.js`). Supports aggregations & filtering. |
| **Audit & History** | `AuditLog` (`audit_id`, `entity_id`, `actor_user_id`, `action`, `user`, `old_status`, `new_status`, `datetime`, `reason`), `ApprovalHistory` | **Present** | Immutable timeline of changes and actor identity. |

---

## 3. Analysis of Existing Engines & Subsystems

### 3.1 Form & Parameter Engine (`routes/form.js`, `routes/parameterValue.js`, `routes/file.js`)
- Forms are retrieved via `GET /forms/:formId/schema`, which performs a single non-N+1 query joining `FormMaster → SectionMaster → SubsectionMaster → ParameterMaster`.
- Parameters have `options` (`Json?`), `validation_rule` (`String?`), `mandatory` (`Boolean`), and `field_key` (`String?`).
- Parameter values are saved via atomic batch upsert (`POST/PUT /entities/:id/values`).
- Document slots are tracked via `FileRepository` with `field_type: "file"`.
- **Capability:** Fully generic. Can store any parameter type (text, textarea, number, date, time, boolean, enum, multi_enum, phone, geo_point, file).

### 3.2 Workflow Engine (`services/workflowEngine.js`, `routes/entity.js`)
- Currently queries `WorkflowMaster` where `trigger = currentStatus`, `action = targetStatus`, and `stage = actorRole`.
- Has built-in support for role constraints: `citizen` (owner match), `coordinator_area` (area match), `coordinator_general` (unassigned area), `director` / `admin`.
- Transitions execute in a database transaction (`Prisma.$transaction`) updating `Entity.status`, creating `AuditLog`, and creating `ApprovalHistory`.
- **Gaps:**
  1. No support for parallel multi-authority review (e.g., Department Review requiring Traffic Police, Fire Department, Local Police, and Ward Office all to submit independent determinations).
  2. No aggregation policy evaluator (e.g., `all_must_approve`, `any_reject_rejects`, `request_changes_returns_to_draft`).
  3. No state-level SLA tracking or deadline metadata.

### 3.3 Rule Engine (`services/ruleEngine.js`)
- Currently handles `EntityRelationshipRule` cascade creation (e.g. auto-creating linked entities on status `approved` up to max chain depth 3).
- **Gaps:**
  1. Needs a safe, zero-eval declarative rule evaluator for field visibility, cross-field validation, and authority requirement routing (e.g. crowd > threshold or road_usage != 'none' → require `police_traffic`).
  2. Must never use JavaScript `eval()` or `Function()`.

### 3.4 Report Engine (`services/reportEngine.js`, `routes/report.js`)
- Parses JSON filter criteria from `ReportMaster.filters`.
- Executes SQL-injection-safe queries using Prisma Client.
- Supports `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`, group-by, and RBAC area scoping.
- **Gaps:**
  1. Needs export formatting support (JSON, XLSX/CSV, and PDF reporting contracts).
  2. Needs support for cross-authority SLA breach and review status reporting.

### 3.5 Seeding and Testing
- **Seeding:** `backend/seed.js` hardcodes Javascript object arrays (`MODULE_DEFINITIONS`) and populates 7 modules. There is currently no declarative JSON metadata loader or directory structure (`backend/metadata/`).
- **Scripts:** `importGeoData.js`, `cleanAndSeedDemoData.js`, `seedMeme.js`.
- **Testing:** Jest suite in `backend/tests/`. Includes `uiIntegration.test.js`, `workflowEngine.test.js`, `reportEngine.test.js`, `moduleBuilder.test.js`.
- **CI & Quality Gates:**
  - `.github/workflows/ci.yml`: Runs on Node 20.
  - `.husky/pre-commit`: Executes `node scripts/secret-scan.js` to prevent credential leaks.

---

## 4. Architecture Plan & Minimal Generic Extensions

To satisfy all project hard constraints (additive migrations only, no Ganpati-specific models/controllers, no eval, data-driven authority routing):

### Proposed Minimal Generic Extensions:
1. **Metadata Configuration Storage (`backend/metadata/`):**
   - Clean declarative JSON files for entity types (`civic_events.ganpati_event_permission.json`, `civic_events.resource_request.json`).
   - Shared definitions in `backend/metadata/_shared/`:
     - `authorities.json` (unverified placeholder authority definitions).
     - `document_types.json` (file slot schemas).
     - `roles.json` (role-to-stage mapping).
2. **Safe JSON-Logic Rule Evaluator (`services/ruleEvaluator.js`):**
   - Pure, deterministic, AST-based expression evaluator supporting arithmetic, comparison, logical operators (`and`, `or`, `not`), and array operations (`in`, `intersects`).
   - Zero use of `eval` or `new Function()`.
3. **Additive Prisma Schema Model for Authority Review Tasks:**
   - Model `EntityReviewTask` (or `ReviewTask`):
     ```prisma
     model EntityReviewTask {
       task_id          Int      @id @default(autoincrement())
       entity_id        Int
       authority_key    String   // e.g. 'police_traffic', 'pmc_fire'
       status           String   @default("pending") // 'pending' | 'approved' | 'request_changes' | 'rejected' | 'voided'
       required_reason  String?  // Explanation of which rule triggered this requirement
       matched_inputs   Json?    // Snapshot of input parameters that satisfied the rule
       decision_reason  String?  // Notes from reviewer
       reviewer_user_id Int?
       due_date         DateTime?
       completed_at     DateTime?
       created_at       DateTime @default(now())
       updated_at       DateTime @updatedAt

       entity           Entity   @relation(fields: [entity_id], references: [entity_id], onDelete: Cascade)
       reviewerUser     User?    @relation("ReviewTaskReviewer", fields: [reviewer_user_id], references: [user_id], onDelete: SetNull)

       @@unique([entity_id, authority_key])
       @@index([authority_key, status])
       @@index([entity_id, status])
     }
     ```
   - *Non-breaking & 100% additive*: No existing table is modified, renamed, or dropped. Enables generic parallel multi-authority reviews for any permission type in any domain.
4. **Generic Review Aggregation Evaluator (`services/workflowEngine.js`):**
   - Configurable aggregation policy per workflow state:
     - `all_must_approve`: Requires all active review tasks to be `approved` before parent entity transitions to `approved`.
     - Rejection rule: Any `rejected` review triggers parent rejection or terminal state.
     - Changes requested: Any `request_changes` triggers overall `Request Changes` transition once all authorities conclude review.
5. **Declarative Metadata Loader & Validator (`services/metadataLoader.js`, `scripts/seedMetadata.js`):**
   - Validates JSON files against schemas with referential integrity checks (field keys, authorities, transition states).
   - CLI command: `npm run seed:metadata [--dry-run]`.
