import { Router } from "express";
import { authenticate, checkPermission } from "../auth/auth.middleware.js";
import { validate } from "../../middleware/validate.js";
import type { TaskController } from "./task.controller.js";
import {
  createTaskSchema,
  listTasksSchema,
  taskParamsSchema,
  updateTaskSchema,
} from "./task.schemas.js";

export function createTaskRouter(controller: TaskController): Router {
  const router = Router();
  router.use(authenticate);
  router.get(
    "/",
    checkPermission(["task:read"]),
    validate({ query: listTasksSchema }),
    controller.list,
  );
  router.post(
    "/",
    checkPermission(["task:create"]),
    validate({ body: createTaskSchema }),
    controller.create,
  );
  router.get(
    "/:id",
    checkPermission(["task:read"]),
    validate({ params: taskParamsSchema }),
    controller.get,
  );
  router.patch(
    "/:id",
    checkPermission(["task:update"]),
    validate({ params: taskParamsSchema, body: updateTaskSchema }),
    controller.update,
  );
  router.delete("/:id", checkPermission(["task:delete"]), controller.delete);
  return router;
}
