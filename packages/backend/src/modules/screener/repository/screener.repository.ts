import { Injectable } from '@nestjs/common';
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { ConfigService } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { ScreenerEntryEntity } from '../domain/model/screener-entry.entity';

@Injectable()
export class ScreenerRepository {
  private readonly TABLE_NAME = 'screener';
  private readonly client: DynamoDBDocumentClient;

  constructor(private configService: ConfigService) {
    this.client = DynamoDBDocumentClient.from(
      new DynamoDBClient({
        region: this.configService.getOrThrow('DYNAMO_DB_REGION'),
        endpoint: this.configService.getOrThrow('DYNAMO_DB_URL'),
      }),
    );
  }

  async create(screenerEntryEntity: ScreenerEntryEntity) {
    await this.client.send(
      new PutCommand({
        TableName: this.TABLE_NAME,
        Item: {
          symbol: screenerEntryEntity.symbol,
          fundamentalRating: screenerEntryEntity.fundamentalRating,
          technicalRating: screenerEntryEntity.technicalRating,
          numberOfDaysUntilNextEarningCall:
            screenerEntryEntity.numberOfDaysUntilNextEarningCall,
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
