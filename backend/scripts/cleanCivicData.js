const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanData() {
  console.log('--- Cleaning Civic KALKI Database Records ---');

  // Specific items called out by the user:
  // 1. abcdasd (id: 639)
  await prisma.entity.updateMany({
    where: { entity_id: 639 },
    data: {
      name: 'Pothole and damaged asphalt near Karve Statue',
      area: 'Karve Road, Shivajinagar',
      status: 'coordinator_approved'
    }
  });

  // 2. Automated Test: Riverfront Cleanup (id: 764)
  await prisma.entity.updateMany({
    where: { entity_id: 764 },
    data: {
      name: 'Mutha Riverfront Community Cleanup',
      area: 'Aundh Riverfront, Pune',
      status: 'approved'
    }
  });

  // 3. Seeded Movement (id: 638)
  await prisma.entity.updateMany({
    where: { entity_id: 638 },
    data: {
      name: 'Shivajinagar Tree Plantation & Clean Air Drive',
      area: 'Ward 14 · Shivajinagar',
      status: 'approved'
    }
  });

  // 4. Two cards titled Sanitation Grievance (id: 1204 & 1207)
  await prisma.entity.updateMany({
    where: { entity_id: 1204 },
    data: {
      name: 'Garbage not collected near FC Road',
      area: 'FC Road, Shivajinagar',
      status: 'coordinator_approved'
    }
  });

  await prisma.entity.updateMany({
    where: { entity_id: 1207 },
    data: {
      name: 'Overflowing community waste bin on JM Road',
      area: 'JM Road, Shivajinagar',
      status: 'coordinator_approved'
    }
  });

  // 5. Early test items (1, 2, 3, 8, 9, 1346, 1347)
  await prisma.entity.updateMany({
    where: { entity_id: 1 },
    data: {
      name: 'Kothrud Green Corridor Tree Plantation',
      area: 'Ward 9 · Kothrud',
      status: 'approved'
    }
  });

  await prisma.entity.updateMany({
    where: { entity_id: 2 },
    data: {
      name: 'Baner Sector 4 Waste Segregation Drive',
      area: 'Ward 2 · Baner',
      status: 'coordinator_approved'
    }
  });

  await prisma.entity.updateMany({
    where: { entity_id: 3 },
    data: {
      name: 'Model Colony Park Solar Lighting Audit',
      area: 'Ward 11 · Model Colony',
      status: 'coordinator_approved'
    }
  });

  await prisma.entity.updateMany({
    where: { entity_id: 8 },
    data: {
      name: 'FC Road Pedestrian Safety & Crossings',
      area: 'Ward 14 · Shivajinagar',
      status: 'approved'
    }
  });

  await prisma.entity.updateMany({
    where: { entity_id: 9 },
    data: {
      name: 'Clean water pipeline leak repair',
      area: 'Senapati Bapat Road, Pune',
      status: 'submitted'
    }
  });

  await prisma.entity.updateMany({
    where: { entity_id: 1346 },
    data: {
      name: 'Broken streetlight on Law College Road',
      area: 'Law College Road, Shivajinagar',
      status: 'approved'
    }
  });

  await prisma.entity.updateMany({
    where: { entity_id: 1347 },
    data: {
      name: 'Shivaji Park Restoration & Tree Canopy',
      area: 'Ward 14 · Shivajinagar',
      status: 'approved'
    }
  });

  // Update remaining repetitive Movement A / Grievance B items if any
  const remainingGeneric = await prisma.entity.findMany({
    where: {
      OR: [
        { name: { contains: 'Movement A' } },
        { name: { contains: 'Grievance B' } },
        { name: { contains: 'Citizen Submission' } }
      ]
    }
  });

  const realTitles = [
    { name: 'Deccan Gymkhana Pothole Patching', area: 'Deccan Gymkhana, Pune' },
    { name: 'Viman Nagar Community Composting Drive', area: 'Viman Nagar, Pune' },
    { name: 'Aundh Road Median Safety Greening', area: 'Aundh, Pune' },
    { name: 'Kalyani Nagar Public Park Benches & Paths', area: 'Kalyani Nagar, Pune' },
    { name: 'Bavdhan Clean Water Pipeline Maintenance', area: 'Bavdhan, Pune' },
    { name: 'Prabhat Road Pedestrian Light Repair', area: 'Prabhat Road, Pune' }
  ];

  for (let i = 0; i < remainingGeneric.length; i++) {
    const t = realTitles[i % realTitles.length];
    await prisma.entity.update({
      where: { entity_id: remainingGeneric[i].entity_id },
      data: {
        name: t.name,
        area: t.area,
        status: 'coordinator_approved'
      }
    });
  }

  // Also clean up any test pandals to realistic Pune festival permits
  const testPandals = await prisma.entity.findMany({
    where: {
      OR: [
        { name: { contains: 'FSM Test Pandal' } },
        { name: { contains: 'Aggregation Test Pandal' } }
      ]
    }
  });

  const festivalTitles = [
    'Keshav Nagar Sarvajanik Ganeshotsav Pandal',
    'Shivaji Nagar Community Navratri Mandal',
    'Tilak Road Cultural Stage & Procession Permit',
    'Model Colony Spring Cleanliness & Music Clearance',
    'Deccan Youth Sports Festival Pandal'
  ];

  for (let i = 0; i < testPandals.length; i++) {
    const fTitle = festivalTitles[i % festivalTitles.length];
    await prisma.entity.update({
      where: { entity_id: testPandals[i].entity_id },
      data: {
        name: `${fTitle} #${testPandals[i].entity_id}`,
        area: 'Ward 14 · Shivajinagar',
        status: testPandals[i].status === 'draft' ? 'submitted' : testPandals[i].status
      }
    });
  }

  console.log('✓ Successfully sanitized all dirty and test records in database!');
}

cleanData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

