export declare enum CampaignStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    PAUSED = "PAUSED",
    COMPLETED = "COMPLETED",
    ARCHIVED = "ARCHIVED"
}
export declare enum CampaignObjective {
    CONVERSIONS = "CONVERSIONS",
    TRAFFIC = "TRAFFIC",
    REACH = "REACH",
    SALES = "SALES",
    AWARENESS = "AWARENESS",
    LEADS = "LEADS"
}
export declare enum Platform {
    META = "META",
    GOOGLE = "GOOGLE",
    TIKTOK = "TIKTOK"
}
export declare enum CreativeType {
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
    TEXT = "TEXT",
    CAROUSEL = "CAROUSEL"
}
export declare enum OptimizationMode {
    MANUAL = "MANUAL",
    AI_ASSISTED = "AI_ASSISTED",
    FULLY_AUTOMATED = "FULLY_AUTOMATED"
}
export declare enum OptimizationAction {
    PAUSE_CREATIVE = "PAUSE_CREATIVE",
    INCREASE_BUDGET = "INCREASE_BUDGET",
    DECREASE_BUDGET = "DECREASE_BUDGET",
    DUPLICATE_ADSET = "DUPLICATE_ADSET",
    NOTIFY_USER = "NOTIFY_USER",
    GENERATE_CREATIVE = "GENERATE_CREATIVE"
}
export declare enum UserRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    ORG_ADMIN = "ORG_ADMIN",
    MANAGER = "MANAGER",
    ANALYST = "ANALYST",
    VIEWER = "VIEWER"
}
export declare enum JobStatus {
    WAITING = "WAITING",
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    DELAYED = "DELAYED"
}
export interface Organization {
    id: string;
    name: string;
    slug: string;
    plan: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    organizationId: string;
    createdAt: Date;
}
export interface Campaign {
    id: string;
    organizationId: string;
    name: string;
    objective: CampaignObjective;
    platform: Platform;
    status: CampaignStatus;
    budgetTotal: number;
    budgetDaily: number;
    optimizationMode: OptimizationMode;
    startAt: Date;
    endAt?: Date;
    aiScore?: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface Creative {
    id: string;
    campaignId: string;
    name: string;
    type: CreativeType;
    aiGenerated: boolean;
    assetUrl?: string;
    headline?: string;
    description?: string;
    performanceScore?: number;
    status: CampaignStatus;
    createdAt: Date;
    updatedAt: Date;
}
export interface CampaignMetric {
    id: string;
    campaignId: string;
    timestamp: Date;
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
    revenue: number;
    ctr: number;
    cpa: number;
    roas: number;
}
export interface OptimizationLog {
    id: string;
    campaignId: string;
    action: OptimizationAction;
    reason: string;
    metadata: Record<string, unknown>;
    triggeredBy: 'AI' | 'USER';
    createdAt: Date;
}
export interface CreateCampaignDto {
    name: string;
    objective: CampaignObjective;
    platform: Platform;
    budgetTotal: number;
    budgetDaily: number;
    optimizationMode: OptimizationMode;
    startAt: string;
    endAt?: string;
}
export interface UpdateCampaignDto {
    name?: string;
    status?: CampaignStatus;
    budgetTotal?: number;
    budgetDaily?: number;
    optimizationMode?: OptimizationMode;
    endAt?: string;
}
export interface CreateCreativeDto {
    campaignId: string;
    name: string;
    type: CreativeType;
    headline?: string;
    description?: string;
    assetUrl?: string;
}
export interface WebhookMetricPayload {
    platform: Platform;
    externalCampaignId: string;
    timestamp: string;
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
    revenue: number;
}
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    timestamp: string;
}
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface ApiError {
    success: false;
    error: string;
    message: string;
    statusCode: number;
    timestamp: string;
}
export interface CampaignCreatedEvent {
    campaignId: string;
    organizationId: string;
    platform: Platform;
}
export interface CampaignStartedEvent {
    campaignId: string;
    organizationId: string;
}
export interface MetricsUpdatedEvent {
    campaignId: string;
    organizationId: string;
    timestamp: string;
}
export interface OptimizationTriggeredEvent {
    campaignId: string;
    organizationId: string;
    reason: string;
    metrics: Partial<CampaignMetric>;
}
export interface AIScoringInput {
    campaignId: string;
    metrics: CampaignMetric[];
    windowDays: number;
}
export interface AIScoringOutput {
    campaignId: string;
    score: number;
    ctrTrend: 'UP' | 'DOWN' | 'STABLE';
    cpaTrend: 'UP' | 'DOWN' | 'STABLE';
    spendVelocity: number;
    recommendedAction?: OptimizationAction;
    confidence: number;
}
export interface AnomalyDetectionResult {
    campaignId: string;
    anomalyType: 'SPEND_SPIKE' | 'CTR_DROP' | 'CONVERSION_DROP' | 'ROAS_DROP';
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    detectedAt: string;
    details: string;
}
