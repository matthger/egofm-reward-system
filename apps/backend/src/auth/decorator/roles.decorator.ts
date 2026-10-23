import { CustomDecorator, SetMetadata } from '@nestjs/common';

import { Role } from '@egofm-reward/shared';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Array<Role>): CustomDecorator => SetMetadata(ROLES_KEY, roles);
