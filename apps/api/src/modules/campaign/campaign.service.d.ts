import { EventEmitter2 } from '@nestjs/event-emitter';
import { Queue } from 'bullmq';
import { CampaignRepository } from './campaign.repository';
import { CreateCampaignDto, UpdateCampaignDto } from '@admatrix/shared-types';
export declare class CampaignService {
    private readonly campaignRepo;
    private readonly eventEmitter;
    private readonly campaignQueue;
    private readonly logger;
    constructor(campaignRepo: CampaignRepository, eventEmitter: EventEmitter2, campaignQueue: Queue);
    findAll(organizationId: string, query: any): Promise<{
        items: any;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string, organizationId: string): Promise<any>;
    create(organizationId: string, dto: CreateCampaignDto): Promise<any>;
    update(id: string, organizationId: string, dto: UpdateCampaignDto): Promise<any>;
    start(id: string, organizationId: string): Promise<{
        id: string;
        status: string;
        message: string;
    }>;
    pause(id: string, organizationId: string): Promise<{
        id: string;
        status: string;
    }>;
    delete(id: string, organizationId: string): Promise<{
        deleted: boolean;
    }>;
    getMetrics(id: string, organizationId: string, days?: number): Promise<any>;
}
