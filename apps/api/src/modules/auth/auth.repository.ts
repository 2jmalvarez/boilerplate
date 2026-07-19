import type { Pool } from "pg";
interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  roles: string[];
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

function mapUser(row: UserRow): Omit<UserRecord, "roles" | "permissions"> {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export class AuthRepository {
  constructor(private readonly db: Pool) {}

  async create(
    name: string,
    email: string,
    passwordHash: string,
  ): Promise<UserRecord> {
    const result = await this.db.query<UserRow>(
      `INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, password_hash, created_at, updated_at`,
      [name, email, passwordHash],
    );
    const user = mapUser(result.rows[0]!);
    await this.db.query(
      `INSERT INTO user_roles (user_id, role_id)
       SELECT $1, id FROM roles WHERE is_default`,
      [user.id],
    );
    return this.withAuthorization(user);
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const result = await this.db.query<UserRow>(
      `SELECT id, name, email, password_hash, created_at, updated_at
       FROM users WHERE email = $1`,
      [email],
    );
    return result.rows[0]
      ? this.withAuthorization(mapUser(result.rows[0]))
      : null;
  }

  async findById(id: string): Promise<UserRecord | null> {
    const result = await this.db.query<UserRow>(
      `SELECT id, name, email, password_hash, created_at, updated_at
       FROM users WHERE id = $1`,
      [id],
    );
    return result.rows[0]
      ? this.withAuthorization(mapUser(result.rows[0]))
      : null;
  }

  private async withAuthorization(
    user: Omit<UserRecord, "roles" | "permissions">,
  ): Promise<UserRecord> {
    const [roles, permissions] = await Promise.all([
      this.db.query<{ name: string }>(
        `SELECT r.name FROM roles r
         JOIN user_roles ur ON ur.role_id = r.id
         WHERE ur.user_id = $1 ORDER BY r.name`,
        [user.id],
      ),
      this.db.query<{ key: string }>(
        `SELECT DISTINCT p.key FROM permissions p
         JOIN role_permissions rp ON rp.permission_key = p.key
         JOIN user_roles ur ON ur.role_id = rp.role_id
         WHERE ur.user_id = $1 ORDER BY p.key`,
        [user.id],
      ),
    ]);
    return {
      ...user,
      roles: roles.rows.map((role) => role.name),
      permissions: permissions.rows.map((permission) => permission.key),
    };
  }
}
