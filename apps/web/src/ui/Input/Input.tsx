import type { InputProps } from "./Input.types";
import "../FormControl/FormControl.css";

/** Renders a styled native input while preserving all native input behavior. */
export function Input({ className, invalid, ...props }: Readonly<InputProps>) {
  return (
    <input
      className={["form-control", className].filter(Boolean).join(" ")}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}
