/**
 * CIVIC-KALKI — AI Suggestion & Decision Intelligence Layer
 * Generates structured decision analysis for Directors/Admins reviewing entities.
 */

const prisma = require('../db');

/**
 * Clean raw model response by removing markdown code block fences if present.
 * @param {string} text
 * @returns {string}
 */
function cleanJsonResponseText(text) {
  if (!text) return '';
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

/**
 * Validate that parsed object contains the expected 5 sections.
 * @param {any} data
 * @returns {boolean}
 */
function isValidReportSchema(data) {
  if (!data || typeof data !== 'object') return false;
  const { problem_summary, root_cause_analysis, stakeholder_analysis, risk_register, recommendation } = data;
  return (
    typeof problem_summary === 'string' &&
    Array.isArray(root_cause_analysis) &&
    Array.isArray(stakeholder_analysis) &&
    Array.isArray(risk_register) &&
    Array.isArray(recommendation)
  );
}

/**
 * Generate Intelligence Report for a given entity ID.
 * @param {number} entityId
 * @param {number|null} requestedByUserId
 * @returns {Promise<{ report: object, logId: number }>}
 */
async function generateIntelligenceReport(entityId, requestedByUserId = null) {
  // 1. Fetch Entity with Type and Parameter Values
  const entity = await prisma.entity.findUnique({
    where: { entity_id: Number(entityId) },
    include: {
      entityType: true,
      owner: { select: { name: true, email: true } },
      parameterValues: {
        include: {
          parameterMaster: {
            select: {
              field_key: true,
              label: true,
              field_type: true,
            },
          },
        },
      },
    },
  });

  if (!entity) {
    const err = new Error(`Entity with ID ${entityId} was not found.`);
    err.statusCode = 404;
    throw err;
  }

  // Build field/value metadata context
  const fieldSummaries = entity.parameterValues.map((pv) => {
    const label = pv.parameterMaster?.label || pv.parameterMaster?.field_key || `Param #${pv.parameter_id}`;
    return `- ${label}: ${pv.value || 'Not provided'}`;
  });

  const promptText = `
You are an expert civic governance advisor assisting a Municipal/State Director in evaluating submitted civic entities.
Analyze the following submitted entity data and provide a highly specific, factual, and structured decision intelligence report.

--- SUBMITTED ENTITY DETAILS ---
Title / Name: ${entity.name}
Entity Type / Module: ${entity.entityType?.name || 'Generic Entity'}
Area: ${entity.area || 'Unassigned'}
Location: ${entity.location || 'Not specified'}
Current Status: ${entity.status || 'draft'}

Form Fields & Submitted Parameters:
${fieldSummaries.length > 0 ? fieldSummaries.join('\n') : '- No additional form parameters recorded.'}

--- INSTRUCTIONS ---
Perform a critical analysis of this specific entity based strictly on the provided data.
You MUST respond with ONLY a single raw valid JSON object (no markdown block syntax, no code block formatting, no preamble or extra explanations).

The JSON object must match this exact schema:
{
  "problem_summary": "A 2-3 sentence plain-language summary of the core issue or project being reviewed.",
  "root_cause_analysis": [
    "Underlying cause or factor 1",
    "Underlying cause or factor 2"
  ],
  "stakeholder_analysis": [
    { "group": "Stakeholder Group Name", "interest": "Specific role, benefit, or concern" }
  ],
  "risk_register": [
    { "risk": "Description of risk if unhandled or mismanaged", "severity": "Low|Medium|High" }
  ],
  "recommendation": [
    "Concrete action 1 for Director consideration",
    "Concrete action 2 for Director consideration"
  ]
}
`.trim();

  // Check API Key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    // Log failure attempt to DB
    const log = await prisma.aIExecutionLog.create({
      data: {
        entity_id: Number(entityId),
        requested_by_user_id: requestedByUserId ? Number(requestedByUserId) : null,
        provider: 'gemini',
        model: 'gemini-1.5-flash',
        prompt: promptText,
        response: null,
        status: 'failed',
        error_message: 'GEMINI_API_KEY is not configured in server environment variables.',
      },
    });

    const err = new Error('Gemini API key is not configured on the server. Please set GEMINI_API_KEY in backend/.env');
    err.statusCode = 500;
    err.logId = log.ai_execution_log_id;
    throw err;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  let rawResponseText = '';
  let parsedReport = null;
  let errorMessage = null;

  try {
    // Attempt 1
    const result = await model.generateContent(promptText);
    const response = await result.response;
    rawResponseText = response.text();

    const cleanedText = cleanJsonResponseText(rawResponseText);
    parsedReport = JSON.parse(cleanedText);

    if (!isValidReportSchema(parsedReport)) {
      throw new Error('Parsed JSON does not match required report schema.');
    }
  } catch (attempt1Error) {
    console.warn('[AI SERVICE] Attempt 1 failed or returned invalid JSON structure:', attempt1Error.message);

    // Attempt 2: Stricter Retry Prompt
    try {
      const retryPrompt = `${promptText}\n\nATTENTION: Your previous response failed JSON parsing. Re-format and return strictly a valid JSON object matching the exact keys required: problem_summary, root_cause_analysis, stakeholder_analysis, risk_register, recommendation.`;
      const retryResult = await model.generateContent(retryPrompt);
      const retryResponse = await retryResult.response;
      rawResponseText = retryResponse.text();

      const cleanedRetry = cleanJsonResponseText(rawResponseText);
      parsedReport = JSON.parse(cleanedRetry);

      if (!isValidReportSchema(parsedReport)) {
        throw new Error('Retry response still did not match required report schema.');
      }
    } catch (attempt2Error) {
      console.error('[AI SERVICE] Attempt 2 failed:', attempt2Error.message);
      errorMessage = `Failed to generate valid JSON intelligence report: ${attempt2Error.message}`;
    }
  }

  // 4. Save Execution Log to DB
  const log = await prisma.aIExecutionLog.create({
    data: {
      entity_id: Number(entityId),
      requested_by_user_id: requestedByUserId ? Number(requestedByUserId) : null,
      provider: 'gemini',
      model: 'gemini-1.5-flash',
      prompt: promptText,
      response: rawResponseText || null,
      status: parsedReport ? 'completed' : 'failed',
      error_message: errorMessage,
    },
  });

  if (!parsedReport) {
    const err = new Error(errorMessage || 'Failed to parse Gemini AI response.');
    err.statusCode = 502;
    err.logId = log.ai_execution_log_id;
    throw err;
  }

  return {
    report: parsedReport,
    logId: log.ai_execution_log_id,
  };
}

module.exports = {
  generateIntelligenceReport,
};
