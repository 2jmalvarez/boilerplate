import type { MetricCardProps } from "./MetricCard.types";
import "./MetricCard.css";
export function MetricCard({
  detail,
  label,
  value,
}: Readonly<MetricCardProps>) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </article>
  );
}
