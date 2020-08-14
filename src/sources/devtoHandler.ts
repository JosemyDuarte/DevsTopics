import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import 'source-map-support/register';

import { Post } from '@src/post';

import Parser from 'rss-parser';
import { Site } from '@src/site';
import { SnsNotificationService } from '@src/notificators/SnsNotificationService';

const feedUrl = 'https://dev.to/feed';

const publish: (post: Post) => Promise<void> = async (post: Post) => {
  const snsEndpoint = process.env.SNS_ENDPOINT_URL || undefined;
  console.debug(`SNS endpoint [${snsEndpoint}]`);
  const publishTopicARN = process.env.PUBLISH_TOPIC_ARN;
  console.debug(`TopicARN [${publishTopicARN}]`);
  const notificationService = new SnsNotificationService(snsEndpoint, publishTopicARN);
  await notificationService.publish(post);
};

export const findPosts: APIGatewayProxyHandlerV2 = async (_event, _context) => {
  console.debug('STARTING Dev.to...');
  console.debug(`Event: [${JSON.stringify(_event)}]`);
  console.debug(`Context: [${JSON.stringify(_context)}]`);
  try {
    const parser = new Parser();
    const feed: Parser.Output = await parser.parseURL(feedUrl);
    feed.items.forEach((item) => {
      console.debug(`Post found [${JSON.stringify(item)}]`);
      publish({
        id: item.guid,
        url: item.link,
        title: item.title,
        site: Site.DEVTO,
        publishedAt: new Date(item.isoDate),
        categories: item.categories,
        author: item.creator,
        content: item.contentSnippet,
      });
    });
  } catch (error) {
    console.error('Something went wrong parsing the feed');
    console.error(error);
    return { statusCode: 500, body: 'ko' };
  }

  return { statusCode: 200, body: 'ok' };
};
