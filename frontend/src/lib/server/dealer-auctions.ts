import type { DealerAuctionDetail, DealerAuctionListItem } from "@/types/auction";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3001";

async function getAccessToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("You must be logged in.");
  }

  return token;
}

function getOpenAuctionsErrorMessage(status: number): string {
  switch (status) {
    case 401:
      return "Your session has expired. Please log in again.";
    case 403:
      return "You do not have permission to view auctions.";
    default:
      return "Failed to fetch auctions. Please try again later.";
  }
}

function getDealerAuctionErrorMessage(status: number): string {
  switch (status) {
    case 401:
      return "Your session has expired. Please log in again.";
    case 403:
      return "You do not have permission to view this auction.";
    case 404:
      return "Auction not found.";
    default:
      return "Failed to fetch auction. Please try again later.";
  }
}

export async function getOpenAuctions(): Promise<DealerAuctionListItem[]> {
  const token = await getAccessToken();

  const response = await fetch(`${BACKEND_URL}/auctions/open`, {
    headers: {
      Cookie: `access_token=${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(getOpenAuctionsErrorMessage(response.status));
  }

  return (await response.json()) as DealerAuctionListItem[];
}

export async function getDealerAuction(id: string): Promise<DealerAuctionDetail> {
  const token = await getAccessToken();

  const response = await fetch(`${BACKEND_URL}/auctions/open/${id}`, {
    headers: {
      Cookie: `access_token=${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(getDealerAuctionErrorMessage(response.status));
  }

  return (await response.json()) as DealerAuctionDetail;
}
