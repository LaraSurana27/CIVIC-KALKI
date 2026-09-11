require('dotenv').config();
const fs = require('fs');
const fetch = global.fetch || require('node-fetch');

(async () => {
  const tokens = JSON.parse(fs.readFileSync('seed-tokens.json', 'utf8'));
  const base = 'http://localhost:3000';

  const citizen = tokens['demo.citizen@example.com'];
  const coordArea = tokens['demo.coord.area@example.com'];
  const director = tokens['demo.director@example.com'];

  console.log('Using tokens for:', citizen.email, coordArea.email, director.email);

  // Create a fresh entity as the citizen
  let res = await fetch(base + '/entities', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${citizen.token}` },
    body: JSON.stringify({ entity_type_id: 1, name: 'Workflow E2E Test', location: 'Bengaluru', area: 'Sector 5', status: 'draft' })
  });
  const created = await res.json();
  console.log('/entities create =>', res.status, created.success ? created.data : created.error);
  const id = created.data.entity_id;

  // 1) citizen: draft -> submitted
  res = await fetch(base + `/entities/${id}/transition`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${citizen.token}` },
    body: JSON.stringify({ to_status: 'submitted' })
  });
  console.log('citizen -> submitted =>', res.status, await res.text());

  // 2) coordinator_area: submitted -> coordinator_approved
  res = await fetch(base + `/entities/${id}/transition`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${coordArea.token}` },
    body: JSON.stringify({ to_status: 'coordinator_approved' })
  });
  console.log('coordinator_area -> coordinator_approved =>', res.status, await res.text());

  // 3) director: coordinator_approved -> approved
  res = await fetch(base + `/entities/${id}/transition`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${director.token}` },
    body: JSON.stringify({ to_status: 'approved' })
  });
  const final = await res.json();
  console.log('director -> approved =>', res.status, final.message);
  if (final.ruleResult) {
    console.log('Rule engine result:', final.ruleResult);
  }
})();
