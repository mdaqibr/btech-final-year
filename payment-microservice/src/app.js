import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import expressJson from 'express';
import rateLimiter from './middlewares/rateLimiter.js';
import paymentRoutes from './routes/paymentRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import logger from './config/logger.js';
import config from './config/index.js';

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors({
  origin: config.ALLOWED_ORIGINS,
  methods: ['GET', 'POST', 'OPTIONS'],
}));

// Limit body size to prevent abuse
app.use(express.json({ limit: '100kb' }));

// Rate limiting
app.use(rateLimiter);

// Simple health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// API routes
app.use('/payments', paymentRoutes);

// Error handler (centralized)
app.use(errorHandler);

// Catch-all 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

export default app;
