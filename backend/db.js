const dns = require('dns');
if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

const { PrismaClient } = require('@prisma/client');

const rawUrl = process.env.DATABASE_URL;
let datasources = undefined;
if (rawUrl) {
  const sep = rawUrl.includes('?') ? '&' : '?';
  const hasPoolParams =
    rawUrl.includes('connect_timeout') ||
    rawUrl.includes('pool_timeout') ||
    rawUrl.includes('connection_limit');
  const tunedUrl = hasPoolParams
    ? rawUrl
    : `${rawUrl}${sep}connect_timeout=30&pool_timeout=30&connection_limit=5`;
  datasources = { db: { url: tunedUrl } };
}

const globalForPrisma = global;

const prisma = globalForPrisma.prisma || new PrismaClient(datasources ? { datasources } : undefined);

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

module.exports = prisma;
