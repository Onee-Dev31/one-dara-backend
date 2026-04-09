import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBeUnderDto {
  @ApiProperty({ example: 'GMM Grammy' })
  @IsString()
  @IsNotEmpty()
  beUnder: string;
}
