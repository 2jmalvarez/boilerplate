export interface AuthenticatedUser {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];
}
