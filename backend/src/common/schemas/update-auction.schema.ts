import { z } from 'zod';

export const updateAuctionSchema = z
  .object({
    status: z.enum(['CANCELLED']).optional(),
    startsAt: z.coerce.date().optional(),
    endsAt: z.coerce.date().optional(),
    reservePrice: z.number().positive().optional(),
    minIncrement: z.number().positive().optional(),
    publish: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.publish) {
      if (!data.startsAt) {
        ctx.addIssue({
          code: 'custom',
          message: 'Start date is required to publish',
          path: ['startsAt'],
        });
      }

      if (!data.endsAt) {
        ctx.addIssue({
          code: 'custom',
          message: 'End date is required to publish',
          path: ['endsAt'],
        });
      }

      if (data.reservePrice === undefined) {
        ctx.addIssue({
          code: 'custom',
          message: 'Reserve price is required to publish',
          path: ['reservePrice'],
        });
      }

      if (data.minIncrement === undefined) {
        ctx.addIssue({
          code: 'custom',
          message: 'Minimum increment is required to publish',
          path: ['minIncrement'],
        });
      }
    }

    if (data.startsAt && data.endsAt && data.endsAt <= data.startsAt) {
      ctx.addIssue({
        code: 'custom',
        message: 'End date must be after start date',
        path: ['endsAt'],
      });
    }
  });

export type UpdateAuctionInput = z.infer<typeof updateAuctionSchema>;
