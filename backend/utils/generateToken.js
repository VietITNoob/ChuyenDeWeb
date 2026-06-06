const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    // Tạo token dựa trên ID của user, secret key và thời gian hết hạn
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = generateToken;