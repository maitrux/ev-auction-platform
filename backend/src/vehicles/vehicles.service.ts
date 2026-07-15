import { Injectable } from '@nestjs/common';
import { CreateVehicleInput } from 'src/common/schemas/create-vehicle.schema';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.vehicle.findMany();
  }

  async create(input: CreateVehicleInput) {
    return this.prisma.vehicle.create({
      data: input,
    });
  }
}
