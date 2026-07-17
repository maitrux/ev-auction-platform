import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/common/constants/user-role';
import {
  createBidSchema,
  type CreateBidInput,
} from 'src/common/schemas/create-bid.schema';
import type { AuthenticatedRequest } from 'src/common/types/authenticated-request';
import { ZodValidationPipe } from 'src/common/zod-validation.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { CreatedBid } from './bid.types';
import { BidsService } from './bids.service';

@ApiTags('bids')
@ApiCookieAuth('access_token')
@Controller('bids')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DEALER)
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Get('me')
  @ApiOperation({ summary: 'List bids placed by the current dealer' })
  @ApiResponse({ status: 200, description: 'Bid list' })
  getMyBids(@Req() request: AuthenticatedRequest) {
    return this.bidsService.findByDealer(request.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Place a bid on an auction' })
  @ApiResponse({ status: 201, description: 'Bid created' })
  @ApiResponse({ status: 400, description: 'Invalid request body' })
  create(
    @Req() request: AuthenticatedRequest,
    @Body(new ZodValidationPipe(createBidSchema)) body: CreateBidInput,
  ): Promise<CreatedBid> {
    return this.bidsService.create(request.user.id, body);
  }
}
