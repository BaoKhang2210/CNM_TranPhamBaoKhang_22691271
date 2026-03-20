const db = require('../config/db');
const {
    ScanCommand,
    GetCommand,
    PutCommand,
    UpdateCommand,
    DeleteCommand
} = require("@aws-sdk/lib-dynamodb");

const TABLE = "Products";

exports.getAll = async () => {
    return await db.send(new ScanCommand({ TableName: TABLE }));
};

exports.getById = async (id) => {
    return await db.send(new GetCommand({
        TableName: TABLE,
        Key: { id }
    }));
};

exports.create = async (product) => {
    return await db.send(new PutCommand({
        TableName: TABLE,
        Item: product
    }));
};

exports.update = async (id, data) => {
    return await db.send(new UpdateCommand({
        TableName: TABLE,
        Key: { id },
        UpdateExpression: "set #n=:n, price=:p, unit_in_stock=:u, url_image=:img",
        ExpressionAttributeNames: { "#n": "name" },
        ExpressionAttributeValues: {
            ":n": data.name,
            ":p": Number(data.price),
            ":u": Number(data.unit_in_stock),
            ":img": data.url_image
        }
    }));
};

exports.delete = async (id) => {
    return await db.send(new DeleteCommand({
        TableName: TABLE,
        Key: { id }
    }));
};