import type { TaskStatus } from "../../../types/api";
export interface TaskStatusBadgeProps { status: TaskStatus; }
export const taskStatusLabels: Record<TaskStatus, string> = { todo: "Pendiente", in_progress: "En curso", done: "Terminada" };
