import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './auth/auth.module';
import { DaraModule } from './dara/dara.module';
import { DatabaseModule } from './database/database.module';
import { ChartModule } from './chart/chart.module';
import { FavoriteModule } from './favorite/favorite.module';
import { LogModule } from './log/log.module';
import { LookupModule } from './lookup/lookup.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: { index: false },
    }),
    DatabaseModule,
    LogModule,
    AuthModule,
    DaraModule,
    LookupModule,
    UserModule,
    FavoriteModule,
    ChartModule,
  ],
})
export class AppModule {}
