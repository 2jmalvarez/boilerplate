import { cva } from "class-variance-authority";
export const badgeVariants = cva("badge", {
  variants: {
    tone: {
      neutral: "badge-neutral",
      info: "badge-info",
      warning: "badge-warning",
      success: "badge-success",
      danger: "badge-danger",
    },
  },
  defaultVariants: { tone: "neutral" },
});
