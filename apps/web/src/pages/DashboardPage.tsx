import {
  CalendarDays,
  Check,
  Circle,
  Clock3,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  startTransition,
  useEffect,
  useState,
  type ComponentProps,
} from "react";
import { EmptyState, ErrorState, LoadingState } from "../components/Feedback";
import { api, getErrorMessage } from "../lib/api";
import type { ApiEnvelope, Task, TaskInput, TaskStatus } from "../types/api";

const statusLabels: Record<TaskStatus, string> = {
  todo: "Pendiente",
  in_progress: "En curso",
  done: "Terminada",
};

const blankTask: TaskInput = {
  title: "",
  description: null,
  status: "todo",
  dueDate: null,
};

type Filter = "all" | TaskStatus;
type FormSubmitEvent = Parameters<
  NonNullable<ComponentProps<"form">["onSubmit"]>
>[0];

function replaceTask(tasks: Task[], replacement: Task) {
  return tasks.map((task) => (task.id === replacement.id ? replacement : task));
}

function removeTask(tasks: Task[], taskId: string) {
  return tasks.filter((task) => task.id !== taskId);
}

export function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Task | "new" | null>(null);
  const [saving, setSaving] = useState(false);
  const [mutationError, setMutationError] = useState("");

  async function loadTasks() {
    setLoading(true);
    setError("");
    try {
      const response = await api.get<ApiEnvelope<Task[]>>("/tasks");
      startTransition(() => setTasks(response.data.data));
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    api
      .get<ApiEnvelope<Task[]>>("/tasks")
      .then((response) => {
        if (active) startTransition(() => setTasks(response.data.data));
      })
      .catch((loadError: unknown) => {
        if (active) setError(getErrorMessage(loadError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const visibleTasks =
    filter === "all" ? tasks : tasks.filter((task) => task.status === filter);
  const completed = tasks.filter((task) => task.status === "done").length;
  const inProgress = tasks.filter(
    (task) => task.status === "in_progress",
  ).length;

  function openEditor(task: Task | "new") {
    setMutationError("");
    setEditing(task);
  }

  async function saveTask(input: TaskInput) {
    setSaving(true);
    setMutationError("");
    try {
      if (editing === "new") {
        const response = await api.post<ApiEnvelope<Task>>("/tasks", input);
        startTransition(() =>
          setTasks((current) => [response.data.data, ...current]),
        );
      } else if (editing) {
        const response = await api.patch<ApiEnvelope<Task>>(
          `/tasks/${editing.id}`,
          input,
        );
        startTransition(() =>
          setTasks((current) => replaceTask(current, response.data.data)),
        );
      }
      setEditing(null);
    } catch (saveError) {
      setMutationError(getErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  }

  async function deleteTask(task: Task) {
    if (
      !window.confirm(
        `¿Borrar “${task.title}”? Esta acción no se puede deshacer.`,
      )
    )
      return;

    setMutationError("");
    try {
      await api.delete<ApiEnvelope<null>>(`/tasks/${task.id}`);
      startTransition(() =>
        setTasks((current) => removeTask(current, task.id)),
      );
      if (editing !== "new" && editing?.id === task.id) setEditing(null);
    } catch (deleteError) {
      setMutationError(getErrorMessage(deleteError));
    }
  }

  return (
    <div className="dashboard">
      <section className="dashboard-title">
        <div>
          <p className="eyebrow">Mesa de trabajo / Vista general</p>
          <h1>
            Asuntos
            <br />
            <em>pendientes</em>
          </h1>
        </div>
        <button
          className="button button-primary new-task"
          type="button"
          onClick={() => openEditor("new")}
        >
          <Plus aria-hidden="true" size={18} />
          Nueva tarea
        </button>
      </section>

      <section className="metrics" aria-label="Resumen de tareas">
        <div>
          <span>Total</span>
          <strong>{String(tasks.length).padStart(2, "0")}</strong>
          <small>registradas</small>
        </div>
        <div>
          <span>En curso</span>
          <strong>{String(inProgress).padStart(2, "0")}</strong>
          <small>en movimiento</small>
        </div>
        <div>
          <span>Cerradas</span>
          <strong>{String(completed).padStart(2, "0")}</strong>
          <small>archivo final</small>
        </div>
      </section>

      <div className={`work-area ${editing ? "has-editor" : ""}`}>
        <section className="task-register" aria-labelledby="register-title">
          <div className="register-toolbar">
            <h2 id="register-title">Registro de tareas</h2>
            <div className="filters" aria-label="Filtrar por estado">
              {(["all", "todo", "in_progress", "done"] as Filter[]).map(
                (status) => (
                  <button
                    aria-pressed={filter === status}
                    className={filter === status ? "active" : ""}
                    key={status}
                    onClick={() => startTransition(() => setFilter(status))}
                    type="button"
                  >
                    {status === "all" ? "Todas" : statusLabels[status]}
                  </button>
                ),
              )}
            </div>
          </div>

          {mutationError && !editing && <ErrorState message={mutationError} />}
          <TaskRegisterContent
            error={error}
            filter={filter}
            loading={loading}
            onDelete={deleteTask}
            onEdit={openEditor}
            onRetry={loadTasks}
            tasks={visibleTasks}
          />
        </section>

        {editing && (
          <TaskEditor
            key={editing === "new" ? "new" : editing.id}
            task={editing === "new" ? null : editing}
            saving={saving}
            error={mutationError}
            onCancel={() => setEditing(null)}
            onSave={saveTask}
          />
        )}
      </div>
    </div>
  );
}

interface TaskEditorProps {
  task: Task | null;
  saving: boolean;
  error: string;
  onCancel: () => void;
  onSave: (input: TaskInput) => Promise<void>;
}

function TaskEditor({
  task,
  saving,
  error,
  onCancel,
  onSave,
}: Readonly<TaskEditorProps>) {
  const [draft, setDraft] = useState<TaskInput>(
    task
      ? {
          title: task.title,
          description: task.description,
          status: task.status,
          dueDate: task.dueDate?.slice(0, 10) ?? null,
        }
      : blankTask,
  );

  function submit(event: FormSubmitEvent) {
    event.preventDefault();
    void onSave({
      ...draft,
      title: draft.title.trim(),
      description: draft.description?.trim() || null,
      dueDate: draft.dueDate || null,
    });
  }

  return (
    <aside className="task-editor" aria-labelledby="editor-title">
      <div className="editor-heading">
        <div>
          <span>{task ? "Editar ficha" : "Nueva ficha"}</span>
          <h2 id="editor-title">
            {task ? "Ajustar tarea" : "Registrar tarea"}
          </h2>
        </div>
        <button aria-label="Cerrar editor" type="button" onClick={onCancel}>
          <X aria-hidden="true" />
        </button>
      </div>
      <form onSubmit={submit}>
        <label>
          <span>Título</span>
          <input
            autoFocus
            maxLength={120}
            required
            value={draft.title}
            onChange={(event) =>
              setDraft({ ...draft, title: event.target.value })
            }
          />
        </label>
        <label>
          <span>Descripción</span>
          <textarea
            maxLength={1000}
            rows={5}
            value={draft.description ?? ""}
            onChange={(event) =>
              setDraft({ ...draft, description: event.target.value })
            }
          />
        </label>
        <label>
          <span>Estado</span>
          <select
            value={draft.status}
            onChange={(event) =>
              setDraft({ ...draft, status: event.target.value as TaskStatus })
            }
          >
            <option value="todo">Pendiente</option>
            <option value="in_progress">En curso</option>
            <option value="done">Terminada</option>
          </select>
        </label>
        <label>
          <span>Fecha límite</span>
          <input
            type="date"
            value={draft.dueDate ?? ""}
            onChange={(event) =>
              setDraft({ ...draft, dueDate: event.target.value })
            }
          />
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="editor-actions">
          <button
            className="button button-quiet"
            type="button"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className="button button-primary"
            disabled={saving}
            type="submit"
          >
            {saving ? "Guardando…" : "Guardar ficha"}
          </button>
        </div>
      </form>
    </aside>
  );
}

interface TaskRegisterContentProps {
  error: string;
  filter: Filter;
  loading: boolean;
  onDelete: (task: Task) => Promise<void>;
  onEdit: (task: Task) => void;
  onRetry: () => Promise<void>;
  tasks: Task[];
}

function TaskRegisterContent({
  error,
  filter,
  loading,
  onDelete,
  onEdit,
  onRetry,
  tasks,
}: Readonly<TaskRegisterContentProps>) {
  if (loading) return <LoadingState />;
  if (error)
    return <ErrorState message={error} onRetry={() => void onRetry()} />;
  if (tasks.length === 0) return <EmptyState filtered={filter !== "all"} />;

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

interface TaskRowProps {
  index: number;
  onDelete: (task: Task) => Promise<void>;
  onEdit: (task: Task) => void;
  task: Task;
}

function TaskRow({ index, onDelete, onEdit, task }: Readonly<TaskRowProps>) {
  return (
    <article className="task-row">
      <span className="task-index">{String(index + 1).padStart(2, "0")}</span>
      <span
        className={`status-mark status-${task.status}`}
        aria-label={statusLabels[task.status]}
      >
        <StatusIcon status={task.status} />
      </span>
      <div className="task-copy">
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
        <div className="task-meta">
          <span>{statusLabels[task.status]}</span>
          {task.dueDate && (
            <time dateTime={task.dueDate}>
              <CalendarDays aria-hidden="true" size={14} />
              {formatDate(task.dueDate)}
            </time>
          )}
        </div>
      </div>
      <div className="task-actions">
        <button
          aria-label={`Editar ${task.title}`}
          type="button"
          onClick={() => onEdit(task)}
        >
          <Pencil aria-hidden="true" size={17} />
        </button>
        <button
          aria-label={`Borrar ${task.title}`}
          type="button"
          onClick={() => void onDelete(task)}
        >
          <Trash2 aria-hidden="true" size={17} />
        </button>
      </div>
    </article>
  );
}

function StatusIcon({ status }: Readonly<{ status: TaskStatus }>) {
  if (status === "done") return <Check />;
  if (status === "in_progress") return <Clock3 />;
  return <Circle />;
}

function formatDate(value: string) {
  const date = new Date(value.includes("T") ? value : `${value}T00:00:00`);
  return new Intl.DateTimeFormat("es", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
