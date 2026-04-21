import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FavoriteService } from './favorite.service';

@ApiTags('Favorite')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('favorite')
export class FavoriteController {
  constructor(private favoriteService: FavoriteService) {}

  @Get()
  @ApiOperation({ summary: 'Get my favorite actors' })
  getMyFavorites(@Request() req: any) {
    return this.favoriteService.getMyFavorites(req.user.id);
  }

  @Post(':actId')
  @ApiOperation({ summary: 'Add actor to favorites' })
  add(@Param('actId', ParseIntPipe) actId: number, @Request() req: any) {
    return this.favoriteService.add(req.user.id, actId, req.user.username);
  }

  @Delete(':actId')
  @ApiOperation({ summary: 'Remove actor from favorites' })
  remove(@Param('actId', ParseIntPipe) actId: number, @Request() req: any) {
    return this.favoriteService.remove(req.user.id, actId);
  }
}
