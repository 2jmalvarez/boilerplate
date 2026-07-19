import type { RequestHandler } from "express";
import { env } from "../config/env.js";
import { logger } from "../shared/logger.js";

export const requestLogger: RequestHandler = (req, res, next) => {
  const logLevel = env.HTTP_LOG_LEVEL;
  if (logLevel === "off") return next();

  const startedAt = performance.now();
  res.on("finish", () => {
    logger.request({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: Math.round(performance.now() - startedAt),
      params: req.params,
      query: req.query,
      body: req.body,
      requestError: res.locals.requestError,
    }, logLevel, env.HTTP_LOG_COLORS);
  });
  next();
};
