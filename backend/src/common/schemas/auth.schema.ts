import { z } from 'zod';
import { userRoleSchema } from '../constants/user-role';

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const jwtPayloadSchema = z.object({
  sub: z.uuid(),
  email: z.email(),
  role: userRoleSchema,
});

export type LoginDto = z.infer<typeof loginSchema>;
export type JwtPayload = z.infer<typeof jwtPayloadSchema>;
