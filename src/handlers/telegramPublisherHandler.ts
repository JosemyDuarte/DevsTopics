import { SNSHandler } from 'aws-lambda';
import 'source-map-support/register';

import Telegraf from 'telegraf';
import { Post } from '@src/post';

const channelId = process.env.TELEGRAM_CHANNEL_ID;
const token = process.env.TELEGRAM_BOT_TOKEN;

export const publish: SNSHandler = async (_event, _context) => {
  console.debug('STARTING...');
  console.debug(`Event: [${JSON.stringify(_event)}]`);
  console.debug(`Context: [${JSON.stringify(_context)}]`);
  try {
    const bot = new Telegraf(token);
    console.debug('Sending message');
    const rawSnsMessage: string = _event.Records[0].Sns.Message;
    const posts: Post[] = JSON.parse(rawSnsMessage) as Post[];
    console.info(`Received ${posts.length} posts`);
    if (posts.length > 0) {
      await bot.telegram.sendMessage(channelId, `We have this posts for you today ${new Date().toISOString().slice(0, 10)}:`);
      await posts.slice(0, 5).map((post) => post.url)
        .forEach((url) => bot.telegram.sendMessage(channelId, url));
      console.debug('Message sent');
    }
  } catch (error) {
    console.error('Something went wrong sending the telegram message');
    console.error(error.message);
    throw error;
  }

  console.debug('Finished telegram promotion');
};
