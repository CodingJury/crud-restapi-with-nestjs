import { Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import { AuthDto } from "./dto"
import * as argon from "argon2"

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    //1. generate the passoword hash
    const hash = await argon.hash(dto.password)
    
    //2 .save the new user in the db
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash
      }
    })

    //3.return the saved user
    delete user.hash // little hack to prevent hash from exposed

    return user
  }

  signin() {
    return {msg: 'Signin'}
  }

}