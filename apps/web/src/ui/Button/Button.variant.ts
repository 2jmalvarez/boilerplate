import { cva } from "class-variance-authority";

export const buttonVariants = cva("button", {
  variants: {
    variant: {
      default: "button-default",
      primary: "button-primary",
      quiet: "button-quiet",
      ghost: "button-ghost",
      danger: "button-danger",
    },
    size: {
      small: "button-small",
      medium: "button-medium",
      large: "button-large",
    },
    fullWidth: { true: "button-full-width", false: "" },
  },
  defaultVariants: { variant: "default", size: "medium", fullWidth: false },
});
