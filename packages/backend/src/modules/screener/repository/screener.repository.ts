import { Injectable } from '@nestjs/common';
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { ConfigService } from '@nestjs/config';
import { DeleteItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { ScreenerEntryFrontendDto } from '../../../shared-types/screener-entry-frontend.dto';

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

  async create(screenerEntryEntity: ScreenerEntryFrontendDto) {
    await this.client.send(
      new PutCommand({
        TableName: this.TABLE_NAME,
        Item: {
          symbol: screenerEntryEntity.symbol,
          exchange: screenerEntryEntity.exchange,
          sector: screenerEntryEntity.sector,
          industry: screenerEntryEntity.industry,
          fundamentalRating: screenerEntryEntity.fundamentalRating,
          numberOfDaysUntilNextEarningCall:
            screenerEntryEntity.numberOfDaysUntilNextEarningCall,
          averageDailyRange: screenerEntryEntity.averageDailyRange,
        },
      }),
    );
  }

  async getAll(): Promise<ScreenerEntryFrontendDto[]> {
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

  async deleteAll() {
    const tickers = await this.getAll();

    await Promise.all(
      tickers.map((ticker) =>
        this.client.send(
          new DeleteItemCommand({
            TableName: this.TABLE_NAME,
            Key: {
              symbol: {
                S: ticker.symbol,
              },
            },
          }),
        ),
      ),
    );
  }
}
