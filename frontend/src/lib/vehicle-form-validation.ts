import type { VehicleFormState } from "@/types";

export type VehicleFormErrors = Partial<Record<keyof VehicleFormState, string>>;

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function parseRequiredInt(
  value: string,
  label: string,
): { value?: number; error?: string } {
  const trimmed = value.trim();

  if (!trimmed) {
    return { error: `${label} is required` };
  }

  const parsed = Number(trimmed);

  if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) {
    return { error: `${label} must be a whole number` };
  }

  return { value: parsed };
}

function parseRequiredNumber(
  value: string,
  label: string,
): { value?: number; error?: string } {
  const trimmed = value.trim();

  if (!trimmed) {
    return { error: `${label} is required` };
  }

  const parsed = Number(trimmed);

  if (!Number.isFinite(parsed)) {
    return { error: `${label} must be a number` };
  }

  return { value: parsed };
}

export function validateVehicleForm(form: VehicleFormState): VehicleFormErrors {
  const errors: VehicleFormErrors = {};

  const vin = form.vin.trim();

  if (!vin) {
    errors.vin = "VIN is required";
  } else if (vin.length !== 17) {
    errors.vin = "VIN must be exactly 17 characters";
  }

  if (!form.make.trim()) {
    errors.make = "Make is required";
  }

  if (!form.model.trim()) {
    errors.model = "Model is required";
  }

  const year = parseRequiredInt(form.year, "Year");
  const currentYear = new Date().getFullYear();

  if (year.error) {
    errors.year = year.error;
  } else if (year.value! < 1886) {
    errors.year = "Year must be 1886 or later";
  } else if (year.value! > currentYear) {
    errors.year = "Year cannot be in the future";
  }

  const mileageKm = parseRequiredInt(form.mileageKm, "Mileage");

  if (mileageKm.error) {
    errors.mileageKm = mileageKm.error;
  } else if (mileageKm.value! < 0) {
    errors.mileageKm = "Mileage must be 0 or greater";
  }

  const batteryCapacityKwh = parseRequiredNumber(
    form.batteryCapacityKwh,
    "Battery capacity",
  );

  if (batteryCapacityKwh.error) {
    errors.batteryCapacityKwh = batteryCapacityKwh.error;
  } else if (batteryCapacityKwh.value! <= 0) {
    errors.batteryCapacityKwh = "Battery capacity must be greater than 0";
  }

  const batterySoH = parseRequiredNumber(form.batterySoH, "Battery SoH");

  if (batterySoH.error) {
    errors.batterySoH = batterySoH.error;
  } else if (batterySoH.value! < 0 || batterySoH.value! > 100) {
    errors.batterySoH = "Battery SoH must be between 0 and 100";
  }

  const rangeKm = parseRequiredInt(form.rangeKm, "Range");

  if (rangeKm.error) {
    errors.rangeKm = rangeKm.error;
  } else if (rangeKm.value! <= 0) {
    errors.rangeKm = "Range must be greater than 0";
  }

  if (!form.registrationDate) {
    errors.registrationDate = "Registration date is required";
  } else if (Number.isNaN(new Date(form.registrationDate).getTime())) {
    errors.registrationDate = "Registration date is invalid";
  } else {
    const registrationDate = new Date(`${form.registrationDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (registrationDate > today) {
      errors.registrationDate = "Registration date cannot be in the future";
    }
  }

  if (!form.city.trim()) {
    errors.city = "City is required";
  }

  if (!form.country.trim()) {
    errors.country = "Country is required";
  }

  const photoUrls = form.photos
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);

  const invalidPhoto = photoUrls.find((url) => !isValidUrl(url));

  if (invalidPhoto) {
    errors.photos = `Invalid photo URL: ${invalidPhoto}`;
  }

  return errors;
}

export function hasFormErrors(errors: VehicleFormErrors): boolean {
  return Object.keys(errors).length > 0;
}

type BackendFieldNode = {
  errors?: string[];
  properties?: Record<string, BackendFieldNode>;
};

type BackendValidationBody = {
  properties?: Record<string, BackendFieldNode>;
};

const backendFieldMessages: Record<string, string> = {
  vin: "VIN must be exactly 17 characters",
  make: "Make is required",
  model: "Model is required",
  year: "Year must be 1886 or later and cannot be in the future",
  mileageKm: "Mileage must be 0 or greater",
  batteryCapacityKwh: "Battery capacity must be greater than 0",
  batterySoH: "Battery SoH must be between 0 and 100",
  rangeKm: "Range must be greater than 0",
  registrationDate: "Registration date is invalid or in the future",
  photos: "Each photo must be a valid URL",
  city: "City is required",
  country: "Country is required",
};

function getVehicleFieldProperties(
  properties: Record<string, BackendFieldNode>,
): Record<string, BackendFieldNode> | null {
  const vehicleNode = properties.vehicle;

  if (vehicleNode?.properties) {
    return vehicleNode.properties;
  }

  const hasVehicleField = Object.keys(properties).some(
    (field) => field in backendFieldMessages,
  );

  return hasVehicleField ? properties : null;
}

export function parseBackendValidationErrors(
  body: unknown,
): VehicleFormErrors {
  if (!body || typeof body !== "object") {
    return {};
  }

  const properties = (body as BackendValidationBody).properties;

  if (!properties) {
    return {};
  }

  const fieldProperties = getVehicleFieldProperties(properties);

  if (!fieldProperties) {
    return {};
  }

  const errors: VehicleFormErrors = {};

  for (const [field, value] of Object.entries(fieldProperties)) {
    const message = value?.errors?.[0];

    if (!(field in backendFieldMessages) || !message) {
      continue;
    }

    errors[field as keyof VehicleFormState] =
      message ?? backendFieldMessages[field];
  }

  return errors;
}
