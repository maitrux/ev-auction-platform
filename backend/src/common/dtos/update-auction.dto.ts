import { createZodDto } from 'nestjs-zod';
import { updateAuctionOpenApiSchema } from '../schemas/openapi/update-auction.openapi.schema';

export class UpdateAuctionDto extends createZodDto(updateAuctionOpenApiSchema) {}
