import { RssClient } from '@src/sources/RssClient';
import { Post } from '@src/post';
import { NotificationService } from '@src/notificators/NotificationService';

export class SourceRssUseCase {
  private rssClient: RssClient;

  private notificationService: NotificationService;

  constructor(rssClient: RssClient, notificationService: NotificationService) {
    this.notificationService = notificationService;
    this.rssClient = rssClient;
  }

  async invoke(): Promise<Post[]> {
    console.debug('Retrieving news');
    const posts: Post[] = await this.rssClient.retrievePosts();

    console.debug(`Notifying ${posts.length} posts`);
    // eslint-disable-next-line no-restricted-syntax
    for (const post of posts) {
      // eslint-disable-next-line no-await-in-loop
      await this.notificationService.publish(post);
    }

    console.debug('Notifications sent');
    return posts;
  }
}
