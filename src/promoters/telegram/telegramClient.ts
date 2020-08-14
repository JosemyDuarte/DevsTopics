import Telegraf from 'telegraf';
import { TelegrafContext } from 'telegraf/typings/context';

export interface TelegramClient {
    send(message: string): Promise<void>;
}

export class TelegrafClient implements TelegramClient {
    private readonly channelId: string;

    private bot: Telegraf<TelegrafContext>;

    constructor(botToken: string, channelId: string) {
      console.debug('Creating telegram client');
      console.debug(`botToken: [${botToken}]`);
      console.debug(`channelId: [${channelId}]`);
      this.bot = new Telegraf(botToken);
      this.channelId = channelId;
    }

    async send(message: string): Promise<void> {
      console.debug(`Sending telegram message [${message}]`);
      await this.bot.telegram.sendMessage(this.channelId, message);
      console.debug('Telegram message sent');
    }
}
