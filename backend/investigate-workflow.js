require('dotenv').config();
const prisma = require('./db');
async function main() {
  // 1. WorkflowMaster rules
  const wf = await prisma.workflowMaster.findMany({ orderBy: [{ entity_type_id: 'asc' }, { workflow_id: 'asc' }] });
  if (!wf.length) {
    console.log('\n[!] NO WorkflowMaster rows — system uses FALLBACK workflow only\n');
  } else {
    console.log('\n=== WorkflowMaster Rules (' + wf.length + ') ===');
    wf.forEach(r => console.log(`  #${r.workflow_id} type=${r.entity_type_id} trigger="${r.trigger}" action="${r.action}" stage="${r.stage}"`));
  }

  // 2. Recent entities with statuses
  const entities = await prisma.entity.findMany({
    take: 10,
    orderBy: { entity_id: 'desc' },
    select: { entity_id: true, name: true, status: true, area: true, entity_type_id: true, owner_user_id: true },
  });
  console.log('\n=== Recent Entities ===');
  entities.forEach(e => console.log(`  #${e.entity_id} type=${e.entity_type_id} status="${e.status}" area="${e.area || 'null'}" owner=${e.owner_user_id}`));

  // 3. Status distribution
  const statusCounts = await prisma.entity.groupBy({ by: ['status'], _count: { entity_id: true } });
  console.log('\n=== Status Distribution ===');
  statusCounts.forEach(s => console.log(`  "${s.status}": ${s._count.entity_id} cases`));

  // 4. Sample AuditLog to verify structure
  const audit = await prisma.auditLog.findMany({ take: 3, orderBy: { datetime: 'desc' } });
  console.log('\n=== Sample Audit Logs ===');
  audit.forEach(a => console.log(`  entity=${a.entity_id} action="${a.action}" ${a.old_status}->${a.new_status} actor=${a.actor_user_id}`));

  // 5. ApprovalHistory sample
  const approval = await prisma.approvalHistory.findMany({ take: 3, orderBy: { created_date: 'desc' } });
  console.log('\n=== Sample Approval History ===');
  approval.forEach(a => console.log(`  entity=${a.entity_id} ${a.from_status}->${a.to_status} actor=${a.actor_user_id} reason="${a.reason || 'none'}"`));
}
main().catch(e => console.error('ERROR:', e.message)).finally(() => process.exit(0));
