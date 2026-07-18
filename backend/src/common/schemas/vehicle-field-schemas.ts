import { z } from 'zod';
import {
  VEHICLE_MAX_MILEAGE_KM,
  VEHICLE_MAX_RANGE_KM,
  VEHICLE_MIN_YEAR,
} from '../constants/vehicle-limits';
import { getCurrentYear } from '../validation/date-validation';

export const vehicleConditionSchema = z.enum([
  'EXCELLENT',
  'GOOD',
  'FAIR',
  'POOR',
]);

export const vehicleYearSchema = z
  .number()
  .int()
  .min(VEHICLE_MIN_YEAR)
  .refine((year) => year <= getCurrentYear(), {
    message: 'Year cannot be in the future',
  });

export const vehicleMileageSchema = z
  .number()
  .int()
  .min(0)
  .max(VEHICLE_MAX_MILEAGE_KM);

export const vehicleRangeKmSchema = z
  .number()
  .int()
  .min(1)
  .max(VEHICLE_MAX_RANGE_KM);
