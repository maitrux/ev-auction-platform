import { getVehicles } from "@/lib/server/vehicles";
import type { Vehicle } from "@/types";
import { VehiclesPage } from "./vehicles-page";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Failed to load vehicles. Please try again later.";
}

export default async function Page() {
  let vehicles: Vehicle[] = [];
  let error: string | null = null;

  try {
    vehicles = await getVehicles();
  } catch (err) {
    error = getErrorMessage(err);
  }

  return (
    <main className="p-6">
      <VehiclesPage
        vehicles={vehicles}
        error={error}
      />
    </main>
  );
}
