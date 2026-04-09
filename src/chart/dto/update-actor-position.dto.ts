import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateActorPositionDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  rowNo?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  seqNo?: number;

  @ApiPropertyOptional({ example: 'นักแสดงนำ' })
  @IsOptional()
  @IsString()
  acting?: string;

  @ApiPropertyOptional({ example: 'สมหญิง ใจดี' })
  @IsOptional()
  @IsString()
  actName?: string;
}
