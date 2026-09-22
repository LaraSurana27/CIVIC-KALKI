#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getStagedFiles() {
  try {
    const out = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' });
    return out.split('\n').map(s => s.trim()).filter(Boolean);
  } catch (e) {
    return [];
  }
}

const patterns = [
  { name: 'RSA/PRIVATE KEY', re: /-----BEGIN (RSA |OPENSSH |EC )?PRIVATE KEY-----/i },
  { name: 'JWT secret variable', re: /JWT_SECRET\s*=|jwt_secret/i },
  { name: 'Supabase service_role', re: /service_role\s*=|service_role\:|supabase.*service_role/i },
  { name: 'Supabase anon key', re: /anon\w*_key|supabase.*anon/i },
  { name: 'AWS Access Key', re: /AKIA[0-9A-Z]{16}/ },
  { name: 'Stripe secret', re: /sk_live_[0-9a-zA-Z]{24,}/i },
  { name: 'Likely long hex', re: /(?:[A-Fa-f0-9]{40,})/ },
];

let failures = [];
const files = getStagedFiles();
files.forEach(file => {
  // skip binaries
  try {
    const buf = fs.readFileSync(file, 'utf8');
    patterns.forEach(p => {
      if (p.re.test(buf)) {
        failures.push({ file, pattern: p.name });
      }
    });
  } catch (e) {
    // ignore unreadable files
  }
});

if (failures.length) {
  console.error('\nSecret scan failed — potential secrets found in staged files:');
  failures.forEach(f => console.error(` - ${f.file}: ${f.pattern}`));
  console.error('\nIf these are false positives, remove the sensitive content from commits or move them to env/secrets.');
  console.error('To bypass (not recommended) run: git commit --no-verify');
  process.exit(1);
}
process.exit(0);
