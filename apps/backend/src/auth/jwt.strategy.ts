import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload, ValidateResponse } from '@egofm-reward/shared';

/**
 * Strategy for validating JWT tokens.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Constructor for JwtStrategy.
   *
   * @param {ConfigService} configService - The configuration service to access environment variables.
   */
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') ?? '',
    });
  }

  /**
   * Validates the JWT payload and extracts user information.
   *
   * @param {JwtPayload} payload - The JWT payload containing user information.
   * @returns {ValidateResponse} - An object containing user ID, username, and role.
   */
  validate(payload: JwtPayload): ValidateResponse {
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
