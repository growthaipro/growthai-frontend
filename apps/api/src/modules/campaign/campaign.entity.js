"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignEntity = void 0;
const shared_types_1 = require("@admatrix/shared-types");
class CampaignEntity {
    canStart() {
        return this.status === shared_types_1.CampaignStatus.DRAFT || this.status === shared_types_1.CampaignStatus.PAUSED;
    }
    canPause() {
        return this.status === shared_types_1.CampaignStatus.ACTIVE;
    }
    isAiManaged() {
        return this.optimizationMode !== shared_types_1.OptimizationMode.MANUAL;
    }
    isFullyAutomated() {
        return this.optimizationMode === shared_types_1.OptimizationMode.FULLY_AUTOMATED;
    }
    getDailyBudgetRemaining(spendToday) {
        return Math.max(0, this.budgetDaily - spendToday);
    }
}
exports.CampaignEntity = CampaignEntity;
//# sourceMappingURL=campaign.entity.js.map