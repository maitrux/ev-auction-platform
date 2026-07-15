import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../common/constants/user-role';
import {
  createAuctionWithVehicleSchema,
  type CreateAuctionWithVehicleInput,
} from 'src/common/schemas/create-auction-with-vehicle.schema';
import {
  updateAuctionSchema,
  type UpdateAuctionInput,
} from 'src/common/schemas/update-auction.schema';
import { ZodValidationPipe } from 'src/common/zod-validation.pipe';
import { AuctionsService } from './auctions.service';

@Controller('auctions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.auctionsService.findAll();
  }

  @Get('open')
  @Roles(UserRole.DEALER)
  findOpenForDealer() {
    return this.auctionsService.findOpenForDealer();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.auctionsService.findOne(id);
  }

  @Post('with-vehicle')
  @Roles(UserRole.ADMIN)
  createWithVehicle(
    @Body(new ZodValidationPipe(createAuctionWithVehicleSchema))
    body: CreateAuctionWithVehicleInput,
  ) {
    return this.auctionsService.createWithVehicle(body);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateAuctionSchema)) body: UpdateAuctionInput,
  ) {
    return this.auctionsService.update(id, body);
  }
}
