import type { AuthenticatedUser, User, UserRole } from "./user";

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  user: User;
}

export type { AuthenticatedUser, User, UserRole };
