import { AppError } from "../../shared/app-error.js";
import type {
  CreateRoleInput,
  UpdateRoleInput,
  UpdateUserRolesInput,
} from "./rbac.schemas.js";
import type { RbacRepository } from "./rbac.repository.js";

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  );
}

export class RbacService {
  constructor(private readonly repository: RbacRepository) {}

  listPermissions() {
    return this.repository.listPermissions();
  }

  listRoles() {
    return this.repository.listRoles();
  }

  async createRole(input: CreateRoleInput) {
    try {
      return await this.repository.createRole(input);
    } catch (error) {
      this.handleWriteError(error);
    }
  }

  async updateRole(id: string, input: UpdateRoleInput) {
    const current = await this.repository.findRole(id);
    if (!current) throw new AppError(404, "ROLE_NOT_FOUND", "Role not found");
    if (current.isDefault && input.isDefault === false) {
      throw new AppError(
        409,
        "DEFAULT_ROLE_REQUIRED",
        "Assign another default role before removing this one",
      );
    }
    try {
      return await this.repository.updateRole(id, input);
    } catch (error) {
      this.handleWriteError(error);
    }
  }

  async deleteRole(id: string): Promise<void> {
    const role = await this.repository.findRole(id);
    if (!role) throw new AppError(404, "ROLE_NOT_FOUND", "Role not found");
    if (role.isDefault) {
      throw new AppError(
        409,
        "DEFAULT_ROLE_REQUIRED",
        "Assign another default role before deleting this one",
      );
    }
    await this.repository.deleteRole(id);
  }

  listUsers() {
    return this.repository.listUsers();
  }

  async updateUserRoles(
    userId: string,
    input: UpdateUserRolesInput,
  ): Promise<void> {
    try {
      if (!(await this.repository.replaceUserRoles(userId, input.roleIds))) {
        throw new AppError(404, "USER_NOT_FOUND", "User not found");
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (error instanceof Error && error.message === "INVALID_ROLE_IDS") {
        throw new AppError(
          422,
          "INVALID_ROLE_IDS",
          "One or more roles do not exist",
        );
      }
      throw error;
    }
  }

  private handleWriteError(error: unknown): never {
    if (error instanceof Error && error.message === "INVALID_PERMISSION_KEYS") {
      throw new AppError(
        422,
        "INVALID_PERMISSION_KEYS",
        "One or more permissions do not exist",
      );
    }
    if (isUniqueViolation(error)) {
      throw new AppError(
        409,
        "ROLE_NAME_IN_USE",
        "A role with this name already exists",
      );
    }
    throw error;
  }
}
