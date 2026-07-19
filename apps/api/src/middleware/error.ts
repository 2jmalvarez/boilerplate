import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../shared/app-error.js";
import { sendError } from "../shared/http-response.js";

export const notFound: RequestHandler = (req, _res, next) => {
  next(
    new AppError(404, "NOT_FOUND", `Route ${req.method} ${req.path} not found`),
  );
};

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req,
  res,
  _next,
) => {
  if (error instanceof ZodError) {
    res.locals.requestError = {
      code: "VALIDATION_ERROR",
      message: "Request validation failed",
    };
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
    res.locals.requestError = {
      code: "INVALID_JSON",
      message: "Malformed JSON body",
      cause: error.message,
    };
    sendError(res, 400, "INVALID_JSON", "Malformed JSON body");
    return;
  }

  const appError =
    error instanceof AppError
      ? error
      : new AppError(500, "INTERNAL_ERROR", "Internal server error");

  res.locals.requestError = {
    code: appError.code,
    message: appError.message,
    cause:
      error instanceof Error && error.message !== appError.message
        ? error.message
        : undefined,
  };

  sendError(
    res,
    appError.status,
    appError.code,
    appError.message,
    appError.details,
  );
};
