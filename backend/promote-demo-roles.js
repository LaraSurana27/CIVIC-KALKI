/**
 * Promotes demo coordinator accounts to their correct roles.
 * Uses backend's existing db module (shares connection pool).
 * Run: node promote-demo-roles.js
 */
'use strict';
require('dotenv').config();
const prisma = require('./db');

async function main() {
  const updates = [
    { user_id: 306, email: 'ayush.coordinator@civickalki.demo', role: 'coordinator_general', assignedArea: null },
    { user_id: 307, email: 'ayush.area@civickalki.demo',        role: 'coordinator_area',    assignedArea: 'Pune West' },
    { user_id: 308, email: 'ayush.director@civickalki.demo',    role: 'director',             assignedArea: null },
  ];

  console.log('\n=== Promoting Demo Account Roles ===\n');

  for (const u of updates) {
    const updated = await prisma.user.update({
      where: { user_id: u.user_id },
      data: { role: u.role, assignedArea: u.assignedArea },
      select: { user_id: true, email: true, role: true, assignedArea: true },
    });
    console.log(`[✓] ${updated.email}`);
    console.log(`    role: ${updated.role}${updated.assignedArea ? ' | area: ' + updated.assignedArea : ''}`);
  }

  // Grab a sample submitted/coordinator_approved case to test with
  const cases = await prisma.entity.findMany({
    where: { status: { in: ['submitted', 'coordinator_approved'] } },
    select: { entity_id: true, name: true, status: true, area: true },
    orderBy: { entity_id: 'desc' },
    take: 3,
  });

  console.log('\n=== Sample Cases to Test Coordinator AI ===\n');
  cases.forEach(c => {
    console.log(`  Case #${c.entity_id}: "${c.name}"`);
    console.log(`    Status: ${c.status} | Area: ${c.area || 'N/A'}`);
    console.log(`    URL: http://localhost:5173/entities/${c.entity_id}`);
  });

  console.log('\n=== Done ===\n');
}

main()
  .catch(e => console.error('Error:', e.message))
  .finally(() => prisma.$disconnect());
