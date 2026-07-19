/** Returns whether a well-formed, non-expired JWT contains an exact permission. */
export function checkPermission(
  token: string | null | undefined,
  permission: string,
): boolean {
  if (!token) return false;

  try {
    const payload = token.split(".")[1];
    if (!payload) return false;
    const normalized = payload.replaceAll("-", "+").replaceAll("_", "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );
    const decoded = JSON.parse(atob(padded)) as {
      exp?: unknown;
      permissions?: unknown;
    };
    if (typeof decoded.exp === "number" && decoded.exp * 1_000 <= Date.now()) {
      return false;
    }
    return (
      Array.isArray(decoded.permissions) &&
      decoded.permissions.includes(permission)
    );
  } catch {
    return false;
  }
}
