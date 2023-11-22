import { CreateTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { CreateTableCommandInput } from '@aws-sdk/client-dynamodb/dist-types/commands/CreateTableCommand';
import * as process from 'process';

async function createTable(
  dynamoDbClient: DynamoDBClient,
  tableParams: CreateTableCommandInput,
) {
  const createTableCommand = new CreateTableCommand(tableParams);
  return dynamoDbClient.send(createTableCommand);
}

export async function setupTables(tablesParams: CreateTableCommandInput[]) {
  const dynamoDbClient = new DynamoDBClient({
    endpoint: process.env.DYNAMO_DB_URL,
    region: 'local',
  });

  await Promise.all(
    tablesParams.map((tableParams) => createTable(dynamoDbClient, tableParams)),
  );
}
