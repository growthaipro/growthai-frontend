import { PrismaService } from '../../database/prisma/prisma.service';
import { CreateCampaignDto, UpdateCampaignDto } from '@admatrix/shared-types';
export declare class CampaignRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(organizationId: string, params?: {
        status?: string;
        platform?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        items: any;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string, organizationId: string): Promise<any>;
    create(organizationId: string, dto: CreateCampaignDto): Promise<any>;
    update(id: string, organizationId: string, dto: UpdateCampaignDto): Promise<any>;
    updateStatus(id: string, organizationId: string, status: string): Promise<any>;
    updateAiScore(id: string, score: number): Promise<any>;
    delete(id: string, organizationId: string): Promise<any>;
    getMetricsSummary(campaignId: string, organizationId: string, days?: number): Promise<any>;
}
