import { z } from 'zod';
import { getCurrentYear, isDateInFuture } from '../validation/date-validation';

export const vehicleConditionSchema = z.enum([
  'EXCELLENT',
  'GOOD',
  'FAIR',
  'POOR',
]);

export const createVehicleSchema = z
  .object({
    vin: z.string().min(17).max(17),
    make: z.string().min(1),
    model: z.string().min(1),
    year: z.number().int().min(1886),
    mileage: z.number().int().min(0),

    batteryCapacityKwh: z.number().positive(),
    batterySoH: z.number().min(0).max(100),
    rangeKm: z.number().int().positive(),

    registrationDate: z.coerce.date(),

    condition: vehicleConditionSchema,
    conditionNotes: z.string().optional(),

    photos: z.array(z.string().url()),

    city: z.string().min(1),
    country: z.string().min(1),
  })
  .superRefine((data, ctx) => {
    if (data.year > getCurrentYear()) {
      ctx.addIssue({
        code: 'custom',
        message: 'Year cannot be in the future',
        path: ['year'],
      });
    }

    if (isDateInFuture(data.registrationDate)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Registration date cannot be in the future',
        path: ['registrationDate'],
      });
    }
  });

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
