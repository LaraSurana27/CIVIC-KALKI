/**
 * CIVIC-KALKI — Express Entry Point
 * Mounts all routers and global middleware.
 */

const express = require('express');
const app = express();

const errorHandler = require('./middleware/errorHandler');
const entityRoutes = require('./routes/entity');
const formRoutes = require('./routes/form');
const parameterValueRoutes = require('./routes/parameterValue');

// ── Body parsing (limit set to prevent oversized payloads) ──
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

// ── Health check ──
app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'CIVIC-KALKI API is running.' });
});

// ── Route mounting ──
app.use('/entities', entityRoutes);
app.use('/entities/:id/values', parameterValueRoutes);   // ParameterValue storage
app.use('/', formRoutes);          // mounts /forms, /sections, /subsections

// ── Global error handler (must be last) ──
app.use(errorHandler);

// ── Start server ──
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CIVIC-KALKI server listening on port ${PORT}`);
});

module.exports = app;
