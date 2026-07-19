import type { Task } from "../../../types/api"; export interface TaskRowProps { index: number; onDelete: (task: Task) => Promise<void>; onEdit: (task: Task) => void; task: Task; }
