# CIVIC-KALKI — Domain 1 Handoff (Database/Backend Core Engine)

**Owner:** Lara | **Status:** ✅ Complete & verified | **Base URL (local):** `http://localhost:3000`
**Last updated:** Sep 2026 | **Repo:** github.com/LaraSurana27/CIVIC-KALKI (`backend/` folder)

This is the single reference document for everything Domain 1 built. All responses
follow a consistent shape:
```json
{ "success": true, "data": { ... } }
{ "success": false, "error": "Human-readable message" }
```

---

## 1. Database — 20 tables total

The original spec (schema doc) defined **19 core tables**. A 20th, `User`, was added
mid-build after discovering the Auth domain (Domain 2) explicitly depends on it and it
had been dropped during the 12→19 table scope revision. **No existing table was altered
or dropped when `User` was added** — verified via migration SQL review.

`bot_profile` and `ai_execution_log` remain **out of scope** (deferred CK-46 module, per
schema doc) and were never built.

### Layer 1 — Core Structure (10)
`Domain`, `EntityType`, `Entity`, `EntityRelationshipRule`, `FormMaster`,
`SectionMaster`, `SubsectionMaster`, `ParameterCategory`, `ParameterMaster`,
`ParameterValue`

### Layer 2 — Process & Governance (5)
`WorkflowMaster`, `ApprovalMatrix`, `NotificationRule`, `EmailTemplate`, `SecurityRole`

### Layer 3 — Reporting & Analytics (2)
`ReportMaster`, `DashboardMaster`

### Layer 4 — System & Files (2)
`AuditLog`, `FileRepository`

### Table 20 — Auth foundation (added mid-build)
`User` — `user_id` (PK), `name`, `email` (unique), `password_hash`, `role`
(default `"citizen"`), `assignedArea` (nullable), `created_date`, `updated_date`.
**No foreign key wired yet** — Domain 2 (Prajakta) will link this into AuditLog /
approval routes when building auth.

> ⚠️ **Important note on naming:** actual PostgreSQL table names are **PascalCase**
> (`"EntityType"`, `"ParameterMaster"`, `"User"`, etc.) — relevant only if querying the
> database directly. API field names in JSON responses use the names shown throughout
> this doc.

---

## 2. Entity Engine (`/entities`) — ✅ tested

Generic CRUD that works for ANY entity type (Movement, Grievance, or any future type)
via `entity_type_id` — no per-module code.

| Route | Purpose |
|---|---|
| `POST /entities` | Create. Body: `{ entity_type_id, name, location, status? }`. `400` if `entity_type_id` invalid. |
| `GET /entities/:id` | Fetch one, includes `entityType`. `404` if missing. |
| `GET /entities?entity_type_id=&page=&limit=` | List, paginated (default limit 20). |
| `PUT /entities/:id` | Partial update. **If `status` changes, this auto-fires the Rule Engine** (non-blocking — see §4). |
| `DELETE /entities/:id` | **Soft delete** — sets `status = "deleted"`, never removes the row or related data. |

**Tested:** create (Movement + Grievance via same endpoint), list, get-by-id, update,
soft-delete (confirmed row preserved with status change only).

---

## 3. Form Engine (`/forms`) — ✅ tested

Defines form structure per entity type — sections → subsections → parameters — so the
frontend can render ANY form from one generic component.

| Route | Purpose |
|---|---|
| `GET /forms/:id/schema` | Full nested structure: form → sections → subsections → parameters, each with `field_type`, `control_type`, `mandatory`, `validation_rule`. |

Full form/section/parameter management routes are in `routes/form.js`.

**Tested:** `GET /forms/1/schema` returns the complete "Movement Registration Form"
with 2 sections, 3 subsections, 5 parameters correctly nested — confirmed the frontend
`DynamicForm` component has everything it needs to render without per-module code.

---

## 4. ParameterValue Storage (`/entities/:id/values`) — ✅ tested

Stores/retrieves actual user-submitted form data against an entity.

| Route | Purpose |
|---|---|
| `POST /entities/:id/values` | Batch create. Body: `{ values: [{ parameter_id, value }, ...] }`. **Atomic** (all-or-nothing via Prisma transaction). Validates entity exists, parameter_id exists, mandatory fields non-empty. Max 200 values/request. |
| `GET /entities/:id/values` | Fetch all values for an entity, each with `parameterMaster` info. Empty array (not an error) if none yet. |
| `PUT /entities/:id/values` | **Upsert** — updates existing `parameter_id` values, creates new ones. Atomic. |

**Tested:** POST (2 values on Grievance B), GET (confirmed both retrievable), PUT
(confirmed value 1 updated in-place, value 3 created new — correct upsert behavior).

---

## 5. Rule Engine (auto-creation) — ✅ tested

The core "no-code" mechanism. When an entity's status changes to match a defined
event, the engine checks `EntityRelationshipRule` and auto-creates the linked entity —
zero hardcoded per-module logic.

| Route | Purpose |
|---|---|
| `POST /entities/:id/fire-rules` | Standalone trigger. Body: `{ eventType: "approved" }`. Returns `{ rulesFired, createdEntities, chainDepth, warnings }`. |
| (automatic) `PUT /entities/:id` | If `status` is included and changes, fires the engine in the background — **non-blocking**: the entity update always succeeds regardless of rule outcome; rule errors are logged server-side only, not surfaced to the client. |

- Every auto-creation is atomic (new Entity + AuditLog row in one transaction).
- Chaining (an auto-created entity's `auto_approve: true` triggering further rules) is
  capped at `MAX_CHAIN_DEPTH = 3` to prevent infinite loops.
- `rulesFired: 0` is a normal, non-error outcome when no rule matches.

**Tested end-to-end:** inserted rule (Movement `approved` → auto-create Grievance),
fired via standalone endpoint (confirmed `rulesFired: 1`, new entity + audit log
created), confirmed non-matching event returns `rulesFired: 0` gracefully, confirmed
new entity appears in `GET /entities`.

Example rule definition:
```sql
INSERT INTO "EntityRelationshipRule"
  (source_entity_type_id, target_entity_type_id, event, auto_create, auto_approve)
VALUES (1, 2, 'approved', true, false);
```

---

## 6. What's explicitly OUT of Domain 1 scope

- Auth routes, JWT, bcrypt, signup/login → **Domain 2 (Prajakta)**
- Role-based access control on any route above → **Domain 2**
- Frontend rendering, DynamicForm component → **Domain 3 (Ayush)**
- AI suggestions, PDF/Excel reports, deployment, CI → **Domain 4 (Om)**
- `bot_profile`, `ai_execution_log` (CK-46) → deferred, future phase

---

## 7. Notes by team

### For Ayush (Frontend)
- `GET /forms/:id/schema` → drives the `DynamicForm` component. Verified it returns
  everything needed (field types, control types, mandatory flags, validation rules)
  for one generic component to render any form.
- Status tracking UI: poll `GET /entities?entity_type_id=X`, read `status` field.
- None of these routes currently check auth/roles — that layer is coming from Domain 2.

### For Prajakta (Auth)
- `User` table now exists (table #20) with exactly the fields you specified:
  `role` (string, default `"citizen"`) and `assignedArea` (nullable string).
- No foreign key from `User` to anything else yet — wire it into `AuditLog`/approval
  routes as part of your build.
- `password_hash` field name signals bcrypt hash storage — never plaintext.

### For Om (DevOps/AI)
- All 5 engines above are tested locally end-to-end, confirmed working together
  (regression-checked after every new addition, including after the User table
  migration — nothing broke).
- `DATABASE_URL` required in `.env` (Supabase Postgres connection string).
- Entry point: `backend/index.js`, `npm start` → port 3000.
- No AI integration yet — that's your layer to add (`services/aiSuggestion.js` per
  the pipeline plan).

---

## 8. Known gaps / things to double-check later

- `User` table has no FK relations yet (by design — Domain 2's job).
- `AuditLog.user` is currently a plain string field, not linked to `User.user_id` —
  Domain 2 may want to formalize this once auth is wired in.
- Chaining behavior in the Rule Engine (recursive auto-creation via `auto_approve`)
  was implemented but only tested one level deep (no chain longer than 1 was
  triggered in testing) — worth a deeper test if a multi-level rule is ever defined.
