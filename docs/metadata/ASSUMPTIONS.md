# CIVIC-KALKI Regulatory & Workflow Assumptions Log

**Status:** UNVERIFIED DRAFT — Pending Official Stakeholder Confirmation  
**Scope:** Civic Events Domain (Permissions & Resource Requests)  
**Notice:** All document lists, numerical thresholds, authority classifications, department scopes, and review matrices documented below are placeholder configurations developed for platform demonstration and testing purposes. Under no circumstances should these values be presented or interpreted as official regulatory guidelines of the Pune Municipal Corporation (PMC), Pune Police, or Maharashtra State Government.

---

## 1. Governance & Regulatory Assumptions

| ID | Topic / Parameter | Config Value in Code/Metadata | Verified? | Regulatory Authority / Confirming Stakeholder | Impact if Modified |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ASSUMP-01** | Crowd Threshold for Police Station Review | `expected_crowd >= 500` | ❌ `false` | Pune Police (Traffic & Law & Order) | Changes which events require local police station review. |
| **ASSUMP-02** | Crowd Threshold for Fire Department Clearance | `expected_crowd >= 1000` | ❌ `false` | Pune Municipal Corporation (PMC) Fire Department | Adjusts mandatory fire safety inspection requirement. |
| **ASSUMP-03** | Mandatory Fire Safety Checklist Trigger | Any selection in `fire_safety_requirement` | ❌ `false` | PMC Chief Fire Officer (CFO) | Non-empty checklist flags mandatory fire department review task. |
| **ASSUMP-04** | Road Usage / Traffic Review Trigger | `road_usage != 'none'` OR `traffic_support_required == true` | ❌ `false` | Pune Police Traffic Branch | Determines whether Traffic Police approval is required. |
| **ASSUMP-05** | Sound System Restriction Window | 22:00 to 06:00 (10 PM to 6 AM) limit | ❌ `false` | Environment Dept / Police Noise Pollution Cell | Validation rule on `end_time` when `sound_system == true`. |
| **ASSUMP-06** | Required Event Permission Documents | ID Proof, Venue Consent, Pandal Layout, Prior Year Permission | ❌ `false` | PMC Ward Office & Pune Police Single Window Cell | Changes mandatory document slots and file upload requirements. |
| **ASSUMP-07** | Event Date Advance Notice Window | Minimum 7 days prior to `event_date` | ❌ `false` | PMC Municipal Commissioner Circulars | Validation rule on application submission lead time. |
| **ASSUMP-08** | Multi-Department Aggregation Policy | `all_must_approve` (any rejection terminates; any change-request returns to draft) | ❌ `false` | Academic Guide / Project Architects | Decision aggregation policy across parallel department reviews. |
| **ASSUMP-09** | Resubmission Workflow Route | Returns to `coordinator_verification` upon citizen edit & resubmit | ❌ `false` | Lara (DB / Backend Lead) & Project Guide | Whether resubmitted files bypass coordinator or restart queue. |
| **ASSUMP-10** | Resource Request Department Routing | Barricades/Personnel → Police; Tankers/Toilets/Lighting → Ward/Sanitation; Ambulance → Health | ❌ `false` | PMC Disaster Management & Central Stores | Routing matrix for dynamic resource fulfillment. |
| **ASSUMP-11** | Authority Keys & Scopes | `police_traffic`, `police_local_station`, `pmc_ward_office`, `pmc_fire`, `other` | ❌ `false` | PMC e-Governance / Pune City Police | Naming and key conventions for reviewing bodies. |
| **ASSUMP-12** | Review SLA Deadlines | Coordinator: 48h; Department Review: 72h; Resource Fulfillment: 24h | ❌ `false` | Maharashtra Right to Public Services Act (RTSA) | SLA timers and escalation triggers. |

---

## 2. Technical & Architectural Assumptions

| ID | Technical Item | Current Assumption | Confirming Owner |
| :--- | :--- | :--- | :--- |
| **TECH-01** | Additive Review Task Table | Add `EntityReviewTask` model to `prisma/schema.prisma` to track parallel department reviews without altering existing tables. | Lara (Database / Core Engine Owner) |
| **TECH-02** | Safe Rule Evaluator | Pure recursive AST evaluator (json-logic dialect) without `eval()` or `Function()` to guarantee security. | Security / Platform Lead |
| **TECH-03** | Auth Role Compatibility | Review tasks assignable to users with roles `coordinator_area`, `coordinator_general`, `director`, or `admin` without changing auth schema. | Prajakta (Auth Lead) |
| **TECH-04** | File Upload Handling | Document slots reuse generic `FileRepository` linked by `parameter_id` and `entity_id`. | Platform Team |
