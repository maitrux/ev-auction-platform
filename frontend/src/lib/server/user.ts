import { cookies } from "next/headers";
import type { User } from "@/types";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3001";

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return null;
  }

  const response = await fetch(`${BACKEND_URL}/users/me`, {
    headers: {
      Cookie: `access_token=${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}
