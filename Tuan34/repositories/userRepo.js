const { ScanCommand, PutCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const docClient = require("./db");
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = "Users";

class UserRepository {
    async findByUsername(username) {
        // Since username is likely not a primary key effectively (unless we change schema),
        // we might have to Scan or Query via an index. 
        // Assuming for this assignment we rely on Scan or GSI isn't setup.
        // If Table has 'username' as PK, use GetCommand. Based on requirements 'userId' is PK.
        // So we must Scan or Query GSI. Scan for now as dataset is small.
        const params = {
            TableName: TABLE_NAME,
            FilterExpression: "username = :username",
            ExpressionAttributeValues: {
                ":username": username
            }
        };
        const command = new ScanCommand(params);
        const result = await docClient.send(command);
        return result.Items[0];
    }

    async create(user) {
        // User: username, password (hashed), role, createdAt
        const newUser = {
            userId: uuidv4(),
            ...user,
            createdAt: new Date().toISOString()
        };
        const params = {
            TableName: TABLE_NAME,
            Item: newUser
        };
        await docClient.send(new PutCommand(params));
        return newUser;
    }

    async findById(userId) {
        const params = {
            TableName: TABLE_NAME,
            Key: { userId }
        };
        const command = new GetCommand(params);
        const result = await docClient.send(command);
        return result.Item;
    }
}

module.exports = new UserRepository();
