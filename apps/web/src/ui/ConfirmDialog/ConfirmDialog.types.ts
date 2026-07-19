import type { VariantProps } from "class-variance-authority";
import type { confirmDialogVariants } from "./ConfirmDialog.variant";

export interface ConfirmDialogProps
  extends VariantProps<typeof confirmDialogVariants> {
  cancelLabel?: string;
  confirmLabel?: string;
  description: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
}
