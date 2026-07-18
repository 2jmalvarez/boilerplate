import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import type { AuthController } from './auth.controller.js';
import { authenticate } from './auth.middleware.js';
import { loginSchema, registerSchema } from './auth.schemas.js';
import { validate } from '../../middleware/validate.js';
import { sendError } from '../../shared/http-response.js';

export function createAuthRouter(controller: AuthController): Router {
  const router = Router();
  const authLimiter = rateLimit({
    windowMs: 15 * 60_000,
    limit: 20,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (_req, res) => {
      sendError(res, 429, 'RATE_LIMITED', 'Too many authentication attempts');
    },
  });

  router.post('/register', authLimiter, validate({ body: registerSchema }), controller.register);
  router.post('/login', authLimiter, validate({ body: loginSchema }), controller.login);
  router.get('/me', authenticate, controller.me);
  return router;
}
