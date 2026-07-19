import { Badge } from "../Badge/Badge";
import type { VersionBadgeProps } from "./VersionBadge.types";
import "./VersionBadge.css";

export function VersionBadge({ version }: Readonly<VersionBadgeProps>) {
  return (
    <Badge className="version-badge" tone="neutral">
      v{version}
    </Badge>
  );
}
