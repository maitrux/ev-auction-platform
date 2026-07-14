import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(
    @Body() body: { email: string; password: string },
  ): Promise<Omit<User, 'passwordHash'> | UnauthorizedException> {
    return this.authService.login(body.email, body.password);
  }
}
