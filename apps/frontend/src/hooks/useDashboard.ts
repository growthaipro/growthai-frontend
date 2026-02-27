'use client';

import { useEffect, useState } from 'react';

interface Metrics {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  ctr: number;
  cpa: number;
  roas: number;
}

export function useDashboard() {
  const [metrics, setMetrics] = useState<Metrics>({
    impressions: 0,
    clicks: 0,
    conversions: 0,
    spend: 0,
    revenue: 0,
    ctr: 0,
    cpa: 0,
    roas: 0,
  });

  const [campaigns, setCampaigns] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {

        // Replace with your real API later
        const data = {
          impressions: 326800,
          clicks: 12450,
          conversions: 845,
          spend: 12450,
          revenue: 45600,
          ctr: 3.8,
          cpa: 14.7,
          roas: 3.6,
        };

        setMetrics(data);

        setCampaigns([]);

        setLogs([]);

      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    load();

  }, []);

  return {
    metrics,
    campaigns,
    logs,
    isLoading,
  };
}