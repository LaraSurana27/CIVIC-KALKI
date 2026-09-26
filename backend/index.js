/**
 * CIVIC-KALKI — Express Entry Point
 * Mounts all routers and global middleware.
 */

require('dotenv').config({ quiet: true });

const express = require('express');
const cors = require('cors');
const app = express();

// ── CORS — allow the Vite frontend dev server and production URL ──
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (curl, Postman, same-origin)
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

const errorHandler = require('./middleware/errorHandler');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const entityRoutes = require('./routes/entity');
const formRoutes = require('./routes/form');
const parameterValueRoutes = require('./routes/parameterValue');
const reportRoutes = require('./routes/report');
const moduleBuilderRoutes = require('./routes/moduleBuilder');
const jurisdictionRoutes = require('./routes/jurisdiction');
const fileRoutes = require('./routes/file');
const translateRoutes = require('./routes/translate');
const governanceRoutes = require('./routes/governance');

// ── Body parsing (limit set to prevent oversized payloads) ──
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

// ── Health check ──
app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'CIVIC-KALKI API is running.' });
});

// ── Route mounting ──
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/jurisdictions', jurisdictionRoutes);
app.use('/entities', entityRoutes);
app.use('/entities/:id/values', parameterValueRoutes);   // ParameterValue storage
app.use('/reports', reportRoutes); // ReportMaster runtime execution
app.use('/module-builder', moduleBuilderRoutes); // Phase 3A atomic module deployment
app.use('/', formRoutes);          // mounts /forms, /sections, /subsections
app.use('/files', fileRoutes);     // File upload engine
app.use('/translate', translateRoutes); // Multilingual translation service
app.use('/governance', governanceRoutes); // Governance Intelligence engine

// ── Serve uploaded files statically ──
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Global error handler (must be last) ──
app.use(errorHandler);

// ── Start server only when run directly ──
const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`CIVIC-KALKI server listening on port ${PORT}`);
  });
}

module.exports = app;
