import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import express from 'express';
import { loginSchema } from '../common/schemas/auth.schema';
import { parseSchema } from '../common/utils/parse-schema';
import { AuthService } from './auth.service';

// Excluded from Swagger because authentication relies on an httpOnly cookie.
// Login is performed through the application UI, not Swagger.
@ApiExcludeController()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: unknown,
    @Res({ passthrough: true }) response: express.Response,
  ) {
    const { email, password } = parseSchema(loginSchema, body);
    const result = await this.authService.login(email, password);

    response.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return {
      user: result.user,
      accessToken: result.accessToken,
    };
  }
}
