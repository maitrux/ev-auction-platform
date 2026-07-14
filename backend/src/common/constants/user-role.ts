import { z } from 'zod';

export const UserRole = {
  ADMIN: 'ADMIN',
  DEALER: 'DEALER',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const userRoleSchema = z.enum([UserRole.ADMIN, UserRole.DEALER]);
