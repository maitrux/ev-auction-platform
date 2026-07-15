import { getVehicles } from "@/lib/server/vehicles";
import type { Vehicle } from "@/types";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Failed to load vehicles. Please try again later.";
}

export default async function VehiclesPage() {
  let vehicles: Vehicle[] = [];
  let error: string | null = null;

  try {
    vehicles = await getVehicles();
  } catch (err) {
    error = getErrorMessage(err);
  }

  return (
    <main className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Vehicles</h1>

      {error && (
        <div
          className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}

      {!error && (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3">VIN</th>
                <th className="px-4 py-3">Make</th>
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3">Mileage</th>
                <th className="px-4 py-3">Battery (kWh)</th>
                <th className="px-4 py-3">SoH (%)</th>
                <th className="px-4 py-3">Range (km)</th>
                <th className="px-4 py-3">Registration Date</th>
                <th className="px-4 py-3">Condition</th>
                <th className="px-4 py-3">Notes</th>
                <th className="px-4 py-3">Photos</th>
                <th className="px-4 py-3">Location</th>
              </tr>
            </thead>

            <tbody>
              {vehicles.map((vehicle) => (
                <tr
                  key={vehicle.id}
                  className="border-b"
                >
                  <td className="px-4 py-3">{vehicle.vin}</td>
                  <td className="px-4 py-3">{vehicle.make}</td>
                  <td className="px-4 py-3">{vehicle.model}</td>
                  <td className="px-4 py-3">{vehicle.year}</td>
                  <td className="px-4 py-3">
                    {vehicle.mileage.toLocaleString()} km
                  </td>
                  <td className="px-4 py-3">{vehicle.batteryCapacityKwh}</td>
                  <td className="px-4 py-3">{vehicle.batterySoH}%</td>
                  <td className="px-4 py-3">{vehicle.rangeKm}</td>
                  <td className="px-4 py-3">
                    {new Date(vehicle.registrationDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{vehicle.condition}</td>
                  <td className="px-4 py-3">{vehicle.conditionNotes ?? "-"}</td>
                  <td className="px-4 py-3">
                    {vehicle.photos.length > 0
                      ? `${vehicle.photos.length} photo(s)`
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    {vehicle.city}, {vehicle.country}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
