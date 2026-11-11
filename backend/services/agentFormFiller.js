/**
 * CIVIC-KALKI — Conversational Agent: Form-Filling Engine (v2 — with Multimodal Doc/Photo Upload)
 *
 * Responsibilities:
 *  1. Maintain in-memory per-session state (draft values, schema, phase, pending files)
 *  2. Fetch the real form schema from the existing forms endpoint (internal call via Prisma directly
 *     to avoid circular HTTP — same data the REST endpoint returns)
 *  3. Drive Gemini to extract field values from conversation turns AND uploaded doc/photo evidence
 *  4. Support document/photo uploads directly via chat:
 *     - Associates uploaded files with corresponding form file parameters (photo_evidence, supporting_document, etc.)
 *     - Inspects uploaded images/photos via Gemini multimodal vision to extract civic problem descriptions,
 *       categories, severity, and text details into the form automatically
 *     - Upon confirmation, writes records to FileRepository and ParameterValue, identical to /files/upload
 *  5. Signal when all required fields are filled and ready for confirmation
 *  6. Execute the actual submission (POST /entities + POST /entities/:id/values +
 *     POST /entities/:id/transition) using the citizen's own JWT identity
 *
 * Session store: plain in-memory Map keyed by sessionId (UUID from client).
 * Sessions expire after SESSION_TTL_MS of inactivity.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const prisma = require('../db');
const { routeIntent } = require('./agentIntentRouter');

// ── Constants ─────────────────────────────────────────────────────────────────


// ── Known Pune Coordinates for Landmark & Area Resolution ─────────────────────
const PUNE_KNOWN_COORDINATES = {
  'shivajinagar': { lat: 18.5204, lng: 73.8567, area: 'Shivajinagar' },
  'fc road': { lat: 18.5246, lng: 73.8415, area: 'Shivajinagar' },
  'fergusson': { lat: 18.5246, lng: 73.8415, area: 'Shivajinagar' },
  'jm road': { lat: 18.5283, lng: 73.8475, area: 'Shivajinagar' },
  'jungli maharaj': { lat: 18.5283, lng: 73.8475, area: 'Shivajinagar' },
  'model colony': { lat: 18.5326, lng: 73.8340, area: 'Shivajinagar' },
  'dhayari': { lat: 18.4485, lng: 73.8058, area: 'Dhayari' },
  'sinhagad road': { lat: 18.4720, lng: 73.8240, area: 'Sinhagad Road' },
  'vadgaon': { lat: 18.4680, lng: 73.8320, area: 'Vadgaon' },
  'warje': { lat: 18.4800, lng: 73.8000, area: 'Warje' },
  'kothrud': { lat: 18.5074, lng: 73.8077, area: 'Kothrud' },
  'karve road': { lat: 18.5020, lng: 73.8180, area: 'Kothrud' },
  'karve statue': { lat: 18.5020, lng: 73.8180, area: 'Kothrud' },
  'baner': { lat: 18.5590, lng: 73.7868, area: 'Baner' },
  'aundh': { lat: 18.5580, lng: 73.8075, area: 'Aundh' },
  'viman nagar': { lat: 18.5679, lng: 73.9143, area: 'Viman Nagar' },
  'hadapsar': { lat: 18.5089, lng: 73.9259, area: 'Hadapsar' },
  'camp': { lat: 18.5173, lng: 73.8804, area: 'Pune Camp' },
  'mg road': { lat: 18.5173, lng: 73.8804, area: 'Pune Camp' },
  'swargate': { lat: 18.5018, lng: 73.8636, area: 'Swargate' },
  'deccan': { lat: 18.5177, lng: 73.8415, area: 'Deccan Gymkhana' },
  'wakad': { lat: 18.5987, lng: 73.7688, area: 'Wakad' },
  'hinjewadi': { lat: 18.5913, lng: 73.7389, area: 'Hinjewadi' },
  'pimpri': { lat: 18.6279, lng: 73.8009, area: 'Pimpri-Chinchwad' },
  'chinchwad': { lat: 18.6298, lng: 73.7997, area: 'Pimpri-Chinchwad' },
  'katraj': { lat: 18.4575, lng: 73.8677, area: 'Katraj' },
  'yerwada': { lat: 18.5529, lng: 73.8797, area: 'Yerwada' },
  'kalyani nagar': { lat: 18.5463, lng: 73.9033, area: 'Kalyani Nagar' },
  'magarpatta': { lat: 18.5158, lng: 73.9272, area: 'Hadapsar' },
  'senapati bapat': { lat: 18.5308, lng: 73.8291, area: 'Shivajinagar' },
  'sb road': { lat: 18.5308, lng: 73.8291, area: 'Shivajinagar' },
  'law college': { lat: 18.5167, lng: 73.8299, area: 'Erandwane' },
  'erandwane': { lat: 18.5100, lng: 73.8300, area: 'Erandwane' },
};

function parseDeviceLocation(message) {
  if (!message) return null;
  const match = message.match(/\[(?:User )?location:\s*([^()\]]+?)(?:\s*\(([0-9.-]+)[°]?[NS]?,\s*([0-9.-]+)[°]?[EW]?\))?\]/i);
  if (!match) return null;
  const rawArea = match[1].trim();
  const lat = match[2] ? parseFloat(match[2]) : null;
  const lng = match[3] ? parseFloat(match[3]) : null;
  const parts = rawArea.split(',').map(s => s.trim()).filter(Boolean);
  const area = parts.length > 1 ? parts[parts.length - 1] : rawArea;
  return {
    location: rawArea,
    area: area,
    latitude: lat,
    longitude: lng,
  };
}


function hasExplicitLocationInText(text) {
  if (!text) return false;
  // Strip out [User location: ...] tag before analyzing citizen's actual message
  const clean = text.replace(/\[(?:User )?location:[^\]]+\]/gi, '').trim().toLowerCase();
  if (!clean) return false;

  // Check if citizen text mentions any known Pune localities
  for (const key of Object.keys(PUNE_KNOWN_COORDINATES)) {
    if (clean.includes(key)) return true;
  }

  // Check for common affirmative confirmation of suggested area
  if (/^(?:yes|yeah|sure|yep|correct|in this area|same area|here|conduct here|do it here)\b/i.test(clean)) {
    return true;
  }

  // Check for common location prepositions followed by place names
  if (/(?:at|in|near|on|behind|opposite|outside|around)\s+[a-z0-9\s]{2,25}(?:road|street|nagar|colony|gate|chowk|station|college|park|bridge|lane|ward|area|pune|campus|market|bazaar)/i.test(clean)) {
    return true;
  }

  return false;
}

function resolveLocationAndCoords(extractedLoc, extractedArea, deviceLoc) {
  let location = extractedLoc || (deviceLoc ? deviceLoc.location : null);
  let area = extractedArea || (deviceLoc ? deviceLoc.area : null);
  let lat = deviceLoc ? deviceLoc.latitude : null;
  let lng = deviceLoc ? deviceLoc.longitude : null;

  if (location) {
    const locLower = location.toLowerCase();
    for (const [key, val] of Object.entries(PUNE_KNOWN_COORDINATES)) {
      if (locLower.includes(key)) {
        if (!area || area.toLowerCase() === 'pune') area = val.area;
        lat = val.lat;
        lng = val.lng;
        break;
      }
    }
  }

  return { location, area, latitude: lat, longitude: lng };
}

const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes

// Field types that represent file/photo attachments
const FILE_FIELD_TYPES = new Set(['file', 'upload', 'image', 'attachment']);

// ── In-memory session store ───────────────────────────────────────────────────

/**
 * @typedef {Object} AgentSession
 * @property {'intent'|'collecting'|'confirming'|'done'} phase
 * @property {string|null} capability        - 'Grievance' | 'Movement' | null
 * @property {number|null} entityTypeId
 * @property {number|null} formId
 * @property {Object|null} formSchema        - Full schema from GET /forms/:id/schema
 * @property {Array}       requiredParams    - Flat list of required non-file parameters
 * @property {Array}       allTextParams     - Flat list of all non-file parameters
 * @property {Array}       fileParams        - Flat list of file/image parameters
 * @property {Array}       pendingFiles      - Uploaded files ready to attach on submission
 * @property {Object}      draft             - { [parameter_id]: value }
 * @property {Array}       conversationHistory - [{role:'user'|'agent', content:string}]
 * @property {number}      userId
 * @property {string}      userRole
 * @property {NodeJS.Timeout} _timer
 */

/** @type {Map<string, AgentSession>} */
const sessions = new Map();

// ── Session lifecycle ─────────────────────────────────────────────────────────

function touchSession(sessionId) {
  const session = sessions.get(sessionId);
  if (!session) return;
  if (session._timer) clearTimeout(session._timer);
  session._timer = setTimeout(() => {
    // Clean up any unsubmitted pending file attachments from disk
    if (Array.isArray(session.pendingFiles) && session.phase !== 'done') {
      for (const f of session.pendingFiles) {
        if (f.diskPath && fs.existsSync(f.diskPath)) {
          fs.unlink(f.diskPath, () => {});
        }
      }
    }
    sessions.delete(sessionId);
    console.log(`[AGENT SESSION] Session ${sessionId} expired and removed.`);
  }, SESSION_TTL_MS);
}

function createSession(sessionId, userId, userRole) {
  const session = {
    phase: 'intent',
    capability: null,
    entityTypeId: null,
    formId: null,
    formSchema: null,
    requiredParams: [],
    allTextParams: [],
    fileParams: [],
    pendingFiles: [],
    draft: {},
    location: null,
    area: null,
    latitude: null,
    longitude: null,
    locationConfirmed: false,
    conversationHistory: [],
    userId,
    userRole,
    _timer: null,
  };
  sessions.set(sessionId, session);
  touchSession(sessionId);
  return session;
}

function getSession(sessionId, userId, userRole) {
  if (!sessions.has(sessionId)) {
    return createSession(sessionId, userId, userRole);
  }
  const session = sessions.get(sessionId);
  touchSession(sessionId);
  return session;
}

function clearSession(sessionId) {
  const session = sessions.get(sessionId);
  if (session) {
    if (session._timer) clearTimeout(session._timer);
    if (Array.isArray(session.pendingFiles) && session.phase !== 'done') {
      for (const f of session.pendingFiles) {
        if (f.diskPath && fs.existsSync(f.diskPath)) {
          fs.unlink(f.diskPath, () => {});
        }
      }
    }
  }
  sessions.delete(sessionId);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function cleanJsonResponseText(text) {
  if (!text) return '';
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

/**
 * Match an attached file to an appropriate file parameter in the form schema.
 * @param {Array} fileParams - Form parameters with field_type in FILE_FIELD_TYPES
 * @param {Object} attachedFile - { originalName, mimeType, diskPath, storedName }
 * @returns {Object|null} matched parameter
 */
function matchFileToParameter(fileParams, attachedFile) {
  if (!Array.isArray(fileParams) || fileParams.length === 0 || !attachedFile) return null;

  const isImage = attachedFile.mimeType && attachedFile.mimeType.startsWith('image/');

  if (isImage) {
    const photoParam = fileParams.find(p =>
      /photo|image|evidence|picture|pic/i.test(p.field_key) ||
      /photo|image|evidence|picture|pic/i.test(p.label)
    );
    if (photoParam) return photoParam;
  } else {
    const docParam = fileParams.find(p =>
      /doc|document|supporting|proof|file|attachment/i.test(p.field_key) ||
      /doc|document|supporting|proof|file|attachment/i.test(p.label)
    );
    if (docParam) return docParam;
  }

  // Fallback to first available file parameter
  return fileParams[0];
}

/**
 * Flatten form schema to lists of parameters.
 * Retains backward compatibility for tests expecting { required, allText }.
 * @param {Object} schema - formSchema.data
 * @returns {{ required: Array, allText: Array, fileParams: Array }}
 */
function extractParameters(schema) {
  const required = [];
  const allText = [];
  const fileParams = [];

  for (const section of (schema.sections || [])) {
    for (const subsection of (section.subsections || [])) {
      for (const param of (subsection.parameters || [])) {
        const fieldType = String(param.field_type || '').toLowerCase();
        const enriched = {
          parameter_id: param.parameter_id,
          field_key: param.field_key,
          label: param.label,
          field_type: param.field_type,
          control_type: param.control_type,
          mandatory: param.mandatory || param.is_mandatory || false,
          options: param.options || param.meta_options || null,
        };

        if (FILE_FIELD_TYPES.has(fieldType)) {
          fileParams.push(enriched);
          continue; // keep allText and required free of file fields
        }

        allText.push(enriched);
        if (enriched.mandatory) required.push(enriched);
      }
    }
  }

  return { required, allText, fileParams };
}

/**
 * Load the form schema from DB directly (avoids circular HTTP self-call).
 * Mirrors the exact Prisma query in GET /forms/:formId/schema.
 * @param {number} entityTypeId
 * @returns {Promise<Object>} formSchema in the same shape as the REST response
 */
async function loadFormSchemaForEntityType(entityTypeId) {
  const form = await prisma.formMaster.findFirst({
    where: { entity_type_id: entityTypeId },
    include: {
      entityType: { select: { entity_type_id: true, name: true } },
      sections: {
        orderBy: { display_order: 'asc' },
        include: {
          subsections: {
            include: {
              parameters: {
                orderBy: { display_order: 'asc' },
                select: {
                  parameter_id: true,
                  field_key: true,
                  label: true,
                  field_type: true,
                  control_type: true,
                  display_order: true,
                  options: true,
                  mandatory: true,
                  validation_rule: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!form) return null;

  return {
    form_id: form.form_id,
    form_name: form.form_name,
    entity_type: form.entityType,
    sections: form.sections.map(sec => ({
      section_id: sec.section_id,
      section_name: sec.section_name,
      subsections: sec.subsections.map(sub => ({
        subsection_id: sub.subsection_id,
        subsection_name: sub.subsection_name,
        parameters: sub.parameters
          .filter(p => p.field_key && p.label)
          .map(p => ({
            parameter_id: p.parameter_id,
            field_key: p.field_key,
            label: p.label,
            field_type: p.field_type,
            control_type: p.control_type,
            mandatory: p.mandatory,
            options: p.options,
          })),
      })),
    })),
  };
}

/**
 * Resolve entity_type_id for a capability name ('Grievance' | 'Movement').
 * Does NOT hardcode IDs — looks up from DB by name.
 * @param {string} capabilityName
 * @returns {Promise<number|null>}
 */
async function resolveEntityTypeId(capabilityName) {
  const entityType = await prisma.entityType.findFirst({
    where: { name: { equals: capabilityName, mode: 'insensitive' } },
  });
  return entityType ? entityType.entity_type_id : null;
}

/**
 * Synthesize a meaningful entity.name from draft values + capability type.
 * @param {string} capability
 * @param {Object} draft - { parameter_id: value }
 * @param {Array}  allTextParams
 * @param {string} fallbackMessage
 */
function synthesizeEntityName(capability, draft, allTextParams, fallbackMessage = '', sessionLocation = null) {
  // Try to find a location or category value to make a meaningful name
  const paramByKey = {};
  for (const p of allTextParams) {
    paramByKey[p.field_key] = draft[p.parameter_id];
  }

  const location = sessionLocation || paramByKey['location'] || paramByKey['area'] || paramByKey['landmark'] || null;
  const category = paramByKey['category'] || paramByKey['initiative_type'] || null;

  if (capability === 'Grievance') {
    const parts = [];
    if (category) parts.push(category);
    if (location) parts.push(location);
    if (parts.length > 0) return `${parts.join(' — ')} Grievance`;
    // Fallback: use first 60 chars of complaint details
    const details = paramByKey['complaint_details'];
    if (details) return details.slice(0, 60).trim() + (details.length > 60 ? '...' : '');
    return `Civic Grievance — ${new Date().toLocaleDateString('en-IN')}`;
  }

  if (capability === 'Movement') {
    const type = paramByKey['initiative_type'];
    if (type && location) return `${type} Initiative — ${location}`;
    if (type) return `${type} Civic Initiative`;
    const desc = paramByKey['initiative_description'];
    if (desc) return desc.slice(0, 60).trim() + (desc.length > 60 ? '...' : '');
    return `Civic Initiative — ${new Date().toLocaleDateString('en-IN')}`;
  }

  return fallbackMessage.slice(0, 80) || `${capability} Submission`;
}

// ── Gemini: form-filling extraction ──────────────────────────────────────────

/**
 * Build the Gemini prompt for form-filling extraction.
 * @param {AgentSession} session
 * @param {string} userMessage
 * @param {Object|null} attachedFile
 */
function buildFormFillPrompt(session, userMessage, attachedFile = null) {
  const filledSummary = session.requiredParams
    .map(p => {
      const val = session.draft[p.parameter_id];
      return `- ${p.label}: ${val !== undefined ? `"${val}"` : '(not yet filled)'} ${p.mandatory ? '[REQUIRED]' : '[optional]'}`;
    })
    .join('\n') + `\n- Incident Location / Landmark: ${session.location ? `"${session.location}"` : '(not yet specified)'} [REQUIRED]`;

  const missingRequired = session.requiredParams.filter(p => session.draft[p.parameter_id] === undefined);

  const paramDetails = session.allTextParams.map(p => {
    let desc = `  - parameter_id: ${p.parameter_id}, label: "${p.label}", field_key: "${p.field_key}", mandatory: ${p.mandatory}`;
    if (p.options) {
      const choices = Array.isArray(p.options) ? p.options : (p.options.choices || null);
      if (choices) desc += `, choices: [${choices.map(c => `"${c}"`).join(', ')}]`;
    }
    return desc;
  }).join('\n');

  const conversationText = session.conversationHistory.slice(-6).map(t =>
    `${t.role === 'user' ? 'Citizen' : 'Agent'}: ${t.content}`
  ).join('\n');

  let fileInstructions = '';
  if (attachedFile) {
    fileInstructions = `
ATTACHED FILE:
- Filename: "${attachedFile.originalName}"
- Type: ${attachedFile.mimeType}
- Note: The citizen has uploaded this file/photo. Inspect the attached image or document carefully:
  * If this is a photo of a civic problem (e.g. road damage, pothole, overflowing garbage, water leakage, fallen tree, broken street light):
    - Summarize what is visible in "complaint_details" or "problem_need".
    - Determine the appropriate "category" / "initiative_type" (e.g. Sanitation, Infrastructure, Safety, etc.).
    - Determine the appropriate "severity" (Minor, Moderate, Severe, Critical).
  * If this is a document photo (e.g., government letter, utility bill, id proof, municipal notice):
    - Read the text from the document (OCR).
    - Extract any relevant dates, complaint descriptions, reference numbers, or names into the corresponding fields.
  * In "next_question", acknowledge what you observed in the photo/document (e.g., "I see the photo of the pothole you uploaded...") so the citizen knows the AI has recognized it.
`;
  }

  return `
You are a civic form-filling assistant for CIVIC-KALKI, helping a citizen complete a ${session.capability} form.
Your job is to extract field values from the citizen's message and any attached image/document, and determine what to ask next.

FORM PARAMETERS (text and choice fields):
${paramDetails}

CURRENT FILL STATUS:
${filledSummary}

RELEVANT CONVERSATION:
${conversationText || '(start of conversation)'}

CITIZEN'S LATEST MESSAGE:
"${userMessage}"
${fileInstructions}
INSTRUCTIONS:
1. Extract ANY parameter values present in the citizen's message or observable in the attached photo/document. Map them to the correct integer parameter_id.
   For select/dropdown fields, normalize the value to the closest valid choice listed above.
   Use the integer parameter_id as the string key in extracted_values.
2. LOCATION IS A MANDATORY ATTRIBUTE AND MUST BE CONFIRMED WITH THE CITIZEN:
   - A citizen may currently be in one area (e.g. Dhayari) but conduct an initiative or lodge a complaint for ANY other area (e.g. Shivajinagar, Kothrud, Camp, FC Road, etc.).
   - NEVER silently assume the incident or initiative takes place at the device location without the citizen's explicit confirmation!
   - Did the citizen's text explicitly specify or confirm where this takes place? (e.g. "on JM Road", "in Kothrud", "in Dhayari", "conduct at FC Road", "yes in Dhayari")
     * If YES: Set "location" to that place, "area" to the neighborhood, and "location_confirmed": true.
     * If NO:
       - Set "location_confirmed": false.
       - Do NOT set ready_for_confirmation to true!
       - In "next_question", ask the citizen at what area or location they would like to conduct this initiative or where the issue occurred:
         For an initiative: "At what area or location would you like to bring this into action? (We noticed your location is [detected area] — would you like to conduct it in [detected area], or somewhere else like FC Road or Kothrud?)"
         For a grievance: "At what location or street did this issue occur? (We noticed your location is [detected area] — did this happen in [detected area], or at another street/landmark?)"
3. If all REQUIRED parameters AND location are confirmed by the citizen, set ready_for_confirmation to true and next_question to null.
4. If there are still missing REQUIRED parameters or unconfirmed location, ask for the SINGLE MOST IMPORTANT missing one. ONE question only.
5. If the citizen provided a value for an OPTIONAL field, capture it.

MISSING REQUIRED PARAMETERS (ask about these first, one at a time):
${missingRequired.map(p => `- ${p.label} (parameter_id: ${p.parameter_id})`).join('\n') || '(none — all required fields are filled)'}

Respond with ONLY a single raw valid JSON object. No markdown, no extra text.

Required schema:
{
  "extracted_values": { "<parameter_id_as_string>": "<value>" },
  "location": "<specific incident street, address or landmark, or null if unknown>",
  "area": "<neighborhood or ward name, or null>",
  "location_confirmed": <true if citizen explicitly named or confirmed this place in text, otherwise false>,
  "next_question": "<string question to ask citizen, or null if all required fields and location are confirmed>",
  "ready_for_confirmation": <true|false>
}
`.trim();
}

/**
 * Call Gemini to extract form field values from a user message and optional attached file.
 * @param {AgentSession} session
 * @param {string} userMessage
 * @param {Object|null} attachedFile
 * @returns {Promise<{extracted_values:Object, next_question:string|null, ready_for_confirmation:boolean}>}
 */
async function extractFormValues(session, userMessage, attachedFile = null) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return { extracted_values: {}, next_question: 'I\'m unable to process your request right now (AI service unavailable). Please try again later or use the manual form.', ready_for_confirmation: false };
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const CANDIDATE_MODELS = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];
  let model = genAI.getGenerativeModel({ model: CANDIDATE_MODELS[0] });
  const promptText = buildFormFillPrompt(session, userMessage, attachedFile);

  // Prepare multimodal content if an image file is attached
  let contentPayload = promptText;
  if (attachedFile && attachedFile.diskPath && fs.existsSync(attachedFile.diskPath) && attachedFile.mimeType && attachedFile.mimeType.startsWith('image/')) {
    try {
      const imgBuffer = fs.readFileSync(attachedFile.diskPath);
      const imagePart = {
        inlineData: {
          data: imgBuffer.toString('base64'),
          mimeType: attachedFile.mimeType,
        },
      };
      contentPayload = [promptText, imagePart];
    } catch (readErr) {
      console.warn('[AGENT FORM FILL] Failed to read image for vision analysis:', readErr.message);
      contentPayload = promptText;
    }
  }

  let parsed = null;

  try {
    const result = await model.generateContent(contentPayload);
    const rawText = result.response.text();
    parsed = JSON.parse(cleanJsonResponseText(rawText));
    if (!parsed || typeof parsed.ready_for_confirmation !== 'boolean') {
      throw new Error('Response missing ready_for_confirmation boolean');
    }
    if (!parsed.extracted_values) parsed.extracted_values = {};
    if (parsed.next_question === undefined) parsed.next_question = null;
    parsed.location = parsed.location || null;
    parsed.area = parsed.area || null;
    parsed.location_confirmed = Boolean(parsed.location_confirmed);
  } catch (err) {
    console.warn('[AGENT FORM FILL] Attempt 1 failed:', err.message);
    try {
      const retryPrompt = `${promptText}\n\nATTENTION: Previous response failed. Return ONLY a valid JSON object with keys: extracted_values (object), next_question (string or null), ready_for_confirmation (boolean).`;
      const retryResult = await model.generateContent(retryPrompt);
      const rawRetry = retryResult.response.text();
      parsed = JSON.parse(cleanJsonResponseText(rawRetry));
      if (!parsed || typeof parsed.ready_for_confirmation !== 'boolean') {
        throw new Error('Retry response still invalid');
      }
      if (!parsed.extracted_values) parsed.extracted_values = {};
      if (parsed.next_question === undefined) parsed.next_question = null;
    } catch (err2) {
      console.error('[AGENT FORM FILL] Gemini extraction failed, using resilient conversational recovery:', err2.message);
      // Resilient fallback: If the assistant previously asked for a required parameter,
      // bind the citizen's response directly to that parameter instead of discarding it!
      const cleanUserMsg = userMessage.replace(/\[(?:User )?location:[^\]]+\]/gi, '').trim();
      const currentMissing = session.requiredParams.find(p => session.draft[p.parameter_id] === undefined);
      const extracted_values = {};

      if (currentMissing && cleanUserMsg) {
        extracted_values[String(currentMissing.parameter_id)] = cleanUserMsg;
      }

      // Check remaining missing fields
      const nextMissing = session.requiredParams.find(p =>
        session.draft[p.parameter_id] === undefined && String(p.parameter_id) !== String(currentMissing?.parameter_id)
      );

      const deviceLoc = parseDeviceLocation(userMessage);
      const detectedArea = (deviceLoc && deviceLoc.location) ? deviceLoc.location : (session.area || 'Pune');

      let nextQ = null;
      if (nextMissing) {
        if (nextMissing.options && Array.isArray(nextMissing.options.choices || nextMissing.options)) {
          const choices = (nextMissing.options.choices || nextMissing.options).join(', ');
          nextQ = `Understood! What is the ${nextMissing.label}? (Options: ${choices})`;
        } else {
          nextQ = `Understood! What is the ${nextMissing.label}?`;
        }
      } else if (!session.locationConfirmed) {
        nextQ = session.capability === 'Movement'
          ? `At what area or location would you like to bring this initiative into action? (I noticed your location is ${detectedArea} — would you like to conduct it in ${detectedArea}, or somewhere else like FC Road, Kothrud, or Shivajinagar?)`
          : `At what area or location did this happen? (I noticed your location is ${detectedArea} — did this happen in ${detectedArea}, or at another street/landmark?)`;
      }

      return {
        extracted_values,
        location: null,
        area: null,
        location_confirmed: false,
        next_question: nextQ,
        ready_for_confirmation: !nextMissing && session.locationConfirmed,
      };
    }
  }

  return parsed;
}

// ── Confirmation summary builder ──────────────────────────────────────────────

/**
 * Build a human-readable plain-text summary of the draft (uses labels, not IDs).
 * Includes both text parameters and attached evidence files.
 * @param {AgentSession} session
 * @returns {Array<{label:string, value:string, mandatory:boolean, isFile?:boolean}>}
 */
function buildConfirmationSummary(session) {
  const lines = [];
  for (const param of session.allTextParams) {
    const val = session.draft[param.parameter_id];
    if (val !== undefined && val !== null && val !== '') {
      lines.push({ label: param.label, value: val, mandatory: param.mandatory, isFile: false });
    }
  }
  // Prominently display incident location in the review summary table
  if (session.location) {
    lines.push({ label: 'Location / Landmark', value: session.location, mandatory: true, isFile: false });
  } else if (session.area) {
    lines.push({ label: 'Area / Neighborhood', value: session.area, mandatory: true, isFile: false });
  }

  for (const pf of (session.pendingFiles || [])) {
    lines.push({ label: pf.label || 'Attached File', value: `📎 ${pf.originalName}`, mandatory: false, isFile: true });
  }
  return lines;
}

// ── Submission ────────────────────────────────────────────────────────────────

/**
 * Submit the draft entity to the existing POST /entities and POST /entities/:id/values endpoints.
 * Also registers any uploaded files in FileRepository and ParameterValue (same as POST /files/upload).
 * Calls POST /entities/:id/transition to move draft → submitted.
 * Writes an AuditLog entry using the existing Prisma schema.
 *
 * @param {AgentSession} session
 * @param {string} sessionId
 * @returns {Promise<{entity_id:number, name:string, status:string, files?:Array<string>}>}
 */
async function submitDraft(session, sessionId) {
  const name = synthesizeEntityName(session.capability, session.draft, session.allTextParams, '', session.location);

  // Build location/area from draft if available
  const paramByKey = {};
  for (const p of session.allTextParams) {
    paramByKey[p.field_key] = session.draft[p.parameter_id];
  }
  const location = paramByKey['location'] || paramByKey['area'] || null;
  const area = paramByKey['area'] || paramByKey['category'] || null;

  // 1. Create the entity (draft status, same as manual form)
  const finalLocation = session.location ? String(session.location).trim() : (location ? String(location).trim() : null);
  const finalArea = session.area ? String(session.area).trim() : (area ? String(area).trim() : null);
  const entity = await prisma.entity.create({
    data: {
      entity_type_id: session.entityTypeId,
      owner_user_id: session.userId,
      name: name.trim(),
      location: finalLocation,
      area: finalArea,
      latitude: session.latitude != null ? session.latitude : null,
      longitude: session.longitude != null ? session.longitude : null,
      status: 'draft',
    },
    include: {
      entityType: { select: { entity_type_id: true, name: true } },
    },
  });

  const entityId = entity.entity_id;

  // 2. Save parameter values (batch — same as POST /entities/:id/values)
  const valuesToInsert = session.allTextParams
    .filter(p => session.draft[p.parameter_id] !== undefined && session.draft[p.parameter_id] !== null)
    .map(p => ({
      entity_id: entityId,
      parameter_id: p.parameter_id,
      value: String(session.draft[p.parameter_id]).trim(),
    }));

  if (valuesToInsert.length > 0) {
    await prisma.$transaction(
      valuesToInsert.map(v => prisma.parameterValue.create({ data: v }))
    );
  }

  // 3. Save pending file attachments to FileRepository & ParameterValue (same as POST /files/upload)
  if (Array.isArray(session.pendingFiles) && session.pendingFiles.length > 0) {
    for (const f of session.pendingFiles) {
      await prisma.fileRepository.create({
        data: {
          entity_id: entityId,
          parameter_id: f.parameter_id,
          file_name: f.originalName,
          path: f.storedName,
        },
      });

      await prisma.parameterValue.create({
        data: {
          entity_id: entityId,
          parameter_id: f.parameter_id,
          value: f.originalName,
        },
      });
    }
  }

  // 4. Transition: draft → submitted (same as POST /entities/:id/transition)
  await prisma.entity.update({
    where: { entity_id: entityId },
    data: { status: 'submitted' },
  });

  // 5. Write AuditLog — same schema as existing audit entries, source tagged in reason
  await prisma.auditLog.create({
    data: {
      entity_id: entityId,
      actor_user_id: session.userId,
      action: 'submitted',
      user: `user_id:${session.userId}`,
      old_status: 'draft',
      new_status: 'submitted',
      reason: `Agent-initiated submission via Conversational Agent (session: ${sessionId})`,
    },
  });

  return {
    entity_id: entityId,
    name: entity.name,
    status: 'submitted',
    entity_type: entity.entityType?.name || session.capability,
    files: (session.pendingFiles || []).map(f => f.originalName),
  };
}

// ── Affirmative reply detection ───────────────────────────────────────────────

const AFFIRMATIVE_SIGNALS = [
  'yes', 'yeah', 'yep', 'yup', 'sure', 'ok', 'okay', 'confirm', 'submit',
  'go ahead', 'proceed', 'do it', 'please submit', 'yes please', 'absolutely',
  'correct', 'that is correct', "that's right", 'affirmative', 'approved', 'agree',
  'looks good', 'looks correct', 'submit it',
];

function isAffirmativeReply(message) {
  const normalized = String(message || '').toLowerCase().trim();
  return AFFIRMATIVE_SIGNALS.some(sig => normalized.includes(sig));
}

// ── Clarification / guidance responses ───────────────────────────────────────

const GUIDANCE_RESPONSE = `I can help you with the following right now:

1. **Report a civic problem** — garbage, road damage, water supply, noise, or any public issue
   → Just tell me what the problem is and where it is, or attach a photo/document!

2. **Start a civic initiative** — community cleanup, awareness campaign, or neighborhood project
   → Tell me about your initiative idea.

3. **Check your request status** — find out what's happening with your previous submissions
   → Just say "what is the status of my requests" or "check my submissions".

What would you like to do?`;

const UNCLEAR_RESPONSE = `I'm not sure I understood that. Here's what I can help you with:

1. **Report a civic problem** (garbage, road issues, water supply, safety concerns — photos welcome!)
2. **Start a civic initiative** (community project, campaign, awareness drive)
3. **Check status of your previous requests**

Could you rephrase, or choose one of the above?`;

// ── Main exported function ────────────────────────────────────────────────────

/**
 * Process one turn of the citizen conversation.
 *
 * @param {string}  sessionId
 * @param {string}  userMessage
 * @param {Object}  user                 - { user_id, role } from JWT (req.user)
 * @param {Array}   priorIntentHistory   - conversationHistory from client for brand new sessions
 * @param {Object}  [attachedFile]       - { diskPath, storedName, originalName, mimeType, size }
 * @returns {Promise<{type:string, text:string, summary?:Array, entity_id?:number, ready?:boolean}>}
 */
async function continueFormFilling(sessionId, userMessage, user, priorIntentHistory = [], attachedFile = null) {
  const session = getSession(sessionId, user.user_id, user.role);

  // Record user's turn in conversation history
  const historyContent = attachedFile
    ? `${userMessage} [Uploaded: ${attachedFile.originalName}]`
    : userMessage;
  session.conversationHistory.push({ role: 'user', content: historyContent });

  // ── Phase: INTENT ────────────────────────────────────────────────────────────
  if (session.phase === 'intent') {
    const intent = attachedFile
      ? await routeIntent(userMessage, priorIntentHistory, attachedFile)
      : await routeIntent(userMessage, priorIntentHistory);

    // STATUS CHECK
    if (intent.action_type === 'status_check') {
      const submissions = await prisma.entity.findMany({
        where: { owner_user_id: user.user_id },
        orderBy: { entity_id: 'desc' },
        take: 5,
        include: { entityType: { select: { name: true } } },
      });

      session.phase = 'done';

      if (submissions.length === 0) {
        const reply = "You haven't made any submissions yet. You can report a civic problem or start an initiative — just tell me what you'd like to do!";
        session.conversationHistory.push({ role: 'agent', content: reply });
        return { type: 'status', text: reply };
      }

      const statusLabels = {
        draft: 'Draft (not submitted)',
        submitted: 'Submitted — awaiting coordinator review',
        coordinator_approved: 'Coordinator verified — awaiting Director approval',
        approved: 'Approved ✓',
        rejected: 'Rejected',
        deleted: 'Deleted',
      };

      const lines = submissions.map(e => {
        const label = statusLabels[e.status] || e.status;
        const typeName = e.entityType?.name || 'Request';
        return `• **${typeName} #${e.entity_id}** — "${e.name}"  \n  Status: ${label}`;
      });

      const reply = `Here are your recent submissions:\n\n${lines.join('\n\n')}`;
      session.conversationHistory.push({ role: 'agent', content: reply });
      return { type: 'status', text: reply };
    }

    // GUIDANCE
    if (intent.action_type === 'guidance') {
      session.phase = 'done'; // reset to allow new intent next turn
      session.conversationHistory.push({ role: 'agent', content: GUIDANCE_RESPONSE });
      return { type: 'guidance', text: GUIDANCE_RESPONSE };
    }

    // UNCLEAR / LOW CONFIDENCE
    if (intent.action_type === 'unclear' || intent.confidence === 'low') {
      session.phase = 'done';
      session.conversationHistory.push({ role: 'agent', content: UNCLEAR_RESPONSE });
      return { type: 'unclear', text: UNCLEAR_RESPONSE };
    }

    // REPORT / INITIATE — start form-filling
    const capability = intent.matched_capability; // 'Grievance' | 'Movement'
    const entityTypeId = await resolveEntityTypeId(capability);

    if (!entityTypeId) {
      const errMsg = `Sorry, the ${capability} module is not currently configured. Please use the manual form or contact support.`;
      session.phase = 'done';
      session.conversationHistory.push({ role: 'agent', content: errMsg });
      return { type: 'error', text: errMsg };
    }

    const formSchema = await loadFormSchemaForEntityType(entityTypeId);
    if (!formSchema) {
      const errMsg = `Sorry, the ${capability} form is not configured. Please use the manual form or contact support.`;
      session.phase = 'done';
      session.conversationHistory.push({ role: 'agent', content: errMsg });
      return { type: 'error', text: errMsg };
    }

    const { required, allText, fileParams } = extractParameters(formSchema);

    session.capability = capability;
    session.entityTypeId = entityTypeId;
    session.formId = formSchema.form_id;
    session.formSchema = formSchema;
    session.requiredParams = required;
    session.allTextParams = allText;
    session.fileParams = fileParams || [];
    session.pendingFiles = session.pendingFiles || [];
    session.draft = {};
    session.phase = 'collecting';

    // If an attachment accompanied this initial turn, associate it with a file parameter
    if (attachedFile) {
      const matched = matchFileToParameter(session.fileParams, attachedFile);
      if (matched) {
        session.pendingFiles.push({
          parameter_id: matched.parameter_id,
          label: matched.label,
          field_key: matched.field_key,
          diskPath: attachedFile.diskPath,
          storedName: attachedFile.storedName,
          originalName: attachedFile.originalName,
          mimeType: attachedFile.mimeType,
          size: attachedFile.size,
        });
        session.draft[matched.parameter_id] = attachedFile.originalName;
      }
    }

    // Immediately try to extract values from the first message + attachment
    const deviceLoc = parseDeviceLocation(userMessage);
    const fillResult = await extractFormValues(session, userMessage, attachedFile);

    // Merge extracted values into draft
    for (const [paramIdStr, value] of Object.entries(fillResult.extracted_values || {})) {
      const paramId = parseInt(paramIdStr, 10);
      if (!isNaN(paramId) && value !== null && value !== '') {
        session.draft[paramId] = value;
      }
    }

    // Check if citizen explicitly specified or confirmed location in their text
    const isExplicitLocation = hasExplicitLocationInText(userMessage) || Boolean(fillResult.location_confirmed);

    if (isExplicitLocation) {
      session.locationConfirmed = true;
      const resolvedLoc = resolveLocationAndCoords(fillResult.location, fillResult.area, deviceLoc);
      if (resolvedLoc.location) {
        session.location = resolvedLoc.location;
        session.area = resolvedLoc.area;
        if (resolvedLoc.latitude != null) session.latitude = resolvedLoc.latitude;
        if (resolvedLoc.longitude != null) session.longitude = resolvedLoc.longitude;
      }
    } else if (deviceLoc) {
      // Remember detected device area as candidate, but NOT confirmed until citizen says so!
      session.area = deviceLoc.area;
      if (!session.location) session.location = deviceLoc.location;
      if (deviceLoc.latitude != null) session.latitude = deviceLoc.latitude;
      if (deviceLoc.longitude != null) session.longitude = deviceLoc.longitude;
    }

    // If location is NOT yet confirmed by citizen, ask them for the area/location!
    if (!session.locationConfirmed && deviceLoc) {
      const detectedArea = deviceLoc.area || deviceLoc.location || 'Pune';
      const locQ = capability === 'Movement'
        ? `At what area or location would you like to bring this initiative into action? (I noticed your location is ${detectedArea} — would you like to conduct it in ${detectedArea}, or somewhere else like FC Road, Kothrud, or Shivajinagar?)`
        : `At what area or location did this happen? (I noticed your location is ${detectedArea} — did this happen in ${detectedArea}, or at another street/landmark?)`;

      const questionText = (fillResult.next_question && (fillResult.next_question.toLowerCase().includes('location') || fillResult.next_question.toLowerCase().includes('area') || fillResult.next_question.toLowerCase().includes('where')))
        ? fillResult.next_question
        : locQ;

      session.conversationHistory.push({ role: 'agent', content: questionText });
      return { type: 'question', text: questionText, capability, form_id: formSchema.form_id };
    }

    if (fillResult.ready_for_confirmation) {
      session.phase = 'confirming';
      const summary = buildConfirmationSummary(session);
      const confirmText = buildConfirmText(session, summary);
      session.conversationHistory.push({ role: 'agent', content: confirmText });
      return { type: 'confirm', text: confirmText, summary, ready: true };
    }

    const nextQ = fillResult.next_question || `Got it! Let me help you file a ${capability}. ${session.requiredParams.length > 0 ? `I'll need a few details. ${session.requiredParams[0].label}?` : 'Could you provide more details?'}`;
    session.conversationHistory.push({ role: 'agent', content: nextQ });
    return { type: 'question', text: nextQ, capability, form_id: formSchema.form_id };
  }

  // ── Phase: COLLECTING ────────────────────────────────────────────────────────
  if (session.phase === 'collecting') {
    // If a file was attached in this collecting turn, match and attach it
    if (attachedFile) {
      const matched = matchFileToParameter(session.fileParams, attachedFile);
      if (matched) {
        session.pendingFiles.push({
          parameter_id: matched.parameter_id,
          label: matched.label,
          field_key: matched.field_key,
          diskPath: attachedFile.diskPath,
          storedName: attachedFile.storedName,
          originalName: attachedFile.originalName,
          mimeType: attachedFile.mimeType,
          size: attachedFile.size,
        });
        session.draft[matched.parameter_id] = attachedFile.originalName;
      }
    }

    const deviceLoc = parseDeviceLocation(userMessage);
    const fillResult = await extractFormValues(session, userMessage, attachedFile);

    // Merge extracted values
    for (const [paramIdStr, value] of Object.entries(fillResult.extracted_values || {})) {
      const paramId = parseInt(paramIdStr, 10);
      if (!isNaN(paramId) && value !== null && value !== '') {
        session.draft[paramId] = value;
      }
    }

    // Check if citizen explicitly specified or confirmed location
    const isExplicitLocation = hasExplicitLocationInText(userMessage) || Boolean(fillResult.location_confirmed);

    if (isExplicitLocation) {
      session.locationConfirmed = true;
      const resolvedLoc = resolveLocationAndCoords(fillResult.location, fillResult.area, deviceLoc);
      if (resolvedLoc.location) {
        session.location = resolvedLoc.location;
        session.area = resolvedLoc.area;
        if (resolvedLoc.latitude != null) session.latitude = resolvedLoc.latitude;
        if (resolvedLoc.longitude != null) session.longitude = resolvedLoc.longitude;
      }
    }

    // Double-check all required fields are actually filled in draft
    const stillMissing = session.requiredParams.filter(p => !session.draft[p.parameter_id]);
    const actuallyReady = stillMissing.length === 0;

    // If form fields are ready but citizen has not confirmed location, ask for location!
    if (actuallyReady && !session.locationConfirmed && deviceLoc) {
      const detectedArea = deviceLoc.area || deviceLoc.location || 'Pune';
      const locQ = session.capability === 'Movement'
        ? `At what area or location would you like to bring this initiative into action? (I noticed your location is ${detectedArea} — would you like to conduct it in ${detectedArea}, or somewhere else like FC Road, Kothrud, or Shivajinagar?)`
        : `At what area or location did this happen? (I noticed your location is ${detectedArea} — did this happen in ${detectedArea}, or at another street/landmark?)`;

      session.conversationHistory.push({ role: 'agent', content: locQ });
      return { type: 'question', text: locQ };
    }

    if ((actuallyReady && session.locationConfirmed) || fillResult.ready_for_confirmation) {
      session.phase = 'confirming';
      const summary = buildConfirmationSummary(session);
      const confirmText = buildConfirmText(session, summary);
      session.conversationHistory.push({ role: 'agent', content: confirmText });
      return { type: 'confirm', text: confirmText, summary, ready: true };
    }

    const nextQ = fillResult.next_question || `Could you tell me your ${stillMissing[0]?.label || 'remaining details'}?`;
    session.conversationHistory.push({ role: 'agent', content: nextQ });
    return { type: 'question', text: nextQ };
  }

  // ── Phase: CONFIRMING ────────────────────────────────────────────────────────
  if (session.phase === 'confirming') {
    if (isAffirmativeReply(userMessage)) {
      // Submit!
      try {
        const result = await submitDraft(session, sessionId);
        session.phase = 'done';
        const fileCount = (result.files || []).length;
        const fileText = fileCount > 0 ? `\n📎 ${fileCount} file(s) attached: ${result.files.join(', ')}` : '';
        const successMsg = `✅ Your ${session.capability} has been submitted successfully!\n\n**Reference: #${result.entity_id}** — ${result.name}${fileText}\n\nYou can view and track it at any time from "My Requests".`;
        session.conversationHistory.push({ role: 'agent', content: successMsg });
        return {
          type: 'submitted',
          text: successMsg,
          entity_id: result.entity_id,
          entity_name: result.name,
          capability: session.capability,
          files: result.files,
        };
      } catch (err) {
        console.error('[AGENT SUBMIT] Submission failed:', err);
        const errMsg = `Sorry, the submission failed: ${err.message}. Please try again or use the manual form.`;
        session.conversationHistory.push({ role: 'agent', content: errMsg });
        return { type: 'error', text: errMsg };
      }
    }

    // Non-affirmative — check if user wants to cancel or change something
    const normalized = String(userMessage).toLowerCase().trim();
    if (normalized.includes('cancel') || normalized.includes('stop') || normalized.includes('no')) {
      session.phase = 'done';
      const cancelMsg = 'Okay, I\'ve cancelled this submission. Your information has not been saved. Feel free to start a new request anytime!';
      session.conversationHistory.push({ role: 'agent', content: cancelMsg });
      return { type: 'cancelled', text: cancelMsg };
    }

    // User might be editing — go back to collecting
    session.phase = 'collecting';
    const editMsg = 'No problem! Let me update that. ' + (await (async () => {
      const fillResult = await extractFormValues(session, userMessage, attachedFile);
      for (const [paramIdStr, value] of Object.entries(fillResult.extracted_values || {})) {
        const paramId = parseInt(paramIdStr, 10);
        if (!isNaN(paramId) && value !== null && value !== '') session.draft[paramId] = value;
      }
      const stillMissing = session.requiredParams.filter(p => !session.draft[p.parameter_id]);
      if (stillMissing.length === 0) {
        session.phase = 'confirming';
        const summary = buildConfirmationSummary(session);
        return buildConfirmText(session, summary);
      }
      return fillResult.next_question || `Could you confirm your ${stillMissing[0]?.label}?`;
    })());
    session.conversationHistory.push({ role: 'agent', content: editMsg });
    return { type: session.phase === 'confirming' ? 'confirm' : 'question', text: editMsg };
  }

  // ── Phase: DONE ──────────────────────────────────────────────────────────────
  // Session complete — start fresh with new intent
  session.phase = 'intent';
  session.capability = null;
  session.entityTypeId = null;
  session.formId = null;
  session.formSchema = null;
  session.requiredParams = [];
  session.allTextParams = [];
  session.fileParams = [];
  session.pendingFiles = [];
  session.draft = {};
  session.location = null;
  session.area = null;
  session.latitude = null;
  session.longitude = null;
  session.locationConfirmed = false;

  const freshReply = 'Is there anything else I can help you with? I can help you report a problem, start an initiative, or check your request status.';
  session.conversationHistory.push({ role: 'agent', content: freshReply });
  return { type: 'guidance', text: freshReply };
}

function buildConfirmText(session, summary) {
  const lines = summary.map(s => `• **${s.label}**: ${s.value}`).join('\n');
  const filesList = (session.pendingFiles || []).map(f => f.originalName);
  const fileNote = filesList.length > 0
    ? `\n\n📎 **Attached files:** ${filesList.join(', ')} (will be submitted with this request)`
    : '\n\n_Tip: You can attach photo/document evidence directly here in chat, or after submission from "My Requests"._';
  return `Here's a summary of your ${session.capability} submission:\n\n${lines}${fileNote}\n\n**Shall I submit this?** (Reply "yes" to confirm or "no" to cancel)`;
}

module.exports = {
  continueFormFilling,
  clearSession,
  matchFileToParameter,
  // Exported for testing
  _sessions: sessions,
  _extractParameters: extractParameters,
  _isAffirmativeReply: isAffirmativeReply,
  _synthesizeEntityName: synthesizeEntityName,
};
