import type { ReactNode } from "react";
/** Props for the presentational application header. */
export interface AppHeaderProps {
  /** Session or navigation actions. */ actions?: ReactNode;
  /** Product identity content. */ brand: ReactNode;
  /** Secondary product context. */ subtitle?: string;
  /** Current user name. */ userName?: string;
}
