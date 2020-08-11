import { SNSHandler } from 'aws-lambda';
import 'source-map-support/register';

import Twit from 'twit';
import { Post } from '@src/post';

const twitterConf = {
  // eslint-disable-next-line @typescript-eslint/camelcase
  consumer_key: process.env.TWITTER_APP_API_KEY,
  // eslint-disable-next-line @typescript-eslint/camelcase
  consumer_secret: process.env.TWITTER_APP_API_SECRET,
  // eslint-disable-next-line @typescript-eslint/camelcase
  access_token: process.env.TWITTER_APP_ACCESS_TOKEN_KEY,
  // eslint-disable-next-line @typescript-eslint/camelcase
  access_token_secret: process.env.TWITTER_APP_ACCESS_TOKEN_SECRET,
};

const CODING_HASHTAGS = ['#programming', '#Developer', '#code', '#tech',
  '#programmer', '#software', '#coding', '#Engineering', '#news',
  '#skills', '#computer'];

const TWEET_MAX_LENGTH = 280;

function appendHashTags(post: Post): string {
  const maxHashtagLength: number = Math.max(...(CODING_HASHTAGS.map((hashtag) => hashtag.length)));
  const titleAndUrlLength: number = `${post.title} ${post.url}`.length;
  const canAppendHashtag = maxHashtagLength + titleAndUrlLength + 3 < TWEET_MAX_LENGTH;
  return canAppendHashtag ? `${post.title}\n${CODING_HASHTAGS.sort(() => Math.random() - 0.5)[0]}\n${post.url}` : `${post.title} ${post.url}`;
}

function formatTweet(post: Post): string {
  console.debug(`Title length: [${post.title.length}]`);
  console.debug(`Url length: [${post.url.length}]`);
  const tweet = `${post.title} ${post.url}`.length >= TWEET_MAX_LENGTH ? `${post.title.substring(0, `${post.title} ${post.url}`.length - TWEET_MAX_LENGTH)} ${post.url}` : appendHashTags(post);
  console.debug(`Result length: [${tweet.length}]`);
  console.debug(`Tweet: [${tweet}]`);
  return tweet;
}

export const publish: SNSHandler = async (_event, _context) => {
  console.debug('STARTING...');
  console.debug(`Event: [${JSON.stringify(_event)}]`);
  console.debug(`Context: [${JSON.stringify(_context)}]`);
  console.debug(`Twitter client config: [${JSON.stringify(twitterConf)}]`);
  try {
    const rawSnsMessage: string = _event.Records[0].Sns.Message;
    const posts: Post[] = JSON.parse(rawSnsMessage) as Post[];
    console.info(`Received ${posts.length} posts`);
    if (posts.length > 0) {
      console.debug('Tweeting...');
      const tw = new Twit(twitterConf);
      // eslint-disable-next-line no-restricted-syntax
      for (const post of posts.slice(0, 2)) { // Await doesn't work as expected with .forEach
        // eslint-disable-next-line no-await-in-loop
        await tw.post('statuses/update', { status: formatTweet(post) });
      }
      console.debug('Tweets sent');
    }
  } catch (error) {
    console.error('Something went wrong tweeting');
    console.error(error.message);
    throw error;
  }

  console.debug('Finished twitter promotion');
};
