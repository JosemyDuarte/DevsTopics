import {
  Given, When, Then, Before, World, After,
} from 'cucumber';
import { Post } from '@src/post';
import { Site } from '@src/site';
import {
  anyString, instance, mock, resetCalls, verify,
} from 'ts-mockito';
import { TwitterPublisherUseCase } from '@src/promoters/twitter/twitterPublisherUseCase';
import { TwitterClient } from '@src/promoters/twitter/twitterClient';

Before({ tags: '@Twitter' }, () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  class TwitterContext implements World {
     public twitterClient: TwitterClient;

    public posts: Post[];

    public maxNumberOfTweets: number;

    public maxLengthOfTweets: number;
  }
});

Given('a list of {int} posts to tweet', (numberOfPosts: number) => {
  this.posts = [...Array(Number(numberOfPosts)).keys()]
    .map((index) => ({
      id: `Id${index}`,
      title: `Title${index}`,
      url: `Url${index}`,
      site: Site.HACKERNEWS,
      publishedAt: new Date(),
    }) as Post);
});

Given('a limit of {int} characters for tweets', (maxLengthOfTweets: number) => {
  this.maxLengthOfTweets = maxLengthOfTweets;
});

Given('a limit of {int} tweets', (maxNumberOfTweets: number) => {
  this.maxNumberOfTweets = maxNumberOfTweets;
});

When(/^I invoke the Twitter Promoter use case$/, async () => {
  this.twitterClient = mock<TwitterClient>();
  const twitterPublisherUseCase = new TwitterPublisherUseCase(
    instance(this.twitterClient), this.maxLengthOfTweets, this.maxNumberOfTweets,
  );
  await twitterPublisherUseCase.invoke(this.posts);
});

Then(/^(\d+) tweets has been sent$/, (expectedNumberOfTweetsSent: number) => {
  verify(this.twitterClient.tweet(anyString())).times(Number(expectedNumberOfTweetsSent));
});

After({ tags: '@Twitter' }, () => {
  resetCalls(this.twitterClient);
  this.posts = [];
  this.maxNumberOfTweets = 0;
  this.maxLengthOfTweets = 0;
});
