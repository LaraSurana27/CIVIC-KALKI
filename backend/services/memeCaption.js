/**
 * CIVIC-KALKI � AI Caption Generation (Section 3)
 * Generates 3 caption options per entity + template type.
 *
 * FAIL CLOSED: If Gemini unavailable, returns ai_unavailable=true with
 * empty options. Never substitutes canned jokes as AI output.
 *
 * Reuses: cleanJsonResponseText + retry pattern from aiSuggestion.js
 *         AIExecutionLog with analysis_type="meme_caption" (no schema change)
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const prisma = require('../db');
const { GEMINI_MODEL } = require('./aiSuggestion');

function cleanJsonResponseText(text) {
  if (!text) return '';
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

function isValidCaptionSchema(data) {
  if (!data || typeof data !== 'object') return false;
  if (!Array.isArray(data.options)) return false;
  if (typeof data.uses_only_provided_facts !== 'boolean') return false;
  if (data.options.length !== 0 && data.options.length !== 3) return false;
  if (data.options.length === 0 && (typeof data.reason !== 'string' || !data.reason.trim())) return false;
  return data.options.every((option) =>
    option && typeof option.headline === 'string' && typeof option.caption === 'string'
  );
}

/**
 * Generate 3 caption options for a meme campaign.
 *
 * @param {number} entityId      - Issue entity_id
 * @param {string} templateType  - 'relatable' | 'awareness' | 'call_to_action'
 * @param {number} userId        - Requesting user_id
 * @returns {{ options: Array, uses_only_provided_facts: boolean, ai_unavailable: boolean, logId: number|null }}
 */
async function generateCaptions(entityIdOrData, templateType, userId) {
  if (!entityIdOrData || typeof entityIdOrData !== 'object') {
    throw new Error('Caption inputs must contain only category, locality, and an optional linked issue description.');
  }
  let category = 'Civic Issue';
  let locality = 'your locality';
  let issueDesc = 'Civic issue in neighborhood';
  let safeFields = [];
  let targetEntityId = null;

  if (typeof entityIdOrData === 'object' && entityIdOrData !== null) {
    category = entityIdOrData.category || 'Civic Issue';
    locality = entityIdOrData.locality || 'your locality';
    issueDesc = entityIdOrData.description || entityIdOrData.name || category;
    targetEntityId = entityIdOrData.entity_id ? Number(entityIdOrData.entity_id) : null;
  } else if (entityIdOrData && !isNaN(Number(entityIdOrData))) {
    targetEntityId = Number(entityIdOrData);
    const entity = await prisma.entity.findUnique({
      where: { entity_id: targetEntityId },
      include: {
        entityType: { select: { name: true } },
        parameterValues: {
          include: {
            parameterMaster: { select: { field_key: true, label: true } },
          },
        },
      },
    });

    if (!entity) {
      const err = new Error(`Entity ${entityIdOrData} not found.`);
      err.statusCode = 404;
      throw err;
    }

    const EXCLUDED_KEYS = ['reporter_name', 'contact', 'email', 'phone', 'address', 'exact_location'];
    safeFields = entity.parameterValues
      .filter((pv) => {
        const key = (pv.parameterMaster?.field_key || '').toLowerCase();
        return !EXCLUDED_KEYS.some((ex) => key.includes(ex));
      })
      .map((pv) => {
        const label = pv.parameterMaster?.label || pv.parameterMaster?.field_key || 'Detail';
        return `- ${label}: ${pv.value || 'Not provided'}`;
      });

    category = entity.entityType?.name || 'Civic Issue';
    locality = entity.area || 'your locality';
    issueDesc = entity.name;
  }

  const templateInstructions = {
    relatable: 'Write in a light, self-deprecating, relatable tone about the citizen\'s own experience with this civic situation. Humor is about the SITUATION, never about people or officials.',
    awareness: 'Write in a clear, factual, informative tone. Include only facts that are present in the provided data. No humor. Focus on raising awareness.',
    cta: 'Write in an energizing, community-focused tone that encourages citizens to report, support, or take civic action. No blame. No humor. Action-oriented.',
  };

  const promptText = `
You are a civic awareness content writer helping citizens create social-media-style meme captions about real local issues.

ISSUE DATA (use ONLY these facts � do NOT invent any numbers, dates, durations, or outcomes):
- Issue Category: ${category}
- Locality (neighbourhood level): ${locality}
- Issue Title/Description: ${issueDesc}
${safeFields.length > 0 ? safeFields.join('\n') : '- (No additional details)'}

TEMPLATE: ${templateType.toUpperCase()}
TONE INSTRUCTION: ${templateInstructions[templateType] || templateInstructions.awareness}

humor about the situation or the citizen's own experience, never people; never mock, blame, or imply negligence or corruption by any person, official, department, or party; no politics; never target religion, caste, community, gender, region, language, disability, or migrants; no profanity, sexual or violent content; no jokes about injury, death, disease, or disasters; no invented facts or numbers; no real or celebrity names; no copyrighted lines, characters, or meme formats; max 2 emojis; headline up to 60 chars, caption up to 140; if unsafe, return empty options plus a reason. English only.

MANDATORY RULES � violations will cause rejection:
* Humor (if any) is about the SITUATION or the citizen's own relatable experience. NEVER about people.
* NEVER mock, blame, name, or imply wrongdoing by any individual, official, government employee, department, political party, or leader.
* NO political content, elections, parties, ideology.
* NEVER target religion, caste, community, gender, region, language, disability, migrants, or any protected group. No stereotypes.
* NO profanity, slurs, sexual or violent content. No jokes about injury, death, disease, or disasters.
* DO NOT invent facts: no numbers, durations, causes, dates, or outcomes not in the provided data.
* NO real people or celebrity names. NO copyrighted dialogue, lyrics, catchphrases, or character references.
* Max 2 emojis total. Headline max 60 chars. Caption max 140 chars.
* If safe content is not possible for this topic, return empty options array with a reason field.
* English only.
* Reporter identity must never appear. Refer to reporter as "A citizen in ${locality}" if needed.

Generate exactly 3 caption options. Respond with ONLY a valid JSON object (no markdown, no explanation):
{
  "options": [
    { "headline": "string max 60 chars", "caption": "string max 140 chars", "humor_level": "light|none" },
    { "headline": "string max 60 chars", "caption": "string max 140 chars", "humor_level": "light|none" },
    { "headline": "string max 60 chars", "caption": "string max 140 chars", "humor_level": "light|none" }
  ],
  "uses_only_provided_facts": true,
  "reason": "optional � only if options is empty"
}
`.trim();

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    await logCall({ entityId: targetEntityId, userId, prompt: promptText, status: 'failed', error: 'GEMINI_API_KEY not configured.' });
    return { options: [], uses_only_provided_facts: true, ai_unavailable: true, reason: 'AI service is not configured. Please write your own caption.', logId: null };
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

  let rawText = '';
  let parsed = null;
  let errorMessage = null;

  try {
    const result = await model.generateContent(promptText);
    rawText = result.response.text();
    parsed = JSON.parse(cleanJsonResponseText(rawText));
    if (!isValidCaptionSchema(parsed)) throw new Error('Schema mismatch on attempt 1');
  } catch (e1) {
    console.warn('[MEME CAPTION] Attempt 1 failed:', e1.message);
    try {
      const retryPrompt = promptText + '\n\nATTENTION: Return ONLY valid JSON with keys "options", "uses_only_provided_facts", and optional "reason".';
      const r2 = await model.generateContent(retryPrompt);
      rawText = r2.response.text();
      parsed = JSON.parse(cleanJsonResponseText(rawText));
      if (!isValidCaptionSchema(parsed)) throw new Error('Schema mismatch on retry');
    } catch (e2) {
      console.error('[MEME CAPTION] Both attempts failed:', e2.message);
      errorMessage = e2.message;
    }
  }

  const logId = await logCall({
    entityId: targetEntityId, userId, prompt: promptText,
    response: rawText,
    status: parsed ? 'completed' : 'failed',
    error: errorMessage,
  });

  if (!parsed) {
    return { options: [], uses_only_provided_facts: true, ai_unavailable: true, reason: 'AI caption generation failed. Please write your own caption.', logId };
  }

  // Enforce char limits client will also show, but enforce server-side too
  const { CAPTION_LIMITS } = require('./memeConfig');
  const cleanedOptions = (parsed.options || []).slice(0, 3).map((opt) => ({
    headline: String(opt.headline || '').substring(0, CAPTION_LIMITS.headlineMaxChars),
    caption: String(opt.caption || '').substring(0, CAPTION_LIMITS.captionMaxChars),
  }));

  if (cleanedOptions.length !== 0 && cleanedOptions.length !== 3) {
    return {
      options: [],
      uses_only_provided_facts: false,
      ai_unavailable: false,
      reason: 'AI returned an incomplete caption set. Please write your own caption.',
      logId,
    };
  }
  if (!parsed.uses_only_provided_facts) {
    return {
      options: [],
      uses_only_provided_facts: false,
      ai_unavailable: false,
      reason: parsed.reason || 'AI could not confirm these captions use only provided facts.',
      logId,
    };
  }

  return {
    options: cleanedOptions,
    uses_only_provided_facts: Boolean(parsed.uses_only_provided_facts),
    ai_unavailable: false,
    reason: cleanedOptions.length === 0
      ? parsed.reason || 'AI could not safely suggest captions for this topic.'
      : parsed.reason || null,
    logId,
  };
}

async function logCall({ entityId, userId, prompt, response, status, error }) {
  try {
    const log = await prisma.aIExecutionLog.create({
      data: {
        entity_id: entityId ? Number(entityId) : null,
        requested_by_user_id: userId ? Number(userId) : null,
        provider: 'gemini',
        model: GEMINI_MODEL,
        prompt: (prompt || '').substring(0, 5000),
        response: (response || null),
        status: status || 'completed',
        error_message: error || null,
        analysis_type: 'meme_caption',
      },
    });
    return log.ai_execution_log_id;
  } catch (logErr) {
    console.error('[MEME CAPTION] Failed to write AIExecutionLog:', logErr.message);
    return null;
  }
}

module.exports = { generateCaptions };
