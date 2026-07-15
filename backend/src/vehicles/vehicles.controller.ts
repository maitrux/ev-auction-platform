import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../common/constants/user-role';
import { VehiclesService } from './vehicles.service';
import {
  createVehicleSchema,
  type CreateVehicleInput,
} from 'src/common/schemas/create-vehicle.schema';
import { ZodValidationPipe } from 'src/common/zod-validation.pipe';

@Controller('vehicles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.vehiclesService.findAll();
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(
    @Body(new ZodValidationPipe(createVehicleSchema))
    body: CreateVehicleInput,
  ) {
    return this.vehiclesService.create(body);
  }
}
