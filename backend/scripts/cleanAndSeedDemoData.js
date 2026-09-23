/**
 * CIVIC-KALKI — Demo Data Cleanup & Realistic Demonstration Seeding Script
 * Safely purges obvious dev/test records and seeds clean, realistic civic records.
 * Does NOT delete core architecture tables (Domain, EntityType, FormMaster, WorkflowMaster, etc.)
 * 
 * Run: node scripts/cleanAndSeedDemoData.js
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanAndSeed() {
  console.log('--- CIVIC-KALKI Demo Data Cleanup & Seeding ---');

  try {
    // 1. Find IDs of entities with test keywords or generic test titles
    const testEntities = await prisma.entity.findMany({
      where: {
        OR: [
          { name: { contains: 'Test', mode: 'insensitive' } },
          { name: { contains: 'E2E', mode: 'insensitive' } },
          { name: { contains: 'Auth Flow', mode: 'insensitive' } },
          { name: { contains: 'Seeded Movement', mode: 'insensitive' } },
          { name: { contains: 'Movement 1', mode: 'insensitive' } },
          { name: { contains: 'Grievance 1', mode: 'insensitive' } },
          { name: { contains: 'Park Renovation Request 1', mode: 'insensitive' } },
          { name: { contains: 'Dynamic UI', mode: 'insensitive' } },
        ],
      },
      select: { entity_id: true },
    });

    const testEntityIds = testEntities.map(e => e.entity_id);

    if (testEntityIds.length > 0) {
      // Delete child records first to respect foreign key constraints
      await prisma.auditLog.deleteMany({ where: { entity_id: { in: testEntityIds } } });
      await prisma.approvalHistory.deleteMany({ where: { entity_id: { in: testEntityIds } } });
      await prisma.parameterValue.deleteMany({ where: { entity_id: { in: testEntityIds } } });
      await prisma.aIExecutionLog.deleteMany({ where: { entity_id: { in: testEntityIds } } });

      const deletedEntities = await prisma.entity.deleteMany({
        where: { entity_id: { in: testEntityIds } },
      });
      console.log(`Cleaned up ${deletedEntities.count} test/dev entities and their child records.`);
    } else {
      console.log('No test/dev entities needed cleanup.');
    }

    // 2. Fetch seed users
    const citizen = await prisma.user.findFirst({ where: { role: 'citizen' } });
    const coordArea = await prisma.user.findFirst({ where: { role: 'coordinator_area' } });
    const director = await prisma.user.findFirst({ where: { role: 'director' } });

    if (!citizen) {
      console.error('Citizen user not found. Please run node seed.js first.');
      process.exit(1);
    }

    // 2b. Seed Canonical Demonstration JurisdictionMaster Hierarchy
    // Country -> State -> City -> Ward
    let india = await prisma.jurisdictionMaster.findFirst({ where: { parent_id: null, name: 'India' } });
    if (!india) {
      india = await prisma.jurisdictionMaster.create({
        data: { name: 'India', type: 'country', code: 'IND', status: 'active', parent_id: null },
      });
    }

    let maharashtra = await prisma.jurisdictionMaster.findFirst({ where: { parent_id: india.jurisdiction_id, name: 'Maharashtra' } });
    if (!maharashtra) {
      maharashtra = await prisma.jurisdictionMaster.create({
        data: { name: 'Maharashtra', type: 'state', code: 'MH', status: 'active', parent_id: india.jurisdiction_id },
      });
    }

    let pune = await prisma.jurisdictionMaster.findFirst({ where: { parent_id: maharashtra.jurisdiction_id, name: 'Pune' } });
    if (!pune) {
      pune = await prisma.jurisdictionMaster.create({
        data: { name: 'Pune', type: 'city', code: 'PNQ', status: 'active', parent_id: maharashtra.jurisdiction_id },
      });
    }

    const wards = [
      { name: 'Shivajinagar', code: 'SHIV' },
      { name: 'Kothrud', code: 'KOTH' },
      { name: 'Aundh', code: 'AUNDH' },
      { name: 'Hadapsar', code: 'HADP' },
    ];

    const wardMap = {};
    for (const w of wards) {
      let wardNode = await prisma.jurisdictionMaster.findFirst({
        where: { parent_id: pune.jurisdiction_id, name: w.name },
      });
      if (!wardNode) {
        wardNode = await prisma.jurisdictionMaster.create({
          data: { name: w.name, type: 'ward', code: w.code, status: 'active', parent_id: pune.jurisdiction_id },
        });
      }
      wardMap[w.name] = wardNode;
    }
    console.log('Seeded canonical JurisdictionMaster hierarchy: India -> Maharashtra -> Pune -> [Shivajinagar, Kothrud, Aundh, Hadapsar]');

    // 3. Fetch EntityTypes
    const movementType = await prisma.entityType.findFirst({ where: { name: 'Movement' } });
    const grievanceType = await prisma.entityType.findFirst({ where: { name: 'Grievance' } });
    const parkType = await prisma.entityType.findFirst({ where: { name: 'Park Renovation Request' } });

    // 4. Seed realistic Movements / Initiatives
    if (movementType) {
      const movements = [
        {
          name: 'Clean Pune Initiative',
          jurisdiction_id: wardMap['Shivajinagar']?.jurisdiction_id,
          area: 'Shivajinagar',
          location: 'JM Road & Deccan Gymkhana',
          status: 'approved',
          owner_user_id: citizen.user_id,
        },
        {
          name: 'Shivaji Park Restoration Drive',
          jurisdiction_id: wardMap['Shivajinagar']?.jurisdiction_id,
          area: 'Shivajinagar',
          location: 'Shivajinagar Central Park',
          status: 'coordinator_approved',
          owner_user_id: citizen.user_id,
        },
        {
          name: 'Safe Streets Pune',
          jurisdiction_id: wardMap['Kothrud']?.jurisdiction_id,
          area: 'Kothrud',
          location: 'Kothrud Main Boulevard',
          status: 'submitted',
          owner_user_id: citizen.user_id,
        },
      ];

      for (const m of movements) {
        const existing = await prisma.entity.findFirst({ where: { name: m.name } });
        if (!existing) {
          const created = await prisma.entity.create({
            data: {
              entity_type_id: movementType.entity_type_id,
              ...m,
            },
          });
          console.log(`Seeded Movement: "${created.name}" (#${created.entity_id})`);
        } else if (!existing.jurisdiction_id && m.jurisdiction_id) {
          await prisma.entity.update({
            where: { entity_id: existing.entity_id },
            data: { jurisdiction_id: m.jurisdiction_id, area: m.area },
          });
        }
      }
    }

    // 5. Seed realistic Grievances
    if (grievanceType) {
      const grievances = [
        {
          name: 'Garbage Accumulation near JM Road Market',
          jurisdiction_id: wardMap['Shivajinagar']?.jurisdiction_id,
          area: 'Shivajinagar',
          location: 'JM Road Lane 3',
          status: 'submitted',
          owner_user_id: citizen.user_id,
        },
        {
          name: 'Damaged Streetlights on Kothrud Boulevard',
          jurisdiction_id: wardMap['Kothrud']?.jurisdiction_id,
          area: 'Kothrud',
          location: 'Kothrud Stand Stop',
          status: 'submitted',
          owner_user_id: citizen.user_id,
        },
        {
          name: 'Park Infrastructure Defect - Broken Playground Swings',
          jurisdiction_id: wardMap['Shivajinagar']?.jurisdiction_id,
          area: 'Shivajinagar',
          location: 'Shivaji Park Playground',
          status: 'approved',
          owner_user_id: citizen.user_id,
        },
      ];

      for (const g of grievances) {
        const existing = await prisma.entity.findFirst({ where: { name: g.name } });
        if (!existing) {
          const created = await prisma.entity.create({
            data: {
              entity_type_id: grievanceType.entity_type_id,
              ...g,
            },
          });
          console.log(`Seeded Grievance: "${created.name}" (#${created.entity_id})`);
        } else if (!existing.jurisdiction_id && g.jurisdiction_id) {
          await prisma.entity.update({
            where: { entity_id: existing.entity_id },
            data: { jurisdiction_id: g.jurisdiction_id, area: g.area },
          });
        }
      }
    }

    // 6. Seed realistic Park Renovation Requests
    if (parkType) {
      const parks = [
        {
          name: 'Shivaji Park Restoration Proposal',
          jurisdiction_id: wardMap['Shivajinagar']?.jurisdiction_id,
          area: 'Shivajinagar',
          location: 'JM Road, Shivajinagar',
          status: 'approved',
          owner_user_id: citizen.user_id,
        },
        {
          name: 'Aundh Community Park Upgrade',
          jurisdiction_id: wardMap['Aundh']?.jurisdiction_id,
          area: 'Aundh',
          location: 'Aundh Sector 2',
          status: 'coordinator_approved',
          owner_user_id: citizen.user_id,
        },
        {
          name: 'Kothrud Park Greenery Restoration',
          jurisdiction_id: wardMap['Kothrud']?.jurisdiction_id,
          area: 'Kothrud',
          location: 'Kothrud Vanaz Corner',
          status: 'submitted',
          owner_user_id: citizen.user_id,
        },
      ];

      for (const p of parks) {
        const existing = await prisma.entity.findFirst({ where: { name: p.name } });
        if (!existing) {
          const created = await prisma.entity.create({
            data: {
              entity_type_id: parkType.entity_type_id,
              ...p,
            },
          });
          console.log(`Seeded Park Renovation: "${created.name}" (#${created.entity_id})`);

          // If approved, create auto-spawned Grievance to demonstrate automation lineage
          if (p.status === 'approved' && grievanceType) {
            const childName = `${p.name} - Infrastructure Grievance`;
            const existingChild = await prisma.entity.findFirst({ where: { name: childName } });
            if (!existingChild) {
              const childGrievance = await prisma.entity.create({
                data: {
                  entity_type_id: grievanceType.entity_type_id,
                  owner_user_id: citizen.user_id,
                  name: childName,
                  area: p.area,
                  location: p.location,
                  status: 'submitted',
                },
              });

              await prisma.auditLog.create({
                data: {
                  entity_id: childGrievance.entity_id,
                  user: 'Rule Engine Automation',
                  role: 'system',
                  action: 'auto_create',
                  old_status: null,
                  new_status: 'submitted',
                  reason: `Auto-created from parent Park Renovation Request #${created.entity_id} approval`,
                },
              });

              console.log(`Seeded Lineage: Park Renovation #${created.entity_id} -> Child Grievance #${childGrievance.entity_id}`);
            }
          }
        }
      }
    }

    console.log('--- Demo Data Cleanup & Seeding Complete ---');
    await prisma.$disconnect();
  } catch (err) {
    console.error('Data cleanup error:', err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

cleanAndSeed();
