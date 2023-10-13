import { Injectable } from '@nestjs/common';
import { dynamoDBClient } from '../../config/dynamodb/dynamoDbClient';

@Injectable()
export class ScreenerRepository {
  private readonly TABLE_NAME = 'screener';
  async create(payload: { symbol: string }) {
    await dynamoDBClient()
      .put({
        TableName: this.TABLE_NAME,
        Item: {
          symbol: payload.symbol,
        },
      })
      .promise();
  }
}
