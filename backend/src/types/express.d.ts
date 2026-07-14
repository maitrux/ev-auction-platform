import type { AuthenticatedUser } from '../common/schemas/user.schema';

declare global {
  namespace Express {
    interface User extends AuthenticatedUser {}
  }
}

export {};
