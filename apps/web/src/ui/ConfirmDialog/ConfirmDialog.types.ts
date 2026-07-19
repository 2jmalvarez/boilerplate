import type { VariantProps } from "class-variance-authority";
import type { confirmDialogVariants } from "./ConfirmDialog.variant";

/** Props for a modal asking the user to explicitly confirm an action. */
export interface ConfirmDialogProps extends VariantProps<
  typeof confirmDialogVariants
> {
  /** Text for the dismissal action. */ cancelLabel?: string;
  /** Text for the confirmation action. */ confirmLabel?: string;
  /** Explains the consequence of confirming. */ description: string;
  /** Disables actions while the confirmation is being processed. */ loading?: boolean;
  /** Dismisses the dialog. */ onCancel: () => void;
  /** Performs the confirmed action. */ onConfirm: () => void;
  /** Dialog heading. */ title: string;
}
