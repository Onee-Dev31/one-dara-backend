import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChartDto {
  @ApiProperty({ example: 'Chart ละครเรื่องใหม่' })
  @IsString()
  @IsNotEmpty()
  chartName: string;
}
