import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { checkPermission } from "./checkPermission";

export function PermissionRoute({
  permission,
}: Readonly<{ permission: string }>) {
  const { accessToken } = useAuth();
  const location = useLocation();

  if (!checkPermission(accessToken, permission)) {
    return (
      <Navigate to="/dashboard" replace state={{ from: location.pathname }} />
    );
  }

  return <Outlet />;
}
