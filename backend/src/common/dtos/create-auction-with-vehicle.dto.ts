import { createZodDto } from 'nestjs-zod';
import { createAuctionWithVehicleOpenApiSchema } from '../schemas/openapi/create-auction-with-vehicle.openapi.schema';

export class CreateAuctionWithVehicleDto extends createZodDto(
  createAuctionWithVehicleOpenApiSchema,
) {}
