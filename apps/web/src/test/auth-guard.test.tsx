import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { App } from '../App'
import { AuthProvider } from '../auth/AuthContext'

describe('protección de rutas', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.pushState({}, '', '/dashboard')
  })

  it('redirige a login cuando no existe una sesión', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>,
    )

    expect(await screen.findByRole('heading', { name: /vuelve al tablero/i })).not.toBeNull()
    expect(window.location.pathname).toBe('/login')
  })
})
