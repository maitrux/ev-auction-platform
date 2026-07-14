import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  id: string;
  email: string;
  role: 'ADMIN' | 'DEALER';
  name: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginRequest): Promise<LoginResponse> {
    return this.authService.login(body.email, body.password);
  }
}
