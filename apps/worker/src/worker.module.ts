import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import {
  OptimizationAction,
  AIScoringOutput
} from '@admatrix/shared-types';

interface Metric {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue?: number;
}

@Processor('optimization')
export class OptimizationProcessor extends WorkerHost {

  private readonly logger = new Logger(OptimizationProcessor.name);

  async process(job: Job): Promise<any> {

    this.logger.log(`⚙ Processing job ${job.name} (${job.id})`);

    switch (job.name) {

      case 'optimization.run':
        return this.runOptimization(job);

      case 'optimization.score':
        return this.scoreOnly(job);

      default:
        this.logger.warn(`Unknown job type: ${job.name}`);
        return null;

    }

  }

  /**
   * MAIN OPTIMIZATION PIPELINE
   */
  private async runOptimization(job: Job) {

    const { campaignId, metrics } = job.data;

    this.logger.log(`🧠 Optimizing campaign ${campaignId}`);

    const dataset: Metric[] = metrics ?? this.mockMetrics();

    const scoring = this.calculateScore(campaignId, dataset);

    const action = this.selectAction(scoring);

    this.logger.log(
      `📊 Score=${scoring.score} CTR=${scoring.ctrTrend} CPA=${scoring.cpaTrend} Action=${action}`
    );

    await this.executeAction(campaignId, action, scoring);

    return {
      campaignId,
      scoring,
      action,
      timestamp: new Date()
    };

  }

  /**
   * SCORE ONLY MODE
   */
  private async scoreOnly(job: Job) {

    const { campaignId } = job.data;

    const metrics = this.mockMetrics();

    return this.calculateScore(campaignId, metrics);

  }


  /**
   * AI SCORING ENGINE
   */
  private calculateScore(
    campaignId: string,
    metrics: Metric[]
  ): AIScoringOutput {

    if (!metrics.length) {

      return {
        campaignId,
        score: 0,
        ctrTrend: 'STABLE',
        cpaTrend: 'STABLE',
        spendVelocity: 0,
        confidence: 0
      };

    }


    const recent = metrics.slice(-3);

    const older = metrics.slice(0, metrics.length - 3) || recent;


    const avgCTR = (data: Metric[]) =>
      data.reduce((s, m) =>
        s + (m.impressions > 0 ? m.clicks / m.impressions : 0), 0
      ) / data.length;


    const avgCPA = (data: Metric[]) =>
      data.reduce((s, m) =>
        s + (m.conversions > 0 ? m.spend / m.conversions : m.spend), 0
      ) / data.length;


    const recentCTR = avgCTR(recent);
    const oldCTR = avgCTR(older);

    const recentCPA = avgCPA(recent);
    const oldCPA = avgCPA(older);


    const ctrTrend =
      recentCTR > oldCTR * 1.05 ? 'UP' :
      recentCTR < oldCTR * 0.95 ? 'DOWN' :
      'STABLE';


    const cpaTrend =
      recentCPA < oldCPA * 0.95 ? 'UP' :
      recentCPA > oldCPA * 1.05 ? 'DOWN' :
      'STABLE';


    const totalSpend =
      metrics.reduce((s, m) => s + m.spend, 0);


    const spendVelocity =
      totalSpend / metrics.length;


    /**
     * SCORE MODEL
     */

    let score = 50;


    if (ctrTrend === 'UP') score += 15;
    if (ctrTrend === 'DOWN') score -= 20;

    if (cpaTrend === 'UP') score += 15;
    if (cpaTrend === 'DOWN') score -= 20;


    if (recentCTR > 0.03) score += 10;
    if (recentCTR < 0.005) score -= 15;


    score = Math.max(0, Math.min(100, Math.round(score)));


    return {

      campaignId,

      score,

      ctrTrend,

      cpaTrend,

      spendVelocity,

      confidence: 0.9,

      recommendedAction:
        score < 40
          ? OptimizationAction.PAUSE_CREATIVE
          : score > 80
          ? OptimizationAction.INCREASE_BUDGET
          : undefined

    };

  }


  /**
   * ACTION DECISION
   */
  private selectAction(
    scoring: AIScoringOutput
  ): OptimizationAction | null {

    if (scoring.score <= 30)
      return OptimizationAction.PAUSE_CREATIVE;

    if (scoring.score >= 85)
      return OptimizationAction.INCREASE_BUDGET;

    if (scoring.score >= 75)
      return OptimizationAction.DUPLICATE_ADSET;

    return null;

  }


  /**
   * ACTION EXECUTION
   */
  private async executeAction(
    campaignId: string,
    action: OptimizationAction | null,
    scoring: AIScoringOutput
  ) {

    if (!action) {

      this.logger.log(`No optimization needed`);

      return;

    }


    this.logger.log(`🚀 Executing ${action}`);


    switch (action) {

      case OptimizationAction.PAUSE_CREATIVE:

        this.logger.warn(`Pausing creatives`);

        break;


      case OptimizationAction.INCREASE_BUDGET:

        this.logger.log(`Increasing budget`);

        break;


      case OptimizationAction.DUPLICATE_ADSET:

        this.logger.log(`Scaling adset`);

        break;

    }


    /**
     * PRODUCTION PLACE:
     *
     * call MetaService
     * call GoogleService
     * save optimization_logs
     *
     */

  }


  /**
   * TEST DATA
   */
  private mockMetrics(): Metric[] {

    return Array.from({ length: 7 }, () => ({

      impressions: 10000 + Math.random() * 5000,

      clicks: 200 + Math.random() * 300,

      conversions: 10 + Math.random() * 30,

      spend: 100 + Math.random() * 200,

      revenue: 300 + Math.random() * 600

    }));

  }

}