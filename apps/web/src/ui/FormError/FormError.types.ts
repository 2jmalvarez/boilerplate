import type { ComponentPropsWithoutRef, ReactNode } from "react";

/** Props for an error that applies to a complete form operation. */
export interface FormErrorProps extends ComponentPropsWithoutRef<"p"> {
  /** Error message announced to assistive technology. */
  children: ReactNode;
}
