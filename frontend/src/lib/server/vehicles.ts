import {
  parseBackendValidationErrors,
  type VehicleFormErrors,
} from "@/lib/vehicle-form-validation";
import type { CreateVehicleInput, Vehicle } from "@/types";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3001";

export type CreateVehicleResult =
  | { success: true; vehicle: Vehicle }
  | { success: false; message: string; fieldErrors?: VehicleFormErrors };

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

function getCreateVehicleErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return "Invalid vehicle data.";
    case 401:
      return "Your session has expired. Please log in again.";
    case 403:
      return "You do not have permission to add vehicles.";
    default:
      return "Failed to create vehicle. Please try again later.";
  }
}

async function getAccessToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("You must be logged in.");
  }

  return token;
}

export async function getVehicles(): Promise<Vehicle[]> {
  const token = await getAccessToken();

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

export async function createVehicle(
  data: CreateVehicleInput,
): Promise<CreateVehicleResult> {
  const token = await getAccessToken();

  try {
    const response = await fetch(`${BACKEND_URL}/vehicles`, {
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
        message: getCreateVehicleErrorMessage(response.status),
      };
    }

    return {
      success: true,
      vehicle: (await response.json()) as Vehicle,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create vehicle. Please try again later.",
    };
  }
}
