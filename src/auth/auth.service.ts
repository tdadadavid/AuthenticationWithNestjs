import { ConfigService } from '@nestjs/config/dist';
import { AuthDto } from './dto/auth.dto';
import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtSerivce: JwtService,
    private readonly configSerivice: ConfigService
  ){}

  async signup(dto: AuthDto){
    try{
      // generate password hash
      const hash: string = await argon.hash(dto.password, {
        type: argon.argon2id
      });

      // save the user to the db
      const user = await this.prismaService.user.create({
        data: {
          email: dto.email,
          password: hash
        }
      });

      return this.signToken(user.id, user.email);
    }catch(err){
      if(err instanceof PrismaClientKnownRequestError){
        if(err.code === 'P2002'){
          throw new ForbiddenException("Duplicate Credentials");
        }
      }
      throw err;
    }

  }

  async signin(dto: AuthDto){
    // find the user by email
    const user = await this.prismaService.user.findUnique({
      where: { 
        email: dto.email
      }
    });

    // if user not found throw exception
    if(!user){
      throw new ForbiddenException("Credentials incorrect");
    }

    // compare passwords
    // if passwords dont match throw exception
    const passwordMathces = await argon.verify(user.password, dto.password);
    if(!passwordMathces){
      throw new ForbiddenException("Credentials incorrect");
    }

    // send back the user.
    return this.signToken(user.id, user.email);
  }


  private async signToken(id: number, email: string): Promise<{access_token: string}> {
    const payload = {id, email};

    const token = await this.jwtSerivce.signAsync(payload, {
      expiresIn: this.configSerivice.get('ACCESS_TOKEN_LIFESPAN'),
      secret: this.configSerivice.get('ACCESS_TOKEN_SECRET')
    });

    return {access_token: token}
  }
  
}