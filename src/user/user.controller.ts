import { User } from '@prisma/client';
import { JwtGuard } from './../auth/guard';
import { Controller, Get,UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {

  @Get('me')
  sendInfo(@GetUser() user: User) {
    return user;
  }

  
}
