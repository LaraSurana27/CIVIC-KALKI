/**
 * CIVIC-KALKI — Buzz Caption Generation Service
 *
 * Given a linked issue/initiative (entity_id), template, and style,
 * loads the record's title + category + area and calls Gemini to produce
 * exactly 3 short captions with CTAs.
 *
 * Rules baked into prompt:
 *  • Never mock people, groups, officials, religions, or communities — mock the PROBLEM.
 *  • No personal data.
 *  • Do not state facts beyond the issue record.
 *  • Caption ≤ 160 chars · CTA ≤ 60 chars.
 *
 * FAIL CLOSED: returns captions:[] + ai_unavailable:true if Gemini is unreachable.
 */

'use strict';

const { GoogleGenerativeAI } = require('@google/generative-ai');
const prisma = require('../db');
const { GEMINI_MODEL } = require('./aiSuggestion');

function cleanJson(text) {
  if (!text) return '';
  let t = text.trim();
  if (t.startsWith('```')) t = t.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  return t.trim();
}

const STYLE_INSTRUCTION = {
  funny:
    'Light, relatable humour about the SITUATION — never about any person, official, or group. ' +
    'Tone: self-deprecating citizen, everyday absurdity.',
  informative:
    'Clear, factual, awareness-raising. Use only facts present in the provided record. No humour.',
  emotional:
    'Warm, community-focused, empathetic. Inspire action without assigning blame. No invented facts.',
};

const TEMPLATE_HINT = {
  meme: 'Make it punchy and shareable — one strong line + a short CTA.',
  awareness: 'Educational framing — briefly explain the civic issue + why citizens should care.',
  initiative: 'Rally tone — inspire neighbours to join, support, or volunteer.',
};

/**
 * Generate 3 buzz captions for a linked issue or initiative.
 *
 * @param {{ linked_type: string, linked_id: number, style: string, template: string }} input
 * @param {number} userId - Requesting user_id (for AIExecutionLog)
 * @returns {{ captions: Array<{caption:string, cta_text:string}>, ai_unavailable: boolean, reason: string|null }}
 */
async function generateBuzzCaptions({ linked_type, linked_id, style, template }, userId) {
  // ── 1. Load linked entity ──────────────────────────────────────────────────
  const entity = await prisma.entity.findUnique({
    where: { entity_id: Number(linked_id) },
    include: { entityType: { select: { name: true } } },
  });

  if (!entity) {
    const err = new Error(`Linked entity ${linked_id} not found.`);
    err.statusCode = 404;
    throw err;
  }

  const title    = entity.name   || 'Civic issue';
  const category = entity.entityType?.name || linked_type;
  const area     = entity.area   || 'your locality';

  // ── 2. Build prompt ────────────────────────────────────────────────────────
  const styleGuide    = STYLE_INSTRUCTION[style]    || STYLE_INSTRUCTION.informative;
  const templateGuide = TEMPLATE_HINT[template]     || TEMPLATE_HINT.awareness;

  const prompt = `
You are a civic awareness content writer for a citizen platform in India.
Generate exactly 3 short social-media captions for a "${template}" post about a civic ${linked_type}.

ISSUE / INITIATIVE RECORD (use ONLY these facts — do NOT invent numbers, dates, or outcomes):
- Title: ${title}
- Category: ${category}
- Area: ${area}

STYLE: ${style.toUpperCase()}
Style instruction: ${styleGuide}

TEMPLATE: ${template.toUpperCase()}
Template instruction: ${templateGuide}

HARD RULES (violations = rejection):
• Humour, if any, is about the SITUATION — NEVER mock any person, official, department, political party, religion, caste, community, gender, region, language, disability, or migrant group.
• No personal data, no real names, no contact info.
• Do NOT state facts beyond the record above (no invented statistics, timelines, or outcomes).
• No political party names, no election content.
• No profanity, slurs, sexual content, or violence.
• Caption ≤ 160 chars. CTA ≤ 60 chars. Max 2 emojis total per option.
• English only.

Respond with ONLY valid JSON (no markdown):
{
  "captions": [
    { "caption": "...", "cta_text": "..." },
    { "caption": "...", "cta_text": "..." },
    { "caption": "...", "cta_text": "..." }
  ],
  "uses_only_provided_facts": true
}
If safe captions are not possible, return: { "captions": [], "uses_only_provided_facts": false, "reason": "one sentence" }
`.trim();

  // ── 3. Call Gemini (with one retry) ───────────────────────────────────────
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    return { captions: [], ai_unavailable: true, reason: 'AI caption service is not configured.' };
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

  let parsed = null;
  let rawText = '';
  let errorMsg = null;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const result = await model.generateContent(
        attempt === 1 ? prompt : prompt + '\n\nATTENTION: Return ONLY valid JSON.'
      );
      rawText = result.response.text();
      parsed  = JSON.parse(cleanJson(rawText));
      if (!Array.isArray(parsed.captions)) throw new Error('captions must be an array');
      break;
    } catch (err) {
      errorMsg = err.message;
      if (attempt === 2) console.error('[BUZZ CAPTIONS] Both attempts failed:', err.message);
    }
  }

  // ── 4. Log to AIExecutionLog ───────────────────────────────────────────────
  try {
    await prisma.aIExecutionLog.create({
      data: {
        entity_id:             Number(linked_id),
        requested_by_user_id:  userId ? Number(userId) : null,
        provider:              'gemini',
        model:                 GEMINI_MODEL,
        prompt:                prompt.substring(0, 5000),
        response:              rawText || null,
        status:                parsed ? 'completed' : 'failed',
        error_message:         errorMsg || null,
        analysis_type:         'buzz_caption',
      },
    });
  } catch (logErr) {
    console.error('[BUZZ CAPTIONS] AIExecutionLog write failed:', logErr.message);
  }

  if (!parsed) {
    return { captions: [], ai_unavailable: true, reason: 'AI caption generation failed. Please write your own.' };
  }

  if (!parsed.uses_only_provided_facts || parsed.captions.length === 0) {
    return {
      captions: [],
      ai_unavailable: false,
      reason: parsed.reason || 'AI could not produce safe captions for this topic.',
    };
  }

  // Enforce length limits server-side
  const clean = (parsed.captions || []).slice(0, 3).map(c => ({
    caption:  String(c.caption  || '').substring(0, 160),
    cta_text: String(c.cta_text || '').substring(0, 60),
  }));

  return { captions: clean, ai_unavailable: false, reason: null };
}

module.exports = { generateBuzzCaptions };

