import type { Vehicle } from "@/types";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3001";

function getVehiclesErrorMessage(status: number): string {
  switch (status) {
    case 401:
      return "Your session has expired. Please log in again.";
    case 403:
      return "You do not have permission to view vehicles.";
    default:
      return "Failed to fetch vehicles. Please try again later.";
  }
}

export async function getVehicles(): Promise<Vehicle[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("You must be logged in to view vehicles.");
  }

  try {
    const response = await fetch(`${BACKEND_URL}/vehicles`, {
      headers: {
        Cookie: `access_token=${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(getVehiclesErrorMessage(response.status));
    }

    return (await response.json()) as Vehicle[];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to fetch vehicles. Please try again later.");
  }
}
