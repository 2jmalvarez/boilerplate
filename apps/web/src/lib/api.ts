import axios, { AxiosError } from "axios";
import { readSession } from "./session-storage";
import type { ApiErrorBody } from "../types/api";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = readSession()?.accessToken;

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const body = error.response?.data as ApiErrorBody | undefined;
    if (body?.error?.message) return body.error.message;
  }

  if (error instanceof Error) return error.message;

  return "Ocurrió un error inesperado. Inténtalo de nuevo.";
}
