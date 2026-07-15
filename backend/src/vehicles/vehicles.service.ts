import { Injectable } from '@nestjs/common';
import { CreateVehicleInput } from 'src/common/schemas/create-vehicle.schema';
import { throwIfDuplicateVin } from 'src/common/utils/prisma-errors';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.vehicle.findMany();
  }

  async create(input: CreateVehicleInput) {
    try {
      return await this.prisma.vehicle.create({
        data: input,
      });
    } catch (error) {
      throwIfDuplicateVin(error);
      throw error;
    }
  }
}
