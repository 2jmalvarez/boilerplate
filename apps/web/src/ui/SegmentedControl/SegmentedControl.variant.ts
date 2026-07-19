import { cva } from "class-variance-authority";
export const segmentedControlVariants = cva("segmented-control", {
  variants: { compact: { true: "segmented-control-compact", false: "" } },
  defaultVariants: { compact: false },
});
