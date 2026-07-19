import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "quiet";
}

export function Button({
  children,
  className = "",
  variant,
  ...props
}: Readonly<ButtonProps>) {
  const variantClassName = variant ? `button-${variant}` : "";

  return (
    <button
      className={["button", variantClassName, className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
