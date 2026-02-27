import SibApiV3Sdk from 'sib-api-v3-sdk';

export class BrevoService {

  private api: SibApiV3Sdk.EmailCampaignsApi;

  constructor() {

    const client = SibApiV3Sdk.ApiClient.instance;

    client.authentications['api-key'].apiKey =
      process.env.BREVO_API_KEY;

    this.api = new SibApiV3Sdk.EmailCampaignsApi();

  }

  async createCampaign(data: {
    name: string;
    subject: string;
    htmlContent: string;
    listIds: number[];
  }) {

    const campaign =
      new SibApiV3Sdk.CreateEmailCampaign();

    campaign.name = data.name;

    campaign.subject = data.subject;

    campaign.sender = {
      name: 'AdMatrix',
      email: 'noreply@admatrix.ai',
    };

    campaign.type = 'classic';

    campaign.htmlContent = data.htmlContent;

    campaign.recipients = {
      listIds: data.listIds,
    };

    return await this.api.createEmailCampaign(campaign);

  }

}