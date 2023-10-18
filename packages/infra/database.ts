import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

// Créer une table DynamoDB
const dynamoDbTable = new aws.dynamodb.Table("screener", {
    attributes: [
        { name: "symbol", type: "S" },
    ],
    hashKey: "symbol",
    readCapacity: 5,
    writeCapacity: 5,
});

// Créer une politique IAM
export const dynamoDbPolicy = new aws.iam.Policy("dynamoDbPolicy", {
    policy: {
        Version: "2012-10-17",
        Statement: [{
            Effect: "Allow",
            Action: [
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:DeleteItem",
                "dynamodb:UpdateItem",
            ],
            Resource: dynamoDbTable.arn
        }]
    }
});

// Exporter l'URL de connexion et la région
export const dynamoDbUrl = pulumi.interpolate`https://dynamodb.${aws.config.region}.amazonaws.com`;
export const awsRegion = aws.config.region;