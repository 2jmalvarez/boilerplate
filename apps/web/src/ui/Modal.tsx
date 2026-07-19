import { useEffect, type ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  labelledBy: string;
  onClose: () => void;
}

export function Modal({ children, labelledBy, onClose }: Readonly<ModalProps>) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      aria-labelledby={labelledBy}
      aria-modal="true"
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
    >
      <section className="task-editor">{children}</section>
    </div>
  );
}
