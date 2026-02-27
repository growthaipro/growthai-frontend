import { CampaignCreatedEvent, CampaignStartedEvent } from '@admatrix/shared-types';
export declare class CampaignEvents {
    private readonly logger;
    handleCampaignCreated(event: CampaignCreatedEvent): void;
    handleCampaignStarted(event: CampaignStartedEvent): void;
    handleCampaignPaused(payload: {
        campaignId: string;
    }): void;
    handleCampaignDeleted(payload: {
        campaignId: string;
    }): void;
}
