import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { Role, ValidateResponse } from '@egofm-reward/shared';

import { ROLES_KEY } from '../decorator/roles.decorator';

/**
 * Guard to check if the user has the required roles to access a route.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  /**
   * Constructor for RolesGuard.
   *
   * @param {Reflector} reflector - The reflector to access metadata set by decorators.
   */
  constructor(private reflector: Reflector) {}

  /**
   * Checks if the current request has the required roles to access the route.
   *
   * @param {ExecutionContext} context - The execution context containing the request and handler.
   * @returns {boolean} - Returns true if the user has one of the required roles, false otherwise.
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles: Array<Role> = this.reflector.getAllAndOverride<Array<Role>>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request: Request = context.switchToHttp().getRequest<Request>();
    const user = request.user as ValidateResponse;

    if (!user || !user.role) {
      return false;
    }

    return requiredRoles.includes(user.role);
  }
}
