import type { Task } from "../../../types/api";
/** Props for the task collection including its loading, empty, and error states. */
export interface TaskRegisterProps {
  /** Supporting text for an empty register. */ emptyDescription: string;
  /** Empty register title. */ emptyTitle: string;
  /** Loading failure message. */ error: string;
  /** Shows the loading state. */ loading: boolean;
  /** Requests deletion for a task. */ onDelete: (task: Task) => Promise<void>;
  /** Opens editing for a task. */ onEdit: (task: Task) => void;
  /** Reloads the collection after a failure. */ onRetry: () => Promise<void>;
  /** Tasks to display. */ tasks: Task[];
}
