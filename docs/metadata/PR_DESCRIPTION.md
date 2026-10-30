# Pull Request: Generic Metadata-Hierarchy Permissions & Multi-Authority Workflow Engine

**Branch:** `feat/civic-metadata-permissions` → `main`  
**Type:** Feature / Architecture Implementation  
**Related Domains:** Domain 1 (Database Core — Lara), Domain 2 (Auth — Prajakta), Domain 3 (Dynamic Frontend — Ayush)  

---

## 1. Summary of Changes

This PR operationalizes the assigned 10-level metadata-hierarchy research (`Domain → Civic Events → Entity Type → (Ganpati Event Permission) → Form → Sections → Parameters → Workflow → Rules → Reports`) into the CIVIC-KALKI platform by configuring two comprehensive civic capabilities **purely as declarative metadata**:
1. **Ganpati Event Permission** (`civic_events.ganpati_event_permission.json`)
2. **Resource Request** (`civic_events.resource_request.json`)

### Core Architectural Proof:
> **Zero new tables, models, controllers, routes, or frontend components were introduced for either permission type.**
> The word "ganpati" appears strictly in metadata, seed, documentation, and test fixtures. A strict Jest guardrail test verifies that `backend/services`, `backend/routes`, `backend/middleware`, and `frontend/src` contain **zero** specific references.

---

## 2. Hierarchy Implementation

The CIVIC-KALKI 10-level metadata hierarchy was realized through the existing CIVIC-KALKI engine, augmented with minimal generic extensions:

```text
Domain ("Civic Events")
  └── EntityType ("Ganpati Event Permission", "Resource Request")
        ├── FormMaster (Versioned application schemas)
        │     └── SectionMaster (Organizer, Venue, Crowd & Road, Sound, Support, Documents)
        │           └── SubsectionMaster
        │                 └── ParameterMaster (Field keys, types, validations, visibility rules)
        ├── WorkflowMaster (Declarative FSM: draft → submitted → coordinator_verification → department_review → approved/rejected/request_changes)
        ├── EntityReviewTask (Parallel multi-department reviews: police_traffic, pmc_fire, etc.)
        ├── Safe Rule Evaluator (Zero-eval JSON-Logic engine: crowd & road usage → required authorities)
        └── ReportMaster (Dynamic queries: permissions by status, area crowd density, SLA tracking)
```

---

## 3. Generic Extensions (100% Additive & Non-Breaking)

1. **Declarative Metadata Loader & Validator (`services/metadataLoader.js`, `scripts/seedMetadata.js`)**:
   - Validates JSON schemas with strict referential integrity checks (field keys, authorities, states).
   - Provides idempotent synchronization via `npm run seed:metadata` with `--dry-run` flag support.
2. **Safe JSON-Logic Rule Evaluator (`services/ruleEvaluator.js`)**:
   - Zero use of JavaScript `eval()` or `Function()`.
   - Pure recursive AST evaluator handling boundary comparisons, logical operators (`and`, `or`, `not`), array membership, and externalized thresholds (`config.thresholds`).
3. **Authority Routing & Reconciliation Engine (`services/authorityRoutingEngine.js`)**:
   - Decouples reviewing authorities into data records (`_shared/authorities.json`).
   - Automatically determines required authorities on submission/edits.
   - Durably records **WHY** each authority was required (`rule_id` + matched inputs snapshot) for full civic auditability.
   - **Zero-impact on existing modules:** `evaluateAndReconcileReviewTasks` short-circuits immediately with zero DB writes or task creation for entity types without `rules.authority_routing` metadata.
4. **Additive Review Task Table & Schema Sync (`schema.prisma`)**:
   - Added `model EntityReviewTask` to track parallel department reviews (`status`, `required_reason`, `matched_inputs`, `decision_reason`, `due_date`, `completed_at`).
   - Added `location_visibility String?` to `model EntityType`: The live Supabase database already had this column added out-of-band; adding it to `schema.prisma` aligns code with live DB and prevents `prisma db push` from attempting to drop it.
   - **Migration Notice for Database Lead (Lara):** The shared Supabase DB already has `EntityReviewTask` and `location_visibility`. **Do NOT run `npx prisma migrate dev` directly against the shared database**, as Prisma will detect drift between the database and `prisma/migrations/` and prompt to reset the database. Recommended approach: write the migration SQL or generate on a shadow DB, then record it as applied via `npx prisma migrate resolve --applied <migration_name>`.
5. **Multi-Department Review Aggregation Evaluator (`services/workflowEngine.js`)**:
   - Evaluates department determinations under configurable policies (`all_must_approve`, `any_rejects`, `any_request_changes`).
   - When an entity has no review tasks (e.g. existing baseline modules), `evaluateReviewAggregationPolicy` immediately returns `canApprove: true`.
6. **Generic Review Task Endpoints in `routes/entity.js` (+60 lines)**:
   - `GET /entities/:id/review-tasks`: Returns review task statuses and the "why required" audit trail.
   - `POST /entities/:id/review-tasks/:taskId/review`: Submits department determinations (`approved`, `request_changes`, `rejected`).
   - `POST /entities/:id/reconcile-authorities`: Manually re-evaluates requirement rules if applicant updates parameters.


---

## 4. Regulatory Content & Assumptions

Per Hard Constraint #6, all regulatory numbers, thresholds, and document requirements are **placeholder values pending official confirmation with Pune Municipal Corporation (PMC) and Pune Police contacts**:
- Documented in `docs/metadata/ASSUMPTIONS.md`.
- Flagged with `"verified": false` in all metadata configurations.

---

## 5. Verification & Test Results

```bash
PASS tests/metadataHierarchyPermissions.test.js
  CIVIC-KALKI — Metadata-Hierarchy & Permission Capabilities Engine
    1. Declarative Metadata Validation & Referential Checks
      ✔ all metadata files pass structural and referential integrity validation
      ✔ detects referential errors when a rule references a non-existent parameter
      ✔ detects referential errors when a transition references an undefined state
    2. Generic Execution for Both Capabilities via Identical Endpoints
      ✔ creates and loads schema for Ganpati Event Permission without custom routes
      ✔ creates and loads schema for Resource Request without custom routes
      ✔ submits parameter values for both capabilities through generic /entities/:id/values
    3. Workflow FSM Transitions with Role Checks
      ✔ citizen can transition draft -> submitted
      ✔ citizen cannot perform coordinator or director transitions
      ✔ coordinator can verify submitted application
      ✔ illegal transition sequence (e.g. draft directly to approved) fails with 400
      ✔ rejection requires non-empty reason
    4. Safe Rule Evaluator at Boundary Values
      ✔ crowd_threshold boundary: 499 does NOT trigger police station, 500 triggers it
      ✔ fire_threshold boundary: 999 does NOT trigger fire clearance, 1000 triggers it
      ✔ road_usage boundary: "none" without traffic support does not require traffic police
    5. Multi-Authority Review Aggregation Policy
      ✔ blocks transition to approved when any authority review is pending
      ✔ allows transition to approved when ALL required authorities approve
      ✔ any rejection permits overall rejection
      ✔ audit trail records WHY each authority was required
    6. Architectural Guardrail Test: Zero Specific Logic in Codebase
      ✔ scans backend/services, backend/routes, and frontend/src for /ganpati/i and fails if found
    7. Extensibility Test: Dummy Third Capability via Metadata Only
      ✔ adds a 3rd entity type via metadata file and verifies end-to-end execution with zero code changes

Test Suites: 1 passed, 1 total (20 passed, 20 total)
Regression Suites: 4 passed, 4 total (42 passed, 42 total)
Total Tests: 62 passed, 62 total
```

---

## 6. Checklist
- [x] Branch: `feat/civic-metadata-permissions`
- [x] No Ganpati-specific table, Prisma model, controller, route, service, or UI component
- [x] Safe JSON-logic evaluator (no `eval`/`Function`)
- [x] Migrations 100% additive only (no renames/drops)
- [x] Auth internals and `.env` untouched
- [x] All regulatory content marked `"verified": false` and logged in `ASSUMPTIONS.md`
- [x] Husky secret scan and CI workflow green
