import { SNSHandler } from 'aws-lambda';
import 'source-map-support/register';

import { Post } from '@src/post';
import { TelegramPublisherUseCase } from '@src/promoters/telegram/telegramPublisherUseCase';
import { TelegrafClient, TelegramClient } from '@src/promoters/telegram/telegramClient';

export const publish: SNSHandler = async (_event, _context) => {
  console.debug('STARTING...');
  console.debug(`Event: [${JSON.stringify(_event)}]`);
  console.debug(`Context: [${JSON.stringify(_context)}]`);
  try {
    const telegramClient: TelegramClient = new TelegrafClient(process.env.TELEGRAM_BOT_TOKEN, process.env.TELEGRAM_CHANNEL_ID);
    const telegramPublisherUseCase = new TelegramPublisherUseCase(telegramClient, Number(process.env.TELEGRAM_MAX_NUMBER_OF_MESSAGES));

    const rawSnsMessage: string = _event.Records[0].Sns.Message;
    const posts: Post[] = JSON.parse(rawSnsMessage) as Post[];
    await telegramPublisherUseCase.invoke(posts);
  } catch (error) {
    console.error('Something went wrong sending the telegram message');
    console.error(error.message);
    throw error;
  }

  console.debug('Finished telegram promotion');
};
