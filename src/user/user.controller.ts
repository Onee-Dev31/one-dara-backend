import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles('admin')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users [admin]' })
  getAll() {
    return this.userService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID [admin]' })
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create user [admin]' })
  create(@Body() dto: CreateUserDto, @Request() req: any) {
    return this.userService.create(dto, req.user.username);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user role/email [admin]' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto, @Request() req: any) {
    return this.userService.update(id, dto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user [admin]' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.userService.remove(id, req.user.username);
  }

  @Post(':id/reset-password')
  @ApiOperation({ summary: 'Reset user password [admin]' })
  resetPassword(@Param('id', ParseIntPipe) id: number, @Body() dto: ResetPasswordDto, @Request() req: any) {
    return this.userService.resetPassword(id, dto, req.user.username);
  }
}
