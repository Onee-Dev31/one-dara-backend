import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateBeUnderDto } from './dto/create-be-under.dto';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class LookupService {
  constructor(private db: DatabaseService) {}

  // BE_UNDER
  getBeUnders() {
    return this.db.execute('sp_GetBeUnders');
  }

  createBeUnder(dto: CreateBeUnderDto, createdBy: string) {
    return this.db.executeFirst('sp_CreateBeUnder', {
      BE_UNDER: dto.beUnder,
      CREATE_BY: createdBy,
    });
  }

  updateBeUnder(id: number, dto: CreateBeUnderDto, updatedBy: string) {
    return this.db.executeFirst('sp_UpdateBeUnder', {
      ID: id,
      BE_UNDER: dto.beUnder,
      UPDATE_BY: updatedBy,
    });
  }

  deleteBeUnder(id: number, deletedBy: string) {
    return this.db.executeFirst('sp_DeleteBeUnder', {
      ID: id,
      DELETE_BY: deletedBy,
    });
  }

  // TAG
  getTags() {
    return this.db.execute('sp_GetTags');
  }

  createTag(dto: CreateTagDto, createdBy: string) {
    return this.db.executeFirst('sp_CreateTag', {
      TAG_NAME: dto.tagName,
      CREATE_BY: createdBy,
    });
  }

  updateTag(id: number, dto: CreateTagDto, updatedBy: string) {
    return this.db.executeFirst('sp_UpdateTag', {
      TAG_ID: id,
      TAG_NAME: dto.tagName,
      UPDATE_BY: updatedBy,
    });
  }

  deleteTag(id: number, deletedBy: string) {
    return this.db.executeFirst('sp_DeleteTag', {
      TAG_ID: id,
      DELETE_BY: deletedBy,
    });
  }
}
