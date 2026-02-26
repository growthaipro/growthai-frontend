import useSWR from 'swr';
import { campaignApi } from '@/lib/api';
import { Campaign } from '@admatrix/shared-types';

const MOCK_CAMPAIGNS = [
  { id: 'c1', name: 'Summer Sale 2025', platform: 'META', status: 'ACTIVE', objective: 'CONVERSIONS', budgetTotal: 5000, budgetDaily: 500, aiScore: 87, organizationId: 'org1', optimizationMode: 'AI_ASSISTED', startAt: new Date(), createdAt: new Date(), updatedAt: new Date() },
  { id: 'c2', name: 'Brand Awareness Q1', platform: 'GOOGLE', status: 'ACTIVE', objective: 'REACH', budgetTotal: 3200, budgetDaily: 320, aiScore: 72, organizationId: 'org1', optimizationMode: 'MANUAL', startAt: new Date(), createdAt: new Date(), updatedAt: new Date() },
  { id: 'c3', name: 'Retargeting - Cart', platform: 'TIKTOK', status: 'PAUSED', objective: 'TRAFFIC', budgetTotal: 1500, budgetDaily: 150, aiScore: 45, organizationId: 'org1', optimizationMode: 'AI_ASSISTED', startAt: new Date(), createdAt: new Date(), updatedAt: new Date() },
  { id: 'c4', name: 'New Product Launch', platform: 'META', status: 'ACTIVE', objective: 'CONVERSIONS', budgetTotal: 8000, budgetDaily: 800, aiScore: 91, organizationId: 'org1', optimizationMode: 'FULLY_AUTOMATED', startAt: new Date(), createdAt: new Date(), updatedAt: new Date() },
  { id: 'c5', name: 'Holiday Campaign', platform: 'GOOGLE', status: 'DRAFT', objective: 'SALES', budgetTotal: 12000, budgetDaily: 1200, aiScore: 0, organizationId: 'org1', optimizationMode: 'MANUAL', startAt: new Date(), createdAt: new Date(), updatedAt: new Date() },
];

export function useCampaigns() {
  // In production: use SWR with real API
  // const { data, error, mutate } = useSWR('/campaigns', campaignApi.list);

  return {
    campaigns: MOCK_CAMPAIGNS as any[],
    isLoading: false,
    error: null,
    mutate: () => {},
  };
}

export function useCampaign(id: string) {
  const campaign = MOCK_CAMPAIGNS.find(c => c.id === id);
  return { campaign, isLoading: false };
}
