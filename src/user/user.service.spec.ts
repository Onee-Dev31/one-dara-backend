import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../database/database.service';
import { UserService } from './user.service';

const mockDb = { execute: jest.fn(), executeFirst: jest.fn() };

const mockUser = {
  U_ID: 1,
  U_NAME: 'admin',
  U_ROLE: 'admin',
  U_EMAIL: 'admin@example.com',
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: DatabaseService, useValue: mockDb }],
    }).compile();

    service = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('ดึง user ทั้งหมด', async () => {
      mockDb.execute.mockResolvedValue([mockUser]);

      const result = await service.getAll();

      expect(mockDb.execute).toHaveBeenCalledWith('sp_GetUsers');
      expect(result).toHaveLength(1);
    });
  });

  describe('getById', () => {
    it('ดึง user รายคน — พบ', async () => {
      mockDb.executeFirst.mockResolvedValue(mockUser);

      const result = await service.getById(1);

      expect(mockDb.executeFirst).toHaveBeenCalledWith('sp_GetUserById', {
        U_ID: 1,
      });
      expect(result).toEqual(mockUser);
    });

    it('ดึง user รายคน — ไม่พบ → NotFoundException', async () => {
      mockDb.executeFirst.mockResolvedValue(null);

      await expect(service.getById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('สร้าง user — call SP ถูก param', async () => {
      mockDb.executeFirst.mockResolvedValue({ U_ID: 2 });

      const dto = {
        username: 'john',
        password: 'pass123',
        role: 'user',
        email: 'john@test.com',
      };
      const result = await service.create(dto, 'admin');

      expect(mockDb.executeFirst).toHaveBeenCalledWith('sp_CreateUser', {
        U_NAME: 'john',
        U_PASS: 'pass123',
        U_ROLE: 'user',
        U_EMAIL: 'john@test.com',
        CREATE_BY: 'admin',
      });
      expect(result).toEqual({ U_ID: 2 });
    });
  });

  describe('update', () => {
    it('แก้ไข user — call SP ถูก param', async () => {
      mockDb.executeFirst
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce({ AffectedRows: 1 });

      await service.update(
        1,
        { role: 'admin', email: 'new@test.com' },
        'superadmin',
      );

      expect(mockDb.executeFirst).toHaveBeenNthCalledWith(2, 'sp_UpdateUser', {
        U_ID: 1,
        U_ROLE: 'admin',
        U_EMAIL: 'new@test.com',
        UPDATE_BY: 'superadmin',
      });
    });

    it('แก้ไข user — ไม่พบ → NotFoundException', async () => {
      mockDb.executeFirst.mockResolvedValue(null);

      await expect(service.update(999, {}, 'admin')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('ลบ user — call SP ถูก', async () => {
      mockDb.executeFirst
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce({ AffectedRows: 1 });

      await service.remove(1, 'admin');

      expect(mockDb.executeFirst).toHaveBeenNthCalledWith(2, 'sp_DeleteUser', {
        U_ID: 1,
        DELETE_BY: 'admin',
      });
    });

    it('ลบ user — ไม่พบ → NotFoundException', async () => {
      mockDb.executeFirst.mockResolvedValue(null);

      await expect(service.remove(999, 'admin')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('resetPassword', () => {
    it('reset password — call SP ถูก', async () => {
      mockDb.executeFirst
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce({ AffectedRows: 1 });

      await service.resetPassword(1, { newPassword: 'newpass123' }, 'admin');

      expect(mockDb.executeFirst).toHaveBeenNthCalledWith(
        2,
        'sp_ResetPassword',
        {
          U_ID: 1,
          NEW_PASS: 'newpass123',
          UPDATE_BY: 'admin',
        },
      );
    });

    it('reset password — ไม่พบ user → NotFoundException', async () => {
      mockDb.executeFirst.mockResolvedValue(null);

      await expect(
        service.resetPassword(999, { newPassword: 'x' }, 'admin'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
