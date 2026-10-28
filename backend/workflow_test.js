require('dotenv').config();
const fetch = global.fetch || require('node-fetch');
const prisma = require('./db');
const { createTestUser, cleanupAll, trackEntityId } = require('./tests/helpers/authHelper');

(async () => {
  try {
    const base = 'http://localhost:3000';

    const citizen = await createTestUser({ role: 'citizen' });
    const coordArea = await createTestUser({ role: 'coordinator_area', assignedArea: 'Sector 5' });
    const director = await createTestUser({ role: 'director' });

    // Create a fresh entity as the citizen
    let res = await fetch(base + '/entities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...citizen.headers },
      body: JSON.stringify({ entity_type_id: 1, name: 'Workflow E2E Test', location: 'Bengaluru', area: 'Sector 5', status: 'draft' })
    });
    const created = await res.json();
    console.log('/entities create =>', res.status, created.success ? created.data : created.error);
    const id = created.data?.entity_id;
    if (id) trackEntityId(id);

    // 1) citizen: draft -> submitted
    res = await fetch(base + `/entities/${id}/transition`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...citizen.headers },
      body: JSON.stringify({ to_status: 'submitted' })
    });
    console.log('citizen -> submitted =>', res.status, await res.text());

    // 2) coordinator_area: submitted -> coordinator_approved
    res = await fetch(base + `/entities/${id}/transition`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...coordArea.headers },
      body: JSON.stringify({ to_status: 'coordinator_approved' })
    });
    console.log('coordinator_area -> coordinator_approved =>', res.status, await res.text());

    // 3) director: coordinator_approved -> approved
    res = await fetch(base + `/entities/${id}/transition`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...director.headers },
      body: JSON.stringify({ to_status: 'approved' })
    });
    const final = await res.json();
    console.log('director -> approved =>', res.status, final.message);
    if (final.ruleResult) {
      console.log('Rule engine result:', final.ruleResult);
    }
  } finally {
    await cleanupAll();
    await prisma.$disconnect();
  }
})();
