import type { Request } from 'express';
import type { AuthenticatedUser } from '../schemas/user.schema';

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
