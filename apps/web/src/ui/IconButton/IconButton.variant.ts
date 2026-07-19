import { cva } from "class-variance-authority";
export const iconButtonVariants = cva("icon-button", {
  variants: {
    variant: {
      default: "",
      quiet: "icon-button-quiet",
      danger: "icon-button-danger",
    },
    size: {
      small: "icon-button-small",
      medium: "",
      large: "icon-button-large",
    },
  },
  defaultVariants: { variant: "quiet", size: "medium" },
});
