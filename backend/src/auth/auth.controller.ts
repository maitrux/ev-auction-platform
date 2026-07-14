import { Body, Controller, Post, Res } from '@nestjs/common';
import express from 'express';
import { AuthService } from './auth.service';

interface LoginRequest {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: LoginRequest,
    @Res({ passthrough: true }) response: express.Response,
  ) {
    const result = await this.authService.login(body.email, body.password);

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
