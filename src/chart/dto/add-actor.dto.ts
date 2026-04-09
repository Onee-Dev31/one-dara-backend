import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddActorDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  actId: number;

  @ApiPropertyOptional({ example: 'นักแสดงนำ' })
  @IsOptional()
  @IsString()
  acting?: string;

  @ApiPropertyOptional({ example: 'สมหญิง ใจดี' })
  @IsOptional()
  @IsString()
  actName?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  rowNo?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  seqNo?: number;
}
