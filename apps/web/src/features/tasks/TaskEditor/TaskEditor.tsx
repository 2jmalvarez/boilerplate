import { X } from "lucide-react";
import { useEffect, useRef, useState, type ComponentProps } from "react";
import { Button } from "../../../ui/Button/Button";
import { FormError } from "../../../ui/FormError/FormError";
import { FormField } from "../../../ui/FormField/FormField";
import { IconButton } from "../../../ui/IconButton/IconButton";
import { Input } from "../../../ui/Input/Input";
import { Modal } from "../../../ui/Modal/Modal";
import { Select } from "../../../ui/Select/Select";
import { Textarea } from "../../../ui/Textarea/Textarea";
import type { TaskInput, TaskStatus } from "../../../types/api";
import type { TaskEditorProps } from "./TaskEditor.types";
import "./TaskEditor.css";
const blankTask: TaskInput = {
  title: "",
  description: null,
  status: "todo",
  dueDate: null,
};
type SubmitEvent = Parameters<
  NonNullable<ComponentProps<"form">["onSubmit"]>
>[0];
export function TaskEditor({
  error,
  onCancel,
  onSave,
  saving,
  task,
}: Readonly<TaskEditorProps>) {
  const inputRef = useRef<HTMLInputElement>(null);
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
  const isEditing = Boolean(task);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  function submit(event: SubmitEvent) {
    event.preventDefault();
    void onSave({
      ...draft,
      title: draft.title.trim(),
      description: draft.description?.trim() || null,
      dueDate: draft.dueDate || null,
    });
  }
  return (
    <Modal labelledBy="task-editor-title" onClose={onCancel}>
      <div className="task-editor">
        <header className="editor-heading">
          <div>
            <span>{isEditing ? "Editar ficha" : "Nueva ficha"}</span>
            <h2 id="task-editor-title">
              {isEditing ? "Actualizar tarea" : "Crear tarea"}
            </h2>
          </div>
          <IconButton aria-label="Cerrar editor" onClick={onCancel}>
            <X aria-hidden="true" />
          </IconButton>
        </header>
        <form onSubmit={submit}>
          <FormField label="Título" required>
            {({ describedBy, invalid }) => (
              <Input
                aria-describedby={describedBy}
                autoFocus
                invalid={invalid}
                maxLength={120}
                ref={inputRef}
                required
                value={draft.title}
                onChange={(event) =>
                  setDraft({ ...draft, title: event.target.value })
                }
              />
            )}
          </FormField>
          <FormField label="Descripción">
            {({ describedBy, invalid }) => (
              <Textarea
                aria-describedby={describedBy}
                invalid={invalid}
                maxLength={1000}
                rows={5}
                value={draft.description ?? ""}
                onChange={(event) =>
                  setDraft({ ...draft, description: event.target.value })
                }
              />
            )}
          </FormField>
          <div className="editor-fields">
            <FormField label="Estado">
              {({ describedBy, invalid }) => (
                <Select
                  aria-describedby={describedBy}
                  invalid={invalid}
                  value={draft.status}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      status: event.target.value as TaskStatus,
                    })
                  }
                >
                  <option value="todo">Pendiente</option>
                  <option value="in_progress">En curso</option>
                  <option value="done">Terminada</option>
                </Select>
              )}
            </FormField>
            <FormField label="Fecha límite">
              {({ describedBy, invalid }) => (
                <Input
                  aria-describedby={describedBy}
                  invalid={invalid}
                  type="date"
                  value={draft.dueDate ?? ""}
                  onChange={(event) =>
                    setDraft({ ...draft, dueDate: event.target.value })
                  }
                />
              )}
            </FormField>
          </div>
          {error && <FormError>{error}</FormError>}
          <div className="editor-actions">
            <Button type="button" variant="quiet" onClick={onCancel}>
              Cancelar
            </Button>
            <Button loading={saving} type="submit" variant="primary">
              Guardar ficha
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
