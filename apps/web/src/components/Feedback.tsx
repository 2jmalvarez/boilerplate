import { AlertTriangle, Inbox, LoaderCircle } from "lucide-react";

export function LoadingState({
  label = "Cargando tareas",
}: Readonly<{ label?: string }>) {
  return (
    <div className="feedback" role="status" aria-live="polite">
      <LoaderCircle className="spin" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: Readonly<{ message: string; onRetry?: () => void }>) {
  return (
    <div className="feedback feedback-error" role="alert">
      <AlertTriangle aria-hidden="true" />
      <p>{message}</p>
      {onRetry && (
        <button className="text-button" type="button" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  );
}

export function EmptyState({ filtered }: Readonly<{ filtered: boolean }>) {
  return (
    <div className="feedback empty-state">
      <Inbox aria-hidden="true" />
      <p>
        {filtered ? "No hay tareas en este estado." : "El pliego está limpio."}
      </p>
      <span>
        {filtered
          ? "Prueba con otro filtro."
          : "Crea la primera tarea para empezar."}
      </span>
    </div>
  );
}
