import type { ReactNode } from "react";
/** Props for an accessible modal dialog rendered in a portal. */
export interface ModalProps {
  /** Dialog content. */ children: ReactNode;
  /** ID of the descriptive content, when present. */ describedBy?: string;
  /** ID of the dialog heading. */ labelledBy: string;
  /** Closes the dialog via Escape or backdrop interaction. */ onClose: () => void;
}
