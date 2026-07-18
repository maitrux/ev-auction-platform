import { createZodDto } from 'nestjs-zod';
import { createBidSchema } from '../schemas/create-bid.schema';

export class CreateBidDto extends createZodDto(createBidSchema) {}
