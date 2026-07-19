import type { VariantProps } from "class-variance-authority"; import type { ReactNode } from "react"; import type { badgeVariants } from "./Badge.variant";
export interface BadgeProps extends VariantProps<typeof badgeVariants> { children: ReactNode; }
