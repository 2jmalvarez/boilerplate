import { ArrowRight, SquareCheckBig } from "lucide-react";
import { useState, type FormEventHandler, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout/AuthLayout";
import { getErrorMessage } from "../lib/api";
import { Button } from "../ui/Button/Button";
import { FormError } from "../ui/FormError/FormError";
import { FormField } from "../ui/FormField/FormField";
import { Input } from "../ui/Input/Input";

/** Props for the authentication process form rendered inside `AuthLayout`. */
interface AuthScreenProps {
  /** Navigation or registration prompt. */ footer: ReactNode;
  /** Authentication flow to display. */ mode: "login" | "register";
  /** Persists submitted credentials. */ onSubmit: (values: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
}
/** Implements the login and registration form process. */
export function AuthScreen({
  footer,
  mode,
  onSubmit,
}: Readonly<AuthScreenProps>) {
  const isRegister = mode === "register";
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch (submitError) {
      setError(getErrorMessage(submitError));
      setSubmitting(false);
    }
  };
  return (
    <AuthLayout
      brand={
        <Link to="/">
          <SquareCheckBig aria-hidden="true" />
          PLIEGO
        </Link>
      }
      issueNumber={`ED. 01 / ${new Date().getFullYear()}`}
      intro={
        <>
          <p className="eyebrow">Sistema personal de producción</p>
          <h1 id="auth-title">
            Orden para el trabajo <em>que importa.</em>
          </h1>
          <p className="auth-deck">
            Un tablero directo para registrar, fechar y cerrar pendientes sin
            ruido.
          </p>
          <p className="auth-note">Cada tarea ocupa su lugar. Nada más.</p>
        </>
      }
    >
      <div aria-label={isRegister ? "Crear cuenta" : "Iniciar sesión"}>
        <div className="form-heading">
          <span>{isRegister ? "Nuevo registro" : "Acceso reservado"}</span>
          <h2>{isRegister ? "Abre tu archivo" : "Vuelve al tablero"}</h2>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <FormField label="Nombre" required>
              {({ describedBy, invalid }) => (
                <Input
                  aria-describedby={describedBy}
                  autoComplete="name"
                  invalid={invalid}
                  name="name"
                  required
                  value={values.name}
                  onChange={(event) =>
                    setValues({ ...values, name: event.target.value })
                  }
                />
              )}
            </FormField>
          )}
          <FormField label="Correo electrónico" required>
            {({ describedBy, invalid }) => (
              <Input
                aria-describedby={describedBy}
                autoComplete="email"
                invalid={invalid}
                name="email"
                required
                type="email"
                value={values.email}
                onChange={(event) =>
                  setValues({ ...values, email: event.target.value })
                }
              />
            )}
          </FormField>
          <FormField label="Contraseña" required>
            {({ describedBy, invalid }) => (
              <Input
                aria-describedby={describedBy}
                autoComplete={isRegister ? "new-password" : "current-password"}
                invalid={invalid}
                minLength={8}
                name="password"
                required
                type="password"
                value={values.password}
                onChange={(event) =>
                  setValues({ ...values, password: event.target.value })
                }
              />
            )}
          </FormField>
          {error && <FormError>{error}</FormError>}
          <Button
            className="auth-submit"
            loading={submitting}
            type="submit"
            variant="primary"
          >
            {isRegister ? "Crear cuenta" : "Entrar"}
            {!submitting && <ArrowRight aria-hidden="true" size={18} />}
          </Button>
        </form>
        <div className="auth-footer">{footer}</div>
      </div>
    </AuthLayout>
  );
}
