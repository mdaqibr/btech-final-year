// Ensure env loads before anything else
import 'dotenv/config';
import http from 'http';
import app from './app.js';
import config from './config/index.js';
import logger from './config/logger.js';

const server = http.createServer(app);

server.listen(config.PORT, () => {
  logger.info(`Payment microservice listening on port ${config.PORT} (env=${config.NODE_ENV})`);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
  // In production: consider graceful shutdown and alerting
});
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1); // crash and restart (recommended)
});
