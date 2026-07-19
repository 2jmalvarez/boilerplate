import { Navigate, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { AuthScreen } from "../components/AuthScreen";

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: string } | null)?.from ?? "/dashboard";

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <AuthScreen
      mode="login"
      onSubmit={async ({ email, password }) => {
        await login({ email, password });
        navigate(from, { replace: true });
      }}
      footer={
        <p>
          ¿Primera vez? <Link to="/register">Crear una cuenta</Link>
        </p>
      }
    />
  );
}
