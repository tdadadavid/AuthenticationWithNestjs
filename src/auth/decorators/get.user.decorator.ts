import {createParamDecorator, ExecutionContext} from "@nestjs/common"

export const GetUser = createParamDecorator(
  (data: any | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return data ? req.user[data] : req.user;
  }
);