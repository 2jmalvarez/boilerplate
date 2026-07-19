import { useId } from "react";
import type { FormFieldProps } from "./FormField.types";
import "./FormField.css";
export function FormField({ children, error, hint, label, required }: Readonly<FormFieldProps>) { const hintId = useId(); const errorId = useId(); return <label className="form-field"><span className={required ? "form-field-label-required" : ""}>{label}</span>{children}{hint && <small id={hintId}>{hint}</small>}{error && <small className="form-field-error" id={errorId} role="alert">{error}</small>}</label>; }
