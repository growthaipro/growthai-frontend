import { Queue } from 'bullmq';
import { WebhookMetricPayload, Platform } from '@admatrix/shared-types';
export declare class WebhookService {
    private readonly metricsQueue;
    private readonly logger;
    constructor(metricsQueue: Queue);
    ingestMetrics(platform: Platform, payload: WebhookMetricPayload): Promise<{
        queued: boolean;
        platform: Platform;
    }>;
}
