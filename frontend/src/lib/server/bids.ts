import { cookies } from "next/headers";
import type { Bid } from "@/types/bid";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3001";

export type PlaceBidResult =
  | {
      success: true;
      bid: {
        id: string;
        amount: number;
        createdAt: string;
      };
    }
  | { success: false; message: string };

async function getAccessToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("You must be logged in.");
  }

  return token;
}

export async function getMyBids(): Promise<Bid[]> {
  const token = await getAccessToken();

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

export async function placeBid(
  auctionId: string,
  amount: number,
): Promise<PlaceBidResult> {
  const token = await getAccessToken();

  try {
    const response = await fetch(`${BACKEND_URL}/bids`, {
      method: "POST",
      headers: {
        Cookie: `access_token=${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ auctionId, amount }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const message =
        body && typeof body === "object" && "message" in body
          ? String(body.message)
          : "Failed to place bid. Please try again later.";

      return { success: false, message };
    }

    return {
      success: true,
      bid: await response.json(),
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to place bid. Please try again later.",
    };
  }
}
