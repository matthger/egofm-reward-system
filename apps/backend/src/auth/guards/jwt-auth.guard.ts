import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

import { IS_PUBLIC_KEY } from '../decorator/public.decorator';

/**
 * The JwtAuthGuard class extends the NestJS AuthGuard for JWT authentication.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Constructor for JwtAuthGuard.
   *
   * @param {Reflector} reflector - The reflector to access metadata set by decorators.
   */
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Checks if the route is public or requires authentication.
   *
   * @param {ExecutionContext} context - The execution context containing the request and handler.
   * @returns {boolean | Promise<boolean> | Observable<boolean>} - Returns true if the route is public or if the user is authenticated.
   */
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic: boolean = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
