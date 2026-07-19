import type { ReactNode } from "react";

/** Accessibility props supplied to the associated form control. */
export interface FormFieldControlProps {
  /** IDs for supplementary hint and error text. */
  describedBy?: string;
  /** Indicates a field-level validation error. */
  invalid?: boolean;
}

/** Groups a form control with its visible label, hint, and validation message. */
export interface FormFieldProps {
  /** Form control rendered with field-level accessibility props. */
  children: (props: FormFieldControlProps) => ReactNode;
  /** Validation feedback. */ error?: string;
  /** Supplemental guidance for the control. */ hint?: string;
  /** Visible label for the control. */ label: string;
  /** Marks the label as required. */ required?: boolean;
}
