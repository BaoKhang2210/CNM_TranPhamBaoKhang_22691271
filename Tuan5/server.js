const express = require("express");
const { CreateTableCommand, ListTablesCommand } = require("@aws-sdk/client-dynamodb");
const { client, TABLE_NAME } = require("./models/productModel");
const productRoutes = require("./routes/productRoutes");
require('dotenv').config();

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Hàm tự động khởi tạo Table nếu chưa có
async function initDatabase() {
    try {
        const { TableNames } = await client.send(new ListTablesCommand({}));
        if (!TableNames.includes(TABLE_NAME)) {
            await client.send(new CreateTableCommand({
                TableName: TABLE_NAME,
                KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
                AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
                ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
            }));
            console.log("✅ Đã tạo bảng Products trên DynamoDB Local");
        }
    } catch (err) {
        console.error("❌ Lỗi DB:", err.message);
    }
}

app.use("/", productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    initDatabase();
    console.log(`🚀 Server chạy tại: http://localhost:${PORT}`);
    console.log(`📊 Quản lý DB tại: http://localhost:8001`);
});