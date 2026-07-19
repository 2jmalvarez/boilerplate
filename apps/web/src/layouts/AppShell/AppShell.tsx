import type { AppShellProps } from "./AppShell.types"; import "./AppShell.css";
export function AppShell({ children, header }: Readonly<AppShellProps>) { return <div className="app-shell">{header}<main>{children}</main></div>; }
