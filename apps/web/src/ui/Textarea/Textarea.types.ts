import type { ComponentPropsWithRef } from "react";

/** Props for a styled native textarea control. */
export interface TextareaProps extends ComponentPropsWithRef<"textarea"> {
  /** Marks the control as invalid for assistive technology and visual feedback. */
  invalid?: boolean;
}
