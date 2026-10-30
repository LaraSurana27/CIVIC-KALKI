/**
 * CIVIC-KALKI — Buzz Safety Service
 *
 * A single cheap Gemini call that checks free-text (caption, comment, CTA)
 * for:  offensive language · personal data · misleading civic claims
 *
 * FAIL CLOSED: if Gemini is unavailable or JSON is malformed, the call is
 * rejected with a friendly message rather than auto-passing.
 *
 * Reuses: GEMINI_MODEL, cleanJsonResponseText pattern from aiSuggestion.js
 */

'use strict';

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GEMINI_MODEL } = require('./aiSuggestion');

function cleanJson(text) {
  if (!text) return '';
  let t = text.trim();
  if (t.startsWith('```')) t = t.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  return t.trim();
}

/**
 * Run a Gemini safety check on arbitrary text before it is persisted.
 *
 * @param {string} text        - The caption, comment body, or CTA to check.
 * @param {'caption'|'comment'} context - Hint for the prompt.
 * @returns {{ safe: boolean, reason: string|null }}
 *   safe   – true only if Gemini explicitly confirms the content is safe.
 *   reason – null when safe; a short, user-friendly sentence when unsafe or unavailable.
 */
async function buzzSafetyCheck(text, context = 'caption') {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    return { safe: false, reason: 'Content safety check is temporarily unavailable. Please try again shortly.' };
  }

  const contextLabel = context === 'comment' ? 'a civic community comment' : 'a civic buzz caption or CTA';

  const prompt = `
You are a strict civic content safety classifier for a government-linked community platform.
Evaluate the following text submitted as ${contextLabel}.

TEXT:
"""
${(text || '').substring(0, 1000)}
"""

Reject the text if it contains ANY of the following:
1. Offensive, hateful, abusive, or profane language.
2. Content that mocks, blames, or personally targets any individual, official, community, religion, caste, gender, language, or region.
3. Personal identifiable information: real names combined with contact details, phone numbers, email addresses, home addresses, vehicle plates.
4. Misleading or invented civic claims: statistics, timelines, outcomes, or facts that are not self-evident from the text itself.
5. Political party names, election content, or specific politician names.
6. Sexual, violent, or disaster-related humour.

If none of the above apply, the text is safe.

Respond with ONLY valid JSON (no markdown):
{ "safe": true }       -- if content passes all checks
{ "safe": false, "reason": "One short user-friendly sentence explaining the issue." }
`.trim();

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: { temperature: 0.05 },
  });

  let parsed = null;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const result = await model.generateContent(
        attempt === 1 ? prompt : prompt + '\n\nATTENTION: Return ONLY valid JSON with key "safe" and optional "reason".'
      );
      const raw = result.response.text();
      parsed = JSON.parse(cleanJson(raw));
      if (typeof parsed.safe !== 'boolean') throw new Error('missing safe field');
      break; // success
    } catch (err) {
      if (attempt === 2) {
        console.error('[BUZZ SAFETY] Both attempts failed:', err.message);
      }
    }
  }

  if (!parsed) {
    return { safe: false, reason: 'Content safety check could not be completed. Please try again.' };
  }

  return {
    safe: Boolean(parsed.safe),
    reason: parsed.safe ? null : (parsed.reason || 'This content did not pass our community safety check. Please revise and resubmit.'),
  };
}

module.exports = { buzzSafetyCheck };

