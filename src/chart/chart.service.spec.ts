import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../database/database.service';
import { LogService } from '../log/log.service';
import { ChartService } from './chart.service';

const mockDb = { execute: jest.fn(), executeFirst: jest.fn() };
const mockLog = { log: jest.fn() };

const mockChart = { CHART_ID: 1, CHART_NAME: 'Chart A' };

describe('ChartService', () => {
  let service: ChartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChartService,
        { provide: DatabaseService, useValue: mockDb },
        { provide: LogService, useValue: mockLog },
      ],
    }).compile();

    service = module.get<ChartService>(ChartService);
    jest.clearAllMocks();
  });

  describe('getMyCharts', () => {
    it('ดึง chart ของ user', async () => {
      mockDb.execute.mockResolvedValue([mockChart]);

      const result = await service.getMyCharts(1);

      expect(mockDb.execute).toHaveBeenCalledWith('sp_GetMyCharts', { U_ID: 1 });
      expect(result).toHaveLength(1);
    });
  });

  describe('getById', () => {
    it('ดึง chart — พบ', async () => {
      mockDb.executeFirst.mockResolvedValue(mockChart);

      const result = await service.getById(1);

      expect(result).toEqual(mockChart);
    });

    it('ดึง chart — ไม่พบ → NotFoundException', async () => {
      mockDb.executeFirst.mockResolvedValue(null);

      await expect(service.getById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createChart', () => {
    it('สร้าง chart — call SP และ log', async () => {
      mockDb.executeFirst.mockResolvedValue({ CHART_ID: 1 });

      await service.createChart({ chartName: 'Chart ใหม่' }, 1, 'admin');

      expect(mockDb.executeFirst).toHaveBeenCalledWith('sp_CreateChart', {
        CHART_NAME: 'Chart ใหม่', CREATE_BY: 'admin',
      });
      expect(mockLog.log).toHaveBeenCalledWith(1, expect.stringContaining('Chart ใหม่'));
    });
  });

  describe('updateChart', () => {
    it('แก้ไข chart — call SP และ log', async () => {
      mockDb.executeFirst
        .mockResolvedValueOnce(mockChart)
        .mockResolvedValueOnce({ AffectedRows: 1 });

      await service.updateChart(1, { chartName: 'Chart แก้ไข' }, 1, 'admin');

      expect(mockDb.executeFirst).toHaveBeenNthCalledWith(2, 'sp_UpdateChart', {
        CHART_ID: 1, CHART_NAME: 'Chart แก้ไข', UPDATE_BY: 'admin',
      });
      expect(mockLog.log).toHaveBeenCalled();
    });

    it('แก้ไข chart — ไม่พบ → NotFoundException', async () => {
      mockDb.executeFirst.mockResolvedValue(null);

      await expect(service.updateChart(999, { chartName: 'x' }, 1, 'admin'))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteChart', () => {
    it('ลบ chart — call SP และ log', async () => {
      mockDb.executeFirst
        .mockResolvedValueOnce(mockChart)
        .mockResolvedValueOnce({ AffectedRows: 1 });

      await service.deleteChart(1, 1, 'admin');

      expect(mockDb.executeFirst).toHaveBeenNthCalledWith(2, 'sp_DeleteChart', {
        CHART_ID: 1, DELETE_BY: 'admin',
      });
    });

    it('ลบ chart — ไม่พบ → NotFoundException', async () => {
      mockDb.executeFirst.mockResolvedValue(null);

      await expect(service.deleteChart(999, 1, 'admin')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getOptions', () => {
    it('ดึง option ของ chart', async () => {
      mockDb.execute.mockResolvedValue([{ OPTION_ID: 1 }]);

      const result = await service.getOptions(1);

      expect(mockDb.execute).toHaveBeenCalledWith('sp_GetChartOptions', { CHART_ID: 1 });
      expect(result).toHaveLength(1);
    });
  });

  describe('addActor', () => {
    it('เพิ่มนักแสดงใน option — call SP และ log', async () => {
      mockDb.executeFirst.mockResolvedValue({ OPTACT_ID: 1 });

      const dto = { actId: 5, acting: 'นักแสดงนำ', rowNo: 1, seqNo: 1 } as any;
      await service.addActor(2, dto, 1, 'admin');

      expect(mockDb.executeFirst).toHaveBeenCalledWith('sp_AddActorToOption', expect.objectContaining({
        OPTION_ID: 2, ACT_ID: 5, ACTING: 'นักแสดงนำ',
      }));
      expect(mockLog.log).toHaveBeenCalledWith(1, expect.stringContaining('#5'), 5);
    });
  });

  describe('shareChart', () => {
    it('แชร์ option — ใช้ค่า default CAN_VIEW=1, CAN_EDIT=0', async () => {
      mockDb.executeFirst.mockResolvedValue({ AffectedRows: 1 });

      await service.shareChart(1, { userId: 2 }, 1, 'admin');

      expect(mockDb.executeFirst).toHaveBeenCalledWith('sp_ShareChart', {
        OPTION_ID: 1, U_ID: 2, CAN_VIEW: '1', CAN_EDIT: '0', CREATE_BY: 'admin',
      });
    });

    it('แชร์ option — กำหนด permission เอง', async () => {
      mockDb.executeFirst.mockResolvedValue({ AffectedRows: 1 });

      await service.shareChart(1, { userId: 2, canView: '1', canEdit: '1' }, 1, 'admin');

      expect(mockDb.executeFirst).toHaveBeenCalledWith('sp_ShareChart', expect.objectContaining({
        CAN_VIEW: '1', CAN_EDIT: '1',
      }));
    });
  });

  describe('getSharedCharts', () => {
    it('ดึง chart ที่แชร์ให้ user', async () => {
      mockDb.execute.mockResolvedValue([{ SHARE_ID: 1 }]);

      const result = await service.getSharedCharts(1);

      expect(mockDb.execute).toHaveBeenCalledWith('sp_GetSharedCharts', { U_ID: 1 });
      expect(result).toHaveLength(1);
    });
  });
});
