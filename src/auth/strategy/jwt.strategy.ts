import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') { //the key 'jwt' is used by "@UseGuards(AuthGuard('jwt'))"
  constructor(
    config: ConfigService,
    private prisma: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET')
    })
  }

  async validate(payload: {sub: number, email: string}) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub
      }
    })

    delete user.hash //! just a little hack

    return user //VERY INPORTANT NOTE: "user" is automatically added to the "req" propery,
                //it means we can access it by using
  }
}