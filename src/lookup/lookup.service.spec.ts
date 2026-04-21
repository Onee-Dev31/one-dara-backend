import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../database/database.service';
import { LookupService } from './lookup.service';

const mockDb = { execute: jest.fn(), executeFirst: jest.fn() };

describe('LookupService', () => {
  let service: LookupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LookupService,
        { provide: DatabaseService, useValue: mockDb },
      ],
    }).compile();

    service = module.get<LookupService>(LookupService);
    jest.clearAllMocks();
  });

  // BE_UNDER
  describe('getBeUnders', () => {
    it('ดึง be-under ทั้งหมด', async () => {
      mockDb.execute.mockResolvedValue([{ ID: 1, BE_UNDER: 'GMM Grammy' }]);

      const result = await service.getBeUnders();

      expect(mockDb.execute).toHaveBeenCalledWith('sp_GetBeUnders');
      expect(result).toHaveLength(1);
    });
  });

  describe('createBeUnder', () => {
    it('สร้าง be-under — call SP ถูก', async () => {
      mockDb.executeFirst.mockResolvedValue({ ID: 1 });

      await service.createBeUnder({ beUnder: 'GMM Grammy' }, 'admin');

      expect(mockDb.executeFirst).toHaveBeenCalledWith('sp_CreateBeUnder', {
        BE_UNDER: 'GMM Grammy',
        CREATE_BY: 'admin',
      });
    });
  });

  describe('updateBeUnder', () => {
    it('แก้ไข be-under — call SP ถูก', async () => {
      mockDb.executeFirst.mockResolvedValue({ AffectedRows: 1 });

      await service.updateBeUnder(1, { beUnder: 'RS Promotion' }, 'admin');

      expect(mockDb.executeFirst).toHaveBeenCalledWith('sp_UpdateBeUnder', {
        ID: 1,
        BE_UNDER: 'RS Promotion',
        UPDATE_BY: 'admin',
      });
    });
  });

  describe('deleteBeUnder', () => {
    it('ลบ be-under — call SP ถูก', async () => {
      mockDb.executeFirst.mockResolvedValue({ AffectedRows: 1 });

      await service.deleteBeUnder(1, 'admin');

      expect(mockDb.executeFirst).toHaveBeenCalledWith('sp_DeleteBeUnder', {
        ID: 1,
        DELETE_BY: 'admin',
      });
    });
  });

  // TAG
  describe('getTags', () => {
    it('ดึง tag ทั้งหมด', async () => {
      mockDb.execute.mockResolvedValue([{ TAG_ID: 1, TAG_NAME: 'นักแสดงนำ' }]);

      const result = await service.getTags();

      expect(mockDb.execute).toHaveBeenCalledWith('sp_GetTags');
      expect(result).toHaveLength(1);
    });
  });

  describe('createTag', () => {
    it('สร้าง tag — call SP ถูก', async () => {
      mockDb.executeFirst.mockResolvedValue({ TAG_ID: 1 });

      await service.createTag({ tagName: 'นักแสดงนำ' }, 'admin');

      expect(mockDb.executeFirst).toHaveBeenCalledWith('sp_CreateTag', {
        TAG_NAME: 'นักแสดงนำ',
        CREATE_BY: 'admin',
      });
    });
  });

  describe('updateTag', () => {
    it('แก้ไข tag — call SP ถูก', async () => {
      mockDb.executeFirst.mockResolvedValue({ AffectedRows: 1 });

      await service.updateTag(1, { tagName: 'นักแสดงสมทบ' }, 'admin');

      expect(mockDb.executeFirst).toHaveBeenCalledWith('sp_UpdateTag', {
        TAG_ID: 1,
        TAG_NAME: 'นักแสดงสมทบ',
        UPDATE_BY: 'admin',
      });
    });
  });

  describe('deleteTag', () => {
    it('ลบ tag — call SP ถูก', async () => {
      mockDb.executeFirst.mockResolvedValue({ AffectedRows: 1 });

      await service.deleteTag(1, 'admin');

      expect(mockDb.executeFirst).toHaveBeenCalledWith('sp_DeleteTag', {
        TAG_ID: 1,
        DELETE_BY: 'admin',
      });
    });
  });
});
