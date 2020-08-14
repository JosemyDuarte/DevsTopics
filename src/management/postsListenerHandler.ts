import { SNSHandler } from 'aws-lambda';
import 'source-map-support/register';
import { DynamoPostWriterRepository } from '@src/repositories/dynamoPostWriterRepository';
import { Post } from '@src/post';

export const listen: SNSHandler = async (_event, _context) => {
  console.debug('****************Message received****************');
  console.debug(`Event: [${JSON.stringify(_event)}]`);
  console.debug(`Context: [${JSON.stringify(_context)}]`);
  console.debug(_event.Records[0].Sns);

  const postTableName = process.env.POSTS_TABLE_NAME;
  const dynamoOptions = process.env.DYNAMODB_ENDPOINT_URL ? {
    endpoint: process.env.DYNAMODB_ENDPOINT_URL,
    region: 'localhost',
  } : undefined;

  console.debug(`Post table name [${postTableName}]`);
  console.debug(`Dynamo client options [${JSON.stringify(dynamoOptions)}]`);

  const item: Post = JSON.parse(_event.Records[0].Sns.Message);
  console.info(`Parsed message to post [${JSON.stringify(item)}]`);

  const dynamoPostRepository = new DynamoPostWriterRepository(postTableName, dynamoOptions);
  try {
    await dynamoPostRepository.save(item);
  } catch (e) {
    console.error(`Booom [ ${e.message} ]`);
  }
};
