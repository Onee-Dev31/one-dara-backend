import { PartialType } from '@nestjs/swagger';
import { CreateDaraDto } from './create-dara.dto';

export class UpdateDaraDto extends PartialType(CreateDaraDto) {}
