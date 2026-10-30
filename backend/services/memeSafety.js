/**
 * CIVIC-KALKI � Meme Safety Pipeline (Section 4)
 * Layer a: Deterministic filter (blocklist + PII + length)
 * Layer b: AI safety classifier (separate Gemini call)
 *
 * FAIL CLOSED: AI failure marks safety_check="unavailable", never auto-passes.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const prisma = require('../db');
const { GEMINI_MODEL } = require('./aiSuggestion');
const {
  PROFANITY_BLOCKLIST,
  POLITICAL_BLOCKLIST,
  PII_PATTERNS,
  CAPTION_LIMITS,
} = require('./memeConfig');

function cleanJsonResponseText(text) {
  if (!text) return '';
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

/**
 * Layer A: Deterministic safety filter.
 * @param {string} headline
 * @param {string} caption
 * @returns {{ passed: boolean, violations: string[] }}
 */
function deterministicFilter(headline, caption) {
  const violations = [];
  const combinedText = `${headline || ''} ${caption || ''}`;
  const lowerText = combinedText.toLowerCase();

  // Length limits
  if ((headline || '').length > CAPTION_LIMITS.headlineMaxChars) {
    violations.push(`Headline exceeds ${CAPTION_LIMITS.headlineMaxChars} characters.`);
  }
  if ((caption || '').length > CAPTION_LIMITS.captionMaxChars) {
    violations.push(`Caption exceeds ${CAPTION_LIMITS.captionMaxChars} characters.`);
  }

  // Profanity/slur check
  for (const word of PROFANITY_BLOCKLIST) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}(?:ing|ed|er|ers|s|y|ies|in)?\\b`, 'i');
    if (regex.test(combinedText)) {
      violations.push(`Caption contains prohibited language ("${word}"). Please revise.`);
      break; // Report first hit; don't enumerate all
    }
  }

  // Political / politician name check
  for (const term of POLITICAL_BLOCKLIST) {
    if (lowerText.includes(term.toLowerCase())) {
      violations.push(
        `Caption contains a political party or leader name ("${term}"). ` +
        'Civic memes must not reference political parties, leaders, or ideology.'
      );
      break;
    }
  }

  // Named official / personal blame check (e.g. Commissioner Sharma, Corporator Patil)
  const officialTitleRegex = /\b(commissioner|corporator|mla|mp|minister|mayor|ward officer|collector)\s+[A-Za-z]+/i;
  if (officialTitleRegex.test(combinedText)) {
    const match = combinedText.match(officialTitleRegex)[0];
    violations.push(
      `Caption mentions an individual official or leader ("${match}"). ` +
      'Memes must highlight the civic situation without naming or blaming individual officials.'
    );
  }

  // PII / contact info patterns
  for (const pattern of PII_PATTERNS) {
    if (pattern.test(combinedText)) {
      violations.push(
        'Caption appears to contain personal contact information (phone number, email, URL, ' +
        '@handle, or vehicle plate). Remove all identifying information.'
      );
      break;
    }
  }

  return { passed: violations.length === 0, violations };
}

/**
 * Layer B: AI safety classifier (separate low-temperature Gemini call).
 * Returns { safe: boolean, violations: string[], status: 'passed'|'failed'|'unavailable' }
 *
 * FAIL CLOSED: on any error, status = 'unavailable', safe = false.
 */
async function aiSafetyClassifier(headline, caption, entityId, userId) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    await logAiCall({
      entityId, userId, type: 'meme_safety',
      prompt: '(API key missing)',
      status: 'failed',
      error: 'GEMINI_API_KEY not configured.',
    });
    return { safe: false, violations: [], status: 'unavailable' };
  }

  const promptText = `
You are a civic content safety classifier. Evaluate the following meme headline and caption strictly against these rules:

RULES:
1. No content that mocks, blames, names, or implies wrongdoing/negligence/corruption by any individual, official, government employee, department, political party, or leader.
2. No political content, elections, parties, or ideology.
3. No content targeting religion, caste, community, gender, region, language, disability, migrants, or any protected group. No stereotypes.
4. No profanity, slurs, sexual or violent content.
5. No jokes about injury, death, disease, or disasters.
6. No invented facts, numbers, durations, causes, or outcomes not in the provided data.
7. No real people or celebrity names; no copyrighted dialogue, lyrics, catchphrases, or character references.
8. Humor must be about the SITUATION or the citizen's own relatable experience only.

CONTENT TO EVALUATE:
Headline: ${(headline || '').substring(0, 200)}
Caption: ${(caption || '').substring(0, 400)}

Respond with ONLY a valid JSON object (no markdown, no explanation):
{
  "safe": true or false,
  "violations": ["specific violation description if any"]
}
`.trim();

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: { temperature: 0.1 },
  });

  let rawResponse = '';
  let parsed = null;
  let errorMessage = null;

  try {
    const result = await model.generateContent(promptText);
    rawResponse = result.response.text();
    parsed = JSON.parse(cleanJsonResponseText(rawResponse));
    if (typeof parsed.safe !== 'boolean' || !Array.isArray(parsed.violations)) {
      throw new Error('Classifier response schema is invalid');
    }
  } catch (e) {
    console.warn('[MEME SAFETY] AI classifier attempt 1 failed:', e.message);
    try {
      const retryResult = await model.generateContent(
        promptText + '\n\nATTENTION: Return ONLY valid JSON with keys "safe" and "violations".'
      );
      rawResponse = retryResult.response.text();
      parsed = JSON.parse(cleanJsonResponseText(rawResponse));
      if (typeof parsed.safe !== 'boolean' || !Array.isArray(parsed.violations)) {
        throw new Error('Classifier response schema is invalid on retry');
      }
    } catch (e2) {
      errorMessage = e2.message;
      console.error('[MEME SAFETY] AI classifier both attempts failed:', e2.message);
    }
  }

  await logAiCall({
    entityId, userId, type: 'meme_safety',
    prompt: promptText.substring(0, 2000),
    response: rawResponse,
    status: parsed ? 'completed' : 'failed',
    error: errorMessage,
  });

  if (!parsed) {
    return { safe: false, violations: [], status: 'unavailable' };
  }

  return {
    safe: Boolean(parsed.safe),
    violations: Array.isArray(parsed.violations) ? parsed.violations : [],
    status: parsed.safe ? 'passed' : 'failed',
  };
}

async function logAiCall({ entityId, userId, type, prompt, response, status, error }) {
  try {
    await prisma.aIExecutionLog.create({
      data: {
        entity_id: entityId ? Number(entityId) : null,
        requested_by_user_id: userId ? Number(userId) : null,
        provider: 'gemini',
        model: GEMINI_MODEL,
        prompt: prompt || null,
        response: response || null,
        status: status || 'completed',
        error_message: error || null,
        analysis_type: type || 'meme_safety',
      },
    });
  } catch (logErr) {
    console.error('[MEME SAFETY] Failed to write AIExecutionLog:', logErr.message);
  }
}

module.exports = { deterministicFilter, aiSafetyClassifier };
