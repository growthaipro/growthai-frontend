import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('creative')
export class CreativeProcessor extends WorkerHost {
  private readonly logger = new Logger(CreativeProcessor.name);

  async process(job: Job) {
    this.logger.log(`Processing creative job: ${job.name} [${job.id}]`);

    switch (job.name) {
      case 'creative.generate':
        return this.generateCreative(job);
      case 'creative.score':
        return this.scoreCreative(job);
      default:
        this.logger.warn(`Unknown job: ${job.name}`);
    }
  }

  private async generateCreative(job: Job) {
    const { campaignId, brief, type } = job.data;

    this.logger.log(`🎨 Generating AI creative for campaign ${campaignId}`);

    // In production: call OpenAI / DALL-E / internal AI service
    // const prompt = this.buildCreativePrompt(brief);
    // const image = await openai.images.generate({ prompt, size: '1024x1024' });

    await this.simulateDelay(2000);

    const creative = {
      campaignId,
      type: type || 'IMAGE',
      aiGenerated: true,
      headline: `Transform Your Business with AI`,
      description: `AI-generated creative for maximum engagement`,
      assetUrl: `https://placeholder.com/creative-${Date.now()}.jpg`,
      performanceScore: Math.floor(Math.random() * 30 + 70),
      generatedAt: new Date().toISOString(),
    };

    this.logger.log(`✅ Creative generated for campaign ${campaignId}`);
    return creative;
  }

  private async scoreCreative(job: Job) {
    const { creativeId, metrics } = job.data;
    this.logger.log(`📊 Scoring creative ${creativeId}`);

    const score = this.computeCreativeScore(metrics);
    return { creativeId, score };
  }

  private computeCreativeScore(metrics: any): number {
    if (!metrics) return 50;
    const { ctr = 0, conversionRate = 0, engagementRate = 0 } = metrics;
    return Math.min(100, Math.round(ctr * 20 + conversionRate * 30 + engagementRate * 10 + 40));
  }

  private simulateDelay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
