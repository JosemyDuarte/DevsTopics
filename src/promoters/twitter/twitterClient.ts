import Twit from 'twit';

export interface TwitterClient {
  tweet(message: string);
}

export class TwitClient implements TwitterClient {
  private twit: Twit;

  constructor(twitterConf: { consumer_key: string; access_token: string; consumer_secret: string; access_token_secret: string }) {
    this.twit = new Twit(twitterConf);
  }

  async tweet(message: string): Promise<void> {
    await this.twit.post('statuses/update', { status: message });
  }
}
