import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { ValidateResponse } from '@egofm-reward/shared';

export const RequestUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest<Request>();
  return request.user as ValidateResponse;
});
