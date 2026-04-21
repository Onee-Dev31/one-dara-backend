import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../database/database.service';
import { LogService } from '../log/log.service';
import { DaraService } from './dara.service';

const mockDb = {
  execute: jest.fn(),
  executeFirst: jest.fn(),
};

const mockLog = {
  log: jest.fn(),
};

describe('DaraService', () => {
  let service: DaraService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DaraService,
        { provide: DatabaseService, useValue: mockDb },
        { provide: LogService, useValue: mockLog },
      ],
    }).compile();

    service = module.get<DaraService>(DaraService);
    jest.clearAllMocks();
  });

  // findAll
  describe('findAll', () => {
    it('ดึงรายการทั้งหมด — ไม่มี search', async () => {
      mockDb.execute.mockResolvedValue([{ ACT_ID: 1, F_NAME_TH: 'สมหญิง' }]);

      const result = await service.findAll();

      expect(mockDb.execute).toHaveBeenCalledWith('sp_GetActors', {
        Search: null,
      });
      expect(result).toHaveLength(1);
    });

    it('ดึงรายการ — มี search', async () => {
      mockDb.execute.mockResolvedValue([]);

      await service.findAll('สมหญิง');

      expect(mockDb.execute).toHaveBeenCalledWith('sp_GetActors', {
        Search: 'สมหญิง',
      });
    });
  });

  // findOne
  describe('findOne', () => {
    it('ดึงรายคน — พบข้อมูล', async () => {
      const actor = { ACT_ID: 1, F_NAME_TH: 'สมหญิง' };
      mockDb.executeFirst.mockResolvedValue(actor);

      const result = await service.findOne(1);

      expect(mockDb.executeFirst).toHaveBeenCalledWith('sp_GetActorById', {
        ACT_ID: 1,
      });
      expect(result).toEqual(actor);
    });

    it('ดึงรายคน — ไม่พบ → NotFoundException', async () => {
      mockDb.executeFirst.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  // create
  describe('create', () => {
    it('สร้างนักแสดง — call SP และ log', async () => {
      const newActor = { ACT_ID: 10 };
      mockDb.executeFirst.mockResolvedValue(newActor);

      const dto = { nameTh: 'สมหญิง', displayName: 'สมหญิง ใจดี' } as any;
      const result = await service.create(dto, 1, 'admin');

      expect(mockDb.executeFirst).toHaveBeenCalledWith(
        'sp_CreateActor',
        expect.objectContaining({
          F_NAME_TH: 'สมหญิง',
          CREATE_BY: 'admin',
        }),
      );
      expect(mockLog.log).toHaveBeenCalledWith(
        1,
        expect.stringContaining('เพิ่มนักแสดง'),
        10,
      );
      expect(result).toEqual(newActor);
    });
  });

  // update
  describe('update', () => {
    it('แก้ไขนักแสดง — call SP และ log', async () => {
      mockDb.executeFirst
        .mockResolvedValueOnce({ ACT_ID: 1 }) // findOne
        .mockResolvedValueOnce({ AffectedRows: 1 }); // update

      const dto = { nameTh: 'สมชาย' } as any;
      await service.update(1, dto, 2, 'admin');

      expect(mockDb.executeFirst).toHaveBeenNthCalledWith(
        2,
        'sp_UpdateActor',
        expect.objectContaining({
          ACT_ID: 1,
          F_NAME_TH: 'สมชาย',
          UPDATE_BY: 'admin',
        }),
      );
      expect(mockLog.log).toHaveBeenCalledWith(
        2,
        expect.stringContaining('#1'),
        1,
      );
    });

    it('แก้ไขนักแสดง — ไม่พบ → NotFoundException', async () => {
      mockDb.executeFirst.mockResolvedValue(null);

      await expect(service.update(999, {} as any, 1, 'admin')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // remove
  describe('remove', () => {
    it('ลบนักแสดง — call SP และ log', async () => {
      mockDb.executeFirst
        .mockResolvedValueOnce({ ACT_ID: 1 })
        .mockResolvedValueOnce({ AffectedRows: 1 });

      await service.remove(1, 1, 'admin');

      expect(mockDb.executeFirst).toHaveBeenNthCalledWith(2, 'sp_DeleteActor', {
        ACT_ID: 1,
        DELETE_BY: 'admin',
      });
      expect(mockLog.log).toHaveBeenCalledWith(
        1,
        expect.stringContaining('#1'),
        1,
      );
    });

    it('ลบนักแสดง — ไม่พบ → NotFoundException', async () => {
      mockDb.executeFirst.mockResolvedValue(null);

      await expect(service.remove(999, 1, 'admin')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // updatePhoto
  describe('updatePhoto', () => {
    it('อัปเดตรูป — call SP และ log', async () => {
      mockDb.executeFirst
        .mockResolvedValueOnce({ ACT_ID: 1 })
        .mockResolvedValueOnce({ AffectedRows: 1 });

      await service.updatePhoto(1, 'actor-123.jpg', 1, 'admin');

      expect(mockDb.executeFirst).toHaveBeenNthCalledWith(
        2,
        'sp_UpdateActorPhoto',
        {
          ACT_ID: 1,
          IMAGE: 'actor-123.jpg',
          UPDATE_BY: 'admin',
        },
      );
      expect(mockLog.log).toHaveBeenCalledWith(
        1,
        expect.stringContaining('#1'),
        1,
      );
    });
  });
});
