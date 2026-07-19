import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../../../ui/Feedback/Feedback";
import { TaskRow } from "../TaskRow/TaskRow";
import type { TaskRegisterProps } from "./TaskRegister.types";
import "./TaskRegister.css";
export function TaskRegister({
  emptyDescription,
  emptyTitle,
  error,
  loading,
  onDelete,
  onEdit,
  onRetry,
  tasks,
}: Readonly<TaskRegisterProps>) {
  if (loading) return <LoadingState label="Cargando tareas" />;
  if (error)
    return <ErrorState message={error} onRetry={() => void onRetry()} />;
  if (tasks.length === 0)
    return <EmptyState description={emptyDescription} title={emptyTitle} />;
  return (
    <div className="task-list">
      {tasks.map((task, index) => (
        <TaskRow
          index={index}
          key={task.id}
          onDelete={onDelete}
          onEdit={onEdit}
          task={task}
        />
      ))}
    </div>
  );
}
