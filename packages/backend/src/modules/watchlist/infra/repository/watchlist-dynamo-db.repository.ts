import { Injectable } from '@nestjs/common';
import { WatchlistRepository } from '../../domain/repository/watchlist.repository';
import { Watchlist } from '../../domain/model/Watchlist';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import { ConfigService } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

@Injectable()
export class WatchlistDynamoDbRepository extends WatchlistRepository {
  private readonly TABLE_NAME = 'watchlist';
  private readonly client: DynamoDBDocumentClient;

  constructor(private configService: ConfigService) {
    super();
    this.client = DynamoDBDocumentClient.from(
      new DynamoDBClient({
        region: this.configService.getOrThrow('DYNAMO_DB_REGION'),
        endpoint: this.configService.getOrThrow('DYNAMO_DB_URL'),
      }),
    );
  }

  async get() {
    const params = new GetCommand({
      TableName: this.TABLE_NAME,
      Key: {
        id: '1345678',
      },
    });

    const response = await this.client.send(params);

    return new Watchlist(response.Item.symbols);
  }

  async save(watchlist: Watchlist) {
    await this.client.send(
      new PutCommand({
        TableName: this.TABLE_NAME,
        Item: {
          id: '1345678',
          symbols: Array.from(watchlist),
        },
      }),
    );
  }
}
