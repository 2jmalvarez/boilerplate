import type { AuthenticatedUser } from '../shared/types.js';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      validatedQuery?: unknown;
    }
  }
}

export {};
