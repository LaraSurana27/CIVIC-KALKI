/**
 * Form Engine integration test script.
 * Creates two forms (Movement + Grievance) via the REST API,
 * then fetches and prints the full nested schema for each.
 * Run: node scratch/test_form_engine.js
 */

const http = require('http');

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    };
    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (!parsed.success) reject(new Error(`API error on ${method} ${path}: ${parsed.error}`));
          else resolve(parsed.data);
        } catch (e) {
          reject(new Error(`Parse error: ${data}`));
        }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function run() {
  console.log('=== Creating Form 1: Movement Registration Form ===');

  // ── Form 1: Movement ──────────────────────────────────────────────────────
  const form1 = await request('POST', '/forms', {
    entity_type_id: 1,
    form_name: 'Movement Registration Form',
    version: '1.0',
    status: 'active',
  });
  console.log(`  form_id=${form1.form_id}`);

  // Sections
  const sec1 = await request('POST', `/forms/${form1.form_id}/sections`, {
    section_name: 'Basic Information', display_order: 1,
  });
  const sec2 = await request('POST', `/forms/${form1.form_id}/sections`, {
    section_name: 'Location Details', display_order: 2,
  });
  console.log(`  sections: ${sec1.section_id}, ${sec2.section_id}`);

  // Subsections
  const sub11 = await request('POST', `/sections/${sec1.section_id}/subsections`, { subsection_name: 'Identity' });
  const sub12 = await request('POST', `/sections/${sec1.section_id}/subsections`, { subsection_name: 'Contact' });
  const sub21 = await request('POST', `/sections/${sec2.section_id}/subsections`, { subsection_name: 'Address' });
  console.log(`  subsections: ${sub11.subsection_id}, ${sub12.subsection_id}, ${sub21.subsection_id}`);

  // Parameters — sub1.1 Identity (2 params)
  await request('POST', `/subsections/${sub11.subsection_id}/parameters`, {
    category_id: 1, field_type: 'text', control_type: 'input', mandatory: true, validation_rule: 'required|max:100',
  });
  await request('POST', `/subsections/${sub11.subsection_id}/parameters`, {
    category_id: 1, field_type: 'date', control_type: 'datepicker', mandatory: true, validation_rule: 'required|date',
  });
  // Parameters — sub1.2 Contact (1 param)
  await request('POST', `/subsections/${sub12.subsection_id}/parameters`, {
    category_id: 1, field_type: 'text', control_type: 'input', mandatory: false, validation_rule: 'email',
  });
  // Parameters — sub2.1 Address (2 params)
  await request('POST', `/subsections/${sub21.subsection_id}/parameters`, {
    category_id: 1, field_type: 'text', control_type: 'textarea', mandatory: true, validation_rule: 'required',
  });
  await request('POST', `/subsections/${sub21.subsection_id}/parameters`, {
    category_id: 1, field_type: 'select', control_type: 'dropdown', mandatory: false, validation_rule: null,
  });
  console.log('  parameters created\n');

  // ── Form 2: Grievance ─────────────────────────────────────────────────────
  console.log('=== Creating Form 2: Grievance Submission Form ===');

  const form2 = await request('POST', '/forms', {
    entity_type_id: 2,
    form_name: 'Grievance Submission Form',
    version: '1.0',
    status: 'active',
  });
  console.log(`  form_id=${form2.form_id}`);

  const sec3 = await request('POST', `/forms/${form2.form_id}/sections`, {
    section_name: 'Grievance Details', display_order: 1,
  });
  const sec4 = await request('POST', `/forms/${form2.form_id}/sections`, {
    section_name: 'Supporting Evidence', display_order: 2,
  });
  console.log(`  sections: ${sec3.section_id}, ${sec4.section_id}`);

  const sub31 = await request('POST', `/sections/${sec3.section_id}/subsections`, { subsection_name: 'Complaint' });
  const sub41 = await request('POST', `/sections/${sec4.section_id}/subsections`, { subsection_name: 'Documents' });
  const sub42 = await request('POST', `/sections/${sec4.section_id}/subsections`, { subsection_name: 'Timeline' });
  console.log(`  subsections: ${sub31.subsection_id}, ${sub41.subsection_id}, ${sub42.subsection_id}`);

  // Parameters — sub3.1 Complaint (3 params)
  await request('POST', `/subsections/${sub31.subsection_id}/parameters`, {
    category_id: 1, field_type: 'textarea', control_type: 'richtext', mandatory: true, validation_rule: 'required|min:20',
  });
  await request('POST', `/subsections/${sub31.subsection_id}/parameters`, {
    category_id: 1, field_type: 'select', control_type: 'dropdown', mandatory: true, validation_rule: 'required',
  });
  await request('POST', `/subsections/${sub31.subsection_id}/parameters`, {
    category_id: 1, field_type: 'text', control_type: 'input', mandatory: false, validation_rule: null,
  });
  // Parameters — sub4.1 Documents (2 params)
  await request('POST', `/subsections/${sub41.subsection_id}/parameters`, {
    category_id: 1, field_type: 'file', control_type: 'fileupload', mandatory: false, validation_rule: 'mimes:pdf,jpg|max:5120',
  });
  await request('POST', `/subsections/${sub41.subsection_id}/parameters`, {
    category_id: 1, field_type: 'file', control_type: 'fileupload', mandatory: false, validation_rule: 'mimes:pdf|max:2048',
  });
  // Parameters — sub4.2 Timeline (2 params)
  await request('POST', `/subsections/${sub42.subsection_id}/parameters`, {
    category_id: 1, field_type: 'date', control_type: 'datepicker', mandatory: true, validation_rule: 'required|date',
  });
  await request('POST', `/subsections/${sub42.subsection_id}/parameters`, {
    category_id: 1, field_type: 'textarea', control_type: 'textarea', mandatory: false, validation_rule: null,
  });
  console.log('  parameters created\n');

  // ── Fetch and display schemas ─────────────────────────────────────────────
  console.log('=== GET /forms/schema for both forms ===\n');

  const schema1 = await request('GET', `/forms/${form1.form_id}/schema`);
  console.log('--- Movement Form Schema ---');
  console.log(JSON.stringify(schema1, null, 2));

  const schema2 = await request('GET', `/forms/${form2.form_id}/schema`);
  console.log('\n--- Grievance Form Schema ---');
  console.log(JSON.stringify(schema2, null, 2));
}

run().catch((e) => {
  console.error('Test failed:', e.message);
  process.exit(1);
});
