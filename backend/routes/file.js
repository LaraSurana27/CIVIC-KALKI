/**
 * CIVIC-KALKI — File Upload Engine
 * Handles file uploads for entity parameters with field_type 'file'.
 * Files are stored locally in the /uploads directory and tracked via FileRepository.
 *
 * Routes:
 *   POST   /files/upload          — Upload one or more files for an entity+parameter
 *   GET    /files/entity/:id      — List all files for an entity
 *   GET    /files/:fileId         — Download a specific file
 *   DELETE /files/:fileId         — Remove a file record and its physical file
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const prisma = require('../db');

// ── Ensure uploads directory exists ──────────────────────────────────────────
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ── Multer configuration ─────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
    const ext = path.extname(file.originalname);
    const safeName = file.originalname
      .replace(ext, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 60);
    cb(null, `${safeName}-${uniqueSuffix}${ext}`);
  },
});

const ALLOWED_MIME_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
  'application/pdf',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain', 'text/csv',
  'application/zip', 'application/x-zip-compressed',
];

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type "${file.mimetype}" is not allowed. Accepted: images, PDF, Word, Excel, CSV, text, ZIP.`));
    }
  },
});

// ── Helper ───────────────────────────────────────────────────────────────────
function createError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

function parsePositiveInt(value, fieldName) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw createError(`"${fieldName}" must be a positive integer. Received: ${value}`, 400);
  }
  return parsed;
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /files/upload
// Upload files for an entity parameter.
// Form fields: entity_id, parameter_id  |  File field: files (multipart)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/upload', upload.array('files', 5), async (req, res, next) => {
  try {
    const { entity_id, parameter_id } = req.body;

    if (!entity_id) return next(createError('"entity_id" is required.', 400));
    if (!parameter_id) return next(createError('"parameter_id" is required.', 400));

    const parsedEntityId = parsePositiveInt(entity_id, 'entity_id');
    const parsedParamId = parsePositiveInt(parameter_id, 'parameter_id');

    // Verify entity exists
    const entity = await prisma.entity.findUnique({ where: { entity_id: parsedEntityId } });
    if (!entity) return next(createError(`Entity ${parsedEntityId} not found.`, 404));

    // Verify parameter exists and is a file type
    const param = await prisma.parameterMaster.findUnique({ where: { parameter_id: parsedParamId } });
    if (!param) return next(createError(`Parameter ${parsedParamId} not found.`, 404));

    if (!req.files || req.files.length === 0) {
      return next(createError('No files were uploaded.', 400));
    }

    // Create FileRepository records
    const fileRecords = [];
    for (const file of req.files) {
      const record = await prisma.fileRepository.create({
        data: {
          entity_id: parsedEntityId,
          parameter_id: parsedParamId,
          file_name: file.originalname,
          path: file.filename, // stored filename on disk
        },
      });
      fileRecords.push({
        ...record,
        size: file.size,
        mimetype: file.mimetype,
      });
    }

    // Also create/update a ParameterValue entry storing the filename(s)
    const fileNames = req.files.map(f => f.originalname).join(', ');
    const existingPv = await prisma.parameterValue.findFirst({
      where: { entity_id: parsedEntityId, parameter_id: parsedParamId },
    });
    if (existingPv) {
      await prisma.parameterValue.update({
        where: { value_id: existingPv.value_id },
        data: { value: fileNames },
      });
    } else {
      await prisma.parameterValue.create({
        data: { entity_id: parsedEntityId, parameter_id: parsedParamId, value: fileNames },
      });
    }

    return res.status(201).json({ success: true, data: fileRecords });
  } catch (err) {
    return next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /files/entity/:id
// List all files for an entity
// ─────────────────────────────────────────────────────────────────────────────
router.get('/entity/:id', async (req, res, next) => {
  try {
    const entityId = parsePositiveInt(req.params.id, 'id');
    const files = await prisma.fileRepository.findMany({
      where: { entity_id: entityId },
      include: {
        parameterMaster: { select: { parameter_id: true, label: true, field_key: true } },
      },
      orderBy: { file_id: 'desc' },
    });
    return res.status(200).json({ success: true, data: files });
  } catch (err) {
    return next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /files/:fileId
// Download / serve a specific file
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:fileId', async (req, res, next) => {
  try {
    const fileId = parsePositiveInt(req.params.fileId, 'fileId');
    const record = await prisma.fileRepository.findUnique({ where: { file_id: fileId } });
    if (!record) return next(createError(`File ${fileId} not found.`, 404));

    const filePath = path.join(UPLOAD_DIR, record.path);
    if (!fs.existsSync(filePath)) {
      return next(createError('File not found on disk.', 404));
    }

    res.download(filePath, record.file_name);
  } catch (err) {
    return next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /files/:fileId
// Remove file record and physical file
// ─────────────────────────────────────────────────────────────────────────────
router.delete('/:fileId', async (req, res, next) => {
  try {
    const fileId = parsePositiveInt(req.params.fileId, 'fileId');
    const record = await prisma.fileRepository.findUnique({ where: { file_id: fileId } });
    if (!record) return next(createError(`File ${fileId} not found.`, 404));

    // Delete physical file (best effort)
    const filePath = path.join(UPLOAD_DIR, record.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await prisma.fileRepository.delete({ where: { file_id: fileId } });

    return res.status(200).json({ success: true, message: `File ${fileId} deleted.` });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
