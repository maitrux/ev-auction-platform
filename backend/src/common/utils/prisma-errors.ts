import { BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

function getUniqueConstraintFields(
  error: Prisma.PrismaClientKnownRequestError,
): string[] {
  const target = error.meta?.target;

  if (Array.isArray(target)) {
    return target.filter((field): field is string => typeof field === 'string');
  }

  const constraint = error.meta?.constraint as
    | { fields?: string[] }
    | undefined;

  if (constraint?.fields?.length) {
    return constraint.fields;
  }

  const driverError = error.meta?.driverAdapterError as
    | { cause?: { constraint?: { fields?: string[] } } }
    | undefined;

  return driverError?.cause?.constraint?.fields ?? [];
}

function isDuplicateVehicleVin(
  error: Prisma.PrismaClientKnownRequestError,
): boolean {
  const fields = getUniqueConstraintFields(error);

  if (fields.includes('vin')) {
    return true;
  }

  return error.meta?.modelName === 'Vehicle';
}

export function throwIfDuplicateVin(error: unknown): void {
  if (
    !(error instanceof Prisma.PrismaClientKnownRequestError) ||
    error.code !== 'P2002'
  ) {
    return;
  }

  if (!isDuplicateVehicleVin(error)) {
    return;
  }

  throw new BadRequestException({
    properties: {
      vehicle: {
        properties: {
          vin: {
            errors: ['A vehicle with this VIN already exists'],
          },
        },
      },
    },
  });
}
