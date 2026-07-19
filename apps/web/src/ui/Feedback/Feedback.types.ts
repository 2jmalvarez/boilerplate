import type { ReactNode } from "react";
/** Props for a full-region feedback state such as loading, empty, or error. */
export interface StatePanelProps {
  /** Optional recovery or next-step action. */ action?: ReactNode;
  /** Supporting explanation. */ description?: string;
  /** Icon communicating the state. */ icon: ReactNode;
  /** Accessible live-region role. */ role?: "alert" | "status";
  /** Primary state message. */ title: string;
  /** Visual emphasis for the state. */ tone?: "neutral" | "error";
}
