import AWS from 'aws-sdk';
import { DynamoPost, Post } from '@src/post';
import { PostWriterRepository } from '@src/repositories/postWriterRepository';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import DynamoDB from 'aws-sdk/clients/dynamodb';

export class DynamoPostWriterRepository implements PostWriterRepository {
    private client: DocumentClient;

    private readonly tableName: string;

    constructor(tableName: string, dynamoOptions?: DocumentClient.DocumentClientOptions & DynamoDB.Types.ClientConfiguration) {
      this.client = new AWS.DynamoDB.DocumentClient(dynamoOptions);
      this.tableName = tableName;
    }

    async save(item: Post): Promise<string> {
      console.debug(`Executing saveItem [${JSON.stringify(item)}]`);

      const dynamoPost = DynamoPost.from(item);
      console.debug(`Converted to DynamoPost [${JSON.stringify(dynamoPost)}]`);
      const params = {
        TableName: this.tableName,
        Item: dynamoPost,
      };

      try {
        console.debug(`Saving: [${JSON.stringify(params)}]`);
        await this.client.put(params).promise();
        console.debug(`Saved: [${JSON.stringify(params)}]`);
      } catch (error) {
        console.error(`BOOOOM: [${JSON.stringify(error.message)}]`);
      }
      return item.id;
    }
}
