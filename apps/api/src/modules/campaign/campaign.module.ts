import { Module } from '@nestjs/common';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';
import { CampaignRepository } from './campaign.repository';
import { CampaignEvents } from './campaign.events';
import { BullModule } from '@nestjs/bullmq';
@Module({
  imports: [
    BullModule.registerQueue({ name: 'campaign' }),
    BullModule.registerQueue({ name: 'metrics' }),
  ],
  controllers: [CampaignController],
  providers: [CampaignService, CampaignRepository, CampaignEvents],
  exports: [CampaignService, CampaignRepository],
})
export class CampaignModule {}
