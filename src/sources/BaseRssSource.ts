import { Item } from 'rss-parser';
import { Post } from '@src/post';
import { APIGatewayProxyHandlerV2, APIGatewayProxyResult, Context } from 'aws-lambda';
import { SourceRssUseCase } from '@src/sources/sourceRssUseCase';
import { RssParserClient } from '@src/sources/RssClient';
import { SnsNotificationService } from '@src/notificators/SnsNotificationService';
import { Site } from '@src/site';

export abstract class BaseRssSource {
  abstract source(): Site;

  abstract parseRssToPost(item: Item): Post;

  public findPosts = async (event: APIGatewayProxyHandlerV2, context: Context): Promise<APIGatewayProxyResult> => {
    console.debug(`STARTING ${this.source()}...`);
    console.debug(`Event: [${JSON.stringify(event)}]`);
    console.debug(`Context: [${JSON.stringify(context)}]`);
    console.debug(`SNSUrlEndpoint [${process.env.SNS_ENDPOINT_URL || undefined}]`);
    console.debug(`SNSPublicTopicArn [${process.env.PUBLISH_TOPIC_ARN}]`);
    console.debug(`RSSFeedURL [${process.env.RSS_FEED_URL}]`);

    try {
      const snsEndpoint = process.env.SNS_ENDPOINT_URL || undefined;
      const publishTopicARN = process.env.PUBLISH_TOPIC_ARN;
      const rssUseCase = new SourceRssUseCase(
        new RssParserClient(process.env.RSS_FEED_URL, this.parseRssToPost),
        new SnsNotificationService(snsEndpoint, publishTopicARN),
      );
      const rssNews: Post[] = await rssUseCase.invoke();
      console.debug(`Found ${rssNews.length} posts for ${this.source()}`);
      return {
        statusCode: 200,
        body: JSON.stringify({
          status: 'OK',
          posts: rssNews,
        }),
      };
    } catch (error) {
      console.error('Something went wrong parsing the feed');
      console.error(error.message);
      return {
        statusCode: 500,
        body: JSON.stringify({
          status: 'KO',
          message: error.message,
        }),
      };
    }
  };
}
