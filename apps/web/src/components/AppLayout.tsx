import { LogOut, SquareCheckBig } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { AppHeader } from "../layouts/AppHeader/AppHeader";
import { AppShell } from "../layouts/AppShell/AppShell";
import { Button } from "../ui/Button/Button";

/** Connects the presentational application shell with the current auth session and router. */
export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <AppShell header={<AppHeader brand={<a href="/dashboard" aria-label="Pliego, ir al tablero"><SquareCheckBig aria-hidden="true" strokeWidth={1.7} /><span>PLIEGO</span></a>} subtitle="Tareas / Archivo activo" userName={user?.name} actions={<Button type="button" variant="quiet" onClick={handleLogout}><LogOut size={17} aria-hidden="true" />Salir</Button>} />}><Outlet /></AppShell>
  );
}
