import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from 'src/types/auth/auth-user.type';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthUser => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
