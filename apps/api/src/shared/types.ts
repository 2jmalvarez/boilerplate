export const roles = ["user", "admin"] as const;
export type Role = (typeof roles)[number];

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
}
