import type { Task } from "../../../types/api";
/** Props for one interactive row in the task register. */
export interface TaskRowProps { /** Zero-based visual position. */ index: number; /** Requests deletion for the task. */ onDelete: (task: Task) => Promise<void>; /** Opens editing for the task. */ onEdit: (task: Task) => void; /** Task displayed by the row. */ task: Task; }
