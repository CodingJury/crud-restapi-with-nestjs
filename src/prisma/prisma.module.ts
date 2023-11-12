import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // <- it exports the "PrismaService" (mentioned in exports) globally so that every one can use it
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule {}
