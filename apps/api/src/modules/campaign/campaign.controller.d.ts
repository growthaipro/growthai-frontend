import { CampaignService } from './campaign.service';
import { CreateCampaignDto, UpdateCampaignDto } from '@admatrix/shared-types';
export declare class CampaignController {
    private readonly campaignService;
    constructor(campaignService: CampaignService);
    findAll(orgId: string, query: any): Promise<{
        items: any;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string, orgId: string): Promise<any>;
    create(dto: CreateCampaignDto, orgId: string): Promise<any>;
    update(id: string, orgId: string, dto: UpdateCampaignDto): Promise<any>;
    start(id: string, orgId: string): Promise<{
        id: string;
        status: string;
        message: string;
    }>;
    pause(id: string, orgId: string): Promise<{
        id: string;
        status: string;
    }>;
    getMetrics(id: string, orgId: string, days?: number): Promise<any>;
    delete(id: string, orgId: string): Promise<{
        deleted: boolean;
    }>;
}
