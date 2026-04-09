import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class ShareChartDto {
  @ApiProperty({ example: 2, description: 'U_ID ของ user ที่จะแชร์ให้' })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiPropertyOptional({ example: '1', enum: ['0', '1'] })
  @IsOptional()
  @IsIn(['0', '1'])
  canView?: string;

  @ApiPropertyOptional({ example: '0', enum: ['0', '1'] })
  @IsOptional()
  @IsIn(['0', '1'])
  canEdit?: string;
}
