import type { ComponentPropsWithRef } from "react";

/** Props for a styled native input control. */
export interface InputProps extends ComponentPropsWithRef<"input"> {
  /** Marks the control as invalid for assistive technology and visual feedback. */
  invalid?: boolean;
}
