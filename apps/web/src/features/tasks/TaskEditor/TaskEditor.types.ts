import type { Task, TaskInput } from "../../../types/api";
/** Props for the task create and edit dialog. */
export interface TaskEditorProps { /** Mutation error shown within the form. */ error: string; /** Dismisses editing without saving. */ onCancel: () => void; /** Persists the normalized task input. */ onSave: (input: TaskInput) => Promise<void>; /** Disables submission while persisting. */ saving: boolean; /** Existing task to edit, or null for creation. */ task: Task | null; }
