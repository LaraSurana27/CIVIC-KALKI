/**
 * CIVIC-KALKI — Governance Intelligence Service
 *
 * Metadata-driven governance analysis engine.
 * - Reads exception rules from ReportMaster (Governance Exception Config) at runtime
 * - Reads stakeholder templates from DashboardMaster
 * - Detects exceptions deterministically from real Entity / ParameterValue / AuditLog data
 * - Summarizes via Gemini AI (with retry-on-parse-failure pattern from aiSuggestion.js)
 * - Falls back to DETERMINISTIC_ONLY mode if API key missing or call fails
 * - Logs every run to AIExecutionLog (entity_id=null, analysis_type='governance')
 *
 * SIMULATION DISCLAIMER: All observation labels use approved governance language only.
 * No accusations, guilt, or real-institution references generated.
 */

'use strict';

const prisma = require('../db');

// -- Default fallback thresholds (used ONLY if no config row found in DB) --
const DEFAULT_STALE_DAYS = 7;

// -- Approved simulation labels --
const LABELS = {
  OBSERVATION_STALE:    'potential control gap - unverified transaction aged beyond threshold',
  OBSERVATION_RECON:    'anomaly requiring verification - unresolved reconciliation in post-verification stage',
  OBSERVATION_NOACT:    'governance attention required - no workflow activity recorded since creation',
  OBSERVATION_FAILED:   'possible process weakness - verification failure recorded',
  OBSERVATION_MISMATCH: 'governance attention required - parameter state inconsistent with workflow stage',
  OBSERVATION_ACTOR:    'governance attention required - status transition recorded without identified actor',
};

// ====================================================================
// 1. CONFIG LOADERS
// ====================================================================

async function loadGovernanceConfig(entityTypeId) {
  const configReport = await prisma.reportMaster.findFirst({
    where: { entity_type_id: entityTypeId, report_name: 'Governance Exception Config' },
  });
  if (!configReport || !configReport.filters) return null;
  try { return JSON.parse(configReport.filters); } catch { return null; }
}

async function loadStakeholderConfig(entityTypeId) {
  const widget = await prisma.dashboardMaster.findFirst({
    where: { entity_type_id: entityTypeId, widget_name: 'governance_stakeholder_config' },
  });
  if (!widget || !widget.filter) return [];
  try {
    const parsed = JSON.parse(widget.filter);
    return parsed.stakeholders || [];
  } catch { return []; }
}

// ====================================================================
// 2. DATA FETCHER
// ====================================================================

async function fetchEntities(entityTypeId) {
  return prisma.entity.findMany({
    where: { entity_type_id: entityTypeId, status: { not: 'deleted' } },
    include: {
      parameterValues: {
        include: { parameterMaster: { select: { field_key: true, label: true } } },
      },
      auditLogs: { orderBy: { datetime: 'asc' } },
    },
  });
}

function getParams(entity) {
  const map = {};
  for (const pv of entity.parameterValues) {
    if (pv.parameterMaster?.field_key) map[pv.parameterMaster.field_key] = pv.value;
  }
  return map;
}

function daysSince(date) {
  if (!date) return 0;
  return Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
}

function firstAuditDate(entity) {
  if (!entity.auditLogs || entity.auditLogs.length === 0) return null;
  return entity.auditLogs[0].datetime;
}

function enteredCurrentStageDate(entity) {
  const transitions = (entity.auditLogs || []).filter(
    (l) => l.action === 'status_transition' && l.new_status === entity.status
  );
  if (transitions.length === 0) return firstAuditDate(entity);
  return transitions[transitions.length - 1].datetime;
}

// ====================================================================
// 3. DETERMINISTIC EXCEPTION DETECTION (6 rules)
// ====================================================================

function detectExceptions(entities, config) {
  const exceptions = [];
  const staleDays = config?.exception_rules?.find((r) => r.rule_id === 'VERIFICATION_STALE_7_DAYS')
    ?.threshold_days ?? DEFAULT_STALE_DAYS;
  const stateSyncRules = config?.state_sync_rules || {};
  const systemActions = config?.system_action_patterns || ['auto_created','system_init','seed_created','seed'];

  for (const entity of entities) {
    const params = getParams(entity);
    const verStatus = params['verification_status'];
    const reconStatus = params['reconciliation_status'];
    const id = entity.entity_id;
    const name = entity.name;
    const stage = entity.status;

    // Rule 1: VERIFICATION_STALE_7_DAYS
    if (verStatus === 'Pending') {
      const enteredDate = enteredCurrentStageDate(entity);
      const age = daysSince(enteredDate);
      if (age > staleDays) {
        exceptions.push({
          observation: LABELS.OBSERVATION_STALE,
          evidence: `Entity #${id} (${name}): verification_status=Pending, aged ${age} days (threshold: ${staleDays} days). Stage entered: ${enteredDate ? new Date(enteredDate).toISOString().slice(0,10) : 'unknown'}`,
          trigger_rule: 'VERIFICATION_STALE_7_DAYS',
          possible_cause: 'Verifier may not have been assigned, or the verification task may have been overlooked in the queue',
          recommendation: 'Assign a verifier immediately; complete verification or mark as Failed within 48 hours to maintain audit integrity',
          requires_human_review: true,
          analysis_mode: 'DETERMINISTIC',
        });
      }
    }

    // Rule 2: VERIFICATION_FAILED
    if (verStatus === 'Failed') {
      exceptions.push({
        observation: LABELS.OBSERVATION_FAILED,
        evidence: `Entity #${id} (${name}): verification_status=Failed, workflow stage=${stage}`,
        trigger_rule: 'VERIFICATION_FAILED',
        possible_cause: 'Verification could not be completed due to missing documentation, mismatched amounts, or process non-compliance',
        recommendation: 'Initiate a review of the failed verification; document root cause; resubmit or escalate to oversight authority',
        requires_human_review: true,
        analysis_mode: 'DETERMINISTIC',
      });
    }

    // Rule 3: WORKFLOW_STALE_NO_ACTIVITY
    if (stage === 'recorded') {
      const transitions = (entity.auditLogs || []).filter((l) => l.action === 'status_transition');
      if (transitions.length === 0) {
        const enteredDate = firstAuditDate(entity);
        const age = daysSince(enteredDate);
        exceptions.push({
          observation: LABELS.OBSERVATION_NOACT,
          evidence: `Entity #${id} (${name}): status=recorded, zero status_transition entries in AuditLog, aged ${age} days`,
          trigger_rule: 'WORKFLOW_STALE_NO_ACTIVITY',
          possible_cause: 'Transaction may not have been assigned to a verifier, or the workflow was not triggered after recording',
          recommendation: 'Verify that a coordinator has been assigned and that the workflow transition to verified has been initiated',
          requires_human_review: true,
          analysis_mode: 'DETERMINISTIC',
        });
      }
    }

    // Rule 4: RECONCILIATION_UNRESOLVED (only flag post-verified stages)
    if (reconStatus === 'Unresolved') {
      const notInStages = config?.exception_rules?.find((r) => r.rule_id === 'RECONCILIATION_UNRESOLVED')
        ?.not_in_stages ?? ['recorded','verified'];
      if (!notInStages.includes(stage)) {
        exceptions.push({
          observation: LABELS.OBSERVATION_RECON,
          evidence: `Entity #${id} (${name}): reconciliation_status=Unresolved, workflow stage=${stage} (expected Reconciled at this stage)`,
          trigger_rule: 'RECONCILIATION_UNRESOLVED',
          possible_cause: 'Bank reconciliation may not have been performed, or reconciliation_status was not updated after bank confirmation',
          recommendation: 'Perform bank reconciliation and update reconciliation_status to Reconciled or Exception as appropriate',
          requires_human_review: true,
          analysis_mode: 'DETERMINISTIC',
        });
      }
    }

    // Rule 5: STATE_PARAMETER_MISMATCH
    const expectedParams = stateSyncRules[stage];
    if (expectedParams) {
      for (const [fieldKey, allowedValues] of Object.entries(expectedParams)) {
        const actual = params[fieldKey];
        if (actual !== undefined && actual !== null && actual !== '' && !allowedValues.includes(actual)) {
          exceptions.push({
            observation: LABELS.OBSERVATION_MISMATCH,
            evidence: `Entity #${id} (${name}): workflow_stage=${stage}, ${fieldKey}=${actual} (expected one of: ${allowedValues.join(', ')})`,
            trigger_rule: 'STATE_PARAMETER_MISMATCH',
            possible_cause: 'The parameter value may not have been updated when the workflow stage transitioned, creating an inconsistent record',
            recommendation: `Update ${fieldKey} to a value consistent with the current workflow stage (${stage}), or investigate whether the workflow transition itself was premature`,
            requires_human_review: true,
            analysis_mode: 'DETERMINISTIC',
          });
        }
      }
    }

    // Rule 6: HUMAN_TRANSITION_NO_ACTOR
    // System actions (seed, auto_created) are NOT flagged - they legitimately have no human actor
    const humanTransitionsNoActor = (entity.auditLogs || []).filter((l) => {
      if (l.action !== 'status_transition') return false;
      if (l.actor_user_id !== null) return false;
      // Exclude system actions by user field prefix
      if (l.user && l.user.startsWith('system/')) return false;
      if (l.user && systemActions.some((s) => l.user.includes(s))) return false;
      return true;
    });
    for (const log of humanTransitionsNoActor) {
      exceptions.push({
        observation: LABELS.OBSERVATION_ACTOR,
        evidence: `Entity #${id} (${name}): AuditLog (audit_id=${log.audit_id}), action=status_transition, ${log.old_status}->${log.new_status}, actor_user_id=null, user="${log.user || 'none'}"`,
        trigger_rule: 'HUMAN_TRANSITION_NO_ACTOR',
        possible_cause: 'Workflow transition may have been executed outside the standard process, or the actor identity was not captured at transition time',
        recommendation: 'Investigate the transition event; ensure all future status transitions are performed via the authenticated workflow interface',
        requires_human_review: true,
        analysis_mode: 'DETERMINISTIC',
      });
    }
  }

  return exceptions;
}

// ====================================================================
// 4. METRICS (all from real entity + parameterValue data)
// ====================================================================

function computeMetrics(entities) {
  let verifiedCount = 0, failedVerificationCount = 0, pendingVerificationCount = 0;
  let reconciledCount = 0, unresolvedReconciliationCount = 0, closedCount = 0;
  for (const entity of entities) {
    const p = getParams(entity);
    if (entity.status === 'closed') closedCount++;
    if (p.verification_status === 'Verified') verifiedCount++;
    else if (p.verification_status === 'Failed') failedVerificationCount++;
    else if (p.verification_status === 'Pending') pendingVerificationCount++;
    if (p.reconciliation_status === 'Reconciled' || p.reconciliation_status === 'Closed') reconciledCount++;
    else if (p.reconciliation_status === 'Unresolved') unresolvedReconciliationCount++;
  }
  return {
    total_transactions: entities.length,
    verified_count: verifiedCount,
    failed_verification_count: failedVerificationCount,
    pending_verification_count: pendingVerificationCount,
    reconciled_count: reconciledCount,
    unresolved_reconciliation_count: unresolvedReconciliationCount,
    closed_count: closedCount,
    data_complete: true,
  };
}

// ====================================================================
// 5. PROCESS HEALTH PIPELINE
// ====================================================================

function computeProcessHealth(entities, exceptions, config) {
  const stages = config?.workflow_stages || ['recorded','verified','reconciled','audited','closed'];
  const STAGE_LABELS = { recorded:'Recorded', verified:'Verified', reconciled:'Reconciled', audited:'Audited', closed:'Closed' };

  const exceptionEntityIds = new Set();
  for (const ex of exceptions) {
    const m = ex.evidence.match(/Entity #(\d+)/);
    if (m) exceptionEntityIds.add(Number(m[1]));
  }

  const pipeline = stages.map((stage) => {
    const stageEntities = entities.filter((e) => e.status === stage);
    const count = stageEntities.length;
    const exceptionCount = stageEntities.filter((e) => exceptionEntityIds.has(e.entity_id)).length;
    let totalDays = 0, withDates = 0;
    for (const entity of stageEntities) {
      const d = enteredCurrentStageDate(entity);
      if (d) { totalDays += daysSince(d); withDates++; }
    }
    return {
      stage,
      label: STAGE_LABELS[stage] || stage,
      count,
      exception_count: exceptionCount,
      avg_days_in_stage: withDates > 0 ? Math.round((totalDays / withDates) * 10) / 10 : null,
    };
  });

  return {
    pipeline,
    total_in_pipeline: entities.length,
    pipeline_exception_total: pipeline.reduce((s, p) => s + p.exception_count, 0),
  };
}

// ====================================================================
// 6. STAKEHOLDER INTELLIGENCE
// ====================================================================

function enrichStakeholders(templates, metrics, exceptions) {
  return templates.map((s) => {
    let evidence = '';
    if (s.relevant_process?.includes('Verification')) {
      evidence = `${metrics.failed_verification_count} failed verification(s), ${metrics.pending_verification_count} pending verification(s) across ${metrics.total_transactions} transactions`;
    } else if (s.relevant_process?.includes('pipeline audit') || s.relevant_process?.includes('recorded')) {
      const staleCount = exceptions.filter((e) => e.trigger_rule === 'WORKFLOW_STALE_NO_ACTIVITY' || e.trigger_rule === 'VERIFICATION_STALE_7_DAYS').length;
      evidence = `${staleCount} stale/inactive transaction(s) detected in current governance scan`;
    } else if (s.relevant_process?.includes('Reconciliation')) {
      evidence = `${metrics.unresolved_reconciliation_count} unresolved reconciliation(s) in post-verification stages`;
    } else {
      evidence = `${exceptions.length} total governance exception(s) across ${metrics.total_transactions} transactions`;
    }
    return { stakeholder: s.stakeholder, interest: s.interest, concern: s.concern, relevant_process: s.relevant_process, evidence, analysis_mode: 'DETERMINISTIC' };
  });
}

// ====================================================================
// 7. AI SUMMARIZATION (Gemini, mirror of aiSuggestion.js pattern)
// ====================================================================

function cleanJsonResponseText(text) {
  let c = text.trim();
  if (c.startsWith('```json')) c = c.slice(7);
  else if (c.startsWith('```')) c = c.slice(3);
  if (c.endsWith('```')) c = c.slice(0, -3);
  return c.trim();
}

async function callGeminiGovernance(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const result = await model.generateContent(prompt);
        const raw = result.response.text();
        return JSON.parse(cleanJsonResponseText(raw));
      } catch (err) {
        if (attempt === 2) return null;
      }
    }
  } catch { return null; }
  return null;
}

function buildAIPrompt(metrics, processHealth, exceptions, entityTypeName) {
  return `You are a governance analysis assistant. You ONLY summarize and explain facts provided to you.
You do NOT invent new findings, make accusations, or draw conclusions about real individuals or institutions.
All data is from a simulation. Use only approved labels: "potential control gap", "anomaly requiring verification", "governance attention required", "possible process weakness".

Return ONLY valid JSON in this exact structure:
{
  "process_health_narrative": "<2-3 sentence plain-language summary of the pipeline status>",
  "risk_narrative": "<2-3 sentence explanation of the main risk areas from the exception list>",
  "recommendations": ["<recommendation 1>", "<recommendation 2>", "<recommendation 3>"]
}

METRICS:
${JSON.stringify(metrics, null, 2)}

PIPELINE HEALTH:
${JSON.stringify(processHealth.pipeline, null, 2)}

EXCEPTIONS (${exceptions.length} total, generated by deterministic rules):
${JSON.stringify(exceptions.map((e) => ({ rule: e.trigger_rule, observation: e.observation, evidence: e.evidence })), null, 2)}

Entity Type: ${entityTypeName}

Return only the JSON object.`;
}

// ====================================================================
// 8. AUDIT LOG
// ====================================================================

async function logToAIExecutionLog(prompt, responseData, status, errorMsg, requestedByUserId) {
  try {
    const log = await prisma.aIExecutionLog.create({
      data: {
        entity_id: null,
        requested_by_user_id: requestedByUserId || null,
        provider: 'gemini',
        model: 'gemini-1.5-flash',
        prompt: prompt ? String(prompt).slice(0, 2000) : null,
        response: responseData ? JSON.stringify(responseData).slice(0, 4000) : null,
        status: status || 'completed',
        error_message: errorMsg || null,
        analysis_type: 'governance',
      },
    });
    return log.ai_execution_log_id;
  } catch (err) {
    console.error('[GovernanceIntelligence] Failed to write AIExecutionLog:', err.message);
    return null;
  }
}

// ====================================================================
// 9. MAIN ENTRY POINT
// ====================================================================

async function generateGovernanceIntelligence(entityTypeId, requestedByUserId = null) {
  const startedAt = new Date().toISOString();

  const config = await loadGovernanceConfig(entityTypeId);
  const stakeholderTemplates = await loadStakeholderConfig(entityTypeId);

  const entityType = await prisma.entityType.findUnique({ where: { entity_type_id: entityTypeId } });
  const entityTypeName = entityType?.name || 'Unknown';

  const entities = await fetchEntities(entityTypeId);

  if (entities.length === 0) {
    return {
      success: true,
      data: {
        analysis_mode: 'DETERMINISTIC_ONLY',
        entity_type_name: entityTypeName,
        analyzed_at: startedAt,
        scope: { type: 'entityType', id: entityTypeId },
        log_id: null,
        summary_metrics: { total_transactions: 0, data_complete: true },
        process_health: { pipeline: [], total_in_pipeline: 0, pipeline_exception_total: 0 },
        exceptions: [],
        stakeholder_intelligence: [],
        ai_summary: null,
        warning: 'No entities found. Seed data may be required.',
      },
    };
  }

  const exceptions = detectExceptions(entities, config);
  const metrics = computeMetrics(entities);
  metrics.total_exception_count = exceptions.length;
  const processHealth = computeProcessHealth(entities, exceptions, config);
  const stakeholderIntelligence = enrichStakeholders(stakeholderTemplates, metrics, exceptions);

  const prompt = buildAIPrompt(metrics, processHealth, exceptions, entityTypeName);
  let aiSummary = null;
  let analysisMode = 'DETERMINISTIC_ONLY';
  let logStatus = 'completed';
  let logError = null;

  const aiResponse = await callGeminiGovernance(prompt);
  if (aiResponse) {
    aiSummary = { ...aiResponse, analysis_mode: 'AI' };
    analysisMode = 'AI_ASSISTED';
  } else {
    logStatus = process.env.GEMINI_API_KEY ? 'ai_failed' : 'no_api_key';
    logError = process.env.GEMINI_API_KEY
      ? 'Gemini call failed after 2 attempts; DETERMINISTIC_ONLY mode active'
      : 'GEMINI_API_KEY not set; DETERMINISTIC_ONLY mode active';
  }

  const logId = await logToAIExecutionLog(prompt, { metrics, exceptions_count: exceptions.length, ai_mode: analysisMode }, logStatus, logError, requestedByUserId);

  return {
    success: true,
    data: {
      analysis_mode: analysisMode,
      entity_type_name: entityTypeName,
      analyzed_at: startedAt,
      scope: { type: 'entityType', id: entityTypeId },
      log_id: logId,
      summary_metrics: metrics,
      process_health: processHealth,
      exceptions,
      stakeholder_intelligence: stakeholderIntelligence,
      ai_summary: aiSummary,
    },
  };
}

module.exports = { generateGovernanceIntelligence };
