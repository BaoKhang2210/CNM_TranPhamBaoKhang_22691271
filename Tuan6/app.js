const express = require('express');
const app = express();
const userController = require('./controllers/userController');

// Thiết lập EJS làm View Engine
app.set('view engine', 'ejs');

// Định tuyến (Router)
app.get('/', userController.showUsers);

// Quan trọng: Sử dụng process.env.PORT để tương thích với AWS Elastic Beanstalk
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Ứng dụng đang chạy tại http://localhost:${PORT}`);
});