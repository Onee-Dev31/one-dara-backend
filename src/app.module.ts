import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DaraModule } from './dara/dara.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule, DaraModule],
})
export class AppModule {}
