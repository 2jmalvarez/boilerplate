import type { ReactNode } from "react";

interface FormFieldProps {
  children: ReactNode;
  label: string;
}

export function FormField({ children, label }: Readonly<FormFieldProps>) {
  return (
    <label>
      <span>{label}</span>
      {children}
    </label>
  );
}
