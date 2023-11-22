export const screenerTableParams = {
  TableName: 'screener',
  KeySchema: [
    {
      AttributeName: 'symbol',
      KeyType: 'HASH',
    },
  ],
  AttributeDefinitions: [
    {
      AttributeName: 'symbol',
      AttributeType: 'S',
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  },
};
