import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { LogService } from './log.service';

@ApiTags('Log')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('log')
export class LogController {
  constructor(private logService: LogService) {}

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Get all logs [admin]' })
  getAll() {
    return this.logService.getAll();
  }

  @Get('me')
  @ApiOperation({ summary: 'Get my activity logs' })
  getMy(@Request() req: any) {
    return this.logService.getMy(req.user.id);
  }
}
