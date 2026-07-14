import type { User, UserRole } from "./user";
export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  user: User;
}

export type { User, UserRole };
