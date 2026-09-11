/* Seed script: creates demo users and outputs JWTs to seed-tokens.json

Run: node seed.js
*/

require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function upsertUser({ name, email, password, role, assignedArea = null }) {
  const password_hash = await bcrypt.hash(password, 12);
  const u = await prisma.user.upsert({
    where: { email },
    update: { name, password_hash, role, assignedArea },
    create: { name, email, password_hash, role, assignedArea },
  });
  return u;
}

function signTokenFor(user) {
  return jwt.sign(
    {
      user_id: user.user_id,
      name: user.name,
      role: user.role,
      assigned_area: user.assignedArea || null,
    },
    process.env.JWT_SECRET || 'development-secret-change-me',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
}

(async () => {
  try {
    const users = [
      { name: 'Demo Citizen', email: 'demo.citizen@example.com', password: 'Password123', role: 'citizen' },
      { name: 'Demo Coordinator Area', email: 'demo.coord.area@example.com', password: 'Password123', role: 'coordinator_area', assignedArea: 'Sector 5' },
      { name: 'Demo Coordinator General', email: 'demo.coord.general@example.com', password: 'Password123', role: 'coordinator_general' },
      { name: 'Demo Director', email: 'demo.director@example.com', password: 'Password123', role: 'director' },
      { name: 'Demo Admin', email: 'demo.admin@example.com', password: 'Password123', role: 'admin' },
    ];

    const created = {};
    for (const u of users) {
      const user = await upsertUser(u);
      created[u.email] = {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
        assignedArea: user.assignedArea || null,
        token: signTokenFor(user),
      };
    }

    fs.writeFileSync('seed-tokens.json', JSON.stringify(created, null, 2));
    console.log('Seed complete. Tokens written to seed-tokens.json');

    // Optionally create an entity for the demo citizen
    const citizen = await prisma.user.findUnique({ where: { email: 'demo.citizen@example.com' } });
    const entity = await prisma.entity.create({
      data: {
        entity_type_id: 1,
        owner_user_id: citizen.user_id,
        name: 'Seeded Movement',
        location: 'Bengaluru',
        area: 'Sector 5',
        status: 'draft',
      }
    });

    console.log('Created demo entity id=', entity.entity_id);

    await prisma.$disconnect();
  } catch (err) {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  }
})();
