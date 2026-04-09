"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DaraService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DaraService = class DaraService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(search) {
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
    async findOne(id) {
        const dara = await this.prisma.daraInfo.findUnique({ where: { id } });
        if (!dara)
            throw new common_1.NotFoundException(`Dara #${id} not found`);
        return dara;
    }
    async create(dto) {
        return this.prisma.daraInfo.create({
            data: {
                ...dto,
                bDate: dto.bDate ? new Date(dto.bDate) : undefined,
            },
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.daraInfo.update({
            where: { id },
            data: {
                ...dto,
                bDate: dto.bDate ? new Date(dto.bDate) : undefined,
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.daraInfo.delete({ where: { id } });
    }
    async updatePhoto(id, filename) {
        await this.findOne(id);
        return this.prisma.daraInfo.update({
            where: { id },
            data: { photo: filename, photoStatus: 1 },
        });
    }
};
exports.DaraService = DaraService;
exports.DaraService = DaraService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DaraService);
//# sourceMappingURL=dara.service.js.map