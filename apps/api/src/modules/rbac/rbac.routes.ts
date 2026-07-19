import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { authenticate, checkPermission } from "../auth/auth.middleware.js";
import type { RbacController } from "./rbac.controller.js";
import {
  createRoleSchema,
  roleIdSchema,
  updateRoleSchema,
  updateUserRolesSchema,
  userIdSchema,
} from "./rbac.schemas.js";

export function createRbacRouter(controller: RbacController): Router {
  const router = Router();
  router.use(authenticate);
  router.get(
    "/permissions",
    checkPermission(["permission:read"]),
    controller.listPermissions,
  );
  router.get("/roles", checkPermission(["role:read"]), controller.listRoles);
  router.post(
    "/roles",
    checkPermission(["role:create"]),
    validate({ body: createRoleSchema }),
    controller.createRole,
  );
  router.patch(
    "/roles/:id",
    checkPermission(["role:update"]),
    validate({ params: roleIdSchema, body: updateRoleSchema }),
    controller.updateRole,
  );
  router.delete(
    "/roles/:id",
    checkPermission(["role:delete"]),
    validate({ params: roleIdSchema }),
    controller.deleteRole,
  );
  router.get("/users", checkPermission(["user:read"]), controller.listUsers);
  router.put(
    "/users/:id/roles",
    checkPermission(["user:update-roles"]),
    validate({ params: userIdSchema, body: updateUserRolesSchema }),
    controller.updateUserRoles,
  );
  return router;
}
