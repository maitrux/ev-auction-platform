export type VehicleCondition = "EXCELLENT" | "GOOD" | "FAIR" | "POOR";

export interface Vehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage: number;

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
