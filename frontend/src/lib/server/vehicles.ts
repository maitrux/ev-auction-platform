import type { Vehicle } from "@/types";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3001";

export async function getVehicles(): Promise<Vehicle[]> {
  const response = await fetch(`${BACKEND_URL}/vehicles`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch vehicles");
  }

  return response.json();
}
