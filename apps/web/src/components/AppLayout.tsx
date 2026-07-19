import { LogOut, Settings, SquareCheckBig } from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { checkPermission } from "../auth/checkPermission";
import { AppHeader } from "../layouts/AppHeader/AppHeader";
import { AppShell } from "../layouts/AppShell/AppShell";
import { Button } from "../ui/Button/Button";
import { ButtonLink } from "../ui/Button/ButtonLink";

/** Connects the presentational application shell with the current auth session and router. */
export function AppLayout() {
  const { accessToken, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <AppShell
      header={
        <AppHeader
          brand={
            <Link to="/dashboard" aria-label="Pliego, ir al tablero">
              <SquareCheckBig aria-hidden="true" strokeWidth={1.7} />
              <span>PLIEGO</span>
            </Link>
          }
          subtitle="Tareas / Archivo activo"
          userName={user?.name}
          actions={
            <div className="header-actions">
              {checkPermission(accessToken, "role:read") && (
                <ButtonLink to="/access" variant="quiet">
                  <Settings size={17} aria-hidden="true" />
                  Acceso
                </ButtonLink>
              )}
              <Button type="button" variant="quiet" onClick={handleLogout}>
                <LogOut size={17} aria-hidden="true" />
                Salir
              </Button>
            </div>
          }
        />
      }
    >
      <Outlet />
    </AppShell>
  );
}
