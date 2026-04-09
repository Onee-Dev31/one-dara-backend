import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

  @ApiPropertyOptional({ example: 'Jaidee' })
  @IsOptional()
  @IsString()
  surnameEn?: string;

  @ApiPropertyOptional({ example: 'Ying' })
  @IsOptional()
  @IsString()
  nicknameEn?: string;

  @ApiPropertyOptional({ example: 'สมหญิง ใจดี' })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional({ example: '1995-05-15' })
  @IsOptional()
  @IsDateString()
  bDate?: string;

  @ApiPropertyOptional({ example: 'F', description: 'M / F' })
  @IsOptional()
  @IsString()
  sex?: string;

  @ApiPropertyOptional({ example: 'GMM Grammy' })
  @IsOptional()
  @IsString()
  beUnder?: string;

  @ApiPropertyOptional({ example: 'นักแสดงนำ' })
  @IsOptional()
  @IsString()
  acting?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;
}
