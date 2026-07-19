import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../shared/app-error.js";
import { sendError } from "../shared/http-response.js";
import { logger } from "../shared/logger.js";

export const notFound: RequestHandler = (req, _res, next) => {
  next(
    new AppError(404, "NOT_FOUND", `Route ${req.method} ${req.path} not found`),
  );
};

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  req,
  res,
  _next,
) => {
  if (error instanceof ZodError) {
    sendError(
      res,
      400,
      "VALIDATION_ERROR",
      "Request validation failed",
      error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    );
    return;
  }

  if (
    error instanceof SyntaxError &&
    "status" in error &&
    error.status === 400
  ) {
    sendError(res, 400, "INVALID_JSON", "Malformed JSON body");
    return;
  }

  const appError =
    error instanceof AppError
      ? error
      : new AppError(500, "INTERNAL_ERROR", "Internal server error");

  if (appError.status >= 500) {
    logger.error("request_failed", {
      method: req.method,
      path: req.path,
      status: appError.status,
      code: appError.code,
    });
  }

  sendError(
    res,
    appError.status,
    appError.code,
    appError.message,
    appError.details,
  );
};
