'use client';

import { MetricCard } from '@/components/ui/MetricCard';
import { CampaignTable } from '@/components/campaign/CampaignTable';
import { OptimizationFeed } from '@/components/ai/OptimizationFeed';
import { useDashboard } from '@/hooks/useDashboard';

export default function DashboardPage() {
  const { metrics, campaigns, logs, isLoading } = useDashboard();

  // ✅ Prevent hydration mismatch
  if (isLoading || !metrics) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Loading dashboard...</h1>
      </div>
    );
  }

  return (
    <div className="slide-in space-y-6">

      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ letterSpacing: '-0.5px' }}
        >
          Marketing Intelligence
        </h1>

        <p
          className="text-sm mt-1"
          style={{ color: 'var(--muted)' }}
        >
          Real-time AI-powered analytics across all platforms
        </p>
      </div>


      {/* Top Metrics */}
      <div className="grid grid-cols-5 gap-4">

        <MetricCard
          label="Impressions"
          value={metrics.impressions}
          format="compact"
          delta={7}
          color="var(--accent)"
        />

        <MetricCard
          label="Clicks"
          value={metrics.clicks}
          format="compact"
          delta={-3}
          color="var(--cyan)"
        />

        <MetricCard
          label="Conversions"
          value={metrics.conversions}
          format="compact"
          delta={12}
          color="var(--green)"
        />

        <MetricCard
          label="Spend"
          value={metrics.spend}
          format="currency"
          delta={5}
          color="var(--yellow)"
        />

        <MetricCard
          label="Revenue"
          value={metrics.revenue}
          format="currency"
          delta={18}
          color="var(--hot)"
        />

      </div>


      {/* Performance Metrics */}
      <div className="grid grid-cols-3 gap-4">

        <MetricCard
          label="CTR"
          value={metrics.ctr}
          format="percent"
          color="var(--cyan)"
        />

        <MetricCard
          label="CPA"
          value={metrics.cpa}
          format="currency"
          color="var(--yellow)"
        />

        <MetricCard
          label="ROAS"
          value={metrics.roas}
          format="multiplier"
          color="var(--green)"
        />

      </div>


      {/* Bottom Section */}
      <div className="grid grid-cols-2 gap-6">

        {/* Campaigns */}
        <div
          className="rounded-2xl p-5 border"
          style={{
            background: 'var(--card)',
            borderColor: 'var(--border)'
          }}
        >

          <h3 className="text-sm font-bold mb-4">
            Active Campaigns
          </h3>

          <CampaignTable
            campaigns={
              campaigns?.filter(
                c => c.status === 'ACTIVE'
              ) || []
            }
            compact
          />

        </div>


        {/* AI Feed */}
        <div
          className="rounded-2xl p-5 border"
          style={{
            background: 'var(--card)',
            borderColor: 'var(--border)'
          }}
        >

          <h3 className="text-sm font-bold mb-4">
            AI Optimization Feed
          </h3>

          <OptimizationFeed logs={logs || []} />

        </div>

      </div>

    </div>
  );
}