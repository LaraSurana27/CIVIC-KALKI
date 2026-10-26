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
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const memeUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
      const ext = path.extname(file.originalname) || '.jpg';
      cb(null, `meme-${uniqueSuffix}${ext}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const crypto = require('crypto');
const prisma = require('../db');
const { verifyToken, checkRole, createHttpError } = require('../middleware/auth');
const { generateCaptions } = require('../services/memeCaption');
const { deterministicFilter, aiSafetyClassifier } = require('../services/memeSafety');
const {
  PUBLICLY_VISIBLE_STATUSES,
  HUMOR_ALLOWED_CATEGORIES,
  SAFETY_SENSITIVE_CATEGORIES,
  NO_MEME_CATEGORIES,
  RATE_LIMITS,
  TEMPLATES,
} = require('../services/memeConfig');

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
async function getIssueCategory(entity) {
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
  const cat = (category || '').toLowerCase();
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
    templateTypes = ['awareness', 'call_to_action'];
  } else if (isHumorAllowed) {
    templateTypes = ['relatable', 'awareness', 'call_to_action'];
  } else {
    templateTypes = ['awareness', 'call_to_action'];
  }

  return { eligible: true, templateTypes, category };
}

// Helper: check eligibility and return { eligible, templateTypes, reason }
async function checkEligibility(issueId, allowUnapproved = true) {
  const issue = await prisma.entity.findUnique({
    where: { entity_id: Number(issueId) },
    include: {
      entityType: { select: { name: true } },
      parameterValues: { include: { parameterMaster: { select: { field_key: true, label: true } } } },
    },
  });

  if (!issue) return { eligible: false, reason: 'Issue not found.', templateTypes: [] };

  // Must be publicly visible unless explicitly bypassed for citizen awareness freedom
  if (!allowUnapproved && !PUBLICLY_VISIBLE_STATUSES.includes(issue.status || '')) {
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

// Helper: rate limit check
async function checkRateLimit(userId) {
  const now = new Date();
  const dayStart = new Date(now);
  dayStart.setHours(0, 0, 0, 0);
  const hourAgo = new Date(now.getTime() - 3600 * 1000);

  const campaignTypeId = await getCampaignEntityTypeId();

  const [dailyCampaigns, hourlyCapGenLogs] = await Promise.all([
    prisma.entity.count({
      where: {
        owner_user_id: Number(userId),
        entity_type_id: campaignTypeId,
        // created_date is not on Entity; use auditLog datetime or entity_id ordering
        // We filter by entities created today using approvalHistory or auditLog
      },
    }),
    prisma.aIExecutionLog.count({
      where: {
        requested_by_user_id: Number(userId),
        analysis_type: 'meme_caption',
        created_date: { gte: hourAgo },
      },
    }),
  ]);

  // For daily campaign count, filter by today using audit log
  const todayLogs = await prisma.auditLog.count({
    where: {
      actor_user_id: Number(userId),
      action: 'created',
      datetime: { gte: dayStart },
      entity: { entity_type_id: campaignTypeId },
    },
  });

  if (todayLogs >= RATE_LIMITS.maxCampaignsPerDay) {
    return {
      blocked: true,
      reason: `You can create at most ${RATE_LIMITS.maxCampaignsPerDay} meme campaigns per day. Please try again tomorrow.`,
    };
  }
  if (hourlyCapGenLogs >= RATE_LIMITS.maxCaptionGenerationsPerHour) {
    return {
      blocked: true,
      reason: `You can generate AI captions at most ${RATE_LIMITS.maxCaptionGenerationsPerHour} times per hour. Please wait or write your own caption.`,
    };
  }
  return { blocked: false };
}

// -- GET /meme/config � public config ----------------------------------------
router.get('/config', (_req, res) => {
  res.json({
    success: true,
    data: {
      templates: TEMPLATES,
      humor_allowed_categories: HUMOR_ALLOWED_CATEGORIES,
      safety_sensitive_categories: SAFETY_SENSITIVE_CATEGORIES,
      no_meme_categories: NO_MEME_CATEGORIES,
    },
  });
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

// -- POST /meme/captions � AI caption generation ------------------------------
router.post('/captions', verifyToken, async (req, res, next) => {
  try {
    const { issue_id, category, locality, description, template_type, allow_unapproved } = req.body;
    if (!template_type || !TEMPLATES.includes(template_type)) {
      return next(createError(`"template_type" must be one of: ${TEMPLATES.join(', ')}`, 400));
    }

    const userId = req.user.user_id;

    // Rate limit on caption generation
    const rl = await checkRateLimit(userId);
    if (rl.blocked) return next(createError(rl.reason, 429));

    let targetEntityId = null;
    let resolvedCategory = category || 'Civic Issue';
    let resolvedLocality = locality || req.user.assignedArea || 'your locality';
    let resolvedDesc = description || '';

    if (issue_id) {
      targetEntityId = parsePositiveInt(issue_id, 'issue_id');
      const elig = await checkEligibility(targetEntityId, allow_unapproved === true);
      if (!elig.eligible) return next(createError(elig.reason, 403));
      if (!elig.templateTypes.includes(template_type)) {
        return next(createError(
          `Template "${template_type}" is not available for this issue category. Available templates: ${elig.templateTypes.join(', ')}`,
          403
        ));
      }
    } else {
      if (!category && !description) {
        return next(createError('"issue_id" or "category" is required for caption generation.', 400));
      }
      const elig = checkCategoryEligibility(resolvedCategory);
      if (!elig.eligible) return next(createError(elig.reason, 403));
      if (!elig.templateTypes.includes(template_type)) {
        return next(createError(
          `Template "${template_type}" is not available for category "${resolvedCategory}". Available: ${elig.templateTypes.join(', ')}`,
          403
        ));
      }
    }

    const result = await generateCaptions(
      targetEntityId || { category: resolvedCategory, locality: resolvedLocality, description: resolvedDesc },
      template_type,
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
    const {
      issue_id,
      category,
      locality,
      description,
      template_type,
      headline,
      caption,
      caption_source,    // 'ai' | 'ai_edited' | 'manual'
      original_ai_suggestion,
      photo_file_id,
      attestation_accepted,
    } = req.body;

    if (!template_type || !headline || !caption) {
      return next(createError('template_type, headline, and caption are required.', 400));
    }
    if (!attestation_accepted) {
      return next(createError('You must accept the photo attestation to submit a meme campaign.', 400));
    }

    const userId = req.user.user_id;

    // Rate limit on campaigns
    const rl = await checkRateLimit(userId);
    if (rl.blocked) return next(createError(rl.reason, 429));

    let issueId = null;
    let elig = null;
    let issue = null;
    let campaignArea = locality || req.user.assignedArea || null;
    let campaignJurisdictionId = null;
    let campaignName = '';

    if (issue_id) {
      issueId = parsePositiveInt(issue_id, 'issue_id');
      elig = await checkEligibility(issueId, true);
      if (!elig.eligible) return next(createError(elig.reason, 403));
      issue = elig.issue;
      campaignArea = issue?.area || campaignArea;
      campaignJurisdictionId = issue?.jurisdiction_id || null;
      campaignName = `Civic Campaign — ${issue?.entityType?.name || 'Issue'} in ${campaignArea || 'the locality'}`;
    } else {
      elig = checkCategoryEligibility(category || 'Civic Issue');
      if (!elig.eligible) return next(createError(elig.reason, 403));
      campaignName = `Civic Campaign — ${category || 'Civic Issue'} in ${campaignArea || 'the locality'}`;
    }

    if (!elig.templateTypes.includes(template_type)) {
      return next(createError(`Template "${template_type}" not allowed for this category.`, 403));
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
      { key: 'template_type', value: template_type },
      { key: 'headline', value: String(headline).substring(0, 60) },
      { key: 'caption', value: String(caption).substring(0, 140) },
      { key: 'caption_source', value: caption_source || 'manual' },
      { key: 'original_ai_suggestion', value: original_ai_suggestion ? JSON.stringify(original_ai_suggestion).substring(0, 2000) : null },
      { key: 'deterministic_result', value: JSON.stringify(detResult) },
      { key: 'ai_safety_result', value: JSON.stringify(aiSafety) },
      { key: 'attestation_accepted', value: attestation_accepted ? 'true' : 'false' },
      { key: 'photo_file_id', value: photo_file_id ? String(photo_file_id) : null },
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
    if (campaign.owner_user_id !== Number(userId)) return next(createError('You can only submit your own campaigns.', 403));
    if (campaign.status !== 'draft') return next(createError('Only draft campaigns can be submitted.', 400));

    // Re-run deterministic safety on latest caption values
    const pvs = await prisma.parameterValue.findMany({
      where: { entity_id: campaignId },
      include: { parameterMaster: { select: { field_key: true } } },
    });
    const pvMap = {};
    for (const pv of pvs) pvMap[pv.parameterMaster?.field_key] = pv.value;

    const detResult = deterministicFilter(pvMap.headline || '', pvMap.caption || '');
    if (!detResult.passed) {
      return next(createError(
        `Caption failed safety check: ${detResult.violations.join('; ')}`,
        400
      ));
    }

    // AI safety re-run on submit
    const issueId = pvMap.linked_entity_id ? Number(pvMap.linked_entity_id) : null;
    const aiSafety = await aiSafetyClassifier(pvMap.headline || '', pvMap.caption || '', issueId, userId);

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

      await tx.entity.update({ where: { entity_id: campaignId }, data: { status: 'pending_review' } });

      await tx.auditLog.create({
        data: {
          entity_id: campaignId,
          actor_user_id: Number(userId),
          action: 'status_transition',
          user: req.user.name || 'citizen',
          old_status: 'draft',
          new_status: 'pending_review',
          reason: 'Submitted for moderation',
        },
      });
      await tx.approvalHistory.create({
        data: {
          entity_id: campaignId,
          actor_user_id: Number(userId),
          from_status: 'draft',
          to_status: 'pending_review',
          reason: 'Citizen submitted for review',
        },
      });
    });

    return res.json({ success: true, message: 'Campaign submitted for moderation.', safety: { deterministic: detResult, ai_safety: aiSafety } });
  } catch (err) {
    return next(err);
  }
});

// -- POST /meme/campaigns/:id/transition � moderator transitions --------------
router.post('/campaigns/:id/transition', verifyToken, checkRole(['coordinator_area', 'coordinator_general', 'admin']), async (req, res, next) => {
  try {
    const campaignId = parsePositiveInt(req.params.id, 'id');
    const { to_status, reason } = req.body;

    if (!to_status) return next(createError('"to_status" is required.', 400));

    const allowed = ['approved', 'rejected', 'under_review', 'published'];
    if (!allowed.includes(to_status)) return next(createError(`to_status must be one of: ${allowed.join(', ')}`, 400));

    if (to_status === 'rejected' && !reason) return next(createError('A reason is required when rejecting.', 400));

    const campaign = await prisma.entity.findUnique({ where: { entity_id: campaignId } });
    if (!campaign) return next(createError('Campaign not found.', 404));

    const validTransitions = {
      pending_review: ['approved', 'rejected'],
      approved: ['published', 'rejected'],
      published: ['under_review', 'rejected'],
      under_review: ['approved', 'rejected'],
    };

    const currentStatus = campaign.status || '';
    if (!(validTransitions[currentStatus] || []).includes(to_status)) {
      return next(createError(`Cannot transition from "${currentStatus}" to "${to_status}".`, 400));
    }

    // Area check for coordinator_area
    if (req.user.role === 'coordinator_area') {
      const assignedArea = req.user.assignedArea || req.user.assigned_area;
      if (assignedArea && campaign.area && campaign.area !== assignedArea) {
        return next(createError(`You are assigned to area "${assignedArea}" and cannot moderate campaigns from "${campaign.area}".`, 403));
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.entity.update({ where: { entity_id: campaignId }, data: { status: to_status } });
      await tx.auditLog.create({
        data: {
          entity_id: campaignId,
          actor_user_id: Number(req.user.user_id),
          action: 'status_transition',
          user: req.user.name || 'moderator',
          old_status: currentStatus,
          new_status: to_status,
          reason: reason || null,
        },
      });
      await tx.approvalHistory.create({
        data: {
          entity_id: campaignId,
          actor_user_id: Number(req.user.user_id),
          from_status: currentStatus,
          to_status,
          reason: reason || null,
        },
      });
    });

    return res.json({ success: true, message: `Campaign transitioned to "${to_status}".` });
  } catch (err) {
    return next(err);
  }
});

// -- POST /meme/campaigns/:id/report � report a published meme ---------------
router.post('/campaigns/:id/report', verifyToken, async (req, res, next) => {
  try {
    const campaignId = parsePositiveInt(req.params.id, 'id');
    const { reason } = req.body;
    const campaign = await prisma.entity.findUnique({ where: { entity_id: campaignId } });
    if (!campaign || campaign.status !== 'published') {
      return next(createError('Campaign not found or not published.', 404));
    }

    await prisma.$transaction(async (tx) => {
      await tx.entity.update({ where: { entity_id: campaignId }, data: { status: 'under_review' } });
      await tx.auditLog.create({
        data: {
          entity_id: campaignId,
          actor_user_id: Number(req.user.user_id),
          action: 'reported',
          user: req.user.name || 'citizen',
          old_status: 'published',
          new_status: 'under_review',
          reason: reason || 'User reported this content.',
        },
      });
    });

    return res.json({ success: true, message: 'Campaign reported and hidden pending review.' });
  } catch (err) {
    return next(err);
  }
});

// -- POST /meme/campaigns/:id/event � record engagement event -----------------
router.post('/campaigns/:id/event', async (req, res, next) => {
  try {
    const campaignId = parsePositiveInt(req.params.id, 'id');
    const { event_type, session_id } = req.body;
    const validTypes = ['view', 'issue_click', 'share_initiated', 'participation'];
    if (!event_type || !validTypes.includes(event_type)) {
      return next(createError(`event_type must be one of: ${validTypes.join(', ')}`, 400));
    }

    // Verify campaign is published
    const campaign = await prisma.entity.findUnique({ where: { entity_id: campaignId }, select: { status: true } });
    if (!campaign || campaign.status !== 'published') {
      return res.json({ success: true, message: 'No-op: campaign not published.' });
    }

    // Deduplication for views: session_key = SHA256(campaign_id + user_id/session_id + date)
    let sessionKey = null;
    let userId = null;
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(authHeader.slice(7), process.env.JWT_SECRET || 'development-secret-change-me');
        userId = decoded.user_id || null;
      }
    } catch {}

    if (event_type === 'view') {
      const today = new Date().toISOString().slice(0, 10);
      const keyInput = `${campaignId}:${userId || session_id || 'anon'}:${today}`;
      sessionKey = crypto.createHash('sha256').update(keyInput).digest('hex');

      const existing = await prisma.civicCampaignEvent.findFirst({ where: { session_key: sessionKey } });
      if (existing) return res.json({ success: true, message: 'View already counted for today.' });
    }

    await prisma.civicCampaignEvent.create({
      data: {
        campaign_id: campaignId,
        event_type,
        user_id: userId || null,
        session_key: sessionKey,
      },
    });

    return res.json({ success: true });
  } catch (err) {
    return next(err);
  }
});

// -- GET /meme/campaigns/:id/impact � impact counts --------------------------
router.get('/campaigns/:id/impact', async (req, res, next) => {
  try {
    const campaignId = parsePositiveInt(req.params.id, 'id');

    const [views, issueClicks, sharesInitiated, participations] = await Promise.all([
      prisma.civicCampaignEvent.count({ where: { campaign_id: campaignId, event_type: 'view' } }),
      prisma.civicCampaignEvent.count({ where: { campaign_id: campaignId, event_type: 'issue_click' } }),
      prisma.civicCampaignEvent.count({ where: { campaign_id: campaignId, event_type: 'share_initiated' } }),
      prisma.civicCampaignEvent.count({ where: { campaign_id: campaignId, event_type: 'participation' } }),
    ]);

    return res.json({
      success: true,
      data: {
        campaign_id: campaignId,
        views,
        issue_clicks: issueClicks,
        shares_initiated: sharesInitiated,
        participation_actions: participations,
        note: 'All counts reflect only real recorded events. No seeded or estimated values.',
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
    const feed = campaigns.map((c) => {
      const pvMap = {};
      for (const pv of c.parameterValues) pvMap[pv.parameterMaster?.field_key] = pv.value;
      return {
        campaign_id: c.entity_id,
        template_type: pvMap.template_type,
        headline: pvMap.headline,
        caption: pvMap.caption,
        locality: c.area,
        linked_entity_id: pvMap.linked_entity_id ? Number(pvMap.linked_entity_id) : null,
        photo_file_id: pvMap.photo_file_id ? Number(pvMap.photo_file_id) : null,
        caption_source: pvMap.caption_source,
        status: c.status,
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
      const pvMap = {};
      for (const pv of c.parameterValues) pvMap[pv.parameterMaster?.field_key] = pv.value;
      const lastHistory = c.approvalHistory?.[0];
      return {
        campaign_id: c.entity_id,
        status: c.status,
        template_type: pvMap.template_type,
        headline: pvMap.headline,
        caption: pvMap.caption,
        linked_entity_id: pvMap.linked_entity_id ? Number(pvMap.linked_entity_id) : null,
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
      include: {
        parameterValues: { include: { parameterMaster: { select: { field_key: true } } } },
      },
    });

    if (!campaign) return next(createError('Campaign not found.', 404));

    // HARD RULE: share links to unpublished/rejected campaigns expose no content
    if (!['published'].includes(campaign.status)) {
      return res.status(410).json({
        success: false,
        error: 'This content is no longer available.',
        status: campaign.status,
      });
    }

    const pvMap = {};
    for (const pv of campaign.parameterValues) pvMap[pv.parameterMaster?.field_key] = pv.value;

    return res.json({
      success: true,
      data: {
        campaign_id: campaign.entity_id,
        template_type: pvMap.template_type,
        headline: pvMap.headline,
        caption: pvMap.caption,
        locality: campaign.area,
        linked_entity_id: pvMap.linked_entity_id ? Number(pvMap.linked_entity_id) : null,
        photo_file_id: pvMap.photo_file_id ? Number(pvMap.photo_file_id) : null,
        status: campaign.status,
      },
    });
  } catch (err) {
    return next(err);
  }
});

// -- GET /meme/campaigns � list all campaigns (admin/coordinator moderation) --
router.get('/campaigns', verifyToken, checkRole(['coordinator_area', 'coordinator_general', 'admin', 'director']), async (req, res, next) => {
  try {
    const { status, area } = req.query;
    const campaignTypeId = await getCampaignEntityTypeId();

    const where = { entity_type_id: campaignTypeId };
    if (status) where.status = status;
    if (area) where.area = area;
    // Area coordinators see only their area
    if (req.user.role === 'coordinator_area' && req.user.assignedArea) {
      where.area = req.user.assignedArea;
    }

    const campaigns = await prisma.entity.findMany({
      where,
      orderBy: { entity_id: 'desc' },
      include: {
        parameterValues: { include: { parameterMaster: { select: { field_key: true } } } },
      },
    });

    return res.json({ success: true, data: campaigns });
  } catch (err) {
    return next(err);
  }
});


// -- POST /meme/upload-photo — citizen photo upload for meme -------------------
router.post('/upload-photo', verifyToken, memeUpload.single('photo'), (req, res, next) => {
  if (!req.file) return next(createError('No photo file uploaded.', 400));
  return res.json({
    success: true,
    data: {
      filename: req.file.filename,
      photo_url: `/uploads/${req.file.filename}`,
    },
  });
});

module.exports = router;
