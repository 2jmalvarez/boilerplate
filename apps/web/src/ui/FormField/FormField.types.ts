import type { ReactNode } from "react";
/** Groups a form control with its visible label, hint, and validation message. */
export interface FormFieldProps {
  /** Form control rendered inside the field. */ children: ReactNode;
  /** Validation feedback. */ error?: string;
  /** Supplemental guidance for the control. */ hint?: string;
  /** Visible label for the control. */ label: string;
  /** Marks the label as required. */ required?: boolean;
}
