import { z } from 'zod';
import { createVehicleSchema } from './create-vehicle.schema';

const auctionFieldsSchema = z.object({
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  reservePrice: z.number().positive(),
  minIncrement: z.number().positive(),
});

export const createAuctionWithVehicleSchema = z
  .object({
    saveAsDraft: z.boolean(),
    vehicle: createVehicleSchema,
    auction: auctionFieldsSchema.partial().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.saveAsDraft) {
      return;
    }

    const result = auctionFieldsSchema.safeParse(data.auction);

    if (!result.success) {
      for (const issue of result.error.issues) {
        ctx.addIssue({
          ...issue,
          path: ['auction', ...issue.path],
        });
      }
      return;
    }

    if (result.data.endsAt <= result.data.startsAt) {
      ctx.addIssue({
        code: 'custom',
        message: 'End date must be after start date',
        path: ['auction', 'endsAt'],
      });
    }
  });

export type CreateAuctionWithVehicleInput = z.infer<
  typeof createAuctionWithVehicleSchema
>;
