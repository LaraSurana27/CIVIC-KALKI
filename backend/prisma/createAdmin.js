/**
 * CIVIC-KALKI — Admin Account Provisioning Script
 * 
 * Usage:
 *   ADMIN_EMAIL=admin@example.com ADMIN_NAME="Admin User" ADMIN_PASSWORD=supersecretpass12 node backend/prisma/createAdmin.js
 * 
 * To promote an existing user:
 *   ADMIN_EMAIL=user@example.com ADMIN_NAME="Admin User" ADMIN_PASSWORD=supersecretpass12 ADMIN_PROMOTE=true node backend/prisma/createAdmin.js
 * 
 * Guardrails:
 * - Reads inputs ONLY from environment variables (no argv, no defaults, nothing hardcoded)
 * - Requires password >= 12 characters
 * - bcrypt cost factor 12
 * - Refuses if email already exists unless ADMIN_PROMOTE=true
 * - Never prints the password or password hash to console/logs
 * - Uses the project's singleton Prisma client from backend/db.js
 */

'use strict';

const bcrypt = require('bcrypt');
const prisma = require('../db');

async function main() {
  const email = process.env.ADMIN_EMAIL ? String(process.env.ADMIN_EMAIL).trim() : '';
  const name = process.env.ADMIN_NAME ? String(process.env.ADMIN_NAME).trim() : '';
  const password = process.env.ADMIN_PASSWORD;
  const allowPromote = process.env.ADMIN_PROMOTE === 'true';

  if (!email || !name || !password) {
    console.error('Error: ADMIN_EMAIL, ADMIN_NAME, and ADMIN_PASSWORD environment variables are required.');
    process.exit(1);
  }

  // Validate email format basic check
  if (!email.includes('@') || !email.includes('.')) {
    console.error('Error: ADMIN_EMAIL must be a valid email address.');
    process.exit(1);
  }

  // Password length enforcement
  if (typeof password !== 'string' || password.length < 12) {
    console.error('Error: ADMIN_PASSWORD must be at least 12 characters long.');
    process.exit(1);
  }

  const normalizedEmail = email.toLowerCase();

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Hash password with bcrypt cost 12
    const passwordHash = await bcrypt.hash(password, 12);

    if (existingUser) {
      if (!allowPromote) {
        console.error(`Error: User with email "${normalizedEmail}" already exists. Set ADMIN_PROMOTE=true to promote this user.`);
        process.exit(1);
      }

      const updated = await prisma.user.update({
        where: { user_id: existingUser.user_id },
        data: {
          role: 'admin',
          name,
          password_hash: passwordHash,
        },
      });

      console.log(`Success: Existing user "${updated.email}" (ID: ${updated.user_id}) promoted to role "admin".`);
      return;
    }

    const created = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name,
        password_hash: passwordHash,
        role: 'admin',
      },
    });

    console.log(`Success: Admin user "${created.email}" (ID: ${created.user_id}) successfully created with role "admin".`);
  } catch (err) {
    console.error(`Error: Failed to create or promote admin: ${err.message}`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
