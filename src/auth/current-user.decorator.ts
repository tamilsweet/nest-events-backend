import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// The @CurrentUser() decorator is a custom decorator that we will create to get the current user from the request object.
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user ?? null;
  },
);