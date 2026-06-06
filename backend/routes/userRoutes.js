const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const User = require('../models/User');

// @desc    Lấy thông tin profile của user đang đăng nhập
// @route   GET /api/users/profile
// @access  Private (Cần đăng nhập)
router.get('/profile', protect, async (req, res) => {
    // Nhờ middleware 'protect', req.user đã có sẵn thông tin
    const user = await User.findById(req.user._id);
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
});

// @desc    Lấy danh sách tất cả người dùng
// @route   GET /api/users
// @access  Private/Admin (Cần đăng nhập VÀ phải là Admin)
router.get('/', protect, admin, async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

module.exports = router;