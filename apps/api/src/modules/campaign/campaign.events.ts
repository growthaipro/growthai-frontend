import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CampaignCreatedEvent, CampaignStartedEvent } from '@admatrix/shared-types';

@Injectable()
export class CampaignEvents {
  private readonly logger = new Logger(CampaignEvents.name);

  @OnEvent('campaign.created')
  handleCampaignCreated(event: CampaignCreatedEvent) {
    this.logger.log(`[EVENT] campaign.created → ${event.campaignId} on ${event.platform}`);
    // Could trigger: initial setup, notification, etc.
  }

  @OnEvent('campaign.started')
  handleCampaignStarted(event: CampaignStartedEvent) {
    this.logger.log(`[EVENT] campaign.started → ${event.campaignId}`);
  }

  @OnEvent('campaign.paused')
  handleCampaignPaused(payload: { campaignId: string }) {
    this.logger.log(`[EVENT] campaign.paused → ${payload.campaignId}`);
  }

  @OnEvent('campaign.deleted')
  handleCampaignDeleted(payload: { campaignId: string }) {
    this.logger.log(`[EVENT] campaign.deleted → ${payload.campaignId}`);
  }
}
