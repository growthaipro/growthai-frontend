import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { WebhookMetricPayload, Platform } from '@admatrix/shared-types';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(@InjectQueue('metrics') private readonly metricsQueue: Queue) {}

  async ingestMetrics(platform: Platform, payload: WebhookMetricPayload) {
    this.logger.log(`Webhook received: ${platform} — campaign ${payload.externalCampaignId}`);

    // Push into queue — normalize and store asynchronously
    await this.metricsQueue.add(
      'metrics.ingest',
      { platform, payload, receivedAt: new Date().toISOString() },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    );

    return { queued: true, platform };
  }
}
