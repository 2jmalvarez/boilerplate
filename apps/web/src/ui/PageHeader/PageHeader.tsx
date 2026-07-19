import type { PageHeaderProps } from "./PageHeader.types";
import "./PageHeader.css";
export function PageHeader({
  action,
  description,
  eyebrow,
  title,
}: Readonly<PageHeaderProps>) {
  return (
    <header className="page-header">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {action && <div className="page-header-action">{action}</div>}
    </header>
  );
}
