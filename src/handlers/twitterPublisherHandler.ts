import { SNSHandler } from 'aws-lambda';
import 'source-map-support/register';

import Twit from 'twit';
import { Post } from '@src/post';

const twitterConf = {
  consumer_key: process.env.TWITTER_APP_API_KEY,
  consumer_secret: process.env.TWITTER_APP_API_SECRET,
  access_token: process.env.TWITTER_APP_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_APP_ACCESS_TOKEN_SECRET,
};

function formatTweet(post: Post): string {
  console.debug(`Title length: [${post.title.length}]`);
  console.debug(`Url length: [${post.url.length}]`);
  const tweet = `${post.title} ${post.url}`.length >= 280 ? `${post.title.substring(0, `${post.title} ${post.url}`.length - 280)} ${post.url}` : `${post.title} ${post.url}`;
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
      for (const post of posts.slice(0, 2)) { //Await doesn't work as expected with .forEach
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
