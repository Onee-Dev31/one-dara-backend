import { existsSync } from 'fs';
import { join, resolve } from 'path';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { LogService } from '../log/log.service';
import { CreateDaraDto } from './dto/create-dara.dto';
import { UpdateDaraDto } from './dto/update-dara.dto';

@Injectable()
export class DaraService {
  private readonly baseUrl = process.env.BASE_URL ?? 'http://localhost:3000';
  private readonly uploadsDir = resolve(process.env.UPLOAD_DIR ?? './uploads');

  constructor(
    private db: DatabaseService,
    private log: LogService,
  ) {}

  private resolvePhotoUrl(actor: any): any {
    const candidate = actor.IMAGE || `${actor.ACT_ID}.jpg`;
    const exists = existsSync(join(this.uploadsDir, candidate));
    const filename = exists ? candidate : 'no-photo.jpg';
    return { ...actor, PHOTO_URL: `${this.baseUrl}/uploads/${filename}` };
  }

  async findAll(search?: string, page = 1, pageSize = 20) {
    const rows = await this.db.execute('sp_GetActors', {
      Search: search ?? null,
      Page: page,
      PageSize: pageSize,
    });
    const total = rows[0]?.TOTAL_COUNT ?? 0;
    const data = rows.map((r: any) => this.resolvePhotoUrl(r));
    return { data, total, page, pageSize };
  }

  async findOne(id: number) {
    const actor = await this.db.executeFirst('sp_GetActorById', { ACT_ID: id });
    if (!actor) throw new NotFoundException(`Actor #${id} not found`);
    return this.resolvePhotoUrl(actor);
  }

  async create(dto: CreateDaraDto, userId: number, username: string) {
    const result = await this.db.executeFirst('sp_CreateActor', {
      F_NAME_TH: dto.nameTh,
      L_NAME_TH: dto.surnameTh,
      N_NAME_TH: dto.nicknameTh,
      F_NAME_EN: dto.nameEn,
      L_NAME_EN: dto.surnameEn,
      N_NAME_EN: dto.nicknameEn,
      DISPLAY_NAME: dto.displayName,
      B_DATE: dto.bDate ? new Date(dto.bDate) : null,
      SEX: dto.sex,
      BE_UNDER: dto.beUnder,
      ACTING: dto.acting,
      NOTE: dto.note,
      CREATE_BY: username,
    });
    this.log.log(
      userId,
      `เพิ่มนักแสดง: ${dto.displayName ?? dto.nameTh}`,
      result?.ACT_ID,
    );
    return result;
  }

  async update(
    id: number,
    dto: UpdateDaraDto,
    userId: number,
    username: string,
  ) {
    await this.findOne(id);
    const result = await this.db.executeFirst('sp_UpdateActor', {
      ACT_ID: id,
      F_NAME_TH: dto.nameTh,
      L_NAME_TH: dto.surnameTh,
      N_NAME_TH: dto.nicknameTh,
      F_NAME_EN: dto.nameEn,
      L_NAME_EN: dto.surnameEn,
      N_NAME_EN: dto.nicknameEn,
      DISPLAY_NAME: dto.displayName,
      B_DATE: dto.bDate ? new Date(dto.bDate) : null,
      SEX: dto.sex,
      BE_UNDER: dto.beUnder,
      ACTING: dto.acting,
      NOTE: dto.note,
      UPDATE_BY: username,
    });
    this.log.log(userId, `แก้ไขนักแสดง #${id}`, id);
    return result;
  }

  async remove(id: number, userId: number, username: string) {
    await this.findOne(id);
    const result = await this.db.executeFirst('sp_DeleteActor', {
      ACT_ID: id,
      DELETE_BY: username,
    });
    this.log.log(userId, `ลบนักแสดง #${id}`, id);
    return result;
  }

  async updatePhoto(
    id: number,
    filename: string,
    userId: number,
    username: string,
  ) {
    await this.findOne(id);
    const result = await this.db.executeFirst('sp_UpdateActorPhoto', {
      ACT_ID: id,
      IMAGE: filename,
      UPDATE_BY: username,
    });
    this.log.log(userId, `อัปเดตรูปนักแสดง #${id}`, id);
    return result;
  }
}
