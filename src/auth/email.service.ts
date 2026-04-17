import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 25,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: { rejectUnauthorized: false },
    });
  }

  async sendResetPasswordEmail(toEmail: string, token: string) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await this.transporter.sendMail({
      from: `"${process.env.SMTP_SENDER_NAME}" <${process.env.SMTP_FROM}>`,
      to: toEmail,
      subject: 'รีเซ็ตรหัสผ่าน - One Dara',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
          <h2>รีเซ็ตรหัสผ่าน</h2>
          <p>คุณได้ขอรีเซ็ตรหัสผ่านสำหรับบัญชี One Dara</p>
          <p>กรุณาคลิกปุ่มด้านล่างภายใน <strong>15 นาที</strong></p>
          <a href="${resetUrl}"
             style="display:inline-block; padding:12px 24px; background:#1890ff;
                    color:#fff; text-decoration:none; border-radius:4px;">
            รีเซ็ตรหัสผ่าน
          </a>
          <p style="margin-top:16px; color:#888; font-size:12px;">
            หากคุณไม่ได้ทำรายการนี้ กรุณาละเว้นอีเมลนี้
          </p>
        </div>
      `,
    });

    this.logger.log(`Reset password email sent to ${toEmail}`);
  }
}
