import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDaraDto } from './dto/create-dara.dto';
import { UpdateDaraDto } from './dto/update-dara.dto';

@Injectable()
export class DaraService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string) {
    return this.prisma.daraInfo.findMany({
      where: search
        ? {
            OR: [
              { nameTh: { contains: search } },
              { surnameTh: { contains: search } },
              { nicknameTh: { contains: search } },
              { nameEn: { contains: search } },
            ],
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const dara = await this.prisma.daraInfo.findUnique({ where: { id } });
    if (!dara) throw new NotFoundException(`Dara #${id} not found`);
    return dara;
  }

  async create(dto: CreateDaraDto) {
    return this.prisma.daraInfo.create({
      data: {
        ...dto,
        bDate: dto.bDate ? new Date(dto.bDate) : undefined,
      },
    });
  }

  async update(id: number, dto: UpdateDaraDto) {
    await this.findOne(id);
    return this.prisma.daraInfo.update({
      where: { id },
      data: {
        ...dto,
        bDate: dto.bDate ? new Date(dto.bDate) : undefined,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.daraInfo.delete({ where: { id } });
  }

  async updatePhoto(id: number, filename: string) {
    await this.findOne(id);
    return this.prisma.daraInfo.update({
      where: { id },
      data: { photo: filename, photoStatus: 1 },
    });
  }
}
