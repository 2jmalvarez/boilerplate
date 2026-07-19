import { AlertTriangle, X } from "lucide-react";
import { Button } from "../Button/Button";
import { IconButton } from "../IconButton/IconButton";
import { Modal } from "../Modal/Modal";
import { confirmDialogVariants } from "./ConfirmDialog.variant";
import type { ConfirmDialogProps } from "./ConfirmDialog.types";
import "./ConfirmDialog.css";

export function ConfirmDialog({
  cancelLabel = "Cancelar",
  confirmLabel = "Confirmar",
  description,
  loading,
  onCancel,
  onConfirm,
  title,
  tone,
}: Readonly<ConfirmDialogProps>) {
  return (
    <Modal describedBy="confirm-dialog-description" labelledBy="confirm-dialog-title" onClose={onCancel}>
      <section className={confirmDialogVariants({ tone })}>
        <header className="confirm-dialog-header">
          <span className="confirm-dialog-icon" aria-hidden="true">
            <AlertTriangle size={20} />
          </span>
          <IconButton aria-label="Cerrar confirmación" onClick={onCancel}>
            <X aria-hidden="true" />
          </IconButton>
        </header>
        <div className="confirm-dialog-copy">
          <h2 id="confirm-dialog-title">{title}</h2>
          <p id="confirm-dialog-description">{description}</p>
        </div>
        <footer className="confirm-dialog-actions">
          <Button disabled={loading} type="button" variant="quiet" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button loading={loading} type="button" variant={tone === "danger" ? "danger" : "primary"} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </footer>
      </section>
    </Modal>
  );
}
