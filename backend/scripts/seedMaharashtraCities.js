/**
 * Seed major Maharashtra cities into JurisdictionMaster.
 * Safe to run multiple times — skips existing entries.
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const MAHARASHTRA_ID = 2; // seeded parent

const CITIES = [
  'Mumbai',
  'Nagpur',
  'Nashik',
  'Aurangabad',
  'Solapur',
  'Kolhapur',
  'Amravati',
  'Navi Mumbai',
  'Thane',
  'Satara',
  'Latur',
  'Akola',
  'Jalgaon',
  'Chandrapur',
  'Parbhani',
  'Dhule',
  'Ahmednagar',
  'Nanded',
  'Sangli',
  'Raigad',
];

async function main() {
  for (const city of CITIES) {
    const exists = await prisma.jurisdictionMaster.findFirst({
      where: {
        name: { equals: city, mode: 'insensitive' },
        parent_id: MAHARASHTRA_ID,
      },
    });

    if (exists) {
      console.log(`  skip  : ${city} (already exists)`);
    } else {
      await prisma.jurisdictionMaster.create({
        data: {
          name: city,
          type: 'city',
          parent_id: MAHARASHTRA_ID,
          status: 'active',
        },
      });
      console.log(`  added : ${city}`);
    }
  }
  console.log('\nDone — Maharashtra cities seeded.');
}

main()
  .catch((e) => { console.error(e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
