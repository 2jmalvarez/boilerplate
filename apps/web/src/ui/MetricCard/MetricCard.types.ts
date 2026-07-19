/** Props for a concise numerical or textual summary metric. */
export interface MetricCardProps {
  /** Supporting contextual text. */ detail?: string;
  /** Metric label. */ label: string;
  /** Main metric value. */ value: number | string;
}
