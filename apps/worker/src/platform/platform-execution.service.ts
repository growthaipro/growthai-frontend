import { Logger } from '@nestjs/common';

import { MetaService } from '@admatrix/integrations/src/meta/meta.service';
import { GoogleService } from '@admatrix/integrations/src/google/google.service';

export class PlatformExecutionService {

  private logger = new Logger(PlatformExecutionService.name);

  private meta = new MetaService();

  private google = new GoogleService();


  async increaseBudget(platform: string, campaignId: string, percent: number) {

    this.logger.log(`Increasing ${platform} budget`);

    switch (platform) {

      case 'META':
        return this.meta.increaseBudget(campaignId, percent);

      case 'GOOGLE':
        return this.google.increaseBudget(campaignId, percent);

    }

  }


  async pauseCampaign(platform: string, campaignId: string) {

    this.logger.warn(`Pausing ${platform} campaign`);

    switch (platform) {

      case 'META':
        return this.meta.pauseCampaign(campaignId);

      case 'GOOGLE':
        return this.google.pauseCampaign(campaignId);

    }

  }

}