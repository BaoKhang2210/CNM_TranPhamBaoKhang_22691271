const getUsers = () => {
    // Trong thực tế, dữ liệu này sẽ được lấy từ Database
    return [
        { id: 1, name: 'Nguyễn Văn A' },
        { id: 2, name: 'Trần Thị B' },
        { id: 3, name: 'Lê Văn C' }
    ];
};

module.exports = { getUsers };