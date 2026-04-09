import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.db.executeFirst<{
      U_ID: number;
      U_NAME: string;
      U_PASS: string;
      U_ROLE: string;
      U_EMAIL: string;
    }>('sp_Login', { U_NAME: dto.username });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.U_PASS !== dto.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.U_ID, username: user.U_NAME, role: user.U_ROLE };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.U_ID,
        username: user.U_NAME,
        role: user.U_ROLE,
        email: user.U_EMAIL,
      },
    };
  }
}
