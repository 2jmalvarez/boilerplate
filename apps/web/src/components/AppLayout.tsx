import { LogOut, SquareCheckBig } from 'lucide-react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="/dashboard" aria-label="Pliego, ir al tablero">
          <SquareCheckBig aria-hidden="true" strokeWidth={1.7} />
          <span>PLIEGO</span>
          <small>Tareas / Archivo activo</small>
        </a>
        <div className="account-block">
          <span className="account-label">Sesión</span>
          <strong>{user?.name}</strong>
          <button className="button button-quiet" type="button" onClick={handleLogout}>
            <LogOut size={17} aria-hidden="true" />
            Salir
          </button>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
