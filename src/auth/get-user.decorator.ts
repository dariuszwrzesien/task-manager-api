import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';
import { Request } from 'express';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<Request & { user?: User }>();
    return request.user as User;
  },
);
