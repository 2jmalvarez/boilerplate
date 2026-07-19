import { LoaderCircle } from "lucide-react";
import { buttonVariants } from "./Button.variant";
import type { ButtonProps } from "./Button.types";
import "./Button.css";

export function Button({ children, className, disabled, fullWidth, loading, size, variant, ...props }: Readonly<ButtonProps>) {
  return <button className={buttonVariants({ className, fullWidth, size, variant })} disabled={disabled || loading} {...props}>
    {loading && <LoaderCircle className="button-spinner" aria-hidden="true" size={16} />}
    {children}
  </button>;
}
