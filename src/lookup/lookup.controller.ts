import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Request, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiErrorResponse } from '../common/dto/api-response.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateBeUnderDto } from './dto/create-be-under.dto';
import { CreateTagDto } from './dto/create-tag.dto';
import { LookupService } from './lookup.service';

@ApiTags('Lookup')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('lookup')
export class LookupController {
  constructor(private lookupService: LookupService) {}

  @Get('be-under')
  @ApiOperation({ summary: 'Get all be-under (สังกัด)' })
  @ApiOkResponse({ description: 'List of be-under', schema: { type: 'array', items: { properties: { ID: { type: 'number' }, BE_UNDER: { type: 'string' } } } } })
  getBeUnders() {
    return this.lookupService.getBeUnders();
  }

  @Post('be-under')
  @Roles('admin')
  @ApiOperation({ summary: 'Create be-under [admin]' })
  @ApiCreatedResponse({ description: 'Created', schema: { properties: { ID: { type: 'number' } } } })
  @ApiForbiddenResponse({ type: ApiErrorResponse })
  createBeUnder(@Body() dto: CreateBeUnderDto, @Request() req: any) {
    return this.lookupService.createBeUnder(dto, req.user.username);
  }

  @Put('be-under/:id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update be-under [admin]' })
  @ApiOkResponse({ description: 'Updated successfully' })
  @ApiForbiddenResponse({ type: ApiErrorResponse })
  updateBeUnder(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateBeUnderDto, @Request() req: any) {
    return this.lookupService.updateBeUnder(id, dto, req.user.username);
  }

  @Delete('be-under/:id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete be-under [admin]' })
  @ApiOkResponse({ description: 'Deleted successfully' })
  @ApiForbiddenResponse({ type: ApiErrorResponse })
  deleteBeUnder(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.lookupService.deleteBeUnder(id, req.user.username);
  }

  @Get('tag')
  @ApiOperation({ summary: 'Get all tags' })
  @ApiOkResponse({ description: 'List of tags', schema: { type: 'array', items: { properties: { TAG_ID: { type: 'number' }, TAG_NAME: { type: 'string' } } } } })
  getTags() {
    return this.lookupService.getTags();
  }

  @Post('tag')
  @Roles('admin')
  @ApiOperation({ summary: 'Create tag [admin]' })
  @ApiCreatedResponse({ description: 'Created', schema: { properties: { TAG_ID: { type: 'number' } } } })
  @ApiForbiddenResponse({ type: ApiErrorResponse })
  createTag(@Body() dto: CreateTagDto, @Request() req: any) {
    return this.lookupService.createTag(dto, req.user.username);
  }

  @Put('tag/:id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update tag [admin]' })
  @ApiOkResponse({ description: 'Updated successfully' })
  @ApiForbiddenResponse({ type: ApiErrorResponse })
  updateTag(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateTagDto, @Request() req: any) {
    return this.lookupService.updateTag(id, dto, req.user.username);
  }

  @Delete('tag/:id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete tag [admin]' })
  @ApiOkResponse({ description: 'Deleted successfully' })
  @ApiForbiddenResponse({ type: ApiErrorResponse })
  deleteTag(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.lookupService.deleteTag(id, req.user.username);
  }
}
