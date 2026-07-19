import { AlertTriangle, Inbox, LoaderCircle } from "lucide-react";
import { Button } from "../Button/Button";
import { feedbackVariants } from "./Feedback.variant";
import type { StatePanelProps } from "./Feedback.types";
import "./Feedback.css";
function StatePanel({
  action,
  description,
  icon,
  role,
  title,
  tone,
}: Readonly<StatePanelProps>) {
  return (
    <div className={feedbackVariants({ tone })} role={role}>
      <span className="feedback-icon">{icon}</span>
      <p>{title}</p>
      {description && <span>{description}</span>}
      {action}
    </div>
  );
}
export function LoadingState({
  label = "Cargando",
}: Readonly<{ label?: string }>) {
  return (
    <StatePanel
      icon={<LoaderCircle className="spin" aria-hidden="true" />}
      role="status"
      title={label}
    />
  );
}
export function ErrorState({
  message,
  onRetry,
}: Readonly<{ message: string; onRetry?: () => void }>) {
  return (
    <StatePanel
      action={
        onRetry && (
          <Button type="button" variant="ghost" onClick={onRetry}>
            Reintentar
          </Button>
        )
      }
      icon={<AlertTriangle aria-hidden="true" />}
      role="alert"
      title={message}
      tone="error"
    />
  );
}
export function EmptyState({
  description,
  title,
}: Readonly<{ description?: string; title: string }>) {
  return (
    <StatePanel
      description={description}
      icon={<Inbox aria-hidden="true" />}
      title={title}
    />
  );
}
