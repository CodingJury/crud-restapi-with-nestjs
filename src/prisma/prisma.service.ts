import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient { //don't overlook "extends PrismaClient" part
  constructor() {
    super({
      datasources: {
        db: {
          url: 'postgresql://dev_db_user_dhananjay:dev_db_pass_123@localhost:5434/dev_db_nest?schema=public'
        }
      }
    })
  }
}