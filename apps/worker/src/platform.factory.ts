import { MetaService } from '@admatrix/integrations/src/meta/meta.service';
import { GoogleService } from '@admatrix/integrations/src/google/google.service';
import { TikTokService } from '@admatrix/integrations/src/tiktok/tiktok.service';
// add others later

export class PlatformFactory {

  static get(platform: string) {

    switch (platform) {

      case 'META':
        return new MetaService();

      case 'GOOGLE':
        return new GoogleService();

      case 'TIKTOK':
        return new TikTokService();

      case 'LINKEDIN':
        throw new Error('LinkedIn service not implemented');

      case 'YOUTUBE':
        throw new Error('YouTube service not implemented');

      default:
        throw new Error(`Unsupported platform ${platform}`);

    }

  }

}