import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private db: DatabaseService) {}

  getAll() {
    return this.db.execute('sp_GetUsers');
  }

  async getById(id: number) {
    const user = await this.db.executeFirst('sp_GetUserById', { U_ID: id });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  create(dto: CreateUserDto, createdBy: string) {
    return this.db.executeFirst('sp_CreateUser', {
      U_NAME:    dto.username,
      U_PASS:    dto.password,
      U_ROLE:    dto.role,
      U_EMAIL:   dto.email,
      CREATE_BY: createdBy,
    });
  }

  async update(id: number, dto: UpdateUserDto, updatedBy: string) {
    await this.getById(id);
    return this.db.executeFirst('sp_UpdateUser', {
      U_ID:      id,
      U_ROLE:    dto.role,
      U_EMAIL:   dto.email,
      UPDATE_BY: updatedBy,
    });
  }

  async remove(id: number, deletedBy: string) {
    await this.getById(id);
    return this.db.executeFirst('sp_DeleteUser', {
      U_ID:      id,
      DELETE_BY: deletedBy,
    });
  }

  async resetPassword(id: number, dto: ResetPasswordDto, updatedBy: string) {
    await this.getById(id);
    return this.db.executeFirst('sp_ResetPassword', {
      U_ID:      id,
      NEW_PASS:  dto.newPassword,
      UPDATE_BY: updatedBy,
    });
  }
}
