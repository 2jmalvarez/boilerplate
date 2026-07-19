import type { SelectProps } from "./Select.types";
import "../FormControl/FormControl.css";

/** Renders a styled native select while preserving all native select behavior. */
export function Select({
  className,
  invalid,
  ...props
}: Readonly<SelectProps>) {
  return (
    <select
      className={["form-control", "form-control-select", className]
        .filter(Boolean)
        .join(" ")}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}
