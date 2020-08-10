import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import 'source-map-support/register';

import { DynamoPostReaderRepository } from '@src/repositories/dynamoPostReaderRepository';
import { Site } from '@src/site';
import { Post } from '@src/post';
import { SnsNotificationService } from '@src/notificators/SnsNotificationService';

const publishPost: (posts: Post[]) => Promise<void> = async (posts: Post[]) => {
  const snsEndpoint = process.env.SNS_ENDPOINT_URL || undefined;
  console.debug(`SNS endpoint [${snsEndpoint}]`);
  const publishTopicARN = process.env.PUBLISH_TOPIC_ARN;
  console.debug(`TopicARN [${publishTopicARN}]`);
  const notificationService = new SnsNotificationService(snsEndpoint, publishTopicARN);
  await notificationService.publish(posts);
};

export const publish: APIGatewayProxyHandlerV2 = async (_event, _context) => {
  console.debug('STARTING...');
  console.debug(`Event: [${JSON.stringify(_event)}]`);
  console.debug(`Context: [${JSON.stringify(_context)}]`);

  const postTableName = process.env.POSTS_TABLE_NAME;
  const publishedAtSiteIndexName = process.env.POSTS_PUBLISHED_AT_SITE_INDEX_NAME;
  const dynamoOptions = process.env.DYNAMODB_ENDPOINT_URL ? {
    endpoint: process.env.DYNAMODB_ENDPOINT_URL,
    region: 'localhost',
  } : undefined;

  console.debug(`TableName [${postTableName}]`);
  console.debug(`DB Options [${dynamoOptions}]`);
  console.debug(`Index [${publishedAtSiteIndexName}]`);

  const dynamoPostRepository = new DynamoPostReaderRepository(postTableName, publishedAtSiteIndexName, dynamoOptions);
  try {
    const posts: Post[] = await dynamoPostRepository.search(new Date(), Site.HACKERNEWS);
    await publishPost(posts);
    return { statusCode: 200, body: JSON.stringify(posts) };
  } catch (error) {
    console.error(`Booom [ ${error.message} ]`);
    return { statusCode: 500, body: error.message };
  }
};
