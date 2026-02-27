import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CreateCampaignDto, UpdateCampaignDto } from '@admatrix/shared-types';

@Injectable()
export class CampaignRepository {
  constructor(private readonly prisma: PrismaService) {}

  // AUTO-FILTERS BY ORG — Tenant isolation enforced at repository layer
  async findAll(organizationId: string, params?: { status?: string; platform?: string; page?: number; limit?: number }) {
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

  async findOne(id: string, organizationId: string) {
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

  async create(organizationId: string, dto: CreateCampaignDto) {
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

  async update(id: string, organizationId: string, dto: UpdateCampaignDto) {
    return this.prisma.campaign.updateMany({
      where: { id, organizationId },
      data: {
        ...dto,
        ...(dto.endAt && { endAt: new Date(dto.endAt) }),
        updatedAt: new Date(),
      },
    });
  }

  async updateStatus(id: string, organizationId: string, status: string) {
    return this.prisma.campaign.updateMany({
      where: { id, organizationId },
      data: { status, updatedAt: new Date() },
    });
  }

  async updateAiScore(id: string, score: number) {
    return this.prisma.campaign.update({
      where: { id },
      data: { aiScore: score },
    });
  }

  async delete(id: string, organizationId: string) {
    return this.prisma.campaign.deleteMany({
      where: { id, organizationId },
    });
  }

  async getMetricsSummary(campaignId: string, organizationId: string, days: number = 7) {
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
}
