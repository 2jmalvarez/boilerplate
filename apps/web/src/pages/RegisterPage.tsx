import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { AuthScreen } from '../components/AuthScreen'

export function RegisterPage() {
  const { isAuthenticated, register } = useAuth()
  const navigate = useNavigate()

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  return (
    <AuthScreen
      mode="register"
      onSubmit={async (values) => {
        await register(values)
        navigate('/dashboard', { replace: true })
      }}
      footer={<p>¿Ya tienes acceso? <Link to="/login">Iniciar sesión</Link></p>}
    />
  )
}
