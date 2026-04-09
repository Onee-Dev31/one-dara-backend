import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsDateString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDaraDto {
  @ApiProperty({ example: 'สมหญิง' })
  @IsString()
  @IsNotEmpty()
  nameTh: string;

  @ApiPropertyOptional({ example: 'ใจดี' })
  @IsOptional()
  @IsString()
  surnameTh?: string;

  @ApiPropertyOptional({ example: 'หญิง' })
  @IsOptional()
  @IsString()
  nicknameTh?: string;

  @ApiPropertyOptional({ example: 'Somying' })
  @IsOptional()
  @IsString()
  nameEn?: string;

  @ApiPropertyOptional({ example: 'Ying' })
  @IsOptional()
  @IsString()
  nicknameEn?: string;

  @ApiPropertyOptional({ example: '1995-05-15' })
  @IsOptional()
  @IsDateString()
  bDate?: string;

  @ApiPropertyOptional({ example: 'หญิง' })
  @IsOptional()
  @IsString()
  sex?: string;

  @ApiPropertyOptional({ example: 'GMM Grammy' })
  @IsOptional()
  @IsString()
  actors?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  inhouse?: number;

  @ApiPropertyOptional({ example: 165 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  height?: number;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  weight?: number;

  @ApiPropertyOptional({ example: 'นักแสดงนำ' })
  @IsOptional()
  @IsString()
  acting?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  education?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  spacial?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sport?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  facebook?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  twitter?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ig?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pinterest?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  portfolio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  otherInfo?: string;
}
