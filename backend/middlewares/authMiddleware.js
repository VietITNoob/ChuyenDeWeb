const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. Middleware kiểm tra người dùng đã đăng nhập (Có Token hợp lệ)
const protect = async (req, res, next) => {
    let token;

    // Token thường được gửi kèm trong Header dưới dạng: "Bearer <token>"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Cắt chuỗi để lấy phần token thực sự
            token = req.headers.authorization.split(' ')[1];

            // Giải mã token để lấy ID của user
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Tìm user trong database và gắn vào req.user (bỏ qua field password)
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Cho phép đi tiếp đến Controller
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Không có quyền truy cập, token không hợp lệ hoặc đã hết hạn' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Không có quyền truy cập, không tìm thấy token' });
    }
};

// 2. Middleware kiểm tra quyền Admin
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Từ chối truy cập: Chỉ dành cho Admin' });
    }
};

// 3. Middleware kiểm tra quyền Người bán (Seller)
const seller = (req, res, next) => {
    if (req.user && (req.user.role === 'seller' || req.user.role === 'admin')) {
        // Admin cũng có thể làm những việc của Seller nếu cần
        next();
    } else {
        res.status(403).json({ message: 'Từ chối truy cập: Chỉ dành cho Người bán' });
    }
};

module.exports = { protect, admin, seller };