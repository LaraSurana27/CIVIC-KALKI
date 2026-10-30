#!/usr/bin/env node
/**
 * CIVIC-KALKI — Declarative Metadata Seeder Script
 *
 * Usage:
 *   node scripts/seedMetadata.js            # Commit to database
 *   node scripts/seedMetadata.js --dry-run  # Validate without writing
 */

require('dotenv').config();
const { seedMetadata } = require('../services/metadataLoader');
const prisma = require('../db');

async function main() {
  const isDryRun = process.argv.includes('--dry-run');

  console.log(`\n======================================================`);
  console.log(` CIVIC-KALKI Metadata Seeder ${isDryRun ? '[DRY RUN MODE]' : '[APPLY MODE]'}`);
  console.log(`======================================================\n`);

  try {
    const outcome = await seedMetadata({ dryRun: isDryRun });

    console.log(`Discovered and processed ${outcome.results.length} metadata files:\n`);
    for (const res of outcome.results) {
      console.log(` ✔ [${res.status}] ${res.entityType} (Domain: ${res.domain})`);
      if (res.formId) console.log(`   - FormMaster ID: ${res.formId}`);
      if (res.parametersCount) console.log(`   - Parameters: ${res.parametersCount}`);
      if (res.workflowsCount) console.log(`   - Transitions: ${res.workflowsCount}`);
      if (res.reportsCount) console.log(`   - Reports: ${res.reportsCount}`);
      console.log('');
    }

    console.log(`Metadata synchronization completed successfully.`);
    process.exit(0);
  } catch (err) {
    console.error(`\n❌ Metadata seeding failed:`);
    console.error(err.message || err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
