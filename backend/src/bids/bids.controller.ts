import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';

import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/common/constants/user-role';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BidsService } from './bids.service';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: 'ADMIN' | 'DEALER';
  };
}

@Controller('bids')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DEALER)
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Get('me')
  getMyBids(@Req() request: AuthenticatedRequest) {
    return this.bidsService.findByDealer(request.user.id);
  }
}
