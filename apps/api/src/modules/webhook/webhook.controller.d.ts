import { WebhookService } from './webhook.service';
import { Platform } from '@admatrix/shared-types';
export declare class WebhookController {
    private readonly webhookService;
    private readonly logger;
    constructor(webhookService: WebhookService);
    metaWebhook(payload: any, headers: any): Promise<{
        queued: boolean;
        platform: Platform;
    }>;
    googleWebhook(payload: any): Promise<{
        queued: boolean;
        platform: Platform;
    }>;
    tiktokWebhook(payload: any): Promise<{
        queued: boolean;
        platform: Platform;
    }>;
}
