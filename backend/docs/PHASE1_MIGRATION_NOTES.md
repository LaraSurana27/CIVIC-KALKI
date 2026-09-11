# Phase 1 Migration Notes

Migration `20260911180000_phase1_demo_foundation` makes the schema capable of
enforcing the API/workflow/demo contracts. It adds the owner relation requested
for entities, structured area, form rendering metadata, approval history, AI
execution logs, and the parameter-value uniqueness constraint.

## Compatibility decisions

- `Entity.owner_user_id` and `Entity.area` are nullable so existing records can
  migrate safely. The forthcoming authenticated create route must require both
  for new citizen submissions.
- `ParameterMaster.field_key` and `label` are nullable for existing form rows.
  The forthcoming admin form API must require both for new parameters.
- `AuditLog.user` remains as legacy display text. New human actions must also
  write `actor_user_id`, `old_status`, and `new_status`.
- `ApprovalHistory.actor_user_id` and `AIExecutionLog.requested_by_user_id`
  are nullable so system-created events can be recorded without pretending a
  user performed them.

## Required preflight before applying to a shared database

The unique `(entity_id, parameter_id)` index will fail if duplicate values
already exist. Inspect them first; do not delete or merge records without an
approved data-remediation decision.

```sql
SELECT entity_id, parameter_id, COUNT(*) AS duplicate_count
FROM "ParameterValue"
GROUP BY entity_id, parameter_id
HAVING COUNT(*) > 1;
```

If the query returns no rows, apply with:

```text
npx prisma migrate deploy
```

Then regenerate the Prisma client using the repository's installed Prisma
version and verify the new fields/tables in Prisma Studio.
