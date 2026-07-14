import { z } from 'zod';
import { userRoleSchema } from '../constants/user-role';

export const authenticatedUserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  role: userRoleSchema,
});

export const publicUserSchema = authenticatedUserSchema.extend({
  name: z.string(),
});

export type AuthenticatedUser = z.infer<typeof authenticatedUserSchema>;
export type PublicUser = z.infer<typeof publicUserSchema>;
