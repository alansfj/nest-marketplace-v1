import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { IAuthUser } from 'src/types/auth-user.interface';

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IAuthUser => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
