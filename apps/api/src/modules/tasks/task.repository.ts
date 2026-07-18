import type { Pool } from 'pg';
import type { TaskStatus, CreateTaskInput, ListTasksInput, UpdateTaskInput } from './task.schemas.js';

interface TaskRow {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  due_date: Date | null;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const columns = 'id, title, description, status, due_date, user_id, created_at, updated_at';

function mapTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    dueDate: row.due_date?.toISOString() ?? null,
    userId: row.user_id,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export class TaskRepository {
  constructor(private readonly db: Pool) {}

  async create(userId: string, input: CreateTaskInput): Promise<Task> {
    const result = await this.db.query<TaskRow>(
      `INSERT INTO tasks (title, description, status, due_date, user_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING ${columns}`,
      [input.title, input.description, input.status, input.dueDate, userId],
    );
    return mapTask(result.rows[0]!);
  }

  async list(userId: string | null, input: ListTasksInput): Promise<Task[]> {
    const conditions: string[] = [];
    const values: unknown[] = [];
    if (userId) {
      values.push(userId);
      conditions.push(`user_id = $${values.length}`);
    }
    if (input.status) {
      values.push(input.status);
      conditions.push(`status = $${values.length}`);
    }
    values.push(input.limit, input.offset);
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const result = await this.db.query<TaskRow>(
      `SELECT ${columns} FROM tasks ${where}
       ORDER BY created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );
    return result.rows.map(mapTask);
  }

  async findById(id: string): Promise<Task | null> {
    const result = await this.db.query<TaskRow>(`SELECT ${columns} FROM tasks WHERE id = $1`, [id]);
    return result.rows[0] ? mapTask(result.rows[0]) : null;
  }

  async update(id: string, input: UpdateTaskInput): Promise<Task | null> {
    const assignments: string[] = [];
    const values: unknown[] = [];
    const fieldColumns: Array<[keyof UpdateTaskInput, string]> = [
      ['title', 'title'],
      ['description', 'description'],
      ['status', 'status'],
      ['dueDate', 'due_date'],
    ];

    for (const [field, column] of fieldColumns) {
      if (field in input) {
        values.push(input[field]);
        assignments.push(`${column} = $${values.length}`);
      }
    }
    values.push(id);
    const result = await this.db.query<TaskRow>(
      `UPDATE tasks SET ${assignments.join(', ')}, updated_at = NOW()
       WHERE id = $${values.length} RETURNING ${columns}`,
      values,
    );
    return result.rows[0] ? mapTask(result.rows[0]) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.query('DELETE FROM tasks WHERE id = $1', [id]);
    return result.rowCount === 1;
  }
}
