const userModel = require('../models/userModel');

const showUsers = (req, res) => {
    // Lấy dữ liệu từ Model
    const users = userModel.getUsers();
    // Truyền dữ liệu sang View để hiển thị
    res.render('index', { users });
};

module.exports = { showUsers };