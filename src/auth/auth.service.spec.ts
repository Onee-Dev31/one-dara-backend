import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../database/database.service';
import { AuthService } from './auth.service';
import { EmailService } from './email.service';

const mockDb = {
  executeFirst: jest.fn(),
};

const mockJwt = {
  sign: jest.fn().mockReturnValue('mock-token'),
};

const mockEmail = {
  sendPasswordResetEmail: jest.fn(),
};

const mockUser = {
  U_ID: 1,
  U_NAME: 'admin',
  U_PASS: 'password123',
  U_ROLE: 'admin',
  U_EMAIL: 'admin@example.com',
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: DatabaseService, useValue: mockDb },
        { provide: JwtService, useValue: mockJwt },
        { provide: EmailService, useValue: mockEmail },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('login สำเร็จ — คืน token และ user info', async () => {
      mockDb.executeFirst.mockResolvedValue(mockUser);

      const result = await service.login({
        username: 'admin',
        password: 'password123',
      });

      expect(mockDb.executeFirst).toHaveBeenCalledWith('sp_Login', {
        U_NAME: 'admin',
      });
      expect(mockJwt.sign).toHaveBeenCalledWith({
        sub: 1,
        username: 'admin',
        role: 'admin',
      });
      expect(result.access_token).toBe('mock-token');
      expect(result.user).toEqual({
        id: 1,
        username: 'admin',
        role: 'admin',
        email: 'admin@example.com',
      });
    });

    it('login — ไม่พบ user → UnauthorizedException', async () => {
      mockDb.executeFirst.mockResolvedValue(null);

      await expect(
        service.login({ username: 'noone', password: 'pass' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('login — password ผิด → UnauthorizedException', async () => {
      mockDb.executeFirst.mockResolvedValue(mockUser);

      await expect(
        service.login({ username: 'admin', password: 'wrongpass' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('login — ไม่ return password ออกไปใน response', async () => {
      mockDb.executeFirst.mockResolvedValue(mockUser);

      const result = await service.login({
        username: 'admin',
        password: 'password123',
      });

      expect(result.user).not.toHaveProperty('password');
      expect(result.user).not.toHaveProperty('U_PASS');
    });
  });
});
