import { z } from 'zod';
import { openapiDateSchema } from './date.schema';

export const updateAuctionOpenApiSchema = z.object({
  status: z.enum(['CANCELED']).optional(),
  outcome: z.enum(['SOLD', 'UNSOLD']).optional(),
  startsAt: openapiDateSchema.optional(),
  endsAt: openapiDateSchema.optional(),
  reservePrice: z.number().positive().optional(),
  minIncrement: z.number().positive().optional(),
  publish: z.boolean().optional(),
});
