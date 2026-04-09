import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ActorResponseDto {
  @ApiProperty({ example: 1 })
  ACT_ID: number;

  @ApiPropertyOptional({ example: 'สมหญิง' })
  F_NAME_TH: string;

  @ApiPropertyOptional({ example: 'ใจดี' })
  L_NAME_TH: string;

  @ApiPropertyOptional({ example: 'หญิง' })
  N_NAME_TH: string;

  @ApiPropertyOptional({ example: 'สมหญิง ใจดี' })
  DISPLAY_NAME: string;

  @ApiPropertyOptional({ example: 'Somying' })
  F_NAME_EN: string;

  @ApiPropertyOptional({ example: 'Jaidee' })
  L_NAME_EN: string;

  @ApiPropertyOptional({ example: 'Ying' })
  N_NAME_EN: string;

  @ApiPropertyOptional({ example: '1995-05-15' })
  B_DATE: string;

  @ApiPropertyOptional({ example: 'F' })
  SEX: string;

  @ApiPropertyOptional({ example: 'GMM Grammy' })
  BE_UNDER: string;

  @ApiPropertyOptional({ example: 'นักแสดงนำ' })
  ACTING: string;

  @ApiPropertyOptional({ example: 'actor-1234567890.jpg' })
  IMAGE: string;

  @ApiPropertyOptional({ example: 'หมายเหตุ' })
  NOTE: string;

  @ApiProperty({ example: '0' })
  IS_DEL: string;

  @ApiPropertyOptional({ example: '2024-01-01T00:00:00.000Z' })
  CREATE_DATE: string;

  @ApiPropertyOptional({ example: 'admin' })
  CREATE_BY: string;
}
