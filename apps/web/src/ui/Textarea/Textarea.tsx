import type { TextareaProps } from "./Textarea.types";
import "../FormControl/FormControl.css";

/** Renders a styled native textarea while preserving all native textarea behavior. */
export function Textarea({
  className,
  invalid,
  ...props
}: Readonly<TextareaProps>) {
  return (
    <textarea
      className={["form-control", "form-control-textarea", className]
        .filter(Boolean)
        .join(" ")}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}
