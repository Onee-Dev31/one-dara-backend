import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class LogService {
  constructor(private db: DatabaseService) {}

  log(userId: number, description: string, actId?: number) {
    return this.db
      .executeFirst('sp_AddLog', {
        U_ID: userId,
        ACT_ID: actId ?? null,
        DESCRIPTION: description,
      })
      .catch(() => null); // ไม่ให้ log error ทำ request พัง
  }

  getAll() {
    return this.db.execute('sp_GetLogs');
  }

  getMy(userId: number) {
    return this.db.execute('sp_GetMyLogs', { U_ID: userId });
  }
}
