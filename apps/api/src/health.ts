import { Router } from 'express';
import type { Pool } from 'pg';
import { AppError } from './shared/app-error.js';
import { sendData } from './shared/http-response.js';

export function createHealthRouter(db: Pool): Router {
  const router = Router();

  router.get('/health', (_req, res) => {
    sendData(res, { status: 'ok' });
  });

  router.get('/ready', async (_req, res) => {
    try {
      await db.query('SELECT 1');
    } catch {
      throw new AppError(503, 'NOT_READY', 'Database is not ready');
    }
    sendData(res, { status: 'ready' });
  });

  return router;
}
