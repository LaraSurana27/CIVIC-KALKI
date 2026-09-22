# Security & Secrets Handling

This repository includes a small secret-scan and recommended rotation/playbook.

1) Immediate steps after finding a leaked secret
  - Rotate the leaked credential in the provider dashboard (Supabase, Stripe, AWS, etc.).
  - Replace the value in your local `backend/.env` and do NOT commit it.
  - Update repository secrets (GitHub) for `DATABASE_URL` and `JWT_SECRET`.

2) How to add GitHub Actions secrets
  - Go to GitHub → Settings → Secrets and variables → Actions → New repository secret.
  - Add `DATABASE_URL` (Session Pooler URI) and `JWT_SECRET`.

3) Pre-commit scanning
  - A lightweight staged-file scanner is included at `scripts/secret-scan.js`.
  - To enable Husky hooks locally:

```
npm install
npm run prepare
```

4) Collaborator notice (what to tell your team)
  - "We removed a committed tokens file and rewrote history. Re-clone the repo or run: `git fetch origin && git reset --hard origin/main`. Rotate any local credentials you have."

5) Rotation playbook (summary)
  - Revoke the leaked key immediately in the provider console.
  - Generate a new key and update any services that used the old key.
  - Update `DATABASE_URL` / `JWT_SECRET` in GitHub Actions secrets.
  - Test the app and CI runs locally with the new secrets.
