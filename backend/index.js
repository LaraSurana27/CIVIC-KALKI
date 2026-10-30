/**
 * CIVIC-KALKI â€” Express Entry Point
 * Mounts all routers and global middleware.
 */

require('dotenv').config({ quiet: true });

// â”€â”€ JWT Secret Strict Startup Validation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.error('FATAL: JWT_SECRET environment variable is missing or shorter than 32 characters.');
  process.exit(1);
}

const express = require('express');
const cors = require('cors');
const app = express();

// â”€â”€ Trust Proxy â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.set('trust proxy', Number(process.env.TRUST_PROXY_HOPS ?? 1));

// â”€â”€ CORS Configuration â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const envOrigins = (process.env.FRONTEND_ORIGIN || process.env.FRONTEND_URL || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  ...envOrigins,
];

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

const errorHandler = require('./middleware/errorHandler');
const { optionalAuth } = require('./middleware/checkRole');
const { csrfProtection } = require('./middleware/csrf');

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
const agentRoutes = require('./routes/agent');          // Conversational Agent (V1)
const memeRoutes  = require('./routes/meme');           // Civic Meme Studio
const buzzRoutes  = require('./routes/buzz');           // Civic Buzz

// â”€â”€ Body parsing (limit set to prevent oversized payloads) â”€â”€
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

// â”€â”€ CSRF protection for state-changing methods â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.use(csrfProtection);

// â”€â”€ Global optional authentication (attaches req.user if session cookie present) â”€â”€
app.use(optionalAuth);

// â”€â”€ Health check â”€â”€
app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'CIVIC-KALKI API is running.' });
});

// â”€â”€ Route mounting â”€â”€
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
app.use('/agent', agentRoutes);          // Conversational Agent Layer (V1)
app.use('/meme', memeRoutes);            // Civic Meme Studio
app.use('/buzz', buzzRoutes);            // Civic Buzz

// â”€â”€ Serve uploaded files statically â”€â”€
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// â”€â”€ Global error handler (must be last) â”€â”€
app.use(errorHandler);

// â”€â”€ Start server only when run directly â”€â”€
const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`CIVIC-KALKI server listening on port ${PORT}`);
  });
}

module.exports = app;
