import type { ComponentPropsWithRef } from "react";

/** Props for a styled native select control. */
export interface SelectProps extends ComponentPropsWithRef<"select"> {
  /** Marks the control as invalid for assistive technology and visual feedback. */
  invalid?: boolean;
}
