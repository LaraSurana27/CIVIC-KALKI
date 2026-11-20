/**
 * Creates demo coordinator accounts for testing Ayush's Coordinator AI module.
 * Run once: node create-demo-coordinators.js
 */
'use strict';

require('dotenv').config();

// Use a separate PrismaClient with a short connection timeout to avoid
// hitting the Supabase session-mode pool limit (the backend holds connections).
// We reuse the same DATABASE_URL but add pgbouncer=true to use transaction mode.
const originalUrl = process.env.DATABASE_URL || '';
// Switch from session mode (port 5432) to transaction pooler (port 6543)
const poolerUrl = originalUrl.replace(':5432/', ':6543/');
process.env.DATABASE_URL_SCRIPT = poolerUrl.includes('6543') ? poolerUrl : originalUrl;

const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DEMO_ACCOUNTS = [
  {
    name: 'Ayush Coordinator (General)',
    email: 'ayush.coordinator@civickalki.demo',
    password: 'Civic@Demo123',
    role: 'coordinator_general',
    assignedArea: null,
    description: 'Can analyze ALL areas — no area restriction',
  },
  {
    name: 'Ayush Coordinator (Area — Pune West)',
    email: 'ayush.area.coordinator@civickalki.demo',
    password: 'Civic@Demo123',
    role: 'coordinator_area',
    assignedArea: 'Pune West',
    description: 'Can only analyze cases in "Pune West" area',
  },
  {
    name: 'Ayush Director',
    email: 'ayush.director@civickalki.demo',
    password: 'Civic@Demo123',
    role: 'director',
    assignedArea: null,
    description: 'Executive role — can analyze any case + run governance intelligence',
  },
];

async function main() {
  console.log('\n=== Creating Demo Coordinator Accounts ===\n');

  for (const account of DEMO_ACCOUNTS) {
    try {
      // Check if already exists
      const existing = await prisma.user.findUnique({ where: { email: account.email } });
      if (existing) {
        console.log(`[~] ALREADY EXISTS: ${account.email}`);
        continue;
      }

      const passwordHash = await bcrypt.hash(account.password, 10);
      const user = await prisma.user.create({
        data: {
          name: account.name,
          email: account.email,
          password_hash: passwordHash,
          role: account.role,
          assignedArea: account.assignedArea,
        },
      });

      console.log(`[✓] CREATED: ${account.name}`);
      console.log(`    Email    : ${account.email}`);
      console.log(`    Password : ${account.password}`);
      console.log(`    Role     : ${account.role}`);
      if (account.assignedArea) {
        console.log(`    Area     : ${account.assignedArea}`);
      }
      console.log(`    Note     : ${account.description}`);
      console.log();
    } catch (err) {
      console.error(`[✗] FAILED for ${account.email}: ${err.message}`);
    }
  }

  // Also fetch an existing submitted entity to test with
  const sampleEntity = await prisma.entity.findFirst({
    where: { status: { in: ['submitted', 'coordinator_approved', 'approved'] } },
    select: { entity_id: true, name: true, status: true, area: true },
    orderBy: { entity_id: 'desc' },
  });

  console.log('=== Demo Setup Complete ===\n');
  console.log('All accounts use password: Civic@Demo123');
  console.log('Login at: http://localhost:5173\n');

  if (sampleEntity) {
    console.log('=== Sample Case to Test Coordinator AI ===');
    console.log(`Case ID  : ${sampleEntity.entity_id}`);
    console.log(`Name     : ${sampleEntity.name}`);
    console.log(`Status   : ${sampleEntity.status}`);
    console.log(`Area     : ${sampleEntity.area || 'N/A'}`);
    console.log(`URL      : http://localhost:5173/entities/${sampleEntity.entity_id}`);
    console.log('\nLog in as ayush.coordinator@civickalki.demo → open this case → click "Run Coordinator Analysis (Groq)"\n');
  }
}

main()
  .catch(e => { console.error('Error:', e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
