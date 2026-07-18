import cors from "cors";
import express, { type Express } from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import type { Pool } from "pg";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env.js";
import { pool } from "./config/database.js";
import { createHealthRouter } from "./health.js";
import { errorHandler, notFound } from "./middleware/error.js";
import { requestLogger } from "./middleware/request-logger.js";
import { AuthController } from "./modules/auth/auth.controller.js";
import { AuthRepository } from "./modules/auth/auth.repository.js";
import { createAuthRouter } from "./modules/auth/auth.routes.js";
import { AuthService } from "./modules/auth/auth.service.js";
import { TaskController } from "./modules/tasks/task.controller.js";
import { TaskRepository } from "./modules/tasks/task.repository.js";
import { createTaskRouter } from "./modules/tasks/task.routes.js";
import { TaskService } from "./modules/tasks/task.service.js";
import { openApiDocument } from "./openapi.js";
import { AppError } from "./shared/app-error.js";
import { sendError } from "./shared/http-response.js";

export function createApp(db: Pool = pool): Express {
  const app = express();
  const defaultHelmet = helmet();
  const docsHelmet = helmet({ contentSecurityPolicy: false });
  const allowedOrigins = new Set(
    env.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
  );

  if (env.NODE_ENV === "production") app.set("trust proxy", 1);
  app.disable("x-powered-by");
  app.use((req, res, next) =>
    req.path.startsWith("/docs")
      ? docsHelmet(req, res, next)
      : defaultHelmet(req, res, next),
  );
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.has("*") || allowedOrigins.has(origin))
          callback(null, true);
        else
          callback(
            new AppError(403, "CORS_FORBIDDEN", "Origin is not allowed"),
          );
      },
    }),
  );
  app.use(express.json({ limit: "100kb" }));
  app.use(requestLogger);
  app.use(
    rateLimit({
      windowMs: 60_000,
      limit: 300,
      standardHeaders: "draft-8",
      legacyHeaders: false,
      handler: (_req, res) => {
        sendError(res, 429, "RATE_LIMITED", "Too many requests");
      },
    }),
  );

  const authRepository = new AuthRepository(db);
  const authController = new AuthController(new AuthService(authRepository));
  const taskRepository = new TaskRepository(db);
  const taskController = new TaskController(new TaskService(taskRepository));

  app.use(createHealthRouter(db));
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
  app.use("/api/auth", createAuthRouter(authController));
  app.use("/api/tasks", createTaskRouter(taskController));
  app.use(notFound);
  app.use(errorHandler);
  return app;
}

export const app = createApp();
