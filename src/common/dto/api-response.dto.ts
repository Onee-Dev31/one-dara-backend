import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorResponse {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: null, nullable: true })
  data: any;

  @ApiProperty({ example: 'error message' })
  message: string;
}
