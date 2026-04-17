import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import { LoginDto } from './dto/login.dto';
import { EmailService } from './email.service';

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private jwtService: JwtService,
    private emailService: EmailService,
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
      console.log(`---`)
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

  async forgotPassword(email: string) {
    const result = await this.db.executeFirst<{ TOKEN: string | null }>(
      'sp_CreateResetToken',
      { U_EMAIL: email },
    );

    // ถ้าไม่เจอ email ก็ไม่ส่ง email แต่ตอบเหมือนกันเพื่อป้องกัน email enumeration
    if (result?.TOKEN) {
      await this.emailService.sendResetPasswordEmail(email, result.TOKEN);
    }

    return { message: 'If this email exists, a reset link has been sent.' };
  }

  async resetPassword(token: string, newPassword: string) {
    const result = await this.db.executeFirst<{ SUCCESS: number; REASON: string }>(
      'sp_UseResetToken',
      { TOKEN: token, NEW_PASS: newPassword },
    );

    if (!result || result.SUCCESS !== 1) {
      const messages: Record<string, string> = {
        TOKEN_NOT_FOUND:    'Invalid token',
        TOKEN_ALREADY_USED: 'Token has already been used',
        TOKEN_EXPIRED:      'Token has expired',
      };
      throw new BadRequestException(result?.REASON ? (messages[result.REASON] ?? 'Invalid token') : 'Invalid token');
    }

    return { message: 'Password reset successful' };
  }
}
