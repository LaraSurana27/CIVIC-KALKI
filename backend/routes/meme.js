/**
 * CIVIC-KALKI � Meme Studio API Routes (Sections 1-8)
 *
 * Routes:
 *   GET  /meme/config                      � allowed categories config (public)
 *   GET  /meme/eligibility/:issueId         � eligibility gate check
 *   POST /meme/captions                     � generate AI captions
 *   POST /meme/safety-check                 � run deterministic + AI safety on user caption
 *   POST /meme/campaigns                    � create campaign entity (draft)
 *   PUT  /meme/campaigns/:id               � update draft campaign
 *   POST /meme/campaigns/:id/submit        � submit for moderation
 *   GET  /meme/campaigns                   � list campaigns (filtered)
 *   GET  /meme/campaigns/:id               � get single campaign
 *   POST /meme/campaigns/:id/transition    � moderation transitions
 *   POST /meme/campaigns/:id/report        � report a published meme
 *   POST /meme/campaigns/:id/event         � record engagement event
 *   GET  /meme/campaigns/:id/impact        � impact counts
 *   GET  /meme/feed                        � Civic Buzz published feed
 *   GET  /meme/my                          � My memes (auth required)
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
const UPLOAD_DIR = path.join(__dirname, '..', 'campaign_uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const memeUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => cb(null, ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const crypto = require('crypto');
const prisma = require('../db');
const { verifyToken, checkRole } = require('../middleware/auth');
const { generateCaptions } = require('../services/memeCaption');
const { deterministicFilter, aiSafetyClassifier } = require('../services/memeSafety');
const {
  PUBLICLY_VISIBLE_STATUSES,
  HUMOR_ALLOWED_CATEGORIES,
  ALLOWED_CATEGORIES,
  SAFETY_SENSITIVE_CATEGORIES,
  NO_MEME_CATEGORIES,
  RATE_LIMITS,
  TEMPLATES,
} = require('../services/memeConfig');
const { executeWorkflowTransition } = require('../services/workflowEngine');

function createError(msg, code) {
  const e = new Error(msg);
  e.statusCode = code;
  return e;
}

function parsePositiveInt(v, f) {
  const n = Number(v);
  if (!Number.isInteger(n) || n <= 0) throw createError(`"${f}" must be a positive integer.`, 400);
  return n;
}

// Helper: get campaign entity type id (cached per-process)
let _campaignEntityTypeId = null;
async function getCampaignEntityTypeId() {
  if (_campaignEntityTypeId) return _campaignEntityTypeId;
  const et = await prisma.entityType.findFirst({ where: { name: 'Civic Campaign' } });
  if (!et) throw createError('EntityType "Civic Campaign" not seeded. Run node scripts/seedMeme.js', 500);
  _campaignEntityTypeId = et.entity_type_id;
  return _campaignEntityTypeId;
}

// Helper: resolve issue category from entity
function getIssueCategory(entity) {
  // Try ParameterValue with field_key 'category'
  const catPv = entity.parameterValues?.find((pv) =>
    (pv.parameterMaster?.field_key || '').toLowerCase() === 'category' ||
    (pv.parameterMaster?.label || '').toLowerCase() === 'category'
  );
  if (catPv?.value) return catPv.value.toLowerCase();
  // Fall back to EntityType name
  return (entity.entityType?.name || '').toLowerCase();
}

// Helper: check eligibility and return { eligible, templateTypes, reason }
function checkCategoryEligibility(category) {
  const cat = String(category || '').trim().toLowerCase();
  if (!ALLOWED_CATEGORIES.includes(cat)) {
    return { eligible: false, reason: 'Choose a category from the Civic Buzz category list.', templateTypes: [] };
  }
  if (NO_MEME_CATEGORIES.some((nc) => cat.includes(nc.toLowerCase()))) {
    return {
      eligible: false,
      reason: 'This category of issue is not eligible for meme campaigns. For serious matters (crime, harassment, communal issues), please file a Grievance instead.',
      templateTypes: [],
    };
  }

  const isSafetySensitive = SAFETY_SENSITIVE_CATEGORIES.some((sc) => cat.includes(sc.toLowerCase()));
  const isHumorAllowed = HUMOR_ALLOWED_CATEGORIES.some((hc) => cat.includes(hc.toLowerCase()));

  let templateTypes;
  if (isSafetySensitive) {
    templateTypes = ['awareness', 'cta'];
  } else if (isHumorAllowed) {
    templateTypes = ['relatable', 'awareness', 'cta'];
  } else {
    templateTypes = ['awareness', 'cta'];
  }

  return { eligible: true, templateTypes, category };
}

function canModerateCampaign(user, campaign) {
  if (!user || !campaign) return false;
  if (user.role === 'admin') return true;
  if (user.role === 'coordinator_general') return campaign.area === 'Unassigned';
  return user.role === 'coordinator_area' &&
    Boolean(user.assignedArea || user.assigned_area) &&
    String(user.assignedArea || user.assigned_area).toLowerCase() === String(campaign.area || '').toLowerCase();
}

function parameterValueMap(parameterValues) {
  return Object.fromEntries(parameterValues.map((value) => [value.parameterMaster?.field_key, value.value]));
}

async function saveCampaignParameters(campaignId, entityTypeId, values, client = prisma) {
  const parameters = await client.parameterMaster.findMany({
    where: {
      subsectionMaster: {
        sectionMaster: { formMaster: { entity_type_id: entityTypeId } },
      },
    },
    select: { parameter_id: true, field_key: true },
  });
  const parameterIds = new Map(parameters.map((parameter) => [parameter.field_key, parameter.parameter_id]));
  const writes = values.flatMap(([field, value]) => {
    const parameterId = parameterIds.get(field);
    if (!parameterId) return [];
    return [client.parameterValue.upsert({
      where: { entity_id_parameter_id: { entity_id: campaignId, parameter_id: parameterId } },
      create: { entity_id: campaignId, parameter_id: parameterId, value: value === null ? null : String(value) },
      update: { value: value === null ? null : String(value) },
    })];
  });
  if (client === prisma) await prisma.$transaction(writes);
  else await Promise.all(writes);
}

// Helper: check eligibility and return { eligible, templateTypes, reason }
async function checkEligibility(issueId) {
  const issue = await prisma.entity.findUnique({
    where: { entity_id: Number(issueId) },
    include: {
      entityType: { select: { name: true } },
      parameterValues: { include: { parameterMaster: { select: { field_key: true, label: true } } } },
    },
  });

  if (!issue) return { eligible: false, reason: 'Issue not found.', templateTypes: [] };

  if (!PUBLICLY_VISIBLE_STATUSES.includes(issue.status || '')) {
    return {
      eligible: false,
      reason: 'This issue has not yet been verified and approved. Memes can only be created for publicly visible issues.',
      templateTypes: [],
    };
  }

  const category = await getIssueCategory(issue);
  const catResult = checkCategoryEligibility(category);
  return { ...catResult, issue, category };
}

async function normalizeLocality(locality) {
  if (!locality || String(locality).trim().toLowerCase() === 'unassigned') return 'Unassigned';
  const found = await prisma.jurisdictionMaster.findFirst({
    where: { status: 'active', name: { equals: String(locality).trim(), mode: 'insensitive' } },
    select: { name: true },
  });
  if (!found) throw createError('Choose a locality from the available area list.', 400);
  return found.name;
}

// Helper: rate limit check
async function checkRateLimit(userId, action) {
  const now = new Date();
  const dayStart = new Date(now);
  dayStart.setHours(0, 0, 0, 0);
  const hourAgo = new Date(now.getTime() - 3600 * 1000);

  if (action === 'caption') {
    const hourlyCaptionGenerations = await prisma.aIExecutionLog.count({
      where: {
        requested_by_user_id: Number(userId),
        analysis_type: 'meme_caption',
        created_date: { gte: hourAgo },
      },
    });
    if (hourlyCaptionGenerations < RATE_LIMITS.maxCaptionGenerationsPerHour) return { blocked: false };
    return {
      blocked: true,
      reason: `You can generate AI captions at most ${RATE_LIMITS.maxCaptionGenerationsPerHour} times per hour. Please wait or write your own caption.`,
    };
  }

  const campaignTypeId = await getCampaignEntityTypeId();
  const todayPosts = await prisma.auditLog.count({
    where: {
      actor_user_id: Number(userId),
      action: 'created',
      datetime: { gte: dayStart },
      entity: { entity_type_id: campaignTypeId },
    },
  });
  if (todayPosts >= RATE_LIMITS.maxCampaignsPerDay) {
    return {
      blocked: true,
      reason: `You can create at most ${RATE_LIMITS.maxCampaignsPerDay} meme campaigns per day. Please try again tomorrow.`,
    };
  }
  return { blocked: false };
}

// -- GET /meme/config � public config ----------------------------------------
router.get('/config', async (_req, res, next) => {
  try {
    const areas = await prisma.jurisdictionMaster.findMany({
      where: { status: 'active' },
      select: { name: true },
      distinct: ['name'],
      orderBy: { name: 'asc' },
    });
    return res.json({
      success: true,
      data: {
        templates: TEMPLATES,
        categories: ALLOWED_CATEGORIES,
        humor_allowed_categories: HUMOR_ALLOWED_CATEGORIES,
        safety_sensitive_categories: SAFETY_SENSITIVE_CATEGORIES,
        no_meme_categories: NO_MEME_CATEGORIES,
        localities: areas.map((area) => area.name),
      },
    });
  } catch (err) {
    return next(err);
  }
});

// -- GET /meme/eligibility/:issueId � check eligibility gate -----------------
router.get('/eligibility/:issueId', verifyToken, async (req, res, next) => {
  try {
    const issueId = parsePositiveInt(req.params.issueId, 'issueId');
    const result = await checkEligibility(issueId);
    return res.json({ success: true, data: result });
  } catch (err) {
    return next(err);
  }
});

router.get('/my-issues', verifyToken, async (req, res, next) => {
  try {
    const issues = await prisma.entity.findMany({
      where: {
        owner_user_id: Number(req.user.user_id),
        status: 'approved',
        entityType: { name: { not: 'Civic Campaign' } },
      },
      orderBy: { entity_id: 'desc' },
      include: {
        entityType: { select: { name: true } },
        parameterValues: { include: { parameterMaster: { select: { field_key: true } } } },
      },
    });
    const result = issues.map((issue) => ({
      issue_id: issue.entity_id,
      name: issue.name,
      category: getIssueCategory(issue),
      locality: issue.area || 'Unassigned',
    })).filter((issue) => checkCategoryEligibility(issue.category).eligible);
    return res.json({ success: true, data: result });
  } catch (err) {
    return next(err);
  }
});

// -- POST /meme/captions � AI caption generation ------------------------------
router.post('/captions', verifyToken, async (req, res, next) => {
  try {
    const { issue_id, category, locality } = req.body;
    const template = req.body.template || req.body.template_type;
    if (!template || !TEMPLATES.includes(template)) {
      return next(createError(`"template" must be one of: ${TEMPLATES.join(', ')}`, 400));
    }

    const userId = req.user.user_id;

    // Rate limit on caption generation
    const rl = await checkRateLimit(userId, 'caption');
    if (rl.blocked) return next(createError(rl.reason, 429));

    let linkedIssue = null;
    let resolvedCategory = category || '';
    let resolvedLocality = await normalizeLocality(locality);
    let resolvedDesc = '';

    if (issue_id) {
      const targetEntityId = parsePositiveInt(issue_id, 'issue_id');
      const elig = await checkEligibility(targetEntityId);
      if (!elig.eligible) return next(createError(elig.reason, 403));
      if (Number(elig.issue.owner_user_id) !== Number(userId)) {
        return next(createError('You can only link one of your own approved issues.', 403));
      }
      if (!elig.templateTypes.includes(template)) {
        return next(createError(
          `Template "${template}" is not available for this issue category. Available templates: ${elig.templateTypes.join(', ')}`,
          403
        ));
      }
      linkedIssue = elig.issue;
      resolvedCategory = elig.category;
      resolvedLocality = linkedIssue.area || 'Unassigned';
      resolvedDesc = linkedIssue.name || '';
    } else {
      const elig = checkCategoryEligibility(resolvedCategory);
      if (!elig.eligible) return next(createError(elig.reason, 403));
      if (!elig.templateTypes.includes(template)) {
        return next(createError(
          `Template "${template}" is not available for category "${resolvedCategory}". Available: ${elig.templateTypes.join(', ')}`,
          403
        ));
      }
    }

    const result = await generateCaptions(
      { category: resolvedCategory, locality: resolvedLocality, description: resolvedDesc },
      template,
      userId
    );
    return res.json({ success: true, data: result });
  } catch (err) {
    return next(err);
  }
});

// -- POST /meme/safety-check � validate caption (det + AI) --------------------
router.post('/safety-check', verifyToken, async (req, res, next) => {
  try {
    const { headline, caption, issue_id } = req.body;
    if (!caption && !headline) return next(createError('At least one of "headline" or "caption" is required.', 400));

    const detResult = deterministicFilter(headline || '', caption || '');

    let aiResult = { safe: null, violations: [], status: 'skipped' };
    if (detResult.passed) {
      // Only run AI check if deterministic passes
      aiResult = await aiSafetyClassifier(
        headline || '',
        caption || '',
        issue_id ? Number(issue_id) : null,
        req.user.user_id
      );
    }

    const overallPassed = detResult.passed && (aiResult.status === 'passed' || aiResult.status === 'skipped');

    return res.json({
      success: true,
      data: {
        passed: overallPassed,
        deterministic: detResult,
        ai_safety: aiResult,
      },
    });
  } catch (err) {
    return next(err);
  }
});

// -- POST /meme/campaigns � create campaign entity (draft) --------------------
router.post('/campaigns', verifyToken, checkRole(['citizen']), async (req, res, next) => {
  try {
    const { issue_id, category, locality, headline, caption, caption_source, original_ai_suggestion, attestation_accepted } = req.body;
    const template = req.body.template || req.body.template_type;

    if (!template || !headline || !caption || !category) {
      return next(createError('template, category, headline, and caption are required.', 400));
    }
    if (!['ai', 'ai_edited', 'manual'].includes(caption_source || 'manual')) {
      return next(createError('caption_source must be ai, ai_edited, or manual.', 400));
    }
    if (attestation_accepted !== true) {
      return next(createError('You must accept the photo attestation to submit a meme campaign.', 400));
    }

    const userId = req.user.user_id;

    // Rate limit on campaigns
    const rl = await checkRateLimit(userId, 'post');
    if (rl.blocked) return next(createError(rl.reason, 429));

    let issueId = null;
    let elig = null;
    let issue = null;
    let campaignArea = await normalizeLocality(locality);
    let campaignJurisdictionId = null;
    let campaignName = '';

    if (issue_id) {
      issueId = parsePositiveInt(issue_id, 'issue_id');
      elig = await checkEligibility(issueId);
      if (!elig.eligible) return next(createError(elig.reason, 403));
      issue = elig.issue;
      if (Number(issue.owner_user_id) !== Number(userId)) {
        return next(createError('You can only link one of your own approved issues.', 403));
      }
      if (String(elig.category).toLowerCase() !== String(category).trim().toLowerCase()) {
        return next(createError('The selected category must match the linked issue category.', 400));
      }
      campaignArea = issue?.area || 'Unassigned';
      campaignJurisdictionId = issue?.jurisdiction_id || null;
      campaignName = `Civic Campaign — ${issue?.entityType?.name || 'Issue'} in ${campaignArea || 'the locality'}`;
    } else {
      elig = checkCategoryEligibility(category);
      if (!elig.eligible) return next(createError(elig.reason, 403));
      campaignName = `Civic Campaign — ${category} in ${campaignArea}`;
    }

    if (!elig.templateTypes.includes(template)) {
      return next(createError(`Template "${template}" not allowed for this category.`, 403));
    }

    // Deterministic safety (always runs on submission)
    const detResult = deterministicFilter(headline, caption);
    if (!detResult.passed) {
      return next(createError(
        `Caption did not pass safety check: ${detResult.violations.join('; ')}`,
        400
      ));
    }

    // AI safety classifier (fail closed)
    const aiSafety = await aiSafetyClassifier(headline, caption, issueId, userId);

    const campaignTypeId = await getCampaignEntityTypeId();

    // Create entity (status = draft)
    const campaign = await prisma.entity.create({
      data: {
        entity_type_id: campaignTypeId,
        owner_user_id: Number(userId),
        jurisdiction_id: campaignJurisdictionId,
        name: campaignName,
        area: campaignArea,
        status: 'draft',
      },
    });

    // Store metadata as ParameterValues using the seeded parameter field_keys
    const params = await prisma.parameterMaster.findMany({
      where: {
        subsectionMaster: {
          sectionMaster: {
            formMaster: { entity_type_id: campaignTypeId },
          },
        },
      },
    });

    const paramMap = {};
    for (const p of params) paramMap[p.field_key] = p.parameter_id;

    const pvData = [
      { key: 'linked_entity_id', value: issueId ? String(issueId) : null },
      { key: 'template', value: template },
      { key: 'headline', value: String(headline).substring(0, 60) },
      { key: 'caption', value: String(caption).substring(0, 140) },
      { key: 'category', value: String(category) },
      { key: 'locality', value: String(campaignArea) },
      { key: 'caption_source', value: caption_source || 'manual' },
      { key: 'original_ai_suggestion', value: original_ai_suggestion ? JSON.stringify(original_ai_suggestion).substring(0, 2000) : null },
      { key: 'deterministic_result', value: JSON.stringify(detResult) },
      { key: 'ai_safety_result', value: JSON.stringify(aiSafety) },
      { key: 'attestation_accepted', value: attestation_accepted ? 'true' : 'false' },
    ];

    for (const { key, value } of pvData) {
      if (paramMap[key] && value !== null && value !== undefined) {
        await prisma.parameterValue.upsert({
          where: { entity_id_parameter_id: { entity_id: campaign.entity_id, parameter_id: paramMap[key] } },
          create: { entity_id: campaign.entity_id, parameter_id: paramMap[key], value },
          update: { value },
        });
      }
    }

    // Audit log — actor is the citizen (human)
    await prisma.auditLog.create({
      data: {
        entity_id: campaign.entity_id,
        actor_user_id: Number(userId),
        action: 'created',
        user: req.user.name || 'citizen',
        old_status: null,
        new_status: 'draft',
        reason: 'Civic Campaign draft created',
      },
    });

    return res.status(201).json({ success: true, data: { campaign, safety: { deterministic: detResult, ai_safety: aiSafety } } });
  } catch (err) {
    return next(err);
  }
});

router.put('/campaigns/:id', verifyToken, checkRole(['citizen']), async (req, res, next) => {
  try {
    const campaignId = parsePositiveInt(req.params.id, 'id');
    const campaign = await prisma.entity.findUnique({
      where: { entity_id: campaignId },
      include: { entityType: { select: { name: true } } },
    });
    if (!campaign || campaign.entityType?.name !== 'Civic Campaign') return next(createError('Campaign not found.', 404));
    if (Number(campaign.owner_user_id) !== Number(req.user.user_id)) return next(createError('You can only edit your own drafts.', 403));
    if (campaign.status !== 'draft') return next(createError('Only draft campaigns can be edited.', 400));

    const { category, locality, headline, caption, caption_source, original_ai_suggestion } = req.body;
    const template = req.body.template || req.body.template_type;
    const attestation = req.body.attestation_accepted === true;
    if (!category || !headline || !caption || !TEMPLATES.includes(template)) {
      return next(createError('category, headline, caption, and a valid template are required.', 400));
    }
    if (!attestation) return next(createError('You must accept the photo attestation.', 400));
    if (!['ai', 'ai_edited', 'manual'].includes(caption_source || 'manual')) {
      return next(createError('caption_source must be ai, ai_edited, or manual.', 400));
    }

    const eligibility = checkCategoryEligibility(category);
    if (!eligibility.eligible || !eligibility.templateTypes.includes(template)) {
      return next(createError(eligibility.reason || 'The selected template is not allowed for this category.', 400));
    }
    const linkedId = req.body.issue_id ? parsePositiveInt(req.body.issue_id, 'issue_id') : null;
    let area = await normalizeLocality(locality);
    let jurisdictionId = null;
    if (linkedId) {
      const linked = await checkEligibility(linkedId);
      if (!linked.eligible || Number(linked.issue.owner_user_id) !== Number(req.user.user_id)) {
        return next(createError('You can only link one of your own approved issues.', 403));
      }
      if (String(linked.category).toLowerCase() !== String(category).trim().toLowerCase()) {
        return next(createError('The selected category must match the linked issue category.', 400));
      }
      area = linked.issue.area || 'Unassigned';
      jurisdictionId = linked.issue.jurisdiction_id || null;
    }

    const deterministic = deterministicFilter(headline, caption);
    if (!deterministic.passed) return next(createError(deterministic.violations.join('; '), 400));
    const aiSafety = await aiSafetyClassifier(headline, caption, linkedId, req.user.user_id);
    const existing = await prisma.parameterValue.findMany({
      where: { entity_id: campaignId },
      include: { parameterMaster: { select: { field_key: true } } },
    });
    const previous = parameterValueMap(existing);
    const values = [
      ['photo_file_id', previous.photo_file_id],
      ['headline', headline],
      ['caption', caption],
      ['template', template],
      ['category', category],
      ['locality', area],
      ['linked_entity_id', linkedId],
      ['caption_source', caption_source || 'manual'],
      ['original_ai_suggestion', original_ai_suggestion ? JSON.stringify(original_ai_suggestion).substring(0, 2000) : null],
      ['deterministic_result', JSON.stringify(deterministic)],
      ['ai_safety_result', JSON.stringify(aiSafety)],
      ['attestation_accepted', 'true'],
    ];
    await prisma.$transaction(async (tx) => {
      await tx.entity.update({
        where: { entity_id: campaignId },
        data: { name: `Civic Campaign - ${category} in ${area}`, area, jurisdiction_id: jurisdictionId },
      });
      await saveCampaignParameters(campaignId, campaign.entity_type_id, values, tx);
      await tx.auditLog.create({
        data: {
          entity_id: campaignId,
          actor_user_id: Number(req.user.user_id),
          action: 'updated',
          user: req.user.name || 'citizen',
          old_status: 'draft',
          new_status: 'draft',
          reason: 'Civic Campaign draft updated',
        },
      });
    });
    return res.json({ success: true, data: { campaign_id: campaignId, safety: { deterministic, ai_safety: aiSafety } } });
  } catch (err) {
    return next(err);
  }
});

// -- POST /meme/campaigns/:id/submit — citizen submits for moderation ---------
router.post('/campaigns/:id/submit', verifyToken, checkRole(['citizen']), async (req, res, next) => {
  try {
    const campaignId = parsePositiveInt(req.params.id, 'id');
    const userId = req.user.user_id;

    const campaign = await prisma.entity.findUnique({
      where: { entity_id: campaignId },
      include: { entityType: true },
    });
    if (!campaign) return next(createError('Campaign not found.', 404));
    if (campaign.entityType?.name !== 'Civic Campaign') return next(createError('Campaign not found.', 404));
    if (campaign.owner_user_id !== Number(userId)) return next(createError('You can only submit your own campaigns.', 403));
    if (campaign.status !== 'draft') return next(createError('Only draft campaigns can be submitted.', 400));

    // Re-run deterministic safety on latest caption values
    const pvs = await prisma.parameterValue.findMany({
      where: { entity_id: campaignId },
      include: { parameterMaster: { select: { field_key: true } } },
    });
    const pvMap = {};
    for (const pv of pvs) pvMap[pv.parameterMaster?.field_key] = pv.value;

    if (!pvMap.photo_file_id || pvMap.attestation_accepted !== 'true') {
      return next(createError('A processed photo and accepted attestation are required before submission.', 400));
    }

    const categoryCheck = checkCategoryEligibility(pvMap.category);
    if (!categoryCheck.eligible || !categoryCheck.templateTypes.includes(pvMap.template)) {
      return next(createError(categoryCheck.reason || 'The selected template is not allowed for this category.', 400));
    }

    const linkedEntityId = pvMap.linked_entity_id ? Number(pvMap.linked_entity_id) : null;
    let resolvedArea = campaign.area || 'Unassigned';
    let linkedJurisdictionId = campaign.jurisdiction_id || null;
    if (linkedEntityId) {
      const eligibility = await checkEligibility(linkedEntityId);
      if (!eligibility.eligible || Number(eligibility.issue.owner_user_id) !== Number(userId)) {
        return next(createError('The linked issue is no longer eligible for publication.', 403));
      }
      if (String(eligibility.category).toLowerCase() !== String(pvMap.category).toLowerCase() ||
          !eligibility.templateTypes.includes(pvMap.template)) {
        return next(createError('The linked issue category or template is no longer eligible.', 403));
      }
      resolvedArea = eligibility.issue.area || 'Unassigned';
      linkedJurisdictionId = eligibility.issue.jurisdiction_id || null;
    }

    const detResult = deterministicFilter(pvMap.headline || '', pvMap.caption || '');
    if (!detResult.passed) {
      return next(createError(
        `Caption failed safety check: ${detResult.violations.join('; ')}`,
        400
      ));
    }

    // AI safety re-run on submit
    const aiSafety = await aiSafetyClassifier(pvMap.headline || '', pvMap.caption || '', linkedEntityId, userId);

    // Update safety results
    await prisma.$transaction(async (tx) => {
      const params = await tx.parameterMaster.findMany({
        where: { subsectionMaster: { sectionMaster: { formMaster: { entity_type_id: campaign.entity_type_id } } } },
      });
      const paramMap = {};
      for (const p of params) paramMap[p.field_key] = p.parameter_id;

      if (paramMap.deterministic_result) {
        await tx.parameterValue.upsert({
          where: { entity_id_parameter_id: { entity_id: campaignId, parameter_id: paramMap.deterministic_result } },
          create: { entity_id: campaignId, parameter_id: paramMap.deterministic_result, value: JSON.stringify(detResult) },
          update: { value: JSON.stringify(detResult) },
        });
      }
      if (paramMap.ai_safety_result) {
        await tx.parameterValue.upsert({
          where: { entity_id_parameter_id: { entity_id: campaignId, parameter_id: paramMap.ai_safety_result } },
          create: { entity_id: campaignId, parameter_id: paramMap.ai_safety_result, value: JSON.stringify(aiSafety) },
          update: { value: JSON.stringify(aiSafety) },
        });
      }
      if (paramMap.locality) {
        await tx.parameterValue.upsert({
          where: { entity_id_parameter_id: { entity_id: campaignId, parameter_id: paramMap.locality } },
          create: { entity_id: campaignId, parameter_id: paramMap.locality, value: resolvedArea },
          update: { value: resolvedArea },
        });
      }
      await tx.entity.update({
        where: { entity_id: campaignId },
        data: { area: resolvedArea, jurisdiction_id: linkedJurisdictionId },
      });

    });

    await executeWorkflowTransition({
      entityId: campaignId,
      toStatus: 'pending_review',
      reason: aiSafety.status === 'unavailable' ? 'Submitted for review; AI safety check unavailable.' : 'Submitted for moderation.',
      user: req.user,
    });

    return res.json({ success: true, message: 'Campaign submitted for moderation.', safety: { deterministic: detResult, ai_safety: aiSafety } });
  } catch (err) {
    return next(err);
  }
});

// -- POST /meme/campaigns/:id/transition � moderator transitions --------------
router.post('/campaigns/:id/transition', verifyToken, async (req, res, next) => {
  try {
    const campaignId = parsePositiveInt(req.params.id, 'id');
    const { to_status, reason } = req.body;

    if (!to_status) return next(createError('"to_status" is required.', 400));

    const allowed = ['published', 'rejected', 'under_review', 'unpublished'];
    if (!allowed.includes(to_status)) return next(createError(`to_status must be one of: ${allowed.join(', ')}`, 400));

    if (to_status === 'rejected' && !reason) return next(createError('A reason is required when rejecting.', 400));

    const campaign = await prisma.entity.findUnique({
      where: { entity_id: campaignId },
      include: { entityType: { select: { name: true } } },
    });
    if (!campaign) return next(createError('Campaign not found.', 404));
    if (campaign.entityType?.name !== 'Civic Campaign') return next(createError('Campaign not found.', 404));

    if (to_status === 'unpublished' && req.user.role === 'citizen') {
      if (Number(campaign.owner_user_id) !== Number(req.user.user_id)) {
        return next(createError('You can only unpublish your own campaign.', 403));
      }
    } else {
      if (!['coordinator_area', 'coordinator_general', 'admin'].includes(req.user.role)) {
        return next(createError('Only a moderator can approve, reject, or place a campaign under review.', 403));
      }
      if (Number(campaign.owner_user_id) === Number(req.user.user_id) && to_status === 'published') {
        return next(createError('Authors cannot approve or publish their own campaigns.', 403));
      }
    }

    const result = await executeWorkflowTransition({
      entityId: campaignId,
      toStatus: to_status,
      reason,
      user: req.user,
    });

    return res.json({ success: true, message: `Campaign transitioned to "${result.newStatus}".` });
  } catch (err) {
    return next(err);
  }
});

// -- POST /meme/campaigns/:id/report � report a published meme ---------------
router.post('/campaigns/:id/report', verifyToken, async (req, res, next) => {
  try {
    const campaignId = parsePositiveInt(req.params.id, 'id');
    const { reason } = req.body;
    const campaign = await prisma.entity.findUnique({
      where: { entity_id: campaignId },
      include: { entityType: { select: { name: true } } },
    });
    if (!campaign || campaign.entityType?.name !== 'Civic Campaign' || campaign.status !== 'published') {
      return next(createError('Campaign not found or not published.', 404));
    }

    const userId = Number(req.user.user_id);
    const dedupeKey = `report:${campaignId}:${userId}`;
    const existing = await prisma.civicCampaignEvent.findUnique({ where: { dedupe_key: dedupeKey } });
    if (existing) return next(createError('You have already reported this post.', 409));
    await prisma.civicCampaignEvent.create({
      data: { campaign_id: campaignId, event_type: 'report', user_id: userId, dedupe_key: dedupeKey },
    });

    const reporterRows = await prisma.civicCampaignEvent.findMany({
      where: { campaign_id: campaignId, event_type: 'report', user_id: { not: null } },
      select: { user_id: true },
      distinct: ['user_id'],
    });
    if (reporterRows.length >= 2) {
      await prisma.$transaction(async (tx) => {
        const hidden = await tx.entity.updateMany({
          where: { entity_id: campaignId, status: 'published' },
          data: { status: 'under_review' },
        });
        if (hidden.count) {
          await tx.auditLog.create({
            data: {
              entity_id: campaignId,
              actor_user_id: userId,
              action: 'reported',
              user: req.user.name || 'citizen',
              old_status: 'published',
              new_status: 'under_review',
              reason: reason || 'Two distinct citizens reported this post.',
            },
          });
          await tx.approvalHistory.create({
            data: {
              entity_id: campaignId,
              actor_user_id: userId,
              from_status: 'published',
              to_status: 'under_review',
              reason: reason || 'Two distinct citizens reported this post.',
            },
          });
        }
      });
    }

    return res.json({
      success: true,
      message: reporterRows.length >= 2 ? 'Campaign hidden pending moderator review.' : 'Report recorded for moderator review.',
    });
  } catch (err) {
    return next(err);
  }
});

// -- POST /meme/campaigns/:id/event � record engagement event -----------------
router.post('/campaigns/:id/event', async (req, res, next) => {
  try {
    const campaignId = parsePositiveInt(req.params.id, 'id');
    const { event_type, session_id } = req.body;
    const validTypes = ['view', 'click', 'share', 'upvote', 'follow'];
    if (!event_type || !validTypes.includes(event_type)) {
      return next(createError(`event_type must be one of: ${validTypes.join(', ')}`, 400));
    }

    const campaign = await prisma.entity.findUnique({
      where: { entity_id: campaignId },
      include: { entityType: { select: { name: true } } },
    });
    if (!campaign || campaign.entityType?.name !== 'Civic Campaign' || campaign.status !== 'published') {
      return next(createError('Campaign not found or not published.', 404));
    }

    const userId = req.user?.user_id ? Number(req.user.user_id) : null;
    if (['upvote', 'follow'].includes(event_type) && !userId) {
      return next(createError('Sign in to upvote or follow a post.', 401));
    }

    if (event_type === 'upvote' && userId === Number(campaign.owner_user_id)) {
      return next(createError('You cannot upvote your own post.', 403));
    }

    const toggleKey = `${event_type}:${campaignId}:${userId}`;
    if (['upvote', 'follow'].includes(event_type)) {
      const current = await prisma.civicCampaignEvent.findUnique({ where: { dedupe_key: toggleKey } });
      if (current) {
        await prisma.civicCampaignEvent.delete({ where: { id: current.id } });
        return res.json({ success: true, active: false });
      }
      await prisma.civicCampaignEvent.create({
        data: { campaign_id: campaignId, event_type, user_id: userId, dedupe_key: toggleKey },
      });
      return res.json({ success: true, active: true });
    }

    if (!userId && (typeof session_id !== 'string' || !session_id.trim() || session_id.length > 128)) {
      return next(createError('session_id is required for anonymous events.', 400));
    }
    const day = new Date().toISOString().slice(0, 10);
    const actor = userId ? `user:${userId}` : `session:${session_id.trim()}`;
    const dedupeKey = `${event_type}:${campaignId}:${actor}:${day}`;
    try {
      await prisma.civicCampaignEvent.create({
        data: {
          campaign_id: campaignId,
          event_type,
          user_id: userId,
          session_id: userId ? null : session_id.trim(),
          dedupe_key: dedupeKey,
        },
      });
    } catch (err) {
      if (err.code === 'P2002') return res.json({ success: true, counted: false });
      throw err;
    }
    return res.json({ success: true, counted: true });
  } catch (err) {
    return next(err);
  }
});

// -- GET /meme/campaigns/:id/impact � impact counts --------------------------
router.get('/campaigns/:id/impact', verifyToken, checkRole(['coordinator_area', 'coordinator_general', 'admin', 'director']), async (req, res, next) => {
  try {
    const campaignId = parsePositiveInt(req.params.id, 'id');
    const campaign = await prisma.entity.findUnique({
      where: { entity_id: campaignId },
      include: { entityType: { select: { name: true } } },
    });
    if (!campaign || campaign.entityType?.name !== 'Civic Campaign') return next(createError('Campaign not found.', 404));
    if (req.user.role !== 'director' && !canModerateCampaign(req.user, campaign)) {
      return next(createError('You are not authorized to view this campaign impact.', 403));
    }

    const [views, clicks, shares, upvotes, follows, reports] = await Promise.all([
      prisma.civicCampaignEvent.count({ where: { campaign_id: campaignId, event_type: 'view' } }),
      prisma.civicCampaignEvent.count({ where: { campaign_id: campaignId, event_type: 'click' } }),
      prisma.civicCampaignEvent.count({ where: { campaign_id: campaignId, event_type: 'share' } }),
      prisma.civicCampaignEvent.count({ where: { campaign_id: campaignId, event_type: 'upvote' } }),
      prisma.civicCampaignEvent.count({ where: { campaign_id: campaignId, event_type: 'follow' } }),
      prisma.civicCampaignEvent.count({ where: { campaign_id: campaignId, event_type: 'report' } }),
    ]);

    return res.json({
      success: true,
      data: {
        campaign_id: campaignId,
        views,
        clicks,
        shares,
        upvotes,
        follows,
        reports,
      },
    });
  } catch (err) {
    return next(err);
  }
});

// -- GET /meme/feed � Civic Buzz published feed --------------------------------
router.get('/feed', async (req, res, next) => {
  try {
    const page = req.query.page ? parsePositiveInt(req.query.page, 'page') : 1;
    const limit = Math.min(req.query.limit ? parsePositiveInt(req.query.limit, 'limit') : 12, 50);
    const skip = (page - 1) * limit;

    const campaignTypeId = await getCampaignEntityTypeId();

    const [total, campaigns] = await Promise.all([
      prisma.entity.count({ where: { entity_type_id: campaignTypeId, status: 'published' } }),
      prisma.entity.findMany({
        where: { entity_type_id: campaignTypeId, status: 'published' },
        skip,
        take: limit,
        orderBy: { entity_id: 'desc' },
        include: {
          parameterValues: {
            include: { parameterMaster: { select: { field_key: true } } },
          },
        },
      }),
    ]);

    // Build response � never expose owner identity
    const linkedIds = campaigns.flatMap((campaign) => {
      const values = parameterValueMap(campaign.parameterValues);
      return values.linked_entity_id ? [Number(values.linked_entity_id)] : [];
    });
    const linkedIssues = linkedIds.length
      ? await prisma.entity.findMany({
        where: { entity_id: { in: linkedIds } },
        select: { entity_id: true, status: true },
      })
      : [];
    const statusByIssueId = new Map(linkedIssues.map((issue) => [issue.entity_id, issue.status]));
    const eventCounts = campaigns.length
      ? await prisma.civicCampaignEvent.groupBy({
        by: ['campaign_id', 'event_type'],
        where: { campaign_id: { in: campaigns.map((campaign) => campaign.entity_id) } },
        _count: { _all: true },
      })
      : [];
    const impacts = new Map();
    for (const event of eventCounts) {
      const impact = impacts.get(event.campaign_id) || { views: 0, clicks: 0, shares: 0, upvotes: 0, follows: 0, reports: 0 };
      if (Object.hasOwn(impact, event.event_type)) impact[event.event_type === 'view' ? 'views' : `${event.event_type}s`] = event._count._all;
      if (event.event_type === 'click') impact.clicks = event._count._all;
      impacts.set(event.campaign_id, impact);
    }

    const feed = campaigns.map((c) => {
      const pvMap = parameterValueMap(c.parameterValues);
      const linkedId = pvMap.linked_entity_id ? Number(pvMap.linked_entity_id) : null;
      return {
        campaign_id: c.entity_id,
        template: pvMap.template,
        template_type: pvMap.template,
        headline: pvMap.headline,
        caption: pvMap.caption,
        category: pvMap.category,
        locality: pvMap.locality || c.area || 'Unassigned',
        linked_entity_id: linkedId,
        linked_issue_status: linkedId ? statusByIssueId.get(linkedId) || null : null,
        verification_label: linkedId ? null : 'Citizen highlight | unverified',
        photo_url: `/api/meme/campaigns/${c.entity_id}/photo`,
        caption_source: pvMap.caption_source,
        status: c.status,
        impact: impacts.get(c.entity_id) || { views: 0, clicks: 0, shares: 0, upvotes: 0, follows: 0, reports: 0 },
      };
    });

    return res.json({
      success: true,
      data: feed,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    return next(err);
  }
});

// -- GET /meme/my � citizen's own campaigns ------------------------------------
router.get('/my', verifyToken, async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const campaignTypeId = await getCampaignEntityTypeId();

    const campaigns = await prisma.entity.findMany({
      where: { owner_user_id: Number(userId), entity_type_id: campaignTypeId },
      orderBy: { entity_id: 'desc' },
      include: {
        parameterValues: { include: { parameterMaster: { select: { field_key: true } } } },
        approvalHistory: { orderBy: { created_date: 'desc' }, take: 1 },
      },
    });

    const result = campaigns.map((c) => {
      const pvMap = parameterValueMap(c.parameterValues);
      const lastHistory = c.approvalHistory?.[0];
      return {
        campaign_id: c.entity_id,
        status: c.status,
        template: pvMap.template,
        template_type: pvMap.template,
        headline: pvMap.headline,
        caption: pvMap.caption,
        category: pvMap.category,
        locality: pvMap.locality || c.area || 'Unassigned',
        linked_entity_id: pvMap.linked_entity_id ? Number(pvMap.linked_entity_id) : null,
        photo_url: `/api/meme/campaigns/${c.entity_id}/photo`,
        caption_source: pvMap.caption_source,
        rejection_reason: c.status === 'rejected' && lastHistory?.reason ? lastHistory.reason : null,
      };
    });

    return res.json({ success: true, data: result });
  } catch (err) {
    return next(err);
  }
});

// -- GET /meme/campaigns/:id � single campaign (share link) -------------------
router.get('/campaigns/:id', async (req, res, next) => {
  try {
    const campaignId = parsePositiveInt(req.params.id, 'id');
    const campaign = await prisma.entity.findUnique({
      where: { entity_id: campaignId },
      include: { entityType: { select: { name: true } } },
    });
    if (!campaign || campaign.entityType?.name !== 'Civic Campaign') {
      return next(createError('Campaign not found.', 404));
    }

    const campaignWithValues = await prisma.entity.findUnique({
      where: { entity_id: campaignId },
      include: {
        parameterValues: { include: { parameterMaster: { select: { field_key: true } } } },
      },
    });
    if (!campaignWithValues) return next(createError('Campaign not found.', 404));

    // HARD RULE: share links to unpublished/rejected campaigns expose no content
    if (campaign.status !== 'published') {
      return res.status(410).json({
        success: false,
        error: 'This content is no longer available.',
      });
    }

    const pvMap = parameterValueMap(campaignWithValues.parameterValues);
    const linkedId = pvMap.linked_entity_id ? Number(pvMap.linked_entity_id) : null;
    const linkedIssue = linkedId ? await prisma.entity.findUnique({
      where: { entity_id: linkedId },
      select: { status: true },
    }) : null;

    return res.json({
      success: true,
      data: {
        campaign_id: campaign.entity_id,
        template: pvMap.template,
        template_type: pvMap.template,
        headline: pvMap.headline,
        caption: pvMap.caption,
        category: pvMap.category,
        locality: pvMap.locality || campaign.area || 'Unassigned',
        linked_entity_id: linkedId,
        linked_issue_status: linkedIssue?.status || null,
        verification_label: linkedId ? null : 'Citizen highlight | unverified',
        photo_url: `/api/meme/campaigns/${campaign.entity_id}/photo`,
        status: campaign.status,
      },
    });
  } catch (err) {
    return next(err);
  }
});

// -- GET /meme/campaigns � list all campaigns (admin/coordinator moderation) --
router.get('/campaigns', verifyToken, checkRole(['coordinator_area', 'coordinator_general', 'admin']), async (req, res, next) => {
  try {
    const { status, area } = req.query;
    const campaignTypeId = await getCampaignEntityTypeId();

    const where = { entity_type_id: campaignTypeId };
    if (status) where.status = status;
    if (area) where.area = area;
    if (req.user.role === 'coordinator_area') {
      if (!req.user.assignedArea) return res.json({ success: true, data: [] });
      where.area = req.user.assignedArea;
    } else if (req.user.role === 'coordinator_general') {
      where.area = 'Unassigned';
    }

    const campaigns = await prisma.entity.findMany({
      where,
      orderBy: { entity_id: 'desc' },
      include: {
        parameterValues: { include: { parameterMaster: { select: { field_key: true } } } },
        approvalHistory: { orderBy: { created_date: 'desc' }, take: 1 },
      },
    });

    const result = campaigns.map((campaign) => {
      const values = parameterValueMap(campaign.parameterValues);
      let deterministic = null;
      let aiSafety = null;
      try { deterministic = JSON.parse(values.deterministic_result || 'null'); } catch { deterministic = { unavailable: true }; }
      try { aiSafety = JSON.parse(values.ai_safety_result || 'null'); } catch { aiSafety = { status: 'unavailable' }; }
      return {
        campaign_id: campaign.entity_id,
        status: campaign.status,
        area: campaign.area || 'Unassigned',
        headline: values.headline,
        caption: values.caption,
        template: values.template,
        category: values.category,
        locality: values.locality || campaign.area || 'Unassigned',
        caption_source: values.caption_source,
        deterministic_result: deterministic,
        ai_safety_result: aiSafety,
        safety_unavailable: !deterministic || !aiSafety || aiSafety?.status === 'unavailable',
        safety_flagged: deterministic?.passed !== true || aiSafety?.status !== 'passed',
        photo_url: `/api/meme/campaigns/${campaign.entity_id}/photo`,
        rejection_reason: campaign.status === 'rejected' ? campaign.approvalHistory[0]?.reason || null : null,
      };
    });
    return res.json({ success: true, data: result });
  } catch (err) {
    return next(err);
  }
});


// -- POST /meme/campaigns/:id/photo — EXIF-stripped private campaign photo ----
router.post('/campaigns/:id/photo', verifyToken, memeUpload.single('photo'), async (req, res, next) => {
  let storedPath = null;
  try {
    const campaignId = parsePositiveInt(req.params.id, 'id');
    if (!req.file) return next(createError('Choose a valid image file.', 400));
    const campaign = await prisma.entity.findUnique({
      where: { entity_id: campaignId },
      include: { entityType: { select: { name: true } } },
    });
    if (!campaign || campaign.entityType?.name !== 'Civic Campaign') return next(createError('Campaign not found.', 404));
    if (Number(campaign.owner_user_id) !== Number(req.user.user_id) || campaign.status !== 'draft') {
      return next(createError('Only the author can upload a photo to their draft.', 403));
    }

    const processed = await sharp(req.file.buffer, { failOn: 'error' })
      .rotate()
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 86, mozjpeg: true })
      .toBuffer();
    const filename = `${crypto.randomBytes(18).toString('hex')}.jpg`;
    storedPath = path.join(UPLOAD_DIR, filename);
    await fs.promises.writeFile(storedPath, processed, { flag: 'wx' });

    const photoParameter = await prisma.parameterMaster.findFirst({
      where: {
        field_key: 'photo_file_id',
        subsectionMaster: { sectionMaster: { formMaster: { entity_type_id: campaign.entity_type_id } } },
      },
      select: { parameter_id: true },
    });
    if (!photoParameter) throw createError('Campaign photo metadata is not seeded.', 500);

    let fileRecord;
    try {
      fileRecord = await prisma.$transaction(async (tx) => {
        const record = await tx.fileRepository.create({
          data: {
            entity_id: campaignId,
            parameter_id: photoParameter.parameter_id,
            file_name: 'civic-buzz-photo.jpg',
            path: filename,
          },
        });
        await tx.parameterValue.upsert({
          where: {
            entity_id_parameter_id: {
              entity_id: campaignId,
              parameter_id: photoParameter.parameter_id,
            },
          },
          create: {
            entity_id: campaignId,
            parameter_id: photoParameter.parameter_id,
            value: String(record.file_id),
          },
          update: { value: String(record.file_id) },
        });
        return record;
      });
    } catch (err) {
      await fs.promises.unlink(storedPath).catch((cleanupError) => {
        console.error('[CIVIC BUZZ] Failed to remove unreferenced upload:', cleanupError.message);
      });
      throw err;
    }

    return res.status(201).json({
      success: true,
      data: { photo_url: `/api/meme/campaigns/${campaignId}/photo`, photo_file_id: fileRecord.file_id },
    });
  } catch (err) {
    return next(err);
  }
});

// -- GET /meme/campaigns/:id/photo — scope access to author/moderator/public ---
router.get('/campaigns/:id/photo', async (req, res, next) => {
  try {
    const campaignId = parsePositiveInt(req.params.id, 'id');
    const campaign = await prisma.entity.findUnique({
      where: { entity_id: campaignId },
      include: {
        entityType: { select: { name: true } },
        fileRepositories: {
          where: { parameterMaster: { field_key: 'photo_file_id' } },
          orderBy: { file_id: 'desc' },
          take: 1,
        },
      },
    });
    if (!campaign || campaign.entityType?.name !== 'Civic Campaign') {
      return next(createError('Photo not found.', 404));
    }

    const isAuthor = req.user && Number(req.user.user_id) === Number(campaign.owner_user_id);
    if (campaign.status !== 'published' && !isAuthor && !canModerateCampaign(req.user, campaign)) {
      return next(createError('Photo not found.', 404));
    }

    const record = campaign.fileRepositories[0];
    if (!record) return next(createError('Photo not found.', 404));
    const filePath = path.join(UPLOAD_DIR, path.basename(record.path || ''));
    const photo = await fs.promises.readFile(filePath);
    res.type('image/jpeg');
    res.set('Cache-Control', campaign.status === 'published' ? 'public, max-age=300' : 'private, no-store');
    return res.send(photo);
  } catch (err) {
    if (err.code === 'ENOENT') return next(createError('Photo not found.', 404));
    return next(err);
  }
});

module.exports = router;
