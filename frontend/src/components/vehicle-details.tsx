import { formatDate, formatNumber } from "@/lib/format";
import type { Vehicle } from "@/types";

type VehicleDetailsVehicle = Pick<
  Vehicle,
  | "vin"
  | "year"
  | "mileage"
  | "batteryCapacityKwh"
  | "batterySoH"
  | "rangeKm"
  | "registrationDate"
  | "city"
  | "country"
  | "condition"
  | "conditionNotes"
>;

interface VehicleDetailsProps {
  vehicle: VehicleDetailsVehicle;
  className?: string;
}

export function VehicleDetails({
  vehicle,
  className = "mb-8 rounded-lg border bg-white p-6",
}: VehicleDetailsProps) {
  return (
    <section className={className}>
      <h2 className="mb-4 text-lg font-semibold">Vehicle details</h2>
      <dl className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-gray-500">VIN</dt>
          <dd className="font-medium">{vehicle.vin}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Year</dt>
          <dd className="font-medium">{vehicle.year}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Mileage (km)</dt>
          <dd className="font-medium">{formatNumber(vehicle.mileage)} km</dd>
        </div>
        <div>
          <dt className="text-gray-500">Battery capacity (kWh)</dt>
          <dd className="font-medium">{vehicle.batteryCapacityKwh} kWh</dd>
        </div>
        <div>
          <dt className="text-gray-500">Battery SoH (%)</dt>
          <dd className="font-medium">{vehicle.batterySoH}%</dd>
        </div>
        <div>
          <dt className="text-gray-500">Range (km)</dt>
          <dd className="font-medium">{formatNumber(vehicle.rangeKm)} km</dd>
        </div>
        <div>
          <dt className="text-gray-500">Registration date</dt>
          <dd className="font-medium">
            {formatDate(vehicle.registrationDate)}
          </dd>
        </div>
        <div>
          <dt className="text-gray-500">Location</dt>
          <dd className="font-medium">
            {vehicle.city}, {vehicle.country}
          </dd>
        </div>
        <div>
          <dt className="text-gray-500">Condition</dt>
          <dd className="font-medium">{vehicle.condition}</dd>
        </div>
        {vehicle.conditionNotes ? (
          <div className="col-span-2">
            <dt className="text-gray-500">Condition notes</dt>
            <dd className="font-medium">{vehicle.conditionNotes}</dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}
