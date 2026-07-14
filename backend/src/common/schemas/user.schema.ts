import { Role } from '@prisma/client';
import { z } from 'zod';

export const userRoleSchema = z.nativeEnum(Role);

export const authenticatedUserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  role: userRoleSchema,
});

export const publicUserSchema = authenticatedUserSchema.extend({
  name: z.string(),
});

export type UserRole = z.infer<typeof userRoleSchema>;
export type AuthenticatedUser = z.infer<typeof authenticatedUserSchema>;
export type PublicUser = z.infer<typeof publicUserSchema>;
