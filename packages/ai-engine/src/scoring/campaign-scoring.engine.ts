import { AIScoringInput, AIScoringOutput, OptimizationAction } from '@admatrix/shared-types';

/**
 * Campaign AI Scoring Engine
 * Analyzes historical metrics to produce an optimization score (0–100)
 * and recommend the next action.
 */
export class CampaignScoringEngine {
  score(input: AIScoringInput): AIScoringOutput {
    const { campaignId, metrics } = input;

    if (!metrics || metrics.length === 0) {
      return this.emptyScore(campaignId);
    }

    const window = metrics.slice(-input.windowDays);
    const half = Math.ceil(window.length / 2);
    const recent = window.slice(half);
    const older = window.slice(0, half);

    const ctrFn = (arr: typeof metrics) =>
      arr.reduce((s, m) => s + (m.impressions > 0 ? (m.clicks / m.impressions) * 100 : 0), 0) / Math.max(arr.length, 1);

    const cpaFn = (arr: typeof metrics) =>
      arr.reduce((s, m) => s + (m.conversions > 0 ? m.spend / m.conversions : 0), 0) / Math.max(arr.length, 1);

    const recentCtr = ctrFn(recent);
    const olderCtr = ctrFn(older);
    const recentCpa = cpaFn(recent);
    const olderCpa = cpaFn(older);

    const threshold = 0.05;
    const ctrTrend = recentCtr > olderCtr * (1 + threshold) ? 'UP' : recentCtr < olderCtr * (1 - threshold) ? 'DOWN' : 'STABLE';
    const cpaTrend = recentCpa < olderCpa * (1 - threshold) ? 'UP' : recentCpa > olderCpa * (1 + threshold) ? 'DOWN' : 'STABLE';

    const totalSpend = window.reduce((s, m) => s + m.spend, 0);
    const spendVelocity = totalSpend / Math.max(window.length, 1);

    let score = 50;
    if (ctrTrend === 'UP') score += 15;
    else if (ctrTrend === 'DOWN') score -= 20;

    if (cpaTrend === 'UP') score += 15;   // CPA improving
    else if (cpaTrend === 'DOWN') score -= 20; // CPA worsening

    if (recentCtr > 2) score += 10;
    else if (recentCtr < 0.5) score -= 15;

    const avgRoas = window.reduce((s, m) => s + (m.spend > 0 ? m.revenue / m.spend : 0), 0) / window.length;
    if (avgRoas > 3) score += 10;
    else if (avgRoas < 1) score -= 15;

    score = Math.max(0, Math.min(100, Math.round(score)));

    const recommendedAction = this.getRecommendedAction(score, ctrTrend, cpaTrend);

    return { campaignId, score, ctrTrend, cpaTrend, spendVelocity, recommendedAction, confidence: 0.85 };
  }

  private getRecommendedAction(score: number, ctrTrend: string, cpaTrend: string): OptimizationAction | undefined {
    if (score < 30) return OptimizationAction.PAUSE_CREATIVE;
    if (score < 45 && cpaTrend === 'DOWN') return OptimizationAction.NOTIFY_USER;
    if (score > 85) return OptimizationAction.INCREASE_BUDGET;
    if (score > 75) return OptimizationAction.DUPLICATE_ADSET;
    return undefined;
  }

  private emptyScore(campaignId: string): AIScoringOutput {
    return { campaignId, score: 0, ctrTrend: 'STABLE', cpaTrend: 'STABLE', spendVelocity: 0, confidence: 0 };
  }
}
