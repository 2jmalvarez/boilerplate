import { cva } from "class-variance-authority";
export const feedbackVariants = cva("feedback", {
  variants: { tone: { neutral: "", error: "feedback-error" } },
  defaultVariants: { tone: "neutral" },
});
