export type VehicleCondition = "EXCELLENT" | "GOOD" | "FAIR" | "POOR";

export interface Vehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  mileageKm: number;

  batteryCapacityKwh: number;
  batterySoH: number;
  rangeKm: number;

  registrationDate: string;

  condition: VehicleCondition;
  conditionNotes?: string | null;

  photos: string[];

  city: string;
  country: string;

  createdAt: string;
  updatedAt: string;
}

export interface CreateVehicleInput {
  vin: string;
  make: string;
  model: string;
  year: number;
  mileageKm: number;
  batteryCapacityKwh: number;
  batterySoH: number;
  rangeKm: number;
  registrationDate: string;
  condition: VehicleCondition;
  conditionNotes?: string;
  photos: string[];
  city: string;
  country: string;
}

export type VehicleFormState = {
  vin: string;
  make: string;
  model: string;
  year: string;
  mileageKm: string;
  batteryCapacityKwh: string;
  batterySoH: string;
  rangeKm: string;
  registrationDate: string;
  condition: VehicleCondition;
  conditionNotes: string;
  photos: string;
  city: string;
  country: string;
};

export function toCreateVehicleInput(
  form: VehicleFormState,
): CreateVehicleInput {
  return {
    vin: form.vin,
    make: form.make,
    model: form.model,
    year: Number(form.year),
    mileageKm: Number(form.mileageKm),
    batteryCapacityKwh: Number(form.batteryCapacityKwh),
    batterySoH: Number(form.batterySoH),
    rangeKm: Number(form.rangeKm),
    registrationDate: form.registrationDate,
    condition: form.condition,
    conditionNotes: form.conditionNotes || undefined,
    photos: form.photos
      .split(",")
      .map((url) => url.trim())
      .filter(Boolean),
    city: form.city,
    country: form.country,
  };
}
