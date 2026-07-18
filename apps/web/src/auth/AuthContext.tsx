/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { api } from "../lib/api";
import {
  clearSession,
  readSession,
  writeSession,
} from "../lib/session-storage";
import type {
  ApiEnvelope,
  AuthSession,
  LoginInput,
  RegisterInput,
  User,
} from "../types/api";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: Readonly<PropsWithChildren>) {
  const [session, setSession] = useState<AuthSession | null>(readSession);

  const authenticate = useCallback(
    async (path: string, input: LoginInput | RegisterInput) => {
      const response = await api.post<ApiEnvelope<AuthSession>>(path, input);
      writeSession(response.data.data);
      setSession(response.data.data);
    },
    [],
  );

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      isAuthenticated: Boolean(session?.accessToken),
      login: (input) => authenticate("/auth/login", input),
      register: (input) => authenticate("/auth/register", input),
      logout,
    }),
    [authenticate, logout, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}
