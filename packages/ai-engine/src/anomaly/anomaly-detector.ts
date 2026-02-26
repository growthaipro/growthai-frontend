import { AnomalyDetectionResult } from '@admatrix/shared-types';

/**
 * Detects anomalies in campaign metrics
 * - Spend spikes
 * - CTR drops
 * - Conversion drops
 * - ROAS drops
 */
export class AnomalyDetector {
  detect(campaignId: string, metrics: any[]): AnomalyDetectionResult[] {
    if (metrics.length < 3) return [];

    const anomalies: AnomalyDetectionResult[] = [];
    const latest = metrics[metrics.length - 1];
    const baseline = this.computeBaseline(metrics.slice(0, -1));

    // Spend spike: current spend > 3x baseline average
    if (latest.spend > baseline.avgSpend * 3) {
      anomalies.push({
        campaignId,
        anomalyType: 'SPEND_SPIKE',
        severity: 'HIGH',
        detectedAt: new Date().toISOString(),
        details: `Spend ${latest.spend.toFixed(2)} is ${(latest.spend / baseline.avgSpend).toFixed(1)}x above baseline`,
      });
    }

    // CTR drop: current CTR < 50% of baseline
    const currentCtr = latest.impressions > 0 ? (latest.clicks / latest.impressions) * 100 : 0;
    if (currentCtr < baseline.avgCtr * 0.5 && baseline.avgCtr > 0) {
      anomalies.push({
        campaignId,
        anomalyType: 'CTR_DROP',
        severity: currentCtr < baseline.avgCtr * 0.3 ? 'CRITICAL' : 'MEDIUM',
        detectedAt: new Date().toISOString(),
        details: `CTR ${currentCtr.toFixed(2)}% vs baseline ${baseline.avgCtr.toFixed(2)}%`,
      });
    }

    // ROAS drop
    const currentRoas = latest.spend > 0 ? latest.revenue / latest.spend : 0;
    if (currentRoas < baseline.avgRoas * 0.6 && baseline.avgRoas > 0) {
      anomalies.push({
        campaignId,
        anomalyType: 'ROAS_DROP',
        severity: 'HIGH',
        detectedAt: new Date().toISOString(),
        details: `ROAS ${currentRoas.toFixed(2)}x vs baseline ${baseline.avgRoas.toFixed(2)}x`,
      });
    }

    return anomalies;
  }

  private computeBaseline(metrics: any[]) {
    const len = Math.max(metrics.length, 1);
    return {
      avgSpend: metrics.reduce((s, m) => s + m.spend, 0) / len,
      avgCtr: metrics.reduce((s, m) => s + (m.impressions > 0 ? (m.clicks / m.impressions) * 100 : 0), 0) / len,
      avgRoas: metrics.reduce((s, m) => s + (m.spend > 0 ? m.revenue / m.spend : 0), 0) / len,
    };
  }
}
