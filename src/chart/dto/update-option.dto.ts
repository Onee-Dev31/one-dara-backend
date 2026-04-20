import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateOptionDto {
  @ApiProperty({ example: 'Option A' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  optionName: string;
}
