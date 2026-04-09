import { ApiProperty } from '@nestjs/swagger';

class LoginUserDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'admin' })
  username: string;

  @ApiProperty({ example: 'admin' })
  role: string;

  @ApiProperty({ example: 'admin@example.com' })
  email: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ type: LoginUserDto })
  user: LoginUserDto;
}
