import type { TaskStatus } from "../../../types/api";
/** Props for the domain adapter that maps a task status to a semantic badge. */
export interface TaskStatusBadgeProps {
  /** Current lifecycle status of the task. */ status: TaskStatus;
}
export const taskStatusLabels: Record<TaskStatus, string> = {
  todo: "Pendiente",
  in_progress: "En curso",
  done: "Terminada",
};
