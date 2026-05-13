import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface JwtPayload {
  sub: string;
  login: string;
  role: string;
}

function isJwtPayload(payload: unknown): payload is JwtPayload {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'sub' in payload &&
    'login' in payload &&
    'role' in payload &&
    typeof (payload as Record<string, unknown>).sub === 'string' &&
    typeof (payload as Record<string, unknown>).login === 'string' &&
    typeof (payload as Record<string, unknown>).role === 'string'
  );
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    const secret = config.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT_SECRET is not set');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: unknown) {
    if (!isJwtPayload(payload)) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return { sub: payload.sub, login: payload.login, role: payload.role };
  }
}
