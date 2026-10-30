# Phase 4 Reference — Authority Mapping, Routing Rules & Reconciliation

**Author:** Platform / Core Architecture Team  
**Branch:** `feat/civic-metadata-permissions`  
**Date:** October 2026  

---

## 1. Authority Architecture Overview

In CIVIC-KALKI, **reviewing authorities are data, not code**. There is no hardcoded departmental logic (e.g. `if (authority === "police")`). 

Instead, authorities are configured as declarative records with unique keys, jurisdictions, and review scopes. Whether an authority is required to review a specific permission application is determined entirely by **declarative requirement rules** evaluated against the applicant's submitted parameter values.

---

## 2. Seeded Placeholder Authorities (`backend/metadata/_shared/authorities.json`)

All authorities listed below are placeholder configuration records pending formal confirmation with Pune Municipal Corporation (PMC) and Pune City Police contacts (`verified: false`):

| Authority Key | Display Name | Jurisdiction | Review Scope / Mandate | Default SLA |
| :--- | :--- | :--- | :--- | :--- |
| `police_traffic` | Pune Police Traffic Branch | City / Ward Traffic Division | Road obstruction, vehicle diversion, procession route clearance, parking management | 72 hours |
| `police_local_station` | Local Police Station | Jurisdiction Ward / Police Chowki | Law & order, crowd management, night sound compliance, VIP security | 48 hours |
| `pmc_ward_office` | PMC Ward Office (Field Division) | Ward Office (e.g. Ward 18, Ward 24) | Pandal structural clearance, public land encroachment, municipal cleanliness, sanitation | 48 hours |
| `pmc_fire` | PMC Fire Brigade Headquarters | City Central Fire Control | Fire extinguisher placement, emergency exit corridors, electrical wiring clearance | 72 hours |
| `other` | Specialized Civic Authority | Special Jurisdiction | Ad-hoc or environmental clearances (MSEDCL power connection, pollution control) | 96 hours |

---

## 3. Declarative Requirement Rules (JSON-Logic Safe Dialect)

When an event permission application is submitted or updated, the system executes declarative rules to determine the list of mandatory review authorities. 

Thresholds live in `config.thresholds`, not hardcoded inside the rule expressions:

```json
{
  "thresholds": {
    "crowd_threshold": 500,
    "fire_safety_crowd_threshold": 1000,
    "sound_system_night_curfew": "22:00"
  }
}
```

### Requirement Rule Table:

| Target Authority | Logical Condition | JSON-Logic Rule Representation | Matched Inputs Tracked |
| :--- | :--- | :--- | :--- |
| `police_traffic` | `road_usage != 'none' OR traffic_support_required == true` | `{"or": [{"!=": [{"var": "road_usage"}, "none"]}, {"==": [{"var": "traffic_support_required"}, true]}]}` | `road_usage`, `traffic_support_required` |
| `police_local_station` | `police_support_required == true OR expected_crowd >= 500` | `{"or": [{"==": [{"var": "police_support_required"}, true]}, {">=": [{"var": "expected_crowd"}, 500]}]}` | `police_support_required`, `expected_crowd` |
| `pmc_fire` | `fire_safety_requirement != [] OR expected_crowd >= 1000` | `{"or": [{"!=": [{"var": "fire_safety_requirement"}, null]}, {">=": [{"var": "expected_crowd"}, 1000]}]}` | `fire_safety_requirement`, `expected_crowd` |
| `pmc_ward_office` | Always required for civic event permits | `{"==": [true, true]}` | `pandal_location` |

---

## 4. Re-Evaluation & Review Task Reconciliation Logic

When an application undergoes a transition (e.g. from `draft` → `submitted` or after edits following `request_changes`), the rule engine reconciles the review tasks:

1. **Rule Re-evaluation**: The engine recalculates required authorities using the latest form parameters.
2. **Add New Tasks**: If new authorities are triggered (e.g., organizer increased `expected_crowd` from 400 to 1200, newly triggering `pmc_fire`), a new `pending` task is created with the `required_reason` and `matched_inputs` snapshot.
3. **Void Obsolete Tasks**: If parameter changes mean an authority is no longer required (e.g., road usage changed from `"full"` to `"none"`), an uncompleted task is marked `voided` with an audit trail entry.
4. **Preserve Completed Tasks**: If an authority has already approved and their matched inputs did not change, their completed review is preserved to prevent repetitive departmental review.
5. **Traceability**: The reason WHY each authority was required (`rule_id`, rule description, and matched form values) is durably stored on the task record and exposed to applicants and reviewers.
