import { Post } from '@src/post';
import { TwitterClient } from '@src/promoters/twitter/twitterClient';

const CODING_HASHTAGS = ['#programming', '#Developer', '#code', '#tech',
  '#programmer', '#software', '#coding', '#Engineering', '#news',
  '#skills', '#computer'];

export class TwitterPublisherUseCase {
  private twitterClient: TwitterClient;

  private readonly maxNumberOfTweets: number;

  private readonly tweetMaxLength: number;

  constructor(twitterClient: TwitterClient, tweetMaxLength: number, maxNumberOfTweets: number) {
    this.maxNumberOfTweets = maxNumberOfTweets;
    this.tweetMaxLength = tweetMaxLength;
    this.twitterClient = twitterClient;
  }

  async invoke(posts: Post[]): Promise<void> {
    console.info(`Received ${posts.length} posts`);
    if (posts.length <= 0) {
      console.debug('Nothing to tweet');
      return Promise.resolve();
    }
    console.debug('Tweeting...');
    await Promise.all(posts.slice(0, this.maxNumberOfTweets)
      .map((post) => this.twitterClient.tweet(this.formatTweet(post))));

    console.debug('Tweets sent');
    return Promise.resolve();
  }

  appendHashTags(post: Post): string {
    const maxHashtagLength: number = Math.max(...(CODING_HASHTAGS.map((hashtag) => hashtag.length)));
    const titleAndUrlLength: number = `${post.title} ${post.url}`.length;
    const canAppendHashtag = maxHashtagLength + titleAndUrlLength + 3 < this.tweetMaxLength;
    return canAppendHashtag ? `${post.title}\n${CODING_HASHTAGS.sort(() => Math.random() - 0.5)[0]}\n${post.url}` : `${post.title} ${post.url}`;
  }

  formatTweet(post: Post): string {
    console.debug(`Title length: [${post.title.length}]`);
    console.debug(`Url length: [${post.url.length}]`);
    const tweet = `${post.title} ${post.url}`.length >= this.tweetMaxLength ? `${post.title.substring(0, `${post.title} ${post.url}`.length - this.tweetMaxLength)} ${post.url}` : this.appendHashTags(post);
    console.debug(`Result length: [${tweet.length}]`);
    console.debug(`Tweet: [${tweet.replace('\n', ' ')}]`);
    return tweet;
  }
}
