import { Injectable } from '@nestjs/common';
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { ConfigService } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

@Injectable()
export class ScreenerRepository {
  private readonly TABLE_NAME = 'screener';
  private readonly client: DynamoDBDocumentClient;

  constructor(private configService: ConfigService) {
    this.client = DynamoDBDocumentClient.from(
      new DynamoDBClient({
        region: configService.getOrThrow('DYNAMO_DB_REGION'),
        endpoint: configService.getOrThrow('DYNAMO_DB_URL'),
      }),
    );
  }

  async create(payload: { symbol: string; fundamentalRating: number }) {
    await this.client.send(
      new PutCommand({
        TableName: this.TABLE_NAME,
        Item: {
          symbol: payload.symbol,
          fundamentalRating: payload.fundamentalRating,
        },
      }),
    );
  }

  async getAll() {
    const params = new ScanCommand({
      TableName: this.TABLE_NAME,
      ExclusiveStartKey: undefined,
    });

    const scanResults = [];
    let items;
    do {
      items = await this.client.send(params);
      items.Items.forEach((item) => scanResults.push(item));
      params.input.ExclusiveStartKey = items.LastEvaluatedKey;
    } while (typeof items.LastEvaluatedKey !== 'undefined');

    return scanResults;
  }
}
