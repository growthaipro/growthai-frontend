import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { BrevoService } from '@admatrix/integrations/src/brevo/brevo.service';
import { MetaService } from '@admatrix/integrations/src/meta/meta.service';
import { GoogleService } from '@admatrix/integrations/src/google/google.service';
import { TikTokService } from '@admatrix/integrations/src/tiktok/tiktok.service';
import { LinkedInService } from '@admatrix/integrations/src/linkedin/linkedin.service';
import { WhatsAppService } from '@admatrix/integrations/src/whatsapp/whatsapp.service';


@Processor('campaign')

export class CampaignProcessor extends WorkerHost {

  private logger = new Logger(CampaignProcessor.name);

  private brevo = new BrevoService();

  private meta = new MetaService();

  private google = new GoogleService();

  private tiktok = new TikTokService();

  private linkedin = new LinkedInService();

  private whatsapp = new WhatsAppService();



  async process(job: Job) {

    this.logger.log(`Processing ${job.name}`);

    switch (job.name) {

      case 'campaign.start':
        return this.startCampaign(job);

      case 'campaign.pause':
        return this.pauseCampaign(job);

    }

  }



  async startCampaign(job: Job) {

    const { campaignId, platform } = job.data;


    switch (platform) {

      case 'EMAIL':

        this.logger.log('Sending EMAIL');

        return this.brevo.createCampaign({

          name: `Campaign ${campaignId}`,

          subject: 'AdMatrix Email',

          htmlContent: '<h1>Hello from AdMatrix</h1>',

          listIds: [2]

        });



      case 'META':

        this.logger.log('Launching META Ad');

        return this.meta.createCampaign({

          name: `Campaign ${campaignId}`,

          budget: 100

        });



      case 'GOOGLE':

      case 'YOUTUBE':

        this.logger.log('Launching Google/YouTube Ad');

        return this.google.createCampaign({

          name: `Campaign ${campaignId}`,

          budget: 100

        });



      case 'TIKTOK':

        this.logger.log('Launching TikTok Ad');

        return this.tiktok.createCampaign({

          name: `Campaign ${campaignId}`,

          budget: 100

        });



      case 'LINKEDIN':

        this.logger.log('Launching LinkedIn Ad');

        return this.linkedin.createCampaign({

          name: `Campaign ${campaignId}`,

          budget: 100

        });



      case 'WHATSAPP':

        this.logger.log('Sending WhatsApp Campaign');

        return this.whatsapp.sendCampaign({

          name: `Campaign ${campaignId}`,

          message: 'Hello from AdMatrix'

        });



      default:

        throw new Error(`Unsupported platform ${platform}`);

    }

  }



  async pauseCampaign(job: Job) {

    const { campaignId, platform } = job.data;


    switch (platform) {

      case 'META':
        return this.meta.pauseCampaign(campaignId);

      case 'GOOGLE':
      case 'YOUTUBE':
        return this.google.pauseCampaign(campaignId);

      case 'TIKTOK':
        return this.tiktok.pauseCampaign(campaignId);

      case 'LINKEDIN':
        return this.linkedin.pauseCampaign(campaignId);

      default:
        return true;

    }

  }

}