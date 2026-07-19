import { app } from "./app.js";
import { pool } from "./config/database.js";
import { env } from "./config/env.js";
import { logger } from "./shared/logger.js";

const server = app.listen(env.PORT, () => {
  logger.info("server_started", { port: env.PORT, environment: env.NODE_ENV });
});

server.on("error", () => {
  logger.error("http_server_failed");
  process.exit(1);
});

pool.on("error", () => {
  logger.error("database_pool_error");
});

function shutdown(signal: string): void {
  logger.info("shutdown_started", { signal });
  server.close((error) => {
    if (error) {
      logger.error("http_shutdown_failed");
      process.exitCode = 1;
    }
    void pool
      .end()
      .catch(() => {
        logger.error("database_shutdown_failed");
        process.exitCode = 1;
      })
      .finally(() => process.exit());
  });

  setTimeout(() => {
    logger.error("shutdown_timeout");
    process.exit(1);
  }, 10_000).unref();
}

process.once("SIGTERM", () => shutdown("SIGTERM"));
process.once("SIGINT", () => shutdown("SIGINT"));
