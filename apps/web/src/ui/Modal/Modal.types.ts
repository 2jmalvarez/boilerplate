import type { ReactNode } from "react"; export interface ModalProps { children: ReactNode; describedBy?: string; labelledBy: string; onClose: () => void; }
