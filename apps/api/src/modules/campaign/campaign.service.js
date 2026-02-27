"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CampaignService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const campaign_repository_1 = require("./campaign.repository");
let CampaignService = CampaignService_1 = class CampaignService {
    constructor(campaignRepo, eventEmitter, campaignQueue) {
        this.campaignRepo = campaignRepo;
        this.eventEmitter = eventEmitter;
        this.campaignQueue = campaignQueue;
        this.logger = new common_1.Logger(CampaignService_1.name);
    }
    async findAll(organizationId, query) {
        return this.campaignRepo.findAll(organizationId, query);
    }
    async findOne(id, organizationId) {
        const campaign = await this.campaignRepo.findOne(id, organizationId);
        if (!campaign)
            throw new common_1.NotFoundException(`Campaign ${id} not found`);
        return campaign;
    }
    async create(organizationId, dto) {
        const campaign = await this.campaignRepo.create(organizationId, dto);
        this.eventEmitter.emit('campaign.created', {
            campaignId: campaign.id,
            organizationId,
            platform: campaign.platform,
        });
        this.logger.log(`Campaign created: ${campaign.id} for org ${organizationId}`);
        return campaign;
    }
    async update(id, organizationId, dto) {
        await this.findOne(id, organizationId);
        await this.campaignRepo.update(id, organizationId, dto);
        return this.findOne(id, organizationId);
    }
    async start(id, organizationId) {
        const campaign = await this.findOne(id, organizationId);
        if (campaign.status !== 'DRAFT' && campaign.status !== 'PAUSED') {
            throw new common_1.ForbiddenException('Campaign cannot be started from current status');
        }
        await this.campaignRepo.updateStatus(id, organizationId, 'ACTIVE');
        await this.campaignQueue.add('campaign.start', {
            campaignId: id,
            organizationId,
            platform: campaign.platform,
        }, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 2000 },
        });
        this.eventEmitter.emit('campaign.started', { campaignId: id, organizationId });
        this.logger.log(`Campaign started (async): ${id}`);
        return { id, status: 'ACTIVE', message: 'Campaign start queued for processing' };
    }
    async pause(id, organizationId) {
        const campaign = await this.findOne(id, organizationId);
        if (campaign.status !== 'ACTIVE') {
            throw new common_1.ForbiddenException('Only active campaigns can be paused');
        }
        await this.campaignRepo.updateStatus(id, organizationId, 'PAUSED');
        await this.campaignQueue.add('campaign.pause', {
            campaignId: id,
            organizationId,
            platform: campaign.platform,
        });
        this.eventEmitter.emit('campaign.paused', { campaignId: id, organizationId });
        return { id, status: 'PAUSED' };
    }
    async delete(id, organizationId) {
        await this.findOne(id, organizationId);
        await this.campaignRepo.delete(id, organizationId);
        this.eventEmitter.emit('campaign.deleted', { campaignId: id, organizationId });
        return { deleted: true };
    }
    async getMetrics(id, organizationId, days = 7) {
        await this.findOne(id, organizationId);
        return this.campaignRepo.getMetricsSummary(id, organizationId, days);
    }
};
exports.CampaignService = CampaignService;
exports.CampaignService = CampaignService = CampaignService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, bullmq_1.InjectQueue)('campaign')),
    __metadata("design:paramtypes", [campaign_repository_1.CampaignRepository,
        event_emitter_1.EventEmitter2,
        bullmq_2.Queue])
], CampaignService);
//# sourceMappingURL=campaign.service.js.map