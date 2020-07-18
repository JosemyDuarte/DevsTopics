import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import AWS from 'aws-sdk';

export const hello: APIGatewayProxyHandler = async (event, _context) => {
  const SNS_ENDPOINT_URL = process.env.SNS_ENDPOINT_URL || undefined;
  const SNS = new AWS.SNS({ endpoint: SNS_ENDPOINT_URL });
  console.log(`SNS URL: ${SNS_ENDPOINT_URL}`);
  console.log(process.env.PUBLISH_TOPIC_ARN);
  const req = {
    Message: JSON.stringify({ message: 'hello sns' }),
    TopicArn: process.env.PUBLISH_TOPIC_ARN,
  };

  console.log(req);

  try {
    await SNS.publish(req).promise();
    console.log('**********PUBLISHING WORKED**********');
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Message published',
        input: event,
      }, null, 2),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Fuck',
      }),
    };
  }
};
