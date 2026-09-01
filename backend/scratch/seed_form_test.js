/**
 * One-off seed script — creates prerequisite rows for Form Engine testing.
 * Run once: node scratch/seed_form_test.js
 * Safe to re-run: uses findFirst checks before creating.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  // 1. Domain
  let domain = await prisma.domain.findFirst();
  if (!domain) {
    domain = await prisma.domain.create({
      data: { domain_name: 'Civic', description: 'Civic domain' },
    });
    console.log('Created domain:', domain.domain_id);
  } else {
    console.log('Using existing domain:', domain.domain_id);
  }

  // 2. Entity type: Movement
  let movement = await prisma.entityType.findFirst({ where: { name: 'Movement' } });
  if (!movement) {
    movement = await prisma.entityType.create({
      data: { domain_id: domain.domain_id, name: 'Movement', description: 'Movement entity type' },
    });
    console.log('Created Movement entity type:', movement.entity_type_id);
  } else {
    console.log('Using existing Movement entity type:', movement.entity_type_id);
  }

  // 3. Entity type: Grievance
  let grievance = await prisma.entityType.findFirst({ where: { name: 'Grievance' } });
  if (!grievance) {
    grievance = await prisma.entityType.create({
      data: { domain_id: domain.domain_id, name: 'Grievance', description: 'Grievance entity type' },
    });
    console.log('Created Grievance entity type:', grievance.entity_type_id);
  } else {
    console.log('Using existing Grievance entity type:', grievance.entity_type_id);
  }

  // 4. ParameterCategory
  let cat = await prisma.parameterCategory.findFirst();
  if (!cat) {
    cat = await prisma.parameterCategory.create({
      data: { category_name: 'General' },
    });
    console.log('Created ParameterCategory:', cat.category_id);
  } else {
    console.log('Using existing ParameterCategory:', cat.category_id);
  }

  console.log('\n=== Seed complete. Use these IDs in tests: ===');
  console.log(`  domain_id       : ${domain.domain_id}`);
  console.log(`  Movement type id: ${movement.entity_type_id}`);
  console.log(`  Grievance type id: ${grievance.entity_type_id}`);
  console.log(`  category_id     : ${cat.category_id}`);
}

seed()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('Seed error:', e.message);
    prisma.$disconnect();
    process.exit(1);
  });
