import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/authRoutes.js';
import credentialRoutes from './routes/credentialRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const app = express();

/**
 * ========================
 * CORS CONFIG (PRODUCTION SAFE)
 * ========================
 */
const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map(origin => origin.trim());

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
}));

/**
 * ========================
 * SECURITY MIDDLEWARE
 * ========================
 */
app.use(helmet());

app.use(express.json({ limit: '1mb' }));

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

/**
 * ========================
 * RATE LIMITING
 * ========================
 */
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 250, // requests per IP
    standardHeaders: true,
    legacyHeaders: false
  })
);

/**
 * ========================
 * HEALTH CHECK ROUTE
 * ========================
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SecureVault Pro API',
    timestamp: new Date().toISOString()
  });
});

/**
 * ========================
 * API ROUTES
 * ========================
 */
app.use('/api/auth', authRoutes);
app.use('/api/credentials', credentialRoutes);

/**
 * ========================
 * ERROR HANDLING
 * ========================
 */
app.use(notFound);
app.use(errorHandler);

export default app;