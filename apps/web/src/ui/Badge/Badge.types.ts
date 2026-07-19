import type { VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import type { badgeVariants } from "./Badge.variant";
/** Props for a compact semantic status label. */
export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  /** Badge text or inline content. */ children: ReactNode;
  /** Optional composition class. */ className?: string;
}
