import type { ReactNode } from "react";
/** Props for the application frame that hosts a header, content, and version badge. */
export interface AppShellProps { /** Primary route content. */ children: ReactNode; /** Global application header. */ header: ReactNode; }
