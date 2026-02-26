import { CampaignStatus, CampaignObjective, Platform, OptimizationMode } from '@admatrix/shared-types';

export class CampaignEntity {
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

  // Domain logic
  canStart(): boolean {
    return this.status === CampaignStatus.DRAFT || this.status === CampaignStatus.PAUSED;
  }

  canPause(): boolean {
    return this.status === CampaignStatus.ACTIVE;
  }

  isAiManaged(): boolean {
    return this.optimizationMode !== OptimizationMode.MANUAL;
  }

  isFullyAutomated(): boolean {
    return this.optimizationMode === OptimizationMode.FULLY_AUTOMATED;
  }

  getDailyBudgetRemaining(spendToday: number): number {
    return Math.max(0, this.budgetDaily - spendToday);
  }
}
