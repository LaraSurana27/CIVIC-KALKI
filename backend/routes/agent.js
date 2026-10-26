/**
 * CIVIC-KALKI — Conversational Agent Route (v2 — with file upload support)
 *
 * POST /agent/chat accepts BOTH:
 *   (a) application/json          { sessionId, message }
 *   (b) multipart/form-data       fields: sessionId, message  +  file: attachment (optional)
 *
 * When a file is present the route stores it temporarily on disk (same multer
 * storage used by /files/upload) and passes the file metadata to the form-
 * filling engine, which keeps it in session.pendingFiles[] until the entity
 * is created at submission time, then calls POST /files/upload internally.
 *
 * Auth: verifyToken (same JWT every other citizen route uses).
 */

const express = require('express');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const router  = express.Router();
const { verifyToken }       = require('../middleware/auth');
const { continueFormFilling, clearSession } = require('../services/agentFormFiller');

// ── Reuse the same uploads directory as /files ────────────────────────────────
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain', 'text/csv',
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext      = path.extname(file.originalname);
    const safeName = file.originalname.replace(ext, '').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 50);
    cb(null, `agent-${safeName}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) return cb(null, true);
    cb(new Error(`File type "${file.mimetype}" is not allowed. Use images, PDF, Word, or plain text.`));
  },
});

// ── Helper ────────────────────────────────────────────────────────────────────
function createError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /agent/chat
// Accepts JSON or multipart/form-data (when user attaches a file).
// Fields: sessionId (string), message (string), attachment (file, optional)
// ─────────────────────────────────────────────────────────────────────────────
router.post(
  '/chat',
  verifyToken,
  upload.single('attachment'), // no-op when Content-Type is application/json
  async (req, res, next) => {
    try {
      const sessionId = req.body?.sessionId;
      const message   = req.body?.message;

      if (!sessionId || typeof sessionId !== 'string' || !sessionId.trim()) {
        return next(createError('"sessionId" is required and must be a non-empty string.', 400));
      }
      const cleanSessionId = sessionId.trim();
      const fileUploaded = Boolean(req.file);
      let cleanMessage = typeof message === 'string' ? message.trim() : '';

      if (!cleanMessage) {
        if (fileUploaded) {
          cleanMessage = `I have uploaded an attachment: ${req.file.originalname}. Please inspect and file this.`;
        } else {
          return next(createError('"message" is required and must be a non-empty string.', 400));
        }
      }

      if (cleanMessage.length > 2000) {
        return next(createError('Message is too long (max 2000 characters).', 400));
      }

      // Build file attachment object if a file was uploaded
      const attachedFile = req.file
        ? {
            diskPath:     path.join(UPLOAD_DIR, req.file.filename),
            storedName:   req.file.filename,       // saved filename on disk
            originalName: req.file.originalname,   // user's original filename
            mimeType:     req.file.mimetype,
            size:         req.file.size,
          }
        : null;

      const user = {
        user_id: Number(req.user.user_id),
        role:    req.user.role || 'citizen',
      };

      const result = await continueFormFilling(cleanSessionId, cleanMessage, user, [], attachedFile);

      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      // Clean up temp file on error
      if (req.file) {
        const tmpPath = path.join(UPLOAD_DIR, req.file.filename);
        fs.unlink(tmpPath, () => {});
      }
      return next(err);
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /agent/chat/:sessionId — clear a session (page navigate-away)
// ─────────────────────────────────────────────────────────────────────────────
router.delete('/chat/:sessionId', verifyToken, async (req, res, next) => {
  try {
    clearSession(req.params.sessionId);
    return res.status(200).json({ success: true, message: 'Session cleared.' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
