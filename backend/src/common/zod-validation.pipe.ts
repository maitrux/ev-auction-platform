import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { z, type ZodType } from 'zod';

@Injectable()
export class ZodValidationPipe<T extends ZodType>
  implements PipeTransform<unknown, z.infer<T>>
{
  constructor(private readonly schema: T) {}

  transform(value: unknown): z.infer<T> {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      throw new BadRequestException(z.treeifyError(result.error));
    }

    return result.data;
  }
}
