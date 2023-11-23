import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

// Créer une table DynamoDB
const screenerTable = new aws.dynamodb.Table("screener", {
  name: "screener",
  attributes: [{ name: "symbol", type: "S" }],
  hashKey: "symbol",
  readCapacity: 5,
  writeCapacity: 5,
});

// Créer une politique IAM
const watchlistTable = new aws.dynamodb.Table("watchlist", {
  name: "watchlist",
  attributes: [{ name: "id", type: "S" }],
  hashKey: "id",
  readCapacity: 5,
  writeCapacity: 5,
});

export const dynamoDbTablePolicy = new aws.iam.Policy("dynamoDbTablePolicy", {
  policy: {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: [
          "dynamodb:Scan",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:DeleteItem",
          "dynamodb:UpdateItem",
        ],
        Resource: screenerTable.arn,
      },
      {
        Effect: "Allow",
        Action: [
          "dynamodb:Scan",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:DeleteItem",
          "dynamodb:UpdateItem",
        ],
        Resource: watchlistTable.arn,
      },
    ],
  },
});

// Exporter l'URL de connexion et la région
export const dynamoDbUrl = pulumi.interpolate`https://dynamodb.${aws.config.region}.amazonaws.com`;
export const awsRegion = aws.config.region;
