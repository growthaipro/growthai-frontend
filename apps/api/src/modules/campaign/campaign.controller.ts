import {
  Controller, Get, Post, Put, Patch, Delete,
  Body, Param, Query, UseGuards, ParseUUIDPipe,
  HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CampaignService } from './campaign.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, OrgId } from '../../common/decorators/current-user.decorator';
import { CreateCampaignDto, UpdateCampaignDto } from '@admatrix/shared-types';

@ApiTags('campaigns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Get()
  @ApiOperation({ summary: 'List all campaigns for organization' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'platform', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@OrgId() orgId: string, @Query() query: any) {
    return this.campaignService.findAll(orgId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get campaign by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @OrgId() orgId: string) {
    return this.campaignService.findOne(id, orgId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new campaign' })
  create(@Body() dto: CreateCampaignDto, @OrgId() orgId: string) {
    return this.campaignService.create(orgId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update campaign' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
    @Body() dto: UpdateCampaignDto,
  ) {
    return this.campaignService.update(id, orgId, dto);
  }

  @Patch(':id/start')
  @ApiOperation({ summary: 'Start campaign (async — queued)' })
  start(@Param('id', ParseUUIDPipe) id: string, @OrgId() orgId: string) {
    return this.campaignService.start(id, orgId);
  }

  @Patch(':id/pause')
  @ApiOperation({ summary: 'Pause campaign (async — queued)' })
  pause(@Param('id', ParseUUIDPipe) id: string, @OrgId() orgId: string) {
    return this.campaignService.pause(id, orgId);
  }

  @Get(':id/metrics')
  @ApiOperation({ summary: 'Get campaign performance metrics' })
  @ApiQuery({ name: 'days', required: false, description: 'Number of days (default: 7)' })
  getMetrics(
    @Param('id', ParseUUIDPipe) id: string,
    @OrgId() orgId: string,
    @Query('days') days?: number,
  ) {
    return this.campaignService.getMetrics(id, orgId, days);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete campaign' })
  delete(@Param('id', ParseUUIDPipe) id: string, @OrgId() orgId: string) {
    return this.campaignService.delete(id, orgId);
  }
}
