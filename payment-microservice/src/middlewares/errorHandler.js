import logger from '../config/logger.js';

export default function errorHandler(err, req, res, _next) {
  logger.error(err && err.message ? `${err.message}` : String(err));
  const status = err.status || 500;
  const payload = {
    error: err.message || 'Internal Server Error',
  };
  if (err.details) payload.details = err.details;
  res.status(status).json(payload);
}
