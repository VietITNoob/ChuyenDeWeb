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

// @desc    Cập nhật thông tin profile (chỉ tên và email)
// @route   PUT /api/users/profile
// @access  Private (Cần đăng nhập)
router.put('/profile', protect, async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        // Kiểm tra xem email mới có trùng với email của user khác không
        if (req.body.email && req.body.email !== user.email) {
            const emailExists = await User.findOne({ email: req.body.email });
            if (emailExists) {
                return res.status(400).json({ message: 'Email đã tồn tại' });
            }
            user.email = req.body.email;
        }

        user.name = req.body.name || user.name;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
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