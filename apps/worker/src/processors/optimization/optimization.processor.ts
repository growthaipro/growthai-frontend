import { PlatformExecutionService } from '../../platform/platform-execution.service';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import {
  OptimizationAction,
  AIScoringOutput
} from '@admatrix/shared-types';

@Processor('optimization')
export class OptimizationProcessor extends WorkerHost {

  private readonly logger = new Logger(OptimizationProcessor.name);

  // ✅ ADD THIS
  private platformExec = new PlatformExecutionService();


  async process(job: Job): Promise<any> {

    this.logger.log(`Processing optimization job: ${job.name} [${job.id}]`);

    switch (job.name) {

      case 'optimization.run':
        return this.runOptimizationCycle(job);

      case 'optimization.score':
        return this.scoreCampaign(job);

      default:
        this.logger.warn(`Unknown optimization job: ${job.name}`);
        return null;

    }

  }


  /**
   * FULL OPTIMIZATION CYCLE
   */
  private async runOptimizationCycle(job: Job) {

    const { campaignId, metrics, platform } = job.data;

    this.logger.log(`🧠 AI optimizing campaign ${campaignId}`);

    const historicalMetrics = metrics || this.mockMetrics();

    const scoring = this.computeScore(campaignId, historicalMetrics);

    const action = this.determineAction(scoring);

    this.logger.log(
      `📊 Campaign ${campaignId} Score=${scoring.score} Action=${action}`
    );

    // ✅ EXECUTE REAL PLATFORM ACTION
    await this.executeAction(
      campaignId,
      platform || 'META',
      action,
      scoring
    );

    return {

      campaignId,

      scoring,

      action,

      optimizedAt: new Date()

    };

  }


  /**
   * SCORE ONLY
   */
  private async scoreCampaign(job: Job) {

    const { campaignId } = job.data;

    const metrics = this.mockMetrics();

    return this.computeScore(campaignId, metrics);

  }



  /**
   * CORE AI SCORING ENGINE
   */
  private computeScore(
    campaignId: string,
    metrics: any[]
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

    const older = metrics.slice(0, metrics.length - 3);


    const avgCtr = (data: any[]) =>
      data.reduce(
        (sum, m) =>
          sum + ((m.clicks / Math.max(m.impressions,1)) * 100),
        0
      ) / data.length;


    const avgCpa = (data: any[]) =>
      data.reduce(
        (sum, m) =>
          sum + (m.spend / Math.max(m.conversions, 1)),
        0
      ) / data.length;


    const recentCtr = avgCtr(recent);

    const olderCtr = avgCtr(older);

    const recentCpa = avgCpa(recent);

    const olderCpa = avgCpa(older);


    const ctrTrend =
      recentCtr > olderCtr * 1.05
        ? 'UP'
        : recentCtr < olderCtr * 0.95
        ? 'DOWN'
        : 'STABLE';


    const cpaTrend =
      recentCpa < olderCpa * 0.95
        ? 'UP'
        : recentCpa > olderCpa * 1.05
        ? 'DOWN'
        : 'STABLE';


    const totalSpend =
      metrics.reduce((sum, m) => sum + m.spend, 0);


    const spendVelocity =
      totalSpend / metrics.length;


    let score = 50;


    if (ctrTrend === 'UP') score += 15;
    if (ctrTrend === 'DOWN') score -= 20;

    if (cpaTrend === 'UP') score += 15;
    if (cpaTrend === 'DOWN') score -= 20;


    if (recentCtr > 2) score += 10;
    if (recentCtr < 0.5) score -= 15;


    score = Math.max(0, Math.min(100, Math.round(score)));


    return {

      campaignId,

      score,

      ctrTrend,

      cpaTrend,

      spendVelocity,

      confidence: 0.85,

      recommendedAction:
        score < 40
          ? OptimizationAction.PAUSE_CREATIVE
          : score > 80
          ? OptimizationAction.INCREASE_BUDGET
          : undefined

    };

  }



  /**
   * DETERMINE FINAL ACTION
   */
  private determineAction(
    scoring: AIScoringOutput
  ): OptimizationAction | null {

    if (scoring.score < 30)
      return OptimizationAction.PAUSE_CREATIVE;

    if (scoring.score > 85)
      return OptimizationAction.INCREASE_BUDGET;

    if (scoring.score > 75)
      return OptimizationAction.DUPLICATE_ADSET;

    return null;

  }



  /**
   * EXECUTE REAL ACTION
   */
  private async executeAction(
    campaignId: string,
    platform: string,
    action: OptimizationAction | null,
    scoring: AIScoringOutput
  ) {

    if (!action) return;

    this.logger.log(
      `⚡ Executing ${action} on ${platform}`
    );


    switch (action) {

      case OptimizationAction.PAUSE_CREATIVE:

        await this.platformExec.pauseCampaign(
          platform,
          campaignId
        );

        break;


      case OptimizationAction.INCREASE_BUDGET:

        await this.platformExec.increaseBudget(
          platform,
          campaignId,
          15
        );

        break;


      case OptimizationAction.DUPLICATE_ADSET:

        this.logger.log(
          `Duplicate adset logic here`
        );

        break;

    }

  }



  /**
   * MOCK DATA
   */
  private mockMetrics() {

    return Array.from({ length: 7 }, () => ({

      impressions: 10000 + Math.random() * 5000,

      clicks: 200 + Math.random() * 300,

      conversions: 10 + Math.random() * 30,

      spend: 100 + Math.random() * 200,

      revenue: 300 + Math.random() * 600

    }));

  }

}