import { appVersion } from "../../lib/version";
import { VersionBadge } from "../../ui/VersionBadge/VersionBadge";
import type { AppShellProps } from "./AppShell.types";
import "./AppShell.css";

export function AppShell({ children, header }: Readonly<AppShellProps>) {
  return (
    <div className="app-shell">
      {header}
      <main>{children}</main>
      <footer className="app-shell-footer">
        <VersionBadge version={appVersion} />
      </footer>
    </div>
  );
}
