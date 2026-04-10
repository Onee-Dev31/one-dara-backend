import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiErrorResponse } from '../common/dto/api-response.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { DaraService } from './dara.service';
import { ActorResponseDto } from './dto/actor-response.dto';
import { CreateDaraDto } from './dto/create-dara.dto';
import { UpdateDaraDto } from './dto/update-dara.dto';

@ApiTags('Dara')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dara')
export class DaraController {
  constructor(private daraService: DaraService) {}

  @Get()
  @ApiOperation({ summary: 'Get all actors (with optional search)' })
  @ApiQuery({ name: 'search', required: false, description: 'ค้นหาชื่อ/ชื่อเล่น' })
  @ApiQuery({ name: 'page', required: false, description: 'หน้าที่ต้องการ (default: 1)' })
  @ApiQuery({ name: 'pageSize', required: false, description: 'จำนวนต่อหน้า (default: 20)' })
  @ApiOkResponse({ type: [ActorResponseDto] })
  findAll(
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.daraService.findAll(search, page ? +page : 1, pageSize ? +pageSize : 20);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get actor by ID' })
  @ApiOkResponse({ type: ActorResponseDto })
  @ApiNotFoundResponse({ type: ApiErrorResponse, description: 'Actor not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.daraService.findOne(id);
  }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create new actor [admin]' })
  @ApiCreatedResponse({ type: ActorResponseDto })
  @ApiForbiddenResponse({ type: ApiErrorResponse, description: 'Permission denied' })
  create(@Body() dto: CreateDaraDto, @Request() req: any) {
    return this.daraService.create(dto, req.user.id, req.user.username);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update actor by ID [admin]' })
  @ApiOkResponse({ description: 'Updated successfully' })
  @ApiNotFoundResponse({ type: ApiErrorResponse, description: 'Actor not found' })
  @ApiForbiddenResponse({ type: ApiErrorResponse, description: 'Permission denied' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDaraDto, @Request() req: any) {
    return this.daraService.update(id, dto, req.user.id, req.user.username);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Soft delete actor by ID [admin]' })
  @ApiOkResponse({ description: 'Deleted successfully' })
  @ApiNotFoundResponse({ type: ApiErrorResponse, description: 'Actor not found' })
  @ApiForbiddenResponse({ type: ApiErrorResponse, description: 'Permission denied' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.daraService.remove(id, req.user.id, req.user.username);
  }

  @Post(':id/photo')
  @Roles('admin')
  @ApiOperation({ summary: 'Upload photo for actor [admin]' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @ApiOkResponse({ description: 'Photo uploaded successfully' })
  @ApiNotFoundResponse({ type: ApiErrorResponse, description: 'Actor not found' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const actId = (req as any).params?.id ?? Date.now();
          const uniqueName = `${actId}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (_, file, cb) => {
        const allowed = /jpg|jpeg|png|webp/;
        cb(null, allowed.test(extname(file.originalname).toLowerCase()));
      },
    }),
  )
  uploadPhoto(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    return this.daraService.updatePhoto(id, file.filename, req.user.id, req.user.username);
  }
}
