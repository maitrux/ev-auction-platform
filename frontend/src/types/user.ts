export type UserRole = "ADMIN" | "DEALER";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}
