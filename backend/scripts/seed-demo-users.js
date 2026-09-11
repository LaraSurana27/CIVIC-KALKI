require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function upsertUser({ name, email, password, role, assignedArea }) {
  const passwordHash = await bcrypt.hash(password, 12);

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    const updated = await prisma.user.update({
      where: { user_id: existing.user_id },
      data: {
        name,
        password_hash: passwordHash,
        role,
        assignedArea,
      },
    });
    return updated;
  }

  return prisma.user.create({
    data: {
      name,
      email,
      password_hash: passwordHash,
      role,
      assignedArea,
    },
  });
}

async function main() {
  const users = [
    {
      name: 'Citizen User',
      email: 'citizen@example.com',
      password: 'Password123',
      role: 'citizen',
      assignedArea: null,
    },
    {
      name: 'Area Coordinator',
      email: 'coordinator_area@example.com',
      password: 'Password123',
      role: 'coordinator_area',
      assignedArea: 'Sector 5',
    },
    {
      name: 'General Coordinator',
      email: 'coordinator_general@example.com',
      password: 'Password123',
      role: 'coordinator_general',
      assignedArea: 'Unassigned',
    },
    {
      name: 'Director User',
      email: 'director@example.com',
      password: 'Password123',
      role: 'director',
      assignedArea: null,
    },
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'Password123',
      role: 'admin',
      assignedArea: null,
    },
  ];

  for (const user of users) {
    await upsertUser(user);
  }

  console.log('Demo users seeded successfully.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
