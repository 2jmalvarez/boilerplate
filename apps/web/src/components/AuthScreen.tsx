import { ArrowRight, SquareCheckBig } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout/AuthLayout";
import { getErrorMessage } from "../lib/api";
import { Button } from "../ui/Button/Button";
import { FormField } from "../ui/FormField/FormField";

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
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch (submitError) {
      setError(getErrorMessage(submitError));
      setSubmitting(false);
    }
  }
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
              <input
                autoComplete="name"
                name="name"
                required
                value={values.name}
                onChange={(event) =>
                  setValues({ ...values, name: event.target.value })
                }
              />
            </FormField>
          )}
          <FormField label="Correo electrónico" required>
            <input
              autoComplete="email"
              name="email"
              required
              type="email"
              value={values.email}
              onChange={(event) =>
                setValues({ ...values, email: event.target.value })
              }
            />
          </FormField>
          <FormField label="Contraseña" required>
            <input
              autoComplete={isRegister ? "new-password" : "current-password"}
              minLength={8}
              name="password"
              required
              type="password"
              value={values.password}
              onChange={(event) =>
                setValues({ ...values, password: event.target.value })
              }
            />
          </FormField>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
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
