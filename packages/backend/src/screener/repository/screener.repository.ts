import { Injectable } from '@nestjs/common';
import { dynamoDBClient } from '../../config/dynamodb/dynamoDbClient';

@Injectable()
export class ScreenerRepository {
  private readonly TABLE_NAME = 'screener';
  async create(payload: { symbol: string; fundamentalRating: number }) {
    await dynamoDBClient()
      .put({
        TableName: this.TABLE_NAME,
        Item: {
          symbol: payload.symbol,
          fundamentalRating: payload.fundamentalRating,
        },
      })
      .promise();
  }

  async getAll() {
    const params = {
      TableName: this.TABLE_NAME,
      ExclusiveStartKey: undefined,
    };

    const scanResults = [];
    let items;
    do {
      items = await dynamoDBClient().scan(params).promise();
      items.Items.forEach((item) => scanResults.push(item));
      params.ExclusiveStartKey = items.LastEvaluatedKey;
    } while (typeof items.LastEvaluatedKey !== 'undefined');

    return scanResults;
  }
}
