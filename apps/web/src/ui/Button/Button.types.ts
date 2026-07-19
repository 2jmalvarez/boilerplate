import type { VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { buttonVariants } from "./Button.variant";

/** Props for an action button with visual variants, sizes, and loading state. */
export interface ButtonProps
  extends
    ComponentPropsWithoutRef<"button">,
    VariantProps<typeof buttonVariants> {
  /** Visible button content, optionally including icons. */
  children: ReactNode;
  /** Prevents interaction and displays a progress indicator. */
  loading?: boolean;
}
