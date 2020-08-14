import { SNSHandler } from 'aws-lambda';
import 'source-map-support/register';

import { Post } from '@src/post';
import { TwitterPublisherUseCase } from '@src/promoters/twitter/twitterPublisherUseCase';
import { TwitClient } from '@src/promoters/twitter/twitterClient';

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

export const publish: SNSHandler = async (_event, _context) => {
  console.debug('STARTING...');
  console.debug(`Event: [${JSON.stringify(_event)}]`);
  console.debug(`Context: [${JSON.stringify(_context)}]`);
  console.debug(`Twitter client config: [${JSON.stringify(twitterConf)}]`);
  console.debug(`Tweet max length [${process.env.TWEET_MAX_LENGTH}]`);
  console.debug(`Max number of tweets to publish [${process.env.TWEET_MAX_LENGTH}]`);
  try {
    const rawSnsMessage: string = _event.Records[0].Sns.Message;
    const posts: Post[] = JSON.parse(rawSnsMessage) as Post[];
    const twitterClient = new TwitClient(twitterConf);
    const twitterPublisherUseCase = new TwitterPublisherUseCase(
      twitterClient,
      Number(process.env.TWITTER_TWEET_MAX_LENGTH),
      Number(process.env.TWITTER_MAX_NUMBER_OF_TWEETS),
    );
    await twitterPublisherUseCase.invoke(posts);
  } catch (error) {
    console.error('Something went wrong tweeting');
    console.error(error.message);
    throw error;
  }

  console.debug('Finished twitter promotion');
};
