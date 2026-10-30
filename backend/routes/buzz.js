/**
 * CIVIC-KALKI — /buzz Routes
 *
 * All endpoints for the Civic Buzz feature.
 * Auth: verifyToken (strict) for write operations; optionalAuth for GET (already applied globally).
 *
 * Mounted in index.js as: app.use('/buzz', buzzRoutes);
 */

'use strict';

const express = require('express');
const router  = express.Router();
const path    = require('path');
const fs      = require('fs');

const prisma             = require('../db');
const { verifyToken }    = require('../middleware/auth');
const { buzzSafetyCheck }    = require('../services/buzzSafety');
const { generateBuzzCaptions } = require('../services/buzzCaption');

// ── Ensure uploads directory exists ──────────────────────────────────────────
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ─── Constants ────────────────────────────────────────────────────────────────
const VALID_TEMPLATES     = ['meme', 'awareness', 'initiative'];
const VALID_STYLES        = ['funny', 'informative', 'emotional'];
const VALID_LINKED_TYPES  = ['issue', 'initiative'];
const VALID_EVENT_TYPES   = ['view', 'click_issue', 'share', 'join'];
const AUTO_HIDE_THRESHOLD = 3; // unique reports before auto-hide

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Shape a buzz_posts row into a safe public response object. */
function formatPost(post, userId) {
  const voteCount   = post._count?.votes   ?? post.votes?.length   ?? 0;
  const followCount = post._count?.follows  ?? post.follows?.length  ?? 0;

  const hasVoted   = userId ? (post.votes   || []).some(v => v.user_id === userId) : false;
  const isFollowing = userId ? (post.follows || []).some(f => f.user_id === userId) : false;

  return {
    id:            post.id,
    author_id:     post.author_id,
    author_name:   post.author?.name ?? null,
    linked_type:   post.linked_type,
    linked_id:     post.linked_id,
    linked_title:  post._linkedTitle ?? null,
    linked_area:   post._linkedArea ?? null,
    linked_status: post._linkedStatus ?? null,
    template:      post.template,
    style:         post.style,
    image_url:     post.image_url,
    caption:       post.caption,
    cta_text:      post.cta_text,
    status:        post.status,
    created_at:    post.created_at,
    vote_count:    voteCount,
    follow_count:  followCount,
    views_count:   post._events?.view ?? 0,
    shares_count:  post._events?.share ?? 0,
    clicks_count:  post._events?.click_issue ?? 0,
    joins_count:   post._events?.join ?? 0,
    has_voted:     hasVoted,
    is_following:  isFollowing,
  };
}

// ─── 1. GET /buzz ─────────────────────────────────────────────────────────────
/**
 * List published posts, newest-first or trending, paginated.
 * Query: ?page=1&limit=20&linked_type=issue&linked_id=42&sort=trending|newest|following&status=published|draft
 */
router.get('/', async (req, res, next) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page,  10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip  = (page - 1) * limit;
    const sort  = req.query.sort || 'newest'; // 'trending' | 'newest' | 'following'

    const userId = req.user?.user_id ? Number(req.user.user_id) : null;

    let where = { status: 'published' };
    if (req.query.status === 'draft') {
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required to view drafts.' });
      }
      where = { status: 'draft', author_id: userId };
    } else if (req.query.status === 'all' && userId) {
      where = { author_id: userId };
    }

    if (req.query.linked_type) where.linked_type = req.query.linked_type;
    if (req.query.linked_id)   where.linked_id   = Number(req.query.linked_id);
    if (sort === 'following' && userId) {
      where.follows = { some: { user_id: userId } };
    }

    let orderBy = { created_at: 'desc' };
    if (sort === 'trending') {
      orderBy = [
        { votes: { _count: 'desc' } },
        { created_at: 'desc' }
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.buzzPost.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          author:  { select: { name: true } },
          _count:  { select: { votes: true, follows: true } },
          votes:   userId ? { where: { user_id: userId }, select: { user_id: true } } : false,
          follows: userId ? { where: { user_id: userId }, select: { user_id: true } } : false,
        },
      }),
      prisma.buzzPost.count({ where }),
    ]);

    // Attach linked entity details in a single batch query
    const entityIds = [...new Set(posts.map(p => p.linked_id))];
    let entityMap = {};
    if (entityIds.length > 0) {
      const entities = await prisma.entity.findMany({
        where: { entity_id: { in: entityIds } },
        select: { entity_id: true, status: true, name: true, area: true },
      });
      entityMap = Object.fromEntries(entities.map(e => [e.entity_id, e]));
    }

    // Attach aggregate event counts (views, shares, etc.) in a single query
    const postIds = posts.map(p => p.id);
    let eventCountsMap = {};
    if (postIds.length > 0) {
      const eventRows = await prisma.buzzEvent.groupBy({
        by: ['post_id', 'type'],
        where: { post_id: { in: postIds } },
        _count: { type: true },
      });
      for (const r of eventRows) {
        if (!eventCountsMap[r.post_id]) eventCountsMap[r.post_id] = {};
        eventCountsMap[r.post_id][r.type] = r._count.type;
      }
    }

    const formatted = posts.map(p => {
      const ent = entityMap[p.linked_id];
      p._linkedStatus = ent?.status ?? null;
      p._linkedTitle  = ent?.name ?? null;
      p._linkedArea   = ent?.area ?? null;
      p._events       = eventCountsMap[p.id] ?? {};
      return formatPost(p, userId);
    });

    res.json({
      success: true,
      data:    formatted,
      meta:    { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
});

// ─── 1b. GET /buzz/:id ────────────────────────────────────────────────────────
/**
 * Retrieve a single buzz post by id for public display or author review.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const postId = Number(req.params.id);
    if (isNaN(postId)) return res.status(400).json({ success: false, message: 'Invalid post ID.' });
    const userId = req.user?.user_id ? Number(req.user.user_id) : null;

    const post = await prisma.buzzPost.findUnique({
      where: { id: postId },
      include: {
        author:  { select: { name: true } },
        _count:  { select: { votes: true, follows: true } },
        votes:   userId ? { where: { user_id: userId }, select: { user_id: true } } : false,
        follows: userId ? { where: { user_id: userId }, select: { user_id: true } } : false,
      },
    });

    if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });

    // Status permission check: if not published, only author or coordinators/admin can view
    if (post.status !== 'published') {
      const isAuthor = userId && post.author_id === userId;
      const isPrivileged = ['admin', 'coordinator_area', 'coordinator_general', 'director'].includes(req.user?.role);
      if (!isAuthor && !isPrivileged) {
        return res.status(404).json({ success: false, message: 'Post not found or not published.' });
      }
    }

    // Attach linked entity details
    const entity = await prisma.entity.findUnique({
      where: { entity_id: post.linked_id },
      select: { entity_id: true, status: true, name: true, area: true, location: true, entity_type_id: true },
    });
    post._linkedStatus = entity?.status ?? null;
    post._linkedTitle  = entity?.name ?? null;
    post._linkedArea   = entity?.area ?? null;

    // Attach event metrics
    const eventRows = await prisma.buzzEvent.groupBy({
      by: ['type'],
      where: { post_id: postId },
      _count: { type: true },
    });
    post._events = {};
    for (const r of eventRows) {
      post._events[r.type] = r._count.type;
    }

    res.json({ success: true, data: formatPost(post, userId) });
  } catch (err) {
    next(err);
  }
});

// ─── 1c. POST /buzz/upload-image ──────────────────────────────────────────────
/**
 * Upload rendered card image (base64 data URL) and store to /uploads.
 */
router.post('/upload-image', verifyToken, async (req, res, next) => {
  try {
    const { image_data } = req.body;
    if (!image_data || typeof image_data !== 'string') {
      return res.status(400).json({ success: false, message: 'image_data string is required.' });
    }

    const matches = image_data.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ success: false, message: 'image_data must be a valid base64 image data URL.' });
    }

    const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    if (buffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ success: false, message: 'Image size exceeds 10MB limit.' });
    }

    const filename = `buzz-card-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const filePath = path.join(UPLOAD_DIR, filename);
    await fs.promises.writeFile(filePath, buffer);

    res.json({ success: true, image_url: `/uploads/${filename}` });
  } catch (err) {
    next(err);
  }
});

// ─── 2. POST /buzz ───────────────────────────────────────────────────────────
/**
 * Create a new buzz post (draft or published).
 * Body: { linked_type, linked_id, template, style, caption, cta_text?, image_url?, status? }
 */
router.post('/', verifyToken, async (req, res, next) => {
  try {
    const userId = Number(req.user.user_id);
    const { linked_type, linked_id, template, style, caption, cta_text, image_url, status = 'draft' } = req.body;

    // ── Validation ──────────────────────────────────────────────────────────
    if (!VALID_LINKED_TYPES.includes(linked_type))
      return res.status(400).json({ success: false, message: `linked_type must be one of: ${VALID_LINKED_TYPES.join(', ')}.` });
    if (!linked_id || isNaN(Number(linked_id)))
      return res.status(400).json({ success: false, message: 'linked_id must be a valid entity ID.' });
    if (!VALID_TEMPLATES.includes(template))
      return res.status(400).json({ success: false, message: `template must be one of: ${VALID_TEMPLATES.join(', ')}.` });
    if (!VALID_STYLES.includes(style))
      return res.status(400).json({ success: false, message: `style must be one of: ${VALID_STYLES.join(', ')}.` });
    if (!caption || typeof caption !== 'string' || caption.trim().length === 0)
      return res.status(400).json({ success: false, message: 'caption is required.' });
    if (caption.length > 500)
      return res.status(400).json({ success: false, message: 'caption must be 500 characters or fewer.' });
    if (cta_text && cta_text.length > 60)
      return res.status(400).json({ success: false, message: 'cta_text must be 60 characters or fewer.' });

    // ── Verify linked entity exists ─────────────────────────────────────────
    const entity = await prisma.entity.findUnique({ where: { entity_id: Number(linked_id) }, select: { entity_id: true } });
    if (!entity)
      return res.status(404).json({ success: false, message: `Linked entity ${linked_id} not found.` });

    // ── Safety check before publish ─────────────────────────────────────────
    const targetStatus = ['draft', 'published'].includes(status) ? status : 'draft';
    if (targetStatus === 'published') {
      const textToCheck = [caption, cta_text].filter(Boolean).join(' ');
      const safety = await buzzSafetyCheck(textToCheck, 'caption');
      if (!safety.safe) {
        return res.status(422).json({
          success: false,
          message: safety.reason || 'Your post did not pass the content safety check. Please revise and resubmit.',
          safety_failed: true,
        });
      }
    }

    const post = await prisma.buzzPost.create({
      data: {
        author_id:   userId,
        linked_type,
        linked_id:   Number(linked_id),
        template,
        style,
        image_url:   image_url || null,
        caption:     caption.trim(),
        cta_text:    cta_text  ? cta_text.trim()  : null,
        status:      targetStatus,
      },
    });

    res.status(201).json({ success: true, data: { id: post.id, status: post.status } });
  } catch (err) {
    next(err);
  }
});

// ─── 3. PATCH /buzz/:id ───────────────────────────────────────────────────────
/**
 * Edit caption / cta / image_url, or publish a draft.
 * Only the author may edit. Status transitions: draft → published, published → draft.
 */
router.patch('/:id', verifyToken, async (req, res, next) => {
  try {
    const postId = Number(req.params.id);
    const userId = Number(req.user.user_id);

    const post = await prisma.buzzPost.findUnique({ where: { id: postId } });
    if (!post)                      return res.status(404).json({ success: false, message: 'Post not found.' });
    if (post.author_id !== userId)  return res.status(403).json({ success: false, message: 'Only the author can edit this post.' });
    if (post.status === 'hidden')   return res.status(403).json({ success: false, message: 'Hidden posts cannot be edited.' });

    const { caption, cta_text, image_url, status } = req.body;
    const updates = {};

    if (caption !== undefined) {
      if (!caption || caption.trim().length === 0)
        return res.status(400).json({ success: false, message: 'caption cannot be empty.' });
      if (caption.length > 500)
        return res.status(400).json({ success: false, message: 'caption must be 500 characters or fewer.' });
      updates.caption = caption.trim();
    }
    if (cta_text  !== undefined) updates.cta_text  = cta_text  ? cta_text.trim().substring(0, 60) : null;
    if (image_url !== undefined) updates.image_url = image_url || null;

    // Validate status transition
    if (status !== undefined) {
      if (!['draft', 'published'].includes(status))
        return res.status(400).json({ success: false, message: "status must be 'draft' or 'published'." });
      updates.status = status;
    }

    // Safety check if publishing
    const willPublish = updates.status === 'published' || (post.status === 'published' && !updates.status);
    if (willPublish) {
      const finalCaption = updates.caption ?? post.caption;
      const finalCta     = updates.cta_text ?? post.cta_text;
      const textToCheck  = [finalCaption, finalCta].filter(Boolean).join(' ');
      const safety = await buzzSafetyCheck(textToCheck, 'caption');
      if (!safety.safe) {
        return res.status(422).json({
          success: false,
          message: safety.reason || 'Your post did not pass the content safety check. Please revise.',
          safety_failed: true,
        });
      }
    }

    const updated = await prisma.buzzPost.update({ where: { id: postId }, data: updates });
    res.json({ success: true, data: { id: updated.id, status: updated.status } });
  } catch (err) {
    next(err);
  }
});

// ─── 4. POST /buzz/:id/vote ───────────────────────────────────────────────────
/** Toggle vote on a published post. Returns new state. */
router.post('/:id/vote', verifyToken, async (req, res, next) => {
  try {
    const postId = Number(req.params.id);
    const userId = Number(req.user.user_id);

    const post = await prisma.buzzPost.findUnique({ where: { id: postId }, select: { status: true } });
    if (!post || post.status !== 'published')
      return res.status(404).json({ success: false, message: 'Post not found or not published.' });

    const existing = await prisma.buzzVote.findUnique({ where: { post_id_user_id: { post_id: postId, user_id: userId } } });

    if (existing) {
      await prisma.buzzVote.delete({ where: { id: existing.id } });
      const count = await prisma.buzzVote.count({ where: { post_id: postId } });
      return res.json({ success: true, voted: false, vote_count: count });
    } else {
      await prisma.buzzVote.create({ data: { post_id: postId, user_id: userId } });
      const count = await prisma.buzzVote.count({ where: { post_id: postId } });
      return res.json({ success: true, voted: true, vote_count: count });
    }
  } catch (err) {
    next(err);
  }
});

// ─── 5. POST /buzz/:id/follow ─────────────────────────────────────────────────
/** Toggle follow on a published post. Returns new state. */
router.post('/:id/follow', verifyToken, async (req, res, next) => {
  try {
    const postId = Number(req.params.id);
    const userId = Number(req.user.user_id);

    const post = await prisma.buzzPost.findUnique({ where: { id: postId }, select: { status: true } });
    if (!post || post.status !== 'published')
      return res.status(404).json({ success: false, message: 'Post not found or not published.' });

    const existing = await prisma.buzzFollow.findUnique({ where: { post_id_user_id: { post_id: postId, user_id: userId } } });

    if (existing) {
      await prisma.buzzFollow.delete({ where: { id: existing.id } });
      const count = await prisma.buzzFollow.count({ where: { post_id: postId } });
      return res.json({ success: true, following: false, follow_count: count });
    } else {
      await prisma.buzzFollow.create({ data: { post_id: postId, user_id: userId } });
      const count = await prisma.buzzFollow.count({ where: { post_id: postId } });
      return res.json({ success: true, following: true, follow_count: count });
    }
  } catch (err) {
    next(err);
  }
});

// ─── 6. GET /buzz/:id/comments ───────────────────────────────────────────────
router.get('/:id/comments', async (req, res, next) => {
  try {
    const postId = Number(req.params.id);
    const page   = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit  = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 30));

    const post = await prisma.buzzPost.findUnique({ where: { id: postId }, select: { status: true } });
    if (!post || post.status !== 'published')
      return res.status(404).json({ success: false, message: 'Post not found or not published.' });

    const [comments, total] = await Promise.all([
      prisma.buzzComment.findMany({
        where:   { post_id: postId },
        orderBy: { created_at: 'asc' },
        skip:    (page - 1) * limit,
        take:    limit,
        include: { user: { select: { name: true } } },
      }),
      prisma.buzzComment.count({ where: { post_id: postId } }),
    ]);

    res.json({
      success: true,
      data: comments.map(c => ({
        id:          c.id,
        user_id:     c.user_id,
        author_name: c.user?.name ?? 'Anonymous',
        text:        c.text,
        created_at:  c.created_at,
      })),
      meta: { page, limit, total },
    });
  } catch (err) {
    next(err);
  }
});

// ─── 7. POST /buzz/:id/comments ──────────────────────────────────────────────
/** Submit a comment. Runs safety check before saving. */
router.post('/:id/comments', verifyToken, async (req, res, next) => {
  try {
    const postId = Number(req.params.id);
    const userId = Number(req.user.user_id);
    const { text } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0)
      return res.status(400).json({ success: false, message: 'Comment text is required.' });
    if (text.length > 500)
      return res.status(400).json({ success: false, message: 'Comment must be 500 characters or fewer.' });

    const post = await prisma.buzzPost.findUnique({ where: { id: postId }, select: { status: true } });
    if (!post || post.status !== 'published')
      return res.status(404).json({ success: false, message: 'Post not found or not published.' });

    // Safety check before persisting
    const safety = await buzzSafetyCheck(text.trim(), 'comment');
    if (!safety.safe) {
      return res.status(422).json({
        success: false,
        message: safety.reason || 'Your comment did not pass the community safety check. Please revise.',
        safety_failed: true,
      });
    }

    const comment = await prisma.buzzComment.create({
      data: { post_id: postId, user_id: userId, text: text.trim() },
    });

    res.status(201).json({ success: true, data: { id: comment.id, created_at: comment.created_at } });
  } catch (err) {
    next(err);
  }
});

// ─── 8. POST /buzz/:id/event ─────────────────────────────────────────────────
/** Record an analytics event (view, click_issue, share, join). No auth required. */
router.post('/:id/event', async (req, res, next) => {
  try {
    const postId  = Number(req.params.id);
    const userId  = req.user?.user_id ? Number(req.user.user_id) : null;
    const { type } = req.body;

    if (!VALID_EVENT_TYPES.includes(type))
      return res.status(400).json({ success: false, message: `type must be one of: ${VALID_EVENT_TYPES.join(', ')}.` });

    const post = await prisma.buzzPost.findUnique({ where: { id: postId }, select: { id: true } });
    if (!post)
      return res.status(404).json({ success: false, message: 'Post not found.' });

    await prisma.buzzEvent.create({ data: { post_id: postId, user_id: userId, type } });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// ─── 9. GET /buzz/:id/stats ──────────────────────────────────────────────────
/**
 * Aggregated analytics derived only from buzz_events.
 * Returns: views, issue_link_clicks, shares, joins.
 */
router.get('/:id/stats', verifyToken, async (req, res, next) => {
  try {
    const postId = Number(req.params.id);
    const userId = Number(req.user.user_id);

    const post = await prisma.buzzPost.findUnique({ where: { id: postId }, select: { author_id: true, status: true } });
    if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });

    // Only author (or admin/coordinator) can view stats
    const role = req.user.role;
    const canView = post.author_id === userId || ['admin', 'coordinator_area', 'coordinator_general', 'director'].includes(role);
    if (!canView) return res.status(403).json({ success: false, message: 'Access denied.' });

    const rows = await prisma.buzzEvent.groupBy({
      by:     ['type'],
      where:  { post_id: postId },
      _count: { type: true },
    });

    const stats = { views: 0, issue_link_clicks: 0, shares: 0, joins: 0 };
    for (const row of rows) {
      if (row.type === 'view')        stats.views             = row._count.type;
      if (row.type === 'click_issue') stats.issue_link_clicks = row._count.type;
      if (row.type === 'share')       stats.shares            = row._count.type;
      if (row.type === 'join')        stats.joins             = row._count.type;
    }

    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
});

// ─── 10. POST /buzz/captions ─────────────────────────────────────────────────
/**
 * AI caption generation.
 * Body: { linked_type, linked_id, style, template? }
 */
router.post('/captions', verifyToken, async (req, res, next) => {
  try {
    let { linked_type, linked_id, style, template = 'meme' } = req.body;

    if (!VALID_LINKED_TYPES.includes(linked_type))
      return res.status(400).json({ success: false, message: `linked_type must be one of: ${VALID_LINKED_TYPES.join(', ')}.` });
    if (!linked_id || isNaN(Number(linked_id)))
      return res.status(400).json({ success: false, message: 'linked_id is required.' });
    if (!VALID_STYLES.includes(style))
      return res.status(400).json({ success: false, message: `style must be one of: ${VALID_STYLES.join(', ')}.` });
    if (template && !VALID_TEMPLATES.includes(template))
      return res.status(400).json({ success: false, message: `template must be one of: ${VALID_TEMPLATES.join(', ')}.` });

    const result = await generateBuzzCaptions(
      { linked_type, linked_id: Number(linked_id), style, template: template || 'meme' },
      req.user.user_id
    );

    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
});

// ─── 11. POST /buzz/:id/report ───────────────────────────────────────────────
/**
 * Report a post. Once AUTO_HIDE_THRESHOLD different users report it,
 * the post is automatically hidden. No manual moderator required.
 */
router.post('/:id/report', verifyToken, async (req, res, next) => {
  try {
    const postId = Number(req.params.id);
    const userId = Number(req.user.user_id);
    const { reason } = req.body;

    const post = await prisma.buzzPost.findUnique({ where: { id: postId }, select: { status: true, author_id: true } });
    if (!post || post.status === 'hidden')
      return res.status(404).json({ success: false, message: 'Post not found.' });

    // Prevent self-report
    if (post.author_id === userId)
      return res.status(400).json({ success: false, message: 'You cannot report your own post.' });

    // Upsert — each user can only report once per post
    await prisma.buzzReport.upsert({
      where:  { post_id_user_id: { post_id: postId, user_id: userId } },
      update: { reason: reason || null },
      create: { post_id: postId, user_id: userId, reason: reason || null },
    });

    // Count unique reporters
    const reportCount = await prisma.buzzReport.count({ where: { post_id: postId } });

    if (reportCount >= AUTO_HIDE_THRESHOLD) {
      await prisma.buzzPost.update({ where: { id: postId }, data: { status: 'hidden' } });
      return res.json({ success: true, message: 'Thank you for your report. This post has been reviewed and hidden.' });
    }

    res.json({ success: true, message: 'Your report has been received. Thank you for keeping the community safe.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

