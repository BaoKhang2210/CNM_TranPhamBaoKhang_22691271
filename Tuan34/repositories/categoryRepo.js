const { ScanCommand, PutCommand, GetCommand, DeleteCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const docClient = require("./db");
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = "Categories";

class CategoryRepository {
    async getAll() {
        const params = {
            TableName: TABLE_NAME
        };
        return await docClient.send(new ScanCommand(params));
    }

    async create(category) {
        const newCategory = {
            categoryId: uuidv4(),
            ...category
        };
        const params = {
            TableName: TABLE_NAME,
            Item: newCategory
        };
        await docClient.send(new PutCommand(params));
        return newCategory;
    }

    // Additional methods for Update/Delete if needed
    async delete(categoryId) {
        const params = {
            TableName: TABLE_NAME,
            Key: { categoryId }
        };
        return await docClient.send(new DeleteCommand(params));
    }

    async getById(categoryId) {
        const params = {
            TableName: TABLE_NAME,
            Key: { categoryId }
        };
        const command = new GetCommand(params);
        const result = await docClient.send(command);
        return result.Item;
    }
}

module.exports = new CategoryRepository();
