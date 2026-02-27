import { CampaignStatus, CampaignObjective, Platform, OptimizationMode } from '@admatrix/shared-types';
export declare class CampaignEntity {
    id: string;
    organizationId: string;
    name: string;
    objective: CampaignObjective;
    platform: Platform;
    status: CampaignStatus;
    budgetTotal: number;
    budgetDaily: number;
    optimizationMode: OptimizationMode;
    externalId?: string;
    aiScore?: number;
    startAt: Date;
    endAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    canStart(): boolean;
    canPause(): boolean;
    isAiManaged(): boolean;
    isFullyAutomated(): boolean;
    getDailyBudgetRemaining(spendToday: number): number;
}
