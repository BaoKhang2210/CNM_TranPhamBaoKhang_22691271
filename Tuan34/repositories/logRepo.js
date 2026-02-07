const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const docClient = require("./db");
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = "ProductLogs";

class LogRepository {
    async createLog(productId, action, userId) {
        const logEntry = {
            logId: uuidv4(),
            productId,
            action,
            userId,
            timestamp: new Date().toISOString()
        };
        const params = {
            TableName: TABLE_NAME,
            Item: logEntry
        };
        await docClient.send(new PutCommand(params));
        return logEntry;
    }
}

module.exports = new LogRepository();
