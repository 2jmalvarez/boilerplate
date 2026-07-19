import { iconButtonVariants } from "./IconButton.variant";
import type { IconButtonProps } from "./IconButton.types";
import "./IconButton.css";
export function IconButton({
  children,
  className,
  size,
  variant,
  ...props
}: Readonly<IconButtonProps>) {
  return (
    <button
      className={iconButtonVariants({ className, size, variant })}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}
