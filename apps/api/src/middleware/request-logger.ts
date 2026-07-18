import type { RequestHandler } from 'express';
import { logger } from '../shared/logger.js';

export const requestLogger: RequestHandler = (req, res, next) => {
  const startedAt = performance.now();
  res.on('finish', () => {
    logger.info('request_completed', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      durationMs: Math.round(performance.now() - startedAt),
    });
  });
  next();
};
