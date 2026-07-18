import { z } from 'zod';
import { isDateInFuture } from '../validation/date-validation';
import {
  vehicleConditionSchema,
  vehicleMileageSchema,
  vehicleRangeKmSchema,
  vehicleYearSchema,
} from './vehicle-field-schemas';

export const createVehicleSchema = z
  .object({
    vin: z.string().min(17).max(17),
    make: z.string().min(1),
    model: z.string().min(1),
    year: vehicleYearSchema,
    mileageKm: vehicleMileageSchema,

    batteryCapacityKwh: z.number().positive(),
    batterySoH: z.number().min(0).max(100),
    rangeKm: vehicleRangeKmSchema,

    registrationDate: z.coerce.date(),

    condition: vehicleConditionSchema,
    conditionNotes: z.string().optional(),

    photos: z.array(z.string().url()),

    city: z.string().min(1),
    country: z.string().min(1),
  })
  .superRefine((data, ctx) => {
    if (isDateInFuture(data.registrationDate)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Registration date cannot be in the future',
        path: ['registrationDate'],
      });
    }
  });

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
