import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { LogService } from '../log/log.service';
import { AddActorDto } from './dto/add-actor.dto';
import { CreateChartDto } from './dto/create-chart.dto';
import { ShareChartDto } from './dto/share-chart.dto';
import { UpdateActorPositionDto } from './dto/update-actor-position.dto';

@Injectable()
export class ChartService {
  constructor(
    private db: DatabaseService,
    private log: LogService,
  ) {}

  getMyCharts(userId: number) {
    return this.db.execute('sp_GetMyCharts', { U_ID: userId });
  }

  async getById(chartId: number) {
    const chart = await this.db.executeFirst('sp_GetChartById', { CHART_ID: chartId });
    if (!chart) throw new NotFoundException(`Chart #${chartId} not found`);
    return chart;
  }

  async createChart(dto: CreateChartDto, userId: number, username: string) {
    const result = await this.db.executeFirst('sp_CreateChart', {
      CHART_NAME: dto.chartName,
      CREATE_BY:  username,
    });
    this.log.log(userId, `สร้าง Chart: ${dto.chartName}`);
    return result;
  }

  async updateChart(chartId: number, dto: CreateChartDto, userId: number, username: string) {
    await this.getById(chartId);
    const result = await this.db.executeFirst('sp_UpdateChart', {
      CHART_ID:   chartId,
      CHART_NAME: dto.chartName,
      UPDATE_BY:  username,
    });
    this.log.log(userId, `แก้ไข Chart #${chartId}: ${dto.chartName}`);
    return result;
  }

  async deleteChart(chartId: number, userId: number, username: string) {
    await this.getById(chartId);
    const result = await this.db.executeFirst('sp_DeleteChart', {
      CHART_ID:  chartId,
      DELETE_BY: username,
    });
    this.log.log(userId, `ลบ Chart #${chartId}`);
    return result;
  }

  getOptions(chartId: number) {
    return this.db.execute('sp_GetChartOptions', { CHART_ID: chartId });
  }

  createOption(chartId: number, userId: number, username: string) {
    this.log.log(userId, `เพิ่ม Option ใน Chart #${chartId}`);
    return this.db.executeFirst('sp_CreateChartOption', {
      CHART_ID:  chartId,
      CREATE_BY: username,
    });
  }

  deleteOption(optionId: number, userId: number, username: string) {
    this.log.log(userId, `ลบ Option #${optionId}`);
    return this.db.executeFirst('sp_DeleteChartOption', {
      OPTION_ID: optionId,
      DELETE_BY: username,
    });
  }

  getOptionActors(optionId: number) {
    return this.db.execute('sp_GetOptionActors', { OPTION_ID: optionId });
  }

  async addActor(optionId: number, dto: AddActorDto, userId: number, username: string) {
    const result = await this.db.executeFirst('sp_AddActorToOption', {
      OPTION_ID: optionId,
      ACT_ID:    dto.actId,
      ACTING:    dto.acting,
      ACT_NAME:  dto.actName,
      ROW_NO:    dto.rowNo,
      SEQ_NO:    dto.seqNo,
      CREATE_BY: username,
    });
    this.log.log(userId, `เพิ่มนักแสดง #${dto.actId} ใน Option #${optionId}`, dto.actId);
    return result;
  }

  updateActorPosition(optActId: number, dto: UpdateActorPositionDto, userId: number, username: string) {
    this.log.log(userId, `ย้าย position นักแสดง #${optActId}`);
    return this.db.executeFirst('sp_UpdateActorPosition', {
      OPTACT_ID: optActId,
      ROW_NO:    dto.rowNo,
      SEQ_NO:    dto.seqNo,
      ACTING:    dto.acting,
      ACT_NAME:  dto.actName,
      UPDATE_BY: username,
    });
  }

  removeActor(optActId: number, userId: number, username: string) {
    this.log.log(userId, `ลบนักแสดงออกจาก Option (optActId: ${optActId})`);
    return this.db.executeFirst('sp_RemoveActorFromOption', {
      OPTACT_ID: optActId,
      DELETE_BY: username,
    });
  }

  getSharedCharts(userId: number) {
    return this.db.execute('sp_GetSharedCharts', { U_ID: userId });
  }

  async shareChart(optionId: number, dto: ShareChartDto, userId: number, username: string) {
    const result = await this.db.executeFirst('sp_ShareChart', {
      OPTION_ID: optionId,
      U_ID:      dto.userId,
      CAN_VIEW:  dto.canView ?? '1',
      CAN_EDIT:  dto.canEdit ?? '0',
      CREATE_BY: username,
    });
    this.log.log(userId, `แชร์ Option #${optionId} ให้ User #${dto.userId}`);
    return result;
  }

  unshareChart(shareId: number, userId: number, username: string) {
    this.log.log(userId, `ยกเลิกแชร์ #${shareId}`);
    return this.db.executeFirst('sp_UnshareChart', {
      SHARE_ID:  shareId,
      DELETE_BY: username,
    });
  }
}
