export type UserRole = "ADMIN" | "DEALER";

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface User extends AuthenticatedUser {
  name: string;
}
