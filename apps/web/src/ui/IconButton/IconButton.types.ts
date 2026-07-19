import type { VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { iconButtonVariants } from "./IconButton.variant";
/** Props for a compact button whose accessible name describes its icon action. */
export interface IconButtonProps extends ComponentPropsWithoutRef<"button">, VariantProps<typeof iconButtonVariants> { /** Icon content. */ children: ReactNode; }
