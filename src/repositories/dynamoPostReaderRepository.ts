import AWS from 'aws-sdk';
import { Post } from '@src/post';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { Site } from '@src/site';
import { PostReaderRepository } from '@src/repositories/postReaderRepository';

export class DynamoPostReaderRepository implements PostReaderRepository {
    private client: DocumentClient;

    private readonly tableName: string;

    private readonly publishedAtSiteIndexName: string;

    constructor(tableName: string,
      publishedAtSiteIndexName: string,
      dynamoOptions?: DocumentClient.DocumentClientOptions & DynamoDB.Types.ClientConfiguration) {
      this.client = new AWS.DynamoDB.DocumentClient(dynamoOptions);
      this.tableName = tableName;
      this.publishedAtSiteIndexName = publishedAtSiteIndexName;
    }

    async search(publishedFrom: Date, site: Site): Promise<Post[]> {
      const params = {
        ExpressionAttributeValues: {
          ':publishedFrom': publishedFrom.toISOString().split('T')[0],
          ':site': site,
        },
        IndexName: this.publishedAtSiteIndexName,
        KeyConditionExpression: 'site = :site and begins_with(publishedAt, :publishedFrom)',
        TableName: this.tableName,
      };

      try {
        const queryResult: DocumentClient.QueryOutput = await this.client.query(params).promise();
        const posts: Post[] = queryResult.Items as Post[];
        console.info(`Found ${posts.length} posts`);
        return posts;
      } catch (error) {
        console.error(`BOOOOM [${error.message}]`);
        throw error;
      }
    }
}
