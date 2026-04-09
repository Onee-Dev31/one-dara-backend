import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../database/database.service';
import { LogService } from '../log/log.service';
import { FavoriteService } from './favorite.service';

const mockDb = { execute: jest.fn(), executeFirst: jest.fn() };
const mockLog = { log: jest.fn() };

describe('FavoriteService', () => {
  let service: FavoriteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoriteService,
        { provide: DatabaseService, useValue: mockDb },
        { provide: LogService, useValue: mockLog },
      ],
    }).compile();

    service = module.get<FavoriteService>(FavoriteService);
    jest.clearAllMocks();
  });

  describe('getMyFavorites', () => {
    it('ดึงรายการโปรดของ user', async () => {
      mockDb.execute.mockResolvedValue([{ ACT_ID: 1 }, { ACT_ID: 2 }]);

      const result = await service.getMyFavorites(1);

      expect(mockDb.execute).toHaveBeenCalledWith('sp_GetFavorites', { U_ID: 1 });
      expect(result).toHaveLength(2);
    });
  });

  describe('add', () => {
    it('เพิ่มโปรด — call SP และ log', async () => {
      mockDb.executeFirst.mockResolvedValue({ AffectedRows: 1 });

      await service.add(1, 5, 'user1');

      expect(mockDb.executeFirst).toHaveBeenCalledWith('sp_AddFavorite', {
        U_ID: 1, ACT_ID: 5, CREATE_BY: 'user1',
      });
      expect(mockLog.log).toHaveBeenCalledWith(1, expect.stringContaining('#5'), 5);
    });
  });

  describe('remove', () => {
    it('ลบโปรด — call SP และ log', async () => {
      mockDb.executeFirst.mockResolvedValue({ AffectedRows: 1 });

      await service.remove(1, 5);

      expect(mockDb.executeFirst).toHaveBeenCalledWith('sp_RemoveFavorite', {
        U_ID: 1, ACT_ID: 5,
      });
      expect(mockLog.log).toHaveBeenCalledWith(1, expect.stringContaining('#5'), 5);
    });
  });
});
