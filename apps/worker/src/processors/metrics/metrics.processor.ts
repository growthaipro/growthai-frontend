import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { Platform } from '@admatrix/shared-types';

@Processor('metrics')
export class MetricsProcessor extends WorkerHost {
  private readonly logger = new Logger(MetricsProcessor.name);

  async process(job: Job) {
    this.logger.log(`Processing job: ${job.name} [${job.id}]`);

    switch (job.name) {
      case 'metrics.ingest':
        return this.ingestMetrics(job);
      default:
        this.logger.warn(`Unknown job type: ${job.name}`);
    }
  }

  private async ingestMetrics(job: Job) {
    const { platform, payload } = job.data;

    // Step 1: Normalize platform-specific payload to internal format
    const normalized = this.normalizePayload(platform, payload);

    // Step 2: Find internal campaign by external ID
    // (In production: query DB for externalId mapping)
    this.logger.log(`Normalizing metrics from ${platform} for campaign ${payload.externalCampaignId}`);

    // Step 3: Store in campaign_metrics table
    // await this.prisma.campaignMetric.create({ data: normalized });

    // Step 4: Check if optimization should be triggered
    const shouldOptimize = this.checkOptimizationTrigger(normalized);
    if (shouldOptimize) {
      this.logger.log(`Optimization triggered for campaign ${payload.externalCampaignId}`);
      // await this.optimizationQueue.add('optimization.run', { campaignId: ... });
    }

    this.logger.log(`✅ Metrics ingested for ${platform} campaign ${payload.externalCampaignId}`);
    return { success: true, platform, normalized };
  }

  private normalizePayload(platform: Platform, payload: any) {
    // Normalize different platform schemas to internal format
    const base = {
      platform,
      timestamp: payload.timestamp || new Date().toISOString(),
      impressions: 0, clicks: 0, conversions: 0,
      spend: 0, revenue: 0,
    };

    switch (platform) {
      case Platform.META:
        return {
          ...base,
          impressions: payload.impressions ?? payload.reach ?? 0,
          clicks: payload.clicks ?? payload.link_clicks ?? 0,
          conversions: payload.conversions ?? payload.actions ?? 0,
          spend: parseFloat(payload.spend ?? '0'),
          revenue: parseFloat(payload.purchase_value ?? payload.revenue ?? '0'),
        };

      case Platform.GOOGLE:
        return {
          ...base,
          impressions: payload.metrics?.impressions ?? 0,
          clicks: payload.metrics?.clicks ?? 0,
          conversions: payload.metrics?.conversions ?? 0,
          spend: payload.metrics?.cost_micros ? payload.metrics.cost_micros / 1e6 : 0,
          revenue: payload.metrics?.conversions_value ?? 0,
        };

      case Platform.TIKTOK:
        return {
          ...base,
          impressions: payload.impression ?? 0,
          clicks: payload.click ?? 0,
          conversions: payload.conversion ?? 0,
          spend: parseFloat(payload.spend ?? '0'),
          revenue: parseFloat(payload.total_purchase_value ?? '0'),
        };

      default:
        return base;
    }
  }

  private checkOptimizationTrigger(metrics: any): boolean {
    const ctr = metrics.impressions > 0 ? (metrics.clicks / metrics.impressions) * 100 : 0;
    const roas = metrics.spend > 0 ? metrics.revenue / metrics.spend : 0;

    // Trigger optimization if CTR < 0.5% or ROAS < 1.0
    return ctr < 0.5 || roas < 1.0;
  }
}
