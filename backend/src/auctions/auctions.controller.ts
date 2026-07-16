import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  createAuctionWithVehicleSchema,
  type CreateAuctionWithVehicleInput,
} from 'src/common/schemas/create-auction-with-vehicle.schema';
import {
  updateAuctionSchema,
  type UpdateAuctionInput,
} from 'src/common/schemas/update-auction.schema';
import type { AuthenticatedRequest } from 'src/common/types/authenticated-request';
import { ZodValidationPipe } from 'src/common/zod-validation.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../common/constants/user-role';
import { AuctionsService } from './auctions.service';

@ApiTags('auctions')
@ApiCookieAuth('access_token')
@ApiUnauthorizedResponse({ description: 'Not authenticated' })
@ApiForbiddenResponse({ description: 'Forbidden' })
@Controller('auctions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'List all auctions (admin)' })
  @ApiResponse({ status: 200, description: 'Auction list' })
  findAll() {
    return this.auctionsService.findAll();
  }

  // Static routes must be declared before /:id so "open" is not captured as an id.
  @Get('open')
  @Roles(UserRole.DEALER)
  @ApiOperation({ summary: 'List open auctions for the current dealer' })
  @ApiResponse({ status: 200, description: 'Open auction list' })
  findOpenForDealer(@Req() request: AuthenticatedRequest) {
    return this.auctionsService.findOpenForDealer(request.user.id);
  }

  @Get('open/:id')
  @Roles(UserRole.DEALER)
  @ApiOperation({ summary: 'Get an open auction by ID for the current dealer' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Auction details' })
  @ApiResponse({ status: 404, description: 'Auction not found' })
  findOneForDealer(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.auctionsService.findOneForDealer(id, request.user.id);
  }

  @Post('with-vehicle')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create an auction with a vehicle (admin)' })
  @ApiResponse({ status: 201, description: 'Auction created' })
  @ApiResponse({ status: 400, description: 'Invalid request body' })
  createWithVehicle(
    @Body(new ZodValidationPipe(createAuctionWithVehicleSchema))
    body: CreateAuctionWithVehicleInput,
  ) {
    return this.auctionsService.createWithVehicle(body);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get auction by ID (admin)' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Auction details' })
  @ApiResponse({ status: 404, description: 'Auction not found' })
  findOne(@Param('id') id: string) {
    return this.auctionsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update an auction (admin)' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Auction updated' })
  @ApiResponse({ status: 400, description: 'Invalid request body' })
  @ApiResponse({ status: 404, description: 'Auction not found' })
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateAuctionSchema)) body: UpdateAuctionInput,
  ) {
    return this.auctionsService.update(id, body);
  }
}
