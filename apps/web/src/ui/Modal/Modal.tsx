import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { ModalProps } from "./Modal.types";
import "./Modal.css";
/** Renders a native modal dialog with focus trapping and focus restoration. */
export function Modal({
  children,
  describedBy,
  labelledBy,
  onClose,
}: Readonly<ModalProps>) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();

    function handleCancel(event: Event) {
      event.preventDefault();
      onClose();
    }

    dialog.addEventListener("cancel", handleCancel);

    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      dialog.close();
    };
  }, [onClose]);

  return createPortal(
    <dialog
      aria-describedby={describedBy}
      aria-labelledby={labelledBy}
      className="modal"
      ref={dialogRef}
    >
      {children}
    </dialog>,
    document.body,
  );
}
