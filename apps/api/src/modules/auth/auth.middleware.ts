import type { RequestHandler } from "express";
import jsonwebtoken from "jsonwebtoken";
import { AppError } from "../../shared/app-error.js";
import { verifyAccessToken } from "./token.service.js";

const { JsonWebTokenError, TokenExpiredError } = jsonwebtoken;

export const authenticate: RequestHandler = (req, _res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith("Bearer ")) {
    throw new AppError(401, "AUTH_REQUIRED", "A Bearer token is required");
  }

  const token = authorization.slice(7).trim();
  if (!token)
    throw new AppError(401, "AUTH_REQUIRED", "A Bearer token is required");

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new AppError(401, "TOKEN_EXPIRED", "Access token has expired");
    }
    if (error instanceof JsonWebTokenError || error instanceof Error) {
      throw new AppError(401, "INVALID_TOKEN", "Access token is invalid");
    }
    throw error;
  }
};

export function checkPermission(
  requiredPermissions: readonly string[],
): RequestHandler {
  return (req, _res, next) => {
    if (!req.user)
      throw new AppError(401, "AUTH_REQUIRED", "Authentication is required");
    if (
      !requiredPermissions.some((permission) =>
        req.user!.permissions.includes(permission),
      )
    ) {
      throw new AppError(403, "FORBIDDEN", "Insufficient permissions");
    }
    next();
  };
}
