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
function synthesizeEntityName(capability, draft, allTextParams, fallbackMessage = '') {
  // Try to find a location or category value to make a meaningful name
  const paramByKey = {};
  for (const p of allTextParams) {
    paramByKey[p.field_key] = draft[p.parameter_id];
  }

  const location = paramByKey['location'] || paramByKey['area'] || paramByKey['landmark'] || null;
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
    .join('\n');

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
2. If all REQUIRED parameters are now filled (including any just extracted), set ready_for_confirmation to true and next_question to null.
3. If there are still missing REQUIRED parameters, ask for the SINGLE MOST IMPORTANT missing one.
   Ask in plain, friendly language. Do NOT dump a list of all missing fields. ONE question only.
4. For location/area information, use a specific parameter if it exists, or note it for the entity name.
5. If the citizen provided a value for an OPTIONAL field, capture it. But only ask about optional fields if all required ones are filled.

MISSING REQUIRED PARAMETERS (ask about these first, one at a time):
${missingRequired.map(p => `- ${p.label} (parameter_id: ${p.parameter_id})`).join('\n') || '(none — all required fields are filled)'}

Respond with ONLY a single raw valid JSON object. No markdown, no extra text.

Required schema:
{
  "extracted_values": { "<parameter_id_as_string>": "<value>" },
  "next_question": "<string question to ask citizen, or null if all required fields filled>",
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
  const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });
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
      console.error('[AGENT FORM FILL] Attempt 2 failed:', err2.message);
      // Safe fallback: ask for next missing required field manually
      const nextMissing = session.requiredParams.find(p => session.draft[p.parameter_id] === undefined);
      return {
        extracted_values: {},
        next_question: nextMissing ? `Could you tell me your ${nextMissing.label}?` : null,
        ready_for_confirmation: !nextMissing,
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
  const name = synthesizeEntityName(session.capability, session.draft, session.allTextParams);

  // Build location/area from draft if available
  const paramByKey = {};
  for (const p of session.allTextParams) {
    paramByKey[p.field_key] = session.draft[p.parameter_id];
  }
  const location = paramByKey['location'] || paramByKey['area'] || null;
  const area = paramByKey['area'] || paramByKey['category'] || null;

  // 1. Create the entity (draft status, same as manual form)
  const entity = await prisma.entity.create({
    data: {
      entity_type_id: session.entityTypeId,
      owner_user_id: session.userId,
      name: name.trim(),
      location: location ? String(location).trim() : null,
      area: area ? String(area).trim() : null,
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
    const fillResult = await extractFormValues(session, userMessage, attachedFile);

    // Merge extracted values into draft
    for (const [paramIdStr, value] of Object.entries(fillResult.extracted_values || {})) {
      const paramId = parseInt(paramIdStr, 10);
      if (!isNaN(paramId) && value !== null && value !== '') {
        session.draft[paramId] = value;
      }
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

    const fillResult = await extractFormValues(session, userMessage, attachedFile);

    // Merge extracted values
    for (const [paramIdStr, value] of Object.entries(fillResult.extracted_values || {})) {
      const paramId = parseInt(paramIdStr, 10);
      if (!isNaN(paramId) && value !== null && value !== '') {
        session.draft[paramId] = value;
      }
    }

    // Double-check all required fields are actually filled in draft
    const stillMissing = session.requiredParams.filter(p => !session.draft[p.parameter_id]);
    const actuallyReady = stillMissing.length === 0;

    if (actuallyReady || fillResult.ready_for_confirmation) {
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
