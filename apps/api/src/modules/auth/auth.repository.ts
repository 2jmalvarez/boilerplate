import type { Pool } from "pg";
import type { Role } from "../../shared/types.js";

interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: Role;
  created_at: Date;
  updated_at: Date;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

function mapUser(row: UserRow): UserRecord {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role,
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
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'user')
       RETURNING id, name, email, password_hash, role, created_at, updated_at`,
      [name, email, passwordHash],
    );
    return mapUser(result.rows[0]!);
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const result = await this.db.query<UserRow>(
      `SELECT id, name, email, password_hash, role, created_at, updated_at
       FROM users WHERE email = $1`,
      [email],
    );
    return result.rows[0] ? mapUser(result.rows[0]) : null;
  }

  async findById(id: string): Promise<UserRecord | null> {
    const result = await this.db.query<UserRow>(
      `SELECT id, name, email, password_hash, role, created_at, updated_at
       FROM users WHERE id = $1`,
      [id],
    );
    return result.rows[0] ? mapUser(result.rows[0]) : null;
  }
}
