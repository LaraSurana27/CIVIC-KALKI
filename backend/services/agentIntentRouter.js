/**
 * CIVIC-KALKI — Conversational Agent: Intent Router
 *
 * Single responsibility: classify a citizen's free-text message into one of
 * 5 structured action types using a single Gemini call.
 *
 * Reuses the same JSON-only + retry-on-parse-failure pattern from aiSuggestion.js.
 * No new dependencies required.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// ── Helpers (mirrored from aiSuggestion.js — kept local to avoid coupling) ──

/**
 * Strip markdown code fences if Gemini wraps output in them.
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
 * Validate that the parsed object matches the required intent schema.
 * @param {any} data
 * @returns {boolean}
 */
function isValidIntentSchema(data) {
  if (!data || typeof data !== 'object') return false;
  const validActions = ['report', 'initiate', 'status_check', 'guidance', 'unclear'];
  const validCapabilities = ['Grievance', 'Movement', null];
  const validConfidence = ['high', 'low'];
  return (
    validActions.includes(data.action_type) &&
    validCapabilities.includes(data.matched_capability) &&
    validConfidence.includes(data.confidence)
  );
}

// ── Prompt builder ────────────────────────────────────────────────────────────

/**
 * Build the intent classification prompt.
 * @param {string} message - The citizen's current message
 * @param {Array<{role:string,content:string}>} conversationHistory - Prior turns
 * @param {Object|null} attachedFile - Optional attached file metadata
 */
function buildIntentPrompt(message, conversationHistory = [], attachedFile = null) {
  const historyText = conversationHistory.length > 0
    ? conversationHistory.map(t => `${t.role === 'user' ? 'Citizen' : 'Agent'}: ${t.content}`).join('\n')
    : '(no prior conversation)';

  const fileNote = attachedFile
    ? `\nATTACHED FILE: "${attachedFile.originalName}" (${attachedFile.mimeType}). If the citizen has attached a photo or document related to a civic issue or problem, strongly favor "report" (Grievance) unless text suggests an initiative.`
    : '';

  return `
You are an intent classifier for CIVIC-KALKI, a municipal civic action platform.
Classify the citizen's message into exactly one intent.

PRIOR CONVERSATION (for context, may be empty):
${historyText}

CITIZEN'S LATEST MESSAGE:
"${message}"${fileNote}

AVAILABLE INTENTS:
- "report"        → Citizen wants to report a civic problem, complaint, grievance, or issue
                    (e.g. garbage, road damage, water supply, noise, safety, sanitation)
- "initiate"      → Citizen wants to start or propose a civic movement, initiative, or campaign
                    (e.g. cleanliness drive, community project, awareness campaign)
- "status_check"  → Citizen wants to know the status of their existing request(s)
                    (e.g. "what happened to my complaint", "is my request approved yet")
- "guidance"      → Citizen is asking a general question about how the platform works
                    (e.g. "how do I file a complaint", "what can I do here")
- "unclear"       → Message is ambiguous, off-topic, or cannot be confidently classified

CAPABILITY MATCH (only for "report" or "initiate"):
- "Grievance"  → for action_type "report"
- "Movement"   → for action_type "initiate"
- null         → for all other action_types

CONFIDENCE:
- "high" → you are confident in the classification
- "low"  → the message is ambiguous or borderline

Respond with ONLY a single raw valid JSON object. No markdown, no explanation, no code fences.

Required schema:
{
  "action_type": "report" | "initiate" | "status_check" | "guidance" | "unclear",
  "matched_capability": "Grievance" | "Movement" | null,
  "confidence": "high" | "low"
}
`.trim();
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Route a citizen message to a structured intent.
 *
 * @param {string} message - The citizen's message
 * @param {Array<{role:string,content:string}>} conversationHistory - Prior turns (may be empty)
 * @param {Object|null} attachedFile - Optional attached file metadata
 * @returns {Promise<{action_type:string, matched_capability:string|null, confidence:string}>}
 */
async function routeIntent(message, conversationHistory = [], attachedFile = null) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    // Graceful degradation: return unclear so the caller can show a helpful message
    console.warn('[AGENT INTENT] GEMINI_API_KEY not configured — returning unclear intent');
    return { action_type: 'unclear', matched_capability: null, confidence: 'low' };
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });
  const promptText = buildIntentPrompt(message, conversationHistory, attachedFile);

  let parsed = null;

  // Attempt 1
  try {
    const result = await model.generateContent(promptText);
    const rawText = result.response.text();
    const cleaned = cleanJsonResponseText(rawText);
    parsed = JSON.parse(cleaned);
    if (!isValidIntentSchema(parsed)) {
      throw new Error('Intent JSON did not match required schema');
    }
  } catch (attempt1Err) {
    console.warn('[AGENT INTENT] Attempt 1 failed:', attempt1Err.message);

    // Attempt 2: stricter retry
    try {
      const retryPrompt = `${promptText}\n\nATTENTION: Your previous response failed validation. Return ONLY a valid JSON object with exactly these keys: action_type, matched_capability, confidence. No other text.`;
      const retryResult = await model.generateContent(retryPrompt);
      const rawRetry = retryResult.response.text();
      const cleanedRetry = cleanJsonResponseText(rawRetry);
      parsed = JSON.parse(cleanedRetry);
      if (!isValidIntentSchema(parsed)) {
        throw new Error('Retry intent JSON still did not match required schema');
      }
    } catch (attempt2Err) {
      console.error('[AGENT INTENT] Attempt 2 failed:', attempt2Err.message);
      // Both attempts failed — return unclear so UI can display a clarifying question
      return { action_type: 'unclear', matched_capability: null, confidence: 'low' };
    }
  }

  return parsed;
}

module.exports = { routeIntent };
