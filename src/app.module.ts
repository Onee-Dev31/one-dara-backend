import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DaraModule } from './dara/dara.module';
import { DatabaseModule } from './database/database.module';
import { ChartModule } from './chart/chart.module';
import { FavoriteModule } from './favorite/favorite.module';
import { LogModule } from './log/log.module';
import { LookupModule } from './lookup/lookup.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [DatabaseModule, LogModule, AuthModule, DaraModule, LookupModule, UserModule, FavoriteModule, ChartModule],
})
export class AppModule {}
