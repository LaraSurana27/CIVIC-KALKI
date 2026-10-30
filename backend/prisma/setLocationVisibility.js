/**
 * CIVIC-KALKI — CLI Tool: Set EntityType Location Visibility
 * Usage: node prisma/setLocationVisibility.js <EntityTypeName> <value>
 * Allowed values: 'restricted' | 'public_when_approved'
 */

require('dotenv').config();
const prisma = require('../db');

const ALLOWED_VALUES = ['restricted', 'public_when_approved'];

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: node prisma/setLocationVisibility.js <EntityTypeName> <value>');
    console.error(`Allowed values: ${ALLOWED_VALUES.join(' | ')}`);
    process.exit(1);
  }

  const [typeName, rawValue] = args;
  const value = String(rawValue).trim().toLowerCase();

  if (!ALLOWED_VALUES.includes(value)) {
    console.error(`Error: Invalid value "${rawValue}". Allowed values: ${ALLOWED_VALUES.join(', ')}`);
    process.exit(1);
  }

  const entityType = await prisma.entityType.findFirst({
    where: { name: { equals: typeName.trim(), mode: 'insensitive' } },
  });

  if (!entityType) {
    console.error(`Error: EntityType "${typeName}" was not found.`);
    process.exit(1);
  }

  const prevValue = entityType.location_visibility;

  const updated = await prisma.entityType.update({
    where: { entity_type_id: entityType.entity_type_id },
    data: { location_visibility: value },
  });

  console.log(`[SUCCESS] EntityType "${updated.name}" (ID ${updated.entity_type_id}) location_visibility updated:`);
  console.log(`  Previous: "${prevValue}"`);
  console.log(`  New:      "${updated.location_visibility}"`);
}

main()
  .catch((err) => {
    console.error('Error executing setLocationVisibility:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
