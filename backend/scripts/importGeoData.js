/**
 * CIVIC-KALKI — Geographic Data Import
 * ─────────────────────────────────────────────────────────────────────────────
 * Imports Country → State → City hierarchy from the `country-state-city`
 * package into JurisdictionMaster.
 *
 * Safe to run multiple times — uses upsert logic (skips existing entries).
 * Ward/locality data is NOT in this dataset; those must be added by admins
 * via POST /jurisdictions.
 *
 * Usage:
 *   node scripts/importGeoData.js                    # India only (default)
 *   node scripts/importGeoData.js --country=IN,US,GB # specific ISO2 codes
 *   node scripts/importGeoData.js --all              # all countries (slow ~150k cities)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { PrismaClient } = require('@prisma/client');
const { Country, State, City } = require('country-state-city');

const prisma = new PrismaClient();

// ── CLI arg parsing ──────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const importAll = args.includes('--all');
const countryArg = args.find(a => a.startsWith('--country='));
const targetCodes = importAll
  ? null
  : countryArg
    ? countryArg.replace('--country=', '').split(',').map(s => s.trim().toUpperCase())
    : ['IN']; // default: India

// ── Helpers ──────────────────────────────────────────────────────────────────
let stats = { countries: 0, states: 0, cities: 0, skipped: 0 };

async function upsertJurisdiction({ name, type, parent_id, code }) {
  const existing = await prisma.jurisdictionMaster.findFirst({
    where: {
      name: { equals: name, mode: 'insensitive' },
      type,
      parent_id: parent_id ?? null,
    },
    select: { jurisdiction_id: true },
  });

  if (existing) {
    stats.skipped++;
    return existing;
  }

  const created = await prisma.jurisdictionMaster.create({
    data: {
      name: name.trim(),
      type,
      parent_id: parent_id ?? null,
      code: code ? String(code).toUpperCase() : null,
      status: 'active',
    },
    select: { jurisdiction_id: true, name: true },
  });
  return created;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const allCountries = Country.getAllCountries();
  const countries = targetCodes
    ? allCountries.filter(c => targetCodes.includes(c.isoCode))
    : allCountries;

  if (countries.length === 0) {
    console.error('No matching countries found for codes:', targetCodes);
    process.exit(1);
  }

  console.log(`\n=== CIVIC-KALKI Geographic Import ===`);
  console.log(`Importing: ${countries.map(c => `${c.name} (${c.isoCode})`).join(', ')}\n`);

  for (const country of countries) {
    process.stdout.write(`\n[${country.isoCode}] ${country.name} ... `);

    const countryNode = await upsertJurisdiction({
      name: country.name,
      type: 'country',
      parent_id: null,
      code: country.isoCode,
    });
    stats.countries++;

    const states = State.getStatesOfCountry(country.isoCode);
    process.stdout.write(`${states.length} states\n`);

    for (const state of states) {
      const stateNode = await upsertJurisdiction({
        name: state.name,
        type: 'state',
        parent_id: countryNode.jurisdiction_id,
        code: state.isoCode || null,
      });
      stats.states++;

      const cities = City.getCitiesOfState(country.isoCode, state.isoCode);

      for (const city of cities) {
        await upsertJurisdiction({
          name: city.name,
          type: 'city',
          parent_id: stateNode.jurisdiction_id,
          code: null,
        });
        stats.cities++;
      }

      process.stdout.write(`  ↳ ${state.name}: ${cities.length} cities\n`);
    }
  }

  console.log('\n─────────────────────────────────────────');
  console.log(`✓ Countries : ${stats.countries}`);
  console.log(`✓ States    : ${stats.states}`);
  console.log(`✓ Cities    : ${stats.cities}`);
  console.log(`  Skipped   : ${stats.skipped} (already existed)`);
  console.log('\nImport complete. Wards/localities can be added via POST /jurisdictions.');
}

main()
  .catch(e => { console.error('\nImport failed:', e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
