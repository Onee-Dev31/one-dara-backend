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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DaraService } from './dara.service';
import { CreateDaraDto } from './dto/create-dara.dto';
import { UpdateDaraDto } from './dto/update-dara.dto';

@ApiTags('Dara')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dara')
export class DaraController {
  constructor(private daraService: DaraService) {}

  @Get()
  @ApiOperation({ summary: 'Get all dara (with optional search)' })
  @ApiQuery({ name: 'search', required: false })
  findAll(@Query('search') search?: string) {
    return this.daraService.findAll(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get dara by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.daraService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new dara' })
  create(@Body() dto: CreateDaraDto) {
    return this.daraService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update dara by ID' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDaraDto) {
    return this.daraService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete dara by ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.daraService.remove(id);
  }

  @Post(':id/photo')
  @ApiOperation({ summary: 'Upload photo for dara' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, cb) => {
          const uniqueName = `dara-${Date.now()}${extname(file.originalname)}`;
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
  ) {
    return this.daraService.updatePhoto(id, file.filename);
  }
}
