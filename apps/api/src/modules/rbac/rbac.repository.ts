import type { Pool, PoolClient } from "pg";

interface RoleRow {
  id: string;
  name: string;
  description: string | null;
  is_default: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface RoleRecord {
  id: string;
  name: string;
  description: string | null;
  isDefault: boolean;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  roles: string[];
  createdAt: string;
}

function mapRole(row: RoleRow, permissions: string[]): RoleRecord {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    isDefault: row.is_default,
    permissions,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export class RbacRepository {
  constructor(private readonly db: Pool) {}

  async listPermissions(): Promise<
    Array<{ key: string; description: string }>
  > {
    const result = await this.db.query<{ key: string; description: string }>(
      "SELECT key, description FROM permissions ORDER BY key",
    );
    return result.rows;
  }

  async listRoles(): Promise<RoleRecord[]> {
    const result = await this.db.query<RoleRow>(
      "SELECT id, name, description, is_default, created_at, updated_at FROM roles ORDER BY name",
    );
    return Promise.all(result.rows.map((row) => this.getRole(row)));
  }

  async findRole(id: string): Promise<RoleRecord | null> {
    const result = await this.db.query<RoleRow>(
      "SELECT id, name, description, is_default, created_at, updated_at FROM roles WHERE id = $1",
      [id],
    );
    return result.rows[0] ? this.getRole(result.rows[0]) : null;
  }

  async createRole(input: {
    name: string;
    description: string | null;
    permissionKeys: string[];
    isDefault: boolean;
  }): Promise<RoleRecord> {
    return this.inTransaction(async (client) => {
      if (input.isDefault)
        await client.query("UPDATE roles SET is_default = false");
      const result = await client.query<RoleRow>(
        `INSERT INTO roles (name, description, is_default)
         VALUES ($1, $2, $3)
         RETURNING id, name, description, is_default, created_at, updated_at`,
        [input.name, input.description, input.isDefault],
      );
      const role = result.rows[0]!;
      await this.replacePermissions(client, role.id, input.permissionKeys);
      return this.getRole(role, client);
    });
  }

  async updateRole(
    id: string,
    input: Partial<{
      name: string | undefined;
      description: string | null | undefined;
      permissionKeys: string[] | undefined;
      isDefault: boolean | undefined;
    }>,
  ): Promise<RoleRecord | null> {
    return this.inTransaction(async (client) => {
      const existing = await client.query<RoleRow>(
        "SELECT id, name, description, is_default, created_at, updated_at FROM roles WHERE id = $1 FOR UPDATE",
        [id],
      );
      if (!existing.rows[0]) return null;
      if (input.isDefault)
        await client.query("UPDATE roles SET is_default = false");
      const values = [
        input.name ?? existing.rows[0].name,
        input.description === undefined
          ? existing.rows[0].description
          : input.description,
        input.isDefault ?? existing.rows[0].is_default,
        id,
      ];
      const result = await client.query<RoleRow>(
        `UPDATE roles SET name = $1, description = $2, is_default = $3, updated_at = now()
         WHERE id = $4
         RETURNING id, name, description, is_default, created_at, updated_at`,
        values,
      );
      if (input.permissionKeys) {
        await this.replacePermissions(client, id, input.permissionKeys);
      }
      return this.getRole(result.rows[0]!, client);
    });
  }

  async deleteRole(id: string): Promise<boolean> {
    const result = await this.db.query("DELETE FROM roles WHERE id = $1", [id]);
    return result.rowCount === 1;
  }

  async listUsers(): Promise<ManagedUser[]> {
    const result = await this.db.query<{
      id: string;
      name: string;
      email: string;
      created_at: Date;
      roles: string[];
    }>(
      `SELECT u.id, u.name, u.email, u.created_at,
              COALESCE(array_agg(r.name ORDER BY r.name) FILTER (WHERE r.id IS NOT NULL), '{}') AS roles
       FROM users u
       LEFT JOIN user_roles ur ON ur.user_id = u.id
       LEFT JOIN roles r ON r.id = ur.role_id
       GROUP BY u.id ORDER BY u.created_at DESC`,
    );
    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      roles: row.roles,
      createdAt: row.created_at.toISOString(),
    }));
  }

  async replaceUserRoles(userId: string, roleIds: string[]): Promise<boolean> {
    return this.inTransaction(async (client) => {
      const user = await client.query(
        "SELECT 1 FROM users WHERE id = $1 FOR UPDATE",
        [userId],
      );
      if (!user.rowCount) return false;
      const roles = await client.query(
        "SELECT id FROM roles WHERE id = ANY($1::uuid[])",
        [roleIds],
      );
      if (roles.rowCount !== roleIds.length)
        throw new Error("INVALID_ROLE_IDS");
      await client.query("DELETE FROM user_roles WHERE user_id = $1", [userId]);
      await client.query(
        "INSERT INTO user_roles (user_id, role_id) SELECT $1, unnest($2::uuid[])",
        [userId, roleIds],
      );
      return true;
    });
  }

  private async getRole(
    row: RoleRow,
    client: Pool | PoolClient = this.db,
  ): Promise<RoleRecord> {
    const permissions = await client.query<{ permission_key: string }>(
      "SELECT permission_key FROM role_permissions WHERE role_id = $1 ORDER BY permission_key",
      [row.id],
    );
    return mapRole(
      row,
      permissions.rows.map((permission) => permission.permission_key),
    );
  }

  private async replacePermissions(
    client: PoolClient,
    roleId: string,
    keys: string[],
  ): Promise<void> {
    const valid = await client.query(
      "SELECT key FROM permissions WHERE key = ANY($1::varchar[])",
      [keys],
    );
    if (valid.rowCount !== keys.length)
      throw new Error("INVALID_PERMISSION_KEYS");
    await client.query("DELETE FROM role_permissions WHERE role_id = $1", [
      roleId,
    ]);
    if (keys.length) {
      await client.query(
        "INSERT INTO role_permissions (role_id, permission_key) SELECT $1, unnest($2::varchar[])",
        [roleId, keys],
      );
    }
  }

  private async inTransaction<T>(
    callback: (client: PoolClient) => Promise<T>,
  ): Promise<T> {
    const client = await this.db.connect();
    try {
      await client.query("BEGIN");
      const result = await callback(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
