import { Link } from "react-router-dom";
import { buttonVariants } from "./Button.variant";
import type { ButtonLinkProps } from "./Button.types";
import "./Button.css";

/** Renders client-side navigation with the Button visual variants. */
export function ButtonLink({
  children,
  className,
  fullWidth,
  size,
  variant,
  ...props
}: Readonly<ButtonLinkProps>) {
  return (
    <Link
      className={buttonVariants({ className, fullWidth, size, variant })}
      {...props}
    >
      {children}
    </Link>
  );
}
