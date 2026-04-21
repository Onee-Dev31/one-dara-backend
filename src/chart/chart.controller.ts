import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChartService } from './chart.service';
import { AddActorDto } from './dto/add-actor.dto';
import { CreateChartDto } from './dto/create-chart.dto';
import { ShareChartDto } from './dto/share-chart.dto';
import { UpdateActorPositionDto } from './dto/update-actor-position.dto';
import { UpdateOptionDto } from './dto/update-option.dto';

@ApiTags('Chart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chart')
export class ChartController {
  constructor(private chartService: ChartService) {}

  @Get()
  @ApiOperation({ summary: 'Get my charts' })
  getMyCharts(@Request() req: any) {
    return this.chartService.getMyCharts(req.user.id);
  }

  @Get('shared')
  @ApiOperation({ summary: 'Get charts shared with me' })
  getSharedCharts(@Request() req: any) {
    return this.chartService.getSharedCharts(req.user.id);
  }

  @Get(':chartId')
  @ApiOperation({ summary: 'Get chart by ID' })
  getById(@Param('chartId', ParseIntPipe) chartId: number) {
    return this.chartService.getById(chartId);
  }

  @Post()
  @ApiOperation({ summary: 'Create chart' })
  createChart(@Body() dto: CreateChartDto, @Request() req: any) {
    return this.chartService.createChart(dto, req.user.id, req.user.username);
  }

  @Patch(':chartId')
  @ApiOperation({ summary: 'Update chart name' })
  updateChart(
    @Param('chartId', ParseIntPipe) chartId: number,
    @Body() dto: CreateChartDto,
    @Request() req: any,
  ) {
    return this.chartService.updateChart(
      chartId,
      dto,
      req.user.id,
      req.user.username,
    );
  }

  @Delete(':chartId')
  @ApiOperation({ summary: 'Delete chart' })
  deleteChart(
    @Param('chartId', ParseIntPipe) chartId: number,
    @Request() req: any,
  ) {
    return this.chartService.deleteChart(
      chartId,
      req.user.id,
      req.user.username,
    );
  }

  @Get(':chartId/option')
  @ApiOperation({ summary: 'Get options of a chart' })
  getOptions(@Param('chartId', ParseIntPipe) chartId: number) {
    return this.chartService.getOptions(chartId);
  }

  @Post(':chartId/option')
  @ApiOperation({ summary: 'Add option to chart' })
  createOption(
    @Param('chartId', ParseIntPipe) chartId: number,
    @Request() req: any,
  ) {
    return this.chartService.createOption(
      chartId,
      req.user.id,
      req.user.username,
    );
  }

  @Patch(':chartId/option/:optionId')
  @ApiOperation({ summary: 'Update option name' })
  updateOption(
    @Param('optionId', ParseIntPipe) optionId: number,
    @Body() dto: UpdateOptionDto,
    @Request() req: any,
  ) {
    return this.chartService.updateOption(
      optionId,
      dto,
      req.user.id,
      req.user.username,
    );
  }

  @Delete(':chartId/option/:optionId')
  @ApiOperation({ summary: 'Delete option from chart' })
  deleteOption(
    @Param('optionId', ParseIntPipe) optionId: number,
    @Request() req: any,
  ) {
    return this.chartService.deleteOption(
      optionId,
      req.user.id,
      req.user.username,
    );
  }

  @Get('option/:optionId/actor')
  @ApiOperation({ summary: 'Get actors in option' })
  getOptionActors(@Param('optionId', ParseIntPipe) optionId: number) {
    return this.chartService.getOptionActors(optionId);
  }

  @Post('option/:optionId/actor')
  @ApiOperation({ summary: 'Add actor to option' })
  addActor(
    @Param('optionId', ParseIntPipe) optionId: number,
    @Body() dto: AddActorDto,
    @Request() req: any,
  ) {
    return this.chartService.addActor(
      optionId,
      dto,
      req.user.id,
      req.user.username,
    );
  }

  @Patch('option/:optionId/actor/:optActId')
  @ApiOperation({ summary: 'Update actor position in option' })
  updateActorPosition(
    @Param('optActId', ParseIntPipe) optActId: number,
    @Body() dto: UpdateActorPositionDto,
    @Request() req: any,
  ) {
    return this.chartService.updateActorPosition(
      optActId,
      dto,
      req.user.id,
      req.user.username,
    );
  }

  @Delete('option/:optionId/actor/:optActId')
  @ApiOperation({ summary: 'Remove actor from option' })
  removeActor(
    @Param('optActId', ParseIntPipe) optActId: number,
    @Request() req: any,
  ) {
    return this.chartService.removeActor(
      optActId,
      req.user.id,
      req.user.username,
    );
  }

  @Post('option/:optionId/share')
  @ApiOperation({ summary: 'Share option with user' })
  shareChart(
    @Param('optionId', ParseIntPipe) optionId: number,
    @Body() dto: ShareChartDto,
    @Request() req: any,
  ) {
    return this.chartService.shareChart(
      optionId,
      dto,
      req.user.id,
      req.user.username,
    );
  }

  @Delete('share/:shareId')
  @ApiOperation({ summary: 'Unshare chart' })
  unshareChart(
    @Param('shareId', ParseIntPipe) shareId: number,
    @Request() req: any,
  ) {
    return this.chartService.unshareChart(
      shareId,
      req.user.id,
      req.user.username,
    );
  }
}
