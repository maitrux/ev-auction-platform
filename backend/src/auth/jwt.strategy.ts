import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtPayloadSchema } from '../common/schemas/auth.schema';
import { type AuthenticatedUser } from '../common/schemas/user.schema';
import { parseSchema } from '../common/utils/parse-schema';

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

  validate(payload: unknown): AuthenticatedUser {
    const { sub, email, role } = parseSchema(jwtPayloadSchema, payload);

    return {
      id: sub,
      email,
      role,
    };
  }
}
