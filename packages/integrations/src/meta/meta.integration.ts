/**
 * Meta (Facebook) Ads Platform Integration
 * Wraps the Meta Marketing API
 */
export class MetaIntegration {
  private readonly baseUrl = 'https://graph.facebook.com/v19.0';

  constructor(
    private readonly accessToken: string,
    private readonly adAccountId: string,
  ) {}

  async getCampaigns() {
    const url = `${this.baseUrl}/act_${this.adAccountId}/campaigns?fields=id,name,status,objective,daily_budget,lifetime_budget&access_token=${this.accessToken}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Meta API error: ${res.status}`);
    return res.json();
  }

  async getInsights(campaignId: string, dateRange: { since: string; until: string }) {
    const url = `${this.baseUrl}/${campaignId}/insights?fields=impressions,clicks,spend,actions,action_values&date_preset=last_7d&access_token=${this.accessToken}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Meta API error: ${res.status}`);
    return res.json();
  }

  async updateCampaignBudget(campaignId: string, dailyBudgetCents: number) {
    const url = `${this.baseUrl}/${campaignId}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        daily_budget: dailyBudgetCents,
        access_token: this.accessToken,
      }),
    });
    if (!res.ok) throw new Error(`Meta API error: ${res.status}`);
    return res.json();
  }

  async pauseCampaign(campaignId: string) {
    return this.updateCampaignStatus(campaignId, 'PAUSED');
  }

  async activateCampaign(campaignId: string) {
    return this.updateCampaignStatus(campaignId, 'ACTIVE');
  }

  private async updateCampaignStatus(campaignId: string, status: string) {
    const url = `${this.baseUrl}/${campaignId}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, access_token: this.accessToken }),
    });
    if (!res.ok) throw new Error(`Meta API error: ${res.status}`);
    return res.json();
  }
}
