import type { Task } from "../../../types/api";
export interface TaskRegisterProps { emptyDescription: string; emptyTitle: string; error: string; loading: boolean; onDelete: (task: Task) => Promise<void>; onEdit: (task: Task) => void; onRetry: () => Promise<void>; tasks: Task[]; }
