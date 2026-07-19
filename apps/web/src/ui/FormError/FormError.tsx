import type { FormErrorProps } from "./FormError.types";
import "./FormError.css";

/** Renders an assertive error message for a failed form operation. */
export function FormError({
  children,
  className,
  ...props
}: Readonly<FormErrorProps>) {
  return (
    <p
      className={["form-error", className].filter(Boolean).join(" ")}
      role="alert"
      {...props}
    >
      {children}
    </p>
  );
}
