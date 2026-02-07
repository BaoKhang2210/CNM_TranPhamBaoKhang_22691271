const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const { dynamoClient } = require("../config/aws");

// Create the DynamoDB Document Client
const docClient = DynamoDBDocumentClient.from(dynamoClient);

module.exports = docClient;
