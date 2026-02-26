import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { CampaignRepository } from './campaign.repository';
import { CreateCampaignDto, UpdateCampaignDto } from '@admatrix/shared-types';

@Injectable()
export class CampaignService {
  private readonly logger = new Logger(CampaignService.name);

  constructor(
    private readonly campaignRepo: CampaignRepository,
    private readonly eventEmitter: EventEmitter2,
    @InjectQueue('campaign') private readonly campaignQueue: Queue,
  ) {}

  async findAll(organizationId: string, query: any) {
    return this.campaignRepo.findAll(organizationId, query);
  }

  async findOne(id: string, organizationId: string) {
    const campaign = await this.campaignRepo.findOne(id, organizationId);
    if (!campaign) throw new NotFoundException(`Campaign ${id} not found`);
    return campaign;
  }

  async create(organizationId: string, dto: CreateCampaignDto) {
    const campaign = await this.campaignRepo.create(organizationId, dto);

    // Emit domain event
    this.eventEmitter.emit('campaign.created', {
      campaignId: campaign.id,
      organizationId,
      platform: campaign.platform,
    });

    this.logger.log(`Campaign created: ${campaign.id} for org ${organizationId}`);
    return campaign;
  }

  async update(id: string, organizationId: string, dto: UpdateCampaignDto) {
    await this.findOne(id, organizationId); // Assert exists + belongs to org
    await this.campaignRepo.update(id, organizationId, dto);
    return this.findOne(id, organizationId);
  }

  async start(id: string, organizationId: string) {
    const campaign = await this.findOne(id, organizationId);

    if (campaign.status !== 'DRAFT' && campaign.status !== 'PAUSED') {
      throw new ForbiddenException('Campaign cannot be started from current status');
    }

    // Async lifecycle — API does NOT directly call platform APIs
    // Instead: Update status → Emit event → Queue picks it up → Worker syncs with platform
    await this.campaignRepo.updateStatus(id, organizationId, 'ACTIVE');

    await this.campaignQueue.add('campaign.start', {
      campaignId: id,
      organizationId,
      platform: campaign.platform,
    }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    });

    this.eventEmitter.emit('campaign.started', { campaignId: id, organizationId });
    this.logger.log(`Campaign started (async): ${id}`);

    return { id, status: 'ACTIVE', message: 'Campaign start queued for processing' };
  }

  async pause(id: string, organizationId: string) {
    const campaign = await this.findOne(id, organizationId);

    if (campaign.status !== 'ACTIVE') {
      throw new ForbiddenException('Only active campaigns can be paused');
    }

    await this.campaignRepo.updateStatus(id, organizationId, 'PAUSED');

    await this.campaignQueue.add('campaign.pause', {
      campaignId: id,
      organizationId,
      platform: campaign.platform,
    });

    this.eventEmitter.emit('campaign.paused', { campaignId: id, organizationId });
    return { id, status: 'PAUSED' };
  }

  async delete(id: string, organizationId: string) {
    await this.findOne(id, organizationId);
    await this.campaignRepo.delete(id, organizationId);
    this.eventEmitter.emit('campaign.deleted', { campaignId: id, organizationId });
    return { deleted: true };
  }

  async getMetrics(id: string, organizationId: string, days: number = 7) {
    await this.findOne(id, organizationId);
    return this.campaignRepo.getMetricsSummary(id, organizationId, days);
  }
}
