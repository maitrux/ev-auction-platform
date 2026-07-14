import { jwtVerify } from "jose";
import type { UserRole } from "@/types/user";

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export async function verifyAccessToken(
  token: string | undefined,
): Promise<JwtPayload | null> {
  if (!token) {
    return null;
  }

  const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as JwtPayload;
  } catch {
    return null;
  }
}
