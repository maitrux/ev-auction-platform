import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface JwtPayload {
  sub: string;
  email: string;
  role: 'ADMIN' | 'DEALER';
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request): string | null => {
          const token = (request.cookies as Record<string, unknown> | undefined)
            ?.access_token;

          return typeof token === 'string' ? token : null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  validate(payload: JwtPayload): {
    id: string;
    email: string;
    role: 'ADMIN' | 'DEALER';
  } {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
