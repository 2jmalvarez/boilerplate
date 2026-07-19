import { Badge } from "../../../ui/Badge/Badge";
import {
  taskStatusLabels,
  type TaskStatusBadgeProps,
} from "./TaskStatusBadge.types";
const tones = {
  todo: "warning",
  in_progress: "info",
  done: "success",
} as const;
export function TaskStatusBadge({ status }: Readonly<TaskStatusBadgeProps>) {
  return <Badge tone={tones[status]}>{taskStatusLabels[status]}</Badge>;
}
