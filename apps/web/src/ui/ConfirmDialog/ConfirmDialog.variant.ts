import { cva } from "class-variance-authority";

export const confirmDialogVariants = cva("confirm-dialog", {
  variants: {
    tone: {
      default: "confirm-dialog-default",
      danger: "confirm-dialog-danger",
    },
  },
  defaultVariants: {
    tone: "default",
  },
});
