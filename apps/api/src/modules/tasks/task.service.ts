import { AppError } from "../../shared/app-error.js";
import type { AuthenticatedUser } from "../../shared/types.js";
import type {
  CreateTaskInput,
  ListTasksInput,
  UpdateTaskInput,
} from "./task.schemas.js";
import type { Task, TaskRepository } from "./task.repository.js";

export class TaskService {
  constructor(private readonly repository: TaskRepository) {}

  create(user: AuthenticatedUser, input: CreateTaskInput): Promise<Task> {
    return this.repository.create(user.id, input);
  }

  list(user: AuthenticatedUser, input: ListTasksInput): Promise<Task[]> {
    return this.repository.list(user.role === "admin" ? null : user.id, input);
  }

  async get(user: AuthenticatedUser, id: string): Promise<Task> {
    const task = await this.repository.findById(id);
    return this.requireAccess(user, task);
  }

  async update(
    user: AuthenticatedUser,
    id: string,
    input: UpdateTaskInput,
  ): Promise<Task> {
    const existing = await this.repository.findById(id);
    this.requireAccess(user, existing);
    const task = await this.repository.update(id, input);
    if (!task) throw new AppError(404, "TASK_NOT_FOUND", "Task not found");
    return task;
  }

  async delete(user: AuthenticatedUser, id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    this.requireAccess(user, existing);
    if (!(await this.repository.delete(id))) {
      throw new AppError(404, "TASK_NOT_FOUND", "Task not found");
    }
  }

  private requireAccess(user: AuthenticatedUser, task: Task | null): Task {
    // Return the same response for missing and inaccessible records to avoid leaking their existence.
    if (!task || (user.role !== "admin" && task.userId !== user.id)) {
      throw new AppError(404, "TASK_NOT_FOUND", "Task not found");
    }
    return task;
  }
}
