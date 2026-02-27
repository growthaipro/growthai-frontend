'use client';

import { useState } from 'react';
import { CampaignTable } from '@/components/campaign/CampaignTable';
import { useCampaigns } from '@/hooks/useCampaigns';

export default function CampaignsPage() {
  const { campaigns, isLoading, mutate } = useCampaigns();
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = statusFilter ? campaigns.filter(c => c.status === statusFilter) : campaigns;

  return (
    <div className="slide-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            {campaigns.length} campaigns · {campaigns.filter(c => c.status === 'ACTIVE').length} active
          </p>
        </div>
        <button
          className="px-4 py-2 rounded-xl text-sm font-bold text-white"
          style={{ background: 'linear-gradient(135deg, var(--accent), #a855f7)' }}
        >
          + New Campaign
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['', 'ACTIVE', 'PAUSED', 'DRAFT'].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
            style={{
              background: statusFilter === s ? 'var(--subtle)' : 'transparent',
              borderColor: statusFilter === s ? 'var(--accent)' : 'var(--border)',
              color: statusFilter === s ? 'var(--accent)' : 'var(--muted)',
            }}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <CampaignTable campaigns={filtered} />
      </div>
    </div>
  );
}
