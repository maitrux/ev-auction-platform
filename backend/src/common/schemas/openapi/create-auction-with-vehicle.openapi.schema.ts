import { z } from 'zod';
import { openapiDateSchema } from './date.schema';
import { createVehicleOpenApiSchema } from './create-vehicle.openapi.schema';

const auctionFieldsOpenApiSchema = z.object({
  startsAt: openapiDateSchema,
  endsAt: openapiDateSchema,
  reservePrice: z.number().positive(),
  minIncrement: z.number().positive(),
});

export const createAuctionWithVehicleOpenApiSchema = z.object({
  saveAsDraft: z.boolean(),
  vehicle: createVehicleOpenApiSchema,
  auction: auctionFieldsOpenApiSchema.partial().optional(),
});
