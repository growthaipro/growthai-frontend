import { Controller, Post, Body, Headers, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WebhookService } from './webhook.service';
import { Platform, WebhookMetricPayload } from '@admatrix/shared-types';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private readonly webhookService: WebhookService) {}

  @Post('meta')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Meta Ads webhook — metrics ingestion' })
  async metaWebhook(@Body() payload: any, @Headers() headers: any) {
    this.logger.log('Meta webhook received');
    return this.webhookService.ingestMetrics(Platform.META, payload);
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Google Ads webhook — metrics ingestion' })
  async googleWebhook(@Body() payload: any) {
    return this.webhookService.ingestMetrics(Platform.GOOGLE, payload);
  }

  @Post('tiktok')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'TikTok Ads webhook — metrics ingestion' })
  async tiktokWebhook(@Body() payload: any) {
    return this.webhookService.ingestMetrics(Platform.TIKTOK, payload);
  }
}
