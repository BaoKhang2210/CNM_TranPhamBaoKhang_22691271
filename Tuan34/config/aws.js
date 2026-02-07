require('dotenv').config();
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { S3Client } = require("@aws-sdk/client-s3");

const region = process.env.AWS_REGION || "ap-southeast-1";

// AWS SDK v3 automatically checks:
// 1. Environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
// 2. Shared credentials file
// 3. IAM Role (in EC2/Lambda)
// We only explicity set credentials if they are in process.env (Local dev),
// otherwise we let the default provider chain handle it (EC2 IAM).

const config = {
    region
};

if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    config.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN // Optional: for temporary creds
    };
}

const dynamoClient = new DynamoDBClient(config);
const s3Client = new S3Client(config);

module.exports = {
    dynamoClient,
    s3Client
};
