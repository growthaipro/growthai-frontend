"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobStatus = exports.UserRole = exports.OptimizationAction = exports.OptimizationMode = exports.CreativeType = exports.Platform = exports.CampaignObjective = exports.CampaignStatus = void 0;
var CampaignStatus;
(function (CampaignStatus) {
    CampaignStatus["DRAFT"] = "DRAFT";
    CampaignStatus["ACTIVE"] = "ACTIVE";
    CampaignStatus["PAUSED"] = "PAUSED";
    CampaignStatus["COMPLETED"] = "COMPLETED";
    CampaignStatus["ARCHIVED"] = "ARCHIVED";
})(CampaignStatus || (exports.CampaignStatus = CampaignStatus = {}));
var CampaignObjective;
(function (CampaignObjective) {
    CampaignObjective["CONVERSIONS"] = "CONVERSIONS";
    CampaignObjective["TRAFFIC"] = "TRAFFIC";
    CampaignObjective["REACH"] = "REACH";
    CampaignObjective["SALES"] = "SALES";
    CampaignObjective["AWARENESS"] = "AWARENESS";
    CampaignObjective["LEADS"] = "LEADS";
})(CampaignObjective || (exports.CampaignObjective = CampaignObjective = {}));
var Platform;
(function (Platform) {
    Platform["META"] = "META";
    Platform["GOOGLE"] = "GOOGLE";
    Platform["TIKTOK"] = "TIKTOK";
})(Platform || (exports.Platform = Platform = {}));
var CreativeType;
(function (CreativeType) {
    CreativeType["IMAGE"] = "IMAGE";
    CreativeType["VIDEO"] = "VIDEO";
    CreativeType["TEXT"] = "TEXT";
    CreativeType["CAROUSEL"] = "CAROUSEL";
})(CreativeType || (exports.CreativeType = CreativeType = {}));
var OptimizationMode;
(function (OptimizationMode) {
    OptimizationMode["MANUAL"] = "MANUAL";
    OptimizationMode["AI_ASSISTED"] = "AI_ASSISTED";
    OptimizationMode["FULLY_AUTOMATED"] = "FULLY_AUTOMATED";
})(OptimizationMode || (exports.OptimizationMode = OptimizationMode = {}));
var OptimizationAction;
(function (OptimizationAction) {
    OptimizationAction["PAUSE_CREATIVE"] = "PAUSE_CREATIVE";
    OptimizationAction["INCREASE_BUDGET"] = "INCREASE_BUDGET";
    OptimizationAction["DECREASE_BUDGET"] = "DECREASE_BUDGET";
    OptimizationAction["DUPLICATE_ADSET"] = "DUPLICATE_ADSET";
    OptimizationAction["NOTIFY_USER"] = "NOTIFY_USER";
    OptimizationAction["GENERATE_CREATIVE"] = "GENERATE_CREATIVE";
})(OptimizationAction || (exports.OptimizationAction = OptimizationAction = {}));
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    UserRole["ORG_ADMIN"] = "ORG_ADMIN";
    UserRole["MANAGER"] = "MANAGER";
    UserRole["ANALYST"] = "ANALYST";
    UserRole["VIEWER"] = "VIEWER";
})(UserRole || (exports.UserRole = UserRole = {}));
var JobStatus;
(function (JobStatus) {
    JobStatus["WAITING"] = "WAITING";
    JobStatus["ACTIVE"] = "ACTIVE";
    JobStatus["COMPLETED"] = "COMPLETED";
    JobStatus["FAILED"] = "FAILED";
    JobStatus["DELAYED"] = "DELAYED";
})(JobStatus || (exports.JobStatus = JobStatus = {}));
//# sourceMappingURL=index.js.map