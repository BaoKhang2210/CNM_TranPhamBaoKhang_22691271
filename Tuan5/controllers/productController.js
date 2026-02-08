const { ScanCommand, PutCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const { TABLE_NAME, docClient } = require("../models/productModel");
const crypto = require("crypto"); // Dùng cái này thay cho uuid để tránh lỗi ESM

exports.getAllProducts = async (req, res) => {
    try {
        const data = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
        res.render("index", { products: data.Items || [] });
    } catch (err) {
        res.status(500).send("Lỗi lấy dữ liệu: " + err.message);
    }
};

exports.addProduct = async (req, res) => {
    const { name, price, url_image } = req.body;
    // Tạo ID ngẫu nhiên bằng crypto
    const id = crypto.randomBytes(8).toString("hex");
    const item = { id, name, price: Number(price), url_image };
    try {
        await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Lỗi thêm sản phẩm: " + err.message);
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await docClient.send(new DeleteCommand({
            TableName: TABLE_NAME,
            Key: { id: req.params.id }
        }));
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Lỗi xóa sản phẩm: " + err.message);
    }
};