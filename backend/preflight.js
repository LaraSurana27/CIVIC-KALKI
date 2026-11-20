require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function check() {
  console.log('\n=== CIVIC-KALKI Pre-flight Check ===\n');

  // 1. DB connection
  try {
    await p.$connect();
    const result = await p.$queryRaw`SELECT 1 AS ping`;
    console.log('[✓] Database        : Connected to Supabase PostgreSQL');
  } catch (e) {
    console.error('[✗] Database        : FAILED —', e.message);
    process.exit(1);
  }

  // 2. Entity types in DB
  try {
    const count = await p.entityType.count();
    console.log(`[✓] Entity Types     : ${count} types found in DB`);
  } catch (e) {
    console.error('[✗] Entity Types     : FAILED —', e.message);
  }

  // 3. Users in DB
  try {
    const count = await p.user.count();
    console.log(`[✓] Users            : ${count} users in DB`);
  } catch (e) {
    console.error('[✗] Users            : FAILED —', e.message);
  }

  // 4. Legal RAG self-test
  try {
    const { retrieveLegalContext } = require('./services/legalRag');
    const result = retrieveLegalContext('civic rights equality data protection');
    if (result.passages.length > 0) {
      console.log(`[✓] Legal RAG        : ${result.passages.length} passage(s) retrieved for test query`);
      result.passages.forEach(p => console.log(`    - ${p.source_title} | ${p.section}`));
    } else {
      console.log('[~] Legal RAG        : No passages matched test query (corpus loaded OK)');
    }
  } catch (e) {
    console.error('[✗] Legal RAG        : FAILED —', e.message);
  }

  // 5. Coordinator AI module load
  try {
    const { generateCoordinatorAnalysis } = require('./services/coordinatorAI');
    console.log('[✓] Coordinator AI   : Module loaded OK');
  } catch (e) {
    console.error('[✗] Coordinator AI   : FAILED —', e.message);
  }

  // 6. Groq key status
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey && groqKey.trim()) {
    console.log('[✓] GROQ_API_KEY     : Configured (Groq AI analysis enabled)');
  } else {
    console.log('[~] GROQ_API_KEY     : NOT SET — Coordinator AI will use graceful preview fallback');
    console.log('    Get a free key at: https://console.groq.com/keys');
    console.log('    Add GROQ_API_KEY=<key> and GROQ_MODEL=llama-3.3-70b-versatile to backend/.env');
  }

  // 7. Gemini key status
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey && geminiKey.trim()) {
    console.log('[✓] GEMINI_API_KEY   : Configured (entity AI analysis enabled)');
  } else {
    console.log('[~] GEMINI_API_KEY   : NOT SET — entity AI analysis will use preview fallback');
  }

  // 8. JWT secret
  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret && jwtSecret.trim()) {
    console.log('[✓] JWT_SECRET       : Configured');
  } else {
    console.error('[✗] JWT_SECRET       : NOT SET — auth will fail');
  }

  console.log('\n=== All checks complete. Starting servers... ===\n');
  await p.$disconnect();
}

check().catch(e => { console.error('Pre-flight error:', e.message); process.exit(1); });
