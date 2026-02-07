const { ScanCommand, PutCommand, GetCommand, UpdateCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const docClient = require("./db");
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = "Products";

class ProductRepository {
    async getAll() {
        // PERFORMANCE NOTE: Scan is expensive and slow for large datasets.
        // It reads every item in the table. usage of 'Query' on an Index is recommended for production.
        const params = {
            TableName: TABLE_NAME,
        };
        const command = new ScanCommand(params);
        return await docClient.send(command);
    }

    async getById(id) {
        const params = {
            TableName: TABLE_NAME,
            Key: { id }
        };
        const command = new GetCommand(params);
        return await docClient.send(command);
    }

    async create(product) {
        const productWithId = {
            id: uuidv4(),
            ...product,
            createdAt: new Date().toISOString(),
            isDeleted: false
        };
        const params = {
            TableName: TABLE_NAME,
            Item: productWithId
        };
        await docClient.send(new PutCommand(params));
        return productWithId;
    }

    async update(id, updates) {
        // Construct UpdateExpression dynamically
        let updateExp = "set";
        const expAttrValues = {};
        const expAttrNames = {};

        Object.keys(updates).forEach((key, index) => {
            if (key !== 'id' && key !== 'createdAt') { // ID and createdAt shouldn't change
                const attrKey = `#attr${index}`;
                const valueKey = `:val${index}`;
                updateExp += ` ${attrKey} = ${valueKey},`;
                expAttrNames[attrKey] = key;
                expAttrValues[valueKey] = updates[key];
            }
        });

        // Remove trailing comma
        updateExp = updateExp.slice(0, -1);

        const params = {
            TableName: TABLE_NAME,
            Key: { id },
            UpdateExpression: updateExp,
            ExpressionAttributeNames: expAttrNames,
            ExpressionAttributeValues: expAttrValues,
            ReturnValues: "ALL_NEW"
        };

        return await docClient.send(new UpdateCommand(params));
    }

    // Soft Delete
    async delete(id) {
        const params = {
            TableName: TABLE_NAME,
            Key: { id },
            UpdateExpression: "set isDeleted = :deleted",
            ExpressionAttributeValues: {
                ":deleted": true
            }
        };
        return await docClient.send(new UpdateCommand(params));
    }
}

module.exports = new ProductRepository();
