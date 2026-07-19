import type { RequestHandler } from "express";
import { sendData } from "../../shared/http-response.js";
import type {
  CreateRoleInput,
  UpdateRoleInput,
  UpdateUserRolesInput,
} from "./rbac.schemas.js";
import type { RbacService } from "./rbac.service.js";

export class RbacController {
  constructor(private readonly service: RbacService) {}

  listPermissions: RequestHandler = async (_req, res) =>
    sendData(res, await this.service.listPermissions());
  listRoles: RequestHandler = async (_req, res) =>
    sendData(res, await this.service.listRoles());
  createRole: RequestHandler = async (req, res) =>
    sendData(
      res,
      await this.service.createRole(req.body as CreateRoleInput),
      201,
    );
  updateRole: RequestHandler = async (req, res) =>
    sendData(
      res,
      await this.service.updateRole(
        req.params.id as string,
        req.body as UpdateRoleInput,
      ),
    );
  deleteRole: RequestHandler = async (req, res) => {
    await this.service.deleteRole(req.params.id as string);
    res.status(204).send();
  };
  listUsers: RequestHandler = async (_req, res) =>
    sendData(res, await this.service.listUsers());
  updateUserRoles: RequestHandler = async (req, res) => {
    await this.service.updateUserRoles(
      req.params.id as string,
      req.body as UpdateUserRolesInput,
    );
    res.status(204).send();
  };
}
