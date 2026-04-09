import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { LogService } from '../log/log.service';

@Injectable()
export class FavoriteService {
  constructor(
    private db: DatabaseService,
    private log: LogService,
  ) {}

  getMyFavorites(userId: number) {
    return this.db.execute('sp_GetFavorites', { U_ID: userId });
  }

  async add(userId: number, actId: number, username: string) {
    const result = await this.db.executeFirst('sp_AddFavorite', {
      U_ID:      userId,
      ACT_ID:    actId,
      CREATE_BY: username,
    });
    this.log.log(userId, `เพิ่มนักแสดง #${actId} เป็นโปรด`, actId);
    return result;
  }

  async remove(userId: number, actId: number) {
    const result = await this.db.executeFirst('sp_RemoveFavorite', {
      U_ID:   userId,
      ACT_ID: actId,
    });
    this.log.log(userId, `ลบนักแสดง #${actId} ออกจากโปรด`, actId);
    return result;
  }
}
