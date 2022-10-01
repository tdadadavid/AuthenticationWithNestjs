import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private prismaService: PrismaService
    ){
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('ACCESS_TOKEN_SECRET')
    })
  }

  async validate(payload: {sub: number, email: string}){
    return await this.prismaService.user.findFirst({
      where: {
        id: payload.sub,
      },
      select:{
        id: true,
        firstname: true,
        email: true,
        createdAt: true
      }
    });
  }
}