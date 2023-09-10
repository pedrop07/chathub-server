import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { JwtValidatePayload } from '../models/JwtValidatePayload';
import { Request as RequestType } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extractJWTFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.refreshTokenSecret,
    });
  }

  private static extractJWTFromCookie(req: RequestType): string | null {
    console.log(req.cookies);
    if (req.cookies && req.cookies.refreshToken) {
      return req.cookies.refreshToken;
    }
    return null;
  }

  validate(payload: JwtValidatePayload) {
    return {
      userId: payload.sub,
      name: payload.name,
      email: payload.email,
    };
  }
}
