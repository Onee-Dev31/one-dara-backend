import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../database/database.service';
import { LogService } from './log.service';

const mockDb = { execute: jest.fn(), executeFirst: jest.fn() };

describe('LogService', () => {
  let service: LogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogService, { provide: DatabaseService, useValue: mockDb }],
    }).compile();

    service = module.get<LogService>(LogService);
    jest.clearAllMocks();
  });

  describe('log', () => {
    it('บันทึก log — call SP ถูก param', async () => {
      mockDb.executeFirst.mockResolvedValue(null);

      await service.log(1, 'เพิ่มนักแสดง', 5);

      expect(mockDb.executeFirst).toHaveBeenCalledWith('sp_AddLog', {
        U_ID: 1,
        ACT_ID: 5,
        DESCRIPTION: 'เพิ่มนักแสดง',
      });
    });

    it('บันทึก log — ไม่มี actId', async () => {
      mockDb.executeFirst.mockResolvedValue(null);

      await service.log(1, 'สร้าง Chart');

      expect(mockDb.executeFirst).toHaveBeenCalledWith('sp_AddLog', {
        U_ID: 1,
        ACT_ID: null,
        DESCRIPTION: 'สร้าง Chart',
      });
    });

    it('log error ไม่ทำให้ crash — กลืน exception', async () => {
      mockDb.executeFirst.mockRejectedValue(new Error('DB error'));

      await expect(service.log(1, 'test')).resolves.not.toThrow();
    });
  });

  describe('getAll', () => {
    it('ดึง log ทั้งหมด', async () => {
      mockDb.execute.mockResolvedValue([{ LOG_ID: 1 }, { LOG_ID: 2 }]);

      const result = await service.getAll();

      expect(mockDb.execute).toHaveBeenCalledWith('sp_GetLogs');
      expect(result).toHaveLength(2);
    });
  });

  describe('getMy', () => {
    it('ดึง log ของ user', async () => {
      mockDb.execute.mockResolvedValue([{ LOG_ID: 1 }]);

      const result = await service.getMy(1);

      expect(mockDb.execute).toHaveBeenCalledWith('sp_GetMyLogs', { U_ID: 1 });
      expect(result).toHaveLength(1);
    });
  });
});
