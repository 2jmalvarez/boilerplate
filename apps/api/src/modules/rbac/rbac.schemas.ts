import { z } from "zod";

const permissionKey = z.string().regex(/^[a-z][a-z0-9-]*:[a-z][a-z0-9-]*$/);

export const roleIdSchema = z.object({ id: z.uuid() });

export const createRoleSchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(500).nullable().default(null),
  permissionKeys: z.array(permissionKey).max(100).default([]),
  isDefault: z.boolean().default(false),
});

export const updateRoleSchema = createRoleSchema
  .partial()
  .refine((input) => Object.keys(input).length > 0, {
    message: "At least one field is required",
  });

export const userIdSchema = z.object({ id: z.uuid() });

export const updateUserRolesSchema = z.object({
  roleIds: z.array(z.uuid()).max(20),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type UpdateUserRolesInput = z.infer<typeof updateUserRolesSchema>;
