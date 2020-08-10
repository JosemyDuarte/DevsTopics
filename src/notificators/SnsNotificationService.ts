import { NotificationService } from '@src/notificators/NotificationService';
import AWS from 'aws-sdk';
import SNS from 'aws-sdk/clients/sns';

export class SnsNotificationService implements NotificationService {
    private snsClient: SNS;

    private readonly topicArn: string;

    constructor(urlEndpoint: string, topicArn: string) {
      this.snsClient = new AWS.SNS({ endpoint: urlEndpoint });
      this.topicArn = topicArn;
    }

    async publish(item: unknown): Promise<void> {
      const message = JSON.stringify(item);
      console.debug(`Received item [${message}] to publish to [${this.topicArn}]`);
      const req = {
        Message: message,
        TopicArn: this.topicArn,
      };

      try {
        await this.snsClient.publish(req).promise();
        console.debug(`Published [${message}]`);
      } catch (error) {
        console.error(`Something went wrong publishing [${message}] to [${this.topicArn}]`);
        console.error(error.message);
        throw error;
      }
    }
}
