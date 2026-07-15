import { cookies } from "next/headers";
import type { Bid } from "@/types/bid";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3001";

export async function getMyBids(): Promise<Bid[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("You must be logged in to view bids.");
  }

  const response = await fetch(`${BACKEND_URL}/bids/me`, {
    headers: {
      Cookie: `access_token=${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch your bids.");
  }

  return response.json();
}
