import type { AuthSession } from "../types/api";

const SESSION_KEY = "pliego.auth:v1";
const LEGACY_SESSION_KEY = "pliego.auth";

export function readSession(): AuthSession | null {
  const stored = localStorage.getItem(SESSION_KEY);
  const isLegacySession = !stored;
  const sessionValue = stored ?? localStorage.getItem(LEGACY_SESSION_KEY);

  if (!sessionValue) return null;

  try {
    const session = JSON.parse(sessionValue) as AuthSession;
    if (!session.accessToken || !session.user) return null;

    if (isLegacySession) {
      writeSession(session);
      localStorage.removeItem(LEGACY_SESSION_KEY);
    }

    return session;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(LEGACY_SESSION_KEY);
    return null;
  }
}

export function writeSession(session: AuthSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
