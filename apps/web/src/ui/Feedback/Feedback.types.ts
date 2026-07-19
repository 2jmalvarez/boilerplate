import type { ReactNode } from "react";
export interface StatePanelProps { action?: ReactNode; description?: string; icon: ReactNode; role?: "alert" | "status"; title: string; tone?: "neutral" | "error"; }
