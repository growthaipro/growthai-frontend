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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma/prisma.service");
let CampaignRepository = class CampaignRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(organizationId, params) {
        const { status, platform, page = 1, limit = 20 } = params || {};
        const skip = (page - 1) * limit;
        const where = {
            organizationId,
            ...(status && { status }),
            ...(platform && { platform }),
        };
        const [items, total] = await Promise.all([
            this.prisma.campaign.findMany({
                where,
                include: {
                    creatives: { select: { id: true, name: true, type: true, performanceScore: true, status: true } },
                    _count: { select: { metrics: true, optimizationLogs: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.campaign.count({ where }),
        ]);
        return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id, organizationId) {
        return this.prisma.campaign.findFirst({
            where: { id, organizationId },
            include: {
                creatives: true,
                metrics: {
                    orderBy: { timestamp: 'desc' },
                    take: 7,
                },
                optimizationLogs: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
            },
        });
    }
    async create(organizationId, dto) {
        return this.prisma.campaign.create({
            data: {
                organizationId,
                name: dto.name,
                objective: dto.objective,
                platform: dto.platform,
                budgetTotal: dto.budgetTotal,
                budgetDaily: dto.budgetDaily,
                optimizationMode: dto.optimizationMode,
                startAt: new Date(dto.startAt),
                endAt: dto.endAt ? new Date(dto.endAt) : null,
                status: 'DRAFT',
            },
        });
    }
    async update(id, organizationId, dto) {
        return this.prisma.campaign.updateMany({
            where: { id, organizationId },
            data: {
                ...dto,
                ...(dto.endAt && { endAt: new Date(dto.endAt) }),
                updatedAt: new Date(),
            },
        });
    }
    async updateStatus(id, organizationId, status) {
        return this.prisma.campaign.updateMany({
            where: { id, organizationId },
            data: { status, updatedAt: new Date() },
        });
    }
    async updateAiScore(id, score) {
        return this.prisma.campaign.update({
            where: { id },
            data: { aiScore: score },
        });
    }
    async delete(id, organizationId) {
        return this.prisma.campaign.deleteMany({
            where: { id, organizationId },
        });
    }
    async getMetricsSummary(campaignId, organizationId, days = 7) {
        const since = new Date();
        since.setDate(since.getDate() - days);
        return this.prisma.campaignMetric.findMany({
            where: {
                campaignId,
                campaign: { organizationId },
                timestamp: { gte: since },
            },
            orderBy: { timestamp: 'asc' },
        });
    }
};
exports.CampaignRepository = CampaignRepository;
exports.CampaignRepository = CampaignRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CampaignRepository);
//# sourceMappingURL=campaign.repository.js.map