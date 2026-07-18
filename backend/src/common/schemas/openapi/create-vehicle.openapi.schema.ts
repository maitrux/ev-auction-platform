import { z } from 'zod';
import { VEHICLE_MIN_YEAR } from '../../constants/vehicle-limits';
import { getCurrentYear } from '../../validation/date-validation';
import {
  vehicleConditionSchema,
  vehicleMileageSchema,
  vehicleRangeKmSchema,
} from '../vehicle-field-schemas';
import { openapiDateSchema } from './date.schema';

export const createVehicleOpenApiSchema = z.object({
  vin: z.string().min(17).max(17),
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(VEHICLE_MIN_YEAR).max(getCurrentYear()),
  mileageKm: vehicleMileageSchema,
  batteryCapacityKwh: z.number().positive(),
  batterySoH: z.number().min(0).max(100),
  rangeKm: vehicleRangeKmSchema,
  registrationDate: openapiDateSchema,
  condition: vehicleConditionSchema,
  conditionNotes: z.string().optional(),
  photos: z.array(z.string().url()),
  city: z.string().min(1),
  country: z.string().min(1),
});
