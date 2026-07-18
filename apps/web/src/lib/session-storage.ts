import type { AuthSession } from '../types/api'

const SESSION_KEY = 'pliego.auth'

export function readSession(): AuthSession | null {
  const stored = localStorage.getItem(SESSION_KEY)

  if (!stored) return null

  try {
    const session = JSON.parse(stored) as AuthSession
    return session.accessToken && session.user ? session : null
  } catch {
    localStorage.removeItem(SESSION_KEY)
    return null
  }
}

export function writeSession(session: AuthSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
}
