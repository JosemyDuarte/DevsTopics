import {
  Before, Given, World, When,
  Then, After,
} from 'cucumber';
import { Post } from '@src/post';
import { Site } from '@src/site';
import { RssClient } from '@src/sources/RssClient';
import {
  anything, instance, mock, resetCalls, verify, when,
} from 'ts-mockito';
import { SourceRssUseCase } from '@src/sources/sourceRssUseCase';
import { NotificationService } from '@src/notificators/NotificationService';

Before({ tags: '@Rss' }, () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  class SourceRssFeedContext implements World {
    public rssClient: RssClient;

    public notificationService: NotificationService;

    public postsFound: Post[];
  }
});

Given('a list of {int} publications in Rss Feed', (numberOfPublicationsInSource: number) => {
  const posts: Post[] = [...Array(Number(numberOfPublicationsInSource)).keys()]
    .map((index) => ({
      id: `Id${index}`,
      title: `Title${index}`,
      url: `Url${index}`,
      site: Site.DEVTO,
      publishedAt: new Date(),
    }) as Post);

  this.rssClient = mock<RssClient>();
  when(this.rssClient.retrievePosts()).thenReturn(posts);
});

When(/^I invoke the Source Rss use case$/, async () => {
  this.notificationService = mock<NotificationService>();
  const sourceRssUseCase = new SourceRssUseCase(instance(this.rssClient), instance(this.notificationService));
  this.postsFound = await sourceRssUseCase.invoke();
});

Then('{int} publications has been notified', (numberOfNotificationsSent: number) => {
  verify(this.notificationService.publish(anything())).times(Number(numberOfNotificationsSent));
});

After({ tags: '@Rss' }, () => {
  resetCalls(this.notificationService);
  resetCalls(this.rssClient);
  this.posts = [];
});
