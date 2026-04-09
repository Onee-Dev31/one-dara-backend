import { Module } from '@nestjs/common';
import { DaraController } from './dara.controller';
import { DaraService } from './dara.service';

@Module({
  controllers: [DaraController],
  providers: [DaraService],
})
export class DaraModule {}
