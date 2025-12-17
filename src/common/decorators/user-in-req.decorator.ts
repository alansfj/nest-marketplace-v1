import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/entities/user.entity';

import { IAuthUser } from 'src/types/auth-user.interface';

export const UserInReq = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IAuthUser | User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
