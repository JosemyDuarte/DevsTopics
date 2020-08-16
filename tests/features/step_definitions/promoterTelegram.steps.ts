import {
  Given, When, Then, After, Before, World,
} from 'cucumber';

import { TelegramPublisherUseCase } from '@src/promoters/telegram/telegramPublisherUseCase';

import {
  anyString, instance, verify, resetCalls, mock,
} from 'ts-mockito';
import { Site } from '@src/site';
import { Post } from '@src/post';
import { TelegramClient } from '@src/promoters/telegram/telegramClient';

Before({ tags: '@Telegram' }, () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  class TelegramContext implements World {
    public telegramClient: TelegramClient;

    public posts: Post[];

    public maxNumberOfMessages: number;
  }
});

Given(/^a list of "([^"]*)" posts$/, (numberOfPosts: number) => {
  this.posts = [...Array(Number(numberOfPosts)).keys()]
    .map((index) => ({
      id: `Id${index}`,
      title: `Title${index}`,
      url: `Url${index}`,
      site: Site.HACKERNEWS,
      publishedAt: new Date(),
    }) as Post);
});

Given(/^an empty list of posts$/, () => {
  this.posts = [];
});

Given(/^a limit of "([^"]*)" telegram messages$/, (messageLimit: number) => {
  this.maxNumberOfMessages = Number(messageLimit);
});

When('I invoke the Telegram Promoter use case', async () => {
  this.telegramClient = mock<TelegramClient>();
  const useCase = new TelegramPublisherUseCase(instance(this.telegramClient), this.maxNumberOfMessages);
  await useCase.invoke(this.posts);
});

Then(/^no message should be sent$/, () => {
  verify(this.telegramClient.send(anyString())).never();
});

Then('{int} telegram messages should have been sent', (numberOfMessagesSent: number) => {
  verify(this.telegramClient.send(anyString())).times(Number(numberOfMessagesSent));
});

After({ tags: '@Telegram' }, () => {
  resetCalls(this.telegramClient);
  this.posts = [];
  this.maxNumberOfMessages = 0;
});
