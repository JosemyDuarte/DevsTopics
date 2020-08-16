import { TelegramClient } from '@src/promoters/telegram/telegramClient';
import { Post } from '@src/post';

export class TelegramPublisherUseCase {
  private telegramClient: TelegramClient;

  private maxMessagesToPublish = 5;

  constructor(telegramClient: TelegramClient, maxMessagesToPublish: number) {
    this.telegramClient = telegramClient;
    this.maxMessagesToPublish = maxMessagesToPublish;
  }

  async invoke(posts: Post[]): Promise<void> {
    console.info(`Received ${posts.length} posts`);
    if (posts.length <= 0) {
      console.debug('Nothing to be sent');
      return Promise.resolve();
    }

    await Promise.all(await posts.slice(0, this.maxMessagesToPublish)
      .map((post) => this.telegramClient.send(post.url)));

    console.debug('Messages sent');
    return Promise.resolve();
  }
}
