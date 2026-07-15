import { parseBackendValidationErrors } from "@/lib/vehicle-form-validation";
import type { VehicleFormErrors } from "@/lib/vehicle-form-validation";
import type {
  AuctionDetail,
  AuctionListItem,
  CreateAuctionWithVehicleInput,
} from "@/types";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3001";

export type CreateAuctionResult =
  | { success: true; auction: AuctionDetail }
  | { success: false; message: string; fieldErrors?: VehicleFormErrors };

export type UpdateAuctionResult =
  | { success: true; auction: AuctionDetail }
  | { success: false; message: string };

async function getAccessToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("You must be logged in.");
  }

  return token;
}

function getAuctionsErrorMessage(status: number): string {
  switch (status) {
    case 401:
      return "Your session has expired. Please log in again.";
    case 403:
      return "You do not have permission to view auctions.";
    default:
      return "Failed to fetch auctions. Please try again later.";
  }
}

function getAuctionErrorMessage(status: number): string {
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

export async function getAuctions(): Promise<AuctionListItem[]> {
  const token = await getAccessToken();

  const response = await fetch(`${BACKEND_URL}/auctions`, {
    headers: {
      Cookie: `access_token=${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(getAuctionsErrorMessage(response.status));
  }

  return (await response.json()) as AuctionListItem[];
}

export async function getAuction(id: string): Promise<AuctionDetail> {
  const token = await getAccessToken();

  const response = await fetch(`${BACKEND_URL}/auctions/${id}`, {
    headers: {
      Cookie: `access_token=${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(getAuctionErrorMessage(response.status));
  }

  return (await response.json()) as AuctionDetail;
}

export async function createAuctionWithVehicle(
  data: CreateAuctionWithVehicleInput,
): Promise<CreateAuctionResult> {
  const token = await getAccessToken();

  try {
    const response = await fetch(`${BACKEND_URL}/auctions/with-vehicle`, {
      method: "POST",
      headers: {
        Cookie: `access_token=${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 400) {
        const body = await response.json().catch(() => null);
        const fieldErrors = parseBackendValidationErrors(body);

        if (Object.keys(fieldErrors).length > 0) {
          return {
            success: false,
            message: "Please fix the highlighted fields.",
            fieldErrors,
          };
        }
      }

      return {
        success: false,
        message: "Failed to create auction. Please try again later.",
      };
    }

    return {
      success: true,
      auction: (await response.json()) as AuctionDetail,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create auction. Please try again later.",
    };
  }
}

export async function updateAuction(
  id: string,
  data: Record<string, unknown>,
): Promise<UpdateAuctionResult> {
  const token = await getAccessToken();

  try {
    const response = await fetch(`${BACKEND_URL}/auctions/${id}`, {
      method: "PATCH",
      headers: {
        Cookie: `access_token=${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const message =
        body && typeof body === "object" && "message" in body
          ? String(body.message)
          : "Failed to update auction. Please try again later.";

      return { success: false, message };
    }

    return {
      success: true,
      auction: (await response.json()) as AuctionDetail,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update auction. Please try again later.",
    };
  }
}
